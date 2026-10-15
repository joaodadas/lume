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
      registries: { "@lume": "https://lume.vercel.app/r/{name}.json" },
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
      evil("ui/chart.tsx"),
      evil("ui/tooltip.tsx"),
      evil("ui/legend.tsx"),
      evil("ui/zoom.tsx"),
      evil("ui/evil-brush.tsx"),
      evil("ui/dot.tsx"),
      evil("ui/background.tsx"),
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

export const items: ItemMeta[] = [
  ...BASE,
  ...PRIMITIVOS_CORE,
  ...PRIMITIVOS_EXTRA,
  ...HOOKS,
  ...BLOCKS,
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
