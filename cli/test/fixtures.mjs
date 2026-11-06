// O que os testes do CLI compartilham: uma registry falsa e um projeto Next
// que adotou o lume do jeito certo, montado numa pasta temporária.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export const BUTTON = `// Derivado do Foglamp, Apache-2.0.
import { cn } from "@/registry/base-vega/lib/utils";

export function Button({ className, ...props }) {
  return <button className={cn("rounded-full h-8", className)} {...props} />;
}
`;
export const CARD = `import { cn } from "@/registry/base-vega/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("bg-card shadow-(--custom-shadow)", className)} {...props} />;
}
`;
export const UI = ["button", "card", "input", "dialog", "select"];
export const conteudo = (nome) =>
  nome === "button"
    ? BUTTON
    : nome === "card"
      ? CARD
      : `export const ${nome} = 1;\n`;

export const ALVO_APP_SHELL = "components/app-shell/app-shell.tsx";

export const REGISTRY = {
  items: [
    ...UI.map((name) => ({
      name,
      type: "registry:ui",
      files: [
        { path: `registry/base-vega/ui/${name}.tsx`, type: "registry:ui" },
      ],
    })),
    {
      name: "app-shell",
      type: "registry:component",
      registryDependencies: ["joaodadas/lume/button#v0.4.0"],
      files: [
        {
          path: "registry/base-vega/blocks/app-shell/app-shell.tsx",
          type: "registry:component",
          target: ALVO_APP_SHELL,
        },
      ],
    },
    {
      name: "section",
      type: "registry:component",
      files: [
        {
          path: "registry/base-vega/components/section.tsx",
          type: "registry:component",
        },
      ],
    },
    {
      name: "use-mobile",
      type: "registry:hook",
      files: [
        {
          path: "registry/base-vega/hooks/use-mobile.ts",
          type: "registry:hook",
        },
      ],
    },
    ...["format", "utils"].map((name) => ({
      name,
      type: "registry:lib",
      files: [
        { path: `registry/base-vega/lib/${name}.ts`, type: "registry:lib" },
      ],
    })),
    {
      name: "kit-shell",
      type: "registry:block",
      registryDependencies: ["joaodadas/lume/app-shell#v0.4.0"],
      files: [],
    },
    {
      name: "kit-tabela",
      type: "registry:block",
      registryDependencies: [
        "joaodadas/lume/use-mobile#v0.4.0",
        "joaodadas/lume/format#v0.4.0",
        "joaodadas/lume/utils#v0.4.0",
      ],
      files: [],
    },
  ],
};

export const CONTEUDO_EXTRA = {
  "app-shell": "export function AppShell() {}\n",
  section: "export function Section() {}\n",
  "use-mobile": "export function useMobile() { return false; }\n",
  format: "export const formatar = (n) => String(n);\n",
  utils: "export const cn = (...c) => c.join(' ');\n",
};

/** O item base, no formato do public/r/base.json. */
export const BASE = {
  name: "base",
  cssVars: {
    theme: {
      "font-sans": '"Inter Variable", sans-serif',
      "color-background": "var(--background)",
      "color-card": "var(--card)",
      "radius-lg": "var(--radius)",
      "animate-shimmer": "shimmer 4s linear infinite",
    },
    light: {
      background: "oklch(0.99 0 0)",
      card: "oklch(1 0 0)",
      radius: "0.625rem",
      "custom-shadow": "0 0 0 0.5px rgba(0, 0, 0, 0.06)",
      "custom-shadow-lifted": "0 6px 12px -4px rgba(0, 0, 0, 0.1)",
    },
    dark: {
      background: "oklch(0.17 0 0)",
      card: "oklch(0.205 0 0)",
      "custom-shadow": "inset 0 0 0 0.75px rgba(255, 255, 255, 0.03)",
      "custom-shadow-lifted": "0 4px 8px 0 rgba(0, 0, 0, 0.25)",
    },
  },
  css: {
    '@import "tw-animate-css"': {},
    '@import "shadcn/tailwind.css"': {},
    '@plugin "@toolwind/corner-shape"': {},
    "@custom-variant squircle (@supports (corner-shape: squircle))": {},
    "@keyframes shimmer": {
      "0%": { "background-position": "200% center" },
      "100%": { "background-position": "-200% center" },
    },
    "@layer base": {
      "*": { "@apply border-border": {} },
      body: { "@apply bg-background text-foreground": {} },
    },
  },
};

export async function buscar(url) {
  if (url.endsWith("/registry.json")) return REGISTRY;
  if (url.endsWith("/base.json")) return BASE;
  const nome = path.basename(url, ".json");
  const item = REGISTRY.items.find((i) => i.name === nome);
  return {
    files: (item?.files ?? []).map((f) => ({
      path: f.path,
      content: CONTEUDO_EXTRA[nome] ?? conteudo(nome),
    })),
  };
}

export const CSS_BASE = `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter/opsz.css";
@plugin "@toolwind/corner-shape";
:root { --custom-shadow: 0 0 0 0.5px rgba(0,0,0,.06); }
@theme inline {
  --font-sans: "Inter Variable", ui-sans-serif, sans-serif;
  --color-background: var(--background);
  --color-card: var(--card);
  --color-muted-foreground: var(--muted-foreground);
}
`;

export const pastas = [];

/** Apaga as pastas temporárias dos testes (chame no afterEach). */
export function limpar() {
  for (const p of pastas.splice(0)) rmSync(p, { recursive: true, force: true });
}

export function escrever(raiz, rel, texto) {
  const destino = path.join(raiz, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, texto);
}

/** Um projeto Next que adotou o lume do jeito certo. */
export function projetoCerto(extra = {}) {
  const raiz = mkdtempSync(path.join(tmpdir(), "lume-cli-"));
  pastas.push(raiz);
  escrever(
    raiz,
    "package.json",
    JSON.stringify({
      dependencies: { next: "16.0.0", react: "19.0.0" },
      devDependencies: { tailwindcss: "^4" },
    }),
  );
  escrever(
    raiz,
    "tsconfig.json",
    `{ // comentário\n "compilerOptions": { "paths": { "@/*": ["./src/*"] } }, }`,
  );
  escrever(
    raiz,
    "components.json",
    JSON.stringify({
      style: "base-vega",
      tsx: true,
      iconLibrary: "tabler",
      tailwind: { css: "src/app/globals.css" },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        utils: "@/lib/utils",
      },
    }),
  );
  escrever(
    raiz,
    "lume.json",
    JSON.stringify({
      versao: "0.4.0",
      layout: "sidebar",
      tema: "escuro",
      ...extra,
    }),
  );
  escrever(raiz, "src/app/globals.css", CSS_BASE);
  for (const nome of UI) {
    escrever(
      raiz,
      `src/components/ui/${nome}.tsx`,
      conteudo(nome)
        .replace("@/registry/base-vega/lib/utils", "@/lib/utils")
        .replace(/^\/\/.*\n/, ""),
    );
  }
  escrever(raiz, `src/${ALVO_APP_SHELL}`, CONTEUDO_EXTRA["app-shell"]);
  escrever(raiz, "src/hooks/use-mobile.ts", CONTEUDO_EXTRA["use-mobile"]);
  escrever(raiz, "src/lib/format.ts", CONTEUDO_EXTRA.format);
  escrever(raiz, "src/lib/utils.ts", CONTEUDO_EXTRA.utils);
  escrever(
    raiz,
    "src/app/page.tsx",
    `export default function P() { return <main className="flex flex-col gap-4 text-sm" />; }\n`,
  );
  return raiz;
}

export const regras = (r) =>
  [...new Set(r.violacoes.map((v) => v.regra))].sort();
