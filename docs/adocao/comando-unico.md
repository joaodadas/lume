# O comando único: adoção por agente

Origem: decisão de 04/11/2026 (ver [DECISOES](../DECISOES.md)). O modelo é o `onboard` da CLI do ElevenLabs: o comando não faz tudo sozinho, ele conduz o agente do dev uma etapa por vez e só libera a seguinte quando a anterior terminou. Antes dele, o lume chegava em pedaços (a base de uma vez, os componentes um a um e as regras só se o dev instalasse a skill), e dava para "ter o lume" só com as cores.

## O prompt

O dev cola isto no agente (Claude Code, Codex, Cursor), na raiz do projeto, novo ou existente:

```text
Aplique o lume neste projeto: rode `npx -y @joaodadas/lume@latest init` e siga exatamente o que ele responder, uma etapa por vez, até o `next` ser `pronto`.
```

<!-- skill:start -->
## Como o `init` conduz

- Cada chamada lê o projeto e responde um JSON: `etapa`, `next`, `say` (o que o agente diz ao usuário), `instruction` (o que o agente faz), `run` (os comandos, em ordem), `rules` (as regras da adoção, repetidas em toda resposta) e `details`.
- O estado vem do próprio projeto. Chamar de novo depois de cada passo devolve o passo seguinte, e chamar duas vezes não estraga nada: o init só grava o `lume.json` (o layout escolhido e, quando o usuário aceita subir, a versão nova), e o resto ele manda o agente rodar.
- A versão que vale é a do `lume.json`, no init e no check. Os comandos que o init devolve fixam essa versão (`npx -y @joaodadas/lume@<versao do lume.json> init`), então o projeto não sobe de versão sem querer.
- As etapas, em ordem:
  1. `ler`: confere Next ou Vite com Tailwind 4 e pergunta o layout (`sidebar`, `offcanvas` ou `topbar`). Só o layout é perguntado: o resto é da base.
  2. `atualizar` (só quando o pacote é mais novo que o `lume.json`): pergunta ao usuário se quer subir. Com `--atualizar=sim`, regrava o `lume.json` com a versão nova e manda reinstalar tudo do lume com `--overwrite` nela; sem isso, segue na versão do `lume.json`.
  3. `base`: o `shadcn init` do item `base` na versão do `lume.json`. Um `components.json` que não é do lume é apagado antes.
  4. `componentes`: todos os primitivos, os kits, o `login-form` e o `guia`, com `--overwrite`; no Next, o `link-next` por último.
  5. `skill`: a skill `lume-design-engineering`, que o agente lê antes de escrever qualquer tela.
  6. `migrar`: o agente reescreve as telas, guiado pelo `lume check`, até não sobrar violação.
  7. `pronto`: o agente roda typecheck, lint, testes e build, e mostra ao usuário. Commit e push só quando o usuário pedir.
- O `init` grava o `lume.json` na raiz: `{ "versao": "0.4.0", "layout": "sidebar" }`. Ele fixa a versão contra a qual o projeto é conferido e é o sinal de que o projeto adotou o lume. Item da registry instalado à parte, fora dos kits do init, entra em `itens` (`"itens": ["theme-switcher"]`) para a atualização reinstalar e o check conferir.
<!-- skill:end -->

## O `lume check`

`npx -y @joaodadas/lume@latest check` (ou `--json`) confere o projeto e sai com código 1 se houver violação. Não é AI: é um script determinístico, como o lint.

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

A comparação de `ui/editado` ignora comentários, a diretiva `"use client"`, o caminho dos imports locais (a CLI do shadcn reescreve pelos aliases, inclusive `#/` e `@app/`) e o que o formatador muda (aspas, `;` no fim, vírgula final e espaços), então só pega mudança de código. `lib/utils.ts` fica fora, porque recebe helpers do produto. Exceção de verdade: `lume:excecao motivo=<o porquê>` na linha (ou na de cima) para as regras de código, e `extras` no `lume.json` (`{ "extras": { "kanban": "bloco do produto sem par no lume" } }`) para componente do produto em `components/ui`.
<!-- skill:end -->

## No CI

O CI de quem adotou roda `npx -y @joaodadas/lume@^0 check` em toda PR. Na Lyx, o reusable `lyx-audit.yml` liga o passo sozinho quando o repo tem `lume.json` ou um `components.json` que aponta para a registry do lume, e repo sem lume não muda.

## Onde mora o código

`cli/` deste repo, publicado no npm como `@joaodadas/lume`. Os componentes continuam vindo da registry: o pacote só traz o `init` e o `check`, sem dependência nenhuma. A versão do pacote acompanha a tag da registry, e o `release` sobe as duas juntas.
