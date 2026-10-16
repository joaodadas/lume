# Noise

Original: https://craft.gustavofior.com/noise (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/color/noise.mdx. Seção: Color. Status no
Foglamp: integral, só no marketing (mapa 3.4).

## Regra

Quando uma superfície grande de cor chapada (hero, CTA, gradiente) parece plástica ou mostra
banding, uma camada de ruído por cima dá textura e esconde os degraus. É um `feTurbulence` em SVG
aplicado a um overlay vazio com `mix-blend-mode` e opacidade baixa. Nunca em superfície de app:
card, tabela, dialog e sidebar do Foglamp são cor lisa com sombra, e o ruído entra só nas seções de
marketing. O filtro é calculado por pixel a cada repaint: em superfície pequena ninguém nota; em
hero de tela cheia que rola ou anima derruba o frame rate no celular, e a saída é rasterizar o grão
num tile e repetir.

## Valores

<!-- skill:start -->
| Peça | Valor | Fonte |
|---|---|---|
| Filtro (craft) | `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />` + `<feColorMatrix type="saturate" values="0" />` | craft noise.mdx |
| Overlay (craft) | `pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay filter-[url(#grain)]`, `aria-hidden` | craft noise.mdx |
| Container | `relative isolate overflow-hidden` (sem `isolate` o blend mistura o grão com o fundo da página, e o efeito muda conforme o card se move) | craft noise.mdx |
| Grão (Foglamp) | `<feTurbulence baseFrequency="0.8" />` num `figure` `pointer-events-none absolute inset-0` com `style={{ filter: "url(#id) grayscale(100%)" }}`; `id` único por página (ids de filtro SVG são globais no documento) | Foglamp `apps/web/src/components/marketing/noise-overlay.tsx:11-32` |
| Grão do hero | `FilmGrain` com `opacity-15 mix-blend-screen`, máscara `linear-gradient(to top, #000 78%, transparent 97%)` para o grão terminar com o conteúdo | `noise-overlay.tsx:97-110` |
| Névoa (FogBank) | ruído fractal rasterizado a 1/4 da resolução (custo 1/16), `feFlood` colorido por propriedade CSS com valor light e dark | `noise-overlay.tsx:42-92` |
| Superfície grande ou que rola | sem filtro ao vivo: tile de 200px via data URI, `bg-size-[200px_200px] bg-repeat`, opacidade e blend iguais | craft noise.mdx |
| Grão | `baseFrequency` 0.8; valores baixos dão manchas, altos dão grão de filme | craft noise.mdx |

**Always**: `isolate` no container; `aria-hidden` no overlay; opacidade entre 0.08 e 0.15; filtro ao
vivo só em superfície pequena ou em demo. **Never**: ruído em card, tabela, dialog, sidebar ou
qualquer tela do dashboard; `feTurbulence` ao vivo em tela cheia que anima ou rola; dois filtros com
o mesmo `id` na mesma página.
<!-- skill:end -->

## Onde aparece no Foglamp

Um arquivo, `apps/web/src/components/marketing/noise-overlay.tsx`, com `FilmGrain` (:11-32),
`FogBank` (:42-92) e `HeroGrain` (:97-110), consumido pelo hero, pelo CTA
(`marketing/landing/cta.tsx`) e pelas figuras de custo (`marketing/landing/figures-costs.tsx`). O
`feTurbulence` do Foglamp fica no `type` padrão (`turbulence`, uma oitava) e troca o `feColorMatrix`
por `grayscale(100%)` dentro do `filter` CSS; o resultado é o mesmo grão cinza. Zero ocorrências em
`apps/web/src/app/(app)` e em `packages/ui`: o app não tem textura.

## No lume

- Nenhum item da registry traz ruído na v0.1.0 (o capítulo de marketing e seus blocos ficam para depois, docs/DECISOES.md). Se precisar, copie a receita do craft com os valores da tabela para um componente em `components/app`, nunca em `components/ui`.
- FRONTEND.md: seção 28 (Marketing, opcional) e seção 6 (Superfícies: cor lisa com `shadow-(--custom-shadow)`, sem textura). Guia: `docs/guia/12-marketing.md`.
- Dark mode: o grão fica mais visível sobre `oklch(0.17 0 0)`; o Foglamp compensa com `mix-blend-screen` no hero, que soma luz em vez de escurecer. No light o craft usa `mix-blend-overlay`.
