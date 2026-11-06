// Leitura de código sem comentários, portada de scripts/check.ts: strings e
// literais de regex são copiados inteiros, então um "//" dentro de "https://"
// não vira comentário, e as quebras de linha ficam no lugar para o número da
// linha continuar certo.

function copiaString(src, inicio, q, out) {
  const n = src.length;
  let i = inicio;
  out.push(q);
  i++;
  while (i < n) {
    const ch = src[i] ?? "";
    if (ch === "\\") {
      out.push(ch, src[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (ch === q) {
      out.push(ch);
      return i + 1;
    }
    if (q === "`" && ch === "$" && src[i + 1] === "{") {
      out.push("${");
      i += 2;
      let prof = 1;
      while (i < n && prof > 0) {
        const e = src[i] ?? "";
        if (e === '"' || e === "'" || e === "`") {
          i = copiaString(src, i, e, out);
          continue;
        }
        if (e === "{") prof++;
        else if (e === "}") prof--;
        out.push(e);
        i++;
      }
      continue;
    }
    if (q !== "`" && ch === "\n") {
      out.push(ch);
      return i + 1;
    }
    out.push(ch);
    i++;
  }
  return i;
}

/** O código com os comentários trocados por espaço. */
export function semComentarios(src) {
  const out = [];
  const n = src.length;
  let i = 0;
  let ultimo = "";
  while (i < n) {
    const c = src[i] ?? "";
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      while (i < n && src[i] !== "\n") {
        out.push(" ");
        i++;
      }
      continue;
    }
    if (c === "/" && d === "*") {
      out.push("  ");
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        out.push(src[i] === "\n" ? "\n" : " ");
        i++;
      }
      out.push("  ");
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      i = copiaString(src, i, c, out);
      ultimo = c;
      continue;
    }
    if (
      c === "/" &&
      (ultimo === "" || /[(,=:[!&|?{};+\-*%<>~^]/.test(ultimo))
    ) {
      out.push(c);
      i++;
      let classe = false;
      while (i < n && src[i] !== "\n") {
        const ch = src[i] ?? "";
        if (ch === "\\") {
          out.push(ch, src[i + 1] ?? "");
          i += 2;
          continue;
        }
        if (ch === "[") classe = true;
        else if (ch === "]") classe = false;
        out.push(ch);
        i++;
        if (ch === "/" && !classe) break;
      }
      ultimo = "/";
      continue;
    }
    out.push(c);
    if (!/\s/.test(c)) ultimo = c;
    i++;
  }
  return out.join("");
}

/** CSS sem comentários de bloco, com as quebras de linha preservadas. */
export function semComentariosCss(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

/** JSON com comentários e vírgula sobrando (tsconfig, components.json). */
export function lerJsonc(texto) {
  const limpo = semComentarios(texto).replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(limpo);
}

const IMPORT_RE =
  /((?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?)(["'])([^"']+)\2|(import\(\s*)(["'])([^"']+)\5(\s*\))/g;

/**
 * O import aponta para o próprio projeto? Local é o que começa por `.`, `/`,
 * `@/`, `~/`, `#` ou por um dos `prefixos` (aliases do components.json e
 * chaves de paths do tsconfig). O resto, inclusive escopo `@x/y`, é pacote.
 */
export function importLocal(spec, prefixos = []) {
  if (/^(\.|\/|@\/|~\/|#)/.test(spec)) return true;
  return prefixos.some((p) => p && spec.startsWith(p));
}

/** Uma string entre aspas simples vira a mesma string entre aspas duplas. */
function aspasDuplas(corpo, q) {
  let saida = "";
  for (let i = 0; i < corpo.length; i++) {
    const ch = corpo[i];
    if (ch === "\\") {
      const prox = corpo[i + 1] ?? "";
      saida += prox === "'" ? "'" : `\\${prox}`;
      i++;
      continue;
    }
    saida += ch === '"' && q === "'" ? '\\"' : ch;
  }
  return `"${saida}"`;
}

/**
 * Tokens que o formatador troca sem mudar o código: aspas simples viram
 * duplas, sai o `;` do fim da instrução e a vírgula antes de `)`, `]` e `}`,
 * e some o espaço em volta de pontuação. Template e regex ficam como estão.
 */
function semFormatacao(src) {
  const out = [];
  const n = src.length;
  let i = 0;
  let ultimo = "";
  while (i < n) {
    const c = src[i] ?? "";
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== "\n") {
        j += src[j] === "\\" ? 2 : 1;
      }
      out.push(aspasDuplas(src.slice(i + 1, j), c));
      i = j + 1;
      ultimo = c;
      continue;
    }
    if (c === "`") {
      const parte = [];
      i = copiaString(src, i, c, parte);
      out.push(parte.join(""));
      ultimo = c;
      continue;
    }
    if (
      c === "/" &&
      (ultimo === "" || /[(,=:[!&|?{};+\-*%<>~^]/.test(ultimo))
    ) {
      let j = i + 1;
      let classe = false;
      while (j < n && src[j] !== "\n") {
        const ch = src[j];
        if (ch === "\\") {
          j += 2;
          continue;
        }
        if (ch === "[") classe = true;
        else if (ch === "]") classe = false;
        j++;
        if (ch === "/" && !classe) break;
      }
      out.push(src.slice(i, j));
      i = j;
      ultimo = "/";
      continue;
    }
    out.push(c);
    if (!/\s/.test(c)) ultimo = c;
    i++;
  }
  return out
    .join("")
    .replace(/;[ \t]*(?=\n|$)/g, "")
    .replace(/;(\s*[}])/g, "$1")
    .replace(/,(\s*[)\]}])/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s*([(){}[\],;])\s*/g, "$1")
    .trim();
}

/**
 * Forma comparável de um arquivo da registry: sem comentários, sem a diretiva
 * "use client" (a CLI do shadcn tira quando rsc é false), com cada import
 * local reduzido ao nome do arquivo (a CLI reescreve o caminho pelos aliases
 * do projeto) e sem o que o formatador muda (aspas, `;`, vírgula final e
 * espaços). `prefixos` são os aliases do projeto que contam como import local.
 */
export function normalizar(src, prefixos = []) {
  const reduzido = semComentarios(src)
    .replace(/^\s*["']use client["'];?\s*$/gm, "")
    .replace(IMPORT_RE, (todo, a1, q1, s1, a2, q2, s2, f2) => {
      const spec = s1 ?? s2;
      if (!importLocal(spec, prefixos)) return todo;
      const nome = spec.split("/").pop();
      return s1 !== undefined
        ? `${a1}${q1}@/${nome}${q1}`
        : `${a2}${q2}@/${nome}${q2}${f2}`;
    });
  return semFormatacao(reduzido);
}

/** Número da linha (1-based) de um índice no texto. */
export function linhaDe(texto, indice) {
  let n = 1;
  for (let i = 0; i < indice && i < texto.length; i++) {
    if (texto[i] === "\n") n++;
  }
  return n;
}
