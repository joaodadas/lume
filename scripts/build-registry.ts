// Gera registry.json a partir de registry/items.ts.
//
// uso: bun scripts/build-registry.ts [--check]
//
// Para cada item lê os arquivos, extrai os imports e classifica:
// - "@/registry/base-vega/..." vira registryDependencies no item dono do
//   arquivo, no endereço completo joaodadas/lume/<item>#v<versão>;
// - pacote npm vira dependencies (react, react-dom e next ficam de fora;
//   PINS fixa a faixa de versão quando preciso);
// - relativo precisa ficar dentro do mesmo item.
// O item base recebe cssVars (theme, light, dark) lidos de globals.css.
// Com --check não grava: compara com o registry.json commitado e falha se
// estiver desatualizado.

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  GROUP_ORDER,
  type ItemFile,
  type ItemMeta,
  items,
  PINS,
} from "../registry/items";

const ROOT = path.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const pkg = JSON.parse(
  await readFile(path.join(ROOT, "package.json"), "utf8"),
) as {
  version: string;
};
const TAG = `v${pkg.version}`;
const OWNER = "joaodadas/lume";
const SKIP_PACKAGES = new Set(["react", "react-dom", "next"]);

const REGISTRY_PREFIX = "@/registry/base-vega/";

function fail(msg: string): never {
  console.error(`build-registry: ${msg}`);
  process.exit(1);
}

function defaultFiles(item: ItemMeta): ItemFile[] {
  if (item.files) return item.files;
  return [];
}

// dono de cada arquivo (caminho relativo à raiz, sem extensão e com)
const ownerByFile = new Map<string, string>();
for (const item of items) {
  for (const f of defaultFiles(item)) {
    if (!existsSync(path.join(ROOT, f.path)))
      fail(`${item.name}: arquivo não existe: ${f.path}`);
    if (ownerByFile.has(f.path)) fail(`${f.path} pertence a dois itens`);
    ownerByFile.set(f.path, item.name);
  }
}

const names = new Set(items.map((i) => i.name));
for (const item of items) {
  if (items.filter((i) => i.name === item.name).length > 1)
    fail(`item duplicado: ${item.name}`);
}

function packageName(specifier: string): string {
  const parts = specifier.split("/");
  return specifier.startsWith("@")
    ? `${parts[0]}/${parts[1]}`
    : (parts[0] ?? specifier);
}

function ownerOfImport(specifier: string, from: string): string {
  const rel = specifier.slice(REGISTRY_PREFIX.length); // ui/button
  const base = `registry/base-vega/${rel}`;
  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}/index.tsx`,
    `${base}/index.ts`,
  ]) {
    const owner = ownerByFile.get(candidate);
    if (owner) return owner;
  }
  return fail(`${from}: import interno sem item dono: ${specifier}`);
}

const IMPORT_RE =
  /(?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

async function analyze(item: ItemMeta) {
  const deps = new Set<string>();
  const regDeps = new Set<string>();
  for (const f of defaultFiles(item)) {
    const content = await readFile(path.join(ROOT, f.path), "utf8");
    for (const m of content.matchAll(IMPORT_RE)) {
      const spec = m[1] ?? m[2];
      if (!spec) continue;
      if (spec.startsWith(REGISTRY_PREFIX)) {
        const owner = ownerOfImport(spec, f.path);
        if (owner !== item.name) regDeps.add(owner);
        continue;
      }
      if (spec.startsWith("@/"))
        fail(`${f.path}: import @/ fora da registry: ${spec}`);
      if (spec.startsWith(".")) {
        const target = path.posix.normalize(
          path.posix.join(path.posix.dirname(f.path), spec),
        );
        const owner = [
          target,
          `${target}.tsx`,
          `${target}.ts`,
          `${target}/index.tsx`,
        ]
          .map((c) => ownerByFile.get(c))
          .find(Boolean);
        if (owner && owner !== item.name)
          fail(
            `${f.path}: import relativo cruza itens (${spec} é de ${owner}); use @/registry/...`,
          );
        if (!owner)
          fail(
            `${f.path}: import relativo para arquivo fora da registry: ${spec}`,
          );
        continue;
      }
      if (spec.startsWith("node:")) continue;
      const name = packageName(spec);
      if (SKIP_PACKAGES.has(name)) {
        if (name === "next" && !item.nextOnly)
          fail(`${f.path}: importa next/* sem nextOnly`);
        continue;
      }
      deps.add(PINS[name] ? `${name}@${PINS[name]}` : name);
    }
  }
  for (const d of item.dependencies ?? []) {
    const name = packageName(d.replace(/@[^@/]+$/, ""));
    for (const existing of deps)
      if (packageName(existing.replace(/@[^@/]+$/, "")) === name)
        deps.delete(existing);
    deps.add(d);
  }
  for (const r of item.registryDependencies ?? []) regDeps.add(r);
  return { deps: [...deps].sort(), regDeps: [...regDeps].sort() };
}

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function block(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) fail(`globals.css: bloco não encontrado: ${selector}`);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(css.indexOf("{", start) + 1, i);
    }
  }
  return fail(`globals.css: bloco sem fechamento: ${selector}`);
}

function declarations(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of body.split(";")) {
    const idx = decl.indexOf(":");
    if (idx < 0) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl
      .slice(idx + 1)
      .replace(/\s+/g, " ")
      .trim();
    if (!prop.startsWith("--")) continue;
    out[prop.slice(2)] = value;
  }
  return out;
}

async function baseCssVars() {
  const css = stripComments(
    await readFile(
      path.join(ROOT, "registry/base-vega/styles/globals.css"),
      "utf8",
    ),
  );
  const light = declarations(block(css, ":root"));
  const dark = declarations(block(css, ".dark"));
  const theme = declarations(block(css, "@theme inline"));
  const shadows = (vars: Record<string, string>) =>
    Object.keys(vars).filter(
      (k) => k.startsWith("custom-shadow") || k === "custom-outline-shadow",
    );
  if (shadows(light).length !== 17 || shadows(dark).length !== 17)
    fail(
      `esperava 17 tokens de sombra por tema (16 custom-shadow* + custom-outline-shadow); light=${shadows(light).length} dark=${shadows(dark).length}`,
    );
  for (const k of Object.keys({ ...light, ...dark }))
    if (k.startsWith("sidebar-primary") || k === "custom-shadow-slate")
      fail(`token removido ainda presente: ${k}`);
  if (!theme["font-mono"]) fail("@theme inline sem --font-mono");
  return { theme, light, dark };
}

function registryType(item: ItemMeta) {
  if (item.type) return item.type;
  switch (item.group) {
    case "ui":
      return "registry:ui";
    case "lib":
      return "registry:lib";
    case "hooks":
      return "registry:hook";
    case "kits":
      return "registry:block";
    default:
      return "registry:component";
  }
}

const out: Record<string, unknown>[] = [];
const sorted = [...items].sort(
  (a, b) =>
    GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) ||
    a.name.localeCompare(b.name),
);

for (const item of sorted) {
  const { deps, regDeps } = await analyze(item);
  for (const r of regDeps) {
    const local = !r.includes("/") && !r.startsWith("@");
    if (local && !names.has(r))
      fail(`${item.name}: registryDependency desconhecida: ${r}`);
  }
  const entry: Record<string, unknown> = {
    name: item.name,
    type: registryType(item),
    title: item.title,
    description: item.description,
  };
  if (item.extends) entry.extends = item.extends;
  if (item.config) entry.config = item.config;
  if (item.categories) entry.categories = item.categories;
  if (deps.length) entry.dependencies = deps;
  if (item.devDependencies?.length)
    entry.devDependencies = item.devDependencies;
  if (regDeps.length)
    entry.registryDependencies = regDeps.map((r) =>
      !r.includes("/") && !r.startsWith("@") ? `${OWNER}/${r}#${TAG}` : r,
    );
  const files = defaultFiles(item).map((f) => ({
    path: f.path,
    type: f.type ?? registryType(item),
    ...(f.target ? { target: f.target } : {}),
  }));
  if (files.length) entry.files = files;
  const cssVars = item.name === "base" ? await baseCssVars() : item.cssVars;
  if (cssVars) entry.cssVars = cssVars;
  if (item.css) entry.css = item.css;
  if (item.docs) entry.docs = item.docs;
  entry.meta = {
    group: item.group,
    tier: item.tier ?? "core",
    ...(item.nextOnly ? { nextOnly: true } : {}),
  };
  out.push(entry);
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "lume",
  homepage: "https://lume-ashmont.vercel.app",
  items: out,
};
const json = `${JSON.stringify(registry, null, 2)}\n`;
const target = path.join(ROOT, "registry.json");

if (check) {
  const current = existsSync(target) ? await readFile(target, "utf8") : "";
  if (current !== json)
    fail("registry.json desatualizado; rode bun run registry:build");
  console.log(`registry.json em dia (${out.length} itens, ${TAG})`);
} else {
  await writeFile(target, json);
  console.log(`registry.json gerado: ${out.length} itens, tag ${TAG}`);
}
