// O plano da migração: a ordem em que o agente reescreve o projeto. Primeiro
// a configuração, depois o que os layouts importam (com isso o app volta a
// abrir), depois tela por tela, e por último a limpeza do que é antigo.

import path from "node:path";
import { alcancaveis } from "./imports.mjs";

const CODIGO = /\.(tsx?|jsx?|mjs|cjs)$/;
const LAYOUT = /(^|\/)layout\.(tsx|jsx|ts|js)$/;
const PASTAS_DE_TELA = /^(pages|routes|features|screens|views)\//;

/** Regras que não são de um arquivo de tela, e o grupo de cada uma. */
const GRUPO_DA_REGRA = (regra) => {
  if (/^(config|css)\//.test(regra) || regra === "ui/editado") return "config";
  if (
    regra === "ui/fora-da-registry" ||
    regra === "ui/paralelo" ||
    regra === "deps/proibida"
  )
    return "limpeza";
  return null;
};

const SEGMENTO_SEM_ROTA = /^(\(.*\)|@.*)$/;

/**
 * A pasta de rota de um arquivo em app/: a pasta logo abaixo do layout mais
 * fundo que o contém, pulando grupos de rota `(x)` e slots `@x`. Arquivo solto
 * na pasta do layout fica com o próprio caminho.
 */
function pastaDeRota(rel, dirApp, dirsDeLayout) {
  const pastas = path.posix.dirname(rel).split("/");
  const minimo = dirApp.split("/").length;
  let layout = dirApp;
  for (let k = pastas.length; k >= minimo; k--) {
    const d = pastas.slice(0, k).join("/");
    if (dirsDeLayout.has(d)) {
      layout = d;
      break;
    }
  }
  const resto = pastas.slice(layout.split("/").length);
  let k = 0;
  while (k < resto.length && SEGMENTO_SEM_ROTA.test(resto[k])) k++;
  if (k >= resto.length) return rel;
  return [layout, ...resto.slice(0, k + 1)].join("/");
}

/** A pasta de tela num projeto sem app/ (Vite): pages/x, routes/x, features/x. */
function pastaDeTelaVite(rel, prefixo) {
  const sem = rel.slice(prefixo.length);
  if (!PASTAS_DE_TELA.test(sem)) return null;
  const partes = sem.split("/");
  return partes.length > 2 ? `${prefixo}${partes.slice(0, 2).join("/")}` : rel;
}

const aspas = (c) => (/^[\w./@-]+$/.test(c) ? c : `'${c}'`);

/**
 * Monta o plano a partir das violações do check e do grafo de imports.
 * `comandoCheck` é o `lume check` fixado na versão do projeto.
 */
export function montarPlano({ projeto, violacoes, grafo }, comandoCheck) {
  const porArquivo = new Map();
  const fixos = { config: [], limpeza: [] };
  for (const v of violacoes) {
    const grupo = GRUPO_DA_REGRA(v.regra);
    if (grupo) fixos[grupo].push(v);
    else porArquivo.set(v.arquivo, (porArquivo.get(v.arquivo) ?? 0) + 1);
  }
  const prefixo = projeto.prefixo ?? "";
  const dirApp = `${prefixo}app`;
  const arquivos = [...grafo.keys()];
  const ehNext = projeto.framework !== "vite";
  const telaDe = (rel) => {
    if (ehNext) {
      if (!rel.startsWith(`${dirApp}/`) || LAYOUT.test(rel)) return null;
      return pastaDeRota(rel, dirApp, dirsDeLayout);
    }
    return pastaDeTelaVite(rel, prefixo);
  };
  const layouts = arquivos
    .filter((r) => ehNext && r.startsWith(`${dirApp}/`) && LAYOUT.test(r))
    .sort((a, b) => a.split("/").length - b.split("/").length);
  const dirsDeLayout = new Set(layouts.map((l) => path.posix.dirname(l)));
  const raizes = ehNext
    ? [...layouts, ...arquivos.filter((r) => /(^|\/)pages\/_app\./.test(r))]
    : arquivos.filter((r) =>
        new RegExp(`^${prefixo}(main|App|app)\\.(tsx|jsx|ts|js)$`).test(r),
      );

  const atribuidos = new Set();
  const grupos = [];
  const novoGrupo = (tipo, pasta, lista, paths) => {
    const comViolacao = lista.filter(
      (r) => porArquivo.has(r) && !atribuidos.has(r),
    );
    if (comViolacao.length === 0) return;
    for (const r of comViolacao) atribuidos.add(r);
    const caminhos = paths ?? comViolacao;
    grupos.push({
      tipo,
      pasta,
      violacoes: comViolacao.reduce((n, r) => n + porArquivo.get(r), 0),
      arquivos: comViolacao.map((r) => `${r} (${porArquivo.get(r)})`),
      check: `${comandoCheck} --path=${caminhos.map(aspas).join(",")}`,
    });
  };

  if (fixos.config.length > 0) {
    const nomes = [...new Set(fixos.config.map((v) => v.arquivo))];
    grupos.push({
      tipo: "config",
      pasta: null,
      violacoes: fixos.config.length,
      arquivos: nomes.map(
        (a) => `${a} (${fixos.config.filter((v) => v.arquivo === a).length})`,
      ),
      check: `${comandoCheck} --path=${nomes.map(aspas).join(",")}`,
    });
  }

  novoGrupo(
    "layout",
    null,
    alcancaveis(grafo, raizes, (r) => telaDe(r) !== null),
  );

  const telas = new Map();
  for (const rel of arquivos) {
    const pasta = telaDe(rel);
    if (!pasta) continue;
    if (!telas.has(pasta)) telas.set(pasta, []);
    telas.get(pasta).push(rel);
  }
  for (const pasta of [...telas.keys()].sort()) {
    const proprios = telas.get(pasta);
    const lista = alcancaveis(grafo, proprios);
    const fora = lista.filter(
      (r) => !proprios.includes(r) && porArquivo.has(r) && !atribuidos.has(r),
    );
    novoGrupo("tela", pasta, lista, [pasta, ...fora]);
  }

  novoGrupo(
    "resto",
    null,
    [...porArquivo.keys()].filter((r) => CODIGO.test(r)).sort(),
  );

  if (fixos.limpeza.length > 0) {
    const nomes = [...new Set(fixos.limpeza.map((v) => v.arquivo))];
    grupos.push({
      tipo: "limpeza",
      pasta: null,
      violacoes: fixos.limpeza.length,
      arquivos: fixos.limpeza.map(
        (v) => `${v.arquivo}${v.trecho ? `: ${v.trecho}` : ""} (${v.regra})`,
      ),
      check: `${comandoCheck} --path=${nomes.map(aspas).join(",")}`,
    });
  }
  return grupos.map((g, i) => ({ ordem: i + 1, ...g }));
}
