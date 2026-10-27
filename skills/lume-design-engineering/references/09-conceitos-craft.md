# Conceitos do craft

Gerado por `bun scripts/build-skill.ts` a partir de `docs/conceitos/*.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Conceitos do craft

Os artigos de https://craft.gustavofior.com (Gustavo Fior, MIT, repo
https://github.com/gustavo-fior/craft) são a teoria por trás do Foglamp: o autor é o mesmo, e o
Foglamp é onde ele pratica. Esta pasta reescreve em pt-BR os 11 conceitos publicados mais 9 adições
do lume, com fonte nos sete autores que o craft credita na página GOATs (Rauno Freiberg, Emil
Kowalski, Jakub Krehel, Paco Coursey, Shu Ding, Benji Taylor, Raphael Salaja; levantamento em
`docs/pesquisa/goats-do-craft.md`). Cada arquivo traz a regra, os valores exatos, onde o Foglamp
pratica (arquivo:linha, da tabela 3.4 do mapa `foglamp-design-system.md`) e o que o lume instala.
Nada aqui é cópia de parágrafo: é reescrita com atribuição, e cada arquivo abre com o link do
original e do MDX fonte (os 11 do craft) ou com autor, título e URL de cada fonte (as 9 adições).

Molde de cada arquivo: `Regra` (o quê e por quê), `Valores` (tabela com strings de classe e números,
entre os marcadores `skill:start` e `skill:end`, que o `scripts/build-skill.ts` copia para
`skills/lume-design-engineering/references/09-conceitos-craft.md`), `Onde aparece no Foglamp` e
`No lume` (itens da registry, seções do `FRONTEND.md` e capítulos de `docs/guia/`).

Regra de leitura: o artigo descreve a intenção; o código do Foglamp (commit `2bc3bb5`) descreve a
prática. Quando divergem, o código vence, e o arquivo diz onde diverge. Adição própria do lume vem
marcada como "(adição do lume)".

### Índice por seção

#### Typography

- [Tabular Numbers](#tabular-numbers): dígitos de largura fixa para valores que mudam e colunas numéricas à direita. Integral no Foglamp.
- [Optical Alignment](#optical-alignment): nudge de 1px por ícone, padding menor do lado do ícone, eixo `opsz` da Inter. Integral.
- [Font Smoothing](#font-smoothing): `antialiased` no body; só macOS; sem peso leve no dark. Integral.
- Não publicados: Letter Spacing, Text Wrapping, Icons.

#### Color

- [Noise](#noise): grão por `feTurbulence`, só no marketing. Integral, só no marketing.
- [Image Outlines](#image-outlines): linha de 1px a 10% por dentro da imagem e do avatar. Integral.
- Não publicados: OKLCH, Shadows Not Borders.

#### Layout

- [Nested Border Radius](#nested-border-radius): raio interno = raio externo menos o inset, nas duas variantes do squircle. Integral.
- [HTML Background](#html-background): `html` pintado com `--background`. Não aparece no Foglamp; o lume adota no `base`.
- [Scroll Fades](#scroll-fades): desvanecer só a borda que ainda rola; overlay (`ScrollFade`) ou máscara (`scroll-fade`). Parcial.
- Não publicados: Hit Areas, Clip-Path, Squircles.

#### Motion

- [Button Press](#button-press): `active:scale-[0.97]` no botão, `active:scale-100` em gatilho de popup. Integral.
- [Interruptibility](#interruptibility): transição e spring para o que alterna, keyframe só one-shot, nunca trancar input. Parcial.
- [Hover Restraint](#hover-restraint): hover instantâneo, tooltip com `delay={150}` em tabela. Parcial.
- Não publicados: Icon Morph, Easings, Stagger, Shared Layout, Exit Animations, Scale Entrances.

#### Sound

- Não publicados: Interface SFX, Layering Sounds. O Foglamp e o lume não têm som.

#### Data

- Não publicados: Living Charts, Curve Smoothing. Curve Smoothing tem arquivo próprio em Adições do lume ([Curve smoothing](#curve-smoothing)), com fonte primária no Shu Ding, não no rascunho.

#### Craft

- Não publicados: Performance Is Design, How to Get References, Novelty Budget, Taste Is Trained, Timelessness. Novelty Budget tem arquivo próprio em Adições do lume ([Novelty budget](#novelty-budget)), com fonte primária no Rauno Freiberg, não no rascunho.

### Adições do lume

Conceitos que o craft não publicou (ou publicou só em prosa) e que os sete autores creditados
convergem em praticar. Cada arquivo abre com "Adição do lume" e lista autor, título e URL de cada
fonte; os valores são dos autores, e a coluna de prática é do código da registry.

- [Frequência decide](#frequência-decide): quatro faixas de frequência (100+ por dia nunca anima; dezenas reduz; ocasional padrão; raro pode ter delight), a conta das 6 horas por ano. Emil Kowalski, Jakub Krehel, Rauno Freiberg, Benji Taylor, Raphael Salaja. Parcial no Foglamp.
- [Duração por componente](#duração-por-componente): press 100 a 180 ms, tooltip 125 a 200, dropdown 150 a 260, modal 200 a 300; saída 20 por cento mais rápida; família de easing por tipo. Emil Kowalski, Raphael Salaja. Parcial.
- [Sombra no dark](#sombra-no-dark): a sombra de 3 camadas do Jakub colapsa para um anel branco no dark; o Foglamp mantém seis camadas com inset, e o lume mantém o token. Jakub Krehel. Integral.
- [Exceções da borda](#exceções-da-borda): onde a linha continua (divisor, tabela, input, selecionado) e o que "border-heavy" pede. Jakub Krehel, Rauno Freiberg. Integral.
- [Hit areas](#hit-areas): 24, 40 e 44 px; pseudo-elemento sem nó extra; sem área morta em lista; botões irmãos. Jakub Krehel, Rauno Freiberg, Raphael Salaja, Emil Kowalski. Parcial.
- [Focus ring](#focus-ring): box-shadow e não outline, sem transição, respiro entre vizinhos, inset em superfície colorida; o anel de 1.5 px do lume. Rauno Freiberg, Jakub Krehel. Parcial.
- [Continuidade](#continuidade): persistir em vez de duplicar, só a parte que muda anima, direção espacial, um sistema de movimento por widget. Benji Taylor, Raphael Salaja. Parcial.
- [Novelty budget](#novelty-budget): 90 por cento familiar e 10 novo; flourish só em onboarding, nunca em navegação interna. Rauno Freiberg, Benji Taylor. Integral.
- [Curve smoothing](#curve-smoothing): regressão polinomial com ordem por split ímpar e par, delta sobre a tendência; nunca clipar a linha. Shu Ding, Benji Taylor. Ausente (recomendação sem código).

### Os 23 não publicados

Os 23 conceitos listados só por nome existem como MDX em `content/` do repo do craft, mas o site só
publica os 11 que estão em `LAUNCH_CONCEPT_SLUGS` (`src/lib/concepts.ts`); os outros aparecem apenas
em desenvolvimento, com a marca "not published". São rascunhos do autor, ainda sem revisão, e por
isso não ganham arquivo aqui. Muitos têm regra praticada no Foglamp (o mapa 3.3 resume cada um com
os valores, e a tabela 3.4 aponta a evidência: Squircles com 124 `corner-squircle`, Hit Areas com
`after:absolute after:-inset-2`, Scale Entrances com `zoom-in-95`, Icon Morph no `copy-icon`), e
essa prática está documentada no guia (`docs/guia/01-fundacoes.md`, `02-primitivos.md`,
`09-movimento.md`) a partir do código, não do rascunho. Quando um rascunho e o código do Foglamp
divergem, o código vence. Quando o autor publicar um deles, ele entra aqui no mesmo molde. Dois deles
(Novelty Budget e Curve Smoothing) já têm arquivo em Adições do lume porque a fonte primária existe
fora do craft (Rauno e Shu); quando o craft publicar, o arquivo ganha o link do original.

### Como usar junto com a skill do craft

`npx skills add gustavo-fior/craft` instala a skill `craft-design-engineering` com os 34 conceitos
em inglês, publicados e rascunhos. O lume não a substitui: a skill `lume-design-engineering`
(`npx skills add joaodadas/lume --skill lume-design-engineering`) cita estes 11 com os valores do
Foglamp e manda instalar a do craft junto (ver `docs/referencias.md`). Para revisar UI, o fluxo é o
mesmo do craft: reportar cada mudança numa tabela Before, After, Regra, com link para o conceito.

## Button Press

Original: https://craft.gustavofior.com/button-press (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/button-press.mdx. Seção: Motion.
Status no Foglamp: integral (mapa 3.4).

### Regra

Botão de verdade se move quando apertado. O equivalente na tela é encolher um pouco enquanto o
ponteiro está pressionado e voltar ao soltar. É o feedback mais barato da web e ninguém deve notar a
animação: se alguém pensa "o botão escalou", passou do ponto. Escala entre 0.97 e 0.98 (abaixo de
0.95 vira efeito), 100 a 150ms (mais que isso o botão atrasa em relação ao dedo, o que é pior que
nenhum feedback). Superfície grande encolhe menos, ou nada: um card de largura cheia a 0.97 move
vários pixels na borda. Transicione só `transform`, para o tempo do press não vazar para a cor do
hover, e desabilitado não aperta.

### Valores

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

### Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8` tem `active:scale-[0.97]` na string base. Dez opt-outs com
`active:scale-100`: `apps/web/src/components/app/range-picker.tsx:55,152,192`,
`data-table.tsx:476,574`, `context-chip.tsx:11`, `foggy/foggy-widget.tsx:209`,
`app/(app)/traces/traces-client.tsx:144`, `marketing/demo/tabs/traces-tab.tsx:156`,
`marketing/demo/demo-chrome.tsx:165`. Todos são gatilhos de popup ou chips. Nenhum card, linha ou
tile do app tem press.

### No lume

- Itens: `button` (press de fábrica), `context-chip`, `range-picker`, `data-table` (opt-outs já aplicados), `sidebar`.
- FRONTEND.md: seção 9 (Botões: `active:scale-[0.97]`, `active:scale-100` em gatilho de popup) e seção 21 (Movimento). Guia: `docs/guia/02-primitivos.md` e `docs/guia/09-movimento.md`.
- Playground: a rota `/botoes` do site do lume mostra todos os variants e sizes com o press, para comparar com o `/buttons` do Foglamp.

## Continuidade

Adição do lume. Fontes: Benji Taylor, Family Values, https://benji.org/family-values, e Liveline,
https://benji.org/liveline; Raphael Salaja, Calligraph, https://github.com/raphaelsalaja/calligraph, e
Cambio, https://github.com/raphaelsalaja/cambio (implementações, só leitura). Status no Foglamp:
parcial (`number-ticker`, `copy-icon`, pílula com `layoutId` e o lift da toolbar persistem em vez de
duplicar; alturas distintas e uma ação por painel são regras de composição que a registry não impõe).

### Regra

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

### Valores

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

### Onde aparece no Foglamp

`apps/web/src/components/app/page-parts.tsx` (TickerValue, origem do `number-ticker`),
`copy-icon.tsx:30` (`initial={false}` e `popLayout`), `theme-switcher.tsx:27` e três cópias iguais
(pílula com `layoutId`), `data-table.tsx:360` (lift da toolbar), `animated-api-key.tsx` (origem do
`rolling-text`). Alturas distintas e uma ação por painel não têm código: são decisões de tela dos
wizards de setup do app.

### No lume

- Itens: `number-ticker`, `copy-icon`, `theme-switcher`, `data-table`, `rolling-text`, `motion`, `dropdown-menu`, `tooltip`.
- FRONTEND.md: seções Movimento (`initial={false}` no que já está no lugar, `MORPH` para pílula com `layoutId`) e Telas de detalhe e drawers. Guia: `docs/guia/09-movimento.md` (as 12 receitas) e `docs/guia/07-dialogs-e-wizards.md`.
- Conceitos vizinhos: [Interruptibility](#interruptibility) (o mesmo elemento precisa aceitar a próxima mudança no meio da atual) e [Curve smoothing](#curve-smoothing) (um só sistema de movimento no gráfico).

## Curve smoothing

Adição do lume. Fontes: Shu Ding, Adaptive Polynomial Curve Fitting,
https://shud.in/thoughts/adaptive-polynomial-curve-fitting; Benji Taylor, Liveline,
https://benji.org/liveline. O craft tem o rascunho não publicado "Curve Smoothing"
(`content/data/curve-smoothing.mdx`), sem revisão do autor; a fonte primária aqui é o Shu. Status no
Foglamp: ausente (o `card-sparkline` desenha a série bruta e o `formatDelta` compara dois totais).
Recomendação ainda sem código.

### Regra

Uma sparkline de tráfego por hora é ruído: a linha serrilha, e um delta calculado sobre o primeiro e
o último ponto muda de sinal conforme a hora em que você abre a página. O Shu encontrou isso no Vercel
Analytics e resolveu com regressão polinomial adaptativa: ajusta um polinômio aos pontos, mas a ordem
não é fixa. Para cada ordem candidata, divide os pontos em índices ímpares e pares, ajusta num grupo e
mede o erro no outro, nos dois sentidos, e guarda o pior dos dois erros; a ordem vencedora é a de
menor pior erro. Isso evita o overfit (ordem alta demais acompanha o ruído e erra feio no grupo que
não viu) sem um parâmetro escolhido no olho. A curva de tendência é desenhada sobre os pontos reais,
não no lugar deles, e o delta passa a ser medido na tendência (fim contra começo da curva ajustada),
que é estável. O Benji acrescenta as regras de gráfico ao vivo do Liveline: um só sistema de movimento
(eixo, grade e rótulo com a mesma interpolação) e nunca clipar a linha, porque um pico cortado pelo
container mente sobre o dado.

### Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Método | regressão polinomial sobre a série; ordem escolhida por validação cruzada ímpar e par | Shu |
| Escolha da ordem | para cada ordem candidata: ajusta nos índices ímpares e mede nos pares, e vice-versa; guarda o pior erro quadrático médio; vence a ordem de menor pior erro | Shu |
| Desenho | tendência por cima dos pontos reais (bruto atenuado, tendência firme), nunca no lugar deles | Shu |
| Delta | medido sobre a tendência (último contra primeiro ponto da curva ajustada), não sobre o primeiro e o último ponto brutos | Shu |
| Movimento | um só sistema por gráfico: eixo, grade e rótulo com o mesmo lerp; defaults quietos; congela ao pausar | Benji, Liveline |
| Clipping | a linha nunca é cortada pelo container; o pico aparece inteiro | Benji, Liveline |
| Hoje no lume: traçado | `card-sparkline` liga os pontos brutos com `M` e `L`, área até a base, `preserveAspectRatio="none"`, sem suavização | registry/base-vega/components/card-sparkline.tsx:36-50 |
| Hoje no lume: clipping | `overflow-visible` no `svg` e `PAD` de 3 px no topo: o pico já não é cortado | registry/base-vega/components/card-sparkline.tsx:33,57-61 |
| Hoje no lume: delta | `formatDelta(current, previous)` compara dois totais (período atual contra anterior), não dois pontos de série; `null` sem base de comparação | registry/base-vega/lib/format.ts:241-252 |
| Hoje no lume: bucket incompleto | `dashedLast` traceja o último segmento para dizer que o bucket ainda enche | registry/base-vega/components/card-sparkline.tsx:52-53 |

**Always**: para série por hora ou por minuto, delta sobre a tendência ou sobre totais de período
(como o `formatDelta` faz), nunca sobre dois pontos brutos; tendência desenhada por cima do bruto;
`overflow-visible` e padding no topo. **Never**: ordem polinomial fixa escolhida no olho; suavização
que esconde o bruto; `overflow-hidden` em gráfico de linha; dois ritmos de interpolação no mesmo
widget.
<!-- skill:end -->

### Onde aparece no Foglamp

Não aparece. `apps/web/src/components/app/page-parts.tsx:354-491` (origem do `card-sparkline`)
desenha a série bruta; os gráficos do evilcharts desenham por recharts sem ajuste de curva;
`formatDelta` em `lib/format.ts` compara totais de período.

### No lume

- Itens: `card-sparkline`, `stat-card` (recebe o `Delta`), `format` (`formatDelta`), `kit-graficos`.
- FRONTEND.md: seções Números, datas e formatação e Páginas: header, stat cards, grids. Guia: `docs/guia/04-dados.md`.
- Recomendação sem código: um `smoothSeries(points)` em módulo próprio da registry, com a validação ímpar e par do Shu, e uma prop `trend` no `card-sparkline` que desenha a tendência por cima. Até existir, a sparkline fica bruta e o delta fica por período, que é estável por construção.

## Duração por componente

Adição do lume. Fontes: Emil Kowalski, Agents with Taste, https://emilkowal.ski/ui/agents-with-taste,
e 7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips; Raphael Salaja, To
Spring or Not To Spring, https://www.userinterface.wiki/to-spring-or-not-to-spring. Status no
Foglamp: parcial (press 150 ms, tooltip 150, popups 100, sheet 200, drawer 300 e accordion 300 cabem
nas faixas; o dialog em 100 ms fica abaixo da faixa dos dois autores e a saída dura o mesmo que a
entrada).

### Regra

O `lib/motion.ts` diz que UI de produto fica entre 0.12 e 0.25 s. É verdade e é pouco: um press e um
drawer não têm o mesmo tempo. Emil e Raphael publicaram tabelas quase iguais, e juntas dão uma faixa
por componente: quanto maior a superfície e mais longa a distância, mais tempo; quanto mais frequente,
menos. Duas regras acompanham os números. A saída é mais rápida que a entrada (o Emil fecha em cerca
de 20 por cento): o que sai já cumpriu o papel e não merece cerimônia. E "se parece lento, encurte a
duração antes de trocar a curva" (Raphael): a curva muda o caráter, a duração muda a espera, e quase
sempre o problema é a espera. A família de easing segue o tipo de movimento: entrar e sair pede
ease-out (chega rápido e assenta), mover ou mudar de forma em tela pede ease-in-out, cor pede o ease
padrão, e linear só quando o movimento representa tempo (barra de progresso, contador de duração),
porque linear em qualquer outro lugar lê como mecânico.

### Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Press e hover | 100 a 180 ms (Emil 100 a 160, Raphael 120 a 180) | Agents with Taste; To Spring or Not To Spring |
| Tooltip | 125 a 200 ms | Emil |
| Dropdown, select, popover, estado pequeno | 150 a 260 ms (Emil 150 a 250, Raphael 180 a 260) | Emil; Raphael |
| Modal e drawer | 200 a 300 ms; até 500 quando há arraste (o drawer do Emil usa 500 com `cubic-bezier(0.32, 0.72, 0, 1)`) | Emil, Building a Drawer Component |
| Saída | cerca de 20 por cento mais rápida que a entrada | Emil, Agents with Taste |
| Se parece lento | encurte a duração antes de trocar a curva | Raphael |
| Família por tipo | entra e sai: ease-out; move ou muda de forma em tela: ease-in-out; cor: ease; linear só para movimento que representa tempo | Emil (fluxograma de easing); Raphael |
| Nunca ease-in | entrada com ease-in começa parada e chega atrasada | Emil, 7 Practical Animation Tips |
| Press no Foglamp | `active:scale-[0.97]` com `transition-all hover:duration-150`: 150 ms | registry/base-vega/ui/button.tsx:10 |
| Tooltip no Foglamp | sem classe de duração: 150 ms padrão do `tw-animate-css` | registry/base-vega/ui/tooltip.tsx:58 |
| Dropdown, select, popover, context menu | `duration-100` | registry/base-vega/ui/dropdown-menu.tsx:47; select.tsx:133; popover.tsx:42; context-menu.tsx:58 |
| Dialog | `duration-100` entrando em `zoom-in-[96%]` e saindo em `zoom-out-[99%]` (abaixo da faixa dos autores; o código vence) | registry/base-vega/ui/dialog.tsx:36,58 |
| Sheet | `transition duration-200 ease-in-out` | registry/base-vega/ui/sheet.tsx:61 |
| Drawer | `duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`: a curva do Emil em 300 em vez de 500 porque o lume não tem arraste | registry/base-vega/ui/drawer.tsx:60 |
| Accordion | `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` (a mesma curva de `EASE`) | registry/base-vega/ui/accordion.tsx:67 |
| Sidebar | `transition-[left,right,width] duration-200 ease-linear` (linear sem representar tempo: herança do shadcn, contra a regra) | registry/base-vega/ui/sidebar.tsx:235 |
| Motion | UI 0.12 a 0.25 s (Clear filters 0.13, pílula 0.2, largura de painel 0.25); dados 0.5 a 1 s (`number-ticker` 0.6); acima de 1 s só marketing | registry/base-vega/lib/motion.ts:9-11; components/number-ticker.tsx:51 |

**Always**: escolha a faixa pelo componente, depois a família pelo tipo de movimento; saída mais
curta que a entrada quando o primitivo permitir (duração própria em `data-closed:` no CSS novo);
ease-out para entrar e sair; `EASE`, `ENTRANCE_EASE` ou `REVEAL_EASE` em Motion, nunca uma curva
nova. **Never**: acima de 300 ms em UI de produto sem arraste; ease-in em entrada; linear em algo que
não é tempo; trocar a curva para "consertar" um movimento que só está longo; a mesma duração para um
tooltip e um drawer.
<!-- skill:end -->

### Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8` (press em 150 ms), `tooltip.tsx` (150 pelo padrão da lib),
`dropdown-menu.tsx`, `select.tsx`, `popover.tsx` e `dialog.tsx` em `duration-100`, `sheet.tsx` em
200, `accordion.tsx` em 300 com a curva de `EASE`. Em Motion, `apps/web/src/components/app/data-table.tsx`
(0.13 s), `theme-switcher.tsx` (pílula 0.2 s), `copy-icon.tsx` (0.25 s), `marketing/demo/entrance.ts`
(1.7 s e 1.1 s, só marketing). Nenhum primitivo encurta a saída: o dialog encurta a amplitude
(`zoom-out-[99%]`) no lugar do tempo.

### No lume

- Itens: `motion` (`lib/motion.ts` é o vocabulário; esta tabela são as faixas), `button`, `tooltip`, `dropdown-menu`, `select`, `popover`, `dialog`, `sheet`, `drawer`, `accordion`, `sidebar`, `number-ticker`, `data-table`.
- FRONTEND.md: seções Movimento (durações de UI entre 0.12 e 0.25 s, saída mais curta que a entrada) e Overlays e menus (popups em `duration-100`). Guia: `docs/guia/09-movimento.md` (vocabulário de easings e durações).
- Antes desta tabela vem [Frequência decide](#frequência-decide): a duração só interessa depois de decidir que a interação anima.

## Exceções da borda

Adição do lume. Fontes: Jakub Krehel, better-ui (surfaces.md), https://github.com/jakubkrehel/skills;
Rauno Freiberg, Field Note 4, https://rauno.me/notes/4. Status no Foglamp: integral (linha de tabela,
divisor, rodapé e campos no dark já são as exceções; `scripts/check-allow.txt` lista as demais com
motivo).

### Regra

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

### Valores

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

### Onde aparece no Foglamp

`packages/ui/src/components/table.tsx` (linha, rodapé, cabeçalho sticky com sombra inset),
`input.tsx`, `textarea.tsx`, `select.tsx`, `kbd.tsx` e `toggle.tsx` (hairline no dark),
`checkbox.tsx` e `radio-group.tsx` (contorno do controle), `empty.tsx` (`border-dashed border`, a
única caixa tracejada). O app não tem container com borda em volta de tabela: a tabela senta direto no
card, e o card tem sombra.

### No lume

- Itens: `table`, `data-table`, `separator`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `tabs`, `empty`, `empty-state`.
- FRONTEND.md: seções Sombra no lugar de borda (a lista de "linha fina só nestes lugares") e Tabelas e filtros. Guia: `docs/guia/01-fundacoes.md` e `docs/guia/04-dados.md`.
- O `scripts/check.ts` (verificação 2) barra `border` fechando caixa fora da allowlist e deixa passar `border-b`, `border-t`, `divide-*`, `border border-transparent` e a receita `dark:border` com `dark:shadow-none`: é esta tabela em forma de ferramenta.
- Ponto aberto, não decisão: no light o input do Foglamp não chega aos 3:1 do Jakub no contorno; quem precisa de AA estrito em contraste não textual acrescenta `border border-input` no campo.

## Focus ring

Adição do lume. Fontes: Rauno Freiberg, Web Interface Guidelines (2023), https://interfaces.rauno.me,
Crafting the Next.js Website, https://rauno.me/craft/nextjs, Field Note 4, https://rauno.me/notes/4, e
o capítulo grátis do Devouring Details, https://devouringdetails.com/prototypes/nextjs-dev-tools;
Jakub Krehel, better-accessibility, https://github.com/jakubkrehel/skills. Status no Foglamp: parcial
(anel por box-shadow em 1.5 px a 50 por cento em todo controle e anel inset na linha interativa; o anel
ainda faz fade junto com a cor, e `ring-[3px]` sobrou em badge e tabs).

### Regra

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

### Valores

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

### Onde aparece no Foglamp

`packages/ui/src/components/button.tsx:8`, `input.tsx`, `select.tsx`, `switch.tsx`, `checkbox.tsx`
com o anel de 1.5 px; `table.tsx` com o anel inset na linha interativa; `input-group.tsx` com
`focus-visible:ring-0` no filho. Nenhum arquivo do Foglamp desliga a transição do anel, e `badge.tsx`
e `tabs.tsx` ficaram com o `ring-[3px]` do shadcn.

### No lume

- Itens: `button`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `switch`, `table`, `data-table`, `input-group`, `sidebar`, `badge`, `tabs`.
- FRONTEND.md: seção Acessibilidade e teclado (anel canônico, erro espelha, `ring-[3px]` proibido em componente novo). Guia: `docs/guia/09-movimento.md` (hover, press, focus e cursor).
- Para um componente novo que queira seguir o Rauno à letra: `transition-[color,box-shadow]` vira só `transition-colors`, e o anel aparece sem fade. O lume não muda os primitivos do Foglamp por isso.

## Font Smoothing

Original: https://craft.gustavofior.com/font-smoothing (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/font-smoothing.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

### Regra

O macOS engrossa a borda de todo glifo ao renderizar texto no browser, herança do subpixel rendering
em tela de baixa resolução. Em fundo claro quase não se nota; em fundo escuro vira um brilho, e cada
título parece meio peso mais pesado do que o design. `-webkit-font-smoothing: antialiased` (classe
`antialiased` do Tailwind) desliga o engrossamento e renderiza o glifo no peso real. Só faz efeito
no macOS: Windows (ClearType), Linux, iOS e Android ignoram a propriedade, e tudo bem, porque o
problema é do macOS. Pesos 400 para cima ficam mais limpos; 300 e abaixo afinam demais em tela 1x,
então não use peso leve em fundo escuro.

### Valores

<!-- skill:start -->
| O quê | Valor | Onde |
|---|---|---|
| Classe no `body` | `antialiased` (`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`) | Foglamp `apps/web/src/app/layout.tsx:78` |
| Opt-out de uma região | `subpixel-antialiased` (devolve o padrão do browser) | craft font-smoothing.mdx; nenhum uso no Foglamp |
| Pesos usados no app | `font-medium` (500) é o teto em UI; `font-[470]` no delta do stat card; nunca `font-light` | registry/base-vega/components/stat-card.tsx:204 |
| Tema padrão | `defaultTheme="dark"`: a maioria dos usuários vê o caso em que o brilho aparece | registry/base-vega/components/theme-provider-csp.tsx:59; docs/DECISOES.md |
| Fundo escuro | `--background: oklch(0.17 0 0)`, `--foreground: oklch(0.985 0 0)` | registry/base-vega/styles/globals.css:133-134 |

**Always**: `antialiased` no `<body>` do app, uma vez (Next: `app/layout.tsx`; Vite: `index.html`).
**Never**: `font-light` ou `font-thin` em superfície escura; `antialiased` espalhado por componente
(a regra é global; a exceção é `subpixel-antialiased` numa região que precise do padrão).
<!-- skill:end -->

Os quatro valores da propriedade: `auto` (padrão, engrossa), `antialiased` (grayscale, o que você
quer), `subpixel-antialiased` (força o padrão de volta numa região) e `none` (serrilhado, sem uso em
produto). Desde o Firefox 128 o Firefox no macOS honra a propriedade WebKit; a linha
`-moz-osx-font-smoothing: grayscale` que o Tailwind emite junto só serve a versões antigas.

### Onde aparece no Foglamp

`apps/web/src/app/layout.tsx:78`: `"antialiased"` no `className` do `<body>`, junto das variáveis
das três fontes (`inter.variable`, `geistMono.variable`, `hostGrotesk.variable`). O CSS module do
guia de observabilidade repete a propriedade
(`apps/web/src/components/marketing/how-it-works/observability-guide.module.css:11`). O
`globals.css` do pacote `ui` não declara smoothing: a regra vive no app, não no design system, e o
craft faz igual (`layout.tsx:101` do craft, mapa 3.4).

### No lume

- O `base` (registry/base-vega/styles/globals.css) segue o Foglamp e não declara `antialiased`: a classe vai no `<body>` do app, como manda `docs/adocao/next-novo.md` e `docs/adocao/vite.md`. Se o texto parece gordo no dark num Mac, é isso que está faltando.
- Itens: `base`, `theme-provider` e `theme-provider-csp` (o dark é o padrão, então este conceito deixa de ser detalhe e vira pré-requisito).
- FRONTEND.md: seção 7 (Tipografia: `font-medium` é o peso máximo no app) e seção 22 (Dark mode). Guia: `docs/guia/01-fundacoes.md`.
- Só macOS: teste o dark num Mac antes de aprovar peso de fonte; no Windows o engrossamento não existe e a comparação engana nos dois sentidos.

## Frequência decide

Adição do lume. Fontes: Emil Kowalski, You Don't Need Animations,
https://emilkowal.ski/ui/you-dont-need-animations, e a tabela de frequência da skill emil-design-eng,
https://github.com/emilkowalski/skills; Jakub Krehel, Less is more, more or less,
https://jakub.kr/writing/less-is-more; Rauno Freiberg, Invisible Details of Interaction Design,
https://rauno.me/craft/interaction-design; Benji Taylor, Family Values, https://benji.org/family-values;
Raphael Salaja, To Spring or Not To Spring, https://www.userinterface.wiki/to-spring-or-not-to-spring.
Status no Foglamp: parcial (hover instantâneo, popups de 100 ms e filtro de tabela sem animação; a
sidebar ainda desliza por atalho e o dialog anima igual na décima abertura).

### Regra

Antes de perguntar "qual curva" pergunte "quantas vezes por dia". Uma animação de 300 ms é agradável
na primeira vez e invisível na décima; na centésima ela é só espera. O Emil fecha isso em quatro
faixas por frequência de uso; o Jakub faz a conta (200 aberturas de context menu por dia vezes 300 ms
dá perto de 1 minuto por dia, cerca de 6 horas por ano, num menu que ninguém pediu para ver animar);
o Rauno põe frequência e novidade em lados opostos da mesma balança; o Benji desenha a Delight-Impact
Curve (quanto menos frequente a função, mais delight ela aguenta); o Raphael lista o que nunca anima:
digitação, navegação por teclado, toggles rápidos e a entrada de um context menu. Os cinco chegam ao
mesmo lugar por caminhos diferentes, e por isso esta é a primeira regra de movimento do lume, antes de
duração e de easing.

### Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| 100 ou mais vezes por dia (hover, digitação, setas, troca de aba, context menu, atalho) | nenhuma animação | Emil, tabela de frequência |
| Dezenas por dia (dropdown, select, filtro, tooltip, toggle) | remover ou reduzir muito: até 150 ms, só opacidade e fundo | Emil; Jakub (feedback instantâneo ou até 150 ms em opacity e background-color) |
| Ocasional (dialog, drawer, troca de página, painel lateral) | padrão: 200 a 300 ms | Emil |
| Raro (onboarding, primeiro sucesso, estado vazio, revelação de chave) | pode ter delight | Emil; Benji, Delight-Impact Curve |
| A conta | 200 aberturas por dia vezes 300 ms: cerca de 1 min por dia, cerca de 6 h por ano | Jakub |
| Nunca anima | digitação, navegação por teclado, toggles rápidos, entrada de context menu | Raphael |
| Frequência contra novidade | ação feita centenas de vezes não anima; a novidade que encanta hoje é a taxa de amanhã | Rauno |
| Hover instantâneo | `hover:bg-sidebar-accent` no botão da sidebar, que só transiciona `transition-[width,height,padding]` | registry/base-vega/ui/sidebar.tsx:480 |
| Popup frequente | `duration-100` em dropdown, select, popover, context menu, hover card e menubar; o tooltip não tem classe de duração e fica nos 150 ms padrão do `tw-animate-css` | registry/base-vega/ui/dropdown-menu.tsx:47; select.tsx:133; popover.tsx:42; tooltip.tsx:58 |
| Filtro de tabela | as linhas trocam sem transição; só o botão Limpar entra em 0.13 s com `easeOut` | registry/base-vega/blocks/data-table/data-table.tsx:659-662 |
| Valor que muda em stat card | `number-ticker` anima 0.6 s só quando o valor muda depois do mount; a primeira pintura é estática | registry/base-vega/components/number-ticker.tsx:50-54 |
| Atalho que recolhe a sidebar | sem transição: o `AppShell` marca `data-instant` no canvas por dois frames e `[&[data-instant]_*]:transition-none` corta tudo; pelo clique, os 200 ms do primitivo com `EASE` | registry/base-vega/blocks/app-shell/app-shell.tsx |
| Menus do shell (seletor de contexto, zona, trilho e ⋯) | `data-open:duration-0` sobre a string canônica: a entrada é 0 e a saída faz o fade de 100 ms | `nav-list.tsx` e `shell-parts.tsx` em registry/base-vega/blocks/app-shell/ |

**Always**: classifique a interação pela faixa antes de animar; na faixa alta, feedback por cor ou
fundo sem transição (`transition-none` ou nada); na faixa média, `duration-100` e só opacidade e
escala leve; delight só na faixa rara, e uma vez. **Never**: animação em digitação, foco por teclado,
setas, troca de aba ou atalho; `transition-all` em item de lista; o mesmo movimento de 300 ms num
menu que abre cem vezes por dia; julgar a animação pela primeira impressão em vez de pela centésima.
<!-- skill:end -->

### Onde aparece no Foglamp

Parcial. A favor: `packages/ui/src/components/sidebar.tsx` (hover sem transição), os popups de
`packages/ui` em 100 ms, `apps/web/src/components/app/data-table.tsx` (o filtro troca as linhas a
seco, só o Clear filters entra em 0.13 s), `org-settings-client.tsx:158-166` (texto da tab vira sem
fade), `checkbox.tsx:20` e `range-picker.tsx:205` com `transition-none`, `copy-icon.tsx` com
`initial={false}`. Contra: a sidebar desliza 200 ms mesmo por Cmd/Ctrl+B (`sidebar.tsx:235`; o `AppShell` corta a
transição no atalho com `data-instant`) e `transition-colors` em 63 lugares.

### No lume

- Itens: `sidebar`, `app-shell`, `dropdown-menu`, `select`, `popover`, `tooltip`, `data-table`, `number-ticker`, `checkbox`, `range-picker`, `motion` (o comentário de `lib/motion.ts` fixa as faixas de duração; a tabela acima diz quando a duração é zero).
- FRONTEND.md: seções Movimento (hover instantâneo ou só de cor, `initial={false}` no que já está no lugar) e Overlays e menus (string canônica de popup em `duration-100`). Guia: `docs/guia/09-movimento.md`.
- Conceitos vizinhos: [Hover Restraint](#hover-restraint) (a faixa alta aplicada ao hover), [Duração por componente](#duração-por-componente) (quanto, depois de decidir se) e [Novelty budget](#novelty-budget) (o lado da novidade na balança do Rauno).

## Hit areas

Adição do lume. Fontes: Jakub Krehel, better-accessibility, https://github.com/jakubkrehel/skills;
Rauno Freiberg, Web Interface Guidelines (2023), https://interfaces.rauno.me, Field Note 5,
https://rauno.me/notes/5, e o capítulo grátis do Devouring Details,
https://devouringdetails.com/prototypes/nextjs-dev-tools; Raphael Salaja, Laws of UX,
https://www.userinterface.wiki/laws-of-ux, e Taking Advantage of Pseudo Elements,
https://www.userinterface.wiki/taking-advantage-of-pseudo-elements; Emil Kowalski, Agents with Taste,
https://emilkowal.ski/ui/agents-with-taste. Status no Foglamp: parcial (checkbox, radio e switch
expandem por pseudo-elemento; o lume estende ao botão `icon-xs`; itens de menu e de lista dependem do
padding).

### Regra

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

### Valores

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

### Onde aparece no Foglamp

`packages/ui/src/components/checkbox.tsx`, `radio-group.tsx` e `switch.tsx` com
`after:absolute after:-inset-x-3 after:-inset-y-2` (o mapa 3.4 lista a receita como Hit Areas,
rascunho não publicado do craft). O `Button` do Foglamp não expande o `icon-xs`: a expansão é adição
do lume na v0.2.0. Itens de menu e de sidebar fazem o alvo pelo padding (`p-2` no botão da sidebar,
`px-2 py-1.5` no item de menu).

### No lume

- Itens: `checkbox`, `radio-group`, `switch`, `button` (`icon-xs`), `dropdown-menu`, `table`, `data-table`, `resizable`.
- FRONTEND.md: seções Botões (sizes), Acessibilidade e teclado (linha operável por teclado, `stopPropagation` nos links da linha) e Campos e formulários. Guia: `docs/guia/02-primitivos.md`.
- Fora do app: a regra de 44 px em touch vale para o `drawer` e qualquer tela que também abra no celular; o Foglamp é desktop e fica em 32.

## Hover Restraint

Original: https://craft.gustavofior.com/hover-restraint (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/hover-restraint.mdx. Seção: Motion.
Status no Foglamp: parcial (mapa 3.4).

### Regra

Hover é a interação mais frequente que existe: ao varrer o cursor por uma nav você cruza dez itens
num segundo. Se cada um faz fade, a interface fica sempre alguns frames atrás do ponteiro e parece
lenta mesmo sem estar. Quanto mais frequente a interação, menos animação ela aguenta: hover é
instantâneo por padrão. A exceção é o tooltip, que precisa de um atraso para não abrir de passagem;
depois que o primeiro abriu, os vizinhos abrem na hora. A mesma lógica vale para ação por atalho de
teclado: quem aperta Cmd+B quarenta vezes por dia não quer ver o painel chegar deslizando. A linha é
frequência e intenção, não dispositivo: um modal que abre uma vez por sessão pode animar; um painel
que você vira quarenta vezes por dia, não.

### Valores

<!-- skill:start -->
| Caso | String ou valor exato | Arquivo |
|---|---|---|
| Hover instantâneo em item de nav | `transition-[width,height,padding]` no botão da sidebar: `hover:bg-sidebar-accent` não transiciona | registry/base-vega/ui/sidebar.tsx:480 |
| Checkbox | `grid place-content-center text-current transition-none [&>svg]:size-2.5` no indicador | registry/base-vega/ui/checkbox.tsx:22 |
| Link do navigation menu | `flex items-center gap-1.5 rounded-lg p-2 text-sm transition-none outline-none hover:bg-muted ...` | registry/base-vega/ui/navigation-menu.tsx:134 |
| Dias do calendário no range picker | `**:data-day:transition-none` | registry/base-vega/blocks/range-picker/range-picker.tsx:208 |
| Botão (teto do hover animado) | `transition-all hover:duration-150` | registry/base-vega/ui/button.tsx:10 |
| Tooltip: padrão | `TooltipProvider` com `delay = 0` | registry/base-vega/ui/tooltip.tsx:9-11 |
| Tooltip em tabela e timeline | `<TooltipProvider delay={150}>` envolvendo a página | Foglamp `app/(app)/traces/traces-client.tsx:642`, `sessions/sessions-client.tsx:288`, `agents/agents-client.tsx:227`, `workflows/workflows-client.tsx:229`, `evals/evals-client.tsx:841`, `traces/[traceId]/trace-detail-client.tsx:1078`, `components/app/trace-timeline.tsx:503` |
| Tooltip em prosa | `delay={200}` | Foglamp `apps/web/src/components/app/prompt-prose.tsx:197` |
| Tab segmentada | sem `transition-colors` no texto; `hover:transition-colors` só no estado inativo, para o hover suavizar e a troca de aba ser seca | Foglamp `app/(app)/settings/org/org-settings-client.tsx:158-166` |
| Sidebar por atalho (Cmd/Ctrl+B) | `transition-[left,right,width] duration-200 ease-linear` (anima mesmo por teclado: contra o artigo); o `AppShell` corta a transição no atalho com `data-instant` no canvas por dois frames e `[&[data-instant]_*]:transition-none` | registry/base-vega/ui/sidebar.tsx:235; registry/base-vega/blocks/app-shell/app-shell.tsx |
| Tooltip do trilho | `TooltipProvider delay={150}` em volta da sidebar, montado pelo `AppShell`: o primeiro espera 150 ms e os vizinhos abrem na hora | registry/base-vega/blocks/app-shell/app-shell.tsx |
| Craft | tooltip: o primeiro espera 400 a 700ms, os vizinhos abrem na hora; hover sem transição | craft hover-restraint.mdx |
| Delay do tooltip: três fontes | Rauno (UI Playbook): cerca de 100 ms no primeiro, zero nos vizinhos; craft: 400 a 700 ms; Foglamp: `delay={150}` em tabela e timeline. O lume fica em 150 | https://uiplaybook.dev; craft hover-restraint.mdx; Foglamp `traces-client.tsx:642` |
| Menu e popover | abrem instantâneo e só fazem fade ao fechar; sem fade entre itens do menu; o context menu anima só na saída | Shu Ding, On UI Animations, https://shud.in/thoughts/on-ui-animations; Raphael Salaja, 12 Principles of Animation, https://www.userinterface.wiki/12-principles-of-animation |
| Tooltip vizinho | `data-instant:duration-0` no Popup: o Base UI marca `data-instant` quando um tooltip abre a partir de outro já aberto, e a animação cai para zero junto com o delay | registry/base-vega/ui/tooltip.tsx (v0.2.0); Emil Kowalski, 7 Practical Animation Tips (tip 3), https://emilkowal.ski/ui/7-practical-animation-tips |
| Hover só com hover | estado hover dentro de `@media (hover: hover) and (pointer: fine)`; recomendação para componente novo, a registry não tem | Emil (skill emil-design-eng); Jakub (better-ui); Rauno (interfaces.rauno.me) |

**Always**: hover de cor e fundo sem transição ou com no máximo 150ms (o `Button` é o teto);
`TooltipProvider delay={150}` em volta de tabela, timeline ou grade com muitos gatilhos; tooltips de
um grupo de botões de ícone dentro de um único `TooltipProvider`, para só o primeiro esperar.
**Never**: hover que escala, levanta sombra ou desliza (`hover:scale-*`, `hover:shadow-lg`,
`hover:-translate-y-*`); `transition-all` em item de lista ou de nav; `delay` acima de 200ms em
tooltip de dashboard; atraso artificial em hover.
<!-- skill:end -->

Fontes além do craft (adição do lume, levantamento de 17/10/2026). O delay do tooltip tem três
números publicados e cada um resolve um contexto: os 100 ms do Rauno são para barra de ícones, onde o
tooltip é o rótulo e precisa aparecer quase junto com o hover; os 400 a 700 do craft são para prosa e
superfície grande, onde o cursor passa por cima sem querer; os 150 do Foglamp são o meio-termo de uma
tabela com dezenas de gatilhos pequenos, rápido o bastante para ler o rótulo e lento o bastante para
não abrir de passagem. O lume fica em 150 por isso, e mantém `delay = 0` no provider por fidelidade.
Sobre abrir instantâneo: o Foglamp anima a entrada dos popups em 100 ms com `zoom-in-95`, contra a
regra do Shu e do Raphael de só animar a saída; 100 ms fica abaixo do que lê como atraso, e o lume
mantém a string canônica. O que entra na v0.2.0 é o `data-instant:duration-0` no tooltip (Emil, tip
3), que faz o vizinho abrir sem delay e sem animação. A media query de hover é recomendação para
componente novo: os primitivos do Foglamp não a usam e o lume não os altera.

### Onde aparece no Foglamp

Parcial. A favor: `org-settings-client.tsx:158-166` (comentário explicando que o texto da tab vira
sem fade porque o fade atrasado leria como tremor), `range-picker.tsx:205`, `checkbox.tsx:20`,
`navigation-menu.tsx:132`, `sidebar.tsx:478`. Contra: `transition-colors` em 63 lugares, o `Button`
com `transition-all hover:duration-150`, `tooltip.tsx:8` com `delay = 0` (o artigo pede 400 a 700ms;
o Foglamp prefere 150ms nas tabelas e aceita o tooltip abrir de passagem), e a sidebar deslizando
200ms mesmo por atalho.

### No lume

- Itens: `button`, `sidebar`, `checkbox`, `tooltip`, `navigation-menu`, `range-picker`, `app-shell` (`nav-icon.tsx:47,54` faz o crossfade outline/filled em `transition-opacity duration-100 ease-in-out` só na troca de item ativo, não no hover).
- FRONTEND.md: seção 19 (Overlays e menus: `TooltipProvider delay={150}` em tabelas) e seção 21 (Movimento). Guia: `docs/guia/09-movimento.md`.
- O lume mantém `delay = 0` no `tooltip` por fidelidade; a regra praticada é `delay={150}` em tabela, e quem coloca o provider é a página, como nas seis páginas de lista do Foglamp. O `data-table` não envolve a tabela num provider. A exceção é o `app-shell`, que monta `TooltipProvider delay={150}` em volta da sidebar para o tooltip do trilho, e que recolhe pelo atalho sem transição.

## HTML Background

Original: https://craft.gustavofior.com/html-background (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/html-background.mdx. Seção: Layout.
Status no Foglamp: não aparece (mapa 3.4); o lume adota.

### Regra

O browser pinta uma tela (o canvas) atrás da página. Quando só o `body` ou um wrapper tem cor de
fundo, o overscroll do Safari e qualquer área fora do conteúdo mostram o canvas branco: num app
dark, uma faixa branca aparece ao puxar além do topo. O browser até usa o fundo do `body` quando o
`html` é transparente, mas isso é comportamento de fallback; pintar o root
(`html { background-color: var(--background) }`) deixa a intenção explícita e não depende dele. O
token precisa seguir o tema ativo, senão o flash volta num dos modos.

### Valores

<!-- skill:start -->
| O quê | Valor | Onde |
|---|---|---|
| Root pintado (adição do lume) | `html { @apply font-sans bg-background; }` dentro de `@layer base` | registry/base-vega/styles/globals.css:285-289 |
| Body | `body { @apply font-sans bg-background text-foreground selection:bg-primary/10; }` | registry/base-vega/styles/globals.css:290-292 |
| Token por tema | `--background: oklch(0.99 0 0)` no `:root`, `oklch(0.17 0 0)` no `.dark` | registry/base-vega/styles/globals.css:23,133 |
| Página solta (adição do lume) | o `main` raiz é o canvas (`bg-sidebar`) e leva `[html:has(&)]:bg-sidebar`, que gera `html:has(...)` e pinta o documento no mesmo tom enquanto a página está montada | docs/guia/03-shell-e-paginas.md, Página solta |
| Tema no root antes da primeira pintura | `theme-provider` (next-themes; o app passa `attribute="class" defaultTheme="dark" enableSystem`, como em app/layout.tsx:24-26) ou `theme-provider-csp` com `public/theme.js` (sem script inline, `defaultTheme = "dark"`) | registry/base-vega/components/theme-provider.tsx; theme-provider-csp.tsx:59; registry/base-vega/public/theme.js |
| `theme-color` | não usado no Foglamp nem no lume; se adicionar, manter em sincronia com o tema | craft html-background.mdx |
| `overscroll-behavior: none` | não usar por padrão: o bounce é parte da plataforma | craft html-background.mdx |

**Always**: o mesmo token de fundo no `html`, no `body` e no app; classe `.dark` aplicada no `html`
antes de o React montar. **Never**: `bg-background` só num wrapper `min-h-screen`; cor literal no
`html` (`#0a0a0a`) que não segue o tema; `overscroll-behavior: none` em página de conteúdo; dois
`@custom-variant dark` no mesmo CSS (o `init` da CLI pode duplicar, confira depois de instalar).
<!-- skill:end -->

### Onde aparece no Foglamp

Não aparece. `packages/ui/src/styles/globals.css:305-307` dá ao `html` apenas `font-sans`; o
`bg-background` fica no `body` (`:291-293`) e o `apps/web/src/app/layout.tsx:65-69` põe no `<html>`
só `font-sans` e a variável da Inter. Sem `theme-color`. O site antigo do autor (2023) já pintava
`html` e `body` em `#fafafa` (mapa 3.8); o Foglamp perdeu o detalhe, e no tema dark padrão o
overscroll do Safari mostra branco.

### No lume

- O `base` adota o conceito: `html { @apply font-sans bg-background }` em `@layer base` (adição do lume, comentada no globals.css:285-286). É a única diferença de `@layer base` em relação ao Foglamp além das fontes via Fontsource.
- Itens: `base`, `theme-provider`, `theme-provider-csp`, `app-shell` (o canvas do shell usa `--sidebar`, um passo mais escuro que `--background`; ver `docs/guia/03-shell-e-paginas.md`. O `html` continua com `--background`, a cor do inset).
- A página solta (login, link por token, convite) não fica em `--background`: o `main` raiz pinta o canvas `bg-sidebar`. Para o overscroll do Safari não mostrar acima e abaixo dela o passo mais claro do `--background` (0,17 contra 0,145 de luminosidade no escuro, 0,99 contra 0,975 no claro), o mesmo `main` leva `[html:has(&)]:bg-sidebar`, e o documento acompanha o canvas só enquanto a página está montada.
- FRONTEND.md: seção 3 (Tokens e cor), seção 22 (Dark mode) e seção 29 (Next.js e Vite: no Vite a classe do tema entra no `index.html` pelo `public/assets/tema.js`, ver `docs/adocao/vite.md`).
- Teste: abra o app no Safari (macOS ou iOS) no dark, puxe além do topo e além do fim; nada branco pode aparecer.

## Image Outlines

Original: https://craft.gustavofior.com/image-outlines (Gustavo Fior, MIT; o autor credita Jakub
Krehel). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/color/image-outlines.mdx. Seção: Color.
Status no Foglamp: integral (mapa 3.4).

### Regra

Imagem não sabe o que tem atrás: céu claro em card branco não tem borda, foto com canto claro se
funde na página, avatar com inicial branca flutua. Uma linha de 1px a 10% de opacidade pintada por
dentro da imagem dá forma a toda imagem sem ler como moldura. Por dentro, não ao redor: `border`
fica entre padding e margem, ocupa espaço e muda o tamanho da caixa; `outline` com offset negativo
ou `box-shadow` inset pinta por cima dos pixels de borda. Preto no light, branco no dark. Abaixo de
5% a linha some contra um céu pálido; acima de 20% vira elemento de design.

### Valores

<!-- skill:start -->
| Caso | String exata | Fonte |
|---|---|---|
| Imagem ou capa em card (Tailwind) | `outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10` | craft image-outlines.mdx |
| Mesmo efeito em CSS | `.border-overlay { outline: 1px solid rgba(0, 0, 0, 0.1); outline-offset: -1px; }` e `.dark .border-overlay { outline-color: rgba(255, 255, 255, 0.1); }` | Foglamp `apps/web/src/index.css:33-40` |
| Uso em card com gradiente | `border-overlay relative h-32 shrink-0 overflow-hidden rounded-xl squircle:rounded-[36px] corner-squircle bg-linear-to-br shadow-(--custom-shadow)` | Foglamp `apps/web/src/components/scan/personality-card.tsx:17` |
| Avatar | `after:absolute after:inset-0 after:rounded-full after:shadow-(--custom-shadow) after:mix-blend-darken` + `dark:after:mix-blend-lighten` (o hairline de 0.5px a 6% da sombra do sistema faz o papel do outline; o blend garante que escurece no light e clareia no dark sobre qualquer foto) | registry/base-vega/ui/avatar.tsx:22 |
| Faixa de opacidade | 10% padrão; entre 5% e 20% | craft image-outlines.mdx |
| Cor da linha | preto puro ou branco puro a 10%: `oklch(0 0 0 / 0.1)` no light e `oklch(1 0 0 / 0.1)` no dark, com `outline-offset: -1px`; nunca um cinza da paleta (`--border`), porque a cor sólida tinge a borda da foto em vez de só escurecer ou clarear o que está embaixo | Jakub Krehel, better-ui, https://github.com/jakubkrehel/skills |

**Always**: a linha vai por cima da imagem (`outline` com offset negativo, `box-shadow` inset ou
pseudo-elemento), nunca `border`; cor por tema. **Never**: `ring-1 ring-border` em imagem (no light
`--border` é um cinza sólido, não 10% de preto); `outline-1 -outline-offset-1` sem cor explícita (o
`* { @apply border-border outline-ring/50 }` do globals.css:283 daria a cor do `ring`); linha em
logo SVG monocromático.
<!-- skill:end -->

Fontes além do craft (adição do lume, levantamento de 17/10/2026). O Jakub, que o craft credita por
este conceito, fecha a proibição que o artigo deixa implícita: a linha é preto puro ou branco puro
com alfa, nunca um cinza opaco da paleta. A razão é ótica: preto a 10 por cento sobre qualquer pixel
só o escurece um décimo, e branco a 10 por cento só o clareia; um cinza sólido como `--border`
substitui o pixel por uma cor fixa, e numa foto quente a linha fica fria, numa foto escura fica
clara. É o mesmo motivo do `mix-blend-darken` e `dark:mix-blend-lighten` no `avatar` do Foglamp: o
blend garante que a sombra só escurece no light e só clareia no dark, seja qual for a foto.

### Onde aparece no Foglamp

`apps/web/src/index.css:33-40` define `.border-overlay`, que é o CSS do artigo ao pé da letra (o
comentário diz: "Crisp 1px inner outline on top of any surface (theme-aware)"), usada no card de
personalidade do scan (`scan/personality-card.tsx:17`) por cima de um gradiente. O avatar de
`packages/ui/src/components/avatar.tsx` usa a sombra do sistema em pseudo-elemento com blend, a
variante do conceito para círculos. Os logos de provedores do app não recebem outline: são SVGs
monocromáticos sobre tile `bg-muted`.

### No lume

- Itens: `avatar` (já vem com a linha), `card` (para `img` como primeiro ou último filho o card arredonda com `*:[img:first-child]:rounded-t-3xl` e `*:[img:last-child]:rounded-b-3xl`, registry/base-vega/ui/card.tsx:17; a linha você adiciona na própria `img` com a string do craft).
- A classe `.border-overlay` do Foglamp não está na registry; use a string Tailwind direto na `img`. Se um projeto repetir muito, declare a classe no `globals.css` do app (adição do lume, fora do `base`).
- FRONTEND.md: seção 4 (Sombra no lugar de borda: a imagem é mais um lugar onde `border` não entra) e seção 6 (Superfícies). Guia: `docs/guia/01-fundacoes.md`.
- Teste rápido: coloque uma imagem quase branca num card no light e uma quase preta num card no dark; se alguma perde a forma, falta a linha.

## Interruptibility

Original: https://craft.gustavofior.com/interruptibility (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/interruptibility.mdx. Seção: Motion.
Status no Foglamp: parcial (mapa 3.4).

### Regra

Abra um sheet e feche antes de ele chegar: ele deve dar meia-volta de onde está, não pular para
"aberto" e começar a fechar do zero. Keyframe é gravação (toca do primeiro frame, sempre); transição
é destino (o browser anima de onde o elemento está até onde deve ficar, e se o destino muda no meio,
só muda de rumo). Mola ainda guarda a velocidade, então a volta é um movimento só. Logo: transição
ou spring para tudo que a pessoa pode alternar; keyframes só para one-shot que nada interrompe
(spinner, caret, shimmer). E nunca trancar a porta: nenhum `isAnimating` que descarta clique, nenhum
`pointer-events: none` enquanto algo se move; o clique descartado faz a pessoa clicar de novo, e
piora. Teste: abrir e fechar dez vezes o mais rápido que conseguir.

### Valores

<!-- skill:start -->
| Caso | String ou valor exato | Arquivo |
|---|---|---|
| Sheet (transição Base UI) | overlay `transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0`; painel `transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 ... data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10` | registry/base-vega/ui/sheet.tsx:33,61 |
| Accordion | `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:h-0 data-starting-style:h-0` | registry/base-vega/ui/accordion.tsx:67 |
| Navigation menu | `transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] ... data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150` | registry/base-vega/ui/navigation-menu.tsx:116 |
| Pílula segmentada (spring) | `MORPH = { type: "spring", stiffness: 400, damping: 38 }` com `layoutId` | registry/base-vega/lib/motion.ts:29; components/theme-switcher.tsx |
| Toolbar que troca de pai | `TOOLBAR_SPRING = { type: "spring", stiffness: 520, damping: 44 }`, `layout="position"`, `layoutDependency={lifted}` | registry/base-vega/lib/motion.ts:33-37; blocks/data-table/data-table.tsx:286-306 |
| Troca de ícone copy/check | `COPY_SPRING = { type: "spring", duration: 0.25, bounce: 0 }` em `AnimatePresence mode="popLayout" initial={false}` | registry/base-vega/lib/motion.ts:41-45; components/copy-icon.tsx:29 |
| Keyframes aceitos (tw-animate, `duration-100`) | dialog e alert-dialog `data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[96%] data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[99%]`; popover, tooltip, dropdown, hover-card, menubar, combobox com `zoom-in-95` e `zoom-out-95` | registry/base-vega/ui/dialog.tsx:36,58; ui/popover.tsx:42; ui/tooltip.tsx:58; ui/dropdown-menu.tsx:47 |
| One-shots legítimos | `animate-caret-blink` (ui/input-otp.tsx:68); `--animate-shimmer: shimmer 4s linear infinite` (styles/globals.css:269) | registry/base-vega |
| Craft | `transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1)`; spring `stiffness: 300, damping: 30`; `@starting-style` para entrar a partir de `display: none` | craft interruptibility.mdx |

**Always**: componente novo anima por `data-starting-style` e `data-ending-style` (Base UI) ou por
`animate` e spring do `lib/motion.ts`; keyframe só em one-shot; `useReduce()` devolvendo o estado
final. **Never**: `isAnimating` ou `disabled` enquanto anima; `pointer-events-none` como trava de
animação; aumentar o `duration-100` dos keyframes do dialog e do popover (curtos, a falta de
interrupção não aparece); curva ou mola nova fora do `lib/motion.ts`.
<!-- skill:end -->

### Onde aparece no Foglamp

Parcial. Transições em `packages/ui/src/components/sheet.tsx:59`, `accordion.tsx:65`,
`navigation-menu.tsx:114`; molas em `apps/web/src/app/(app)/evals/eval-settings-fields.tsx:154` e
`components/theme-switcher.tsx:27` (`400/38`), `components/app/data-table.tsx:360` (`520/44`),
`copy-icon.tsx:30` (`duration 0.25, bounce 0`). Mas Dialog, AlertDialog, Popover e Tooltip usam
keyframes do tw-animate (`dialog.tsx:56`), que não dão meia-volta. Nenhum `isAnimating` no repo
(grep zero): a porta nunca é trancada. Quando um toast novo chega, o Sonner usa transição CSS e os
anteriores se reposicionam sem pular.

### No lume

- Itens: `motion` (vocabulário fechado: `EASE`, `ENTRANCE_EASE`, `REVEAL_EASE`, `MORPH`, `TOOLBAR_SPRING`, `COPY_SPRING`, `useReduce`), `sheet`, `accordion`, `dialog`, `popover`, `data-table`, `copy-icon`, `theme-switcher`, `sonner`.
- FRONTEND.md: seção 19 (Overlays e menus) e seção 21 (Movimento: `motion/react` permitido com o vocabulário do `lib/motion.ts`; reduced motion = estado final). Guia: `docs/guia/09-movimento.md`.
- Os primitivos com keyframes vêm verbatim do Foglamp; trocá-los por transição Base UI é mudança de upstream, não do lume. Se fizer, registre no CHANGELOG como mudança de comportamento.

## Nested Border Radius

Original: https://craft.gustavofior.com/nested-border-radius (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/nested-border-radius.mdx. Seção:
Layout. Status no Foglamp: integral (mapa 3.4).

### Regra

Quando uma caixa arredondada fica dentro de outra, o raio de dentro é o de fora menos a distância
entre as bordas (padding do pai, mais a borda se houver): `inner = outer - inset`, com piso zero
(`max()` em CSS). Raio igual nos dois faz o espaço engordar no canto, e isso é uma das coisas
pequenas que deixam uma interface "esquisita". Começando pelo componente externo, o caso de um
design system, a conta é a mesma invertida. Com squircle (`corner-shape: squircle`) a regra
continua, e o `corner-squircle` precisa ser setado nos dois níveis (não herda). O nome técnico é
concentric corners. A fórmula é ponto de partida: quando o filho não chega ao canto ou o inset muda
em volta, ajuste no olho.

### Valores

<!-- skill:start -->
Escala do lume (registry/base-vega/styles/globals.css:46,261-267): `--radius: 0.625rem` (10px); `sm`
6px, `md` 8px, `lg` 10px, `xl` 14px, `2xl` 18px, `3xl` 22px, `4xl` 26px. O squircle parece mais
apertado no mesmo raio, por isso cada par plano/squircle sobe o raio na variante `squircle:`.

| Par externo e interno | Classes exatas | Arquivo |
|---|---|---|
| Canvas e inset do shell | canvas com `m-2`; inset `md:rounded-lg squircle:md:rounded-3xl` | registry/base-vega/blocks/app-shell/app-shell.tsx:529 |
| Card e imagem interna | `rounded-lg squircle:rounded-3xl corner-squircle` e `*:[img:first-child]:rounded-t-3xl *:[img:first-child]:corner-squircle` (imagem encosta na borda: inset 0, mesmo raio) | registry/base-vega/ui/card.tsx:17 |
| Popover e preset do range picker | popover `rounded-lg squircle:rounded-3xl` com coluna `p-3`; preset `rounded-sm squircle:rounded-xl corner-squircle` (comentário: raio do popover menos os 12px de padding, com piso onde o plano ficaria negativo) | registry/base-vega/ui/popover.tsx:42; blocks/range-picker/range-picker.tsx:191-194 |
| Lista de tabs e trigger | lista `rounded-md squircle:rounded-2xl corner-squircle ... p-[3px]`; trigger `rounded-md squircle:rounded-xl corner-squircle` | registry/base-vega/ui/tabs.tsx:29,63 |
| Input group e botão interno | grupo `h-9 ... rounded-md squircle:rounded-xl corner-squircle`; botão `xs` e `icon-xs` `rounded-[calc(var(--radius)-5px)]`; `kbd` idem | registry/base-vega/ui/input-group.tsx:19,28,75,78 |
| Command e item | `rounded-lg squircle:rounded-3xl! corner-squircle ... p-1`; item `rounded-lg`, e `in-data-[slot=dialog-content]:rounded-2xl!` quando o command vira dialog | registry/base-vega/ui/command.tsx:30,161 |
| Dialog | `rounded-2xl squircle:rounded-[40px] corner-squircle ... p-6` | registry/base-vega/ui/dialog.tsx:58 |
| Tile de ícone da nav dentro do botão | tile `rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle`; botão `rounded-md squircle:rounded-xl corner-squircle p-2` | registry/base-vega/blocks/app-shell/nav.ts:85-101; ui/sidebar.tsx:480 |
| Corte do padding | a conta `inner = outer - inset` vale até 24 px de padding; acima disso, pai e filho são superfícies separadas e cada um escolhe o raio pela escala. O dialog do Foglamp (`p-6`, 24 px) fica exatamente no corte: por isso o command dentro do dialog usa raio próprio, `in-data-[slot=dialog-content]:rounded-2xl!` | Jakub Krehel, better-ui SKILL.md, https://github.com/jakubkrehel/skills; registry/base-vega/ui/dialog.tsx:58; command.tsx:161 |

**Always**: calcular o raio interno a partir do pai e do padding; `corner-squircle` nos dois níveis;
piso `rounded-sm` quando a conta dá zero ou negativo. **Never**: o mesmo `rounded-*` no pai e no
filho com padding entre eles; raio fora da escala (`rounded-[7px]`) sem comentário com a conta;
`corner-squircle` só no pai esperando que o filho herde.
<!-- skill:end -->

Fontes além do craft (adição do lume, levantamento de 17/10/2026). A fórmula do artigo não diz
quando parar, e o Jakub diz: a partir de 24 px de padding, o filho está longe demais da borda do pai
para o olho ler os dois cantos como concêntricos, e forçar a conta dá raios internos minúsculos ou
negativos que parecem erro. Acima do corte, cada caixa é uma superfície por conta própria e usa a
escala normal (`--radius` e os pares plano/squircle do `globals.css`). O Foglamp chega no mesmo
resultado pela prática: dentro do dialog de `p-6` ninguém subtrai 24 px do `rounded-2xl`; o command
que vira dialog troca para um raio próprio em vez de herdar a conta do pai.

### Onde aparece no Foglamp

`apps/web/src/components/app/range-picker.tsx:189-192` é o único lugar com a conta escrita em
comentário ("Concentric with the popover: its radius (8px, 24px squircle) minus this column's 12px
padding"); `packages/ui/src/components/input-group.tsx:26,73,76` usam
`rounded-[calc(var(--radius)-5px)]` para o que fica dentro do grupo; a escala `--radius-sm..4xl`
derivada de `--radius` está em `packages/ui/src/styles/globals.css:266-272`. Os raios do comentário
do range picker (8px e 24px) não batem com o popover atual (`rounded-lg squircle:rounded-3xl`, 10px
e 22px): o comentário ficou de uma versão anterior, a regra é a mesma e o `xl` do preset foi
decidido no olho.

### No lume

- Itens: `base` (escala), `card`, `popover`, `dialog`, `tabs`, `input-group`, `command`, `app-shell`, `range-picker`.
- FRONTEND.md: seção 5 (Raio e squircle: pares canônicos; `corner-round!` só em BorderBeam e pílulas) e seção 13 (Shell e sidebar). Guia: `docs/guia/01-fundacoes.md` (tabela de raios em px e pares squircle).
- Ferramenta para conferir: Corner Radii (link em `docs/referencias.md`). O squircle só existe no Chromium hoje; nos outros browsers cai no raio plano, e é por isso que o par precisa fechar nas duas variantes.

## Noise

Original: https://craft.gustavofior.com/noise (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/color/noise.mdx. Seção: Color. Status no
Foglamp: integral, só no marketing (mapa 3.4).

### Regra

Quando uma superfície grande de cor chapada (hero, CTA, gradiente) parece plástica ou mostra
banding, uma camada de ruído por cima dá textura e esconde os degraus. É um `feTurbulence` em SVG
aplicado a um overlay vazio com `mix-blend-mode` e opacidade baixa. Nunca em superfície de app:
card, tabela, dialog e sidebar do Foglamp são cor lisa com sombra, e o ruído entra só nas seções de
marketing. O filtro é calculado por pixel a cada repaint: em superfície pequena ninguém nota; em
hero de tela cheia que rola ou anima derruba o frame rate no celular, e a saída é rasterizar o grão
num tile e repetir.

### Valores

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

### Onde aparece no Foglamp

Um arquivo, `apps/web/src/components/marketing/noise-overlay.tsx`, com `FilmGrain` (:11-32),
`FogBank` (:42-92) e `HeroGrain` (:97-110), consumido pelo hero, pelo CTA
(`marketing/landing/cta.tsx`) e pelas figuras de custo (`marketing/landing/figures-costs.tsx`). O
`feTurbulence` do Foglamp fica no `type` padrão (`turbulence`, uma oitava) e troca o `feColorMatrix`
por `grayscale(100%)` dentro do `filter` CSS; o resultado é o mesmo grão cinza. Zero ocorrências em
`apps/web/src/app/(app)` e em `packages/ui`: o app não tem textura.

### No lume

- Nenhum item da registry traz ruído na v0.1.0 (o capítulo de marketing e seus blocos ficam para depois, docs/DECISOES.md). Se precisar, copie a receita do craft com os valores da tabela para um componente em `components/app`, nunca em `components/ui`.
- FRONTEND.md: seção 28 (Marketing, opcional) e seção 6 (Superfícies: cor lisa com `shadow-(--custom-shadow)`, sem textura). Guia: `docs/guia/12-marketing.md`.
- Dark mode: o grão fica mais visível sobre `oklch(0.17 0 0)`; o Foglamp compensa com `mix-blend-screen` no hero, que soma luz em vez de escurecer. No light o craft usa `mix-blend-overlay`.

## Novelty budget

Adição do lume. Fontes: Rauno Freiberg, Novelty, https://rauno.me/craft/novelty, e Invisible Details
of Interaction Design, https://rauno.me/craft/interaction-design; Benji Taylor, Family Values
(Delight-Impact Curve), https://benji.org/family-values. O craft tem o rascunho não publicado "Novelty
Budget" (`content/craft/novelty-budget.mdx`), sem revisão do autor; a fonte primária aqui é o Rauno.
Status no Foglamp: integral (entrada de página de 75 ms uma vez por carga; entrada 3D só na landing;
grão só no marketing; o app não repete nenhum flourish em navegação interna).

### Regra

Novidade é ponto de exclamação: um por frase funciona, três por linha é grito. O Rauno escreve a
proporção como 90 por cento familiar e 10 por cento novo, e conta a "novelty tax" do Arc, um browser
inteiro novo que cobrava do usuário a cada gesto. O orçamento é pequeno e se gasta uma vez: o flourish
cabe no onboarding, na primeira visita, na revelação de algo criado agora; nunca em navegação interna,
que é a parte da interface feita centenas de vezes por dia (a outra ponta da balança frequência contra
novidade do mesmo autor). O Benji desenha a mesma ideia como Delight-Impact Curve: quanto menos
frequente a função, mais delight ela aguenta. Para um dashboard isso quer dizer que a página é
familiar por obrigação (tabela, filtro, card, drawer, todos como em qualquer outro lugar) e a novidade
mora em dois ou três momentos escolhidos. O Foglamp gasta o orçamento assim: a página aparece em 75 ms
uma vez por carga e nunca mais; o demo da landing entra em 3D durante 1.7 s porque é marketing e é a
primeira vez; o grão fica no site; a chave recém-criada rola como caça-níquel porque é criada uma vez.

### Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Proporção | 90 por cento familiar, 10 por cento novo | Rauno, Novelty |
| Onde o flourish cabe | onboarding, primeira visita, revelação única | Rauno, Novelty |
| Onde nunca | navegação interna e qualquer ação repetida (lista, filtro, menu, troca de aba) | Rauno, Novelty e Invisible Details |
| Curva | quanto menos frequente a função, mais delight ela aguenta | Benji, Delight-Impact Curve |
| Entrada de página | `useEntranceOnce()` devolve true só no primeiro mount depois de um hard load; `cn(entrance && "page-fade-in")` roda `page-fade-in` por 75 ms só em opacidade, e `animation: none` sob reduced motion | registry/base-vega/hooks/use-entrance-once.ts |
| Entrada 3D | só na landing do Foglamp (`marketing/demo/entrance.ts`, `ENTRANCE_EASE`, 1.7 s e 1.1 s); nenhuma página do app usa | registry/base-vega/lib/motion.ts:20-22; Foglamp apps/web/src/components/marketing/demo/entrance.ts |
| Grão | `feTurbulence` só no marketing | [Noise](#noise) |
| Revelação única | `rolling-text` para chave, ID ou token recém-criado; não para número que muda sempre (isso é `number-ticker`) | registry/base-vega/components/rolling-text.tsx |
| Primeiro render | `initial={false}` no `copy-icon`; o `number-ticker` pinta estático e só anima mudanças depois do mount | registry/base-vega/components/copy-icon.tsx:29; number-ticker.tsx:30-41 |
| Borda viajante | `border-beam-card` é flourish de destaque único, não de lista | registry/base-vega/components/border-beam-card.tsx |

**Always**: gaste o orçamento em até três momentos por produto e escreva quais são; cada flourish
roda uma vez por sessão ou por criação; familiar por padrão em tudo que se repete. **Never**: entrada
animada em toda troca de rota; stagger em lista que filtra; flourish em menu, tab ou sidebar; um
efeito novo "porque ficou bonito" em componente que já tem equivalente no sistema.
<!-- skill:end -->

### Onde aparece no Foglamp

`apps/web/src/components/app/hooks.ts` (`useEntranceOnce`, origem do item), `apps/web/src/index.css`
(`.page-fade-in`), `marketing/landing/hero.tsx` e `marketing/demo/entrance.ts` (entrada 3D, só
landing), `animated-api-key.tsx` (rolagem única). Nenhuma página de `app/(app)/` anima a troca de rota
depois da primeira.

### No lume

- Itens: `use-entrance-once`, `rolling-text`, `number-ticker`, `copy-icon`, `border-beam-card`, `motion`.
- FRONTEND.md: seções Movimento (entrada de página de 75 ms uma vez por hard load; nunca animar na primeira pintura o que já está no lugar) e Marketing (opcional). Guia: `docs/guia/09-movimento.md` e `docs/guia/12-marketing.md`.
- Conceitos vizinhos: [Frequência decide](#frequência-decide) (a outra ponta da balança) e [Continuidade](#continuidade) (o familiar que persiste).

## Optical Alignment

Original: https://craft.gustavofior.com/optical-alignment (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/optical-alignment.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

### Regra

Centralizar pela caixa do ícone nem sempre parece centralizado: o peso visual de um triângulo, de
uma estrela ou de uma seta não fica no meio do bounding box. Alinhamento óptico é empurrar 1 ou 2px
até parecer certo e deixar o empurrão no código, com comentário dizendo o porquê. O teste é o do
blur: aplique `filter: blur(8px)` no inspector (ou aperte os olhos); a mancha mostra onde o peso
está, e a distância até o centro é o nudge. Vale para padding também: ícone tem ar dentro da caixa,
então o lado do botão que segura o ícone perde alguns px de padding. Vale para tipografia: a Inter
tem eixo `opsz`, e o browser escolhe o desenho certo por tamanho com `font-optical-sizing: auto`,
desde que a fonte carregada traga o eixo.

### Valores

<!-- skill:start -->
| Caso | String exata | Arquivo |
|---|---|---|
| Padding do lado do ícone, `Button` default | `h-8 gap-[5.5px] px-3 ... has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5` | registry/base-vega/ui/button.tsx:37 |
| Idem, `xs` / `sm` / `lg` | `pl-2` e `pr-2`; `pl-[9px]` e `pr-[9px]`; `pl-3` e `pr-3` | registry/base-vega/ui/button.tsx:34,35,38 |
| Ícone ao lado de texto `text-sm` ou `text-xs` | `mt-px` (desce 1px) ou `mb-px` (sobe 1px), decidido por ícone | registry/base-vega/components/stat-card.tsx:121,193,204; blocks/range-picker/range-picker.tsx:175 |
| Seta de link externo em chip | `size-3.5 shrink-0 -ml-0.5 mt-px text-muted-foreground` | registry/base-vega/components/context-chip.tsx:122 |
| Ícone do `Alert` ao lado do título | `*:[svg]:row-span-2 *:[svg]:translate-y-0.5` | registry/base-vega/ui/alert.tsx:9 |
| Checkbox ou radio dentro de `Field` horizontal | `[&>[role=checkbox],[role=radio]]:mt-px` | registry/base-vega/ui/field.tsx:63,65 |
| Slot de ações do `PageHeader` | `flex items-center gap-2 translate-y-1 empty:hidden` (comentário: desce para o picker alinhar com o texto do título) | registry/base-vega/components/page-header.tsx:106-109 |
| Submenu da sidebar e seu item | `translate-x-px` na lista, `-translate-x-px` no item, para a borda esquerda casar com a linha | registry/base-vega/ui/sidebar.tsx:647,685 |
| Seta do tooltip | `translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]` | registry/base-vega/ui/tooltip.tsx:64 |
| Eixo `opsz` da Inter | `@import "@fontsource-variable/inter/opsz.css"` | registry/base-vega/styles/globals.css:9 |

**Always**: nudge de 1px com `mt-px`, `mb-px`, `ml-px`, `mr-px`, `translate-x-px`; comentário de uma
linha dizendo o motivo. **Never**: nudge global em todo `svg`; `translate` maior que 2px para
"centralizar" (é bug de layout, não óptica); Inter sem o eixo `opsz` (a versão do `next/font/google`
perde o eixo, por isso o Foglamp self-hosta).
<!-- skill:end -->

Aspas penduradas (`hanging-punctuation: first`, fallback `text-indent: -0.42em`) são do artigo; o
Foglamp não tem prosa com citação e o lume não traz utilitário para isso. Círculo e triângulo
parecem menores que um quadrado na mesma caixa; ao dimensionar ícones lado a lado, compense no olho.

### Onde aparece no Foglamp

Contagem por grep nos `.tsx`: `mb-px` 32, `mt-px` 26, `ml-px` 5, `mr-px` 5, `translate-x-px` e
`-translate-x-px` 1 cada. Exemplos: `apps/web/src/app/(app)/settings/settings-client.tsx:299,304`
(`IconXFilled` e `IconCheckFilled` com `mb-px size-3.25`),
`traces/[traceId]/trace-detail-client.tsx:1042` (`-ml-0.5 mt-px size-3.5`),
`agents/[name]/agent-detail-client.tsx:901`
(`IconSitemapFilled className="size-3.5 shrink-0 text-emerald-500 mt-px"`). Comentários que
registram o nudge: `apps/web/src/components/app/page-parts.tsx:124` e
`marketing/demo/demo-chrome.tsx:142`. `apps/web/src/app/layout.tsx:11-15` explica por que a Inter é
self-hosted: manter o eixo `opsz`.

### No lume

- Itens: `button`, `alert`, `field`, `page-header`, `stat-card`, `context-chip`, `sidebar`, `tooltip` e `base` (fontes via Fontsource com `opsz`, docs/DECISOES.md).
- FRONTEND.md: seção 9 (Botões), seção 12 (Ícones) e seção 23 (Fontes). Guia: `docs/guia/01-fundacoes.md` e `docs/guia/02-primitivos.md`.
- Os botões do lume já descontam o padding do lado do ícone; não some `pl-*` ou `pr-*` por cima. Ícone sem classe de tamanho dentro de `Button` vira `size-3.5` (button.tsx:10), e esse tamanho é o que os nudges da tabela assumem.

## Scroll Fades

Original: https://craft.gustavofior.com/scroll-fades (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/scroll-fades.mdx. Seção: Layout.
Status no Foglamp: parcial (mapa 3.4).

### Regra

Um container que rola com borda dura parece uma lista que acabou. Um fade na borda que ainda tem
conteúdo diz "tem mais" sem precisar de barra de rolagem. O erro comum é o fade estático nos dois
lados: no fim da lista o último item fica meio escondido, como se houvesse algo abaixo. Só desvanece
o lado que ainda pode rolar. Duas técnicas: máscara (`mask-image`, funciona sobre qualquer fundo,
inclusive imagem, e não bloqueia clique) e overlay colorido (um gradiente da cor do fundo por cima,
que precisa casar com a superfície). Em linha horizontal de chips ou tabs, a mesma ideia de lado, e
a scrollbar escondida, porque uma barra sob uma linha de chips é ruído.

### Valores

<!-- skill:start -->
| Técnica | Valor | Onde |
|---|---|---|
| Componente `ScrollFade` (overlay) | viewport `overflow-y-auto no-scrollbar`; fade do topo `pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b to-transparent transition-opacity duration-150` + `from-card`, visível quando `scrollTop > 1`; fade de baixo igual com `bottom-0` e `bg-linear-to-t`, `opacity-75` enquanto `scrollTop + clientHeight < scrollHeight - 1`; `ResizeObserver` recalcula quando o conteúdo muda de tamanho | registry/base-vega/components/scroll-fade.tsx:40-78 |
| Cor do overlay | prop `fromClassName`: `from-card` (padrão, lista dentro de card), `from-popover` (dentro de dialog); `bottomFadeClassName` para reforçar (`h-14 opacity-100`) | registry/base-vega/components/scroll-fade.tsx:23,33-35 |
| Utilitário `scroll-fade` (máscara) | `mask-image: linear-gradient(to bottom, transparent 0, #000 var(--scroll-fade-t, 0px), #000 calc(100% - var(--scroll-fade-b, 0px)), transparent 100%)`; tamanho `min(12%, calc(var(--spacing) * 10))` (até 2.5rem); scroll-driven com `animation-timeline: scroll(self y)` e `animation-range` de `calc(var(--spacing) * 24)` (6rem) em cada ponta; sem suporte, as duas pontas ficam sempre desvanecidas | `shadcn/tailwind.css` 4.21.5 (`@utility scroll-fade`, `scroll-fade-y`, `scroll-fade-x`), importado por registry/base-vega/styles/globals.css:8 |
| Craft (mesma ideia em CSS próprio) | `@property --fade-start` e `--fade-end` (`<length>`, inicial `0px`), fade de `2.5rem`, `animation: fade-start 1ms linear both, fade-end 1ms linear both; animation-range: 0 3rem, calc(100% - 3rem) 100%` | craft scroll-fades.mdx |
| Scrollbar | `no-scrollbar` (de `shadcn/tailwind.css`) com qualquer das duas: a máscara desvanece a barra junto, o overlay cobre a barra | registry/base-vega/components/scroll-fade.tsx:57,61; Foglamp `scan/left-rail.tsx:76` |
| Stops em curva | o gradiente do fade com vários stops seguindo uma curva de easing (easeOutQuad ou easeInOutCubic) em vez de dois stops lineares: o fade linear tem uma "borda" visível onde começa, o em curva não. Recomendação: o `ScrollFade` e o utilitário `scroll-fade` usam gradiente linear | Shu Ding, Smooth CSS Overlays, https://smooth-overlays.vercel.app |
| Valores do Rauno | fade de 48 px com blur de 4 px e stop a 50%; a opacidade do fade é `scrollTop / 15`, limitada a 1 (satura depois de 15 px de rolagem, em vez de ligar e desligar) | Rauno Freiberg, Devouring Details, capítulo grátis Next.js Dev Tools, https://devouringdetails.com/prototypes/nextjs-dev-tools |

**Always**: `ScrollFade` para lista dentro de card, dialog ou popover (fundo conhecido); classe
`scroll-fade` para fundo desconhecido, imagem ou gradiente; `no-scrollbar` nos dois casos; linha
horizontal de chips com `scroll-fade-x`. **Never**: fade estático nos dois lados; overlay com cor
diferente do fundo (`from-card` dentro de um dialog `bg-popover` deixa uma mancha); máscara no
container que mantém a scrollbar visível (ela some nas pontas).
<!-- skill:end -->

Fontes além do craft (adição do lume, levantamento de 17/10/2026). Dois refinamentos para quem for
mexer no `ScrollFade`. O Shu mostra que um gradiente de dois stops (cor a 0, transparente a 100)
distribui a opacidade de forma linear e por isso tem uma aresta perceptível onde o fade começa; com
seis a oito stops colocados numa curva de easing a transição fica contínua, e o site dele gera o CSS
pronto para colar. O Rauno, no capítulo grátis do Devouring Details, dá os números do fade do Next.js
Dev Tools: 48 px de altura, blur de 4 px, stop a 50 por cento, e a opacidade do overlay proporcional
a `scrollTop / 15` em vez de ligar de uma vez em `scrollTop > 1`. Os dois são recomendação, não
mudança: o componente do lume mantém `from-card` e `to-transparent` com `transition-opacity
duration-150`, que é o que o Foglamp pratica.

### Onde aparece no Foglamp

Overlay: `apps/web/src/components/app/page-parts.tsx:535-604` (`ScrollFade`, os dois gradientes em
`:590` e `:597`). Máscara: classe `scroll-fade` em `apps/web/src/components/scan/left-rail.tsx:76`,
`setup/verification-report.tsx:102`, `setup/decision-list.tsx:401` e condicional
`overflowing && "scroll-fade"` em `scan/changes-card.tsx:54`; a classe não está definida no repo,
vem do `shadcn/tailwind.css` 4.12.0 (mapa 3.9 e 4.2). Máscaras inline no Foggy:
`foggy/foggy-widget.tsx:596,675` (`linear-gradient(to bottom, black 35%, transparent)`). Status
parcial porque o Foglamp mistura as duas técnicas e o componente é overlay, não máscara.

### No lume

- Itens: `scroll-fade` (componente, no `kit-tabela`), `base` (o utilitário `scroll-fade` e o `no-scrollbar` chegam pelo `@import "shadcn/tailwind.css"`), `sidebar` (`SidebarContent` é `no-scrollbar ... overflow-auto`, sem fade).
- FRONTEND.md: seção 15 (Tabelas e filtros) e seção 26 (Telas de detalhe e drawers: listas longas em painel lateral). Guia: `docs/guia/03-shell-e-paginas.md` e `docs/guia/05-telas-de-detalhe.md`.
- A versão do utilitário no lume é a do `shadcn` 4.21.5 em `node_modules`; o Foglamp usa a 4.12.0 e os valores da tabela são da 4.21.5. Se a CLI atualizar o pacote, confira `--scroll-fade-size` antes de confiar nos números.

## Sombra no dark

Adição do lume. Fontes: Jakub Krehel, better-ui (surfaces.md), https://github.com/jakubkrehel/skills,
e Details that make interfaces feel better,
https://jakub.kr/writing/details-that-make-interfaces-feel-better; comparado com o `--custom-shadow`
do Foglamp em `registry/base-vega/styles/globals.css:53-56` (light) e `:162-166` (dark). Status no
Foglamp: integral (o token tem receita própria para o dark; a diferença para o Jakub é escolha, não
omissão).

### Regra

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

### Valores

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

### Onde aparece no Foglamp

`packages/ui/src/styles/globals.css` define `--custom-shadow` light e dark com os valores da tabela,
mais `--custom-shadow-lifted` e `--custom-shadow-chrome` com a mesma lógica (insets brancos mais
fortes e drops maiores no dark). `packages/ui/src/components/input.tsx` e irmãos trocam sombra por
hairline no dark. Nenhum arquivo do Foglamp trata `forced-colors`.

### No lume

- Itens: `base` (tokens), `card`, `popover`, `dialog`, `tooltip`, `dropdown-menu`, `kbd`, `avatar`, `input`, `select`, `textarea`, `button`.
- FRONTEND.md: seções Sombra no lugar de borda (os valores light e dark do token) e Dark mode (botões mantêm sombra, campos trocam por hairline, "a aresta vem da luz"). Guia: `docs/guia/01-fundacoes.md`.
- Conceitos vizinhos: [Exceções da borda](#exceções-da-borda) (onde a linha continua) e [Image Outlines](#image-outlines) (a linha por dentro da imagem, também em preto ou branco puro).

## Tabular Numbers

Original: https://craft.gustavofior.com/tabular-numbers (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/tabular-numbers.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

### Regra

Dígitos têm duas larguras: proporcional (o `1` é estreito, o `8` é largo) e tabular (todos com a
mesma largura). Texto corrido usa proporcional, que lê mais natural. Qualquer número que muda no
lugar (relógio, contador, preço, métrica ao vivo) ou que se empilha em coluna usa `tabular-nums`,
senão o que está ao lado treme a cada atualização e a coluna não forma grade vertical. Coluna
numérica também vai alinhada à direita, para números de tamanhos diferentes ancorarem na mesma
borda. Não troque para `font-mono` só para alinhar: mono muda a voz da interface inteira; o que você
quer é só a feature `tnum` da fonte.

### Valores

<!-- skill:start -->
| Onde | String exata | Arquivo |
|---|---|---|
| Coluna numérica (`TableCell align="right"`) | `text-right tabular-nums` | registry/base-vega/ui/table.tsx:20 |
| Valor do stat card | `tracking-tight tabular-nums` (no `CardTitle`) | registry/base-vega/components/stat-card.tsx:134 |
| Delta do stat card | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px` | registry/base-vega/components/stat-card.tsx:204 |
| Count-up | `NumberTicker` já aplica `tabular-nums`; `className` só para tamanho e cor | registry/base-vega/components/number-ticker.tsx:59 |
| Contagem e paginação da tabela | `text-xs text-muted-foreground/50 tabular-nums` | registry/base-vega/blocks/data-table/data-table.tsx:715,741 |
| Gatilho do range picker | `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 ...` | registry/base-vega/blocks/range-picker/range-picker.tsx:53 |
| Contador do chip de contexto | `shrink-0 tabular-nums text-muted-foreground` | registry/base-vega/components/context-chip.tsx:55 |
| Tooltip de gráfico | `font-mono font-medium text-foreground tabular-nums` | registry/base-vega/ui/chart.tsx:258 |
| Eixo Y do evilcharts | `[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-value]:tabular-nums` | registry/base-vega/components/evilcharts/core/chart.tsx:125 |
| Badge de contagem na sidebar | `... text-xs font-medium text-sidebar-foreground tabular-nums select-none ...` | registry/base-vega/ui/sidebar.tsx:595 |
| Tabela dentro de markdown | `w-full border-collapse text-xs tabular-nums` | registry/base-vega/components/markdown-components.tsx:47 |

**Always**: `tabular-nums` em todo número que muda ou que se empilha; coluna numérica com
`align="right"` no `TableCell`. **Never**: `font-mono` como atalho de alinhamento; `text-center` em
coluna numérica; número proporcional em timer, contador ou badge de contagem.
<!-- skill:end -->

A fonte precisa ter `tnum`. A Inter Variable do `base` (registry/base-vega/styles/globals.css:9)
tem; se trocar a fonte, confira a feature no Wakamai Fondue (https://wakamaifondue.com) antes de
confiar na classe.

### Onde aparece no Foglamp

157 ocorrências de `tabular-nums` nos `.tsx` de `apps/web/src` e `packages/ui/src` (162 no grep com
`-a` do mapa). As canônicas: `apps/web/src/app/(app)/traces/traces-client.tsx:894,897`
(`TableCell className="text-right tabular-nums"`, colunas de custo e duração),
`workflows/workflows-client.tsx:315,318` (`align="right" className="tabular-nums"`),
`traces/[traceId]/trace-detail-client.tsx:726` (linha de metadados
`text-[11px] text-muted-foreground tabular-nums`) e `:999` (chip
`cursor-help rounded px-1 py-px text-[10px] font-medium tabular-nums`).

Gotcha herdado: o Foglamp nunca mapeia `--font-mono` (mapa 4.11), então o `font-mono` do tooltip de
gráfico caía na pilha padrão; o lume mapeia Geist Mono Variable (styles/globals.css:228-230).

### No lume

- Itens: `table` (o `align="right"` já traz a classe), `data-table`, `stat-card`, `number-ticker`, `context-chip`, `format` (toda função devolve string pronta para um `span` tabular).
- FRONTEND.md: seção 15 (Tabelas e filtros) e seção 17 (Números, datas e formatação). Guia: `docs/guia/04-dados.md`.
- Valor nulo é o texto `sem dado` em `text-muted-foreground/50` (docs/DECISOES.md), também dentro da coluna tabular, para a célula não colapsar nem mudar de alinhamento.
