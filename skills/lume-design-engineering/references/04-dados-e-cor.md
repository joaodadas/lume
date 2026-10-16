# Dados e cor

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/04-dados.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Números, datas e formatação

<!-- mapa: 9.3 | regras 11, 22 -->

- **Always** formate por `registry/base-vega/lib/format.ts`, função por função: `formatMoney(v, { currency: "BRL" | "USD" })`, `formatCost` (USD, 6 casas, zeros à direita caem até 2), `formatCostFixed(v, 6)` em coluna (alinha no decimal), `formatCount` (arredonda antes, compacta de 1000 em diante), `formatExactCount` (nunca "1 mil"), `formatCompact` (123, 12,3, 0,42), `formatDuration` (até duas unidades, "1h" e não "60min 0s"), `formatSpanDuration(0) = "<1ms"`, `formatPercent`, `formatRelative` ("agora", "há 3 min"), `formatDateTime` (dd/MM HH:mm), `formatDelta`.
- **Always** mostre valor nulo como `EMPTY` = `sem dado` em `text-muted-foreground/50` (`format.ts:14`); zero só aparece quando o dado é zero; campo que não se aplica é omitido, não trocado por placeholder.
- **Always** use `Intl` com `LOCALE "pt-BR"` e `TIME_ZONE "America/Sao_Paulo"` para formato e `date-fns` (locale `ptBR`) só para aritmética e presets de período (`range.ts`); formatters cacheados em `Map`.
- **Always** reformate a cada frame quando o número anima (`number-ticker`, 600ms `easeOut`, primeira pintura estática) e re-renderize tempo relativo a cada 15s só no nó de texto.
- **Never** use travessão como placeholder (o `formatCost` do Foglamp usa; o lume não), `dayjs`, `moment`, `luxon`, ou `toLocaleString()` solto fora de `format.ts`.

Porquê: número consistente é a cara de um dashboard; um placeholder de texto diz "sem dado" sem parecer zero e sem o glifo que o repo proíbe.

## Cor com significado

<!-- mapa: 9.4 a 9.6, 13.2 | regras 8, 9 -->

- **Always** use a tabela semântica fixa: emerald = ok, pass e embedding; rose = erro e falha; red = contagem de erro em célula; amber = aviso, abortado e agente; violet = llm; blue = tool; sky = sessões; orange = agentes; fuchsia = evals; yellow = alertas; lime = "varia por run". Paleta neutra `--chart-1..5` (cinzas iguais nos dois temas) para série sem semântica; `var(--destructive)` para erro em gráfico.
- **Always** tinja no par que lê nos dois temas: tile `bg-{c}-100 dark:bg-{c}-950 text-{c}-500`, texto `text-{c}-600 dark:text-{c}-400`, badge `bg-{c}-500/10 text-{c}-700 dark:bg-{c}-500/15 dark:text-{c}-300`.
- **Always** faça tile de ícone 18px com `bg-{c}-100 dark:bg-{c}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{c}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)` (apps/web/src/components/app/nav.ts:43-44; `navTile(color)` no `app-shell`): anel interno a 14% e drop a 25% no light, token neutro no dark.
- **Always** centralize "o que cada opção significa" num `.ts` sem JSX (ícone, `badgeVariant`, cor, unidade), consumido por lista, dialog e detalhe; cor por entidade é hash determinístico (djb2) sobre 16 tons `*-500`; escala de calor por quintil `text-green-600 dark:text-green-400` até `text-red-600 dark:text-red-400`, classes literais para o Tailwind enxergar.
- **Never** invente cor por tela, use `slate` para "outro" (é `neutral`), ou coloque cor cromática num gráfico sem significado fixo.

Porquê: a tabela cinza deixa a cor contar a história; se cada tela escolhesse o próprio verde, verde deixaria de significar "ok".

## Do guia: 04. Dados: tabela, números, chips e gráficos

### As cinco regras desta camada

- Número é `tabular-nums` e coluna numérica é alinhada à direita: `TableCell align="right"` injeta `text-right tabular-nums` (registry/base-vega/ui/table.tsx:17-21). Não há regra global no CSS; é classe a classe.
- Valor ausente nunca vira zero. No lume o placeholder é o texto `sem dado` (`EMPTY`, registry/base-vega/lib/format.ts:14) em `text-muted-foreground/50`; o Foglamp usava o travessão, que o lume não usa em lugar nenhum (adição do lume).
- Cor cromática só com significado: tabela em cinza, custo e latência por quintil (`HeatCell`), erro em red/rose, aborto em amber, tipo em violet/blue/amber/emerald. Série de gráfico neutra é `var(--chart-2)`.
- Nada teleporta: número anima 0,6 s (`number-ticker`), gráfico segura a view anterior no refetch (`useFrozen` + `isUpdating`), skeleton só após 700 ms (`use-delayed-loading`).
- Estado de lista vive na URL (`useUrlFilters`, registry/base-vega/blocks/data-table/url-filters.ts:44): filtro, busca, ordenação e página sobrevivem a reload e viram link.

### `format.ts` função por função (`format`)

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

### StatCard e NumberTicker

| Peça | Valor exato |
|---|---|
| `NumberTicker` (registry/base-vega/components/number-ticker.tsx:50-55) | `animate(from, value, { duration: 0.6, ease: "easeOut", onUpdate, onComplete })` do `motion/react`; primeira pintura estática, só mudanças animam; `format` padrão `formatExactCount`; com `useReduce()` pula para o valor final (:46-49) |
| `DeltaBadge` (stat-card.tsx:182) | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px`; bom `text-emerald-600 dark:text-emerald-500`, ruim `text-red-500 dark:text-red-500`; seta `size-3.75 stroke-[1.6]`; flat `~0%` em `text-xs font-medium tabular-nums text-muted-foreground mt-px`; `title` padrão "vs. período anterior" |
| Ícones canônicos de stat | tokens `IconCirclesFilled text-sky-400 dark:text-sky-500`; custo `IconCoinFilled text-amber-400 dark:text-yellow-500` + `deltaInverted`; pass rate `IconGaugeFilled text-fuchsia-400 dark:text-fuchsia-500`; erro `IconAlertTriangleFilled text-red-500/90 dark:text-red-600/95 mt-px` + `deltaInverted`; latência `IconClockFilled text-sky-400 dark:text-sky-500`; volume `IconBoltFilled text-orange-500` (overview-client.tsx:801-877) |
| `CardSparkline` (card-sparkline.tsx:18) | `viewBox 0 0 100 32`, `PAD = 3`, linha `strokeWidth 1.2` `strokeOpacity 0.5`, gradiente `currentColor` 0,4 a 0,1; cor pela classe `text-*` do consumidor; abaixo de 2 pontos cai no `CardSparklinePlaceholder` (:105) |
| `PillMeter` (pill-meter.tsx:33-40) | 32 cápsulas `flex-1 rounded-full` em `flex h-3.5 items-stretch gap-0.75`; acesa `bg-current`, apagada `bg-muted-foreground/10`; fração positiva acende ao menos uma |

### HeatCell: cor por quintil

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

### Chips (`context-chip`, `span-type`, `badge`)

- `CHIP_SURFACE` (registry/base-vega/components/context-chip.tsx:12-13) = `bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`: sempre sobre `Button variant="outline"`. É o trigger do `FilterSelect` sem as partes de dropdown: hover instantâneo, sem press scale, borda trocada por sombra no dark.
- `CHIP_ERROR` = `border-rose-500/40 text-rose-600 dark:text-rose-400 dark:shadow-[0_0_0_1px_rgba(244,63,94,0.4)]`; `CHIP_ABORTED` idem em amber `rgba(245,158,11,0.4)` (:19-22).
- `ContextChip({ href?, icon, iconClassName?, label })` (:104): `max-w-xs justify-start` + `CHIP_SURFACE`; ícone `size-3.5 shrink-0`; com `href` vira `render={<Link href />}` e ganha `IconArrowUpRight size-3.5 shrink-0 -ml-0.5 mt-px text-muted-foreground`; sem `href`, `render={<div />}` + `pointer-events-none`.
- `Chip({ icon?, label, trailing?, tone, href?, onClick? })` (:29): `size="xs"` + `max-w-64 justify-start` + `CHIP_SURFACE` + `dark:bg-muted-foreground/10 dark:hover:bg-muted-foreground/20`; `trailing` em `shrink-0 tabular-nums text-muted-foreground` (duração, `×N`).
- `Badge` (registry/base-vega/ui/badge.tsx:10-51): 14 variants, as 11 cromáticas no padrão `bg-<cor>-500/10 text-<cor>-700 shadow-[var(--custom-shadow-<cor>)] dark:bg-<cor>-500/15 dark:text-<cor>-300` (rose e red `dark:text-<cor>-400`; orange `text-orange-600 dark:bg-orange-600/15 dark:text-orange-400`); tamanhos `sm` `h-4 px-1.5 gap-1 text-[10px]`, `md` `h-5 px-2 gap-[5px] text-xs`, `lg` `h-6 px-2.5 gap-1.5 text-sm`. A base é `capitalize`: texto técnico precisa de `normal-case` (ex. `Badge variant="sky" size="sm" className="font-mono normal-case tabular-nums"` para versão).

### Chips (`context-chip`, `span-type`, `badge`)

| Tipo | Badge | Ícone | Barra | Chip só ícone (`SpanTypeChip`, `flex size-4.5 shrink-0 items-center justify-center rounded-md corner-squircle`, ícone `size-3`) |
|---|---|---|---|---|
| llm | `violet` | `IconSparkles` | `bg-violet-500` | `bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.14),0_2px_6px_-2px_rgba(139,92,246,0.25)] dark:shadow-(--custom-shadow)` |
| tool | `blue` | `IconTool` + `fill-current` (Tabler não tem `IconToolFilled`) | `bg-blue-500` | mesma receita em `rgba(59,130,246,...)` |
| agent | `amber` | `IconGhost` | `bg-amber-500` | `rgba(245,158,11,...)` |
| embedding | `emerald` | `IconVector` | `bg-emerald-500` | `rgba(16,185,129,...)` |
| other | `secondary` | `IconCircleDashed` | `bg-neutral-500` (Foglamp: slate; o lume usa neutral) | `bg-neutral-500/15 text-neutral-600 dark:text-neutral-400` + `rgba(115,115,115,...)` |

### Paleta de gráficos e evilcharts (`kit-graficos`)

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
