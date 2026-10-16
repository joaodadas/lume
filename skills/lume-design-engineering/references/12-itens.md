# Itens da registry

Gerado por `bun scripts/build-skill.ts` a partir de `registry.json`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

109 itens na versão `v0.1.1`. Vários itens vão num comando só; `--diff` mostra o que mudaria e `--overwrite` aplica. Alias opcional em `components.json`: `"registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }`.

## Base (1)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `base` | Base lume | Tokens oklch em cinza, 17 sombras no lugar de borda, squircle, fontes Inter e Geist Mono e a base layer. Instale com `shadcn init joaodadas/lume/base#vX`. | `npx shadcn@latest init joaodadas/lume/base#v0.1.1 -y` |

## Itens de configuração (2)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `font-display` | Fonte display (Host Grotesk) | Host Grotesk via Fontsource como `font-display`, só para títulos de marketing. O app fica em Inter. | `npx shadcn@latest add joaodadas/lume/font-display#v0.1.1` |
| `guia` | Guia do lume | FRONTEND.md (regras Always/Never), o guia longo e os conceitos do craft, instalados em docs/lume/ de qualquer projeto. | `npx shadcn@latest add joaodadas/lume/guia#v0.1.1` |

## Lib (4)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `format` | Formatação pt-BR | formatCount, formatDuration, formatPercent, formatDateTime, formatRelative, formatDelta, formatMoney e formatCompact com LOCALE pt-BR, fuso de São Paulo e placeholder `sem dado`. | `npx shadcn@latest add joaodadas/lume/format#v0.1.1` |
| `motion` | Vocabulário de movimento | EASE [0.22,1,0.36,1], ENTRANCE_EASE, REVEAL_EASE, MORPH (spring 400/38), TOOLBAR_SPRING (520/44), COPY_SPRING e useReduce(): o vocabulário fechado de motion do sistema. | `npx shadcn@latest add joaodadas/lume/motion#v0.1.1` |
| `range` | Períodos | Presets de período em pt-BR (última hora, 24 horas, 7 dias, 30 dias, este mês...) e helpers de intervalo. | `npx shadcn@latest add joaodadas/lume/range#v0.1.1` |
| `utils` | cn() | clsx + tailwind-merge, a mesma assinatura do shadcn. | `npx shadcn@latest add joaodadas/lume/utils#v0.1.1` |

## Hooks (5)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `use-copied` | useCopied | Copia para a área de transferência e mantém o estado copiado por 1,5 s. | `npx shadcn@latest add joaodadas/lume/use-copied#v0.1.1` |
| `use-debounced-value` | useDebouncedValue | Debounce de 300 ms e useTextFilter para filtros de texto. | `npx shadcn@latest add joaodadas/lume/use-debounced-value#v0.1.1` |
| `use-delayed-loading` | useDelayedLoading | Só mostra skeleton depois de 700 ms de loading; loads mais rápidos nunca piscam. | `npx shadcn@latest add joaodadas/lume/use-delayed-loading#v0.1.1` |
| `use-entrance-once` | useEntranceOnce | Entrada de página de 75 ms, só opacidade, uma vez por hard load; instala a classe page-fade-in. | `npx shadcn@latest add joaodadas/lume/use-entrance-once#v0.1.1` |
| `use-mobile` | useIsMobile | Media query de 768px usada pela Sidebar. | `npx shadcn@latest add joaodadas/lume/use-mobile#v0.1.1` |

## Primitivos (ui) (56)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `accordion` | Accordion | Seções expansíveis com um único chevron que gira e altura animada. | `npx shadcn@latest add joaodadas/lume/accordion#v0.1.1` |
| `alert` | Alert | Aviso em superfície com sombra, ícone e título, sem borda. | `npx shadcn@latest add joaodadas/lume/alert#v0.1.1` |
| `alert-dialog` | Alert dialog | Confirmação modal com backdrop desfocado e cantos squircle. | `npx shadcn@latest add joaodadas/lume/alert-dialog#v0.1.1` |
| `aspect-ratio` | Aspect ratio | Caixa com proporção fixa. | `npx shadcn@latest add joaodadas/lume/aspect-ratio#v0.1.1` |
| `avatar` | Avatar | Avatar com aresta por sombra e tamanhos xs a lg. | `npx shadcn@latest add joaodadas/lume/avatar#v0.1.1` |
| `badge` | Badge | Pílula de status com 14 variants, cada cor com a própria sombra. | `npx shadcn@latest add joaodadas/lume/badge#v0.1.1` |
| `breadcrumb` | Breadcrumb | Trilha de navegação. | `npx shadcn@latest add joaodadas/lume/breadcrumb#v0.1.1` |
| `button` | Button | Botão em pílula com sombra no lugar de borda, press a 0.97 e ícones em size-3.5. | `npx shadcn@latest add joaodadas/lume/button#v0.1.1` |
| `button-group` | Button group | Botões colados com cantos compartilhados. | `npx shadcn@latest add joaodadas/lume/button-group#v0.1.1` |
| `calendar` | Calendar | Calendário do react-day-picker com dias em pílula e intervalo. | `npx shadcn@latest add joaodadas/lume/calendar#v0.1.1` |
| `card` | Card | Superfície padrão: bg-card, sombra hairline, squircle; size sm é o card do dashboard. | `npx shadcn@latest add joaodadas/lume/card#v0.1.1` |
| `carousel` | Carousel | Carrossel com embla. | `npx shadcn@latest add joaodadas/lume/carousel#v0.1.1` |
| `chart` | Chart | ChartContainer do shadcn; o sistema usa o evilcharts, este fica por compatibilidade. | `npx shadcn@latest add joaodadas/lume/chart#v0.1.1` |
| `checkbox` | Checkbox | Caixa de seleção do Base UI com ícone Tabler. | `npx shadcn@latest add joaodadas/lume/checkbox#v0.1.1` |
| `collapsible` | Collapsible | Área que abre e fecha sem estilo próprio. | `npx shadcn@latest add joaodadas/lume/collapsible#v0.1.1` |
| `combobox` | Combobox | Campo com lista filtrável, chips e popup com sombra. | `npx shadcn@latest add joaodadas/lume/combobox#v0.1.1` |
| `command` | Command | Paleta de comandos com cmdk. | `npx shadcn@latest add joaodadas/lume/command#v0.1.1` |
| `context-menu` | Context menu | Menu de contexto. | `npx shadcn@latest add joaodadas/lume/context-menu#v0.1.1` |
| `dialog` | Dialog | Modal com backdrop bg-black/20 e blur, zoom de 96% na entrada e 99% na saída. | `npx shadcn@latest add joaodadas/lume/dialog#v0.1.1` |
| `direction` | Direction | Provider de direção de texto. | `npx shadcn@latest add joaodadas/lume/direction#v0.1.1` |
| `drawer` | Drawer | Gaveta inferior com vaul. | `npx shadcn@latest add joaodadas/lume/drawer#v0.1.1` |
| `dropdown-menu` | Dropdown menu | Menu flutuante com popup em sombra hairline e itens com cursor-pointer. | `npx shadcn@latest add joaodadas/lume/dropdown-menu#v0.1.1` |
| `empty` | Empty | Estado vazio tracejado, a única borda fechando caixa aceita no sistema. | `npx shadcn@latest add joaodadas/lume/empty#v0.1.1` |
| `field` | Field | Campo completo: label, descrição, erro e layout vertical ou horizontal. | `npx shadcn@latest add joaodadas/lume/field#v0.1.1` |
| `hover-card` | Hover card | Cartão ao passar o mouse, com squircle e sombra. | `npx shadcn@latest add joaodadas/lume/hover-card#v0.1.1` |
| `input` | Input | Campo de texto com sombra hairline no light e borda de 0.5px no dark. | `npx shadcn@latest add joaodadas/lume/input#v0.1.1` |
| `input-group` | Input group | Input com addons (ícone, prefixo, sufixo, botão) que compartilham o anel de foco. | `npx shadcn@latest add joaodadas/lume/input-group#v0.1.1` |
| `input-otp` | Input OTP | Campos de código de verificação. | `npx shadcn@latest add joaodadas/lume/input-otp#v0.1.1` |
| `item` | Item | Linha de lista com mídia, título e ações. | `npx shadcn@latest add joaodadas/lume/item#v0.1.1` |
| `kbd` | Kbd | Tecla de atalho em squircle pequeno. | `npx shadcn@latest add joaodadas/lume/kbd#v0.1.1` |
| `label` | Label | Rótulo de campo. | `npx shadcn@latest add joaodadas/lume/label#v0.1.1` |
| `loader` | Loader | TextShimmerLoader, o texto com brilho que diz que algo está pensando. | `npx shadcn@latest add joaodadas/lume/loader#v0.1.1` |
| `menubar` | Menubar | Barra de menus. | `npx shadcn@latest add joaodadas/lume/menubar#v0.1.1` |
| `native-select` | Native select | Select nativo estilizado como o Input. | `npx shadcn@latest add joaodadas/lume/native-select#v0.1.1` |
| `navigation-menu` | Navigation menu | Menu de navegação com gatilho em pílula. | `npx shadcn@latest add joaodadas/lume/navigation-menu#v0.1.1` |
| `pagination` | Pagination | Paginação com botões icon-sm. | `npx shadcn@latest add joaodadas/lume/pagination#v0.1.1` |
| `popover` | Popover | Popup ancorado com rounded-lg, squircle 3xl e sombra hairline. | `npx shadcn@latest add joaodadas/lume/popover#v0.1.1` |
| `progress` | Progress | Barra de progresso. | `npx shadcn@latest add joaodadas/lume/progress#v0.1.1` |
| `radio-group` | Radio group | Grupo de opções exclusivas. | `npx shadcn@latest add joaodadas/lume/radio-group#v0.1.1` |
| `resizable` | Resizable | Painéis redimensionáveis. | `npx shadcn@latest add joaodadas/lume/resizable#v0.1.1` |
| `scroll-area` | Scroll area | Área rolável com barra fina. | `npx shadcn@latest add joaodadas/lume/scroll-area#v0.1.1` |
| `select` | Select | Select do Base UI com gatilho squircle e popup com anel de 0.5px. | `npx shadcn@latest add joaodadas/lume/select#v0.1.1` |
| `separator` | Separator | Linha divisória a 70% da borda. | `npx shadcn@latest add joaodadas/lume/separator#v0.1.1` |
| `sheet` | Sheet | Painel lateral; a variante floating flutua com cantos squircle de 40px. | `npx shadcn@latest add joaodadas/lume/sheet#v0.1.1` |
| `sidebar` | Sidebar | Sidebar do shadcn na variante inset, 14rem, com squircle no inset e nos itens. | `npx shadcn@latest add joaodadas/lume/sidebar#v0.1.1` |
| `skeleton` | Skeleton | Placeholder de carregamento em squircle. | `npx shadcn@latest add joaodadas/lume/skeleton#v0.1.1` |
| `slider` | Slider | Controle deslizante. | `npx shadcn@latest add joaodadas/lume/slider#v0.1.1` |
| `sonner` | Sonner | Toaster com ícones Tabler filled. | `npx shadcn@latest add joaodadas/lume/sonner#v0.1.1` |
| `spinner` | Spinner | IconLoader girando, com role status. | `npx shadcn@latest add joaodadas/lume/spinner#v0.1.1` |
| `switch` | Switch | Interruptor com hover a 80% de opacidade. | `npx shadcn@latest add joaodadas/lume/switch#v0.1.1` |
| `table` | Table | Tabela densa: células px-8.25, header h-13, linha interativa com teclado e sticky header. | `npx shadcn@latest add joaodadas/lume/table#v0.1.1` |
| `tabs` | Tabs | Abas com lista em squircle e sublinhado de 1px. | `npx shadcn@latest add joaodadas/lume/tabs#v0.1.1` |
| `textarea` | Textarea | Área de texto com a mesma receita do Input. | `npx shadcn@latest add joaodadas/lume/textarea#v0.1.1` |
| `toggle` | Toggle | Botão de alternância. | `npx shadcn@latest add joaodadas/lume/toggle#v0.1.1` |
| `toggle-group` | Toggle group | Grupo de toggles com sombra compartilhada. | `npx shadcn@latest add joaodadas/lume/toggle-group#v0.1.1` |
| `tooltip` | Tooltip | Dica não invertida: mesma superfície dos popovers. | `npx shadcn@latest add joaodadas/lume/tooltip#v0.1.1` |

## Componentes (35)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `app-shell` | Casca do app | Sidebar inset com scroll em três camadas (h-svh no provider, overflow-hidden no inset, overflow-y-auto no main), coluna da página em gap-4 py-6 pb-16, NavIcon com crossfade outline/filled de 100 ms, tile colorido por navTile(cor), header mobile h-12 md:hidden com SidebarTrigger e menu de conta com Avatar e submenu de tema. | `npx shadcn@latest add joaodadas/lume/app-shell#v0.1.1` |
| `card-sparkline` | Card sparkline | Sparkline de área para o slot chart do StatCard: SVG 100x32 em h-8 w-full, gradiente currentColor 0.4 a 0.1, traço 1.2 a 50%, último trecho tracejado com dashedLast; CardSparklinePlaceholder desenha a curva de amostra apagada quando não há série. | `npx shadcn@latest add joaodadas/lume/card-sparkline#v0.1.1` |
| `code-block` | Bloco de código | Código com Shiki (github-light no claro, vesper no escuro, defaultColor false, engine JS sem wasm), fallback cru sem flash, limite de 50 000 caracteres, pre com bg-muted/50 e shadow-(--custom-shadow), botão de copiar icon-sm outline com estado por 2 s. | `npx shadcn@latest add joaodadas/lume/code-block#v0.1.1` |
| `context-chip` | Chips de contexto | CHIP_SURFACE (bg-card, hover muted/50, sem press scale, outline shadow no dark), CHIP_ERROR e CHIP_ABORTED em rose e amber, ContextChip com seta IconArrowUpRight quando tem href e Chip xs com trailing tabular; navegação pelo Link da indireção com href string. | `npx shadcn@latest add joaodadas/lume/context-chip#v0.1.1` |
| `copy-button` | Botão de copiar | Botão nu com CopyIcon, text-muted-foreground/60, hover text-foreground, iconSize size-4, stopPropagation para linhas clicáveis e estado copiado por 1,5 s. | `npx shadcn@latest add joaodadas/lume/copy-button#v0.1.1` |
| `copy-icon` | Ícone de copiar | Troca copy/check com blur de 4px, scale 0.25 e fade na mola COPY_SPRING (0.25 s, bounce 0); verde text-green-600 dark:text-green-400, invertido via checkClassName dentro de Button default. | `npx shadcn@latest add joaodadas/lume/copy-icon#v0.1.1` |
| `data-table` | Tabela de dados | Toolbar de filtros com busca em pílula (h-8 w-56), FilterSelect com typeahead acima de 8 opções, ToggleChip, botão Limpar animado, cabeçalho ordenável tri-state (desc, asc, off), estado de filtros na URL por history.replaceState e rodapé de paginação com linhas por página; o grupo trailing sobe para o header via TOOLBAR_SPRING. | `npx shadcn@latest add joaodadas/lume/data-table#v0.1.1` |
| `empty-state` | Empty state | Estado vazio das páginas sobre o Empty da registry: caixa tracejada, EmptyMedia variant icon com o ícone em opacity-40, título e descrição opcionais e filhos para a ação. | `npx shadcn@latest add joaodadas/lume/empty-state#v0.1.1` |
| `header-slot` | Header slot | Contexto que deixa a toolbar subir ações para o header da página quando aperta. | `npx shadcn@latest add joaodadas/lume/header-slot#v0.1.1` |
| `link` | Link (indireção) | O Link que os blocos usam: um <a> simples. Em projetos Next, instale link-next por cima. | `npx shadcn@latest add joaodadas/lume/link#v0.1.1` |
| `link-next` | Link (next/link) | Troca o Link da indireção por next/link. Instale depois dos blocos, em projetos Next. | `npx shadcn@latest add joaodadas/lume/link-next#v0.1.1` |
| `login-form` | Formulário de login | Login presentacional do Foglamp: coluna de max-w-lg p-6 sem card, tile da marca de 40px em bg-muted com sombra, senha, link mágico e Google com separador h-px bg-border/50, validação zod no submit e erros em FieldError text-xs; quem autentica é o app pelos callbacks. | `npx shadcn@latest add joaodadas/lume/login-form#v0.1.1` |
| `markdown-components` | Componentes de markdown | Overrides de a, table, thead, tr, th, td, img e hr para react-markdown ou Streamdown: links internos (href com /) pelo Link da indireção, externos em nova aba, tabelas planas text-xs tabular-nums com linhas border-border/40, img cru sem next/image. | `npx shadcn@latest add joaodadas/lume/markdown-components#v0.1.1` |
| `notice` | Notice | Faixa de aviso com tone warning, error ou info: fundo da cor a 10%, texto escuro/claro conforme o tema, ícone Tabler filled e a sombra colorida do token (shadow-(--custom-shadow-amber), -rose, -blue) no lugar de borda, com o gutter PX. | `npx shadcn@latest add joaodadas/lume/notice#v0.1.1` |
| `page-header` | Cabeçalho de página | Título h1 text-base em linha de h-8 com ícone size-4.5, breadcrumb de volta via Link, descrição e slot de ações sempre renderizado (translate-y-1) para a Toolbar portalar; exporta o gutter PX (px-4 md:px-8). | `npx shadcn@latest add joaodadas/lume/page-header#v0.1.1` |
| `pill-meter` | Pill meter | Medidor de razão para o slot chart do StatCard: 32 cápsulas rounded-full em h-3.5 gap-0.75, as acesas em bg-current e as apagadas em bg-muted-foreground/10; fração positiva acende ao menos uma, null nenhuma. | `npx shadcn@latest add joaodadas/lume/pill-meter#v0.1.1` |
| `range-picker` | Seletor de período | Chips rápidos 24h, 3d e 7d mais popover com 9 presets em pt-BR (Última hora a Mês passado) e calendário duplo em ptBR; o rótulo anima a largura em 300 ms com a curva EASE e colapsa para o ícone quando um chip está ativo. RangeProvider persiste o período em localStorage (storageKey, padrão lume.range). | `npx shadcn@latest add joaodadas/lume/range-picker#v0.1.1` |
| `scroll-fade` | Scroll fade | Viewport de rolagem com fades de h-10 em overlay (bg-linear-to-b/-t from-card to-transparent, duration-150): o de cima aparece ao rolar, o de baixo a 75% enquanto há conteúdo abaixo, recalculado no scroll e por ResizeObserver. | `npx shadcn@latest add joaodadas/lume/scroll-fade#v0.1.1` |
| `section` | Section | Bloco de seção da página: cabeçalho com h2 text-sm font-medium, descrição text-xs muted e ações à direita (flex-wrap items-end, gutter PX) e os filhos abaixo em coluna gap-3. | `npx shadcn@latest add joaodadas/lume/section#v0.1.1` |
| `span-type` | Tipo de span | Exemplo canônico de cor com significado: llm violet, tool blue, agent amber, embedding emerald, outro neutral, a mesma cor no Badge, na barra (bg-*-500) e no chip de ícone size-4.5 com a receita do tile (inset 1px a 14% e sombra 2px a 25% no light, --custom-shadow no dark). | `npx shadcn@latest add joaodadas/lume/span-type#v0.1.1` |
| `stat-card` | Stat card | Cartão de métrica do Foglamp: ícone size-3.5 e rótulo à esquerda, DeltaBadge (emerald/red, font-[470]) e valor em CardTitle tabular-nums à direita, chart sangrando até a borda (-mb-6), href com chevron no hover e loading que segura as alturas (skeleton h-3 w-20, slot do chart h-10). | `npx shadcn@latest add joaodadas/lume/stat-card#v0.1.1` |
| `stat-grid` | Stat grid | Fileira de StatCards com container query: grid gap-4 em 1 coluna, 2 a partir de @lg e 4 a partir de 62rem de área de conteúdo (columns = 3 vira 1 ou 3 a partir de @2xl), com o gutter PX. | `npx shadcn@latest add joaodadas/lume/stat-grid#v0.1.1` |
| `table-skeletons` | Skeleton de tabela | TableRowsSkeleton: linhas h-12 com um Skeleton h-4 por coluna (cols com w, align, icon e sub para célula de duas linhas h-5 + h-4), alinhado como as células reais; tipo SkeletonCol exportado. | `npx shadcn@latest add joaodadas/lume/table-skeletons#v0.1.1` |
| `theme-provider` | Theme provider | ThemeProvider do next-themes com o aviso falso do React 19 silenciado em dev. Use attribute=class, defaultTheme=dark, enableSystem. | `npx shadcn@latest add joaodadas/lume/theme-provider#v0.1.1` |
| `theme-provider-csp` | Theme provider (CSP) | Tema sem next-themes e sem script inline, para apps com CSP estrita (como o painel do lyx-pr-agent). Mesma API de useTheme. | `npx shadcn@latest add joaodadas/lume/theme-provider-csp#v0.1.1` |
| `theme-switcher` | Theme switcher | Pílula segmentada sistema / claro / escuro com spring MORPH, e ThemeSubmenu para menus. | `npx shadcn@latest add joaodadas/lume/theme-switcher#v0.1.1` |
| `area-chart` | Area chart | EvilAreaChart: área com gradiente, grid, threshold e legenda. | `npx shadcn@latest add joaodadas/lume/area-chart#v0.1.1` |
| `bar-chart` | Bar chart | EvilBarChart: barras com brush, zoom e tooltip. | `npx shadcn@latest add joaodadas/lume/bar-chart#v0.1.1` |
| `donut-chart` | Donut chart | EvilDonutChart: rosca com rótulo central tabular. | `npx shadcn@latest add joaodadas/lume/donut-chart#v0.1.1` |
| `evilcharts` | Evil Charts (base) | Container, tooltip, legenda, brush, zoom, dots e background do fork do Evil Charts que o Foglamp usa, com cores light e dark por série. | `npx shadcn@latest add joaodadas/lume/evilcharts#v0.1.1` |
| `line-chart` | Line chart | EvilLineChart: linhas com dots e threshold. | `npx shadcn@latest add joaodadas/lume/line-chart#v0.1.1` |
| `trend-charts` | Utilitários de gráficos de tendência | ChartLegend clicável (mode light\|dark por prop, swatch h-2 w-2, inativos opacity-30), rótulos e ticks do eixo de tempo (makeBucketLabel, formatBucketFull, dedupeTicks, thinTicks com ~8 ticks e gap mínimo de 1/14 do eixo, makeEdgeTick ancorado nas pontas), pickBucketMs espelho do servidor (~50 buckets, degraus de 1 min a 1 dia), fillBuckets com zero-fill até 1000 buckets, useFrozen e useZoomRange sobre o range-picker. | `npx shadcn@latest add joaodadas/lume/trend-charts#v0.1.1` |
| `border-beam-card` | Card com anel de luz | Card envolto por BorderBeam size pulse-inner, colorVariant colorful, strength 0.6 e borderRadius 16, com corner-round! rounded-2xl! para o anel circular casar com o canto; prop active desliga o anel com fade. | `npx shadcn@latest add joaodadas/lume/border-beam-card#v0.1.1` |
| `number-ticker` | Number ticker | Número que anima do valor antigo para o novo com animate() do motion (0.6 s, easeOut), formatando cada frame, em tabular-nums; sob prefers-reduced-motion pula direto para o valor final. | `npx shadcn@latest add joaodadas/lume/number-ticker#v0.1.1` |
| `rolling-text` | Texto rolante | Revelação de chave ou ID com roll de caça-níquel do slot-text: direction down, stagger 15, duration 220, bounce 0, ease cubic-bezier(0.22, 1, 0.36, 1), cor chromatic({ from: 360 }), font-mono text-xs; parte de `from` ou de uma máscara de pontos do mesmo comprimento. | `npx shadcn@latest add joaodadas/lume/rolling-text#v0.1.1` |

## Blocos e kits (6)

| Item | Título | Descrição | Comando |
|---|---|---|---|
| `kit-dados` | Kit dados | Badge, context-chip, span-type, card-sparkline, pill-meter, number-ticker, copy-button e code-block. | `npx shadcn@latest add joaodadas/lume/kit-dados#v0.1.1` |
| `kit-feedback` | Kit feedback | Skeleton, empty, spinner, loader, sonner, alert, notice, dialog, alert-dialog, tooltip, popover e dropdown-menu. | `npx shadcn@latest add joaodadas/lume/kit-feedback#v0.1.1` |
| `kit-formulario` | Kit formulário | Input, input-group, field, label, select, native-select, checkbox, switch, radio-group, textarea, kbd e calendar. | `npx shadcn@latest add joaodadas/lume/kit-formulario#v0.1.1` |
| `kit-graficos` | Kit gráficos | Evil Charts (área, barras, linha, rosca), trend-charts e range-picker. | `npx shadcn@latest add joaodadas/lume/kit-graficos#v0.1.1` |
| `kit-shell` | Kit shell | Sidebar inset, app-shell, page-header, stat-card, stat-grid, empty-state, notice, section, theme-provider, theme-switcher e link: o esqueleto de um dashboard. | `npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.1` |
| `kit-tabela` | Kit tabela | Table, data-table (toolbar, filtros na URL, ordenação, paginação), skeletons, scroll-fade, format e hooks. | `npx shadcn@latest add joaodadas/lume/kit-tabela#v0.1.1` |
