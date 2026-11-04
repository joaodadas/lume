// Testes do CLI com uma registry falsa e projetos montados numa pasta
// temporária. Rode com `node --test cli/test/`.

import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { conferir, relatorio } from "../src/check.mjs";
import { passo } from "../src/init.mjs";
import { normalizar } from "../src/texto.mjs";

const BUTTON = `// Derivado do Foglamp, Apache-2.0.
import { cn } from "@/registry/base-vega/lib/utils";

export function Button({ className, ...props }) {
  return <button className={cn("rounded-full h-8", className)} {...props} />;
}
`;
const CARD = `import { cn } from "@/registry/base-vega/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("bg-card shadow-(--custom-shadow)", className)} {...props} />;
}
`;
const UI = ["button", "card", "input", "dialog", "select"];
const conteudo = (nome) =>
  nome === "button"
    ? BUTTON
    : nome === "card"
      ? CARD
      : `export const ${nome} = 1;\n`;

const REGISTRY = {
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
      files: [
        {
          path: "registry/base-vega/blocks/app-shell/app-shell.tsx",
          type: "registry:component",
          target: "components/app-shell/app-shell.tsx",
        },
      ],
    },
  ],
};

async function buscar(url) {
  if (url.endsWith("/registry.json")) return REGISTRY;
  const nome = path.basename(url, ".json");
  if (nome === "app-shell") {
    return {
      files: [
        {
          path: "registry/base-vega/blocks/app-shell/app-shell.tsx",
          content: "export function AppShell() {}\n",
        },
      ],
    };
  }
  return {
    files: [
      { path: `registry/base-vega/ui/${nome}.tsx`, content: conteudo(nome) },
    ],
  };
}

const CSS_BASE = `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter/opsz.css";
@plugin "@toolwind/corner-shape";
:root { --custom-shadow: 0 0 0 0.5px rgba(0,0,0,.06); }
@theme inline { --font-sans: "Inter Variable", ui-sans-serif, sans-serif; }
`;

const pastas = [];
afterEach(() => {
  for (const p of pastas.splice(0)) rmSync(p, { recursive: true, force: true });
});

function escrever(raiz, rel, texto) {
  const destino = path.join(raiz, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, texto);
}

/** Um projeto Next que adotou o lume do jeito certo. */
function projetoCerto(extra = {}) {
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
    JSON.stringify({ versao: "0.4.0", layout: "sidebar", ...extra }),
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
  escrever(
    raiz,
    "src/components/app-shell/app-shell.tsx",
    "export function AppShell() {}\n",
  );
  escrever(
    raiz,
    "src/app/page.tsx",
    `export default function P() { return <main className="flex flex-col gap-4 text-sm" />; }\n`,
  );
  return raiz;
}

const regras = (r) => [...new Set(r.violacoes.map((v) => v.regra))].sort();

describe("normalizar", () => {
  it("ignora comentários, caminho de import e use client", () => {
    const a = `"use client";\n// cabeçalho\nimport { cn } from "@/registry/base-vega/lib/utils";\nexport const x = cn("a");\n`;
    const b = `import { cn } from "@/lib/utils";\n\nexport const x = cn("a");`;
    assert.equal(normalizar(a), normalizar(b));
  });
  it("não confunde https:// com comentário", () => {
    assert.match(
      normalizar(`const u = "https://x.dev"; // fim`),
      /https:\/\/x\.dev/,
    );
  });
});

describe("conferir", () => {
  it("projeto certo passa", async () => {
    const r = await conferir(projetoCerto(), { buscar });
    assert.deepEqual(r.violacoes, []);
    assert.equal(r.ok, true);
    assert.match(relatorio(r), /tudo certo/);
  });

  it("acusa primitivo editado à mão", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/components/ui/button.tsx",
      BUTTON.replace("rounded-full h-8", "rounded-md h-9"),
    );
    assert.deepEqual(regras(await conferir(raiz, { buscar })), ["ui/editado"]);
  });

  it("acusa componente que não é do lume em components/ui, salvo extras com motivo", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/components/ui/modal.tsx",
      "export function Modal() {}\n",
    );
    escrever(raiz, "src/components/ui/button.spec.tsx", "it('x', () => {});\n");
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(
      r.violacoes.map((v) => v.arquivo),
      ["src/components/ui/modal.tsx"],
    );
    const comExtra = projetoCerto({
      extras: { modal: "bloco do produto ainda sem par no lume" },
    });
    escrever(
      comExtra,
      "src/components/ui/modal.tsx",
      "export function Modal() {}\n",
    );
    assert.equal((await conferir(comExtra, { buscar })).ok, true);
  });

  it("acusa alias desviado e a pasta paralela de primitivos", async () => {
    const raiz = projetoCerto();
    const cj = JSON.parse(
      readFileSync(path.join(raiz, "components.json"), "utf8"),
    );
    cj.aliases = {
      components: "@/components/lume",
      ui: "@/components/lume/ui",
      utils: "@/components/lume/lib/utils",
    };
    writeFileSync(path.join(raiz, "components.json"), JSON.stringify(cj));
    for (const nome of UI)
      escrever(raiz, `src/components/lume/ui/${nome}.tsx`, conteudo(nome));
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(regras(r), ["config/alias", "ui/paralelo"]);
  });

  it("acusa código fora das regras e respeita a exceção com motivo", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      [
        'import { X } from "lucide-react";',
        'export const a = <h1 className="text-2xl font-bold" />;',
        'export const b = <div className="space-y-4 bg-gray-100 shadow-lg" />;',
        "export const c = <Button asChild />;",
        "// lume:excecao motivo=número grande do mural de TV",
        'export const d = <p className="text-4xl" />;',
        "// text-3xl em comentário não conta",
      ].join("\n"),
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(regras(r), [
      "codigo/aschild",
      "codigo/cinza",
      "codigo/espaco",
      "codigo/import",
      "codigo/peso",
      "codigo/sombra",
      "codigo/titulo",
    ]);
    assert.equal(
      r.violacoes.filter((v) => v.regra === "codigo/titulo").length,
      1,
    );
  });

  it("acusa fonte trocada num CSS importado pelo global e dependência proibida", async () => {
    const raiz = projetoCerto();
    escrever(raiz, "src/app/globals.css", `${CSS_BASE}@import './tema.css';\n`);
    escrever(
      raiz,
      "src/app/tema.css",
      `@import 'inter-ui/inter-variable.css';\n@theme inline { --font-sans: InterVariable, sans-serif; }\nhtml { font-feature-settings: 'cv11'; }\n`,
    );
    const pkg = JSON.parse(
      readFileSync(path.join(raiz, "package.json"), "utf8"),
    );
    pkg.dependencies["inter-ui"] = "^4";
    writeFileSync(path.join(raiz, "package.json"), JSON.stringify(pkg));
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(regras(r), ["css/fonte", "deps/proibida"]);
    assert.equal(r.violacoes.filter((v) => v.regra === "css/fonte").length, 3);
  });

  it("sem lume.json acusa a falta do marcador", async () => {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "lume.json"));
    assert.deepEqual(
      regras(await conferir(raiz, { buscar, versaoPadrao: "0.4.0" })),
      ["config/lume-json"],
    );
  });
});

describe("passo (init)", () => {
  it("sem layout, pergunta ao usuário", async () => {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "lume.json"));
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.next, "perguntar");
    assert.match(r.say, /sidebar.*offcanvas.*topbar/);
    assert.ok(r.rules.length > 3);
  });

  it("com o layout, grava o lume.json e pede a base quando o components.json não é do lume", async () => {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "lume.json"));
    const cj = JSON.parse(
      readFileSync(path.join(raiz, "components.json"), "utf8"),
    );
    cj.style = "new-york";
    writeFileSync(path.join(raiz, "components.json"), JSON.stringify(cj));
    const r = await passo(raiz, { versao: "0.4.0", layout: "topbar", buscar });
    assert.equal(r.etapa, "base");
    assert.deepEqual(r.run, [
      "rm components.json",
      "npx shadcn@latest init joaodadas/lume/base#v0.4.0 -y",
    ]);
    assert.deepEqual(
      JSON.parse(readFileSync(path.join(raiz, "lume.json"), "utf8")),
      {
        versao: "0.4.0",
        layout: "topbar",
      },
    );
  });

  it("layout inválido bloqueia", async () => {
    const r = await passo(projetoCerto(), {
      versao: "0.4.0",
      layout: "lateral",
      buscar,
    });
    assert.equal(r.next, "bloqueado");
  });

  it("com primitivo faltando, instala tudo com --overwrite", async () => {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "src/components/ui/dialog.tsx"));
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "componentes");
    assert.match(
      r.run[0],
      /^npx shadcn@latest add .*joaodadas\/lume\/dialog#v0\.4\.0.* --overwrite --yes$/,
    );
    assert.match(r.run[1], /link-next#v0\.4\.0 --overwrite/);
  });

  it("com tudo instalado e a skill, migra até o check passar e termina em pronto", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/components/link.tsx",
      'export { default as Link } from "next/link";\n',
    );
    let r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "skill");
    escrever(
      raiz,
      ".agents/skills/lume-design-engineering/SKILL.md",
      "# skill\n",
    );
    escrever(
      raiz,
      "src/app/tela.tsx",
      'export const a = <h1 className="text-2xl" />;\n',
    );
    r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.next, "migrar");
    assert.match(r.instruction, /collapsible="icon"/);
    rmSync(path.join(raiz, "src/app/tela.tsx"));
    r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.next, "pronto");
  });
});
