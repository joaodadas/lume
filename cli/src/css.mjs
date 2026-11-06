// O CSS global do lume, escrito pelo próprio init a partir do item base da
// versão (o mesmo que o shadcn init escreve num projeto novo), e a conta do
// que saiu do CSS antigo: tokens e classes próprias, com o uso de cada um no
// código.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { semComentarios, semComentariosCss, soTextos } from "./texto.mjs";

export const SUFIXO_ANTIGO = ".antes-do-lume";

const COR =
  /^(?:#[0-9a-f]{3,8}|(?:oklch|oklab|hsla?|rgba?|lab|lch|hwb|color)\()/i;

function regras(saida, chave, valor, nivel) {
  const pad = "  ".repeat(nivel);
  if (typeof valor === "string") {
    saida.push(`${pad}${chave}: ${valor};`);
    return;
  }
  if (Object.keys(valor ?? {}).length === 0) {
    saida.push(`${pad}${chave};`);
    return;
  }
  saida.push(`${pad}${chave} {`);
  for (const [k, v] of Object.entries(valor)) regras(saida, k, v, nivel + 1);
  saida.push(`${pad}}`);
}

/**
 * O CSS global que o `shadcn init` do item base escreve num projeto novo, na
 * mesma ordem: o import do Tailwind e os do item, os plugins, o
 * `@custom-variant dark`, o `@theme inline` (com as variáveis que não são cor
 * e os keyframes dentro, como o shadcn faz), `:root`, `.dark` e o resto do
 * `css` do item. `tailwind` troca a linha do import do Tailwind (para manter
 * `source(...)` ou `prefix(...)`), e `sources` são as linhas `@source` do CSS
 * antigo, que dizem ao Tailwind onde procurar classe.
 */
export function cssDaBase(base, opcoes = {}) {
  const tailwind = opcoes.tailwind ?? '@import "tailwindcss";';
  const cssVars = base.cssVars ?? {};
  const tema = cssVars.theme ?? {};
  const claro = cssVars.light ?? {};
  const escuro = cssVars.dark ?? {};
  const css = base.css ?? {};
  const imports = [];
  const plugins = [];
  const keyframes = [];
  const fim = [];
  for (const [chave, valor] of Object.entries(css)) {
    if (chave.startsWith("@import")) imports.push(`${chave};`);
    else if (chave.startsWith("@plugin")) plugins.push(`${chave};`);
    else if (chave.startsWith("@keyframes")) keyframes.push([chave, valor]);
    else fim.push([chave, valor]);
  }
  const saida = [tailwind, ...imports];
  if (opcoes.sources?.length) saida.push("", ...opcoes.sources);
  if (plugins.length) saida.push("", ...plugins);
  if (!fim.some(([k]) => /^@custom-variant\s+dark\b/.test(k))) {
    saida.push("", "@custom-variant dark (&:is(.dark *));");
  }
  saida.push("", "@theme inline {");
  for (const [k, v] of Object.entries(tema)) saida.push(`  --${k}: ${v};`);
  const extras = [];
  for (const k of new Set([...Object.keys(claro), ...Object.keys(escuro)])) {
    if (k === "radius") continue;
    const valor = claro[k] ?? escuro[k];
    const prop = COR.test(String(valor)) ? `color-${k}` : k;
    if (prop in tema) continue;
    extras.push(`  --${prop}: var(--${k});`);
  }
  saida.push(...extras.reverse());
  for (const [k, v] of keyframes) regras(saida, k, v, 1);
  saida.push("}");
  for (const [seletor, vars] of [
    [":root", claro],
    [".dark", escuro],
  ]) {
    saida.push("", `${seletor} {`);
    for (const [k, v] of Object.entries(vars)) saida.push(`  --${k}: ${v};`);
    saida.push("}");
  }
  for (const [k, v] of fim) {
    saida.push("");
    regras(saida, k, v, 0);
  }
  return `${saida.join("\n")}\n`;
}

/** Variáveis CSS declaradas no texto (`--x: ...`). */
export function variaveisDoCss(css) {
  const saida = new Set();
  for (const m of semComentariosCss(css).matchAll(
    /(?:^|[\s;{])(--[\w-]+)\s*:/g,
  ))
    saida.add(m[1]);
  return saida;
}

/** Classes com regra própria no texto (`.btn`, `.page-header`). */
export function classesDoCss(css) {
  const saida = new Set();
  const limpo = semComentariosCss(css);
  for (const m of limpo.matchAll(/([^{};]+)\{/g)) {
    const seletor = m[1].trim();
    if (seletor.startsWith("@")) continue;
    for (const c of seletor.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) saida.add(c[1]);
  }
  return saida;
}

/** O CSS global e os que ele importa por caminho relativo, como texto. */
function cadeia(raiz, rel, vistos = new Set()) {
  if (vistos.has(rel) || !existsSync(path.join(raiz, rel))) return [];
  vistos.add(rel);
  const texto = readFileSync(path.join(raiz, rel), "utf8");
  const saida = [{ rel, texto }];
  for (const m of semComentariosCss(texto).matchAll(
    /@import\s+["'](\.{1,2}\/[^"']+\.css)["']/g,
  )) {
    const proximo = path.posix.normalize(
      path.posix.join(path.posix.dirname(rel), m[1]),
    );
    saida.push(...cadeia(raiz, proximo, vistos));
  }
  return saida;
}

// O tema padrão do Tailwind 4, para quando o projeto não tem o
// node_modules/tailwindcss/theme.css: a variável que ele define continua
// valendo depois que o CSS antigo sai (a classe só volta ao valor padrão).
const PADRAO_DO_TAILWIND =
  /^--(?:color-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe)-\d+|color-(?:black|white)|font-(?:sans|serif|mono)|font-weight-[\w-]+|text-(?:xs|sm|base|lg|xl|[2-9]xl)(?:--line-height)?|tracking-[\w-]+|leading-[\w-]+|radius-(?:xs|sm|md|lg|xl|[2-4]xl)|shadow-(?:2xs|xs|sm|md|lg|xl|2xl)|inset-shadow-[\w-]+|drop-shadow-[\w-]+|text-shadow-[\w-]+|blur-[\w-]+|perspective-[\w-]+|aspect-video|ease-[\w-]+|animate-(?:spin|ping|pulse|bounce)|breakpoint-[\w-]+|container-[\w-]+|spacing|default-[\w-]+)$/;

/** As variáveis que o tema padrão do Tailwind instalado no projeto define. */
export function doTemaDoTailwind(raiz) {
  const tema = path.join(raiz ?? "", "node_modules/tailwindcss/theme.css");
  if (raiz && existsSync(tema)) {
    const vars = variaveisDoCss(readFileSync(tema, "utf8"));
    return (v) => vars.has(v);
  }
  return (v) => PADRAO_DO_TAILWIND.test(v);
}

const PREFIXOS_COR =
  "bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|fill|stroke|outline|divide|from|via|to|decoration|placeholder|caret|accent|shadow";

/** Como uma variável do tema vira classe: `--color-x` em `bg-x`, `--font-x` em `font-x`. */
function prefixoDaClasse(variavel) {
  if (variavel.startsWith("--color-")) return `(?:${PREFIXOS_COR})`;
  if (variavel.startsWith("--font-")) return "font";
  if (variavel.startsWith("--radius-")) return "rounded(?:-[a-z]{1,2})?";
  if (variavel.startsWith("--shadow-")) return "shadow";
  if (variavel.startsWith("--animate-")) return "animate";
  if (variavel.startsWith("--text-")) return "text";
  return null;
}

const nomeDoToken = (variavel) =>
  variavel
    .replace(/^--(?:color|font|radius|shadow|animate|text)-/, "--")
    .slice(2);

// Fronteira de classe numa lista de classes: espaço antes (ou `:` de variant,
// `!` de important) e espaço depois. Caminho de import (`ui/page-header`) e
// nome com hífen não contam.
const ANTES = "(?<![^\\s:!])";
const DEPOIS = "(?![^\\s!])";

const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

function contar(mapa, nome, arquivo) {
  if (!mapa.has(nome)) mapa.set(nome, { usos: 0, arquivos: new Set() });
  const item = mapa.get(nome);
  item.usos++;
  item.arquivos.add(arquivo);
}

/**
 * O que saiu do CSS antigo e quanto o código usa: tokens (variáveis que
 * viram classe ou `var()`) e classes utilitárias próprias. `codigo` e `css`
 * são listas de { rel, texto } onde contar.
 */
export function removidos(antigo, novo, { codigo, css, doTailwind }) {
  const novasVars = variaveisDoCss(novo);
  const novasClasses = classesDoCss(novo);
  const padrao = doTailwind ?? doTemaDoTailwind();
  const vars = [...variaveisDoCss(antigo)].filter(
    (v) => !novasVars.has(v) && !padrao(v),
  );
  const classes = [...classesDoCss(antigo)].filter(
    (c) => !novasClasses.has(c) && c !== "dark" && c !== "light",
  );
  const tokens = new Map();
  for (const v of vars) {
    const nome = nomeDoToken(v);
    if (!tokens.has(nome)) tokens.set(nome, []);
    tokens.get(nome).push(v);
  }
  const usoToken = new Map();
  const usoClasse = new Map();
  const porPrefixo = new Map();
  for (const v of vars) {
    const prefixo = prefixoDaClasse(v);
    if (!prefixo) continue;
    if (!porPrefixo.has(prefixo)) porPrefixo.set(prefixo, new Set());
    porPrefixo.get(prefixo).add(nomeDoToken(v));
  }
  const reClasseDeToken = [...porPrefixo].map(([prefixo, nomes]) => [
    new RegExp(
      `${ANTES}${prefixo}-(${[...nomes].map(escapar).join("|")})(?:\\/[\\w.]+)?${DEPOIS}`,
      "g",
    ),
  ]);
  const varsRemovidas = new Set(vars);
  const reClasse =
    classes.length > 0
      ? new RegExp(`${ANTES}(${classes.map(escapar).join("|")})${DEPOIS}`, "g")
      : null;
  const contarVar = (texto, rel) => {
    for (const m of texto.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (varsRemovidas.has(m[1])) contar(usoToken, nomeDoToken(m[1]), rel);
    }
  };
  for (const { rel, texto } of codigo) {
    const limpo = semComentarios(texto);
    contarVar(limpo, rel);
    const strings = soTextos(limpo);
    for (const [re] of reClasseDeToken) {
      for (const m of strings.matchAll(re)) contar(usoToken, m[1], rel);
    }
    if (reClasse) {
      for (const m of strings.matchAll(reClasse)) contar(usoClasse, m[1], rel);
    }
  }
  for (const { rel, texto } of css) {
    const limpo = semComentariosCss(texto);
    contarVar(limpo, rel);
    for (const linha of limpo.matchAll(/@apply\s+([^;]+);/g)) {
      for (const [re] of reClasseDeToken) {
        for (const m of linha[1].matchAll(re)) contar(usoToken, m[1], rel);
      }
      if (reClasse) {
        for (const m of linha[1].matchAll(reClasse))
          contar(usoClasse, m[1], rel);
      }
    }
  }
  const lista = (nomes, uso, extra) =>
    nomes
      .map((nome) => ({
        nome,
        ...extra(nome),
        usos: uso.get(nome)?.usos ?? 0,
        arquivos: uso.get(nome)?.arquivos.size ?? 0,
      }))
      .sort((a, b) => b.usos - a.usos || a.nome.localeCompare(b.nome));
  return {
    tokens: lista([...tokens.keys()], usoToken, (nome) => ({
      variaveis: tokens.get(nome),
    })),
    classes: lista(classes, usoClasse, () => ({})),
  };
}

/** A linha do import do Tailwind e as linhas `@source` do CSS antigo. */
function doAntigoQueFica(antigo) {
  const limpo = semComentariosCss(antigo);
  const m = /^\s*@import\s+["']tailwindcss["']\s*([^;\n]*);/m.exec(limpo);
  const tailwind = m?.[1].trim()
    ? `@import "tailwindcss" ${m[1].trim()};`
    : undefined;
  const sources = [...limpo.matchAll(/^\s*(@source\b[^;\n]*;)/gm)].map((m) =>
    m[1].trim(),
  );
  return { tailwind, sources };
}

/**
 * Troca o CSS global pelo da base do lume, guardando o antigo em
 * `<css>.antes-do-lume` (só na primeira vez: chamar de novo não perde o
 * original), e devolve o que saiu, com o uso no código. Com `gravar: false`
 * só compara o CSS guardado com o atual. `arquivosDeCodigo` e `arquivosCss`
 * são os caminhos onde contar o uso.
 */
export function escreverCssDaBase(
  projeto,
  base,
  arquivosDeCodigo,
  arquivosCss,
  { gravar = true } = {},
) {
  const rel = projeto.css;
  const absoluto = path.join(projeto.raiz, rel);
  const relAntigo = `${rel}${SUFIXO_ANTIGO}`;
  const absAntigo = path.join(projeto.raiz, relAntigo);
  const atual = existsSync(absoluto) ? readFileSync(absoluto, "utf8") : "";
  let novo = atual;
  if (gravar) {
    const antes = existsSync(absAntigo)
      ? readFileSync(absAntigo, "utf8")
      : atual;
    novo = cssDaBase(base, doAntigoQueFica(antes));
    if (!existsSync(absAntigo) && atual.trim() && atual !== novo)
      writeFileSync(absAntigo, atual);
    if (atual !== novo) writeFileSync(absoluto, novo);
  }
  const daCadeia = existsSync(absAntigo) ? cadeia(projeto.raiz, relAntigo) : [];
  const doAntigo = new Set(daCadeia.map((c) => c.rel));
  const ler = (r) => ({
    rel: r,
    texto: readFileSync(path.join(projeto.raiz, r), "utf8"),
  });
  const saiu = removidos(daCadeia.map((c) => c.texto).join("\n"), novo, {
    codigo: arquivosDeCodigo.map(ler),
    css: arquivosCss.filter((r) => r !== rel && !doAntigo.has(r)).map(ler),
    doTailwind: doTemaDoTailwind(projeto.raiz),
  });
  return {
    css: rel,
    antigo: daCadeia.length > 0 ? relAntigo : null,
    importadosPeloAntigo: daCadeia.slice(1).map((c) => c.rel),
    ...saiu,
  };
}
