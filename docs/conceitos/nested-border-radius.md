# Nested Border Radius

Original: https://craft.gustavofior.com/nested-border-radius (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/nested-border-radius.mdx. Seção:
Layout. Status no Foglamp: integral (mapa 3.4).

## Regra

Quando uma caixa arredondada fica dentro de outra, o raio de dentro é o de fora menos a distância
entre as bordas (padding do pai, mais a borda se houver): `inner = outer - inset`, com piso zero
(`max()` em CSS). Raio igual nos dois faz o espaço engordar no canto, e isso é uma das coisas
pequenas que deixam uma interface "esquisita". Começando pelo componente externo, o caso de um
design system, a conta é a mesma invertida. Com squircle (`corner-shape: squircle`) a regra
continua, e o `corner-squircle` precisa ser setado nos dois níveis (não herda). O nome técnico é
concentric corners. A fórmula é ponto de partida: quando o filho não chega ao canto ou o inset muda
em volta, ajuste no olho.

## Valores

<!-- skill:start -->
Escala do lume (registry/base-vega/styles/globals.css:46,261-267): `--radius: 0.625rem` (10px); `sm`
6px, `md` 8px, `lg` 10px, `xl` 14px, `2xl` 18px, `3xl` 22px, `4xl` 26px. O squircle parece mais
apertado no mesmo raio, por isso cada par plano/squircle sobe o raio na variante `squircle:`.

| Par externo e interno | Classes exatas | Arquivo |
|---|---|---|
| Canvas e inset do shell | canvas com `m-2`; inset `md:rounded-lg squircle:md:rounded-3xl` | registry/base-vega/blocks/app-shell/app-shell.tsx:215 |
| Card e imagem interna | `rounded-lg squircle:rounded-3xl corner-squircle` e `*:[img:first-child]:rounded-t-3xl *:[img:first-child]:corner-squircle` (imagem encosta na borda: inset 0, mesmo raio) | registry/base-vega/ui/card.tsx:17 |
| Popover e preset do range picker | popover `rounded-lg squircle:rounded-3xl` com coluna `p-3`; preset `rounded-sm squircle:rounded-xl corner-squircle` (comentário: raio do popover menos os 12px de padding, com piso onde o plano ficaria negativo) | registry/base-vega/ui/popover.tsx:42; blocks/range-picker/range-picker.tsx:191-194 |
| Lista de tabs e trigger | lista `rounded-md squircle:rounded-2xl corner-squircle ... p-[3px]`; trigger `rounded-md squircle:rounded-xl corner-squircle` | registry/base-vega/ui/tabs.tsx:29,63 |
| Input group e botão interno | grupo `h-9 ... rounded-md squircle:rounded-xl corner-squircle`; botão `xs` e `icon-xs` `rounded-[calc(var(--radius)-5px)]`; `kbd` idem | registry/base-vega/ui/input-group.tsx:19,28,75,78 |
| Command e item | `rounded-lg squircle:rounded-3xl! corner-squircle ... p-1`; item `rounded-lg`, e `in-data-[slot=dialog-content]:rounded-2xl!` quando o command vira dialog | registry/base-vega/ui/command.tsx:30,161 |
| Dialog | `rounded-2xl squircle:rounded-[40px] corner-squircle ... p-6` | registry/base-vega/ui/dialog.tsx:58 |
| Tile de ícone da nav dentro do botão | tile `rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle`; botão `rounded-md squircle:rounded-xl corner-squircle p-2` | registry/base-vega/blocks/app-shell/nav.ts:39; ui/sidebar.tsx:480 |

**Always**: calcular o raio interno a partir do pai e do padding; `corner-squircle` nos dois níveis;
piso `rounded-sm` quando a conta dá zero ou negativo. **Never**: o mesmo `rounded-*` no pai e no
filho com padding entre eles; raio fora da escala (`rounded-[7px]`) sem comentário com a conta;
`corner-squircle` só no pai esperando que o filho herde.
<!-- skill:end -->

## Onde aparece no Foglamp

`apps/web/src/components/app/range-picker.tsx:189-192` é o único lugar com a conta escrita em
comentário ("Concentric with the popover: its radius (8px, 24px squircle) minus this column's 12px
padding"); `packages/ui/src/components/input-group.tsx:26,73,76` usam
`rounded-[calc(var(--radius)-5px)]` para o que fica dentro do grupo; a escala `--radius-sm..4xl`
derivada de `--radius` está em `packages/ui/src/styles/globals.css:266-272`. Os raios do comentário
do range picker (8px e 24px) não batem com o popover atual (`rounded-lg squircle:rounded-3xl`, 10px
e 22px): o comentário ficou de uma versão anterior, a regra é a mesma e o `xl` do preset foi
decidido no olho.

## No lume

- Itens: `base` (escala), `card`, `popover`, `dialog`, `tabs`, `input-group`, `command`, `app-shell`, `range-picker`.
- FRONTEND.md: seção 5 (Raio e squircle: pares canônicos; `corner-round!` só em BorderBeam e pílulas) e seção 13 (Shell e sidebar). Guia: `docs/guia/01-fundacoes.md` (tabela de raios em px e pares squircle).
- Ferramenta para conferir: Corner Radii (link em `docs/referencias.md`). O squircle só existe no Chromium hoje; nos outros browsers cai no raio plano, e é por isso que o par precisa fechar nas duas variantes.
