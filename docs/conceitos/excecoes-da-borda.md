# Exceções da borda

Adição do lume. Fontes: Jakub Krehel, better-ui (surfaces.md), https://github.com/jakubkrehel/skills;
Rauno Freiberg, Field Note 4, https://rauno.me/notes/4. Status no Foglamp: integral (linha de tabela,
divisor, rodapé e campos no dark já são as exceções; `scripts/check-allow.txt` lista as demais com
motivo).

## Regra

"Sombra no lugar de borda" é regra de superfície: card, popover, dialog e botão não são fechados por
linha. Não é regra para tudo que separa. O Jakub mantém a borda em quatro lugares, e o critério é o
mesmo nos quatro: a linha ali não representa elevação, representa limite. Divisor entre seções (não
há caixa, há corte). Linha e célula de tabela (a grade é informação, e sombra não faz grade). Input (o
campo precisa ser achável sem foco, e a WCAG 1.4.11 pede 3:1 de contraste não textual no contorno;
uma sombra de meio pixel a 6 por cento não chega lá). Estado selecionado (a borda diz "este" quando a
cor de fundo sozinha não basta). O Rauno chega pelo lado oposto, revisando um dashboard da Vercel que
ficou "border-heavy": a correção não foi tirar as linhas da tabela, foi remover o container externo
que fechava tudo numa caixa e trocar inputs com borda por ghost inputs. As duas listas são a mesma: a
linha fica onde separa conteúdo e sai de onde só embrulhava. O Foglamp pratica isso com a linha
sempre atenuada (`/50` no light, `/40` no dark), nunca a 100 por cento.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Onde a borda continua | divisor, linha e célula de tabela, input, estado selecionado | Jakub, better-ui surfaces.md |
| Por quê no input | contraste não textual 3:1 (WCAG 1.4.11) no contorno do campo | Jakub, better-ui |
| Border-heavy | quando a página fica pesada de linhas, remova o container externo e use ghost inputs, não as linhas da tabela | Rauno, Field Note 4 |
| Linha de tabela | `border-b dark:border-border/40 border-border/50` no `TableRow`; o cabeçalho sticky desenha a linha como sombra inset nas células para não somar com a da linha | registry/base-vega/ui/table.tsx:169; :107 |
| Rodapé e footer | `border-t border-border/50 dark:border-border/40` | registry/base-vega/ui/table.tsx:130,232 |
| Divisor | `Separator` é `bg-border/70` com 1 px de altura ou largura (linha por fundo, não por `border`) | registry/base-vega/ui/separator.tsx:19 |
| Input | light só sombra (`shadow-(--custom-shadow)`); dark `dark:shadow-none dark:border-[0.5px] dark:border-border/50` com `hover:dark:border-border/70` | registry/base-vega/ui/input.tsx:14 |
| Controle de 16 px | `border border-input` no checkbox e no radio: contorno do próprio controle | registry/base-vega/ui/checkbox.tsx:15; radio-group.tsx:25 |
| Estado selecionado | o Foglamp marca por fundo e sombra, não por borda: linha `data-[state=selected]:bg-muted`, tab ativa `data-active:shadow-(--custom-shadow)`, checkbox `data-checked:border-primary` | registry/base-vega/ui/table.tsx:169; tabs.tsx:63; checkbox.tsx:15 |
| Linha interativa | a linha some no hover para o fundo `hover:bg-muted` ler como peça única: `data-interactive:hover:border-transparent` | registry/base-vega/ui/table.tsx:176 |
| Allowlist | `scripts/check-allow.txt` lista cada arquivo da registry que fecha caixa com `border` e o motivo (Empty tracejado, controles de 16 px, forks verbatim) | scripts/check-allow.txt |

**Always**: linha atenuada (`border-border/50`, `/40` no dark) em linha de tabela, divisor e rodapé;
`dark:shadow-none dark:border-[0.5px] dark:border-border/50` em campo no dark; `border border-input`
só em controle de 16 px; motivo escrito em `check-allow.txt` para qualquer outro `border`. **Never**:
`border` fechando card, popover, dialog ou botão; container externo em volta de uma tabela que já tem
linhas; `border-border` a 100 por cento em linha de app; `divide-*` para separar superfícies (só itens
de lista).
<!-- skill:end -->

## Onde aparece no Foglamp

`packages/ui/src/components/table.tsx` (linha, rodapé, cabeçalho sticky com sombra inset),
`input.tsx`, `textarea.tsx`, `select.tsx`, `kbd.tsx` e `toggle.tsx` (hairline no dark),
`checkbox.tsx` e `radio-group.tsx` (contorno do controle), `empty.tsx` (`border-dashed border`, a
única caixa tracejada). O app não tem container com borda em volta de tabela: a tabela senta direto no
card, e o card tem sombra.

## No lume

- Itens: `table`, `data-table`, `separator`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `tabs`, `empty`, `empty-state`.
- FRONTEND.md: seções Sombra no lugar de borda (a lista de "linha fina só nestes lugares") e Tabelas e filtros. Guia: `docs/guia/01-fundacoes.md` e `docs/guia/04-dados.md`.
- O `scripts/check.ts` (verificação 2) barra `border` fechando caixa fora da allowlist e deixa passar `border-b`, `border-t`, `divide-*`, `border border-transparent` e a receita `dark:border` com `dark:shadow-none`: é esta tabela em forma de ferramenta.
- Ponto aberto, não decisão: no light o input do Foglamp não chega aos 3:1 do Jakub no contorno; quem precisa de AA estrito em contraste não textual acrescenta `border border-input` no campo.
