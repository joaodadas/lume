# A Lyx sobre o lume

Origem: decisão de 04/11/2026 (ver [DECISOES](../DECISOES.md)). Revê o plano de 15/10/2026 de uma camada privada `Lyx-Engenharia/lyx-ds` (tema, logo, login e shell da Lyx numa registry à parte), que nunca foi criada.

<!-- skill:start -->
- A Lyx usa o lume como ele vem: o `base` com o tema clássico (as cores do Foglamp), sem tema próprio e sem camada privada de registry. Não existe `theme-lyx`, e o teal da 52W não volta.
- O layout do shell é escolha de cada front: `layout="sidebar"` (trilho de ícones ou `collapsible="offcanvas"`) ou `layout="topbar"`.
- Front novo ou existente adota pelo comando único de [comando-unico](./comando-unico.md). Projeto existente substitui a interface antiga de uma vez ([projeto-existente](./projeto-existente.md)).
- O que é só da Lyx (logo, login com Better Auth, link para o Hub, seletor de sistema) fica no próprio front, em `components/app`, composto sobre os blocos do lume (`AppShell`, `login-form`, `ContextSwitcher`). Vira item compartilhado só quando estiver repetido em vários fronts.
- O `LyxLogo` entra em `currentColor`, na cor do texto, sem tile colorido nem sombra teal.
- Conta: "Voltar ao Hub" (mantém o SSO) e "Sair de todos os sistemas" (signOut) são dois itens separados do `userMenu`.
- O CI dos fronts da Lyx (o reusable `lyx-audit.yml`) roda o `lume check` em todo repo que adotou o lume.
<!-- skill:end -->

## `components.json` de um front Lyx (Next 16 com `src/`)

O `init` escreve este arquivo; não precisa montar à mão.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "tabler",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }
}
```

O `@lume` do `components.json` aponta para a última release publicada. A versão que vale para a conferência é a do `lume.json`, e o `init` instala sempre pela tag (`joaodadas/lume/<item>#vX.Y.Z`).
