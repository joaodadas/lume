# Changelog

Todas as mudanças relevantes do lume ficam aqui. O formato segue o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem
o [SemVer](https://semver.org/lang/pt-BR/): patch é correção visual, minor é item
ou prop nova, major é token removido ou prop quebrada. Cada versão tem uma tag
`vX.Y.Z`; o consumidor fixa a tag no comando (`npx shadcn@latest add
joaodadas/lume/<item>#vX.Y.Z`) e atualiza com `--diff` para ver e `--overwrite`
para aplicar. Quando um item muda de API, a seção traz "Como migrar".

## [Não lançado]

### Próximo (fora da v0.1.0)

- Capítulo de marketing do guia.
- Bloco `ai-chat` (do Foggy) e o HUD.
- `route-header` (trio header, loading e page) como item `nextOnly`.
- `number-flow`, `model-chip` e logos de marcas.
- Migração efetiva dos fronts da Lyx (trabalho da camada `lyx-ds`, com o guia de adoção).

## [0.1.1] - 2026-10-16

### Corrigido

- A pasta `ui/` do Evil Charts virou `core/`: a CLI do shadcn reescrevia o import de `evilcharts/ui/tooltip` para o alias `ui` do consumidor e o `line-chart` quebrava o build.
- O alias `@lume` e o site passam a usar `https://lume-ashmont.vercel.app` (`lume.vercel.app` pertence a outro projeto).
- Proteção de deploy da Vercel desligada no projeto: a registry precisa ser pública.

## [0.1.0] - 2026-10-16

### Adicionado

- Tokens em `registry/base-vega/styles/globals.css` (item `base`, `registry:base` com `extends: "none"`): neutros em oklch, 16 `--custom-shadow-*` mais `--custom-outline-shadow` por tema, raios, `@custom-variant squircle`, plugin `@toolwind/corner-shape`, fontes Inter e Geist Mono via Fontsource e `--font-mono` mapeada.
- 56 primitivos do Foglamp sobre `@base-ui/react`, cópia verbatim com cabeçalho de atribuição: 41 core (button, badge, card, input, textarea, label, field, input-group, native-select, select, combobox, checkbox, radio-group, switch, toggle, toggle-group, dialog, alert-dialog, sheet, popover, tooltip, hover-card, dropdown-menu, tabs, accordion, collapsible, table, pagination, avatar, separator, scroll-area, skeleton, spinner, loader, sonner, alert, empty, kbd, progress, calendar, sidebar) e 15 extra, publicados verbatim e sem vitrine (aspect-ratio, breadcrumb, button-group, carousel, chart, command, context-menu, direction, drawer, input-otp, item, menubar, navigation-menu, resizable, slider).
- Lib e hooks: `utils` (`cn`), `format` (Intl pt-BR, `America/Sao_Paulo`, `formatMoney` BRL e USD), `motion` (`EASE`, springs), `range`, `use-mobile`, `use-delayed-loading`, `use-entrance-once`, `use-debounced-value`, `use-copied`.
- Blocos: `link` e `link-next` (indireção de navegação; blocos ficam puros e servem em Vite), `header-slot`, `page-header`, `stat-card`, `stat-grid`, `card-sparkline`, `pill-meter`, `scroll-fade`, `empty-state`, `table-skeletons`, `notice`, `section`, `app-shell` (com `nav-icon` e `nav`), `data-table` (com `url-filters` sobre `history.replaceState`), `range-picker`, `context-chip`, `span-type`, `copy-icon`, `copy-button`, `code-block` (shiki, tema duplo), `markdown-components`, `theme-provider`, `theme-provider-csp` (com `public/theme.js`), `theme-switcher`, `login-form` (presentacional, validação com zod).
- Gráficos: `evilcharts` (fork vendorizado, MIT), `area-chart`, `bar-chart`, `line-chart`, `donut-chart`, `trend-charts`.
- Extras: `number-ticker`, `rolling-text` (slot-text), `border-beam-card` (border-beam), `font-display` (Host Grotesk via Fontsource).
- Kits (`registry:block` só com `registryDependencies`): `kit-shell`, `kit-tabela`, `kit-formulario`, `kit-feedback`, `kit-dados`, `kit-graficos`.
- Guia: `FRONTEND.md` (regras Always e Never), `docs/guia`, `docs/conceitos` (craft, reescrito em pt-BR), `docs/referencias.md`, `docs/adocao` (Next novo, Vite, migração 52W, camada Lyx) e o item `guia`, que instala tudo em `docs/lume/`.
- Skill `lume-design-engineering` (`skills/lume-design-engineering`), gerada do `FRONTEND.md` e do guia, instalável com `npx skills add joaodadas/lume --skill lume-design-engineering`.
- Site de vitrine em https://lume-ashmont.vercel.app, que também serve a registry em `/r/<item>.json` (alias `@lume`).
- Tooling: `scripts/check.ts` (12 verificações), `scripts/release.ts`, `scripts/sync-upstream.ts`, CI em `.github/workflows/check.yml`.

### Mudado

Correções em relação ao Foglamp, aplicadas pelo `sync-upstream` e registradas no cabeçalho de cada arquivo:

- `sidebar.tsx`: `hsl(var(--sidebar-border))` e `hsl(var(--sidebar-accent))` viraram `var(--sidebar-border)` e `var(--sidebar-accent)` (os tokens são oklch; `hsl(var())` é CSS inválido).
- `table.tsx`: os hex `#EBEBEB`, `#1E1E1E` e `#2A2A2A` do footer e da caption viraram `border-border/50 dark:border-border/40`; comentário com hex removido.
- `globals.css`: `--font-mono` mapeada para Geist Mono no `@theme inline`; `--sidebar-primary` e `--sidebar-primary-foreground` removidos (sem uso); `--custom-shadow-slate` removido (sem uso).
- Imports reescritos de `@foglamp/ui/*` para `@/registry/base-vega/*`.

### Upstream

- Foglamp `2bc3bb5` (2026-10-12).
