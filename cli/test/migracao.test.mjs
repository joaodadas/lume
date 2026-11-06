// Testes do que o teste real no CRM da Lyx mostrou: as perguntas de produto,
// o aviso antes do --overwrite, o CSS global escrito pelo init, o plano da
// migração, o check por pasta e as regras de import antigo, diálogo do
// navegador e token órfão.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { conferir, relatorio } from "../src/check.mjs";
import { cssDaBase } from "../src/css.mjs";
import { passo } from "../src/init.mjs";
import {
  BASE,
  buscar,
  escrever,
  limpar,
  projetoCerto,
  regras,
} from "./fixtures.mjs";

afterEach(limpar);

const lumeJson = (raiz) =>
  JSON.parse(readFileSync(path.join(raiz, "lume.json"), "utf8"));

/** Projeto com tudo instalado e a skill: o init vai direto para migrar. */
function projetoNaMigracao(extra) {
  const raiz = projetoCerto(extra);
  escrever(
    raiz,
    "src/components/link.tsx",
    'export { default as Link } from "next/link";\n',
  );
  escrever(raiz, ".agents/skills/lume-design-engineering/SKILL.md", "# s\n");
  return raiz;
}

const daRegra = (r, regra) =>
  r.violacoes
    .filter((v) => v.regra === regra)
    .map((v) => [v.arquivo, v.linha, v.trecho]);

describe("etapa ler: perguntas de produto", () => {
  function semLumeJson() {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "lume.json"));
    return raiz;
  }

  it("projeto com interface própria: pergunta layout, tema e se pode substituir de uma vez", async () => {
    const r = await passo(semLumeJson(), { versao: "0.4.1", buscar });
    assert.equal(r.next, "perguntar");
    assert.deepEqual(
      r.details.perguntas.map((p) => p.nome),
      ["layout", "tema", "substituir"],
    );
    assert.match(r.say, /claro ou escuro/);
    assert.match(r.say, /Posso substituir de uma vez\? \(sim ou não\)/);
    assert.match(
      r.instruction,
      /lume@0\.4\.1 init --layout=<sidebar\|offcanvas\|topbar> --tema=<claro\|escuro> --substituir=<sim\|nao>/,
    );
  });

  it("--substituir=nao bloqueia, explica e não grava o lume.json", async () => {
    const raiz = semLumeJson();
    const r = await passo(raiz, {
      versao: "0.4.1",
      layout: "sidebar",
      tema: "claro",
      substituir: "nao",
      buscar,
    });
    assert.equal(r.next, "bloqueado");
    assert.match(r.say, /não convive com a interface antiga/);
    assert.equal(existsSync(path.join(raiz, "lume.json")), false);
  });

  it("sem a resposta de substituir, pergunta só ela e não grava nada", async () => {
    const raiz = semLumeJson();
    const r = await passo(raiz, {
      versao: "0.4.1",
      layout: "topbar",
      tema: "claro",
      buscar,
    });
    assert.deepEqual(
      r.details.perguntas.map((p) => p.nome),
      ["substituir"],
    );
    assert.equal(existsSync(path.join(raiz, "lume.json")), false);
  });

  it("com as três respostas grava versão, layout e tema e segue", async () => {
    const raiz = semLumeJson();
    const r = await passo(raiz, {
      versao: "0.4.0",
      layout: "topbar",
      tema: "claro",
      substituir: "sim",
      buscar,
    });
    assert.notEqual(r.etapa, "ler");
    assert.deepEqual(lumeJson(raiz), {
      versao: "0.4.0",
      layout: "topbar",
      tema: "claro",
    });
  });

  it("projeto que já adotou e não tem tema: pergunta só o tema", async () => {
    const raiz = projetoCerto();
    const lj = lumeJson(raiz);
    delete lj.tema;
    writeFileSync(path.join(raiz, "lume.json"), JSON.stringify(lj));
    let r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.deepEqual(
      r.details.perguntas.map((p) => p.nome),
      ["tema"],
    );
    r = await passo(raiz, { versao: "0.4.0", tema: "claro", buscar });
    assert.notEqual(r.etapa, "ler");
    assert.equal(lumeJson(raiz).tema, "claro");
  });

  it("tema inválido bloqueia no init e é violação no check", async () => {
    const r = await passo(projetoCerto(), {
      versao: "0.4.0",
      tema: "azul",
      buscar,
    });
    assert.equal(r.next, "bloqueado");
    const raiz = projetoCerto({ tema: "azul" });
    assert.deepEqual(
      (await conferir(raiz, { buscar })).violacoes.map((v) => v.trecho),
      ["tema precisa ser claro ou escuro"],
    );
  });
});

describe("etapa componentes: aviso antes do --overwrite", () => {
  /** Base instalada, button antigo e um componente antigo que usa o button. */
  function comInterfaceAntiga() {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "src/components/ui/dialog.tsx"));
    escrever(
      raiz,
      "src/components/ui/button.tsx",
      'export function Button({ variant = "primary" }) { return variant; }\n',
    );
    escrever(
      raiz,
      "src/components/ui/select-field.tsx",
      'import { Button } from "./button";\nexport function SelectField() { return Button({}); }\n',
    );
    escrever(
      raiz,
      "src/app/clientes/page.tsx",
      'import { SelectField } from "@/components/ui/select-field";\nexport default function P() { return SelectField(); }\n',
    );
    escrever(
      raiz,
      "src/app/layout.tsx",
      'import { Button } from "@/components/ui/button";\nexport default function L() { return Button({}); }\n',
    );
    return raiz;
  }

  it("pergunta com os números e pede commit antes de trocar", async () => {
    const r = await passo(comInterfaceAntiga(), { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "componentes");
    assert.equal(r.next, "perguntar");
    assert.equal(r.details.totalTrocados, 1);
    assert.deepEqual(r.details.antigos, ["src/components/ui/select-field.tsx"]);
    assert.equal(r.details.importadores, 2);
    assert.match(
      r.say,
      /troca 1 arquivos de components\/ui \(button\).*não compila nem abre.*commit/,
    );
    assert.match(r.instruction, /--confirmar-troca=sim/);
    assert.deepEqual(r.run, []);
  });

  it("com --confirmar-troca=sim manda rodar o --overwrite", async () => {
    const r = await passo(comInterfaceAntiga(), {
      versao: "0.4.0",
      confirmarTroca: "sim",
      buscar,
    });
    assert.equal(r.next, "rodar");
    assert.match(r.run[0], /--overwrite --yes$/);
  });
});

describe("etapa base: o init escreve o CSS global", () => {
  it("o CSS da base é o mesmo que o shadcn init escreve num projeto novo", () => {
    const raizRepo = path.resolve(import.meta.dirname, "..", "..");
    const base = JSON.parse(
      readFileSync(path.join(raizRepo, "public/r/base.json"), "utf8"),
    );
    // shadcn-init-base.txt: o globals.css de um projeto Next com só
    // `@import "tailwindcss";` depois de `npx shadcn@4.21.5 init
    // joaodadas/lume/base#v0.4.0 -y`. Mudou a base? Gere de novo.
    const doShadcn = readFileSync(
      path.join(import.meta.dirname, "shadcn-init-base.txt"),
      "utf8",
    );
    const linhas = (t) =>
      t
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    assert.deepEqual(linhas(cssDaBase(base)), linhas(doShadcn));
  });

  it("ordem: imports, plugin, dark, @theme com os keyframes, :root, .dark e o resto", () => {
    const css = cssDaBase(BASE);
    const ordem = [
      '@import "tailwindcss";',
      '@import "tw-animate-css";',
      '@plugin "@toolwind/corner-shape";',
      "@custom-variant dark (&:is(.dark *));",
      "@theme inline {",
      "  --custom-shadow-lifted: var(--custom-shadow-lifted);",
      "  --custom-shadow: var(--custom-shadow);",
      "  @keyframes shimmer {",
      ":root {",
      ".dark {",
      "@custom-variant squircle",
      "@layer base {",
    ].map((t) => css.indexOf(t));
    assert.ok(ordem.every((i) => i >= 0));
    assert.deepEqual(
      [...ordem].sort((a, b) => a - b),
      ordem,
    );
  });

  /** Projeto com o CSS e o components.json de antes do lume. */
  function antesDoLume() {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "components.json"));
    escrever(
      raiz,
      "src/app/globals.css",
      [
        '@import "tailwindcss";',
        '@source "../../packages/ui";',
        '@import "./tokens.css";',
        ":root { --success: #16a34a; --background: #fff; }",
        "@theme inline { --color-success: var(--success); --color-background: var(--background); }",
        ".btn { border-radius: 4px; }",
        ".dark .btn { color: white; }",
        "",
      ].join("\n"),
    );
    escrever(
      raiz,
      "src/app/tokens.css",
      "@theme inline { --color-warning: #f59e0b; }\n",
    );
    escrever(
      raiz,
      "src/app/clientes/page.tsx",
      [
        'export const a = <p className="bg-success text-success/80 btn" />;',
        'export const b = <p className="hover:bg-warning" style={{ color: "var(--success)" }} />;',
      ].join("\n"),
    );
    return raiz;
  }

  it("guarda o antigo, escreve só a base e lista o que saiu com o uso", async () => {
    const raiz = antesDoLume();
    const antes = readFileSync(path.join(raiz, "src/app/globals.css"), "utf8");
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "base");
    const novo = readFileSync(path.join(raiz, "src/app/globals.css"), "utf8");
    assert.equal(
      novo,
      cssDaBase(BASE, { sources: ['@source "../../packages/ui";'] }),
    );
    assert.equal(
      readFileSync(
        path.join(raiz, "src/app/globals.css.antes-do-lume"),
        "utf8",
      ),
      antes,
    );
    const g = r.details.cssGlobal;
    assert.equal(g.antigo, "src/app/globals.css.antes-do-lume");
    assert.deepEqual(g.importadosPeloAntigo, ["src/app/tokens.css"]);
    const tokens = Object.fromEntries(
      g.tokensRemovidos.map((t) => [t.nome, [t.usos, t.arquivos]]),
    );
    assert.deepEqual(tokens, { success: [3, 1], warning: [1, 1] });
    assert.deepEqual(g.classesRemovidas, [
      { nome: "btn", usos: 1, arquivos: 1 },
    ]);
    assert.match(r.say, /success \(3 usos em 1 arquivos\)/);
    assert.match(r.say, /codigo\/token-orfao/);
    assert.deepEqual(r.run, [
      "npx shadcn@latest init joaodadas/lume/base#v0.4.0 -y",
    ]);
  });

  it("chamar de novo não perde o antigo e devolve a mesma lista", async () => {
    const raiz = antesDoLume();
    const antes = readFileSync(path.join(raiz, "src/app/globals.css"), "utf8");
    const r1 = await passo(raiz, { versao: "0.4.0", buscar });
    const r2 = await passo(raiz, { versao: "0.4.0", buscar });
    assert.deepEqual(r2.details, r1.details);
    assert.equal(
      readFileSync(
        path.join(raiz, "src/app/globals.css.antes-do-lume"),
        "utf8",
      ),
      antes,
    );
  });

  it("CSS que já tem a base do lume não é reescrito", async () => {
    const raiz = projetoCerto();
    rmSync(path.join(raiz, "components.json"));
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "base");
    assert.equal(r.details.cssGlobal, undefined);
    assert.equal(
      existsSync(path.join(raiz, "src/app/globals.css.antes-do-lume")),
      false,
    );
  });
});

describe("etapa migrar: o plano", () => {
  function comTelas() {
    const raiz = projetoNaMigracao();
    escrever(
      raiz,
      "src/app/layout.tsx",
      'import { Nav } from "@/components/nav";\nexport default function L() { return Nav(); }\n',
    );
    escrever(
      raiz,
      "src/components/nav.tsx",
      [
        'import { Antigo } from "@/components/ui/antigo";',
        'export const Nav = () => <h1 className="text-2xl" />;',
      ].join("\n"),
    );
    escrever(
      raiz,
      "src/components/ui/antigo.tsx",
      "export const Antigo = 1;\n",
    );
    escrever(
      raiz,
      "src/app/(auth)/painel/layout.tsx",
      "export default function L({ children }) { return children; }\n",
    );
    escrever(
      raiz,
      "src/app/(auth)/painel/clientes/page.tsx",
      'import { Card } from "@/components/cliente-card";\nexport default () => <p className="font-bold" />;\n',
    );
    escrever(
      raiz,
      "src/app/(auth)/painel/clientes/[id]/page.tsx",
      'export default () => <p className="font-semibold" />;\n',
    );
    escrever(
      raiz,
      "src/components/cliente-card.tsx",
      'export const Card = () => <div className="shadow-lg" />;\n',
    );
    escrever(
      raiz,
      "src/app/(auth)/painel/vendas/page.tsx",
      'export default () => { if (confirm("x")) return 1; };\n',
    );
    escrever(
      raiz,
      "src/app/page.tsx",
      'export default () => <p className="text-3xl" />;\n',
    );
    escrever(
      raiz,
      "src/components/orfao.tsx",
      'export const O = () => <p className="space-y-2" />;\n',
    );
    return raiz;
  }

  it("primeiro o que o layout usa, depois tela por tela, o resto e a limpeza", async () => {
    const r = await passo(comTelas(), { versao: "0.4.0", buscar });
    assert.equal(r.next, "migrar");
    const plano = r.details.plano;
    assert.deepEqual(
      plano.map((g) => [g.tipo, g.pasta, g.arquivos]),
      [
        ["layout", null, ["src/components/nav.tsx (2)"]],
        [
          "tela",
          "src/app/(auth)/painel/clientes",
          [
            "src/app/(auth)/painel/clientes/[id]/page.tsx (1)",
            "src/app/(auth)/painel/clientes/page.tsx (1)",
            "src/components/cliente-card.tsx (1)",
          ],
        ],
        [
          "tela",
          "src/app/(auth)/painel/vendas",
          ["src/app/(auth)/painel/vendas/page.tsx (1)"],
        ],
        ["tela", "src/app/page.tsx", ["src/app/page.tsx (1)"]],
        ["resto", null, ["src/components/orfao.tsx (1)"]],
        [
          "limpeza",
          null,
          ["src/components/ui/antigo.tsx: antigo (ui/fora-da-registry)"],
        ],
      ],
    );
    assert.deepEqual(
      plano.map((g) => g.ordem),
      [1, 2, 3, 4, 5, 6],
    );
    assert.equal(
      plano[1].check,
      "npx -y @joao.dadas/lume@0.4.0 check --path='src/app/(auth)/painel/clientes',src/components/cliente-card.tsx",
    );
    assert.match(r.instruction, /details\.plano/);
    assert.match(r.instruction, /npx tsc --noEmit/);
    assert.match(r.instruction, /defaultTheme="dark"/);
  });

  it("usa o script de typecheck do projeto com o gerenciador do lockfile", async () => {
    const raiz = comTelas();
    const pkg = JSON.parse(
      readFileSync(path.join(raiz, "package.json"), "utf8"),
    );
    pkg.scripts = { typecheck: "tsc --noEmit" };
    writeFileSync(path.join(raiz, "package.json"), JSON.stringify(pkg));
    escrever(raiz, "pnpm-lock.yaml", "");
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.details.typecheck, "pnpm run typecheck");
  });

  it("no pronto, manda apagar o CSS guardado", async () => {
    const raiz = projetoNaMigracao({ tema: "claro" });
    escrever(raiz, "src/app/globals.css.antes-do-lume", ".x {}\n");
    const r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.next, "pronto");
    assert.match(
      r.instruction,
      /Apague o src\/app\/globals\.css\.antes-do-lume/,
    );
    assert.match(r.say, /tema claro/);
  });
});

describe("lume check --path e --help", () => {
  it("--path restringe as violações à pasta ou ao arquivo", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/a/page.tsx",
      'export const a = <p className="text-2xl" />;\n',
    );
    escrever(
      raiz,
      "src/app/b/page.tsx",
      'export const b = <p className="font-bold" />;\n',
    );
    const r = await conferir(raiz, { buscar, caminhos: ["./src/app/a/"] });
    assert.deepEqual(
      r.violacoes.map((v) => v.arquivo),
      ["src/app/a/page.tsx"],
    );
    assert.deepEqual(r.escopo, ["src/app/a"]);
    assert.match(relatorio(r), /em src\/app\/a/);
    const soB = await conferir(raiz, {
      buscar,
      caminhos: [path.join(raiz, "src/app/b/page.tsx"), "src/app/c"],
    });
    assert.deepEqual(regras(soB), ["codigo/peso"]);
    const limpo = await conferir(raiz, { buscar, caminhos: ["src/lib"] });
    assert.equal(limpo.ok, true);
    assert.match(relatorio(limpo), /tudo certo em src\/lib/);
  });

  it("--help mostra a ajuda e não roda a conferência", () => {
    const bin = path.join(import.meta.dirname, "..", "bin", "lume.mjs");
    for (const comando of ["check", "init"]) {
      const r = spawnSync(
        process.execPath,
        [bin, comando, "--help", "--dir=/nao/existe"],
        { encoding: "utf8" },
      );
      assert.equal(r.status, 0);
      assert.match(r.stdout, comando === "check" ? /--path=/ : /--tema=/);
      assert.doesNotMatch(
        r.stdout,
        /lume check: (tudo certo|\d+ violações)|"etapa"/,
      );
    }
  });
});

describe("regra codigo/import-antigo", () => {
  it("acusa cada import de componente de components/ui que não é do lume", async () => {
    const raiz = projetoCerto({
      extras: { kanban: "quadro do produto sem par" },
    });
    escrever(
      raiz,
      "src/components/ui/select-field.tsx",
      "export const S = 1;\n",
    );
    escrever(raiz, "src/components/ui/kanban.tsx", "export const K = 1;\n");
    escrever(
      raiz,
      "src/app/tela.tsx",
      [
        'import { Button } from "@/components/ui/button";',
        'import { S } from "@/components/ui/select-field";',
        'import { K } from "@/components/ui/kanban";',
        'import { M } from "@/components/ui/modal";',
        "export const x = 1;",
      ].join("\n"),
    );
    escrever(
      raiz,
      "src/components/app/filtro.tsx",
      'import {\n  S,\n} from "../ui/select-field";\n',
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(daRegra(r, "codigo/import-antigo"), [
      ["src/app/tela.tsx", 2, "@/components/ui/select-field"],
      ["src/app/tela.tsx", 4, "@/components/ui/modal"],
      ["src/components/app/filtro.tsx", 1, "../ui/select-field"],
    ]);
  });
});

describe("regra codigo/dialogo-do-navegador", () => {
  it("acusa confirm, alert e prompt do navegador e deixa os do próprio código", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/a.tsx",
      [
        'if (confirm("Apagar?")) apagar();',
        "window.alert(1);",
        "const nome = globalThis.prompt('Nome');",
        "api.confirm(id);",
        'const t = "use confirm(x) para";',
        "const o = { alert(m) { return m; } };",
      ].join("\n"),
    );
    escrever(
      raiz,
      "src/app/b.tsx",
      [
        "const { confirm } = useConfirm();",
        "confirm({ titulo: 'x' });",
        "window.confirm('y');",
      ].join("\n"),
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(daRegra(r, "codigo/dialogo-do-navegador"), [
      ["src/app/a.tsx", 1, "confirm"],
      ["src/app/a.tsx", 2, "window.alert"],
      ["src/app/a.tsx", 3, "globalThis.prompt"],
      ["src/app/b.tsx", 3, "window.confirm"],
    ]);
  });
});

describe("regra codigo/token-orfao", () => {
  it("acusa cor que não é token do CSS nem da paleta", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      [
        'export const a = <p className="bg-success text-danger/80 border-t-warning hover:bg-success" />;',
        'export const b = <p className="bg-card text-muted-foreground bg-red-500/10 text-sm border-2 border-x-2 ring-offset-2" />;',
        'export const c = <p className="bg-linear-to-r text-balance fill-current stroke-none bg-white/5 border-transparent" />;',
        'export const d = <a href="/text-editor" className={cn("text-xs", ok && "bg-background")} />;',
      ].join("\n"),
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(
      daRegra(r, "codigo/token-orfao").map(([, linha, trecho]) => [
        linha,
        trecho,
      ]),
      [
        [1, "bg-success"],
        [1, "text-danger/80"],
        [1, "border-t-warning"],
        [1, "bg-success"],
      ],
    );
  });

  it("cor definida num CSS importado pelo global não é órfã; com @config a regra não roda", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      'export const a = <p className="bg-success" />;\n',
    );
    const global = path.join(raiz, "src/app/globals.css");
    const css = readFileSync(global, "utf8");
    writeFileSync(global, `${css}@import "./status.css";\n`);
    escrever(
      raiz,
      "src/app/status.css",
      "@theme inline { --color-success: #16a34a; }\n",
    );
    assert.equal((await conferir(raiz, { buscar })).ok, true);
    writeFileSync(global, `${css}@config "../../tailwind.config.js";\n`);
    assert.equal((await conferir(raiz, { buscar })).ok, true);
  });

  it("o relatório traz a regra nova com o que fazer", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      'export const a = <p className="text-danger" />;\n',
    );
    assert.match(
      relatorio(await conferir(raiz, { buscar })),
      /codigo\/token-orfao \(1\): Classe com uma cor que não existe/,
    );
  });
});
