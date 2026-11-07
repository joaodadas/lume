# O comando único: adoção por agente

Origem: decisão de 04/11/2026 (ver [DECISOES](../DECISOES.md)). O modelo é o `onboard` da CLI do ElevenLabs: o comando não faz tudo sozinho, ele conduz o agente do dev uma etapa por vez e só libera a seguinte quando a anterior terminou. Antes dele, o lume chegava em pedaços (a base de uma vez, os componentes um a um e as regras só se o dev instalasse a skill), e dava para "ter o lume" só com as cores.

## O prompt

O dev cola isto no agente (Claude Code, Codex, Cursor), na raiz do projeto, novo ou existente:

```text
Aplique o lume neste projeto: rode `npx -y @joao.dadas/lume@latest init` e siga exatamente o que ele responder, uma etapa por vez, até o `next` ser `pronto`.
```

<!-- skill:start -->
## Como o `init` conduz

- Cada chamada lê o projeto e responde um JSON: `etapa`, `next`, `say` (o que o agente diz ao usuário), `instruction` (o que o agente faz), `run` (os comandos, em ordem), `rules` (as regras da adoção, repetidas em toda resposta) e `details`.
- O estado vem do próprio projeto. Chamar de novo depois de cada passo devolve o passo seguinte, e chamar duas vezes não estraga nada: o init grava o `lume.json` (layout, tema e, quando o usuário aceita subir, a versão nova) e o CSS global da etapa `base`, e o resto ele manda o agente rodar.
- A versão que vale é a do `lume.json`, no init e no check. Os comandos que o init devolve fixam essa versão (`npx -y @joao.dadas/lume@<versao do lume.json> init`), então o projeto não sobe de versão sem querer.
- As etapas, em ordem:
  1. `ler`: confere Next ou Vite com Tailwind 4 e faz as perguntas de produto que faltam: o layout (`--layout=sidebar|offcanvas|topbar`), o tema padrão (`--tema=claro|escuro`) e, num projeto com interface própria, se pode substituir de uma vez (`--substituir=sim|nao`). Com `nao`, o init para (`next: bloqueado`) e explica que o lume não entra pela metade. O resto é da base.
  2. `atualizar` (só quando o pacote é mais novo que o `lume.json`): pergunta ao usuário se quer subir. Com `--atualizar=sim`, regrava o `lume.json` com a versão nova e manda reinstalar tudo do lume com `--overwrite` nela; sem isso, segue na versão do `lume.json`.
  3. `base`: o próprio init escreve o CSS global só com o que o item `base` da versão traz, na ordem em que o `shadcn init` escreve num projeto novo, e guarda o antigo em `<css>.antes-do-lume`. Em `details.cssGlobal` vêm os tokens e as classes próprias que saíram, com quantos usos e arquivos cada um tem no código: as telas não migradas perdem essas cores até serem reescritas. Depois o agente roda o `shadcn init` do item `base` (o `components.json` que não é do lume é apagado antes), que mantém esse CSS.
  4. `componentes`: todos os primitivos, os kits, o `login-form` e o `guia`, com `--overwrite`; no Next, o `link-next` por último. Quando o `components/ui` já tem componentes com nome do lume e outro conteúdo, o init pergunta antes (`next: perguntar`), com os números: quantos arquivos o `--overwrite` troca, quantos componentes antigos ficam e dependem deles, quantos arquivos do app importam um ou outro, e que o app não compila até a migração terminar. Pede um commit antes e segue com `--confirmar-troca=sim`.
  5. `skill`: a skill `lume-design-engineering`, que o agente lê antes de escrever qualquer tela.
  6. `migrar`: o agente reescreve o projeto pelo plano de `details.plano`, um grupo por vez: a configuração, o que o layout raiz e os layouts de rota importam (direta ou indiretamente) e tem violação, para o app voltar a abrir, depois tela por tela (uma pasta de rota de `app/` por grupo, com os componentes que só ela usa), o resto e, por último, a limpeza (componentes antigos de `components/ui` e dependências barradas). Cada grupo traz a contagem e o seu `lume check --path=...`; a cada grupo o agente roda esse check e o typecheck do projeto.
  7. `pronto`: o agente apaga o `<css>.antes-do-lume`, roda typecheck, lint, testes e build, e mostra ao usuário. Commit e push só quando o usuário pedir.
- O `init` grava o `lume.json` na raiz: `{ "versao": "0.4.1", "layout": "sidebar", "tema": "claro" }`. Ele fixa a versão contra a qual o projeto é conferido e é o sinal de que o projeto adotou o lume; o tema é o `defaultTheme` do `ThemeProvider`. Item da registry instalado à parte, fora dos kits do init, entra em `itens` (`"itens": ["theme-switcher"]`) para a atualização reinstalar e o check conferir.
<!-- skill:end -->

## O `lume check`

`npx -y @joao.dadas/lume@latest check` (ou `--json`) confere o projeto e sai com código 1 se houver violação. `--path=<pasta>` (ou uma lista separada por vírgula, de pastas e arquivos) mostra só as violações daquele escopo, e `--help` mostra as opções. Não é AI: é um script determinístico, como o lint.

<!-- skill:start -->
| Regra | O que barra |
|---|---|
| `config/lume-json` | falta o `lume.json`, ou versão e layout inválidos |
| `config/components-json` | `components.json` que não é o do lume (style, ícones, tsx) |
| `config/alias` | alias desviado: o lume mora em `components/ui`, `components` e `lib/utils` |
| `css/base` | CSS global sem a base do lume |
| `css/fonte` | `font-feature-settings`, outro pacote de fonte ou `--font-sans` redefinida |
| `deps/proibida` | `lucide-react`, Radix, outra biblioteca de componentes ou de fonte no `package.json` |
| `ui/editado` | arquivo da registry diferente da versão do `lume.json`: todo `components/ui` e, dos blocos, hooks e `lib/{format,motion,range}.ts`, só os que o lume instalou (os kits do init, `login-form`, `guia`, `link-next` e os `itens` do `lume.json`) |
| `ui/fora-da-registry` | componente que não é do lume dentro de `components/ui` |
| `ui/paralelo` | pasta com cópias de primitivos fora de `components/ui` |
| `codigo/*` | no código do app (a pasta do `@/*` do tsconfig): import das mesmas bibliotecas barradas no `package.json` ou de `next/font`; `asChild`; `data-[state=...]`; `font-bold` e `font-semibold`; `text-2xl` ou maior; cinza `slate`, `gray`, `zinc` ou `stone`; `shadow` e `shadow-xs` a `shadow-2xl`; `space-x` e `space-y` |
| `codigo/import-antigo` | import de `@/components/ui/<x>` (ou relativo até lá) em que `x` não é item do lume nem está em `extras`, um por linha de import: é o que para de compilar quando o componente antigo sai |
| `codigo/dialogo-do-navegador` | `confirm(`, `alert(` e `prompt(` do navegador, chamados direto ou por `window.`; função de mesmo nome declarada no arquivo não conta |
| `codigo/token-orfao` | classe `bg-`, `text-`, `border-`, `ring-`, `fill-` ou `stroke-` com uma cor que não é da paleta do Tailwind nem um `--color-*` do CSS global (ou de um CSS que ele importa), como `bg-success` depois que o token saiu: sem o token a classe não gera CSS e a cor some sem erro. Com `@config` no CSS a regra não roda |

A comparação de `ui/editado` ignora comentários, a diretiva `"use client"`, o caminho dos imports locais (a CLI do shadcn reescreve pelos aliases, inclusive `#/` e `@app/`) e o que o formatador muda (aspas, `;` no fim, vírgula final e espaços), então só pega mudança de código. `lib/utils.ts` fica fora, porque recebe helpers do produto. Exceção de verdade: `lume:excecao motivo=<o porquê>` na linha (ou na de cima) para as regras de código, e `extras` no `lume.json` (`{ "extras": { "kanban": "bloco do produto sem par no lume" } }`) para componente do produto em `components/ui`.
<!-- skill:end -->

## No CI

O CI de quem adotou roda `npx -y @joao.dadas/lume@^0 check` em toda PR. Na Lyx, o reusable `lyx-audit.yml` liga o passo sozinho quando o repo tem `lume.json` ou um `components.json` que aponta para a registry do lume, e repo sem lume não muda.

## Onde mora o código

`cli/` deste repo, publicado no npm como `@joao.dadas/lume`. Os componentes continuam vindo da registry: o pacote só traz o `init` e o `check`, sem dependência nenhuma. A versão do pacote acompanha a tag da registry, e o `release` sobe as duas juntas.
