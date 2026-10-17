# Hit areas

Adição do lume. Fontes: Jakub Krehel, better-accessibility, https://github.com/jakubkrehel/skills;
Rauno Freiberg, Web Interface Guidelines (2023), https://interfaces.rauno.me, Field Note 5,
https://rauno.me/notes/5, e o capítulo grátis do Devouring Details,
https://devouringdetails.com/prototypes/nextjs-dev-tools; Raphael Salaja, Laws of UX,
https://www.userinterface.wiki/laws-of-ux, e Taking Advantage of Pseudo Elements,
https://www.userinterface.wiki/taking-advantage-of-pseudo-elements; Emil Kowalski, Agents with Taste,
https://emilkowal.ski/ui/agents-with-taste. Status no Foglamp: parcial (checkbox, radio e switch
expandem por pseudo-elemento; o lume estende ao botão `icon-xs`; itens de menu e de lista dependem do
padding).

## Regra

O alvo clicável não precisa ter o tamanho do desenho. Um checkbox de 16 px, um ícone de 12 px e um
controle de 24 px são pequenos por hierarquia visual, não porque alguém quer errar o clique. Os
mínimos são conhecidos (24 px para AA na WCAG 2.5.8, 40 px como alvo em desktop, 44 em touch) e o
jeito de chegar lá sem engordar o desenho é um pseudo-elemento absoluto com inset negativo: não entra
no layout, não cria nó no DOM e herda o clique do pai. O Rauno acrescenta três regras de composição:
sem área morta entre itens de uma lista (o padding do item é o alvo, não o texto), hit areas
concêntricas (a expansão cresce igual em volta do desenho, para o alvo ter o mesmo centro) e botões
sempre irmãos, nunca aninhados (um botão dentro de outro quebra teclado, leitor de tela e o próprio
clique). O Raphael dá a mesma receita pela lei de Fitts: o tempo para acertar cai com o tamanho do
alvo, e `::before` ou `::after` é tamanho de graça.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Mínimos | 24 px (AA, WCAG 2.5.8); 40 px alvo em desktop; 44 px em touch | Jakub, better-accessibility; Emil (44 px) |
| Lista | sem área morta entre itens: o padding é clicável, não só o rótulo | Rauno, interfaces |
| Concêntrico | a expansão cresce igual em todos os lados, mesmo centro do desenho | Rauno, Devouring Details |
| Composição | botões sempre irmãos; nunca `button` dentro de `button` ou de linha clicável sem parar o evento | Rauno, Devouring Details |
| Técnica | pseudo-elemento absoluto com inset negativo, sem nó extra; o pai precisa de `position: relative` | Raphael, Pseudo Elements; Fitts em Laws of UX |
| Checkbox, radio e switch | `after:absolute after:-inset-x-3 after:-inset-y-2` num controle `size-4`: alvo de 40 por 32 px a partir de 16 (não concêntrico de propósito: cresce mais na horizontal, onde fica o rótulo) | registry/base-vega/ui/checkbox.tsx:15; radio-group.tsx:25; switch.tsx:21 |
| Botão de ícone menor | `relative after:absolute after:-inset-1 size-6`: 24 px visíveis, 32 de alvo, concêntrico | registry/base-vega/ui/button.tsx:43 |
| Demais botões | `h-8` (32 px) no default e no `icon`, `h-7` no `sm`, `h-6` no `xs`; abaixo dos 40 do Jakub porque o Foglamp é denso e de ponteiro fino | registry/base-vega/ui/button.tsx:34-46 |
| Item de menu | `px-2 py-1.5 text-sm`: 32 px de altura, sem área morta entre itens | registry/base-vega/ui/dropdown-menu.tsx:96 |
| Linha clicável | a linha inteira é o alvo (`data-interactive:cursor-pointer`), e os links dentro param a propagação para não disparar a linha | registry/base-vega/ui/table.tsx:170; blocks/data-table/data-table.tsx:175 |
| Alça de resize | `after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2` num divisor `w-px` | registry/base-vega/ui/resizable.tsx:40 |

**Always**: pseudo-elemento com inset negativo em todo controle visível abaixo de 24 px e em botão
de ícone pequeno; o item de lista inteiro clicável, com padding em vez de margem entre itens; botões
como irmãos, ações de linha com `stopPropagation`. **Never**: aumentar o ícone para aumentar o alvo;
`button` aninhado; margem entre itens de menu (vira área morta); `pointer-events-none` num
pseudo-elemento que deveria receber o clique.
<!-- skill:end -->

## Onde aparece no Foglamp

`packages/ui/src/components/checkbox.tsx`, `radio-group.tsx` e `switch.tsx` com
`after:absolute after:-inset-x-3 after:-inset-y-2` (o mapa 3.4 lista a receita como Hit Areas,
rascunho não publicado do craft). O `Button` do Foglamp não expande o `icon-xs`: a expansão é adição
do lume na v0.2.0. Itens de menu e de sidebar fazem o alvo pelo padding (`p-2` no botão da sidebar,
`px-2 py-1.5` no item de menu).

## No lume

- Itens: `checkbox`, `radio-group`, `switch`, `button` (`icon-xs`), `dropdown-menu`, `table`, `data-table`, `resizable`.
- FRONTEND.md: seções Botões (sizes), Acessibilidade e teclado (linha operável por teclado, `stopPropagation` nos links da linha) e Campos e formulários. Guia: `docs/guia/02-primitivos.md`.
- Fora do app: a regra de 44 px em touch vale para o `drawer` e qualquer tela que também abra no celular; o Foglamp é desktop e fica em 32.
