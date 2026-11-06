// Leitura do projeto que vai adotar (ou já adotou) o lume. Só lê: nada aqui
// grava arquivo.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { lerJsonc } from "./texto.mjs";

export const LAYOUTS = ["sidebar", "offcanvas", "topbar"];

const PULAR = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
  ".vercel",
  ".agents",
  ".claude",
]);

function lerArquivoJson(arquivo) {
  if (!existsSync(arquivo)) return null;
  try {
    return lerJsonc(readFileSync(arquivo, "utf8"));
  } catch {
    return { __invalido: true };
  }
}

/** Lista recursiva de arquivos (caminhos relativos à raiz, com /). */
export function listar(raiz, rel = "", acc = []) {
  const dir = path.join(raiz, rel);
  let entradas = [];
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entradas) {
    if (PULAR.has(e.name)) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) listar(raiz, r, acc);
    else if (e.isFile()) acc.push(r);
  }
  return acc;
}

function lerTsconfig(raiz) {
  return (
    lerArquivoJson(path.join(raiz, "tsconfig.json")) ??
    lerArquivoJson(path.join(raiz, "jsconfig.json"))
  );
}

/** Os paths do tsconfig já resolvidos pelo baseUrl: { "@/": "src/" }. */
export function pathsDoTsconfig(raiz) {
  const opcoes = lerTsconfig(raiz)?.compilerOptions ?? {};
  const base = typeof opcoes.baseUrl === "string" ? opcoes.baseUrl : ".";
  const saida = {};
  for (const [chave, alvos] of Object.entries(opcoes.paths ?? {})) {
    if (!chave.endsWith("/*") || !Array.isArray(alvos) || !alvos[0]) continue;
    const alvo = String(alvos[0]).replace(/\*$/, "");
    const junto = path.posix.normalize(path.posix.join(base, alvo || "."));
    const rel =
      junto === "." || junto === "./" ? "" : junto.replace(/^\.\//, "");
    saida[chave.slice(0, -1)] = rel && !rel.endsWith("/") ? `${rel}/` : rel;
  }
  return saida;
}

/**
 * Pasta do código do app: o alvo de `@/*` no tsconfig (com baseUrl). Só sem
 * esse path cai em `src/` quando a pasta existe.
 */
export function prefixoDoApp(raiz) {
  const paths = pathsDoTsconfig(raiz);
  if ("@/" in paths) return paths["@/"];
  const src = path.join(raiz, "src");
  return existsSync(src) && statSync(src).isDirectory() ? "src/" : "";
}

/** "@/components/ui" vira "src/components/ui" pelos paths do tsconfig. */
export function resolverAlias(alias, raiz, prefixoPadrao) {
  if (!alias) return null;
  const paths = pathsDoTsconfig(raiz);
  const chaves = Object.keys(paths).sort((a, b) => b.length - a.length);
  for (const de of chaves) {
    if (!alias.startsWith(de)) continue;
    return `${paths[de]}${alias.slice(de.length)}`.replace(/\/$/, "");
  }
  if (alias.startsWith("@/") || alias.startsWith("~/")) {
    return `${prefixoPadrao}${alias.slice(2)}`;
  }
  return alias;
}

/**
 * Prefixos de import que apontam para o próprio projeto: os dos aliases do
 * components.json (`#/`, `@app/`) e as chaves de paths do tsconfig.
 */
function prefixosLocais(raiz, aliases) {
  const saida = new Set(Object.keys(pathsDoTsconfig(raiz)));
  for (const valor of Object.values(aliases ?? {})) {
    if (typeof valor !== "string") continue;
    const m = /^([^/]+\/)/.exec(valor);
    if (m) saida.add(m[1]);
  }
  return [...saida].filter((p) => !p.startsWith("."));
}

function versaoMaior(spec) {
  const m = /(\d+)/.exec(String(spec ?? ""));
  return m ? Number(m[1]) : null;
}

function gitSujo(raiz) {
  try {
    const saida = execFileSync("git", ["status", "--porcelain"], {
      cwd: raiz,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return saida.split("\n").filter(Boolean).length;
  } catch {
    return null;
  }
}

/** Tudo o que o init e o check precisam saber do projeto. */
export function lerProjeto(raiz) {
  const pkg = lerArquivoJson(path.join(raiz, "package.json"));
  const deps = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
  };
  const framework = deps.next ? "next" : deps.vite ? "vite" : null;
  const tailwind =
    versaoMaior(deps.tailwindcss) ??
    (deps["@tailwindcss/postcss"] || deps["@tailwindcss/vite"] ? 4 : null);
  const prefixo = prefixoDoApp(raiz);
  const componentsJson = lerArquivoJson(path.join(raiz, "components.json"));
  const lumeJson = lerArquivoJson(path.join(raiz, "lume.json"));
  const aliases = componentsJson?.aliases ?? {};
  const dirUi = resolverAlias(aliases.ui ?? "@/components/ui", raiz, prefixo);
  const dirComponentes = resolverAlias(
    aliases.components ?? "@/components",
    raiz,
    prefixo,
  );
  const dirHooks = resolverAlias(aliases.hooks ?? "@/hooks", raiz, prefixo);
  const dirLib = resolverAlias(aliases.lib ?? "@/lib", raiz, prefixo);
  const candidatosCss = [
    componentsJson?.tailwind?.css,
    `${prefixo}app/globals.css`,
    "app/globals.css",
    `${prefixo}index.css`,
    `${prefixo}styles/globals.css`,
  ].filter(Boolean);
  const css = candidatosCss.find((c) => existsSync(path.join(raiz, c))) ?? null;
  return {
    raiz,
    pkg,
    deps,
    framework,
    tailwind,
    prefixo,
    componentsJson,
    lumeJson,
    dirUi,
    dirComponentes,
    dirHooks,
    dirLib,
    prefixosLocais: prefixosLocais(raiz, aliases),
    css,
    alteracoesGit: gitSujo(raiz),
  };
}

/** Aponta para a registry do lume (adoção, mesmo que pela metade)? */
export function adotouLume(projeto) {
  if (projeto.lumeJson) return true;
  const texto = JSON.stringify(projeto.componentsJson ?? {});
  return /joaodadas\/lume|lume-ashmont/.test(texto);
}
