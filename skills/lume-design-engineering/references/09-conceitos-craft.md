# Conceitos do craft

Gerado por `bun scripts/build-skill.ts` a partir de `docs/conceitos/*.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Conceitos do craft

Os artigos de https://craft.gustavofior.com (Gustavo Fior, MIT, repo
https://github.com/gustavo-fior/craft) são a teoria por trás do Foglamp: o autor é o mesmo, e o
Foglamp é onde ele pratica. Esta pasta reescreve em pt-BR os 11 conceitos publicados, cada um com a
regra, os valores exatos, onde o Foglamp pratica (arquivo:linha, da tabela 3.4 do mapa
`foglamp-design-system.md`) e o que o lume instala. Nada aqui é cópia de parágrafo: é reescrita com
atribuição, e cada arquivo abre com o link do original e do MDX fonte.

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

- Não publicados: Living Charts, Curve Smoothing.

#### Craft

- Não publicados: Performance Is Design, How to Get References, Novelty Budget, Taste Is Trained, Timelessness.

### Os 23 não publicados

Os 23 conceitos listados só por nome existem como MDX em `content/` do repo do craft, mas o site só
publica os 11 que estão em `LAUNCH_CONCEPT_SLUGS` (`src/lib/concepts.ts`); os outros aparecem apenas
em desenvolvimento, com a marca "not published". São rascunhos do autor, ainda sem revisão, e por
isso não ganham arquivo aqui. Muitos têm regra praticada no Foglamp (o mapa 3.3 resume cada um com
os valores, e a tabela 3.4 aponta a evidência: Squircles com 124 `corner-squircle`, Hit Areas com
`after:absolute after:-inset-2`, Scale Entrances com `zoom-in-95`, Icon Morph no `copy-icon`), e
essa prática está documentada no guia (`docs/guia/01-fundacoes.md`, `02-primitivos.md`,
`09-movimento.md`) a partir do código, não do rascunho. Quando um rascunho e o código do Foglamp
divergem, o código vence. Quando o autor publicar um deles, ele entra aqui no mesmo molde.

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
| Sidebar por atalho (Cmd/Ctrl+B) | `transition-[left,right,width] duration-200 ease-linear` (anima mesmo por teclado: contra o artigo) | registry/base-vega/ui/sidebar.tsx:235 |
| Craft | tooltip: o primeiro espera 400 a 700ms, os vizinhos abrem na hora; hover sem transição | craft hover-restraint.mdx |

**Always**: hover de cor e fundo sem transição ou com no máximo 150ms (o `Button` é o teto);
`TooltipProvider delay={150}` em volta de tabela, timeline ou grade com muitos gatilhos; tooltips de
um grupo de botões de ícone dentro de um único `TooltipProvider`, para só o primeiro esperar.
**Never**: hover que escala, levanta sombra ou desliza (`hover:scale-*`, `hover:shadow-lg`,
`hover:-translate-y-*`); `transition-all` em item de lista ou de nav; `delay` acima de 200ms em
tooltip de dashboard; atraso artificial em hover.
<!-- skill:end -->

### Onde aparece no Foglamp

Parcial. A favor: `org-settings-client.tsx:158-166` (comentário explicando que o texto da tab vira
sem fade porque o fade atrasado leria como tremor), `range-picker.tsx:205`, `checkbox.tsx:20`,
`navigation-menu.tsx:132`, `sidebar.tsx:478`. Contra: `transition-colors` em 63 lugares, o `Button`
com `transition-all hover:duration-150`, `tooltip.tsx:8` com `delay = 0` (o artigo pede 400 a 700ms;
o Foglamp prefere 150ms nas tabelas e aceita o tooltip abrir de passagem), e a sidebar deslizando
200ms mesmo por atalho.

### No lume

- Itens: `button`, `sidebar`, `checkbox`, `tooltip`, `navigation-menu`, `range-picker`, `app-shell` (`nav-icon.tsx:41,48` faz o crossfade outline/filled em `transition-opacity duration-100 ease-in-out` só na troca de item ativo, não no hover).
- FRONTEND.md: seção 19 (Overlays e menus: `TooltipProvider delay={150}` em tabelas) e seção 21 (Movimento). Guia: `docs/guia/09-movimento.md`.
- O lume mantém `delay = 0` no `tooltip` por fidelidade; a regra praticada é `delay={150}` em tabela, e quem coloca o provider é a página, como nas seis páginas de lista do Foglamp. O `data-table` não envolve a tabela num provider.

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
- Itens: `base`, `theme-provider`, `theme-provider-csp`, `app-shell` (o canvas do shell usa `--sidebar`, um passo mais escuro que `--background`; ver `docs/guia/03-shell-e-paginas.md`. O `html` continua com `--background`, que é a cor do inset e das páginas sem shell, como o login).
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

**Always**: a linha vai por cima da imagem (`outline` com offset negativo, `box-shadow` inset ou
pseudo-elemento), nunca `border`; cor por tema. **Never**: `ring-1 ring-border` em imagem (no light
`--border` é um cinza sólido, não 10% de preto); `outline-1 -outline-offset-1` sem cor explícita (o
`* { @apply border-border outline-ring/50 }` do globals.css:283 daria a cor do `ring`); linha em
logo SVG monocromático.
<!-- skill:end -->

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
| Slot de ações do `PageHeader` | `flex items-center gap-2 translate-y-1 empty:hidden` (comentário: desce para o picker alinhar com o texto do título) | registry/base-vega/components/page-header.tsx:99-102 |
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

**Always**: `ScrollFade` para lista dentro de card, dialog ou popover (fundo conhecido); classe
`scroll-fade` para fundo desconhecido, imagem ou gradiente; `no-scrollbar` nos dois casos; linha
horizontal de chips com `scroll-fade-x`. **Never**: fade estático nos dois lados; overlay com cor
diferente do fundo (`from-card` dentro de um dialog `bg-popover` deixa uma mancha); máscara no
container que mantém a scrollbar visível (ela some nas pontas).
<!-- skill:end -->

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
