# 11. Receita: do zero a um app com a cara do Foglamp

Origem: mapa cap. 21. Os 11 passos do Foglamp reescritos como "instale o item X e confira Y" com os comandos do lume. A ordem segue a dependência real: tokens antes de primitivos, primitivos antes do shell, shell antes das páginas, e só então dados, movimento, marketing e regras para agentes. Todo comando usa a tag; troque `v0.1.0` pela release que o projeto fixou. Alias opcional em `components.json`: `"registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }` (então `npx shadcn@latest add @lume/button`).

## Passo 0: decisões já tomadas (não reabra sem issue)
<!-- skill:start -->
| Decisão | Escolha no lume | Confira |
|---|---|---|
| Primitivos | Base UI (`@base-ui/react`): composição por `render`, estados `data-open`/`data-closed`, nunca `asChild` | `grep -r asChild src` devolve zero |
| Style e ícones | shadcn `base-vega`, `baseColor: neutral`, `iconLibrary: tabler`, `menuAccent: subtle`, Tailwind v4 sem `tailwind.config` | `components.json` depois do init |
| Fontes | Inter Variable e Geist Mono via Fontsource (item `base`); Host Grotesk só com `font-display`; `cv11`/`ss01` opt-in | `document.fonts` lista Inter Variable e Geist Mono Variable; `font-mono` computa Geist Mono |
| Tema | dark como inicial com `enableSystem`; `theme-provider` (next-themes) ou `theme-provider-csp` | `<html class="dark">` no primeiro load sem preferência salva |
| Movimento | `motion/react` permitido com o vocabulário de `lib/motion.ts`; CSS nos primitivos | nenhuma curva literal fora de `lib/motion.ts` e dos charts |
| Formulários | TanStack Form ou React Hook Form, desde que o campo seja o `Input`/`Field` do DS | `login-form` é presentacional |
<!-- skill:end -->

## Passo 1: a base (tokens, utils, fontes)

Instale: `npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y`. Sem `-d`: com `-d` a CLI ignora o `extends: none` do base e instala o style padrão por cima. Confira em `app/globals.css` (ou `src/app/globals.css`): `:root` e `.dark` com os 17 `--custom-shadow-*`; `@theme inline` com `--font-mono`, `--font-heading` e a escala `--radius-sm` a `--radius-4xl`; `@plugin "@toolwind/corner-shape"`; `@custom-variant squircle`; `@import "@fontsource-variable/inter/opsz.css"` e `geist-mono`; `@layer base` com `html` em `bg-background`; nenhum `--sidebar-primary` nem `--custom-shadow-slate`; `.dark` declarada uma vez. `lib/utils.ts` é `clsx` + `tailwind-merge`. Se o init tiver injetado `Inter` do `next/font/google` no `layout.tsx`, apague a linha.

## Passo 2: tema, toasts e entrada de página

Instale: `npx shadcn@latest add joaodadas/lume/theme-provider#v0.1.0 joaodadas/lume/sonner#v0.1.0 joaodadas/lume/use-entrance-once#v0.1.0` (`theme-provider-csp` no lugar do `theme-provider` com CSP estrita; instala `public/theme.js`). Confira: `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>` envolvendo um único `<Toaster />`; `QueryCache.onError` com `toast.error(error.message, { action: { label: "retry", onClick: query.invalidate } })` junto do `QueryClient` (e `MutationCache.onError`, adição do lume); `.page-fade-in` presente no CSS (o item instala pelo campo `css`).

## Passo 3: os primitivos

Instale: `npx shadcn@latest add joaodadas/lume/kit-formulario#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0`, ou item a item: `button`, `badge`, `card`, `input`, `input-group`, `field`, `label`, `select`, `textarea`, `checkbox`, `radio-group`, `switch`, `dialog`, `alert-dialog`, `popover`, `tooltip`, `dropdown-menu`, `tabs`, `skeleton`, `spinner`, `loader`, `empty`, `kbd`, `avatar`, `separator`. Confira o DNA (detalhe em [02-primitivos](./02-primitivos.md)):
<!-- skill:start -->
| Primitivo | Confira |
|---|---|
| `button`; `badge` | `rounded-full`, `h-8`, `active:scale-[0.97]`, `focus-visible:ring-[1.5px]`, ícone `size-3.5`, `has-[>svg:first-child]:pl-2.5`; variants `default bg-neutral-800 dark:bg-neutral-100`, `outline` com `shadow-(--custom-outline-shadow)`, `ghost-destructive`; badge `rounded-full capitalize`, `md h-5 text-xs`, 14 variants `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] dark:bg-{c}-500/15 dark:text-{c}-300` |
| `input`, `textarea`, `input-group`, `select`, `kbd`; `card` | `rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50`, `placeholder:text-muted-foreground/50`, `transition-[color,box-shadow]`; card `shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6`, `size="sm"` com `py-5 gap-2 px-5` |
| `dialog`, `alert-dialog`; `popover`, `tooltip`, `dropdown-menu` | backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, popup `rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6`, `zoom-in-[96%]` / `zoom-out-[99%]`; `Positioner isolate z-50` > `Popup origin-(--transform-origin) duration-100 data-open:animate-in ...`, tooltip não invertido, `TooltipProvider delay={150}` em volta de tabelas |
| `tabs`; `skeleton`, `empty`, `spinner`, `loader`, `separator` | lista `rounded-md squircle:rounded-2xl corner-squircle` + `bg-muted dark:bg-muted/50`, ativo `data-active:bg-background data-active:text-foreground data-active:shadow-(--custom-shadow) dark:data-active:bg-input/50`; `animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted`; `border-dashed border`; `IconLoader size-4 animate-spin role="status"`; `animate-shimmer`; `bg-border/70` |
<!-- skill:end -->
Os 15 primitivos que o app do Foglamp nunca usou (`button-group`, `toggle`, `toggle-group`, `slider`, `input-otp`, `command`, `context-menu`, `menubar`, `navigation-menu`, `breadcrumb`, `carousel`, `resizable`, `aspect-ratio`, `item`, `drawer`, mais o `chart` do shadcn) existem como `tier: extra`: instale só com motivo.

## Passo 4: o shell

Instale: `npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0` (`sidebar`, `app-shell`, `page-header`, `stat-card`, `stat-grid`, `empty-state`, `theme-provider`, `theme-switcher`, `link`); em Next, acrescente `joaodadas/lume/link-next#v0.1.0` (mesmo target, `next/link`). Confira: `SidebarProvider` em `group/shell relative h-svh min-h-0 overflow-hidden`; `Sidebar variant="inset"` com `--sidebar-width: 14rem`; inset com `shadow-(--custom-shadow)` e `md:rounded-lg squircle:md:rounded-3xl`, sem borda; scroll em três camadas (`overflow-hidden` > `overflow-y-auto` > `flex flex-col gap-4 py-6 px-0 pb-16`); `SidebarTrigger` no header mobile (adição do lume); `NavIcon` com crossfade outline/filled em `transition-opacity duration-100 ease-in-out`; a sidebar sem `hsl(var(--sidebar-border))` (ver [03-shell-e-paginas](./03-shell-e-paginas.md)).

## Passo 5: a gramática das páginas

Instale: `npx shadcn@latest add joaodadas/lume/kit-tabela#v0.1.0 joaodadas/lume/range-picker#v0.1.0 joaodadas/lume/header-slot#v0.1.0`. `kit-tabela` traz `table`, `data-table` (Toolbar, FilterSelect, SearchInput, ToggleChip, ClearFiltersButton, SortableHead, PaginationFooter, `useUrlFilters`), `table-skeletons`, `scroll-fade`, `format` e os hooks (`use-delayed-loading`, `use-debounced-value`). Em Next, monte o trio `header.tsx` + `loading.tsx` + `page.tsx` por rota (copie `route-header.tsx` do Foglamp; vira item na v0.2). Confira: `PageHeader` em `px-8 h-8`; Toolbar `pl-6 pr-6` e o `trailing` subindo ao header com `TOOLBAR_SPRING`; células `px-8.25`, header `h-13`, `table-fixed`; skeleton só depois de 700 ms (`useDelayedLoading`); filtros na URL por `replaceState`; `placeholderData: (prev) => prev` em toda lista; `TableRow interactive` com `tabIndex 0` e Enter/Espaço.

## Passo 6: dados e cor com significado

Instale: `npx shadcn@latest add joaodadas/lume/kit-dados#v0.1.0 joaodadas/lume/kit-graficos#v0.1.0`. Dados: `format` (Intl pt-BR, função por função), `span-type`, `context-chip`, `pill-meter`, `card-sparkline`, `number-ticker`, `copy-icon`, `copy-button`, `code-block`, `notice`. Gráficos: `evilcharts` (o fork, não o `chart.tsx` do shadcn) + `area-chart`, `bar-chart`, `line-chart`, `donut-chart`, `trend-charts`. Confira: valor nulo renderiza `sem dado` em `text-muted-foreground/50`, nunca `$0` nem travessão; `ChartConfig.colors { light, dark }` com `--chart-1..5` cinzas e `var(--destructive)` para erro; `isUpdating` com `opacity-50 delay-150 duration-300`; `span-type` em neutral (não slate); tile colorido pela receita `bg-{c}-100 dark:bg-{c}-950 ... shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`; cor por hash djb2 sobre 16 tons `*-500` para avatares (ver [04-dados](./04-dados.md)).

## Passo 7: movimento

Instale: `npx shadcn@latest add joaodadas/lume/motion#v0.1.0 joaodadas/lume/use-copied#v0.1.0` (`copy-icon`, `theme-switcher`, `number-ticker` e `data-table` já dependem de `motion`). Confira: nenhuma curva literal fora de `lib/motion.ts` (`EASE`, `ENTRANCE_EASE`, `REVEAL_EASE`, `MORPH`, `TOOLBAR_SPRING`, `COPY_SPRING`); pílula segmentada com `layoutId` único (`useId()`) e rótulo `relative z-10`; `AutoHeight` com primeira medida sem tween; `useReduce()` em toda receita; loops longos em keyframes CSS. Detalhe em [09-movimento](./09-movimento.md).

## Passo 8: tela de detalhe (e waterfall, se houver traces)

Sem item na v0.1: siga [05-telas-de-detalhe](./05-telas-de-detalhe.md) com `context-chip`, `section`, `stat-card` e `data-table`. Confira: breadcrumb no header, chips de contexto, stats, seções `px-5 py-5` separadas por `border-b border-border/40` (nunca na última), painel `aside sticky top-4` com largura persistida. Waterfall: copie `trace-timeline.tsx` do Foglamp (grid `grid-cols-[9.5rem_minmax(0,1fr)_3.25rem] @lg:grid-cols-[15rem_minmax(0,1fr)_6.5rem]`, `TIMELINE_REVEAL_SECONDS = 1.2`, teclado `j/k/Enter`).

## Passo 9: marketing (opcional)

Instale: `npx shadcn@latest add joaodadas/lume/font-display#v0.1.0 joaodadas/lume/section#v0.1.0 joaodadas/lume/border-beam-card#v0.1.0 joaodadas/lume/rolling-text#v0.1.0`. Confira: container `mx-auto w-full max-w-7xl px-5 sm:px-8`; títulos `font-display font-[450] tracking-tight text-balance`; hairlines `border-border/50` a `/70` só aqui; `BorderBeam` só em card com `corner-round!` e raio igual ao `borderRadius` do beam; figuras animadas uma vez com `useInView({ once: true, amount: 0.35 })`. Capítulo [12-marketing](./12-marketing.md) é o último e opcional.

## Passo 10: guia e skill

Instale: `npx shadcn@latest add joaodadas/lume/guia#v0.1.0` e `npx skills add joaodadas/lume --skill lume-design-engineering`. `guia` instala `docs/lume/FRONTEND.md` (aponte o `AGENTS.md` do projeto para ele); a skill vai para `.agents/skills/lume-design-engineering` com link em `.claude/skills` e `skills-lock.json`. Instale junto `gustavo-fior/craft`, `web-design-guidelines` de `vercel-labs/agent-skills` e `emilkowalski/skills` (lista e ordem em [referencias](../referencias.md)). Confira: `npx skills update` não altera nada; nenhum arquivo instalado contém `@/registry/`.

## Passo 11: regras para agentes (mapa 21.12)
<!-- skill:start -->
- **Always** escreva as regras no formato Always / Never e com a regra praticada: `motion/react` com o vocabulário do passo 7; borda aceita como linha de tabela, divisor atenuado e hairline de marketing; `defaultTheme="dark"`; Inter via Fontsource (o Foglamp usa `next/font/local`); `IconLoader`; hex permitido quando a cor é dado (marca, hash, categoria), com comentário; `Intl` para números e datas curtas; comentário de uma linha em todo valor arbitrário.
- **Always** vendorize skills com `npx skills add` e mantenha `skills-lock.json` commitado (o Foglamp vendoriza `next-best-practices`, `shadcn`, `turborepo`, `hono`, `better-auth-best-practices`, `codebase-scan` e `next-cache-components` em `.agents/skills`).
- **Always** afine botão, badge e chip no playground `/botoes` (`app/botoes/page.tsx`, tecla `T` alterna o tema; no Foglamp é `/buttons`) antes de abrir PR, fora do grupo autenticado, e reporte revisão em tabela Before / After / Regra citando `arquivo:linha`.
- **Never** instale biblioteca de componentes, ícones, tabela (TanStack Table), estado global (Zustand, Redux, Jotai) ou CSS file por componente; estado compartilhado é React context, estado de lista é a URL, o resto é `useState`.
- Fora do escopo visual (vão para o `AGENTS.md` do projeto, não para o `FRONTEND.md`): env com `@t3-oss/env-nextjs` declarada em três lugares, tRPC com `queryOptions`/`mutationOptions` e invalidação por `queryKey()`, `params`/`searchParams` como Promise resolvidos no server.
<!-- skill:end -->

## O que não copiar (mapa 21.13) e o que o lume já corrigiu
<!-- skill:start -->
| Do Foglamp | Estado no lume |
|---|---|
| `hsl(var(--sidebar-border))` e `hsl(var(--sidebar-accent))` em sombra (CSS inválido com oklch) | corrigido: `shadow-[0_0_0_1px_var(--sidebar-border)]` (`registry/base-vega/ui/sidebar.tsx:487`) |
| `--custom-shadow-slate` e `--sidebar-primary*` sem uso; `--font-mono` nunca mapeada | removidos do `globals.css`; `--font-mono` aponta para Geist Mono Variable (`styles/globals.css:228`) |
| Hex `#EBEBEB`/`#1E1E1E`/`#2A2A2A` no footer e caption da tabela; `#B8B8B8`/`#5B5B5B` em ícone de busca; `#EFEFEF`/`#252525` em hairline | corrigido: `border-t border-border/50 dark:border-border/40` (`ui/table.tsx:130,232`), `text-muted-foreground/50` e `border-border/50` (`data-table`, `range-picker`) |
| `slate` no `span-type` e `rgba(100,116,139)` nas sombras inset | corrigido: neutral e `rgba(115,115,115)` (`components/span-type.tsx`) |
| Ausência de `SidebarTrigger` no mobile; curvas e springs duplicados em 10 arquivos | corrigido: header `md:hidden` com o trigger no `app-shell`; `lib/motion.ts` (os charts mantêm cópia local) |
| `@number-flow/react`, `ogl` órfãos; `cn` do npm; código morto (`prefetch.ts`, `user-menu.tsx`, `CardsSkeleton`, `Stat`, `pageWindow`, `BrazilFlag`, `HeroGrain`, keyframes `poster-*`) | não entram: `number-ticker` à mão, `clsx` + `tailwind-merge`; nada copiado |
| `Kbd` dentro de tooltip (feito para o tooltip invertido), `light:border-overlay` (variante inexistente), `squircle:rounded-[60]` (sem unidade, Foglamp figures-traces.tsx), cookie `sidebar_state` que ninguém lê | não copiados |
| Tooltip sem `duration-100` (anima em 150 ms); `transition-all hover:duration-150` no Button | pendente: verbatim na v0.1; mantido verbatim (é o look), não replicar em componente novo |
<!-- skill:end -->

## Checklist de verificação (mapa 21.14)
<!-- skill:start -->
- [ ] Dois temas, sempre: `defaultTheme="dark"` com `enableSystem`; cada superfície conferida em light e dark (botão com sombra nos dois, campo com hairline no dark).
- [ ] Duas larguras: 1440 e 390; a sidebar tem gatilho abaixo de 768 px.
- [ ] `prefers-reduced-motion` ligado: nada fica escondido esperando `onAnimationComplete`; charts em `animationType "none"`.
- [ ] Teclado: linhas com `tabIndex 0` e Enter/Espaço, `SortableHead` operável, `Cmd/Ctrl+B` na sidebar, `Escape` fecha painéis.
- [ ] Loading: nenhum skeleton antes de 700 ms, nenhuma troca skeleton/dados que mova coluna (`table-fixed`), header do `loading.tsx` idêntico ao da página.
- [ ] Fontes: `document.fonts` lista Inter Variable 100 a 900 e Geist Mono Variable (Host Grotesk só com `font-display`); `font-mono` computa Geist Mono.
- [ ] Erro decidido: query que falha vira toast com retry; "não existe" é `EmptyState` tracejado; `error.tsx` mínimo com `EmptyState` + `Button variant="outline"` (adição do lume); tela inteira de erro só fora do shell.
- [ ] Breakpoints e camadas: só os padrões do Tailwind (`md` sidebar e stats, `lg` pares de cards, `xl` quatro colunas, `sm` só em dialog e marketing); `z-50` só portal e `fixed`; 10/20/30 dentro de `relative isolate`; `-z-10` para fundo decorativo.
- [ ] Repo: nenhum `lucide`, `asChild`, `hsl(var(`, hex em classe fora de dado, travessão; `bun run check`, `bun run typecheck` e `bun run lint` verdes; `skills/` sem diff depois de `bun run skill:build`.
<!-- skill:end -->
