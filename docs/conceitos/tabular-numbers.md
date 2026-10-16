# Tabular Numbers

Original: https://craft.gustavofior.com/tabular-numbers (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/tabular-numbers.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

## Regra

Dígitos têm duas larguras: proporcional (o `1` é estreito, o `8` é largo) e tabular (todos com a
mesma largura). Texto corrido usa proporcional, que lê mais natural. Qualquer número que muda no
lugar (relógio, contador, preço, métrica ao vivo) ou que se empilha em coluna usa `tabular-nums`,
senão o que está ao lado treme a cada atualização e a coluna não forma grade vertical. Coluna
numérica também vai alinhada à direita, para números de tamanhos diferentes ancorarem na mesma
borda. Não troque para `font-mono` só para alinhar: mono muda a voz da interface inteira; o que você
quer é só a feature `tnum` da fonte.

## Valores

<!-- skill:start -->
| Onde | String exata | Arquivo |
|---|---|---|
| Coluna numérica (`TableCell align="right"`) | `text-right tabular-nums` | registry/base-vega/ui/table.tsx:20 |
| Valor do stat card | `tracking-tight tabular-nums` (no `CardTitle`) | registry/base-vega/components/stat-card.tsx:134 |
| Delta do stat card | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px` | registry/base-vega/components/stat-card.tsx:204 |
| Count-up | `NumberTicker` já aplica `tabular-nums`; `className` só para tamanho e cor | registry/base-vega/components/number-ticker.tsx:59 |
| Contagem e paginação da tabela | `text-xs text-muted-foreground/50 tabular-nums` | registry/base-vega/blocks/data-table/data-table.tsx:715,741 |
| Gatilho do range picker | `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 ...` | registry/base-vega/blocks/range-picker/range-picker.tsx:53 |
| Contador do chip de contexto | `shrink-0 tabular-nums text-muted-foreground` | registry/base-vega/components/context-chip.tsx:55 |
| Tooltip de gráfico | `font-mono font-medium text-foreground tabular-nums` | registry/base-vega/ui/chart.tsx:258 |
| Eixo Y do evilcharts | `[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-value]:tabular-nums` | registry/base-vega/components/evilcharts/core/chart.tsx:125 |
| Badge de contagem na sidebar | `... text-xs font-medium text-sidebar-foreground tabular-nums select-none ...` | registry/base-vega/ui/sidebar.tsx:595 |
| Tabela dentro de markdown | `w-full border-collapse text-xs tabular-nums` | registry/base-vega/components/markdown-components.tsx:47 |

**Always**: `tabular-nums` em todo número que muda ou que se empilha; coluna numérica com
`align="right"` no `TableCell`. **Never**: `font-mono` como atalho de alinhamento; `text-center` em
coluna numérica; número proporcional em timer, contador ou badge de contagem.
<!-- skill:end -->

A fonte precisa ter `tnum`. A Inter Variable do `base` (registry/base-vega/styles/globals.css:9)
tem; se trocar a fonte, confira a feature no Wakamai Fondue (https://wakamaifondue.com) antes de
confiar na classe.

## Onde aparece no Foglamp

157 ocorrências de `tabular-nums` nos `.tsx` de `apps/web/src` e `packages/ui/src` (162 no grep com
`-a` do mapa). As canônicas: `apps/web/src/app/(app)/traces/traces-client.tsx:894,897`
(`TableCell className="text-right tabular-nums"`, colunas de custo e duração),
`workflows/workflows-client.tsx:315,318` (`align="right" className="tabular-nums"`),
`traces/[traceId]/trace-detail-client.tsx:726` (linha de metadados
`text-[11px] text-muted-foreground tabular-nums`) e `:999` (chip
`cursor-help rounded px-1 py-px text-[10px] font-medium tabular-nums`).

Gotcha herdado: o Foglamp nunca mapeia `--font-mono` (mapa 4.11), então o `font-mono` do tooltip de
gráfico caía na pilha padrão; o lume mapeia Geist Mono Variable (styles/globals.css:228-230).

## No lume

- Itens: `table` (o `align="right"` já traz a classe), `data-table`, `stat-card`, `number-ticker`, `context-chip`, `format` (toda função devolve string pronta para um `span` tabular).
- FRONTEND.md: seção 15 (Tabelas e filtros) e seção 17 (Números, datas e formatação). Guia: `docs/guia/04-dados.md`.
- Valor nulo é o texto `sem dado` em `text-muted-foreground/50` (docs/DECISOES.md), também dentro da coluna tabular, para a célula não colapsar nem mudar de alinhamento.
