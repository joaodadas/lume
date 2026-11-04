# @joaodadas/lume

Adoção do [lume](https://github.com/joaodadas/lume) por agente. Cole no seu agente (Claude Code, Codex, Cursor), na raiz do projeto, novo ou existente:

```text
Aplique o lume neste projeto: rode `npx -y @joaodadas/lume@latest init` e siga exatamente o que ele responder, uma etapa por vez, até o `next` ser `pronto`.
```

## Comandos

| Comando | O que faz |
|---|---|
| `lume init [--layout=sidebar\|offcanvas\|topbar]` | Uma etapa por chamada, em JSON (`etapa`, `next`, `say`, `instruction`, `run`, `rules`, `details`): layout, base, todos os componentes, skill, migração e pronto |
| `lume check [--json]` | Confere o projeto contra a registry da versão do `lume.json`; sai 1 se houver violação |
| `lume prompt` | Imprime o texto para colar no agente |

Em projeto existente, o lume substitui a interface antiga de uma vez: sem pasta paralela, sem alias desviado e sem componente antigo com a aparência do lume. O `init` grava o `lume.json` (`versao` e `layout`), que é o sinal de adoção que o CI usa para rodar o `check`.

Os componentes vêm da registry do shadcn (`joaodadas/lume/<item>#vX.Y.Z`); este pacote traz só o `init` e o `check`, sem dependência. As regras de cada verificação estão em [docs/adocao/comando-unico.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/comando-unico.md).

Apache-2.0.
