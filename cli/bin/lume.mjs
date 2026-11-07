#!/usr/bin/env node
// lume: adoção do lume por agente.
//   lume init [--layout=...] [--tema=...] [--substituir=...] [--confirmar-troca=sim]
//             [--atualizar=sim|nao]       uma etapa por chamada, em JSON
//   lume check [--path=<pasta>] [--json]  confere o projeto; sai 1 se houver violação
//   lume prompt                           o texto para colar no agente

import { readFileSync } from "node:fs";
import { conferir, relatorio } from "../src/check.mjs";
import { passo } from "../src/init.mjs";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const PROMPT = `Aplique o lume neste projeto: rode \`npx -y @joao.dadas/lume@latest init\` e siga exatamente o que ele responder, uma etapa por vez, até o \`next\` ser \`pronto\`.`;

const AJUDA = {
  init: [
    "lume init: adota o lume, uma etapa por chamada. Cada resposta é um JSON",
    "(etapa, next, say, instruction, run, rules, details) para o agente seguir.",
    "",
    "  --layout=sidebar|offcanvas|topbar  layout de navegação (gravado no lume.json)",
    "  --tema=claro|escuro                tema padrão (gravado no lume.json)",
    "  --substituir=sim|nao               projeto com interface própria: troca de uma vez?",
    "  --confirmar-troca=sim              segue com o --overwrite de components/ui",
    "  --atualizar=sim|nao                sobe (ou não) para a versão do pacote",
    "  --dir=<pasta>                      raiz do projeto (padrão: a pasta atual)",
  ],
  check: [
    "lume check: confere o projeto contra a registry da versão do lume.json.",
    "Sai 1 se houver violação.",
    "",
    "  --path=<pasta>[,<pasta>...]  só as violações destas pastas ou arquivos",
    "  --json                       o resultado em JSON",
    "  --dir=<pasta>                raiz do projeto (padrão: a pasta atual)",
  ],
  prompt: ["lume prompt: imprime o texto para colar no seu agente."],
};

function argumento(nome) {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`));
  return a ? a.slice(nome.length + 3) : undefined;
}

const comando = process.argv[2];
const pediuAjuda = process.argv
  .slice(3)
  .some((a) => a === "--help" || a === "-h");
const versao = argumento("versao") ?? process.env.LUME_VERSAO ?? pkg.version;
const raiz = argumento("dir") ?? process.cwd();

function ajudaGeral() {
  return [
    `lume ${pkg.version}`,
    "",
    "  lume init [--layout=...] [--tema=...] [--substituir=...]  adota o lume, uma etapa por chamada (JSON para o agente)",
    "  lume check [--path=<pasta>] [--json]          confere o projeto; sai 1 se houver violação",
    "  lume prompt                                   o texto para colar no seu agente",
    "  lume <comando> --help                         as opções de cada comando",
    "",
    PROMPT,
    "",
  ].join("\n");
}

async function main() {
  if (pediuAjuda && AJUDA[comando]) {
    process.stdout.write(`${AJUDA[comando].join("\n")}\n`);
    return 0;
  }
  if (comando === "init") {
    const r = await passo(raiz, {
      versao,
      layout: argumento("layout"),
      tema: argumento("tema"),
      substituir: argumento("substituir"),
      confirmarTroca: argumento("confirmar-troca"),
      atualizar: argumento("atualizar"),
    });
    process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
    return 0;
  }
  if (comando === "check") {
    const caminhos = argumento("path")
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const r = await conferir(raiz, {
      versao: argumento("versao"),
      versaoPadrao: pkg.version,
      caminhos,
    });
    if (process.argv.includes("--json"))
      process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
    else process.stdout.write(`${relatorio(r)}\n`);
    return r.ok ? 0 : 1;
  }
  if (comando === "prompt") {
    process.stdout.write(`${PROMPT}\n`);
    return 0;
  }
  if (comando === "--version" || comando === "-v") {
    process.stdout.write(`${pkg.version}\n`);
    return 0;
  }
  process.stdout.write(ajudaGeral());
  return comando && comando !== "--help" && comando !== "-h" ? 2 : 0;
}

main().then(
  (codigo) => {
    process.exitCode = codigo;
  },
  (erro) => {
    process.stderr.write(`lume: ${erro.message}\n`);
    process.exitCode = 2;
  },
);
