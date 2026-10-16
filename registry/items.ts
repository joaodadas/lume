// Metadados de cada item da registry. O registry.json é GERADO a partir
// daqui por scripts/build-registry.ts: os arquivos, as dependências npm e as
// dependências entre itens são inferidos dos imports; aqui ficam só título,
// descrição, grupo, tier e o que não dá para inferir (css, cssVars, targets).
//
// Convenções:
// - tier "core" entra na vitrine, no guia e na verificação da release;
//   tier "extra" é publicado verbatim e sem vitrine até a v0.2.
// - registryDependencies e dependencies aqui são ACRÉSCIMOS ao que o gerador
//   infere (use para dependências que o import não revela).
// - nextOnly marca itens que importam next/*; o resto é puro e serve em Vite.

export type Tier = "core" | "extra";

export type Group =
  | "base"
  | "ui"
  | "lib"
  | "hooks"
  | "blocks"
  | "charts"
  | "extras"
  | "kits"
  | "docs";

export type RegistryType =
  | "registry:base"
  | "registry:ui"
  | "registry:component"
  | "registry:block"
  | "registry:lib"
  | "registry:hook"
  | "registry:file"
  | "registry:page"
  | "registry:theme"
  | "registry:style"
  | "registry:item";

export type ItemFile = {
  path: string;
  type?: RegistryType;
  target?: string;
};

export type CssVars = {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

export type ItemMeta = {
  name: string;
  title: string;
  description: string;
  group: Group;
  tier?: Tier;
  type?: RegistryType;
  files?: ItemFile[];
  css?: Record<string, unknown>;
  cssVars?: CssVars;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  nextOnly?: boolean;
  categories?: string[];
  docs?: string;
  extends?: "none";
  config?: Record<string, unknown>;
};

// Versões fixadas quando a última major não é a que o código espera.
export const PINS: Record<string, string> = {
  "react-day-picker": "^9.14.0",
};

const ui = (
  name: string,
  title: string,
  description: string,
  tier: Tier = "core",
): ItemMeta => ({
  name,
  title,
  description,
  group: "ui",
  tier,
  type: "registry:ui",
  files: [{ path: `registry/base-vega/ui/${name}.tsx`, type: "registry:ui" }],
});

const PRIMITIVOS_CORE: ItemMeta[] = [
  ui(
    "accordion",
    "Accordion",
    "Seções expansíveis com um único chevron que gira e altura animada.",
  ),
  ui(
    "alert",
    "Alert",
    "Aviso em superfície com sombra, ícone e título, sem borda.",
  ),
  ui(
    "alert-dialog",
    "Alert dialog",
    "Confirmação modal com backdrop desfocado e cantos squircle.",
  ),
  ui("avatar", "Avatar", "Avatar com aresta por sombra e tamanhos xs a lg."),
  ui(
    "badge",
    "Badge",
    "Pílula de status com 14 variants, cada cor com a própria sombra.",
  ),
  ui(
    "button",
    "Button",
    "Botão em pílula com sombra no lugar de borda, press a 0.97 e ícones em size-3.5.",
  ),
  ui(
    "calendar",
    "Calendar",
    "Calendário do react-day-picker com dias em pílula e intervalo.",
  ),
  ui(
    "card",
    "Card",
    "Superfície padrão: bg-card, sombra hairline, squircle; size sm é o card do dashboard.",
  ),
  ui("checkbox", "Checkbox", "Caixa de seleção do Base UI com ícone Tabler."),
  ui("collapsible", "Collapsible", "Área que abre e fecha sem estilo próprio."),
  ui(
    "combobox",
    "Combobox",
    "Campo com lista filtrável, chips e popup com sombra.",
  ),
  ui(
    "dialog",
    "Dialog",
    "Modal com backdrop bg-black/20 e blur, zoom de 96% na entrada e 99% na saída.",
  ),
  ui(
    "dropdown-menu",
    "Dropdown menu",
    "Menu flutuante com popup em sombra hairline e itens com cursor-pointer.",
  ),
  ui(
    "empty",
    "Empty",
    "Estado vazio tracejado, a única borda fechando caixa aceita no sistema.",
  ),
  ui(
    "field",
    "Field",
    "Campo completo: label, descrição, erro e layout vertical ou horizontal.",
  ),
  ui(
    "hover-card",
    "Hover card",
    "Cartão ao passar o mouse, com squircle e sombra.",
  ),
  ui(
    "input",
    "Input",
    "Campo de texto com sombra hairline no light e borda de 0.5px no dark.",
  ),
  ui(
    "input-group",
    "Input group",
    "Input com addons (ícone, prefixo, sufixo, botão) que compartilham o anel de foco.",
  ),
  ui("kbd", "Kbd", "Tecla de atalho em squircle pequeno."),
  ui("label", "Label", "Rótulo de campo."),
  ui(
    "loader",
    "Loader",
    "TextShimmerLoader, o texto com brilho que diz que algo está pensando.",
  ),
  ui(
    "native-select",
    "Native select",
    "Select nativo estilizado como o Input.",
  ),
  ui("pagination", "Pagination", "Paginação com botões icon-sm."),
  ui(
    "popover",
    "Popover",
    "Popup ancorado com rounded-lg, squircle 3xl e sombra hairline.",
  ),
  ui("progress", "Progress", "Barra de progresso."),
  ui("radio-group", "Radio group", "Grupo de opções exclusivas."),
  ui("scroll-area", "Scroll area", "Área rolável com barra fina."),
  ui(
    "select",
    "Select",
    "Select do Base UI com gatilho squircle e popup com anel de 0.5px.",
  ),
  ui("separator", "Separator", "Linha divisória a 70% da borda."),
  ui(
    "sheet",
    "Sheet",
    "Painel lateral; a variante floating flutua com cantos squircle de 40px.",
  ),
  ui(
    "sidebar",
    "Sidebar",
    "Sidebar do shadcn na variante inset, 14rem, com squircle no inset e nos itens.",
  ),
  ui("skeleton", "Skeleton", "Placeholder de carregamento em squircle."),
  ui("sonner", "Sonner", "Toaster com ícones Tabler filled."),
  ui("spinner", "Spinner", "IconLoader girando, com role status."),
  ui("switch", "Switch", "Interruptor com hover a 80% de opacidade."),
  ui(
    "table",
    "Table",
    "Tabela densa: células px-8.25, header h-13, linha interativa com teclado e sticky header.",
  ),
  ui("tabs", "Tabs", "Abas com lista em squircle e sublinhado de 1px."),
  ui("textarea", "Textarea", "Área de texto com a mesma receita do Input."),
  ui("toggle", "Toggle", "Botão de alternância."),
  ui(
    "toggle-group",
    "Toggle group",
    "Grupo de toggles com sombra compartilhada.",
  ),
  ui(
    "tooltip",
    "Tooltip",
    "Dica não invertida: mesma superfície dos popovers.",
  ),
];

const PRIMITIVOS_EXTRA: ItemMeta[] = [
  ui("aspect-ratio", "Aspect ratio", "Caixa com proporção fixa.", "extra"),
  ui("breadcrumb", "Breadcrumb", "Trilha de navegação.", "extra"),
  ui(
    "button-group",
    "Button group",
    "Botões colados com cantos compartilhados.",
    "extra",
  ),
  ui("carousel", "Carousel", "Carrossel com embla.", "extra"),
  ui(
    "chart",
    "Chart",
    "ChartContainer do shadcn; o sistema usa o evilcharts, este fica por compatibilidade.",
    "extra",
  ),
  ui("command", "Command", "Paleta de comandos com cmdk.", "extra"),
  ui("context-menu", "Context menu", "Menu de contexto.", "extra"),
  ui("direction", "Direction", "Provider de direção de texto.", "extra"),
  ui("drawer", "Drawer", "Gaveta inferior com vaul.", "extra"),
  ui("input-otp", "Input OTP", "Campos de código de verificação.", "extra"),
  ui("item", "Item", "Linha de lista com mídia, título e ações.", "extra"),
  ui("menubar", "Menubar", "Barra de menus.", "extra"),
  ui(
    "navigation-menu",
    "Navigation menu",
    "Menu de navegação com gatilho em pílula.",
    "extra",
  ),
  ui("resizable", "Resizable", "Painéis redimensionáveis.", "extra"),
  ui("slider", "Slider", "Controle deslizante.", "extra"),
];

const BASE: ItemMeta[] = [
  {
    name: "base",
    title: "Base lume",
    description:
      "Tokens oklch em cinza, 17 sombras no lugar de borda, squircle, fontes Inter e Geist Mono e a base layer. Instale com `shadcn init joaodadas/lume/base#vX`.",
    group: "base",
    type: "registry:base",
    extends: "none",
    config: {
      style: "base-vega",
      iconLibrary: "tabler",
      rsc: true,
      tsx: true,
      tailwind: { baseColor: "neutral", cssVariables: true },
      menuColor: "default",
      menuAccent: "subtle",
      registries: { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" },
    },
    dependencies: [
      "tailwindcss",
      "tw-animate-css",
      "shadcn",
      "@toolwind/corner-shape",
      "@fontsource-variable/inter",
      "@fontsource-variable/geist-mono",
      "clsx",
      "tailwind-merge",
      "@base-ui/react",
      "@tabler/icons-react",
      "class-variance-authority",
    ],
    registryDependencies: ["utils"],
    // cssVars (theme, light, dark) vêm do globals.css pelo gerador.
    css: {
      '@import "tw-animate-css"': {},
      '@import "shadcn/tailwind.css"': {},
      '@import "@fontsource-variable/inter/opsz.css"': {},
      '@import "@fontsource-variable/geist-mono"': {},
      '@plugin "@toolwind/corner-shape"': {},
      "@custom-variant squircle (@supports (corner-shape: squircle))": {},
      "@keyframes shimmer": {
        "0%": { "background-position": "200% center" },
        "100%": { "background-position": "-200% center" },
      },
      "@layer base": {
        "*": {
          "@apply border-border outline-ring/50": {},
          "scrollbar-width": "thin",
          "scrollbar-color":
            "color-mix(in oklab, var(--muted-foreground) 35%, transparent) transparent",
        },
        html: { "@apply font-sans bg-background": {} },
        body: {
          "@apply font-sans bg-background text-foreground selection:bg-primary/10":
            {},
        },
        "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus":
          {
            "-webkit-text-fill-color": "var(--foreground)",
            "caret-color": "var(--foreground)",
            transition: "background-color 999999s ease-in-out 0s !important",
          },
      },
    },
    docs: "Depois do init, confira app/globals.css: :root e .dark com os 17 custom-shadow-*, @theme inline com --font-mono, @plugin corner-shape e @custom-variant squircle. Se o init tiver injetado Inter do next/font/google no layout, apague a linha: a Inter já vem do Fontsource.",
  },
  {
    name: "utils",
    title: "cn()",
    description: "clsx + tailwind-merge, a mesma assinatura do shadcn.",
    group: "lib",
    type: "registry:lib",
    files: [{ path: "registry/base-vega/lib/utils.ts", type: "registry:lib" }],
  },
  {
    name: "font-display",
    title: "Fonte display (Host Grotesk)",
    description:
      "Host Grotesk via Fontsource como `font-display`, só para títulos de marketing. O app fica em Inter.",
    group: "base",
    type: "registry:item",
    dependencies: ["@fontsource-variable/host-grotesk"],
    css: { '@import "@fontsource-variable/host-grotesk"': {} },
    cssVars: {
      theme: {
        "font-display":
          '"Host Grotesk Variable", "Inter Variable", ui-sans-serif, system-ui, sans-serif',
      },
    },
  },
];

const HOOKS: ItemMeta[] = [
  {
    name: "use-mobile",
    title: "useIsMobile",
    description: "Media query de 768px usada pela Sidebar.",
    group: "hooks",
    type: "registry:hook",
    files: [
      { path: "registry/base-vega/hooks/use-mobile.ts", type: "registry:hook" },
    ],
  },
];

const BLOCKS: ItemMeta[] = [
  {
    name: "theme-provider",
    title: "Theme provider",
    description:
      "ThemeProvider do next-themes com o aviso falso do React 19 silenciado em dev. Use attribute=class, defaultTheme=dark, enableSystem.",
    group: "blocks",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/theme-provider.tsx",
        type: "registry:component",
      },
    ],
  },
];

const evil = (file: string): ItemFile => ({
  path: `registry/base-vega/components/evilcharts/${file}`,
  type: "registry:component",
  target: `components/evilcharts/${file}`,
});

const CHARTS: ItemMeta[] = [
  {
    name: "evilcharts",
    title: "Evil Charts (base)",
    description:
      "Container, tooltip, legenda, brush, zoom, dots e background do fork do Evil Charts que o Foglamp usa, com cores light e dark por série.",
    group: "charts",
    type: "registry:component",
    files: [
      evil("core/chart.tsx"),
      evil("core/tooltip.tsx"),
      evil("core/legend.tsx"),
      evil("core/zoom.tsx"),
      evil("core/evil-brush.tsx"),
      evil("core/dot.tsx"),
      evil("core/background.tsx"),
    ],
  },
  {
    name: "area-chart",
    title: "Area chart",
    description:
      "EvilAreaChart: área com gradiente, grid, threshold e legenda.",
    group: "charts",
    type: "registry:component",
    files: [evil("charts/area-chart.tsx")],
  },
  {
    name: "bar-chart",
    title: "Bar chart",
    description: "EvilBarChart: barras com brush, zoom e tooltip.",
    group: "charts",
    type: "registry:component",
    files: [evil("charts/bar-chart.tsx")],
  },
  {
    name: "line-chart",
    title: "Line chart",
    description: "EvilLineChart: linhas com dots e threshold.",
    group: "charts",
    type: "registry:component",
    files: [evil("charts/line-chart.tsx")],
  },
  {
    name: "donut-chart",
    title: "Donut chart",
    description: "EvilDonutChart: rosca com rótulo central tabular.",
    group: "charts",
    type: "registry:component",
    files: [evil("charts/donut-chart.tsx")],
  },
];

const FUNDACOES: ItemMeta[] = [
  {
    name: "motion",
    title: "Vocabulário de movimento",
    description:
      "EASE [0.22,1,0.36,1], ENTRANCE_EASE, REVEAL_EASE, MORPH (spring 400/38), TOOLBAR_SPRING (520/44), COPY_SPRING e useReduce(): o vocabulário fechado de motion do sistema.",
    group: "lib",
    type: "registry:lib",
    files: [{ path: "registry/base-vega/lib/motion.ts", type: "registry:lib" }],
  },
  {
    name: "format",
    title: "Formatação pt-BR",
    description:
      "formatCount, formatDuration, formatPercent, formatDateTime, formatRelative, formatDelta, formatMoney e formatCompact com LOCALE pt-BR, fuso de São Paulo e placeholder `sem dado`.",
    group: "lib",
    type: "registry:lib",
    files: [{ path: "registry/base-vega/lib/format.ts", type: "registry:lib" }],
  },
  {
    name: "range",
    title: "Períodos",
    description:
      "Presets de período em pt-BR (última hora, 24 horas, 7 dias, 30 dias, este mês...) e helpers de intervalo.",
    group: "lib",
    type: "registry:lib",
    files: [{ path: "registry/base-vega/lib/range.ts", type: "registry:lib" }],
  },
  {
    name: "use-delayed-loading",
    title: "useDelayedLoading",
    description:
      "Só mostra skeleton depois de 700 ms de loading; loads mais rápidos nunca piscam.",
    group: "hooks",
    type: "registry:hook",
    files: [
      {
        path: "registry/base-vega/hooks/use-delayed-loading.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-entrance-once",
    title: "useEntranceOnce",
    description:
      "Entrada de página de 75 ms, só opacidade, uma vez por hard load; instala a classe page-fade-in.",
    group: "hooks",
    type: "registry:hook",
    files: [
      {
        path: "registry/base-vega/hooks/use-entrance-once.ts",
        type: "registry:hook",
      },
    ],
    css: {
      "@keyframes page-fade-in": { from: { opacity: "0" } },
      ".page-fade-in": { animation: "page-fade-in 75ms ease-out" },
      "@media (prefers-reduced-motion: reduce)": {
        ".page-fade-in": { animation: "none" },
      },
    },
  },
  {
    name: "use-debounced-value",
    title: "useDebouncedValue",
    description: "Debounce de 300 ms e useTextFilter para filtros de texto.",
    group: "hooks",
    type: "registry:hook",
    files: [
      {
        path: "registry/base-vega/hooks/use-debounced-value.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-copied",
    title: "useCopied",
    description:
      "Copia para a área de transferência e mantém o estado copiado por 1,5 s.",
    group: "hooks",
    type: "registry:hook",
    files: [
      { path: "registry/base-vega/hooks/use-copied.ts", type: "registry:hook" },
    ],
  },
  {
    name: "link",
    title: "Link (indireção)",
    description:
      "O Link que os blocos usam: um <a> simples. Em projetos Next, instale link-next por cima.",
    group: "blocks",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/link.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "link-next",
    title: "Link (next/link)",
    description:
      "Troca o Link da indireção por next/link. Instale depois dos blocos, em projetos Next.",
    group: "blocks",
    type: "registry:component",
    nextOnly: true,
    files: [
      {
        path: "registry/base-vega/components/link-next.tsx",
        type: "registry:component",
        target: "components/link.tsx",
      },
    ],
  },
  {
    name: "header-slot",
    title: "Header slot",
    description:
      "Contexto que deixa a toolbar subir ações para o header da página quando aperta.",
    group: "blocks",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/header-slot.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "theme-provider-csp",
    title: "Theme provider (CSP)",
    description:
      "Tema sem next-themes e sem script inline, para apps com CSP estrita (como o painel do lyx-pr-agent). Mesma API de useTheme.",
    group: "blocks",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/theme-provider-csp.tsx",
        type: "registry:component",
        target: "components/theme-provider.tsx",
      },
      {
        path: "registry/base-vega/public/theme.js",
        type: "registry:file",
        target: "~/public/theme.js",
      },
    ],
    docs: 'Carregue <script src="/theme.js"></script> no <head> antes do bundle para o tema entrar antes do primeiro paint.',
  },
  {
    name: "theme-switcher",
    title: "Theme switcher",
    description:
      "Pílula segmentada sistema / claro / escuro com spring MORPH, e ThemeSubmenu para menus.",
    group: "blocks",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/theme-switcher.tsx",
        type: "registry:component",
      },
    ],
  },
];

const LANES: ItemMeta[] = [
  {
    name: "page-header",
    title: "Cabeçalho de página",
    description:
      "Título h1 text-base em linha de h-8 com ícone size-4.5, breadcrumb de volta via Link, descrição e slot de ações sempre renderizado (translate-y-1) para a Toolbar portalar; exporta o gutter PX (px-4 md:px-8).",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/page-header.tsx",
        type: "registry:component",
      },
    ],
    docs: "Use PX de page-header em todo bloco que encosta na borda da página. O slot de ações só funciona com HeaderActionsSlotProvider (header-slot) no shell; sem ele o header renderiza igual.",
  },
  {
    name: "number-ticker",
    title: "Number ticker",
    description:
      "Número que anima do valor antigo para o novo com animate() do motion (0.6 s, easeOut), formatando cada frame, em tabular-nums; sob prefers-reduced-motion pula direto para o valor final.",
    group: "extras",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/number-ticker.tsx",
        type: "registry:component",
      },
    ],
    docs: "format padrão é formatExactCount (pt-BR, arredondado). Passe formatCost, formatPercent ou formatCompact de lib/format para outros números; o formatador recebe frames fracionários, então arredonde dentro dele.",
  },
  {
    name: "stat-card",
    title: "Stat card",
    description:
      "Cartão de métrica do Foglamp: ícone size-3.5 e rótulo à esquerda, DeltaBadge (emerald/red, font-[470]) e valor em CardTitle tabular-nums à direita, chart sangrando até a borda (-mb-6), href com chevron no hover e loading que segura as alturas (skeleton h-3 w-20, slot do chart h-10).",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/stat-card.tsx",
        type: "registry:component",
      },
    ],
    docs: "Ordem canônica numa fileira: Volume, Saúde, Performance, Custo (custo sempre por último). delta vem de formatDelta (lib/format); deltaInverted para custo, erro e latência. Pareie loading com useDelayedLoading para o skeleton não piscar.",
  },
  {
    name: "stat-grid",
    title: "Stat grid",
    description:
      "Fileira de StatCards com container query: grid gap-4 em 1 coluna, 2 a partir de @lg e 4 a partir de 62rem de área de conteúdo (columns = 3 vira 1 ou 3 a partir de @2xl), com o gutter PX.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/stat-grid.tsx",
        type: "registry:component",
      },
    ],
    docs: "As colunas seguem a largura da área de conteúdo, não da janela: funciona com a sidebar aberta ou fechada sem breakpoint manual.",
  },
  {
    name: "card-sparkline",
    title: "Card sparkline",
    description:
      "Sparkline de área para o slot chart do StatCard: SVG 100x32 em h-8 w-full, gradiente currentColor 0.4 a 0.1, traço 1.2 a 50%, último trecho tracejado com dashedLast; CardSparklinePlaceholder desenha a curva de amostra apagada quando não há série.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/card-sparkline.tsx",
        type: "registry:component",
      },
    ],
    docs: "A cor vem do text-* passado em className. Com menos de 2 pontos finitos cai no placeholder sozinho.",
  },
  {
    name: "pill-meter",
    title: "Pill meter",
    description:
      "Medidor de razão para o slot chart do StatCard: 32 cápsulas rounded-full em h-3.5 gap-0.75, as acesas em bg-current e as apagadas em bg-muted-foreground/10; fração positiva acende ao menos uma, null nenhuma.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/pill-meter.tsx",
        type: "registry:component",
      },
    ],
    docs: "A cor vem do text-* passado em className. Re-adiciona o px-6 do card porque o slot chart sangra a largura toda.",
  },
  {
    name: "scroll-fade",
    title: "Scroll fade",
    description:
      "Viewport de rolagem com fades de h-10 em overlay (bg-linear-to-b/-t from-card to-transparent, duration-150): o de cima aparece ao rolar, o de baixo a 75% enquanto há conteúdo abaixo, recalculado no scroll e por ResizeObserver.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/scroll-fade.tsx",
        type: "registry:component",
      },
    ],
    docs: 'Usa a utility no-scrollbar do shadcn/tailwind.css (já importado pelo globals.css da base). Passe fromClassName="from-popover" dentro de diálogo para o fade casar com o fundo.',
  },
  {
    name: "empty-state",
    title: "Empty state",
    description:
      "Estado vazio das páginas sobre o Empty da registry: caixa tracejada, EmptyMedia variant icon com o ícone em opacity-40, título e descrição opcionais e filhos para a ação.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/empty-state.tsx",
        type: "registry:component",
      },
    ],
    docs: "Renderize só depois que o loading terminou (nunca no lugar do skeleton atrasado). Passe border-none bg-transparent em className quando flutuar sobre um gráfico borrado.",
  },
  {
    name: "table-skeletons",
    title: "Skeleton de tabela",
    description:
      "TableRowsSkeleton: linhas h-12 com um Skeleton h-4 por coluna (cols com w, align, icon e sub para célula de duas linhas h-5 + h-4), alinhado como as células reais; tipo SkeletonCol exportado.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/table-skeletons.tsx",
        type: "registry:component",
      },
    ],
    docs: "Pareie com uma Table table-fixed para a troca skeleton/dados não mexer a largura das colunas, e com useDelayedLoading (700 ms) para carga rápida não piscar.",
  },
  {
    name: "notice",
    title: "Notice",
    description:
      "Faixa de aviso com tone warning, error ou info: fundo da cor a 10%, texto escuro/claro conforme o tema, ícone Tabler filled e a sombra colorida do token (shadow-(--custom-shadow-amber), -rose, -blue) no lugar de borda, com o gutter PX.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/notice.tsx",
        type: "registry:component",
      },
    ],
    docs: "Título em peso médio seguido de ponto e o texto corrido na mesma linha. Use para cota pausada, leitura velha ou falha de rede, sem apagar o último dado bom.",
  },
  {
    name: "section",
    title: "Section",
    description:
      "Bloco de seção da página: cabeçalho com h2 text-sm font-medium, descrição text-xs muted e ações à direita (flex-wrap items-end, gutter PX) e os filhos abaixo em coluna gap-3.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/section.tsx",
        type: "registry:component",
      },
    ],
    docs: "Só o cabeçalho leva PX; StatGrid, tabelas e outros filhos cuidam do próprio gutter.",
  },
  {
    name: "app-shell",
    title: "Casca do app",
    description:
      "Sidebar inset com scroll em três camadas (h-svh no provider, overflow-hidden no inset, overflow-y-auto no main), coluna da página em gap-4 py-6 pb-16, NavIcon com crossfade outline/filled de 100 ms, tile colorido por navTile(cor), header mobile h-12 md:hidden com SidebarTrigger e menu de conta com Avatar e submenu de tema.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/blocks/app-shell/app-shell.tsx",
        type: "registry:component",
        target: "components/app-shell/app-shell.tsx",
      },
      {
        path: "registry/base-vega/blocks/app-shell/nav-icon.tsx",
        type: "registry:component",
        target: "components/app-shell/nav-icon.tsx",
      },
      {
        path: "registry/base-vega/blocks/app-shell/nav.ts",
        type: "registry:component",
        target: "components/app-shell/nav.ts",
      },
    ],
    registryDependencies: ["theme-provider"],
    docs: "Passe pathname de fora (usePathname no Next, useLocation no Router). Precisa de um ThemeProvider acima (item theme-provider) por causa do ThemeSubmenu no menu de conta. Monte os itens com navTile(cor) em iconClassName e use exact: true quando um href é prefixo de outro. userMenu recebe DropdownMenuItem extras (sair, plano) depois do submenu de tema.",
  },
  {
    name: "login-form",
    title: "Formulário de login",
    description:
      "Login presentacional do Foglamp: coluna de max-w-lg p-6 sem card, tile da marca de 40px em bg-muted com sombra, senha, link mágico e Google com separador h-px bg-border/50, validação zod no submit e erros em FieldError text-xs; quem autentica é o app pelos callbacks.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/blocks/login-form/login-form.tsx",
        type: "registry:component",
        target: "components/login-form.tsx",
      },
    ],
    docs: 'Centralize com <div className="flex min-h-svh items-center justify-center">. Passe methods para ligar senha, link mágico e Google; brand vai dentro do tile de 40px (ex.: <BrandMark className="w-7" />) e googleIcon no botão (ex.: <GoogleLogo className="size-3.5 mr-0.75" />). Um callback que rejeita mantém o form na tela com a mensagem; use pending e error para estado vindo do app.',
  },
  {
    name: "data-table",
    title: "Tabela de dados",
    description:
      "Toolbar de filtros com busca em pílula (h-8 w-56), FilterSelect com typeahead acima de 8 opções, ToggleChip, botão Limpar animado, cabeçalho ordenável tri-state (desc, asc, off), estado de filtros na URL por history.replaceState e rodapé de paginação com linhas por página; o grupo trailing sobe para o header via TOOLBAR_SPRING.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/blocks/data-table/data-table.tsx",
        type: "registry:component",
        target: "components/data-table/data-table.tsx",
      },
      {
        path: "registry/base-vega/blocks/data-table/url-filters.ts",
        type: "registry:component",
        target: "components/data-table/url-filters.ts",
      },
    ],
    docs: "Toolbar precisa de HeaderActionsSlotProvider e LayoutReserveProvider (header-slot) acima na árvore para o lift funcionar; sem eles o grupo trailing só fica à direita. useUrlFilters lê window.location e funciona em Next, Vite ou sem roteador.",
  },
  {
    name: "range-picker",
    title: "Seletor de período",
    description:
      "Chips rápidos 24h, 3d e 7d mais popover com 9 presets em pt-BR (Última hora a Mês passado) e calendário duplo em ptBR; o rótulo anima a largura em 300 ms com a curva EASE e colapsa para o ícone quando um chip está ativo. RangeProvider persiste o período em localStorage (storageKey, padrão lume.range).",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/blocks/range-picker/range-picker.tsx",
        type: "registry:component",
        target: "components/range-picker/range-picker.tsx",
      },
      {
        path: "registry/base-vega/blocks/range-picker/range-context.tsx",
        type: "registry:component",
        target: "components/range-picker/range-context.tsx",
      },
    ],
    docs: 'Envolva o app em <RangeProvider storageKey="meuapp.range"> e leia com useRange(). Presets relativos são re-resolvidos para agora ao carregar; períodos do calendário voltam exatos.',
  },
  {
    name: "context-chip",
    title: "Chips de contexto",
    description:
      "CHIP_SURFACE (bg-card, hover muted/50, sem press scale, outline shadow no dark), CHIP_ERROR e CHIP_ABORTED em rose e amber, ContextChip com seta IconArrowUpRight quando tem href e Chip xs com trailing tabular; navegação pelo Link da indireção com href string.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/context-chip.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "span-type",
    title: "Tipo de span",
    description:
      "Exemplo canônico de cor com significado: llm violet, tool blue, agent amber, embedding emerald, outro neutral, a mesma cor no Badge, na barra (bg-*-500) e no chip de ícone size-4.5 com a receita do tile (inset 1px a 14% e sombra 2px a 25% no light, --custom-shadow no dark).",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/span-type.tsx",
        type: "registry:component",
      },
    ],
    docs: "Copie o padrão para o seu domínio: um mapa por conceito (variant, ícone, barra, chip), nunca cor solta no componente.",
  },
  {
    name: "copy-icon",
    title: "Ícone de copiar",
    description:
      "Troca copy/check com blur de 4px, scale 0.25 e fade na mola COPY_SPRING (0.25 s, bounce 0); verde text-green-600 dark:text-green-400, invertido via checkClassName dentro de Button default.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/copy-icon.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "copy-button",
    title: "Botão de copiar",
    description:
      "Botão nu com CopyIcon, text-muted-foreground/60, hover text-foreground, iconSize size-4, stopPropagation para linhas clicáveis e estado copiado por 1,5 s.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/copy-button.tsx",
        type: "registry:component",
      },
    ],
    docs: 'title é obrigatório e vira o nome acessível (ex.: "Copiar ID"). Dentro de linha de tabela clicável passe stopPropagation.',
  },
  {
    name: "code-block",
    title: "Bloco de código",
    description:
      "Código com Shiki (github-light no claro, vesper no escuro, defaultColor false, engine JS sem wasm), fallback cru sem flash, limite de 50 000 caracteres, pre com bg-muted/50 e shadow-(--custom-shadow), botão de copiar icon-sm outline com estado por 2 s.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/code-block.tsx",
        type: "registry:component",
      },
    ],
    css: {
      ".shiki": {
        "background-color": "var(--shiki-light-bg)",
      },
      ".shiki, .shiki span": {
        color: "var(--shiki-light)",
      },
      ".dark .shiki": {
        "background-color": "var(--shiki-dark-bg)",
      },
      ".dark .shiki, .dark .shiki span": {
        color: "var(--shiki-dark)",
      },
    },
    docs: "O install injeta as quatro regras .shiki / .dark .shiki no seu globals.css; sem elas o bloco renderiza sem cor. Linguagens carregadas: typescript e json. useShikiHtml(code, lang) é exportado para blocos que montam o próprio container.",
  },
  {
    name: "markdown-components",
    title: "Componentes de markdown",
    description:
      "Overrides de a, table, thead, tr, th, td, img e hr para react-markdown ou Streamdown: links internos (href com /) pelo Link da indireção, externos em nova aba, tabelas planas text-xs tabular-nums com linhas border-border/40, img cru sem next/image.",
    group: "blocks",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/markdown-components.tsx",
        type: "registry:component",
      },
    ],
    docs: "Passe como components={markdownComponents} ao <ReactMarkdown> (com remark-gfm para tabelas) ou ao <Streamdown>. O espaçamento de parágrafos e listas vem do wrapper de prosa de quem usa ([&_p]:my-1.5, [&_ul]:pl-5 etc.).",
  },
  {
    name: "trend-charts",
    title: "Utilitários de gráficos de tendência",
    description:
      "ChartLegend clicável (mode light|dark por prop, swatch h-2 w-2, inativos opacity-30), rótulos e ticks do eixo de tempo (makeBucketLabel, formatBucketFull, dedupeTicks, thinTicks com ~8 ticks e gap mínimo de 1/14 do eixo, makeEdgeTick ancorado nas pontas), pickBucketMs espelho do servidor (~50 buckets, degraus de 1 min a 1 dia), fillBuckets com zero-fill até 1000 buckets, useFrozen e useZoomRange sobre o range-picker.",
    group: "charts",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/trend-charts.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["evilcharts", "range-picker", "range", "utils"],
    docs: "useZoomRange exige o RangeProvider do bloco range-picker acima na árvore. pickBucketMs reproduz a regra de agrupamento do servidor: se o seu backend agrupa diferente, ajuste os degraus. ChartLegend recebe mode do seu provider de tema (next-themes ou theme-provider-csp).",
  },
  {
    name: "rolling-text",
    title: "Texto rolante",
    description:
      "Revelação de chave ou ID com roll de caça-níquel do slot-text: direction down, stagger 15, duration 220, bounce 0, ease cubic-bezier(0.22, 1, 0.36, 1), cor chromatic({ from: 360 }), font-mono text-xs; parte de `from` ou de uma máscara de pontos do mesmo comprimento.",
    group: "extras",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/rolling-text.tsx",
        type: "registry:component",
      },
    ],
    docs: "Copie sempre da string de origem (value), nunca do DOM animado: os sizers ocultos do slot-text embaralham a seleção manual. aria-label expõe o valor inteiro.",
  },
  {
    name: "border-beam-card",
    title: "Card com anel de luz",
    description:
      "Card envolto por BorderBeam size pulse-inner, colorVariant colorful, strength 0.6 e borderRadius 16, com corner-round! rounded-2xl! para o anel circular casar com o canto; prop active desliga o anel com fade.",
    group: "extras",
    tier: "core",
    type: "registry:component",
    files: [
      {
        path: "registry/base-vega/components/border-beam-card.tsx",
        type: "registry:component",
      },
    ],
    docs: 'Um por tela, no máximo: é o card do próximo passo. O card vizinho sem anel deve receber className="corner-round!" para o par ficar consistente. O conteúdo vai dentro como num Card normal (CardHeader, CardTitle, CardAction, CardContent).',
  },
];

const KITS: ItemMeta[] = [
  {
    name: "kit-shell",
    title: "Kit shell",
    description:
      "Sidebar inset, app-shell, page-header, stat-card, stat-grid, empty-state, notice, section, theme-provider, theme-switcher e link: o esqueleto de um dashboard.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "app-shell",
      "page-header",
      "stat-card",
      "stat-grid",
      "empty-state",
      "notice",
      "section",
      "theme-provider",
      "theme-switcher",
      "link",
      "use-entrance-once",
    ],
  },
  {
    name: "kit-tabela",
    title: "Kit tabela",
    description:
      "Table, data-table (toolbar, filtros na URL, ordenação, paginação), skeletons, scroll-fade, format e hooks.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "table",
      "data-table",
      "table-skeletons",
      "scroll-fade",
      "format",
      "use-delayed-loading",
      "use-debounced-value",
    ],
  },
  {
    name: "kit-formulario",
    title: "Kit formulário",
    description:
      "Input, input-group, field, label, select, native-select, checkbox, switch, radio-group, textarea, kbd e calendar.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "input",
      "input-group",
      "field",
      "label",
      "select",
      "native-select",
      "checkbox",
      "switch",
      "radio-group",
      "textarea",
      "kbd",
      "calendar",
    ],
  },
  {
    name: "kit-feedback",
    title: "Kit feedback",
    description:
      "Skeleton, empty, spinner, loader, sonner, alert, notice, dialog, alert-dialog, tooltip, popover e dropdown-menu.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "skeleton",
      "empty",
      "spinner",
      "loader",
      "sonner",
      "alert",
      "notice",
      "dialog",
      "alert-dialog",
      "tooltip",
      "popover",
      "dropdown-menu",
    ],
  },
  {
    name: "kit-dados",
    title: "Kit dados",
    description:
      "Badge, context-chip, span-type, card-sparkline, pill-meter, number-ticker, copy-button e code-block.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "badge",
      "context-chip",
      "span-type",
      "card-sparkline",
      "pill-meter",
      "number-ticker",
      "copy-button",
      "code-block",
    ],
  },
  {
    name: "kit-graficos",
    title: "Kit gráficos",
    description:
      "Evil Charts (área, barras, linha, rosca), trend-charts e range-picker.",
    group: "kits",
    type: "registry:block",
    registryDependencies: [
      "evilcharts",
      "area-chart",
      "bar-chart",
      "line-chart",
      "donut-chart",
      "trend-charts",
      "range-picker",
    ],
  },
];

const DOCS: ItemMeta[] = [
  {
    name: "guia",
    title: "Guia do lume",
    description:
      "FRONTEND.md (regras Always/Never), o guia longo e os conceitos do craft, instalados em docs/lume/ de qualquer projeto.",
    group: "docs",
    type: "registry:item",
    files: [
      {
        path: "FRONTEND.md",
        type: "registry:file",
        target: "~/docs/lume/FRONTEND.md",
      },
      {
        path: "docs/conceitos/README.md",
        type: "registry:file",
        target: "~/docs/lume/CONCEITOS.md",
      },
      {
        path: "docs/referencias.md",
        type: "registry:file",
        target: "~/docs/lume/referencias.md",
      },
      {
        path: "docs/guia/00-como-ler.md",
        type: "registry:file",
        target: "~/docs/lume/guia/00-como-ler.md",
      },
      {
        path: "docs/guia/01-fundacoes.md",
        type: "registry:file",
        target: "~/docs/lume/guia/01-fundacoes.md",
      },
      {
        path: "docs/guia/02-primitivos.md",
        type: "registry:file",
        target: "~/docs/lume/guia/02-primitivos.md",
      },
      {
        path: "docs/guia/03-shell-e-paginas.md",
        type: "registry:file",
        target: "~/docs/lume/guia/03-shell-e-paginas.md",
      },
      {
        path: "docs/guia/04-dados.md",
        type: "registry:file",
        target: "~/docs/lume/guia/04-dados.md",
      },
      {
        path: "docs/guia/05-telas-de-detalhe.md",
        type: "registry:file",
        target: "~/docs/lume/guia/05-telas-de-detalhe.md",
      },
      {
        path: "docs/guia/06-formularios-auth-settings.md",
        type: "registry:file",
        target: "~/docs/lume/guia/06-formularios-auth-settings.md",
      },
      {
        path: "docs/guia/07-dialogs-e-wizards.md",
        type: "registry:file",
        target: "~/docs/lume/guia/07-dialogs-e-wizards.md",
      },
      {
        path: "docs/guia/08-assistente-de-ai.md",
        type: "registry:file",
        target: "~/docs/lume/guia/08-assistente-de-ai.md",
      },
      {
        path: "docs/guia/09-movimento.md",
        type: "registry:file",
        target: "~/docs/lume/guia/09-movimento.md",
      },
      {
        path: "docs/guia/10-fingerprint.md",
        type: "registry:file",
        target: "~/docs/lume/guia/10-fingerprint.md",
      },
      {
        path: "docs/guia/11-receita.md",
        type: "registry:file",
        target: "~/docs/lume/guia/11-receita.md",
      },
      {
        path: "docs/guia/glossario.md",
        type: "registry:file",
        target: "~/docs/lume/guia/glossario.md",
      },
    ],
    docs: "Aponte o AGENTS.md do projeto para docs/lume/FRONTEND.md.",
  },
];

export const items: ItemMeta[] = [
  ...BASE,
  ...PRIMITIVOS_CORE,
  ...PRIMITIVOS_EXTRA,
  ...HOOKS,
  ...FUNDACOES,
  ...BLOCKS,
  ...LANES,
  ...KITS,
  ...DOCS,
  ...CHARTS,
];

export const GROUP_ORDER: Group[] = [
  "base",
  "ui",
  "lib",
  "hooks",
  "blocks",
  "charts",
  "extras",
  "kits",
  "docs",
];
