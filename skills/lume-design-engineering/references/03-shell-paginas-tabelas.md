# Shell, páginas e tabelas

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/03-shell-e-paginas.md`, `docs/guia/04-dados.md`, `docs/guia/05-telas-de-detalhe.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Espaçamento e ritmo

<!-- mapa: 8.8, 19.3 | regras 13 -->

- **Always** empilhe com `flex flex-col gap-*` (`gap-2`, `gap-4`, `gap-1.5`, `gap-1`, `gap-3` são os cinco mais usados) ou `grid gap-4`; margens só para ajuste fino (`mt-1`, `mt-2`, `mt-3`, `-mt-2`).
- **Always** respeite os gutters da página: `px-8` (32px) para texto, título, grids de cards e estados vazios; `px-6` (24px) para controles (Toolbar `pl-6 pr-6`, rodapé de paginação); `px-8.25` (33px) nas células de tabela e `pr-9` na última coluna.
- **Always** use a coluna da página `flex flex-col gap-4 py-6 px-0 pb-16` (apps/web/src/components/app/app-shell.tsx:389) e o bloco header + toolbar em `flex flex-col gap-4 mt-1`, com a tabela em `-mt-2`.
- **Never** use `space-y-*`/`space-x-*` nem valor arbitrário de espaçamento (`p-[13px]`) sem comentário de uma linha; `size-3.25`, `gap-1.75`, `h-13`, `px-8.25` são da escala contínua do Tailwind v4, não arbitrários.

Porquê: 32px alinha texto, 24px alinha controles (que, por terem superfície própria, parecem alinhados a 32px), e a tabela usa 33px para o texto da célula cair na coluna do título.

## Shell e sidebar

<!-- mapa: 7.2, 8.2, 8.3 | regras 13 -->

- **Always** use `Sidebar variant="inset"`, a única variante: `SIDEBAR_WIDTH = "14rem"` (`registry/base-vega/ui/sidebar.tsx:32`), canvas `bg-sidebar` sempre mais escuro que o inset `bg-background`, e o inset com `shadow-(--custom-shadow)` e `rounded-lg squircle:rounded-3xl corner-squircle` (`sidebar.tsx:312`), sem borda.
- **Always** contenha o scroll em três camadas: `SidebarProvider className="group/shell relative h-svh min-h-0 overflow-hidden"`, `SidebarInset className="min-h-0 overflow-hidden ... md:rounded-lg squircle:md:rounded-3xl"` e um viewport interno `min-h-0 flex-1 overflow-y-auto` com a coluna `flex flex-col gap-4 py-6 px-0 pb-16` dentro (apps/web/src/components/app/app-shell.tsx:306-389); o wrapper do inset reaplica `md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0` porque o inset não é irmão direto do `peer`.
- **Always** marque o item ativo só com fundo e ícone filled: `data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50`, botão `rounded-md squircle:rounded-xl corner-squircle p-2 ... [&_svg]:size-4.5` (`sidebar.tsx:480`), link por `render={<Link href prefetch />}`; sem `font-medium`.
- **Always** renderize um `SidebarTrigger` num header só mobile (`flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3 md:hidden`, `registry/base-vega/blocks/app-shell/app-shell.tsx:217`) abaixo de 768px, onde a sidebar vira `Sheet` de `18rem` (adição do lume, já validada no painel do lyx-pr-agent); `Cmd/Ctrl+B` continua alternando.
- **Never** use `variant="sidebar"` ou `"floating"`, `SidebarRail`, ou tema, projeto e período em provider dentro da página: contexto vive no shell (`HeaderActionsSlotProvider`, `RangeProvider`, `ThemeProvider`).

Porquê: no inset o conteúdo é um único cartão flutuando sobre o canvas, o que a sombra resolve; `sidebar` precisaria de `border-r` e `floating` criaria dois cartões; o Foglamp não tem gatilho no mobile e isso é bug, não regra.

## Páginas: header, stat cards, grids

<!-- mapa: 8.4, 8.5, 8.11, 8.12 | regras 14, 15 -->

- **Always** defina o header uma vez por rota e renderize a mesma peça no `loading.tsx` e na página: `PageHeader` é `flex flex-wrap items-end justify-between gap-4 px-8 h-8` com `h1 flex items-center gap-2 text-base font-medium tracking-tight`, ícone de seção `size-4.5 shrink-0` com o tile do nav, e slot de ações `flex items-center gap-2 translate-y-1 empty:hidden` (apps/web/src/components/app/page-parts.tsx:90-131); `h-8` porque o range picker é `h-8`.
- **Always** use `back={navItem(href)}` para detalhe: `h1` com `gap-1.5`, link `text-muted-foreground transition-colors hover:text-foreground` e separador `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; nunca o primitivo `Breadcrumb`.
- **Always** monte faixa de métricas com `StatCard size="sm"` em `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1`, ordem Volume, Saúde, Performance, Custo (custo por último); valor `CardTitle className="tracking-tight tabular-nums"`, rótulo `text-sm` com ícone `size-3.5 text-muted-foreground`, delta em `text-xs font-[470] tabular-nums` verde `text-emerald-600 dark:text-emerald-500` ou vermelho `text-red-500`.
- **Always** use pares de gráficos em `grid gap-4 lg:grid-cols-2 px-8`, `Card size="sm"` com legenda clicável no `CardHeader` e `CardContent className="mt-2"`; breakdowns em `grid gap-4 lg:grid-cols-2 xl:grid-cols-4 px-8`.
- **Never** monte a página inteira num `Suspense` com skeleton: o chrome (header, toolbar, cabeçalhos de coluna) pinta na hora e só o corpo espera.

Porquê: a troca fallback para página é pixel-idêntica quando os dois renderizam o mesmo `header.tsx`, e um range vazio precisa do range picker para escapar.

## Tabelas e filtros

<!-- mapa: 7.3, 8.7, 8.10, 9.2 | regras 4, 16 -->

- **Always** use o `Table` da registry com `className="table-fixed min-w-5xl" stickyHeader`, larguras explícitas no `TableHead` (`w-28`, `w-32`, `w-36`, `w-40`), header `h-13 [&_tr]:h-13` (`registry/base-vega/ui/table.tsx:100`), célula `py-2 px-8.25` com altura na primeira (`h-12` uma linha, `h-16` título + meta), última coluna `pr-9`.
- **Always** marque linha clicável com `TableRow interactive {...rowNav(router, href)}`: `tabIndex 0`, Enter e Espaço, `hover:bg-muted`, anel `ring-[1.5px] ring-inset ring-ring/50`, e a borda da linha e da anterior somem no hover (`table.tsx:170-176`); linha sem `interactive` não tem hover.
- **Always** alinhe número à direita com `align="right"` (injeta `text-right tabular-nums`), ordene com `SortableHead` (tri-state desc, asc, off; seta `size-3.5` só no hover, `-mr-5` à direita) e pagine com `PaginationFooter` (`border-t border-border/50 px-6 pt-4`, `pageSizes [25, 50, 100]`, setas `icon-sm`, sem números de página).
- **Always** guarde filtro, busca, ordenação e página na URL (`useUrlFilters`, item `data-table`) e envolva a tabela em `TooltipProvider delay={150}` (o provider nasce com `delay = 0`, `tooltip.tsx:10`, e sem provider o Base UI usa 600ms); toolbar `flex flex-wrap items-center gap-2 pl-6 pr-6` com `SearchInput` (`h-8 w-56 rounded-full squircle:rounded-full corner-round!`), `FilterSelect` (`min-w-36 ... corner-round! bg-card hover:bg-muted/50 ... active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`), `ToggleChip`, `ClearFiltersButton`; o `trailing` sobe para o slot do header quando não cabe.
- **Never** instale TanStack Table, AG Grid ou similar; ordenação e paginação são hooks pequenos sobre o primitivo (servidor ordena o que é paginado, cliente ordena lista completa).

Porquê: `table-fixed` com larguras no header é o que impede a troca skeleton para dados de mover colunas, e o hover como bloco contínuo (sem riscos atravessando) é a versão em tabela de "sombra no lugar de borda".

## Responsividade e camadas

<!-- mapa: 8.13, 15.2.7, 19.3 | regras 13 -->

- **Always** use só os breakpoints padrão do Tailwind v4 (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e três degraus no app: `md` para a sidebar fixa e grids de stats (`md:grid-cols-2`, `md:grid-cols-4`), `lg` para pares de cards (`lg:grid-cols-2`), `xl` para quatro colunas; `sm` só em Dialog (`sm:max-w-md`, `sm:flex-row` no footer) e marketing.
- **Always** meça em vez de usar media query quando a largura depende de um painel vizinho: `ResizeObserver` na Toolbar, `@container` com `@lg:` na timeline, `useIsMobile()` (768px) só para a sidebar.
- **Always** reserve `z-50` para portal e `fixed` (popups com `isolate z-50` no Positioner, Dialog, Sheet); dentro da página três degraus (`z-10`, `z-20`, `z-30`) relativos a um pai `relative isolate`, fundo decorativo em `-z-10`.
- **Never** crie `--breakpoint-*`, `--z-*` ou `2xl:`; o app é desktop-first e degrada (tabela `min-w-5xl` rola, cards empilham), o marketing é mobile-first.

Porquê: sem escala nomeada, a consistência vem de poucos valores repetidos; `isolate` garante que `-z-10` fique atrás dos irmãos mas nunca atrás do fundo da página.

## Telas de detalhe e drawers

<!-- mapa: 11.2, 10.4 | regras 4, 14 -->

- **Always** siga o esqueleto comum: `PageHeader back={navItem(href)}` com `titleLeading` (ícone da entidade) ou `titleTrailing` (id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` + `CopyButton`), linha de `ContextChip` em `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`, faixa de `StatCard size="sm"` em `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1`, cards de gráfico e a tabela.
- **Always** faça seção de painel com `px-5 py-5` separada da seguinte por `border-b border-border/40`, nunca na última ("a trailing border on the last section reads as a bug", apps/web/src/app/(app)/traces/[traceId]/trace-detail-client.tsx:2072); par rótulo e valor em `flex min-w-0 flex-col gap-1` com `text-xs text-muted-foreground` e `text-[13px] tabular-nums` num `grid grid-cols-2 gap-4`.
- **Always** expanda linha de tabela em gaveta com `TableRow interactive aria-expanded`, chevron `size-3.5 text-muted-foreground/50 transition-[rotate,color] duration-300 ease-out` (`rotate-90` aberto), linha aberta `border-b-transparent bg-neutral-100 dark:bg-card`, gaveta `TableCell colSpan` em `bg-neutral-100 px-8 pt-2 pb-8 dark:bg-card`, deep link `?id=` espelhado com `router.replace(..., { scroll: false })`.
- **Never** mostre o empty state de uma seção antes dos stats chegarem (um rollup lento piscaria o vazio), nem use `Drawer`/`Sheet` para o que é linha expansível.

Porquê: o detalhe é a lista mais um painel; manter a mesma gramática (chips, stats, tabela) faz a navegação lista para detalhe parecer um zoom e não uma tela nova.

## Do guia: 03. Shell, navegação e páginas de lista

### Camadas do shell

| Camada | Elemento | Classes exatas | Fonte |
|---|---|---|---|
| Canvas | `SidebarProvider` | `group/shell relative h-svh min-h-0 overflow-hidden` | app-shell.tsx:306 |
| Sidebar | `Sidebar variant="inset"` (a única variante) | container `fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear ... md:flex` + `p-2`; `--sidebar-width: 14rem`, `--sidebar-width-icon: 3rem`; abaixo de 768px vira `Sheet` com `18rem` | registry/base-vega/ui/sidebar.tsx:32-34,192-195,235-238 |
| Wrapper do inset | `div` | `flex min-h-0 min-w-0 flex-1 flex-col gap-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2` | app-shell.tsx:372 |
| Inset | `SidebarInset` (`<main>`) | base `relative shadow-(--custom-shadow) dark:shadow-(--custom-shadow) flex w-full flex-1 flex-col bg-background ...` + `min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl` | sidebar.tsx:310-312; app-shell.tsx:375-377 |
| Viewport de scroll | bloco interno | `min-h-0 flex-1 overflow-y-auto` | app-shell.tsx:388 |
| Coluna da página | `div` | `flex flex-col gap-4 py-6 px-0 pb-16` | app-shell.tsx:389 |

### Nav e tile de ícone

Receita do tile (nav.ts:38-45; no lume `navTile(color)` dentro de `app-shell`): `bg-{cor}-100 dark:bg-{cor}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{cor}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`: anel interno de 1px a 14% da cor mais sombra curta a 25% no light; no dark só a sombra neutra. Cores usadas: rose `244,63,94`, emerald `16,185,129`, orange `249,115,22`, sky `14,165,233`, fuchsia `217,70,239`, yellow `234,179,8`. Itens de conta sem tile: `text-muted-foreground/70`. A mesma receita tinge `span-type` e os chips de score (ver [04-dados](04-dados-e-cor.md)).

### Header de rota: o trio do Next

`page-header` (page-parts.tsx:58-133):

| Parte | Classes exatas |
|---|---|
| Raiz | `flex flex-wrap items-end justify-between gap-4 px-8 h-8` (`h-8` porque o `RangePicker` é `h-8`; com `h-7` empurrava o conteúdo ~4px) |
| `h1` normal / com `back` | `flex items-center gap-2 text-base font-medium tracking-tight` / `gap-1.5` no lugar de `gap-2` |
| Ícone de seção | `size-4.5 shrink-0` + `iconClassName` (o tile do nav); 18px, um degrau acima do `size-4` do FRONTEND.md original |
| Link do crumb | `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground`; separador `IconChevronRight` `size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]` |
| Título / descrição | `<span className="truncate">` / `<p className="text-sm text-muted-foreground">` |
| Slot de ações | `flex items-center gap-2 translate-y-1 empty:hidden`, sempre renderizado, `ref={slot?.setEl}` |

Ações fora do range picker: `Button variant="secondary"` com ícone e `strokeWidth={2.4}` ("Create key"); em listas com criação o botão vai para o `trailing` da `Toolbar` e só sobe ao header quando ela levanta. O `page-header` do lume exporta `PX = "px-4 md:px-8"` e recebe `back` pelo `link` (adição do lume).

### Range picker (`range-picker`)

| Peça | Classes exatas (range-picker.tsx) |
|---|---|
| `RangePresetButton` | `Button variant={active ? "secondary" : "outline"} aria-pressed` + `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50` (:37-65) |
| Trigger | `Button variant={compact ? "outline" : "secondary"}` + `w-fit justify-start transition-[color,box-shadow] bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted active:scale-100 font-normal gap-1.5`; `IconCalendarFilled` `ml-0.5 mb-px` em `text-foreground/95` ou `text-muted-foreground/50`; rótulo `grid overflow-hidden transition-[width,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` com `width` em px medido por `ResizeObserver` (`-ml-1.5` compacto); chevron `ml-auto size-3.5 text-muted-foreground/50 mt-px` (:145-176) |
| Popover | `PopoverContent align="end" sideOffset={10} className="flex-row w-auto gap-0 overflow-hidden p-0"`; coluna de presets `flex w-40 flex-col gap-1 p-3` com hairline `border-r-[0.5px] border-solid` (hex `#EFEFEF`/`#252525` no Foglamp; `border-border/50` no lume); cada preset `Button size="sm"` `secondary` ou `ghost` + `justify-start font-normal transition-transform rounded-sm squircle:rounded-xl corner-squircle active:scale-100` (raio concêntrico: 8px do popover menos 12px de padding) (:178-200) |
| Calendário | `p-1 pl-2 pt-2` > `Calendar mode="range" numberOfMonths={2} disabled={{ after: new Date() }} className="**:data-day:transition-none"`; dois cliques: o primeiro sempre começa um range novo, o segundo aplica `customRange` e fecha (:202-225) |

### Toolbar e filtros (`data-table`)

| Controle | Classes exatas e comportamento (data-table.tsx) |
|---|---|
| `Toolbar({ children, trailing?, className? })` | `flex flex-wrap items-center gap-2 pl-6 pr-6`; `trailing` em `motion.div` `ml-auto flex items-center gap-2` com `layoutId` e `transition={{ type: "spring", stiffness: 520, damping: 44 }}` (`TOOLBAR_SPRING` em `motion`); mede filhos + gaps contra a largura disponível e, se `need + 2 > avail`, portala o trailing para o slot do `PageHeader` (:285-381) |
| `SearchInput` | `InputGroup` em `h-8 w-56 rounded-full squircle:rounded-full corner-round! shadow-(--custom-outline-shadow) dark:shadow-(--custom-outline-shadow) dark:border-0 bg-card dark:bg-card hover:bg-muted/50 dark:hover:bg-muted`; `IconSearch size-3.5`; limpar `InputGroupButton size="icon-xs"` `rounded-full text-muted-foreground/60 hover:text-foreground` (:404-452). `corner-round!` porque a superelipse achataria a pílula; `dark:bg-card` porque a base do `InputGroup` tem `dark:bg-input/30` |
| `ToggleChip` | `Button variant={active ? "destructive" : "outline"} aria-pressed` + `font-normal transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted [&_svg:not([class*='text-'])]:text-muted-foreground/50` (:456-484) |
| `FilterSelect` | trigger `SelectTrigger size="sm"` com `buttonVariants({ variant: "outline" })` + `min-w-36 justify-between font-normal corner-round! bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`; conteúdo `w-auto min-w-44 max-w-80` `align="start" sideOffset={8}`; busca inline acima de `FILTER_SEARCH_THRESHOLD = 8` opções; `modal={false}` e hover troca o dropdown aberto (:486-697) |
| `ClearFiltersButton` | `AnimatePresence`, `initial={{ opacity: 0, scale: 0.98, x: -4 }}`, `transition={{ duration: 0.13, ease: "easeOut" }}`; `Button variant="outline"` `text-muted-foreground gap-1 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted` com `IconX` (:703-731) |
| `PaginationFooter` | `flex items-center justify-end gap-1 border-t border-border/50 px-6 pt-4 dark:border-border/40`; contagem `text-xs text-muted-foreground/50 tabular-nums`; barra `text-xs text-muted-foreground/20 mx-3`; "1 to 25" é um `SelectTrigger` despido (`h-auto data-[size=default]:h-auto gap-1.5 rounded-md squircle:rounded-md border-0 bg-transparent p-0 text-xs text-muted-foreground/50 tabular-nums shadow-none transition-[color,box-shadow] hover:text-foreground dark:border-0 dark:bg-transparent dark:shadow-none dark:hover:bg-transparent`) com `pageSizes = [25, 50, 100]`; chevrons `Button size="icon-sm"` `outline` ativo, `ghost` desabilitado; sem números de página; só renderiza com linhas (:737-820) |

### Ritmo vertical e gutters

| Onde | Valor |
|---|---|
| Coluna da página | `gap-4` entre blocos de primeiro nível, `py-6` em cima, `pb-16` embaixo, `px-0` |
| Header, grids de cards e empty states | `px-8` (32px): alinhamento "de texto" |
| Toolbar e footer de paginação | `pl-6 pr-6` / `px-6` (24px): alinhamento "de controle", que por ter superfície própria parece 32px |
| Células da tabela | `px-8.25` (33px) para o texto cair na coluna do título, última coluna `pr-9`, header `h-13`, célula `py-2` (registry/base-vega/ui/table.tsx:82,100,193,214) |
| Header para Toolbar | bloco `flex flex-col gap-4 mt-1` (20px até a Toolbar); Toolbar para tabela `flex flex-col -mt-2` (8px, para o footer encostar na última linha) |
| Empty state de lista / grids | `mt-2 px-8`; `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1` (stats), `grid gap-4 lg:grid-cols-2 px-8` (charts) |
| Cards | `py-6`, `size="sm"` `py-5` e `gap-2`; header e conteúdo `px-6`, `sm` `px-5` (registry/base-vega/ui/card.tsx:17,30,78) |

## Do guia: 04. Dados: tabela, números, chips e gráficos

### Densidade da tabela

| Item | Valor | Fonte |
|---|---|---|
| Header | `h-13 [&_tr]:h-13` (52px); sticky: `sticky top-0 z-10 bg-background [&_tr]:border-b-0 [&_th]:shadow-[inset_0_-1px_0_0] [&_th]:shadow-border/50 dark:[&_th]:shadow-border/40` | registry/base-vega/ui/table.tsx:100,107 |
| Célula | `align-middle whitespace-nowrap py-2 px-8.25` (33px laterais); header `text-left align-middle font-medium whitespace-nowrap px-8.25`; última coluna `[&_th:last-child]:pr-9 [&_td:last-child]:pr-9` no `table` | table.tsx:82,193,214 |
| Linha | `border-b border-border/50 dark:border-border/40`; `interactive` = `tabIndex 0`, `data-interactive:cursor-pointer data-interactive:hover:bg-muted`, ring `focus-visible:ring-[1.5px] ring-inset ring-ring/50`, Enter e Espaço disparam `click()`; no hover apaga a própria borda e a da linha anterior | table.tsx:149-176 |
| Linha de uma linha de texto | primeira `TableCell className="h-12"` (48px) | agents-client.tsx, workflows-client.tsx |
| Linha de duas linhas (título + meta) | `TableCell className="h-16"` (64px); título `truncate text-[14px]`; meta `mt-0.5 flex items-center gap-3 text-xs text-muted-foreground`, links `inline-flex min-w-0 shrink items-center gap-1 transition-colors hover:text-foreground`, ícone `size-3` | traces-client.tsx:731-867 |
| Layout | `<Table className="table-fixed min-w-5xl" stickyHeader>`; larguras no `TableHead`: `w-28` Spans, `w-30` Tokens, `w-32` Duration, `w-38` Cost, `w-36` When, `w-40` metadata | traces-client.tsx:645-699 |
| Contagem secundária | `text-right tabular-nums text-muted-foreground` | traces-client.tsx:894 |
| Erro inline | `flex shrink-0 items-center gap-0.75 font-sans text-sm text-red-600 dark:text-red-400` + `IconAlertTriangle size-3.5 fill-current/20` ("texto colorido, sem pílula"); aborto `text-amber-600 dark:text-amber-400` + `IconPlayerStopFilled size-3.5` | traces-client.tsx:752-767 |
| Valor ausente | `<span className="text-muted-foreground/50">{EMPTY}</span>` (Foglamp: `/40` com travessão) | traces-client.tsx:888 |

## Do guia: 05. Telas de detalhe: painel lateral, linha expansível, prosa, código e copy

### Esqueleto comum

| Bloco | Regra praticada |
|---|---|
| `loading.tsx` | só `<RouteHeader href="/agents" back title="Agent" withRange />`: o título real é parâmetro de rota, então o fallback mostra o crumb genérico até a página chegar; `LiveRangePicker` continua vivo porque o contexto está acima do boundary |
| Header breadcrumb (`page-header`) | `h1` `flex items-center gap-1.5 text-base font-medium tracking-tight`; link de volta `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground` com o ícone `size-4.5 shrink-0` + tile do nav; `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; título `<span className="truncate">`; `titleLeading` (ícone da entidade `size-4.5`), `titleTrailing` (`CopyButton` do id, ou o id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` quando difere do nome); `actions` = `RangeControl`. O primitivo `Breadcrumb` não é usado: o breadcrumb é o próprio `h1` |
| Entrada | `PageHeader` num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o `loading.tsx` repete; cards de gráfico recebem `className={cn(entrance && "page-fade-in")}` um a um |
| Chips de contexto (`context-chip`) | container `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`; `ContextChip` com `href` para a entidade dona (cliente, agente, workflow); placeholder enquanto carrega é `div` cru `h-8 w-32 animate-pulse rounded-full bg-muted` (`w-28`, `w-36`), nunca `Skeleton`: o `corner-squircle` do primitivo quadra o `rounded-full` |
| Stats | `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1` com `StatCard size="sm"`, custos em `formatCostFixed(n, 4)`; o empty "sem atividade" espera os stats carregarem para um rollup lento não piscar o vazio antes dos números |
| Gráficos | `section` `grid gap-4 lg:grid-cols-2 px-8`; `Card size="sm"`, chart `h-55 w-full`, `syncId` por página; empty no card `EmptyState icon={IconChartAreaFilled} title="Sem dados neste período"` |
| Empty state (`empty-state`) | `Empty className="border border-dashed"` + ícone `opacity-40` (registry/base-vega/components/empty-state.tsx:33-36), sempre num wrapper `px-8`; "sem atividade" e "tabela vazia" têm textos diferentes |

### Painel lateral e `Field`

| Peça | Valor exato | Fonte |
|---|---|---|
| Aside | `group/panel sticky top-4 shrink-0 self-start` com `style={{ width }}`; `PANEL_WIDTH = 420`, mínimo 340, máximo 720, salvo em `localStorage` (`"<app>:trace-panel-width"`, preferência de workspace) e aplicado num `useEffect` pós-mount para servidor e cliente renderizarem o mesmo markup | trace-detail-client.tsx:1645-1756 |
| Handle de resize | `div role="separator" aria-orientation="vertical"` `absolute inset-y-0 -left-3 z-10 w-3 cursor-col-resize touch-none` + `setPointerCapture`; arrastar para a esquerda alarga | :1791 |
| Borda acesa no drag | overlay `pointer-events-none absolute inset-0 z-10 rounded-lg squircle:rounded-3xl corner-squircle border-l border-border opacity-0 transition-opacity duration-200 group-has-[[data-trace-resize]:hover]/panel:opacity-100 group-has-[[data-trace-resize][data-resizing]]/panel:opacity-100` | Foglamp trace-detail-client.tsx:1799 |
| Card (`card`) | `Card` com `gap-0 py-0` e `max-h-[calc(100svh-14rem)]` (ou `max-h-[calc(100svh-6rem)]` quando a página já rola) | :1883 |
| Header | `CardHeader className="flex shrink-0 items-center gap-2 p-5 px-5 pb-1"`; `CardTitle` `flex min-w-0 flex-1 items-center gap-2` com `SpanTypeChip` + nome `truncate`; controles `flex shrink-0 items-center gap-1`: `Button size="xs" variant="ghost"` com o nome do destino ("Raw"/"Overview", nomeia para onde vai, não onde está), dois `size="icon-xs" variant="ghost"` com `IconChevronUp/Down size-4 text-current`, `CopyButton`; todos `text-muted-foreground/60 hover:text-foreground` | mapa 10.4.2 |
| Corpo | `CardContent className="flex min-h-0 flex-1 flex-col p-0"` > `Tabs className="flex min-h-0 flex-1 flex-col gap-0"` > `TabsContent className="flex min-h-0 flex-1 flex-col"` > `ScrollFade containerClassName="flex min-h-0 flex-1 flex-col" className="flex min-h-0 flex-1 flex-col gap-4 py-5"` (registry/base-vega/components/scroll-fade.tsx:19) | |
| Seção | `px-5 py-5` (`pb-5` na primeira, `pt-5` na última) + `border-b border-border/40`, nunca na última: `cn("px-5 py-5", temProxima && "border-b border-border/40")` ("uma borda sobrando na última seção lê como bug"); divisor edge-to-edge dentro de um pai com `px-5` sangra com `-mx-5 border-t border-border/40 px-5 pt-4` | :1954,2383 |
| `Field` | `div.flex min-w-0 flex-col gap-1` > label `text-xs text-muted-foreground` > valor `text-[13px] tabular-nums`; grid `grid grid-cols-2 gap-4`, `wide` = `col-span-2`, `separated` = `border-t border-border/40 pt-4`. É o mesmo par de `Meta` no drawer e dos stats do rail de sessão | :1592-1604 |
| Skeleton do valor | `span.flex h-5 items-center` + `Skeleton h-3` ("do tamanho da line box de um valor de 13px"); o skeleton da tela é "shaped like the loaded page": labels reais, só os valores em skeleton | :2971 |

### Linha expansível (drawer)

| Peça | Valor exato | Fonte |
|---|---|---|
| `Table` | `table-fixed [&_th:last-child]:pr-11 [&_td:last-child]:pr-11` + `stickyHeader`: o range picker está no header (`px-8`), não numa toolbar (`pr-6`), então a última coluna ganha 8px a mais que o `pr-9` do primitivo | mapa 11.2.6 |
| Linha | `TableRow interactive aria-expanded={isOpen} className={cn("group", isOpen && OPEN_ROW_CLASS, isFocused && FOCUSED_ROW_CLASS)}` | |
| `OPEN_ROW_CLASS` | `border-b-transparent bg-neutral-100 dark:bg-card`: no light página e card têm quase o mesmo branco, então `bg-card` sumiria | run-exchange.tsx:58 |
| `FOCUSED_ROW_CLASS` | `bg-primary/5 dark:bg-primary/10 data-interactive:hover:bg-primary/10 dark:data-interactive:hover:bg-primary/15` (linha vinda de deep link `?trace=`, com `scrollIntoView({ block: "center", behavior: "smooth" })`; o primeiro toggle manual limpa) | :62 |
| Primeira célula | `h-12 font-normal` > `flex items-center gap-2` com `ExpandChevron` + `span.truncate`; fallback de id em `font-mono text-xs text-muted-foreground` | |
| `ExpandChevron` | `IconChevronRight size-3.5 shrink-0 text-muted-foreground/50 transition-[rotate,color] duration-300 ease-out group-hover:text-muted-foreground`, aberto `rotate-90 text-muted-foreground` | :43-48 |
| `DrawerRow` | `TableRow className="hover:bg-transparent"` > `TableCell colSpan` `bg-neutral-100 px-8 pt-2 pb-8 dark:bg-card` (as páginas passam `pt-6`) | :68-82 |
| `DrawerColumns` | `flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8`; overview `flex shrink-0 flex-col gap-4 lg:w-88` (88 + gap de 2rem = 96, a largura da primeira coluna); conteúdo `min-w-0 flex-1` | :93-103 |
| `Meta` / `MetaEmpty` | `flex min-w-0 flex-col gap-1`, label `text-xs text-muted-foreground`, valor `min-w-0 text-[13px] tabular-nums`, grade `grid grid-cols-2 gap-4`; vazio = `EMPTY` em `text-muted-foreground/40` (Foglamp usa travessão) | :110-128 |
| Botões do drawer | `Button size="sm" variant="secondary" className={cn("w-fit", DRAWER_BUTTON_CLASS)}` + `IconArrowUpRight className="mt-px"`; `DRAWER_BUTTON_CLASS` = `bg-background shadow-(--custom-outline-shadow) hover:bg-muted hover:text-foreground [&_svg:not([class*='text-'])]:text-neutral-500 dark:bg-secondary dark:shadow-[var(--custom-shadow-secondary)] dark:hover:bg-muted-foreground/25 dark:hover:text-secondary-foreground dark:[&_svg:not([class*='text-'])]:text-neutral-300` | button-styles.ts:1 |
| Erros | na célula, texto colorido sem pílula (`text-red-600 dark:text-red-400` + `IconAlertTriangle size-3.5 fill-current/20`); `Badge variant="rose" className="font-sans"` só no overview do drawer e em cabeçalhos de turno | |
| Skeleton dentro do drawer | barras em `bg-muted-foreground/15`, porque o drawer já é `bg-neutral-100`, que é o `bg-muted` do `Skeleton` no light | :446-466 |
| Clamp | `Conversation clamp={320}` (`ClampedBody maxHeight` + botão com `DRAWER_BUTTON_CLASS`); 220 para "dez linhas de texto de 13px" | :219-255 |

### Code block (`code-block`)

- Shiki `createHighlighterCore` com `createJavaScriptRegexEngine()` (sem wasm), singleton lazy, temas `github-light` e `vesper` com `defaultColor: false` (registry/base-vega/components/code-block.tsx:38-53); só `typescript` e `json`; acima de `HIGHLIGHT_MAX_CHARS = 50_000` fica o `pre` cru (:34).
- O CSS que escolhe o tema vem no campo `css` do item e cai no `globals.css`: `.shiki { background-color: var(--shiki-light-bg) }`, `.shiki, .shiki span { color: var(--shiki-light) }`, `.dark .shiki { ... var(--shiki-dark-bg) }`, `.dark .shiki, .dark .shiki span { color: var(--shiki-dark) }`. Sem essas quatro regras o bloco renderiza sem cor (:23-29).
- Container `relative text-left text-xs [&_pre]:m-0 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted/50! [&_pre]:dark:bg-muted/20!  [&_pre]:p-5 [&_pre]:leading-relaxed [&_pre]:shadow-(--custom-shadow) corner-squircle` (o espaço duplo é do original) + `[&_pre]:pr-10` (espaço do copy) ou `[&_pre]:pt-5` com `actions`/`hideCopy` (:113-117). Fallback imediato `pre.bg-muted!.dark:bg-muted!.text-foreground` para nunca haver flash vazio (:125).
- Controles `absolute right-3 top-3 flex items-center gap-1`: `{actions}` + `Button size="icon-sm" variant="outline" className="text-muted-foreground hover:text-foreground dark:bg-input/20" aria-label="Copiar código"` com `CopyIcon` e `useCopied(2000)` (:130-141). Sem números de linha e sem soft wrap: o `pre` rola na horizontal.
- `useShikiHtml(code, lang)` (:61) é exportado para blocos de JSON em painéis: `[&_pre]:bg-transparent!` quando o container já tem fundo.

### Markdown (`markdown-components`)

O espaçamento vem do wrapper de prosa, por seletor arbitrário, não dos componentes:

| Onde | Classes |
|---|---|
| Bolha de assistente | `text-sm leading-relaxed [&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_pre]:my-2 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 *:last:mb-0 [&>*:first-child>*:first-child]:mt-0 [&>*:first-child>*:first-child>*:first-child]:mt-0` (session-detail-client.tsx:506) |
| `Prose` (system prompt no drawer) | `text-xs leading-relaxed wrap-anywhere` com headings rebaixados (`[&_h1]:text-[13px] [&_h1]:font-semibold`, h2 a h6 `text-xs`), `[&_code]:text-[11px]`, `[&_pre]:text-[11px] [&_pre]:whitespace-pre-wrap` (payload-view.tsx:71-73) |

### Copy (`use-copied`, `copy-icon`, `copy-button`)

- `useCopied(timeoutMs = 1500)` (registry/base-vega/hooks/use-copied.ts:13): `{ copied, markCopied, resetCopied }`; o timer é limpo no unmount e na re-cópia. 1500 ms no `CopyButton`; 2000 ms no `CodeBlock` e em botões de prompt.
- `CopyIcon` (registry/base-vega/components/copy-icon.tsx:28-52): `span.relative.inline-flex` > `AnimatePresence mode="popLayout" initial={false}` > `motion.span key={copied ? "check" : "copy"}` com `initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}`, `animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}`, `exit` igual ao `initial`, `transition={COPY_SPRING}` (`{ type: "spring", duration: 0.25, bounce: 0 }`, registry/base-vega/lib/motion.ts:41-45). `IconCopyFilled` vira `IconCircleCheckFilled` em `text-green-600 dark:text-green-400`; dentro de um `Button` default (fundo invertido) passe `checkClassName="text-green-400 dark:text-green-600"`. `popLayout` + `relative` põem o ícone que sai sobre o que entra em vez de empilhar por um frame.
- `CopyButton({ value, title, stopPropagation?, iconSize = "size-4" })` (registry/base-vega/components/copy-button.tsx:35-53): `button` nu, não o primitivo, `inline-flex shrink-0 items-center justify-center rounded p-1 text-muted-foreground/60 cursor-pointer transition-colors hover:text-foreground`; `title` obrigatório; `stopPropagation` dentro de linha clicável; nunca aninhe o botão num toggle, ponha como irmão; copie a string original, nunca o DOM animado.
