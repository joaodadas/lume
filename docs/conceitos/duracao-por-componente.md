# Duração por componente

Adição do lume. Fontes: Emil Kowalski, Agents with Taste, https://emilkowal.ski/ui/agents-with-taste,
e 7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips; Raphael Salaja, To
Spring or Not To Spring, https://www.userinterface.wiki/to-spring-or-not-to-spring. Status no
Foglamp: parcial (press 150 ms, tooltip 150, popups 100, sheet 200, drawer 300 e accordion 300 cabem
nas faixas; o dialog em 100 ms fica abaixo da faixa dos dois autores e a saída dura o mesmo que a
entrada).

## Regra

O `lib/motion.ts` diz que UI de produto fica entre 0.12 e 0.25 s. É verdade e é pouco: um press e um
drawer não têm o mesmo tempo. Emil e Raphael publicaram tabelas quase iguais, e juntas dão uma faixa
por componente: quanto maior a superfície e mais longa a distância, mais tempo; quanto mais frequente,
menos. Duas regras acompanham os números. A saída é mais rápida que a entrada (o Emil fecha em cerca
de 20 por cento): o que sai já cumpriu o papel e não merece cerimônia. E "se parece lento, encurte a
duração antes de trocar a curva" (Raphael): a curva muda o caráter, a duração muda a espera, e quase
sempre o problema é a espera. A família de easing segue o tipo de movimento: entrar e sair pede
ease-out (chega rápido e assenta), mover ou mudar de forma em tela pede ease-in-out, cor pede o ease
padrão, e linear só quando o movimento representa tempo (barra de progresso, contador de duração),
porque linear em qualquer outro lugar lê como mecânico.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Press e hover | 100 a 180 ms (Emil 100 a 160, Raphael 120 a 180) | Agents with Taste; To Spring or Not To Spring |
| Tooltip | 125 a 200 ms | Emil |
| Dropdown, select, popover, estado pequeno | 150 a 260 ms (Emil 150 a 250, Raphael 180 a 260) | Emil; Raphael |
| Modal e drawer | 200 a 300 ms; até 500 quando há arraste (o drawer do Emil usa 500 com `cubic-bezier(0.32, 0.72, 0, 1)`) | Emil, Building a Drawer Component |
| Saída | cerca de 20 por cento mais rápida que a entrada | Emil, Agents with Taste |
| Se parece lento | encurte a duração antes de trocar a curva | Raphael |
| Família por tipo | entra e sai: ease-out; move ou muda de forma em tela: ease-in-out; cor: ease; linear só para movimento que representa tempo | Emil (fluxograma de easing); Raphael |
| Nunca ease-in | entrada com ease-in começa parada e chega atrasada | Emil, 7 Practical Animation Tips |
| Press no Foglamp | `active:scale-[0.97]` com `transition-all hover:duration-150`: 150 ms | registry/base-vega/ui/button.tsx:10 |
| Tooltip no Foglamp | sem classe de duração: 150 ms padrão do `tw-animate-css` | registry/base-vega/ui/tooltip.tsx:58 |
| Dropdown, select, popover, context menu | `duration-100` | registry/base-vega/ui/dropdown-menu.tsx:47; select.tsx:133; popover.tsx:42; context-menu.tsx:58 |
| Dialog | `duration-100` entrando em `zoom-in-[96%]` e saindo em `zoom-out-[99%]` (abaixo da faixa dos autores; o código vence) | registry/base-vega/ui/dialog.tsx:36,58 |
| Sheet | `transition duration-200 ease-in-out` | registry/base-vega/ui/sheet.tsx:61 |
| Drawer | `duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`: a curva do Emil em 300 em vez de 500 porque o lume não tem arraste | registry/base-vega/ui/drawer.tsx:60 |
| Accordion | `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` (a mesma curva de `EASE`) | registry/base-vega/ui/accordion.tsx:67 |
| Sidebar | `transition-[left,right,width] duration-200 ease-linear` (linear sem representar tempo: herança do shadcn, contra a regra) | registry/base-vega/ui/sidebar.tsx:235 |
| Motion | UI 0.12 a 0.25 s (Clear filters 0.13, pílula 0.2, largura de painel 0.25); dados 0.5 a 1 s (`number-ticker` 0.6); acima de 1 s só marketing | registry/base-vega/lib/motion.ts:9-11; components/number-ticker.tsx:51 |

**Always**: escolha a faixa pelo componente, depois a família pelo tipo de movimento; saída mais
curta que a entrada quando o primitivo permitir (duração própria em `data-closed:` no CSS novo);
ease-out para entrar e sair; `EASE`, `ENTRANCE_EASE` ou `REVEAL_EASE` em Motion, nunca uma curva
nova. **Never**: acima de 300 ms em UI de produto sem arraste; ease-in em entrada; linear em algo que
não é tempo; trocar a curva para "consertar" um movimento que só está longo; a mesma duração para um
tooltip e um drawer.
<!-- skill:end -->

## Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8` (press em 150 ms), `tooltip.tsx` (150 pelo padrão da lib),
`dropdown-menu.tsx`, `select.tsx`, `popover.tsx` e `dialog.tsx` em `duration-100`, `sheet.tsx` em
200, `accordion.tsx` em 300 com a curva de `EASE`. Em Motion, `apps/web/src/components/app/data-table.tsx`
(0.13 s), `theme-switcher.tsx` (pílula 0.2 s), `copy-icon.tsx` (0.25 s), `marketing/demo/entrance.ts`
(1.7 s e 1.1 s, só marketing). Nenhum primitivo encurta a saída: o dialog encurta a amplitude
(`zoom-out-[99%]`) no lugar do tempo.

## No lume

- Itens: `motion` (`lib/motion.ts` é o vocabulário; esta tabela são as faixas), `button`, `tooltip`, `dropdown-menu`, `select`, `popover`, `dialog`, `sheet`, `drawer`, `accordion`, `sidebar`, `number-ticker`, `data-table`.
- FRONTEND.md: seções Movimento (durações de UI entre 0.12 e 0.25 s, saída mais curta que a entrada) e Overlays e menus (popups em `duration-100`). Guia: `docs/guia/09-movimento.md` (vocabulário de easings e durações).
- Antes desta tabela vem [Frequência decide](frequencia-decide.md): a duração só interessa depois de decidir que a interação anima.
