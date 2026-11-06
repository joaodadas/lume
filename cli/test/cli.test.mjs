// Testes do CLI com uma registry falsa e projetos montados numa pasta
// temporária. Rode com `node --test 'cli/test/*.test.mjs'`.

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
import { lerProjeto } from "../src/projeto.mjs";
import { normalizar } from "../src/texto.mjs";
import {
  ALVO_APP_SHELL,
  BUTTON,
  buscar,
  CSS_BASE,
  conteudo,
  escrever,
  limpar,
  pastas,
  projetoCerto,
  regras,
  UI,
} from "./fixtures.mjs";

afterEach(limpar);

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
  it("reduz import por alias do projeto (#/, @app/) e deixa pacote npm", () => {
    const a = `import { cn } from "@/registry/base-vega/lib/utils";\nimport { x } from "@base-ui/react/x";\n`;
    const b = `import { cn } from "#/lib/utils";\nimport { x } from "@base-ui/react/x";\n`;
    const c = `import { cn } from "@app/lib/utils";\nimport { x } from "@base-ui/react/x";\n`;
    assert.equal(normalizar(a), normalizar(b));
    assert.equal(normalizar(a, ["@app/"]), normalizar(c, ["@app/"]));
    assert.notEqual(normalizar(a), normalizar(c));
    assert.notEqual(
      normalizar(`import { x } from "@base-ui/react/x";`),
      normalizar(`import { x } from "@outro/react/x";`),
    );
  });
  it("o mesmo arquivo em duas formatações é igual", () => {
    const a = [
      'import { cn } from "@/lib/utils";',
      "",
      "export function B({ className, ...props }) {",
      "  const lista = [1, 2, 3];",
      "  const r = /a;b/;",
      "  return (",
      '    <button className={cn("rounded-full h-8", className)} {...props} />',
      "  );",
      "}",
      "",
    ].join("\n");
    const b = [
      "import {cn} from '@/lib/utils'",
      "export function B({className, ...props}) {",
      "  const lista = [",
      "    1,",
      "    2,",
      "    3,",
      "  ]",
      "  const r = /a;b/",
      "  return (",
      "    <button",
      "      className={cn('rounded-full h-8', className)}",
      "      {...props}",
      "    />",
      "  )",
      "}",
    ].join("\n");
    assert.equal(normalizar(a), normalizar(b));
    assert.notEqual(
      normalizar(a),
      normalizar(a.replace("rounded-full h-8", "rounded-md h-8")),
    );
  });
});

describe("conferir", () => {
  it("acusa bloco de um kit do init editado à mão", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      `src/${ALVO_APP_SHELL}`,
      "export function AppShell() { return 1; }\n",
    );
    assert.deepEqual(regras(await conferir(raiz, { buscar })), ["ui/editado"]);
  });

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

  it("componente do produto com nome de item fora do que o lume instalou não é acusado", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/components/section.tsx",
      "export function Section({ titulo }) { return titulo; }\n",
    );
    assert.equal((await conferir(raiz, { buscar })).ok, true);
    const comItem = projetoCerto({ itens: ["section"] });
    escrever(
      comItem,
      "src/components/section.tsx",
      "export function Section({ titulo }) { return titulo; }\n",
    );
    const r = await conferir(comItem, { buscar });
    assert.deepEqual(
      r.violacoes.map((v) => [v.regra, v.arquivo]),
      [["ui/editado", "src/components/section.tsx"]],
    );
  });

  it("compara hooks e lib/format, mas não lib/utils", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/lib/utils.ts",
      "export const cn = () => '';\nexport const meu = 1;\n",
    );
    assert.equal((await conferir(raiz, { buscar })).ok, true);
    escrever(
      raiz,
      "src/hooks/use-mobile.ts",
      "export function useMobile() { return true; }\n",
    );
    escrever(
      raiz,
      "src/lib/format.ts",
      "export const formatar = (n) => String(n + 1);\n",
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(r.violacoes.map((v) => [v.regra, v.arquivo]).sort(), [
      ["ui/editado", "src/hooks/use-mobile.ts"],
      ["ui/editado", "src/lib/format.ts"],
    ]);
  });

  it("sombra: shadow sozinho e shadow-xs contam; a do lume e a arbitrária não", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      [
        'export const a = <div className="shadow p-2" />;',
        'export const b = <div className="shadow-xs" />;',
        'export const c = <div className="shadow-(--custom-shadow) shadow-[0_0_0_1px_red]" />;',
        "const shadow = 1;",
        "export const d = { shadow };",
      ].join("\n"),
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(
      r.violacoes.map((v) => [v.regra, v.linha]),
      [
        ["codigo/sombra", 1],
        ["codigo/sombra", 2],
      ],
    );
  });

  it("acusa antd e @chakra-ui no import e data-[state] com aspas", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "src/app/tela.tsx",
      [
        'import { Button } from "antd";',
        'import { Box } from "@chakra-ui/react";',
        `export const a = <div className='data-[state="open"]:flex data-[state=selected]:flex' />;`,
      ].join("\n"),
    );
    const r = await conferir(raiz, { buscar });
    assert.deepEqual(
      r.violacoes.map((v) => [v.regra, v.trecho]),
      [
        ["codigo/import", "antd"],
        ["codigo/import", "@chakra-ui/react"],
        ["codigo/data-state", 'data-[state="open"]'],
      ],
    );
  });
});

describe("lerProjeto", () => {
  function comTsconfig(compilerOptions) {
    const raiz = mkdtempSync(path.join(tmpdir(), "lume-cli-"));
    pastas.push(raiz);
    escrever(raiz, "package.json", "{}");
    escrever(raiz, "tsconfig.json", JSON.stringify({ compilerOptions }));
    mkdirSync(path.join(raiz, "src"));
    return raiz;
  }
  it("o prefixo vem do alvo de @/* no tsconfig, não da pasta src", () => {
    assert.equal(
      lerProjeto(comTsconfig({ paths: { "@/*": ["./*"] } })).prefixo,
      "",
    );
    assert.equal(
      lerProjeto(comTsconfig({ baseUrl: "src", paths: { "@/*": ["*"] } }))
        .prefixo,
      "src/",
    );
    const p = lerProjeto(
      comTsconfig({ baseUrl: ".", paths: { "@/*": ["./app-src/*"] } }),
    );
    assert.equal(p.prefixo, "app-src/");
    assert.equal(p.dirUi, "app-src/components/ui");
    assert.equal(lerProjeto(comTsconfig({})).prefixo, "src/");
  });

  it("com @/* na raiz, código e CSS fora das pastas do app não entram", async () => {
    const raiz = projetoCerto();
    escrever(
      raiz,
      "tsconfig.json",
      JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    );
    escrever(raiz, "scripts/gerar.ts", 'export const a = "text-3xl";\n');
    escrever(raiz, "docs/x.css", "html { font-feature-settings: 'cv11'; }\n");
    assert.equal((await conferir(raiz, { buscar })).ok, true);
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
    const r = await passo(raiz, {
      versao: "0.4.0",
      layout: "topbar",
      tema: "claro",
      substituir: "sim",
      buscar,
    });
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
        tema: "claro",
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

  it("usa a versão do lume.json, não a do pacote, quando o usuário não quer subir", async () => {
    const raiz = projetoCerto({ versao: "0.3.0" });
    rmSync(path.join(raiz, "src/components/ui/dialog.tsx"));
    let r = await passo(raiz, { versao: "0.4.0", buscar });
    assert.equal(r.etapa, "atualizar");
    assert.equal(r.next, "perguntar");
    assert.match(r.instruction, /lume@0\.4\.0 init --atualizar=sim/);
    assert.match(r.instruction, /lume@0\.3\.0 init`/);
    r = await passo(raiz, { versao: "0.4.0", atualizar: "nao", buscar });
    assert.equal(r.etapa, "componentes");
    assert.match(r.run[0], /dialog#v0\.3\.0/);
    assert.doesNotMatch(r.run[0], /#v0\.4\.0/);
    r = await passo(raiz, { versao: "0.3.0", buscar });
    assert.equal(r.etapa, "componentes");
    const lj = JSON.parse(readFileSync(path.join(raiz, "lume.json"), "utf8"));
    assert.equal(lj.versao, "0.3.0");
  });

  it("com o layout passado de novo, mantém a versão do lume.json", async () => {
    const raiz = projetoCerto({ versao: "0.3.0" });
    await passo(raiz, { versao: "0.4.0", layout: "topbar", buscar });
    const lj = JSON.parse(readFileSync(path.join(raiz, "lume.json"), "utf8"));
    assert.deepEqual(lj, { versao: "0.3.0", layout: "topbar", tema: "escuro" });
  });

  it("ao aceitar subir, regrava o lume.json e reinstala tudo com --overwrite na versão nova", async () => {
    const raiz = projetoCerto({ versao: "0.3.0", itens: ["section"] });
    const r = await passo(raiz, { versao: "0.4.0", atualizar: "sim", buscar });
    assert.equal(r.etapa, "atualizar");
    assert.equal(r.next, "rodar");
    assert.match(
      r.run[0],
      /^npx shadcn@latest add .*button#v0\.4\.0.*kit-shell#v0\.4\.0.*section#v0\.4\.0 --overwrite --yes$/,
    );
    assert.match(r.run[1], /link-next#v0\.4\.0 --overwrite/);
    const lj = JSON.parse(readFileSync(path.join(raiz, "lume.json"), "utf8"));
    assert.equal(lj.versao, "0.4.0");
    assert.equal(lj.layout, "sidebar");
    const de_novo = await passo(raiz, { versao: "0.4.0", buscar });
    assert.notEqual(de_novo.etapa, "atualizar");
  });

  it("a base só vale com o alias de utils e as marcas num CSS importado pelo global", async () => {
    const raiz = projetoCerto();
    const cj = JSON.parse(
      readFileSync(path.join(raiz, "components.json"), "utf8"),
    );
    cj.aliases.utils = "@/components/lume/utils";
    writeFileSync(path.join(raiz, "components.json"), JSON.stringify(cj));
    assert.equal(
      (await passo(raiz, { versao: "0.4.0", buscar })).etapa,
      "base",
    );
    cj.aliases.utils = "@/lib/utils";
    writeFileSync(path.join(raiz, "components.json"), JSON.stringify(cj));
    escrever(raiz, "src/app/globals.css", '@import "./lume.css";\n');
    escrever(raiz, "src/app/lume.css", CSS_BASE);
    assert.notEqual(
      (await passo(raiz, { versao: "0.4.0", buscar })).etapa,
      "base",
    );
  });
});
