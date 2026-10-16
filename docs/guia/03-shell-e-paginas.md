# 03. Shell, navegação e páginas de lista

Origem: mapa cap. 8. Cobre o shell inset, a nav com tile colorido, os providers, o trio header/loading/page do Next, a gramática de `page-parts`, o range picker, a toolbar de filtros, ritmo, loading, erro, navegação por linha e breakpoints. Itens: `kit-shell` (`sidebar`, `app-shell`, `page-header`, `stat-card`, `stat-grid`, `empty-state`, `theme-provider`, `theme-switcher`, `link`), `kit-tabela` (`table`, `data-table`, `table-skeletons`, `scroll-fade`, `format`, hooks) e `range-picker`. Instale com `npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0` e `npx shadcn@latest add joaodadas/lume/kit-tabela#v0.1.0`; em Next, troque `link` por `link-next`. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/components/app/...`).

## Camadas do shell

<!-- skill:start -->
| Camada | Elemento | Classes exatas | Fonte |
|---|---|---|---|
| Canvas | `SidebarProvider` | `group/shell relative h-svh min-h-0 overflow-hidden` | app-shell.tsx:306 |
| Sidebar | `Sidebar variant="inset"` (a única variante) | container `fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear ... md:flex` + `p-2`; `--sidebar-width: 14rem`, `--sidebar-width-icon: 3rem`; abaixo de 768px vira `Sheet` com `18rem` | registry/base-vega/ui/sidebar.tsx:32-34,192-195,235-238 |
| Wrapper do inset | `div` | `flex min-h-0 min-w-0 flex-1 flex-col gap-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2` | app-shell.tsx:372 |
| Inset | `SidebarInset` (`<main>`) | base `relative shadow-(--custom-shadow) dark:shadow-(--custom-shadow) flex w-full flex-1 flex-col bg-background ...` + `min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl` | sidebar.tsx:310-312; app-shell.tsx:375-377 |
| Viewport de scroll | bloco interno | `min-h-0 flex-1 overflow-y-auto` | app-shell.tsx:388 |
| Coluna da página | `div` | `flex flex-col gap-4 py-6 px-0 pb-16` | app-shell.tsx:389 |
<!-- skill:end -->

- O canvas é sempre um pouco mais escuro que o inset: `--sidebar` `oklch(0.975 0 0)` contra `--background` `oklch(0.99 0 0)` no light, `oklch(0.145 0 0)` contra `oklch(0.17 0 0)` no dark (registry/base-vega/styles/globals.css:23,47,133,156). O inset flutua sobre ele com `--custom-shadow`, sem borda.
- Scroll em três camadas: `overflow-hidden` no inset, `overflow-y-auto` no viewport e a coluna flex num filho ("o container de scroll nunca tenta encaixar o conteúdo por flex", app-shell.tsx:385-387). A sidebar não contém scroll; `SidebarContent` é `no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto`.
- O wrapper extra é quem aplica a margem de 8px do canvas; por isso o `md:peer-data-[variant=inset]:rounded-lg` do primitivo fica inerte e o shell repõe `md:rounded-lg squircle:md:rounded-3xl` no inset.
- Mobile: o Foglamp não renderiza `SidebarTrigger` (só Cmd/Ctrl+B abre o `Sheet`). O `app-shell` do lume acrescenta um header `flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3 md:hidden` (app-shell.tsx:217) com `SidebarTrigger` e o nome da página (adição do lume, já validada no painel do lyx-pr-agent).

## Nav e tile de ícone

`NavItem = { href, label, icon (outline, inativo), activeIcon (filled, ativo), iconClassName? }` (nav.ts:25-36). `navItem(href)` procura em `[...nav, ...account]` e alimenta o breadcrumb (nav.ts:115-117). `isActive`: `/settings` só casa exato; o resto por igualdade ou prefixo `${href}/` (app-shell.tsx:208-211). Links com `render={<Link href={item.href} prefetch />}`, nunca `asChild`. Item ativo: `data-active:bg-sidebar-accent/70` e `dark:data-active:bg-sidebar-accent/50` (sidebar.tsx:480).

`NavIcon` (app-shell.tsx:213-255) empilha outline e filled na mesma célula de grid: wrapper `grid size-4.5 place-items-center [&_svg]:size-full!` + o tile via `className`; cada SVG `[grid-area:1/1] transition-opacity duration-100 ease-in-out` com `opacity-0`/`opacity-100`. O `!` vence o `[&_svg]:size-4.5` que o `SidebarMenuButton` força; o tile fica no wrapper para não apagar e acender na troca.

<!-- skill:start -->
Receita do tile (nav.ts:38-45; no lume `navTile(color)` dentro de `app-shell`): `bg-{cor}-100 dark:bg-{cor}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{cor}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`: anel interno de 1px a 14% da cor mais sombra curta a 25% no light; no dark só a sombra neutra. Cores usadas: rose `244,63,94`, emerald `16,185,129`, orange `249,115,22`, sky `14,165,233`, fuchsia `217,70,239`, yellow `234,179,8`. Itens de conta sem tile: `text-muted-foreground/70`. A mesma receita tinge `span-type` e os chips de score (ver [04-dados](./04-dados.md)).
<!-- skill:end -->

## Providers

| Provider | Item do lume | Regra praticada |
|---|---|---|
| `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` | `theme-provider` (registry/base-vega/components/theme-provider.tsx) ou `theme-provider-csp` | Dark por padrão (providers.tsx:15); o FRONTEND.md original dizia `system` |
| `HeaderActionsSlotProvider` | `header-slot` | Guarda `{ el, setEl }`: o `PageHeader` registra a div de ações e a `Toolbar` portala os controles para lá quando não cabem (header-slot.tsx:13-41) |
| `RangeProvider` | `range-picker` (`range-context`) | `localStorage` com `storageKey` configurável no formato `{ key, from, to }`; default `24h`; presets re-resolvidos para "agora" no load, `custom` restaura datas exatas (range-context.tsx:19-56) |
| `QueryClientProvider` + um único `<Toaster />` | `sonner` | `QueryCache.onError` dispara `toast.error(error.message, { action: { label: "retry", onClick: query.invalidate } })` (utils/trpc.ts:20-31, não em providers.tsx) |

Contextos usam `<Ctx value={...}>` e `use(Ctx)` (React 19). `ProjectProvider`, `PostHogProvider`, `LayoutReserveProvider` (reserva do Foggy), `DevBar` e HUD ficam fora do lume.

## Header de rota: o trio do Next

Cada rota de lista é um trio: `header.tsx` (um `RouteHeader` configurado), `loading.tsx` (só o header) e `page.tsx` (`Suspense fallback={<XHeader />}` quando o client lê `useSearchParams`, senão o client direto). O header é renderizado "por AMBOS o loading.tsx e o client" para a troca fallback para página ser pixel-idêntica (route-header.tsx:21-26). `RouteHeader({ href, title, back?, noIcon?, withRange?, actions? })` resolve `navItem(href)`; `withRange` prepende `LiveRangePicker`, vivo durante o suspense porque o contexto está acima do boundary (route-header.tsx:10-19). Fica fora da v0.1 como item (`nextOnly`): copie route-header.tsx. Detalhes não têm header.tsx: o `loading.tsx` chama `RouteHeader href="/traces" back title="Trace"` direto, porque o título real é parâmetro de rota.

<!-- skill:start -->
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
<!-- skill:end -->

## page-parts: a gramática das páginas

| Bloco | Item | Valores exatos |
|---|---|---|
| `StatCard` | `stat-card` | `Card size={size}` (+ `h-full cursor-pointer` com `href`, link externo `group/stat block min-w-0`); `CardHeader className="gap-1.5"` > `flex items-center justify-between gap-2`; esquerda `flex min-w-0 items-center gap-1.75` com ícone `size-3.5 shrink-0 text-muted-foreground` e label `truncate text-sm text-foreground` (span, não `CardDescription`); direita `flex shrink-0 items-center gap-1.5` com `DeltaBadge` + `CardTitle className="tracking-tight tabular-nums"`; chevron `mt-px size-3.5 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 group-hover/stat:translate-x-0 group-hover/stat:opacity-100`; slot do chart `mt-auto pt-1.5 -mb-6 group-data-[size=sm]/card:-mb-5`; ordem canônica Volume, Health, Performance, Cost (page-parts.tsx:183-325) |
| `DeltaBadge` | dentro de `stat-card` | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px`, bom `text-emerald-600 dark:text-emerald-500`, ruim `text-red-500 dark:text-red-500` (`deltaInverted` para custo, erro, latência); seta `IconArrowUpRight`/`IconArrowDownRight` `size-3.75 stroke-[1.6]`; flat `~0%` em `text-xs font-medium tabular-nums text-muted-foreground mt-px` (page-parts.tsx:327-352) |
| `CardSparkline` | `card-sparkline` | SVG `viewBox 0 0 100 32`, `block h-8 w-full overflow-visible`, `PAD = 3`, gradiente `currentColor` 0.4 a 0.1, linha `strokeWidth 1.2` `strokeOpacity 0.5`; `dashedLast` vira `strokeDasharray="2.5 2"`; abaixo de 2 pontos cai no placeholder (curva fixa, traço 0.1) |
| `PillMeter` | `pill-meter` | wrapper `px-6 pt-1.5 pb-5 group-data-[size=sm]/card:px-5`; linha `flex h-3.5 items-stretch gap-0.75`; 32 cápsulas `flex-1 rounded-full` em `bg-current` ou `bg-muted-foreground/10`; fração positiva acende ao menos 1 (page-parts.tsx:501-533) |
| `ScrollFade` | `scroll-fade` | viewport `overflow-y-auto no-scrollbar`; fades `pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b to-transparent transition-opacity duration-150` (+ `from-card`, ou `from-popover` em dialog) e `bottom-0 bg-linear-to-t` a `opacity-75` (page-parts.tsx:542-604) |
| `EmptyState` | `empty-state` | `Empty className="border border-dashed"` + `EmptyMedia variant="icon"` com ícone `opacity-40`; bases em registry/base-vega/ui/empty.tsx:12,36,65,78 (page-parts.tsx:687-716) |
| `TableRowsSkeleton` | `table-skeletons` | uma `TableRow` por linha, célula `rowHeight` (`h-12`, `h-16` para duas linhas), blobs `h-4 {w}`, ícone `size-4 shrink-0 rounded-md`, `sub` reproduz a linha meta (`h-5` + `gap-1` + `mt-0.5` + `h-4`); exige `table-fixed` (page-parts.tsx:738-788) |
| `StatGrid` | `stat-grid` (adição do lume) | `section` `@container px-4 md:px-8` > `grid gap-4` com `@lg:grid-cols-2 @min-[62rem]:grid-cols-4` (ou `@2xl:grid-cols-3`); cada `StatCard` em `row-span-3 grid grid-cols-1 grid-rows-subgrid gap-y-1.5` para rótulo, número e rodapé alinharem entre vizinhos (lyx-pr-agent/painel/src/app/partes.tsx:88-130) |

## Range picker (`range-picker`)

Presets (range.ts:26-75; no lume os labels vêm em pt-BR com `date-fns/locale/ptBR`): `1h`, `24h` (default e fallback de key desconhecida), `3d`, `7d`, `30d`, `90d`, `today`, `month`, `lastMonth`. `QUICK_PRESETS = ["24h", "3d", "7d"]` viram chips ao lado do picker; com um chip ativo o picker colapsa para o ícone (`compact`), "o rótulo só repetiria o chip".

<!-- skill:start -->
| Peça | Classes exatas (range-picker.tsx) |
|---|---|
| `RangePresetButton` | `Button variant={active ? "secondary" : "outline"} aria-pressed` + `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50` (:37-65) |
| Trigger | `Button variant={compact ? "outline" : "secondary"}` + `w-fit justify-start transition-[color,box-shadow] bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted active:scale-100 font-normal gap-1.5`; `IconCalendarFilled` `ml-0.5 mb-px` em `text-foreground/95` ou `text-muted-foreground/50`; rótulo `grid overflow-hidden transition-[width,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` com `width` em px medido por `ResizeObserver` (`-ml-1.5` compacto); chevron `ml-auto size-3.5 text-muted-foreground/50 mt-px` (:145-176) |
| Popover | `PopoverContent align="end" sideOffset={10} className="flex-row w-auto gap-0 overflow-hidden p-0"`; coluna de presets `flex w-40 flex-col gap-1 p-3` com hairline `border-r-[0.5px] border-solid` (hex `#EFEFEF`/`#252525` no Foglamp; `border-border/50` no lume); cada preset `Button size="sm"` `secondary` ou `ghost` + `justify-start font-normal transition-transform rounded-sm squircle:rounded-xl corner-squircle active:scale-100` (raio concêntrico: 8px do popover menos 12px de padding) (:178-200) |
| Calendário | `p-1 pl-2 pt-2` > `Calendar mode="range" numberOfMonths={2} disabled={{ after: new Date() }} className="**:data-day:transition-none"`; dois cliques: o primeiro sempre começa um range novo, o segundo aplica `customRange` e fecha (:202-225) |
<!-- skill:end -->

`transition-[color,box-shadow]` tira `background-color` do `transition-all` do Button: o hover estala na hora, de propósito; `active:scale-100` cancela o `active:scale-[0.97]`. A largura do rótulo é tweenada em px porque o trigger fecha um grupo alinhado à direita e `width` não anima a partir de `auto`.

## Toolbar e filtros (`data-table`)

<!-- skill:start -->
| Controle | Classes exatas e comportamento (data-table.tsx) |
|---|---|
| `Toolbar({ children, trailing?, className? })` | `flex flex-wrap items-center gap-2 pl-6 pr-6`; `trailing` em `motion.div` `ml-auto flex items-center gap-2` com `layoutId` e `transition={{ type: "spring", stiffness: 520, damping: 44 }}` (`TOOLBAR_SPRING` em `motion`); mede filhos + gaps contra a largura disponível e, se `need + 2 > avail`, portala o trailing para o slot do `PageHeader` (:285-381) |
| `SearchInput` | `InputGroup` em `h-8 w-56 rounded-full squircle:rounded-full corner-round! shadow-(--custom-outline-shadow) dark:shadow-(--custom-outline-shadow) dark:border-0 bg-card dark:bg-card hover:bg-muted/50 dark:hover:bg-muted`; `IconSearch size-3.5`; limpar `InputGroupButton size="icon-xs"` `rounded-full text-muted-foreground/60 hover:text-foreground` (:404-452). `corner-round!` porque a superelipse achataria a pílula; `dark:bg-card` porque a base do `InputGroup` tem `dark:bg-input/30` |
| `ToggleChip` | `Button variant={active ? "destructive" : "outline"} aria-pressed` + `font-normal transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted [&_svg:not([class*='text-'])]:text-muted-foreground/50` (:456-484) |
| `FilterSelect` | trigger `SelectTrigger size="sm"` com `buttonVariants({ variant: "outline" })` + `min-w-36 justify-between font-normal corner-round! bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`; conteúdo `w-auto min-w-44 max-w-80` `align="start" sideOffset={8}`; busca inline acima de `FILTER_SEARCH_THRESHOLD = 8` opções; `modal={false}` e hover troca o dropdown aberto (:486-697) |
| `ClearFiltersButton` | `AnimatePresence`, `initial={{ opacity: 0, scale: 0.98, x: -4 }}`, `transition={{ duration: 0.13, ease: "easeOut" }}`; `Button variant="outline"` `text-muted-foreground gap-1 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted` com `IconX` (:703-731) |
| `PaginationFooter` | `flex items-center justify-end gap-1 border-t border-border/50 px-6 pt-4 dark:border-border/40`; contagem `text-xs text-muted-foreground/50 tabular-nums`; barra `text-xs text-muted-foreground/20 mx-3`; "1 to 25" é um `SelectTrigger` despido (`h-auto data-[size=default]:h-auto gap-1.5 rounded-md squircle:rounded-md border-0 bg-transparent p-0 text-xs text-muted-foreground/50 tabular-nums shadow-none transition-[color,box-shadow] hover:text-foreground dark:border-0 dark:bg-transparent dark:shadow-none dark:hover:bg-transparent`) com `pageSizes = [25, 50, 100]`; chevrons `Button size="icon-sm"` `outline` ativo, `ghost` desabilitado; sem números de página; só renderiza com linhas (:737-820) |
<!-- skill:end -->

Ícones dos triggers: o Foglamp usa `text-[#B8B8B8] dark:text-[#5B5B5B]` ("opacidade em ícone lê mais suja que em texto"); o lume troca por `text-muted-foreground/50`. `useUrlFilters(defaults)` guarda filtro, busca, ordenação e página na URL, apaga chaves no default e remove `page` em todo patch que não a define (:66-116); no lume roda sobre `window.location` + `history.replaceState` + `useSyncExternalStore`, sem `next/navigation`.

## Ritmo vertical e gutters

<!-- skill:start -->
| Onde | Valor |
|---|---|
| Coluna da página | `gap-4` entre blocos de primeiro nível, `py-6` em cima, `pb-16` embaixo, `px-0` |
| Header, grids de cards e empty states | `px-8` (32px): alinhamento "de texto" |
| Toolbar e footer de paginação | `pl-6 pr-6` / `px-6` (24px): alinhamento "de controle", que por ter superfície própria parece 32px |
| Células da tabela | `px-8.25` (33px) para o texto cair na coluna do título, última coluna `pr-9`, header `h-13`, célula `py-2` (registry/base-vega/ui/table.tsx:82,100,193,214) |
| Header para Toolbar | bloco `flex flex-col gap-4 mt-1` (20px até a Toolbar); Toolbar para tabela `flex flex-col -mt-2` (8px, para o footer encostar na última linha) |
| Empty state de lista / grids | `mt-2 px-8`; `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1` (stats), `grid gap-4 lg:grid-cols-2 px-8` (charts) |
| Cards | `py-6`, `size="sm"` `py-5` e `gap-2`; header e conteúdo `px-6`, `sm` `px-5` (registry/base-vega/ui/card.tsx:17,30,78) |
<!-- skill:end -->

## Loading e erro

<!-- skill:start -->
- `useDelayedLoading(loading, 700)` (`use-delayed-loading`): skeleton só após 700 ms contínuos; antes disso renderize `null`, nunca o empty state (hooks.ts:13-24). Só o `TableBody` espera; toolbar e cabeçalhos pintam na hora, mesmo com resultado vazio ("um range vazio precisa do range picker para escapar").
- `useEntranceOnce()` (`use-entrance-once`): flag de módulo; só a primeira página após hard load ganha `.page-fade-in { animation: page-fade-in 75ms ease-out }`, só opacidade, `none` em `prefers-reduced-motion` (index.css:66-81). O `PageHeader` fica num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o loading.tsx repete.
- `useSkeletonShown(showing)`: latch; quem pinta primeiro ganha o fade, a troca skeleton para dado é instantânea (`entrance && !skeletonShown && "page-fade-in"`).
- `useQuery` com `placeholderData: (prev) => prev` em toda lista: a página atual fica visível enquanto a próxima carrega; mudar range não regride para skeleton.
- Erro de dados é toast com retry (`QueryCache.onError`); "não existe" é `EmptyState` tracejado ("Trace not found", "No turns in this session"); nenhum client lê `isError`. O Foglamp não tem `error.tsx`; o lume adiciona um `error.tsx` mínimo com `EmptyState` + `Button variant="outline"` "Tentar de novo" (adição do lume).
<!-- skill:end -->

## Navegação entre linhas e teclado

`rowNav(router, href)` devolve `{ onClick: router.push, onMouseEnter: router.prefetch, onFocus: router.prefetch }`: uma linha não é `<Link>` e sem prefetch o clique pagava o round trip inteiro (row-nav.ts:6-18; no Vite o prefetch é no-op). `TableRow interactive` tem `tabIndex 0`, Enter e Espaço disparam `click()`, e no hover apaga a própria `border-b` e a da linha anterior (`data-interactive:hover:border-transparent has-[+tr[data-interactive]:not([aria-expanded=true]):hover]:border-transparent`, registry/base-vega/ui/table.tsx:169-176) para o destaque ler como bloco. Links dentro da linha chamam `e.stopPropagation()`. Tooltips das células ficam sob `<TooltipProvider delay={150}>` em volta da tabela.

## Página canônica: lista de cima a baixo

1. `header.tsx` + `loading.tsx` + `page.tsx` com `Suspense fallback={<Header />}`.
2. Client: `useEntranceOnce()`, `useRange()`, `useUrlFilters({ agent, model, errors, sort, page: "1", size: "25" })`; um `useEffect` em `[range]` reseta `page` pulando o mount, para não apagar a página de uma URL compartilhada.
3. `<div className={cn("flex flex-col gap-4 mt-1", entrance && "page-fade-in")}>` com `Toolbar trailing={<RangeControl value={range} onChange={setRange} />}`: `FilterSelect` (opções com ícone `size-4 shrink-0 text-neutral-500 mt-0.5`), `ToggleChip` "Errors only", `ClearFiltersButton`.
4. Vazio (`!isLoading && rows.length === 0 && page === 0`): `<div className="mt-2 px-8">` com `EmptyState` ("No matching traces" com filtros, "No traces yet" sem).
5. Senão `<div className="flex flex-col -mt-2">` > `TooltipProvider delay={150}` > `Table className="table-fixed min-w-5xl" stickyHeader`: `SortableHead align="right"` com largura por coluna (`w-28`, `w-30`, `w-32`, `w-38`, `w-36`); body com `TableRowsSkeleton rowHeight="h-16"` e um `SKELETON_COLS` por página (`[{ w: "w-40", sub: "w-56" }, { align: "right", w: "w-10" }, ...]`), senão `TableRow interactive {...rowNav(router, href)}`; célula principal `h-16` com título `truncate text-[14px]` e meta `mt-0.5 flex items-center gap-3 text-xs text-muted-foreground`; numéricas `text-right tabular-nums`, `HeatCell` em custo e duração.
6. `PaginationFooter` só com linhas, `isFetching` desabilitando os chevrons durante refetch.

## Breakpoints

Sem `tailwind.config` nem `--breakpoint-*`: valem os padrões (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e as container queries `@md` 448px e `@lg` 512px. Desktop-first com três degraus: `md` liga a sidebar fixa (`md:flex`), a margem e o raio do inset e `md:grid-cols-2`/`md:grid-cols-4` nos stats; `lg` pares de cards (`lg:grid-cols-2`, a classe de grid mais repetida do repo); `xl` quatro colunas (`xl:grid-cols-4`); `sm` só em dialogs (`sm:max-w-md`). Nenhum `2xl:`. Abaixo de 768: tabela `min-w-5xl` rola dentro do wrapper e perde o sticky; a Toolbar quebra (`flex-wrap`) e sobe o trailing; stats em uma coluna; gutters continuam `px-8` e `px-6`. Adaptação por medida, não por media query: a Toolbar mede com `ResizeObserver`; o `stat-grid` do lume usa container query.

## O que não copiar

- `prefetch.ts` (código morto desde d92029e), `components/user-menu.tsx`, `CardsSkeleton`, `StatCard.hint` (aceito e nunca renderizado), `ProjectGate`, `NoProject`, `SunsetCard`, `QuotaCard`, Foggy, DevBar, HUD, PostHog.
- Hex em `className`: tile marrom de traces (`bg-[#ede0d4]`), ícones de filtro `#B8B8B8`/`#5B5B5B`, hairline do popover `#EFEFEF`/`#252525`, `IconPacmanFilled text-[#0090FD]`.
- Dois `<main>` aninhados (`SidebarInset` já é `<main>`): no viewport de scroll use `div`.
- Strings "Loading…" cruas (platform, invitation, notifications) e `<table>` cru da página Platform.
- `defaultTheme="system"` do FRONTEND.md original: a regra praticada é `dark` + `enableSystem`.
