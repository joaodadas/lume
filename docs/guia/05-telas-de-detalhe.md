# 05. Telas de detalhe: painel lateral, linha expansível, prosa, código e copy

Origem: mapa cap. 10.4 e 11. Cobre o esqueleto comum da página de detalhe, o painel lateral com o par label/valor (`Field`), a linha expansível (drawer), prompt prose, code block, markdown e copy. Itens: `page-header`, `context-chip`, `stat-card`, `card`, `tabs`, `scroll-fade`, `table`, `table-skeletons`, `empty-state`, `badge`, `code-block`, `markdown-components`, `copy-button`, `copy-icon`, `use-copied`, `hover-card`. Instale `kit-tabela` e `kit-dados` ([03](./03-shell-e-paginas.md), [04](./04-dados.md)) mais `npx shadcn@latest add joaodadas/lume/code-block joaodadas/lume/markdown-components joaodadas/lume/copy-button#v0.1.0`. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/...`).

## Esqueleto comum

Toda tela de detalhe é um client component inteiro renderizado por um `page.tsx` que só faz `await params` e `decodeURIComponent`. Não há `Tabs` fora do painel lateral do trace. A ordem vertical é fixa: header em modo breadcrumb, linha opcional de chips de contexto, faixa de stats, cards de gráfico, tabela com linha expansível.

<!-- skill:start -->
| Bloco | Regra praticada |
|---|---|
| `loading.tsx` | só `<RouteHeader href="/agents" back title="Agent" withRange />`: o título real é parâmetro de rota, então o fallback mostra o crumb genérico até a página chegar; `LiveRangePicker` continua vivo porque o contexto está acima do boundary |
| Header breadcrumb (`page-header`) | `h1` `flex items-center gap-1.5 text-base font-medium tracking-tight`; link de volta `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground` com o ícone `size-4.5 shrink-0` + tile do nav; `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; título `<span className="truncate">`; `titleLeading` (ícone da entidade `size-4.5`), `titleTrailing` (`CopyButton` do id, ou o id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` quando difere do nome); `actions` = `RangeControl`. O primitivo `Breadcrumb` não é usado: o breadcrumb é o próprio `h1` |
| Entrada | `PageHeader` num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o `loading.tsx` repete; cards de gráfico recebem `className={cn(entrance && "page-fade-in")}` um a um |
| Chips de contexto (`context-chip`) | container `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`; `ContextChip` com `href` para a entidade dona (cliente, agente, workflow); placeholder enquanto carrega é `div` cru `h-8 w-32 animate-pulse rounded-full bg-muted` (`w-28`, `w-36`), nunca `Skeleton`: o `corner-squircle` do primitivo quadra o `rounded-full` |
| Stats | `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1` com `StatCard size="sm"`, custos em `formatCostFixed(n, 4)`; o empty "sem atividade" espera os stats carregarem para um rollup lento não piscar o vazio antes dos números |
| Gráficos | `section` `grid gap-4 lg:grid-cols-2 px-8`; `Card size="sm"`, chart `h-55 w-full`, `syncId` por página; empty no card `EmptyState icon={IconChartAreaFilled} title="Sem dados neste período"` |
| Empty state (`empty-state`) | `Empty className="border border-dashed"` + ícone `opacity-40` (registry/base-vega/components/empty-state.tsx:33-36), sempre num wrapper `px-8`; "sem atividade" e "tabela vazia" têm textos diferentes |
<!-- skill:end -->

## Painel lateral e `Field`

O painel do trace (`trace-detail-client.tsx`) é o modelo de qualquer inspector ao lado de uma lista: `aside` sticky, `Card` com altura limitada, `Tabs` sem `TabsList` (o toggle do header controla `value`) e `ScrollFade` por dentro.

<!-- skill:start -->
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
<!-- skill:end -->

Campos ausentes são omitidos, não trocados por placeholder: "um slot vazio diz 'não se aplica aqui', coisa que um traço não diz". O grid preenche row-major, então intercale tempo (Started, Duration) com identidade e dinheiro (Model, Cost) para cada família cair na sua coluna. Outliers ganham chip `cursor-help rounded px-1 py-px text-[10px] font-medium tabular-nums` em `bg-rose-500/15 text-rose-600 dark:text-rose-400` (p95+), amber (p90+) ou emerald (p5 ou abaixo). Proporções (custo por categoria, tokens, tempo) usam uma barra única `flex h-1 w-full gap-px overflow-hidden rounded-[1px]` com segmentos `h-full cursor-zoom-in transition-opacity` (os outros caem a `opacity-25` no hover) e legenda `flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground tabular-nums` com swatch `size-2 rounded-xs`.

Banner de erro no topo do painel (Foglamp, apps/web/src/app/(app)/traces/[traceId]/trace-detail-client.tsx): `flex flex-col gap-1 bg-destructive/20 text-sm text-destructive px-3 py-2.5 mb-5 mx-5 corner-squircle shadow-(--custom-shadow-rose) rounded-lg`, cabeçalho `flex items-center gap-1.5 text-sm font-medium` com `IconAlertTriangleFilled size-3.5`, mensagem `min-w-0 wrap-break-word text-balance`. Metadata em `font-mono text-[11px]` com dot leader real (`min-w-4 flex-1 overflow-hidden whitespace-nowrap text-muted-foreground/20 mx-1` com `".".repeat(300)`, selecionável).

O waterfall (mapa 10.3) fica fora do lume: é um `@container` com grid `grid-cols-[9.5rem_minmax(0,1fr)_3.25rem]` (`@lg:grid-cols-[15rem_minmax(0,1fr)_6.5rem]`), indent `pl-[calc(var(--depth)*8px+12px)]` por nível, linhas `min-h-10 rounded-md py-1` e barra na cor de `spanTypeBar`; quem precisar de timeline parte dos valores do mapa, não deste guia.

## Linha expansível (drawer)

A tabela de detalhe abre a linha no lugar, sem navegar. Valores de `run-exchange.tsx`:

<!-- skill:start -->
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
<!-- skill:end -->

A tabela inteira monta durante o load com `TableRowsSkeleton` (registry/base-vega/components/table-skeletons.tsx:30) no corpo e `table-fixed`, para a troca não refluir; o `PaginationFooter` só aparece depois, encostado na última linha. Bolhas de conversa (`Bubble`, Foglamp, apps/web/src/components/app/run-exchange.tsx:496): usuário em `min-w-0 flex-1 corner-squircle rounded-lg squircle:rounded-2xl bg-card dark:bg-muted-foreground/10 shadow-(--custom-shadow) px-3 py-2.5` com avatar `flex size-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-muted-foreground shadow-(--custom-shadow)`; assistente em `min-w-0 flex-1 px-1 py-0` com markdown e `CopyButton` em `shrink-0 opacity-0 transition-opacity group-hover/bubble:opacity-100`. Tool calls entre bolhas em `flex flex-wrap items-center gap-1.5 pl-9` (6 do avatar + 3 do gap) como `Chip` xs com `IconTool size-3 shrink-0 fill-current stroke-1 mb-px text-blue-500`.

## Prompt prose

Um template de prompt é renderizado "como o documento que ele é, não como código" (`prompt-prose.tsx`, fora do lume: depende do pacote de prompts). Deliberadamente não é markdown: prompts usam `<tags>` e texto literal que um parser engoliria, então toda linha não reconhecida sai como está. Container `flex flex-col gap-2.5 text-[13px] leading-relaxed` (:285); heading `font-semibold text-balance` (nível 1 e 2 `mt-1 text-sm`, senão `text-[13px]`); lista `space-y-0.5 pl-5 marker:text-muted-foreground/70` (:319); tag `font-mono text-[11px] text-muted-foreground` (:333); `hr.border-border/60` (:338); inline `**bold**` em `font-semibold`, `` `code` `` em `rounded bg-muted px-1 py-px font-mono text-[0.85em]`, placeholders `{date}` `{id}` `{url}` em `rounded bg-lime-400/20 px-1 py-px font-mono text-[0.8em] text-lime-700 dark:bg-lime-600/25 dark:text-lime-300` (:153). Lima é a cor de "varia por execução" em toda a feature; o `SlotChip` (:183-199) é um `HoverCard` cujo trigger é `inline-flex cursor-default items-center gap-1 rounded-md bg-lime-400 px-1.5 py-0.5 text-[11px] font-medium text-lime-950 transition-colors hover:bg-lime-300 dark:bg-lime-600 dark:hover:bg-lime-500`. Template cru ao lado da lista de versões: `font-mono text-[11px] leading-relaxed whitespace-pre-wrap wrap-anywhere`, direto no card, sem caixa própria; diff linha a linha com `bg-green-500/10 text-green-800 dark:text-green-300` e `bg-rose-500/10 text-rose-800 dark:text-rose-300`.

## Code block (`code-block`)

<!-- skill:start -->
- Shiki `createHighlighterCore` com `createJavaScriptRegexEngine()` (sem wasm), singleton lazy, temas `github-light` e `vesper` com `defaultColor: false` (registry/base-vega/components/code-block.tsx:38-53); só `typescript` e `json`; acima de `HIGHLIGHT_MAX_CHARS = 50_000` fica o `pre` cru (:34).
- O CSS que escolhe o tema vem no campo `css` do item e cai no `globals.css`: `.shiki { background-color: var(--shiki-light-bg) }`, `.shiki, .shiki span { color: var(--shiki-light) }`, `.dark .shiki { ... var(--shiki-dark-bg) }`, `.dark .shiki, .dark .shiki span { color: var(--shiki-dark) }`. Sem essas quatro regras o bloco renderiza sem cor (:23-29).
- Container `relative text-left text-xs [&_pre]:m-0 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted/50! [&_pre]:dark:bg-muted/20!  [&_pre]:p-5 [&_pre]:leading-relaxed [&_pre]:shadow-(--custom-shadow) corner-squircle` (o espaço duplo é do original) + `[&_pre]:pr-10` (espaço do copy) ou `[&_pre]:pt-5` com `actions`/`hideCopy` (:113-117). Fallback imediato `pre.bg-muted!.dark:bg-muted!.text-foreground` para nunca haver flash vazio (:125).
- Controles `absolute right-3 top-3 flex items-center gap-1`: `{actions}` + `Button size="icon-sm" variant="outline" className="text-muted-foreground hover:text-foreground dark:bg-input/20" aria-label="Copiar código"` com `CopyIcon` e `useCopied(2000)` (:130-141). Sem números de linha e sem soft wrap: o `pre` rola na horizontal.
- `useShikiHtml(code, lang)` (:61) é exportado para blocos de JSON em painéis: `[&_pre]:bg-transparent!` quando o container já tem fundo.
<!-- skill:end -->

`hideCopy` serve ao padrão de dois `CodeBlock` na mesma célula de grid (`col-start-1 row-start-1`) com crossfade `transition-opacity duration-200`, o inativo `inert`, e os controles num overlay único fora das camadas que somem.

## Markdown (`markdown-components`)

Markdown de modelo passa por `Streamdown` com `components={markdownComponents}` e `controls={{ table: false }}`; em Next adicione `@source "../node_modules/streamdown/dist/*.js"` ao CSS, senão as classes internas do Streamdown não são geradas. Nenhum outro engine. Os overrides (registry/base-vega/components/markdown-components.tsx): `a` relativo vai pelo `link` da indireção e absoluto abre em `target="_blank" rel="noreferrer"`, ambos `font-medium text-primary underline underline-offset-2` (:20-42); `table` em wrapper `my-3 w-full overflow-x-auto rounded-md squircle:rounded-xl corner-squircle border border-border/60` > `table.w-full.border-collapse.text-xs.tabular-nums` (:45-51); `thead` `bg-muted/40 text-muted-foreground`; `tr` `border-b border-border/40 last:border-0`; `th` `px-3 py-2 text-left font-medium whitespace-nowrap`; `td` `px-3 py-1.5 align-top`; `img` cru `my-1.5 inline-block max-h-64 max-w-full rounded-md` (URL remota do modelo, e o `div` do Streamdown dentro de `p` quebra a hidratação, :66-80); `hr` `my-3 border-border/60`.

<!-- skill:start -->
O espaçamento vem do wrapper de prosa, por seletor arbitrário, não dos componentes:

| Onde | Classes |
|---|---|
| Bolha de assistente | `text-sm leading-relaxed [&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_pre]:my-2 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 *:last:mb-0 [&>*:first-child>*:first-child]:mt-0 [&>*:first-child>*:first-child>*:first-child]:mt-0` (session-detail-client.tsx:506) |
| `Prose` (system prompt no drawer) | `text-xs leading-relaxed wrap-anywhere` com headings rebaixados (`[&_h1]:text-[13px] [&_h1]:font-semibold`, h2 a h6 `text-xs`), `[&_code]:text-[11px]`, `[&_pre]:text-[11px] [&_pre]:whitespace-pre-wrap` (payload-view.tsx:71-73) |
<!-- skill:end -->

## Copy (`use-copied`, `copy-icon`, `copy-button`)

<!-- skill:start -->
- `useCopied(timeoutMs = 1500)` (registry/base-vega/hooks/use-copied.ts:13): `{ copied, markCopied, resetCopied }`; o timer é limpo no unmount e na re-cópia. 1500 ms no `CopyButton`; 2000 ms no `CodeBlock` e em botões de prompt.
- `CopyIcon` (registry/base-vega/components/copy-icon.tsx:28-52): `span.relative.inline-flex` > `AnimatePresence mode="popLayout" initial={false}` > `motion.span key={copied ? "check" : "copy"}` com `initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}`, `animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}`, `exit` igual ao `initial`, `transition={COPY_SPRING}` (`{ type: "spring", duration: 0.25, bounce: 0 }`, registry/base-vega/lib/motion.ts:41-45). `IconCopyFilled` vira `IconCircleCheckFilled` em `text-green-600 dark:text-green-400`; dentro de um `Button` default (fundo invertido) passe `checkClassName="text-green-400 dark:text-green-600"`. `popLayout` + `relative` põem o ícone que sai sobre o que entra em vez de empilhar por um frame.
- `CopyButton({ value, title, stopPropagation?, iconSize = "size-4" })` (registry/base-vega/components/copy-button.tsx:35-53): `button` nu, não o primitivo, `inline-flex shrink-0 items-center justify-center rounded p-1 text-muted-foreground/60 cursor-pointer transition-colors hover:text-foreground`; `title` obrigatório; `stopPropagation` dentro de linha clicável; nunca aninhe o botão num toggle, ponha como irmão; copie a string original, nunca o DOM animado.
<!-- skill:end -->

## O que não copiar

- `Bubble` duplicado (session-detail-client.tsx:474 e run-exchange.tsx:496 com o mesmo markup): mantenha um só.
- Hex em `className`: hairline do card de versões `lg:border-[#EFEFEF] lg:dark:border-[#252525]` (prompt-versions-card.tsx:143) vira `border-border/50`; `text-[#8b5e34] dark:text-[#c9a888]` nos botões "See trace"; chevrons `text-[#B8B8B8] dark:text-[#5B5B5B]` viram `text-muted-foreground/50`.
- O travessão de `MetaEmpty` e de `formatCost(null)`: no lume é `EMPTY` (`sem dado`).
- `Skeleton` para pílulas (o `corner-squircle` quadra o `rounded-full`): use `div` com `animate-pulse rounded-full bg-muted`.
- Padding inconsistente entre páginas (`px-6` nos chips e no eval, `px-8` no resto): no lume fixe `px-8` para conteúdo e `px-6` só para toolbars, como em [03](./03-shell-e-paginas.md).
- `<img>` cru fora do markdown e do avatar de cliente (os dois únicos casos justificados); `AnimatedApiKey` e `slot-text`; `markdown-pages.ts`; o `CopyButton` do marketing (sem animação, 1800 ms).
- `useShikiHtml` com `lang` fora de `typescript`/`json` falha em silêncio e deixa o texto cru: adicione a gramática no singleton antes de usar outra.
