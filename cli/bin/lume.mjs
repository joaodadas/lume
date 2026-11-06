#!/usr/bin/env node
// lume: adoção do lume por agente.
//   lume init [--layout=sidebar|offcanvas|topbar] [--atualizar=sim|nao]
//                                                   uma etapa por chamada, em JSON
//   lume check [--json]                             confere o projeto; sai 1 se houver violação
//   lume prompt                                     o texto para colar no agente

import { readFileSync } from "node:fs";
import { conferir, relatorio } from "../src/check.mjs";
import { passo } from "../src/init.mjs";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const PROMPT = `Aplique o lume neste projeto: rode \`npx -y @joaodadas/lume@latest init\` e siga exatamente o que ele responder, uma etapa por vez, até o \`next\` ser \`pronto\`.`;

function argumento(nome) {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`));
  return a ? a.slice(nome.length + 3) : undefined;
}

const comando = process.argv[2];
const versao = argumento("versao") ?? process.env.LUME_VERSAO ?? pkg.version;
const raiz = argumento("dir") ?? process.cwd();

async function main() {
  if (comando === "init") {
    const r = await passo(raiz, {
      versao,
      layout: argumento("layout"),
      atualizar: argumento("atualizar"),
    });
    process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
    return 0;
  }
  if (comando === "check") {
    const r = await conferir(raiz, {
      versao: argumento("versao"),
      versaoPadrao: pkg.version,
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
  process.stdout.write(
    [
      `lume ${pkg.version}`,
      "",
      "  lume init [--layout=sidebar|offcanvas|topbar] [--atualizar=sim|nao]  adota o lume, uma etapa por chamada (JSON para o agente)",
      "  lume check [--json]                            confere o projeto; sai 1 se houver violação",
      "  lume prompt                                    o texto para colar no seu agente",
      "",
      PROMPT,
      "",
    ].join("\n"),
  );
  return comando ? 2 : 0;
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
