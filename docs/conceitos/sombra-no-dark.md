# Sombra no dark

Adição do lume. Fontes: Jakub Krehel, better-ui (surfaces.md), https://github.com/jakubkrehel/skills,
e Details that make interfaces feel better,
https://jakub.kr/writing/details-that-make-interfaces-feel-better; comparado com o `--custom-shadow`
do Foglamp em `registry/base-vega/styles/globals.css:53-56` (light) e `:162-166` (dark). Status no
Foglamp: integral (o token tem receita própria para o dark; a diferença para o Jakub é escolha, não
omissão).

## Regra

Sombra é uma mancha mais escura que a superfície em volta. No light isso funciona: três camadas
finas (um anel de meio pixel, um drop curto, um drop difuso) dão aresta e elevação sem ocupar o
espaço de uma borda. No dark a conta quebra, porque não existe nada mais escuro que o fundo para a
sombra pintar: a profundidade some e sobra um card sem contorno. O Jakub resolve colapsando a sombra
para um único anel branco a 8 por cento (a aresta vem da luz e não há tentativa de profundidade). O
Foglamp resolve de outro jeito: mantém a aresta pela luz (dois insets brancos a 3 por cento, um no
topo e um em volta) e devolve a profundidade com um anel preto e três drops empilhados a 10 por
cento, que funcionam porque no dark a hierarquia inverte, o card (`oklch(0.205)`) é mais claro que a
página (`oklch(0.17)`) e a sombra tem onde cair. O lume mantém o token do Foglamp: é fidelidade ao
sistema de origem e é o que faz card, popover e dialog lerem como camadas sobre a página escura, não
como recortes. O que vale pegar do Jakub é a borda transparente de 1 px debaixo do anel: em
forced-colors (alto contraste do Windows) toda sombra é descartada, e só uma `border` real continua
desenhada.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Jakub, light | `0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06), 0 2px 4px 0 oklch(0 0 0 / 0.04)`; hover sobe para 0.08, 0.08 e 0.06 | better-ui surfaces.md |
| Jakub, dark | colapsa para `0 0 0 1px oklch(1 0 0 / 0.08)`; hover 0.13 | better-ui surfaces.md |
| Jakub, transição | só `box-shadow`, 150 ms ease-out | better-ui surfaces.md |
| Foglamp, light | `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)`: a estrutura e as opacidades do Jakub com metade da espessura | registry/base-vega/styles/globals.css:53-56 |
| Foglamp, dark | `inset 0 0.75px 0 0 rgba(255,255,255,.03), inset 0 0 0 0.75px rgba(255,255,255,.03), 0 0 0 0.75px rgba(0,0,0,.1), 0 2px 2px 0 rgba(0,0,0,.1), 0 4px 4px 0 rgba(0,0,0,.1), 0 8px 8px 0 rgba(0,0,0,.1)`: aresta pela luz, profundidade por três drops | registry/base-vega/styles/globals.css:162-166 |
| Quem usa | `shadow-(--custom-shadow)` em card, popover, dropdown, tooltip, dialog, kbd, avatar e inset do shell; o token flipa sozinho | registry/base-vega/ui/card.tsx:17; popover.tsx:42; dialog.tsx:58 |
| Campos no dark | aqui o Foglamp faz o colapso do Jakub: `dark:shadow-none dark:border-[0.5px] dark:border-border/50` (`--border` dark é branco a 10 por cento) | registry/base-vega/ui/input.tsx:14; select.tsx:90 |
| Botões no dark | sombra mantida com bevel branco: `--custom-outline-shadow` e `--custom-shadow-primary` redefinidos no `.dark` | registry/base-vega/styles/globals.css:180-187 |
| Forced-colors | `border border-transparent` debaixo do anel: invisível no tema normal, vira a borda do sistema em alto contraste | Jakub, better-ui surfaces.md; o Foglamp já reserva a borda em tabs (registry/base-vega/ui/tabs.tsx:63) por outro motivo, o espaço do anel de foco |

**Always**: `shadow-(--custom-shadow)` e deixe o token resolver o dark; em campo de formulário, a
receita `dark:shadow-none dark:border-[0.5px] dark:border-border/50`; em superfície nova,
`border border-transparent` sob a sombra. **Never**: `dark:shadow-none` em card, popover ou dialog
(perde a camada); anel branco único a 8 por cento no lugar do token (muda o caráter do sistema);
`shadow-md` ou `shadow-lg` do Tailwind em superfície nova (sombra cinza sem aresta, pior no dark);
sombra transicionando junto com cor (`transition-all` em superfície).
<!-- skill:end -->

## Onde aparece no Foglamp

`packages/ui/src/styles/globals.css` define `--custom-shadow` light e dark com os valores da tabela,
mais `--custom-shadow-lifted` e `--custom-shadow-chrome` com a mesma lógica (insets brancos mais
fortes e drops maiores no dark). `packages/ui/src/components/input.tsx` e irmãos trocam sombra por
hairline no dark. Nenhum arquivo do Foglamp trata `forced-colors`.

## No lume

- Itens: `base` (tokens), `card`, `popover`, `dialog`, `tooltip`, `dropdown-menu`, `kbd`, `avatar`, `input`, `select`, `textarea`, `button`.
- FRONTEND.md: seções Sombra no lugar de borda (os valores light e dark do token) e Dark mode (botões mantêm sombra, campos trocam por hairline, "a aresta vem da luz"). Guia: `docs/guia/01-fundacoes.md`.
- Conceitos vizinhos: [Exceções da borda](excecoes-da-borda.md) (onde a linha continua) e [Image Outlines](image-outlines.md) (a linha por dentro da imagem, também em preto ou branco puro).
