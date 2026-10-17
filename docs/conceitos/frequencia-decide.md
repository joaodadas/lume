# Frequência decide

Adição do lume. Fontes: Emil Kowalski, You Don't Need Animations,
https://emilkowal.ski/ui/you-dont-need-animations, e a tabela de frequência da skill emil-design-eng,
https://github.com/emilkowalski/skills; Jakub Krehel, Less is more, more or less,
https://jakub.kr/writing/less-is-more; Rauno Freiberg, Invisible Details of Interaction Design,
https://rauno.me/craft/interaction-design; Benji Taylor, Family Values, https://benji.org/family-values;
Raphael Salaja, To Spring or Not To Spring, https://www.userinterface.wiki/to-spring-or-not-to-spring.
Status no Foglamp: parcial (hover instantâneo, popups de 100 ms e filtro de tabela sem animação; a
sidebar ainda desliza por atalho e o dialog anima igual na décima abertura).

## Regra

Antes de perguntar "qual curva" pergunte "quantas vezes por dia". Uma animação de 300 ms é agradável
na primeira vez e invisível na décima; na centésima ela é só espera. O Emil fecha isso em quatro
faixas por frequência de uso; o Jakub faz a conta (200 aberturas de context menu por dia vezes 300 ms
dá perto de 1 minuto por dia, cerca de 6 horas por ano, num menu que ninguém pediu para ver animar);
o Rauno põe frequência e novidade em lados opostos da mesma balança; o Benji desenha a Delight-Impact
Curve (quanto menos frequente a função, mais delight ela aguenta); o Raphael lista o que nunca anima:
digitação, navegação por teclado, toggles rápidos e a entrada de um context menu. Os cinco chegam ao
mesmo lugar por caminhos diferentes, e por isso esta é a primeira regra de movimento do lume, antes de
duração e de easing.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| 100 ou mais vezes por dia (hover, digitação, setas, troca de aba, context menu, atalho) | nenhuma animação | Emil, tabela de frequência |
| Dezenas por dia (dropdown, select, filtro, tooltip, toggle) | remover ou reduzir muito: até 150 ms, só opacidade e fundo | Emil; Jakub (feedback instantâneo ou até 150 ms em opacity e background-color) |
| Ocasional (dialog, drawer, troca de página, painel lateral) | padrão: 200 a 300 ms | Emil |
| Raro (onboarding, primeiro sucesso, estado vazio, revelação de chave) | pode ter delight | Emil; Benji, Delight-Impact Curve |
| A conta | 200 aberturas por dia vezes 300 ms: cerca de 1 min por dia, cerca de 6 h por ano | Jakub |
| Nunca anima | digitação, navegação por teclado, toggles rápidos, entrada de context menu | Raphael |
| Frequência contra novidade | ação feita centenas de vezes não anima; a novidade que encanta hoje é a taxa de amanhã | Rauno |
| Hover instantâneo | `hover:bg-sidebar-accent` no botão da sidebar, que só transiciona `transition-[width,height,padding]` | registry/base-vega/ui/sidebar.tsx:480 |
| Popup frequente | `duration-100` em dropdown, select, popover, context menu, hover card e menubar; o tooltip não tem classe de duração e fica nos 150 ms padrão do `tw-animate-css` | registry/base-vega/ui/dropdown-menu.tsx:47; select.tsx:133; popover.tsx:42; tooltip.tsx:58 |
| Filtro de tabela | as linhas trocam sem transição; só o botão Limpar entra em 0.13 s com `easeOut` | registry/base-vega/blocks/data-table/data-table.tsx:659-662 |
| Valor que muda em stat card | `number-ticker` anima 0.6 s só quando o valor muda depois do mount; a primeira pintura é estática | registry/base-vega/components/number-ticker.tsx:50-54 |

**Always**: classifique a interação pela faixa antes de animar; na faixa alta, feedback por cor ou
fundo sem transição (`transition-none` ou nada); na faixa média, `duration-100` e só opacidade e
escala leve; delight só na faixa rara, e uma vez. **Never**: animação em digitação, foco por teclado,
setas, troca de aba ou atalho; `transition-all` em item de lista; o mesmo movimento de 300 ms num
menu que abre cem vezes por dia; julgar a animação pela primeira impressão em vez de pela centésima.
<!-- skill:end -->

## Onde aparece no Foglamp

Parcial. A favor: `packages/ui/src/components/sidebar.tsx` (hover sem transição), os popups de
`packages/ui` em 100 ms, `apps/web/src/components/app/data-table.tsx` (o filtro troca as linhas a
seco, só o Clear filters entra em 0.13 s), `org-settings-client.tsx:158-166` (texto da tab vira sem
fade), `checkbox.tsx:20` e `range-picker.tsx:205` com `transition-none`, `copy-icon.tsx` com
`initial={false}`. Contra: a sidebar desliza 200 ms mesmo por Cmd/Ctrl+B (`sidebar.tsx:235`) e
`transition-colors` em 63 lugares.

## No lume

- Itens: `sidebar`, `dropdown-menu`, `select`, `popover`, `tooltip`, `data-table`, `number-ticker`, `checkbox`, `range-picker`, `motion` (o comentário de `lib/motion.ts` fixa as faixas de duração; a tabela acima diz quando a duração é zero).
- FRONTEND.md: seções Movimento (hover instantâneo ou só de cor, `initial={false}` no que já está no lugar) e Overlays e menus (string canônica de popup em `duration-100`). Guia: `docs/guia/09-movimento.md`.
- Conceitos vizinhos: [Hover Restraint](hover-restraint.md) (a faixa alta aplicada ao hover), [Duração por componente](duracao-por-componente.md) (quanto, depois de decidir se) e [Novelty budget](novelty-budget.md) (o lado da novidade na balança do Rauno).
