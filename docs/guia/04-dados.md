# 04. Dados: tabela, números, chips e gráficos

Origem: mapa cap. 9. Cobre a densidade da tabela, ordenação na URL, `format.ts` função por função, o placeholder de nulo, `StatCard` e `NumberTicker`, `HeatCell`, chips, cor por hash e a paleta de gráficos com o evilcharts. Itens: `kit-dados` (`table`, `data-table`, `format`, `stat-card`, `stat-grid`, `number-ticker`, `card-sparkline`, `pill-meter`, `span-type`, `context-chip`, `badge`, `table-skeletons`) e `kit-graficos` (`evilcharts`, `area-chart`, `bar-chart`, `line-chart`, `donut-chart`, `trend-charts`). Instale com `npx shadcn@latest add joaodadas/lume/kit-dados#v0.1.0` e `npx shadcn@latest add joaodadas/lume/kit-graficos#v0.1.0`. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/...`).

## As cinco regras desta camada

<!-- skill:start -->
- Número é `tabular-nums` e coluna numérica é alinhada à direita: `TableCell align="right"` injeta `text-right tabular-nums` (registry/base-vega/ui/table.tsx:17-21). Não há regra global no CSS; é classe a classe.
- Valor ausente nunca vira zero. No lume o placeholder é o texto `sem dado` (`EMPTY`, registry/base-vega/lib/format.ts:14) em `text-muted-foreground/50`; o Foglamp usava o travessão, que o lume não usa em lugar nenhum (adição do lume).
- Cor cromática só com significado: tabela em cinza, custo e latência por quintil (`HeatCell`), erro em red/rose, aborto em amber, tipo em violet/blue/amber/emerald. Série de gráfico neutra é `var(--chart-2)`.
- Nada teleporta: número anima 0,6 s (`number-ticker`), gráfico segura a view anterior no refetch (`useFrozen` + `isUpdating`), skeleton só após 700 ms (`use-delayed-loading`).
- Estado de lista vive na URL (`useUrlFilters`, registry/base-vega/blocks/data-table/url-filters.ts:44): filtro, busca, ordenação e página sobrevivem a reload e viram link.
<!-- skill:end -->

## Densidade da tabela

<!-- skill:start -->
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
<!-- skill:end -->

`table-fixed` existe por causa do skeleton: as larguras vêm das classes `w-*` do header, então a troca skeleton para dado não remede colunas. `TableFooter` e `TableCaption` não têm uso no app; no lume levam `border-border/50 dark:border-border/40` no lugar dos hex do Foglamp (table.tsx:130,232).

## Ordenação e URL (`data-table`)

- `useTableSort` (registry/base-vega/blocks/data-table/data-table.tsx:97) é tri-state por coluna: sem ordem, `desc`, `asc`, sem ordem. `sort === null` é a ordem natural da query.
- `sortRows` (:114) ordena listas completas no cliente: `null` sempre por último, número compara numérico, resto `localeCompare`. Tabela paginada ordena no servidor.
- `parseSortParam` e `cycleSortParam` (:63,75) serializam `key:dir` (`cost:desc`) na URL; uma página pode linkar direto para `/traces?sort=tokens:desc`.
- `SortableHead` (:136-188): a célula inteira é o alvo (`tabIndex 0`, Enter e Espaço, `aria-sort`), `group cursor-pointer select-none outline-none focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-ring/50`; seta `IconArrowUp`/`IconArrowDown` ativa, `IconArrowsSort` em repouso, `size-3.5 shrink-0 transition-[color,opacity]`, `stroke={active ? 2 : 1.5}`, inativa `text-muted-foreground opacity-0 group-hover:opacity-100`. O label é `inline-flex flex-row-reverse items-center gap-1.5 text-foreground` e em `align="right"` recebe `-mr-5`: a seta (14px + 6px de gap) pendura dentro do padding para o texto alinhar com os números abaixo.
- `PaginationFooter` (:684-741): sem números de página de propósito ("listas paginadas são percorridas em sequência ou estreitadas por filtro"); `pageSizes = [25, 50, 100]`; só renderiza com linhas; anatomia em [03-shell-e-paginas](./03-shell-e-paginas.md).

## `format.ts` função por função (`format`)

Tudo passa por `Intl` com `LOCALE = "pt-BR"` e `TIME_ZONE = "America/Sao_Paulo"` fixos (registry/base-vega/lib/format.ts:9-10), formatters em cache num `Map`. É a regra praticada do Foglamp (`Intl` para formato curto; `date-fns` só para aritmética), contra o FRONTEND.md original dele. Nulo e não finito viram `EMPTY`.

<!-- skill:start -->
| Função | Regra exata | Linha |
|---|---|---|
| `formatMoney(value, { currency = "BRL", maxDecimals = 2 })` | `style: "currency"`, mínimo 2 casas, zeros à direita caem até 2: `R$ 1.234,50`, `US$ 0,0034` (adição do lume) | :41 |
| `formatCost(value, maxDecimals = 6)` | `formatMoney` em USD; custo de API é em dólar. Stat card usa 4 casas, card de total 2, listas 3 | :57 |
| `formatCostFixed(value, decimals)` | min = max = `decimals`, para a coluna alinhar na vírgula (`US$ 0,003350` sobre `US$ 0,002773`); só em célula de tabela | :68 |
| `formatCount(value)` | `Math.round` primeiro (o ticker passa frames fracionários); `>= 1000` compacto (`1,2 mil`), senão plain | :87 |
| `formatExactCount(value)` | plain com separador (`1.024`, nunca `1 mil`); quando o número exato é o ponto | :95 |
| `formatTokens(value)` | sempre compacto | :99 |
| `formatCompact(value)` | abaixo de mil, casas pelo tamanho (`123`, `12,3`, `0,42`); de mil para cima compacto (`3,4 mi`); do `numero()` do painel (adição do lume) | :115 |
| `formatDuration(ms)` | `0` vira `0s`; `< 1` `Nµs`; `< 1000` `Nms`; `< 60_000` `1,23s`; acima, no máximo duas unidades de `d h min s` (`1h`, não `60min 0s`) | :125 |
| `formatSpanDuration(ms)` | `0` vira `<1ms` (storage em ms inteiros: zero é "menos de 1 ms"); resto delega. Eixos e agregados usam `formatDuration` | :152 |
| `formatPercent(fraction)` | `Math.round(fraction * 100)%` | :158 |
| `parseDateTime(value)` | `YYYY-MM-DD HH:MM:SS` (UTC, sem fuso) ou ISO: troca o espaço por `T` e sufixa `Z` quando não há fuso | :167 |
| `formatDateTime(value, { seconds })` | `dd/MM HH:mm` no fuso fixo (`05/10 14:32`), 24h por `hourCycle: "h23"`, montado de `formatToParts` porque o pt-BR põe vírgula entre data e hora | :201 |
| `formatRelative(value)` | clamp em 0 (skew de relógio nunca vira negativo); `agora` abaixo de 1 min, `há 3 min`, `há 2 h`, `há 5 d` | :217 |
| `formatDelta(current, previous)` | `{ pct, dir }` com `flat` abaixo de 0,0001; `null` sem baseline (anterior nulo ou zero) e o chamador mostra `EMPTY` | :241 |
| `projectMonthlyCost(cost, windowMs)` | extrapola para 30 dias; `null` sem custo | :254 |
<!-- skill:end -->

Formatadores fora do arquivo: eixo Y de custo com `maximumFractionDigits: 3`; `makeBucketLabel(windowMs)` (registry/base-vega/components/trend-charts.tsx:71) mostra mês e dia quando a janela passa de 2 dias e `HH:MM` abaixo disso; `formatBucketFull` (:88) é a versão completa do tooltip.

## StatCard e NumberTicker

`StatCard` (registry/base-vega/components/stat-card.tsx:28): anatomia completa em [03-shell-e-paginas](./03-shell-e-paginas.md). O que esta camada acrescenta: `value` numérico ganha `NumberTicker` com `formatValue` por frame (por isso `formatCount` arredonda); `delta` vem de `formatDelta` e `deltaInverted` inverte a cor para custo, erro e latência; `loading` segura a line box (`Skeleton h-3 w-20`, :140) e o slot do chart em `h-10` (:161) para o dado cair sem mexer no card.

<!-- skill:start -->
| Peça | Valor exato |
|---|---|
| `NumberTicker` (registry/base-vega/components/number-ticker.tsx:50-55) | `animate(from, value, { duration: 0.6, ease: "easeOut", onUpdate, onComplete })` do `motion/react`; primeira pintura estática, só mudanças animam; `format` padrão `formatExactCount`; com `useReduce()` pula para o valor final (:46-49) |
| `DeltaBadge` (stat-card.tsx:182) | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px`; bom `text-emerald-600 dark:text-emerald-500`, ruim `text-red-500 dark:text-red-500`; seta `size-3.75 stroke-[1.6]`; flat `~0%` em `text-xs font-medium tabular-nums text-muted-foreground mt-px`; `title` padrão "vs. período anterior" |
| Ícones canônicos de stat | tokens `IconCirclesFilled text-sky-400 dark:text-sky-500`; custo `IconCoinFilled text-amber-400 dark:text-yellow-500` + `deltaInverted`; pass rate `IconGaugeFilled text-fuchsia-400 dark:text-fuchsia-500`; erro `IconAlertTriangleFilled text-red-500/90 dark:text-red-600/95 mt-px` + `deltaInverted`; latência `IconClockFilled text-sky-400 dark:text-sky-500`; volume `IconBoltFilled text-orange-500` (overview-client.tsx:801-877) |
| `CardSparkline` (card-sparkline.tsx:18) | `viewBox 0 0 100 32`, `PAD = 3`, linha `strokeWidth 1.2` `strokeOpacity 0.5`, gradiente `currentColor` 0,4 a 0,1; cor pela classe `text-*` do consumidor; abaixo de 2 pontos cai no `CardSparklinePlaceholder` (:105) |
| `PillMeter` (pill-meter.tsx:33-40) | 32 cápsulas `flex-1 rounded-full` em `flex h-3.5 items-stretch gap-0.75`; acesa `bg-current`, apagada `bg-muted-foreground/10`; fração positiva acende ao menos uma |
<!-- skill:end -->

Ordem canônica dos cards numa faixa: Volume, Health, Performance, Cost; custo sempre por último. `@number-flow/react` não entra: o Foglamp declara e não importa; o count-up do sistema é o `number-ticker`.

## HeatCell: cor por quintil

Ainda não é item do lume; copie de `apps/web/src/components/app/heat-cell.tsx` trocando `@foglamp/ui` pelos itens `table` e `tooltip`.

<!-- skill:start -->
| Bucket (percentil) | `HEAT_SHADES` (heat-cell.tsx:15-21) |
|---|---|
| 0 a 20 | `text-green-600 dark:text-green-400` |
| 20 a 40 | `text-yellow-600 dark:text-yellow-400` |
| 40 a 60 | `text-amber-600 dark:text-amber-400` |
| 60 a 80 | `text-orange-600 dark:text-orange-400` |
| 80 a 100 | `text-red-600 dark:text-red-400` |

- `percentileBucket(value, thresholds)` (:34-42) conta quantos limiares (p20/p40/p60/p80) o valor passa; nulo, `<= 0` ou sem limiares não é bucketizado. Limiares vêm da API quando a tabela é paginada; numa lista completa calcule quintis sobre a página visível.
- Célula: `text-right tabular-nums` + `font-medium` com `bold` + `text-muted-foreground/40` quando nulo (ou zero com `mutedWhenZero`) (:68-72). Light usa 600 e dark 400 por contraste; classes literais para o Tailwind manter.
- Tooltip só quando há bucket: `TooltipTrigger render={<span className="cursor-default" />}` e texto em linguagem de percentil ("0 a 20 por custo · mais barato"), sob `<TooltipProvider delay={150}>` em volta da tabela. A tinta é relativa ao conjunto visível, nunca a um valor absoluto.
<!-- skill:end -->

## Chips (`context-chip`, `span-type`, `badge`)

<!-- skill:start -->
- `CHIP_SURFACE` (registry/base-vega/components/context-chip.tsx:12-13) = `bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`: sempre sobre `Button variant="outline"`. É o trigger do `FilterSelect` sem as partes de dropdown: hover instantâneo, sem press scale, borda trocada por sombra no dark.
- `CHIP_ERROR` = `border-rose-500/40 text-rose-600 dark:text-rose-400 dark:shadow-[0_0_0_1px_rgba(244,63,94,0.4)]`; `CHIP_ABORTED` idem em amber `rgba(245,158,11,0.4)` (:19-22).
- `ContextChip({ href?, icon, iconClassName?, label })` (:104): `max-w-xs justify-start` + `CHIP_SURFACE`; ícone `size-3.5 shrink-0`; com `href` vira `render={<Link href />}` e ganha `IconArrowUpRight size-3.5 shrink-0 -ml-0.5 mt-px text-muted-foreground`; sem `href`, `render={<div />}` + `pointer-events-none`.
- `Chip({ icon?, label, trailing?, tone, href?, onClick? })` (:29): `size="xs"` + `max-w-64 justify-start` + `CHIP_SURFACE` + `dark:bg-muted-foreground/10 dark:hover:bg-muted-foreground/20`; `trailing` em `shrink-0 tabular-nums text-muted-foreground` (duração, `×N`).
- `Badge` (registry/base-vega/ui/badge.tsx:10-51): 14 variants, as 11 cromáticas no padrão `bg-<cor>-500/10 text-<cor>-700 shadow-[var(--custom-shadow-<cor>)] dark:bg-<cor>-500/15 dark:text-<cor>-300` (rose e red `dark:text-<cor>-400`; orange `text-orange-600 dark:bg-orange-600/15 dark:text-orange-400`); tamanhos `sm` `h-4 px-1.5 gap-1 text-[10px]`, `md` `h-5 px-2 gap-[5px] text-xs`, `lg` `h-6 px-2.5 gap-1.5 text-sm`. A base é `capitalize`: texto técnico precisa de `normal-case` (ex. `Badge variant="sky" size="sm" className="font-mono normal-case tabular-nums"` para versão).
<!-- skill:end -->

`span-type` (registry/base-vega/components/span-type.tsx) é o exemplo canônico de cor com significado: um mapa por conceito, nunca cor solta no componente. Para o seu domínio (status de pedido, ambiente, tipo de evento) copie a estrutura: `SPAN_TYPE_VARIANT` (:25), `SPAN_TYPE_ICON` (:35), `SPAN_TYPE_BAR` (:45) e `SPAN_TYPE_CHIP` (:72-81).

<!-- skill:start -->
| Tipo | Badge | Ícone | Barra | Chip só ícone (`SpanTypeChip`, `flex size-4.5 shrink-0 items-center justify-center rounded-md corner-squircle`, ícone `size-3`) |
|---|---|---|---|---|
| llm | `violet` | `IconSparkles` | `bg-violet-500` | `bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.14),0_2px_6px_-2px_rgba(139,92,246,0.25)] dark:shadow-(--custom-shadow)` |
| tool | `blue` | `IconTool` + `fill-current` (Tabler não tem `IconToolFilled`) | `bg-blue-500` | mesma receita em `rgba(59,130,246,...)` |
| agent | `amber` | `IconGhost` | `bg-amber-500` | `rgba(245,158,11,...)` |
| embedding | `emerald` | `IconVector` | `bg-emerald-500` | `rgba(16,185,129,...)` |
| other | `secondary` | `IconCircleDashed` | `bg-neutral-500` (Foglamp: slate; o lume usa neutral) | `bg-neutral-500/15 text-neutral-600 dark:text-neutral-400` + `rgba(115,115,115,...)` |
<!-- skill:end -->

A receita do chip (anel interno de 1px a 14% + sombra `0 2px 6px -2px` a 25% da mesma cor no light; só `--custom-shadow` no dark) é a mesma do tile de nav ([03](./03-shell-e-paginas.md)) e dos chips de score: "`--custom-shadow` lava no light", por isso o light ganha o anel tingido.

## Cor por hash

Não é item do lume ainda; copie `agentColor` de `apps/web/src/components/app/agent-icon.tsx:11-45`. Dezesseis hex do tom 500 do Tailwind (`#ef4444` red, `#f97316` orange, `#f59e0b` amber, `#84cc16` lime, `#22c55e` green, `#10b981` emerald, `#14b8a6` teal, `#06b6d4` cyan, `#0ea5e9` sky, `#3b82f6` blue, `#6366f1` indigo, `#8b5cf6` violet, `#a855f7` purple, `#d946ef` fuchsia, `#ec4899` pink, `#f43f5e` rose), escolhidos por djb2 (`hash = ((hash << 5) + hash + charCode) | 0`, semente 5381, `Math.abs`, `% 16`); nome vazio cai no primeiro. O ícone recebe a cor por `style={{ color }}` inline (dado, não tema) e em repouso é a variante outline com `fill-current/20`; `filled` só em linha meta e chips. O mesmo hash tinge avatar de cliente sem foto.

## Paleta de gráficos e evilcharts (`kit-graficos`)

<!-- skill:start -->
| Token (registry/base-vega/styles/globals.css:41-45, idêntico no dark :151-155) | Valor | Uso |
|---|---|---|
| `--chart-1` | `oklch(0.87 0 0)` | só lê em fundo escuro |
| `--chart-2` | `oklch(0.556 0 0)` | a série neutra (Requests, Spans, Runs); o único usado direto |
| `--chart-3` / `--chart-4` / `--chart-5` | `oklch(0.439 0 0)` / `oklch(0.371 0 0)` / `oklch(0.269 0 0)` | fallback quando a entidade não tem cor própria |

| Série | Cor |
|---|---|
| Erros | `var(--destructive)` + `variant="lines"` (hachura) |
| p50 / p95 / p99 | `{ light: ["#262626"], dark: ["#e5e5e5"] }` / `#0090FD` / `#FF5513` |
| Custo input / cached input / cache write | `#F97316` / `#FDBA74` / `#C2410C` (família laranja = entrada) |
| Custo output / reasoning / outros | `#0090FD` / `#93C5FD` (família azul = saída) / `var(--muted-foreground)` |
| Limiar (`Threshold`) | `var(--destructive)`, `strokeDasharray "4 4"` (registry/base-vega/components/evilcharts/charts/area-chart.tsx:762) |

Hex é aceito aqui porque a cor é dado (série, marca), sempre com comentário; `themed(color)` (trend-charts.tsx:20) devolve `{ light: [color], dark: [color] }` porque o `ChartConfig` exige cor por tema e os tokens já flipam.
<!-- skill:end -->

- Import como namespace: `import * as AreaChart from "@/components/evilcharts/charts/area-chart"` e `<AreaChart.EvilAreaChart>`. O app usa área (tendências) e barras (custo empilhado); linha e donut existem no kit mas só o marketing usa.
- Card: `Card size="sm"` > `CardHeader className="flex flex-row items-center justify-between gap-4"` (título + `ChartLegend` clicável, trend-charts.tsx:28-67) > `CardContent className="mt-3"`; chart `className="h-65 w-full"` (260px) ou `h-55` nas páginas de detalhe; `chartProps.margin = { top: 5, right: 5, bottom: 5, left: 2 }` (`left: 2` encosta os labels do eixo Y no conteúdo do card); barras com `barCategoryGap: "40%"`.
- Padrões do kit que o app mantém: `STROKE_WIDTH = 0.8` (area-chart.tsx:63), `variant="gradient"`, `curveType="linear"` (:194), `animationType="left-to-right"` (1 s, `REVEAL_EASE`); `strokeVariant` passa sempre `"solid"` (o padrão da lib é `"dashed"`, :370). Barras: `DEFAULT_BAR_RADIUS = 2`, `BAR_GROW_DURATION = 0.5`, `BAR_STAGGER = 0.05` (bar-chart.tsx:62-67), animação nativa do Recharts desligada (`isAnimationActive={false}`, :444).
- `ChartContainer` (evilcharts/ui/chart.tsx:124-137): `min-h-0 w-full flex-1`, `aspect-video` sem `footer`, `initialDimension { width: 320, height: 200 }`, `debounce = 100`; `isUpdating` escurece com `opacity-50 delay-150 duration-300` e volta em `duration-150`.
- Tooltip (evilcharts/ui/tooltip.tsx:129,193): `border-border/50 grid min-w-32 items-start gap-1.5 border px-2.5 py-1.5 text-xs shadow-xl` + `rounded-lg` + `bg-background`; valor `text-foreground font-mono font-medium tabular-nums`; `animationDuration` 200 ms.
- Eixo de tempo (trend-charts.tsx): `thinTicks` (:119) um representante por rótulo e `minGap = ceil(n / 14)`; `makeEdgeTick` (:180) ancora o primeiro label em `start` e o último em `end` para o plot ficar full-bleed; `pickBucketMs` (:224) espelha o bucket do servidor e `fillBuckets` (:255) zera buckets vazios; `useFrozen` (:240) + `placeholderData: (prev) => prev` seguram a view no refetch; `useZoomRange` (:310) transforma arrasto em range global e duplo clique desfaz.
- Último bucket ainda enchendo: `enableBufferLine` (linha tracejada `4 3`) e `bufferBar` (hachura) quando `Date.now() < último + (último - penúltimo)`.
- Vazio dentro do card: o gráfico com dados de amostra em `pointer-events-none select-none opacity-50 blur-[3px]` atrás de um `Empty className="border-none bg-transparent"` com `IconChartAreaFilled opacity-40`.

## O que não copiar

- O travessão como placeholder e `text-muted-foreground/40` na célula de nulo: no lume é `EMPTY` (`sem dado`) em `text-muted-foreground/50`.
- `slate` em `span-type` e o token `--custom-shadow-slate`: o neutro é `neutral`.
- Hex em `className` dos ícones de toolbar (`#B8B8B8`/`#5B5B5B`) e do footer e caption da tabela: já viraram `text-muted-foreground/50` e `border-border/50` no lume.
- `Stat` (stat.tsx, nunca importado), `pageWindow` (sem uso), `@number-flow/react` e `slot-text` (um uso só, `AnimatedApiKey`), `packages/ui/src/components/chart.tsx` (shadcn, não importado), `EvilBrush`, `ChartBackground`, `AreaChart.Dot` e as variantes de barra `hatched`/`duotone`/`stripped`.
- `curveType="monotone"` só no marketing; o app fica no `linear`.
- A busca inline do `FilterSelect` (`IconSearch` absoluto sobre `Input` cru): única exceção praticada; para campo com ícone use `input-group`.
