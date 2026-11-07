# @joao.dadas/lume

Adoção do [lume](https://github.com/joaodadas/lume) por agente. Cole no seu agente (Claude Code, Codex, Cursor), na raiz do projeto, novo ou existente:

```text
Aplique o lume neste projeto: rode `npx -y @joao.dadas/lume@latest init` e siga exatamente o que ele responder, uma etapa por vez, até o `next` ser `pronto`.
```

## Comandos

| Comando | O que faz |
|---|---|
| `lume init [--layout=sidebar\|offcanvas\|topbar] [--tema=claro\|escuro] [--substituir=sim\|nao] [--confirmar-troca=sim] [--atualizar=sim\|nao]` | Uma etapa por chamada, em JSON (`etapa`, `next`, `say`, `instruction`, `run`, `rules`, `details`): as perguntas de produto (layout, tema e, com interface própria, se pode substituir de uma vez), atualização (quando o pacote é mais novo que o `lume.json`), base (o init escreve o CSS global e lista os tokens que saíram, com o uso), todos os componentes (com aviso e pedido de commit antes do `--overwrite`), skill, migração (com um plano em ordem em `details.plano`) e pronto |
| `lume check [--path=<pasta>] [--json]` | Confere o projeto contra a registry da versão do `lume.json`; sai 1 se houver violação. `--path` restringe a pastas ou arquivos (separados por vírgula) |
| `lume prompt` | Imprime o texto para colar no agente |
| `lume <comando> --help` | As opções de cada comando |

Em projeto existente, o lume substitui a interface antiga de uma vez: sem pasta paralela, sem alias desviado e sem componente antigo com a aparência do lume. O `init` grava o `lume.json` (`versao` e `layout`), que é o sinal de adoção que o CI usa para rodar o `check`.

Os componentes vêm da registry do shadcn (`joaodadas/lume/<item>#vX.Y.Z`); este pacote traz só o `init` e o `check`, sem dependência. O check confere configuração, CSS, dependências, os arquivos da registry e o código do app: imports barrados, `asChild`, `data-[state]`, peso, título, cinza, sombra, `space-*`, import de componente antigo de `components/ui` (`codigo/import-antigo`), `confirm()`, `alert()` e `prompt()` do navegador (`codigo/dialogo-do-navegador`) e classe com cor que não existe mais (`codigo/token-orfao`). As regras de cada verificação estão em [docs/adocao/comando-unico.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/comando-unico.md).

Apache-2.0.
