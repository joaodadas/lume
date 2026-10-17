# Continuidade

Adição do lume. Fontes: Benji Taylor, Family Values, https://benji.org/family-values, e Liveline,
https://benji.org/liveline; Raphael Salaja, Calligraph, https://github.com/raphaelsalaja/calligraph, e
Cambio, https://github.com/raphaelsalaja/cambio (implementações, só leitura). Status no Foglamp:
parcial (`number-ticker`, `copy-icon`, pílula com `layoutId` e o lift da toolbar persistem em vez de
duplicar; alturas distintas e uma ação por painel são regras de composição que a registry não impõe).

## Regra

Uma interface parece contínua quando o que está na tela continua sendo a mesma coisa enquanto muda. O
Benji escreveu isso como valores da Family: componentes que ficam na tela persistem, não são
desmontados e remontados com outra cara; só a parte que muda anima (num rótulo que vai de "Continuar"
para "Confirmar", as letras que ficam ficam paradas); painéis em sequência têm alturas distintas, para
o olho perceber que trocou de passo; cada painel tem um conteúdo e uma ação primária; a direção do
movimento segue a posição espacial (o que está embaixo sobe, o que vem da direita entra pela
direita); e num widget ao vivo há um só sistema de movimento, eixo, grade e rótulo com a mesma
interpolação, porque dois ritmos no mesmo gráfico leem como defeito (Liveline). O Raphael transformou
dois desses pontos em biblioteca: Calligraph anima só os caracteres que mudam, Cambio faz o gatilho
virar o popup sem duplicar o elemento. O lume não instala nenhuma das duas; o que pega é a regra, que
o Foglamp já pratica em quatro lugares.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Persistir, não duplicar | o componente que continua na tela viaja entre estados; nunca desmonta e remonta | Benji, Family Values |
| Só o que muda anima | em contador, rótulo e estado vazio, o texto que fica não se move | Benji, Family Values; Raphael, Calligraph |
| Alturas distintas | cada painel de uma sequência tem altura diferente, para a troca ser legível | Benji, Family Values |
| Uma ação por painel | um conteúdo e uma ação primária; transiente vai em tray ou drawer, persistente em tela cheia | Benji, Family Values |
| Direção espacial | o movimento segue de onde o elemento vem e para onde vai | Benji, Family Values |
| Um sistema por widget | eixo, grade e rótulo com o mesmo lerp; nunca clipar a linha | Benji, Liveline |
| Número que muda | `number-ticker` anima o mesmo `span` de um valor ao outro em 0.6 s, `tabular-nums` para a largura não pular; a primeira pintura é estática | registry/base-vega/components/number-ticker.tsx:50-59 |
| Ícone que troca | `AnimatePresence mode="popLayout" initial={false}` no `copy-icon`: o ícone que sai fica por cima do que entra, no mesmo lugar, e o estado inicial não anima no mount | registry/base-vega/components/copy-icon.tsx:29 |
| Pílula que viaja | `layoutId={pillId}` com `MORPH` no `theme-switcher`: a pílula desliza entre opções em vez de aparecer na nova | registry/base-vega/components/theme-switcher.tsx:77-78 |
| Grupo que troca de pai | `layoutId` com `layout="position"` e `TOOLBAR_SPRING` no lift da toolbar do `data-table`: o grupo remonta em outro pai e desliza da posição antiga | registry/base-vega/blocks/data-table/data-table.tsx:297-304 |
| Direção nos popups | `data-[side=bottom]:slide-in-from-top-2` e irmãos, com `origin-(--transform-origin)`: o popup vem do lado do gatilho | registry/base-vega/ui/dropdown-menu.tsx:47; tooltip.tsx:58 |
| Texto que rola | `rolling-text` muda só os caracteres, e a máscara de pontos do mesmo comprimento mantém a largura durante a rolagem | registry/base-vega/components/rolling-text.tsx |

**Always**: `initial={false}` em todo `AnimatePresence` que troca estado de algo já na tela;
`layoutId` quando o mesmo elemento muda de lugar ou de pai; `tabular-nums` em número que anima; um só
token de `lib/motion.ts` por widget; a direção de entrada igual à posição do gatilho. **Never**:
desmontar e remontar para "animar a troca"; animar o texto inteiro quando só uma palavra mudou; dois
ritmos no mesmo gráfico; painéis de um wizard com a mesma altura em todos os passos; mais de uma ação
primária num painel.
<!-- skill:end -->

## Onde aparece no Foglamp

`apps/web/src/components/app/page-parts.tsx` (TickerValue, origem do `number-ticker`),
`copy-icon.tsx:30` (`initial={false}` e `popLayout`), `theme-switcher.tsx:27` e três cópias iguais
(pílula com `layoutId`), `data-table.tsx:360` (lift da toolbar), `animated-api-key.tsx` (origem do
`rolling-text`). Alturas distintas e uma ação por painel não têm código: são decisões de tela dos
wizards de setup do app.

## No lume

- Itens: `number-ticker`, `copy-icon`, `theme-switcher`, `data-table`, `rolling-text`, `motion`, `dropdown-menu`, `tooltip`.
- FRONTEND.md: seções Movimento (`initial={false}` no que já está no lugar, `MORPH` para pílula com `layoutId`) e Telas de detalhe e drawers. Guia: `docs/guia/09-movimento.md` (as 12 receitas) e `docs/guia/07-dialogs-e-wizards.md`.
- Conceitos vizinhos: [Interruptibility](interruptibility.md) (o mesmo elemento precisa aceitar a próxima mudança no meio da atual) e [Curve smoothing](curve-smoothing.md) (um só sistema de movimento no gráfico).
