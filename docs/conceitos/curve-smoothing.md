# Curve smoothing

Adição do lume. Fontes: Shu Ding, Adaptive Polynomial Curve Fitting,
https://shud.in/thoughts/adaptive-polynomial-curve-fitting; Benji Taylor, Liveline,
https://benji.org/liveline. O craft tem o rascunho não publicado "Curve Smoothing"
(`content/data/curve-smoothing.mdx`), sem revisão do autor; a fonte primária aqui é o Shu. Status no
Foglamp: ausente (o `card-sparkline` desenha a série bruta e o `formatDelta` compara dois totais).
Recomendação ainda sem código.

## Regra

Uma sparkline de tráfego por hora é ruído: a linha serrilha, e um delta calculado sobre o primeiro e
o último ponto muda de sinal conforme a hora em que você abre a página. O Shu encontrou isso no Vercel
Analytics e resolveu com regressão polinomial adaptativa: ajusta um polinômio aos pontos, mas a ordem
não é fixa. Para cada ordem candidata, divide os pontos em índices ímpares e pares, ajusta num grupo e
mede o erro no outro, nos dois sentidos, e guarda o pior dos dois erros; a ordem vencedora é a de
menor pior erro. Isso evita o overfit (ordem alta demais acompanha o ruído e erra feio no grupo que
não viu) sem um parâmetro escolhido no olho. A curva de tendência é desenhada sobre os pontos reais,
não no lugar deles, e o delta passa a ser medido na tendência (fim contra começo da curva ajustada),
que é estável. O Benji acrescenta as regras de gráfico ao vivo do Liveline: um só sistema de movimento
(eixo, grade e rótulo com a mesma interpolação) e nunca clipar a linha, porque um pico cortado pelo
container mente sobre o dado.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Método | regressão polinomial sobre a série; ordem escolhida por validação cruzada ímpar e par | Shu |
| Escolha da ordem | para cada ordem candidata: ajusta nos índices ímpares e mede nos pares, e vice-versa; guarda o pior erro quadrático médio; vence a ordem de menor pior erro | Shu |
| Desenho | tendência por cima dos pontos reais (bruto atenuado, tendência firme), nunca no lugar deles | Shu |
| Delta | medido sobre a tendência (último contra primeiro ponto da curva ajustada), não sobre o primeiro e o último ponto brutos | Shu |
| Movimento | um só sistema por gráfico: eixo, grade e rótulo com o mesmo lerp; defaults quietos; congela ao pausar | Benji, Liveline |
| Clipping | a linha nunca é cortada pelo container; o pico aparece inteiro | Benji, Liveline |
| Hoje no lume: traçado | `card-sparkline` liga os pontos brutos com `M` e `L`, área até a base, `preserveAspectRatio="none"`, sem suavização | registry/base-vega/components/card-sparkline.tsx:36-50 |
| Hoje no lume: clipping | `overflow-visible` no `svg` e `PAD` de 3 px no topo: o pico já não é cortado | registry/base-vega/components/card-sparkline.tsx:33,57-61 |
| Hoje no lume: delta | `formatDelta(current, previous)` compara dois totais (período atual contra anterior), não dois pontos de série; `null` sem base de comparação | registry/base-vega/lib/format.ts:241-252 |
| Hoje no lume: bucket incompleto | `dashedLast` traceja o último segmento para dizer que o bucket ainda enche | registry/base-vega/components/card-sparkline.tsx:52-53 |

**Always**: para série por hora ou por minuto, delta sobre a tendência ou sobre totais de período
(como o `formatDelta` faz), nunca sobre dois pontos brutos; tendência desenhada por cima do bruto;
`overflow-visible` e padding no topo. **Never**: ordem polinomial fixa escolhida no olho; suavização
que esconde o bruto; `overflow-hidden` em gráfico de linha; dois ritmos de interpolação no mesmo
widget.
<!-- skill:end -->

## Onde aparece no Foglamp

Não aparece. `apps/web/src/components/app/page-parts.tsx:354-491` (origem do `card-sparkline`)
desenha a série bruta; os gráficos do evilcharts desenham por recharts sem ajuste de curva;
`formatDelta` em `lib/format.ts` compara totais de período.

## No lume

- Itens: `card-sparkline`, `stat-card` (recebe o `Delta`), `format` (`formatDelta`), `kit-graficos`.
- FRONTEND.md: seções Números, datas e formatação e Páginas: header, stat cards, grids. Guia: `docs/guia/04-dados.md`.
- Recomendação sem código: um `smoothSeries(points)` em módulo próprio da registry, com a validação ímpar e par do Shu, e uma prop `trend` no `card-sparkline` que desenha a tendência por cima. Até existir, a sparkline fica bruta e o delta fica por período, que é estável por construção.
