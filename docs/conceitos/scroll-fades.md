# Scroll Fades

Original: https://craft.gustavofior.com/scroll-fades (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/scroll-fades.mdx. Seção: Layout.
Status no Foglamp: parcial (mapa 3.4).

## Regra

Um container que rola com borda dura parece uma lista que acabou. Um fade na borda que ainda tem
conteúdo diz "tem mais" sem precisar de barra de rolagem. O erro comum é o fade estático nos dois
lados: no fim da lista o último item fica meio escondido, como se houvesse algo abaixo. Só desvanece
o lado que ainda pode rolar. Duas técnicas: máscara (`mask-image`, funciona sobre qualquer fundo,
inclusive imagem, e não bloqueia clique) e overlay colorido (um gradiente da cor do fundo por cima,
que precisa casar com a superfície). Em linha horizontal de chips ou tabs, a mesma ideia de lado, e
a scrollbar escondida, porque uma barra sob uma linha de chips é ruído.

## Valores

<!-- skill:start -->
| Técnica | Valor | Onde |
|---|---|---|
| Componente `ScrollFade` (overlay) | viewport `overflow-y-auto no-scrollbar`; fade do topo `pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b to-transparent transition-opacity duration-150` + `from-card`, visível quando `scrollTop > 1`; fade de baixo igual com `bottom-0` e `bg-linear-to-t`, `opacity-75` enquanto `scrollTop + clientHeight < scrollHeight - 1`; `ResizeObserver` recalcula quando o conteúdo muda de tamanho | registry/base-vega/components/scroll-fade.tsx:40-78 |
| Cor do overlay | prop `fromClassName`: `from-card` (padrão, lista dentro de card), `from-popover` (dentro de dialog); `bottomFadeClassName` para reforçar (`h-14 opacity-100`) | registry/base-vega/components/scroll-fade.tsx:23,33-35 |
| Utilitário `scroll-fade` (máscara) | `mask-image: linear-gradient(to bottom, transparent 0, #000 var(--scroll-fade-t, 0px), #000 calc(100% - var(--scroll-fade-b, 0px)), transparent 100%)`; tamanho `min(12%, calc(var(--spacing) * 10))` (até 2.5rem); scroll-driven com `animation-timeline: scroll(self y)` e `animation-range` de `calc(var(--spacing) * 24)` (6rem) em cada ponta; sem suporte, as duas pontas ficam sempre desvanecidas | `shadcn/tailwind.css` 4.21.5 (`@utility scroll-fade`, `scroll-fade-y`, `scroll-fade-x`), importado por registry/base-vega/styles/globals.css:8 |
| Craft (mesma ideia em CSS próprio) | `@property --fade-start` e `--fade-end` (`<length>`, inicial `0px`), fade de `2.5rem`, `animation: fade-start 1ms linear both, fade-end 1ms linear both; animation-range: 0 3rem, calc(100% - 3rem) 100%` | craft scroll-fades.mdx |
| Scrollbar | `no-scrollbar` (de `shadcn/tailwind.css`) com qualquer das duas: a máscara desvanece a barra junto, o overlay cobre a barra | registry/base-vega/components/scroll-fade.tsx:57,61; Foglamp `scan/left-rail.tsx:76` |

**Always**: `ScrollFade` para lista dentro de card, dialog ou popover (fundo conhecido); classe
`scroll-fade` para fundo desconhecido, imagem ou gradiente; `no-scrollbar` nos dois casos; linha
horizontal de chips com `scroll-fade-x`. **Never**: fade estático nos dois lados; overlay com cor
diferente do fundo (`from-card` dentro de um dialog `bg-popover` deixa uma mancha); máscara no
container que mantém a scrollbar visível (ela some nas pontas).
<!-- skill:end -->

## Onde aparece no Foglamp

Overlay: `apps/web/src/components/app/page-parts.tsx:535-604` (`ScrollFade`, os dois gradientes em
`:590` e `:597`). Máscara: classe `scroll-fade` em `apps/web/src/components/scan/left-rail.tsx:76`,
`setup/verification-report.tsx:102`, `setup/decision-list.tsx:401` e condicional
`overflowing && "scroll-fade"` em `scan/changes-card.tsx:54`; a classe não está definida no repo,
vem do `shadcn/tailwind.css` 4.12.0 (mapa 3.9 e 4.2). Máscaras inline no Foggy:
`foggy/foggy-widget.tsx:596,675` (`linear-gradient(to bottom, black 35%, transparent)`). Status
parcial porque o Foglamp mistura as duas técnicas e o componente é overlay, não máscara.

## No lume

- Itens: `scroll-fade` (componente, no `kit-tabela`), `base` (o utilitário `scroll-fade` e o `no-scrollbar` chegam pelo `@import "shadcn/tailwind.css"`), `sidebar` (`SidebarContent` é `no-scrollbar ... overflow-auto`, sem fade).
- FRONTEND.md: seção 15 (Tabelas e filtros) e seção 26 (Telas de detalhe e drawers: listas longas em painel lateral). Guia: `docs/guia/03-shell-e-paginas.md` e `docs/guia/05-telas-de-detalhe.md`.
- A versão do utilitário no lume é a do `shadcn` 4.21.5 em `node_modules`; o Foglamp usa a 4.12.0 e os valores da tabela são da 4.21.5. Se a CLI atualizar o pacote, confira `--scroll-fade-size` antes de confiar nos números.
