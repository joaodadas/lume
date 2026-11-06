// Imports locais do projeto: quem importa quem. Serve à regra
// codigo/import-antigo e ao plano da migração, que segue os imports a partir
// dos layouts.

import path from "node:path";
import { pathsDoTsconfig } from "./projeto.mjs";

const IMPORT =
  /(?:^|[^\w$.])(?:(?:import|export)\s+(?:type\s+)?(?:[\w$*{}\s,]+?\s+from\s+)?(["'])([^"'\n]+)\1|(?:import|require)\s*\(\s*(["'])([^"'\n]+)\3\s*\))/g;

/**
 * Os imports de um código já sem comentários, com o índice da palavra
 * `import`, `export` ou `require`: [{ spec, indice }].
 */
export function importsDe(codigo) {
  const saida = [];
  for (const m of codigo.matchAll(IMPORT)) {
    const desloc = m[0].search(/import|export|require/);
    saida.push({ spec: m[2] ?? m[4], indice: m.index + desloc });
  }
  return saida;
}

const EXTENSOES = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"];

/**
 * Resolve um import para um arquivo do projeto, pelo caminho relativo ou
 * pelos paths do tsconfig. Devolve `{ rel, existe }`, ou null para pacote.
 * Sem arquivo, `rel` é o caminho sem extensão (o import aponta para algo
 * que não existe mais).
 */
export function criarResolvedor(raiz, arquivos) {
  const existe = new Set(arquivos);
  const paths = pathsDoTsconfig(raiz);
  const chaves = Object.keys(paths).sort((a, b) => b.length - a.length);
  const base = (de, spec) => {
    if (/^\.\.?(\/|$)/.test(spec)) {
      return path.posix.normalize(
        path.posix.join(path.posix.dirname(de), spec),
      );
    }
    for (const chave of chaves) {
      if (!spec.startsWith(chave)) continue;
      return path.posix
        .normalize(`${paths[chave]}${spec.slice(chave.length)}`)
        .replace(/^\.\//, "");
    }
    return null;
  };
  return (de, spec) => {
    const b = base(de, spec);
    if (b === null) return null;
    if (existe.has(b)) return { rel: b, existe: true };
    for (const ext of EXTENSOES) {
      if (existe.has(`${b}${ext}`)) return { rel: `${b}${ext}`, existe: true };
    }
    for (const ext of EXTENSOES) {
      if (existe.has(`${b}/index${ext}`))
        return { rel: `${b}/index${ext}`, existe: true };
    }
    return { rel: b, existe: false };
  };
}

/** Busca em largura no grafo `Map<arquivo, arquivo[]>`, a partir de `raizes`. */
export function alcancaveis(grafo, raizes, parar = () => false) {
  const vistos = new Set();
  const ordem = [];
  const fila = [...raizes];
  while (fila.length > 0) {
    const atual = fila.shift();
    if (vistos.has(atual) || !grafo.has(atual)) continue;
    vistos.add(atual);
    ordem.push(atual);
    for (const proximo of grafo.get(atual)) {
      if (!vistos.has(proximo) && !parar(proximo)) fila.push(proximo);
    }
  }
  return ordem;
}
