# Button Press

Original: https://craft.gustavofior.com/button-press (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/button-press.mdx. Seção: Motion.
Status no Foglamp: integral (mapa 3.4).

## Regra

Botão de verdade se move quando apertado. O equivalente na tela é encolher um pouco enquanto o
ponteiro está pressionado e voltar ao soltar. É o feedback mais barato da web e ninguém deve notar a
animação: se alguém pensa "o botão escalou", passou do ponto. Escala entre 0.97 e 0.98 (abaixo de
0.95 vira efeito), 100 a 150ms (mais que isso o botão atrasa em relação ao dedo, o que é pior que
nenhum feedback). Superfície grande encolhe menos, ou nada: um card de largura cheia a 0.97 move
vários pixels na borda. Transicione só `transform`, para o tempo do press não vazar para a cor do
hover, e desabilitado não aperta.

## Valores

<!-- skill:start -->
| Caso | String exata | Arquivo |
|---|---|---|
| Press em todo `Button` | `active:scale-[0.97]` na string base, com `transition-all hover:duration-150` e `disabled:pointer-events-none` (desabilitado não recebe `:active`) | registry/base-vega/ui/button.tsx:10 |
| Opt-out em gatilho de popup (o popover ancora nele; se encolhe, o popover treme) | `active:scale-100` | registry/base-vega/blocks/range-picker/range-picker.tsx:53,151,194; blocks/data-table/data-table.tsx:422,520 |
| Opt-out em chip | `bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 ...` | registry/base-vega/components/context-chip.tsx:13 |
| Sidebar (press por cor, não por escala) | `active:bg-sidebar-accent/70 active:text-sidebar-accent-foreground` | registry/base-vega/ui/sidebar.tsx:480 |
| Linha de tabela, card, tab | sem press | registry/base-vega/ui/table.tsx:170; ui/card.tsx:17; ui/tabs.tsx:63 |
| Receita do craft (botão fora do DS) | `transition-transform duration-100 ease-out active:scale-[0.97] disabled:active:scale-100 motion-reduce:transition-none [-webkit-tap-highlight-color:transparent]` | craft button-press.mdx |
| Proporção ao gatilho | a escala é proporcional ao tamanho: dialog entra de cerca de 0.8, nunca de 0 (Rauno); nunca partir de scale zero, entrar de 0.95 ou acima de 0.9 (Emil). No Foglamp o dialog entra em `zoom-in-[96%]` e sai em `zoom-out-[99%]`, os popups em `zoom-in-95` | Rauno Freiberg, https://interfaces.rauno.me; Emil Kowalski, 7 Practical Animation Tips (tip 2), https://emilkowal.ski/ui/7-practical-animation-tips; registry/base-vega/ui/dialog.tsx:58; dropdown-menu.tsx:47 |
| Divergência 0.96 contra 0.97 | Jakub: 0.96 em 150 ms ease-out, disabled nunca escala (better-ui); Rauno: cerca de 0.96 (interfaces). Craft, Emil e Foglamp: 0.97. Decisão do lume: 0.97, fechada | Jakub Krehel, https://github.com/jakubkrehel/skills; Rauno, https://interfaces.rauno.me; Emil, 7 Practical Animation Tips (tip 1) |

**Always**: press só em botão e em chip clicável pequeno; `active:scale-100` em todo botão que abre
popover, dropdown, select ou date picker; `transition-transform` (não `all`) quando escrever o seu.
**Never**: `active:scale-*` em card, linha, tile ou qualquer superfície maior que um botão; escala
abaixo de 0.95; duração acima de 150ms; press em botão desabilitado.
<!-- skill:end -->

Diferença praticada: o Foglamp transiciona `all` (o mesmo `transition-all hover:duration-150` serve
a cor do hover e a escala), não só `transform`, e não limpa o tap highlight do iOS nem respeita
`motion-reduce`. O lume mantém a string do Foglamp no `button` por fidelidade visual; para um botão
novo fora do DS, use a receita do craft. No iOS Safari o `:active` só dispara se algo na página
escuta touch; o React já escuta, então em app React isso nunca aparece.

Fontes além do craft (adição do lume, levantamento de 17/10/2026). O press é o caso menor de uma
regra geral que Rauno e Emil escrevem igual: a amplitude da animação é proporcional ao tamanho do que
se move. Um botão de 32 px a 0.97 desloca a borda em meio pixel; um dialog de 400 px a 0.97 desloca
seis, e por isso o dialog do Foglamp entra de 96 por cento e os popups de 95, nunca de zero (partir
de scale zero faz o elemento "nascer" de um ponto, o que nenhuma superfície real faz). A divergência
de número é pequena e está registrada, não aberta: Jakub e Rauno usam 0.96, o craft, o Emil e o
Foglamp usam 0.97; o lume fica em 0.97 porque é o valor do código de origem e a diferença de um
centésimo não é perceptível num botão de 32 px. O que vale do Jakub é o complemento: disabled nunca
escala (o Foglamp garante por `disabled:pointer-events-none`) e a transição fica só em `transform`.

## Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8` tem `active:scale-[0.97]` na string base. Dez opt-outs com
`active:scale-100`: `apps/web/src/components/app/range-picker.tsx:55,152,192`,
`data-table.tsx:476,574`, `context-chip.tsx:11`, `foggy/foggy-widget.tsx:209`,
`app/(app)/traces/traces-client.tsx:144`, `marketing/demo/tabs/traces-tab.tsx:156`,
`marketing/demo/demo-chrome.tsx:165`. Todos são gatilhos de popup ou chips. Nenhum card, linha ou
tile do app tem press.

## No lume

- Itens: `button` (press de fábrica), `context-chip`, `range-picker`, `data-table` (opt-outs já aplicados), `sidebar`.
- FRONTEND.md: seção 9 (Botões: `active:scale-[0.97]`, `active:scale-100` em gatilho de popup) e seção 21 (Movimento). Guia: `docs/guia/02-primitivos.md` e `docs/guia/09-movimento.md`.
- Playground: a rota `/botoes` do site do lume mostra todos os variants e sizes com o press, para comparar com o `/buttons` do Foglamp.
