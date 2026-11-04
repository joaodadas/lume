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
- O estado vem do próprio projeto. Chamar de novo depois de cada passo devolve o passo seguinte, e chamar duas vezes não estraga nada.
- As etapas, em ordem:
  1. `ler`: confere Next ou Vite com Tailwind 4 e pergunta o layout (`sidebar`, `offcanvas` ou `topbar`). Só o layout é perguntado: o resto é da base.
  2. `base`: o `shadcn init` do item `base` na versão do comando. Um `components.json` que não é do lume é apagado antes.
  3. `componentes`: todos os primitivos, os kits, o `login-form` e o `guia`, com `--overwrite`; no Next, o `link-next` por último.
  4. `skill`: a skill `lume-design-engineering`, que o agente lê antes de escrever qualquer tela.
  5. `migrar`: o agente reescreve as telas, guiado pelo `lume check`, até não sobrar violação.
  6. `pronto`: o agente roda typecheck, lint, testes e build, e mostra ao usuário. Commit e push só quando o usuário pedir.
- O `init` grava o `lume.json` na raiz: `{ "versao": "0.4.0", "layout": "sidebar" }`. Ele fixa a versão contra a qual o projeto é conferido e é o sinal de que o projeto adotou o lume.
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
| `ui/editado` | arquivo da registry (`components/ui` e blocos) diferente da versão do `lume.json` |
| `ui/fora-da-registry` | componente que não é do lume dentro de `components/ui` |
| `ui/paralelo` | pasta com cópias de primitivos fora de `components/ui` |
| `codigo/*` | no código do app: import de Lucide, Radix ou `next/font`; `asChild`; `data-[state=...]`; `font-bold` e `font-semibold`; `text-2xl` ou maior; cinza `slate`, `gray`, `zinc` ou `stone`; `shadow-sm` a `shadow-2xl`; `space-x` e `space-y` |

A comparação de `ui/editado` ignora comentários, a diretiva `"use client"` e o caminho dos imports (a CLI do shadcn reescreve pelos aliases), então só pega mudança de código. Exceção de verdade: `lume:excecao motivo=<o porquê>` na linha (ou na de cima) para as regras de código, e `extras` no `lume.json` (`{ "extras": { "kanban": "bloco do produto sem par no lume" } }`) para componente do produto em `components/ui`.
<!-- skill:end -->

## No CI

O CI de quem adotou roda `npx -y @joaodadas/lume@^0 check` em toda PR. Na Lyx, o reusable `lyx-audit.yml` liga o passo sozinho quando o repo tem `lume.json` ou um `components.json` que aponta para a registry do lume, e repo sem lume não muda.

## Onde mora o código

`cli/` deste repo, publicado no npm como `@joaodadas/lume`. Os componentes continuam vindo da registry: o pacote só traz o `init` e o `check`, sem dependência nenhuma. A versão do pacote acompanha a tag da registry, e o `release` sobe as duas juntas.
