# Focus ring

Adição do lume. Fontes: Rauno Freiberg, Web Interface Guidelines (2023), https://interfaces.rauno.me,
Crafting the Next.js Website, https://rauno.me/craft/nextjs, Field Note 4, https://rauno.me/notes/4, e
o capítulo grátis do Devouring Details, https://devouringdetails.com/prototypes/nextjs-dev-tools;
Jakub Krehel, better-accessibility, https://github.com/jakubkrehel/skills. Status no Foglamp: parcial
(anel por box-shadow em 1.5 px a 50 por cento em todo controle e anel inset na linha interativa; o anel
ainda faz fade junto com a cor, e `ring-[3px]` sobrou em badge e tabs).

## Regra

O anel de foco é o único estado que o usuário de teclado tem, e por isso tem receita, não só
espessura. O Rauno fecha quatro pontos. Box-shadow em vez de `outline`: Safari abaixo de 16.4 ignora
o raio no `outline`, e um anel quadrado em volta de um botão redondo é o erro mais visível de um
design system (o `ring-*` do Tailwind é box-shadow, então o lume já está do lado certo). Sem transição
no foco: o anel aparece de uma vez, porque quem navega por Tab salta dez controles em dois segundos e
um fade de 150 ms deixa o anel sempre atrás do foco. Respiro entre vizinhos: dois inputs colados com
anel de 1.5 px cada viram uma linha dupla; o anel precisa de margem, ou vai para o grupo, ou vai para
dentro. Anel inset em superfície colorida ou sem margem: numa linha de tabela não há espaço fora da
linha, e num botão vermelho o anel cinza por fora soma; por dentro ele contorna sem brigar. O Jakub
acrescenta o número: `:focus-visible` precisa de 3:1 contra o fundo.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Técnica | box-shadow, não `outline` (raio no Safari antigo) | Rauno, interfaces, nota 7 |
| Transição | nenhuma no foco: o anel não faz fade | Rauno, Crafting the Next.js Website |
| Respiro | inputs vizinhos precisam de espaço para o anel; se não há, o anel vai para o grupo | Rauno, Field Note 4 |
| Inset ou outset | inset em superfície colorida e em linha sem margem; outset no padrão | Rauno, Devouring Details |
| Link | raio mais padding mais margem negativa, para o anel contornar o texto sem mudar o layout | Rauno, Crafting the Next.js Website |
| Contraste | 3:1 do anel contra o fundo | Jakub, better-accessibility |
| Anel do lume | `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` em botão e campo; `--ring` é `oklch(0.708 0 0)` no light e `oklch(0.556 0 0)` no dark | registry/base-vega/ui/button.tsx:10; input.tsx:14; styles/globals.css:40,150 |
| Erro espelha o anel | `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20` e `dark:aria-invalid:ring-destructive/40` | registry/base-vega/ui/input.tsx:14 |
| Linha interativa | `data-interactive:focus-visible:ring-[1.5px] data-interactive:focus-visible:ring-inset data-interactive:focus-visible:ring-ring/50`: inset porque a linha não tem margem | registry/base-vega/ui/table.tsx:170; blocks/data-table/data-table.tsx:175 |
| Grupo de input | o filho zera o anel (`ring-0 focus-visible:ring-0`) e o grupo recebe o foco: o respiro do Rauno resolvido por composição | registry/base-vega/ui/input-group.tsx:129 |
| Sidebar | `focus-visible:ring-2` com `ring-sidebar-ring` (herança do shadcn, mais grosso que o resto) | registry/base-vega/ui/sidebar.tsx:480 |
| Sobra | `focus-visible:ring-[3px]` em badge e tabs: shadcn, não Foglamp; não copiar em componente novo | registry/base-vega/ui/badge.tsx:11; tabs.tsx:63 |
| Transição praticada | `transition-[color,box-shadow]` no input e `transition-all` no botão fazem o anel entrar em 150 ms: contra o Rauno, mantido por fidelidade | registry/base-vega/ui/input.tsx:14; button.tsx:10 |

**Always**: a string canônica de 1.5 px a 50 por cento; `ring-inset` em linha, célula e superfície
colorida; anel no grupo quando os campos estão colados; `focus-visible`, nunca `focus` (clique de
mouse não mostra anel). **Never**: `outline` com raio para anel; `focus-visible:ring-[3px]` em
componente novo; anel sem `focus-visible:border-ring` (no dark o anel a 50 por cento é fraco e a
borda do campo mudando de cor é o que se vê); remover o anel sem pôr outro no lugar (`outline-none`
sem `focus-visible:ring`).
<!-- skill:end -->

## Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8`, `input.tsx`, `select.tsx`, `switch.tsx`, `checkbox.tsx`
com o anel de 1.5 px; `table.tsx` com o anel inset na linha interativa; `input-group.tsx` com
`focus-visible:ring-0` no filho. Nenhum arquivo do Foglamp desliga a transição do anel, e `badge.tsx`
e `tabs.tsx` ficaram com o `ring-[3px]` do shadcn.

## No lume

- Itens: `button`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `switch`, `table`, `data-table`, `input-group`, `sidebar`, `badge`, `tabs`.
- FRONTEND.md: seção Acessibilidade e teclado (anel canônico, erro espelha, `ring-[3px]` proibido em componente novo). Guia: `docs/guia/09-movimento.md` (hover, press, focus e cursor).
- Para um componente novo que queira seguir o Rauno à letra: `transition-[color,box-shadow]` vira só `transition-colors`, e o anel aparece sem fade. O lume não muda os primitivos do Foglamp por isso.
