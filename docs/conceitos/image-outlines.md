# Image Outlines

Original: https://craft.gustavofior.com/image-outlines (Gustavo Fior, MIT; o autor credita Jakub
Krehel). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/color/image-outlines.mdx. Seção: Color.
Status no Foglamp: integral (mapa 3.4).

## Regra

Imagem não sabe o que tem atrás: céu claro em card branco não tem borda, foto com canto claro se
funde na página, avatar com inicial branca flutua. Uma linha de 1px a 10% de opacidade pintada por
dentro da imagem dá forma a toda imagem sem ler como moldura. Por dentro, não ao redor: `border`
fica entre padding e margem, ocupa espaço e muda o tamanho da caixa; `outline` com offset negativo
ou `box-shadow` inset pinta por cima dos pixels de borda. Preto no light, branco no dark. Abaixo de
5% a linha some contra um céu pálido; acima de 20% vira elemento de design.

## Valores

<!-- skill:start -->
| Caso | String exata | Fonte |
|---|---|---|
| Imagem ou capa em card (Tailwind) | `outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10` | craft image-outlines.mdx |
| Mesmo efeito em CSS | `.border-overlay { outline: 1px solid rgba(0, 0, 0, 0.1); outline-offset: -1px; }` e `.dark .border-overlay { outline-color: rgba(255, 255, 255, 0.1); }` | Foglamp `apps/web/src/index.css:33-40` |
| Uso em card com gradiente | `border-overlay relative h-32 shrink-0 overflow-hidden rounded-xl squircle:rounded-[36px] corner-squircle bg-linear-to-br shadow-(--custom-shadow)` | Foglamp `apps/web/src/components/scan/personality-card.tsx:17` |
| Avatar | `after:absolute after:inset-0 after:rounded-full after:shadow-(--custom-shadow) after:mix-blend-darken` + `dark:after:mix-blend-lighten` (o hairline de 0.5px a 6% da sombra do sistema faz o papel do outline; o blend garante que escurece no light e clareia no dark sobre qualquer foto) | registry/base-vega/ui/avatar.tsx:22 |
| Faixa de opacidade | 10% padrão; entre 5% e 20% | craft image-outlines.mdx |

**Always**: a linha vai por cima da imagem (`outline` com offset negativo, `box-shadow` inset ou
pseudo-elemento), nunca `border`; cor por tema. **Never**: `ring-1 ring-border` em imagem (no light
`--border` é um cinza sólido, não 10% de preto); `outline-1 -outline-offset-1` sem cor explícita (o
`* { @apply border-border outline-ring/50 }` do globals.css:283 daria a cor do `ring`); linha em
logo SVG monocromático.
<!-- skill:end -->

## Onde aparece no Foglamp

`apps/web/src/index.css:33-40` define `.border-overlay`, que é o CSS do artigo ao pé da letra (o
comentário diz: "Crisp 1px inner outline on top of any surface (theme-aware)"), usada no card de
personalidade do scan (`scan/personality-card.tsx:17`) por cima de um gradiente. O avatar de
`packages/ui/src/components/avatar.tsx` usa a sombra do sistema em pseudo-elemento com blend, a
variante do conceito para círculos. Os logos de provedores do app não recebem outline: são SVGs
monocromáticos sobre tile `bg-muted`.

## No lume

- Itens: `avatar` (já vem com a linha), `card` (para `img` como primeiro ou último filho o card arredonda com `*:[img:first-child]:rounded-t-3xl` e `*:[img:last-child]:rounded-b-3xl`, registry/base-vega/ui/card.tsx:17; a linha você adiciona na própria `img` com a string do craft).
- A classe `.border-overlay` do Foglamp não está na registry; use a string Tailwind direto na `img`. Se um projeto repetir muito, declare a classe no `globals.css` do app (adição do lume, fora do `base`).
- FRONTEND.md: seção 4 (Sombra no lugar de borda: a imagem é mais um lugar onde `border` não entra) e seção 6 (Superfícies). Guia: `docs/guia/01-fundacoes.md`.
- Teste rápido: coloque uma imagem quase branca num card no light e uma quase preta num card no dark; se alguma perde a forma, falta a linha.
