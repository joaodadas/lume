// Sincroniza os arquivos copiados verbatim do Foglamp (primitivos de
// packages/ui, o hook use-mobile e o fork do evilcharts) com a cópia local.
//
// uso: bun scripts/sync-upstream.ts [--apply] [--src <pasta do clone do foglamp>]
//
// Sem --apply só imprime o que mudaria. A pasta do clone vem de --src, da
// variável FOGLAMP_DIR ou de /tmp/foglamp (faça `git clone --depth 1
// https://github.com/foglamp-labs/foglamp /tmp/foglamp`).
//
// Para cada arquivo: reescreve os imports para @/registry/base-vega/*,
// aplica os patches fixos abaixo (correções registradas no mapa do design
// system, §21.13) e carimba o cabeçalho de atribuição exigido pela Apache-2.0
// §4(b). O resultado e a lista de origem ficam em scripts/upstream-map.json.

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const srcFlag = args.indexOf("--src");
const SRC =
  srcFlag >= 0
    ? path.resolve(args[srcFlag + 1] ?? "")
    : (process.env.FOGLAMP_DIR ?? "/tmp/foglamp");

if (!existsSync(path.join(SRC, "packages/ui/src/components"))) {
  console.error(`clone do Foglamp não encontrado em ${SRC}`);
  process.exit(1);
}

const commit = Bun.spawnSync(["git", "-C", SRC, "rev-parse", "--short", "HEAD"])
  .stdout.toString()
  .trim();

type Patch = { find: string; replace: string; note: string };

type Source = {
  // pasta de origem relativa ao clone
  from: string;
  // pasta de destino relativa à raiz do repo
  to: string;
  // extensões aceitas
  ext: string[];
  // reescritas de import aplicadas a todo arquivo da fonte
  rewrites: [RegExp, string][];
  // patches por nome de arquivo (basename)
  patches: Record<string, Patch[]>;
  // cabeçalho por arquivo
  header: (upstreamPath: string, notes: string[]) => string;
};

const uiRewrites: [RegExp, string][] = [
  [/@foglamp\/ui\/components\//g, "@/registry/base-vega/ui/"],
  [/@foglamp\/ui\/lib\//g, "@/registry/base-vega/lib/"],
  [/@foglamp\/ui\/hooks\//g, "@/registry/base-vega/hooks/"],
];

const apacheHeader = (upstreamPath: string, notes: string[]) =>
  [
    `// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, ${upstreamPath} @ ${commit}), Apache-2.0.`,
    `// Modificado por joaodadas/lume: ${["imports reescritos para @/registry/base-vega/*", ...notes].join("; ")}.`,
    "",
  ].join("\n");

const SOURCES: Source[] = [
  {
    from: "packages/ui/src/components",
    to: "registry/base-vega/ui",
    ext: [".tsx"],
    rewrites: uiRewrites,
    header: apacheHeader,
    patches: {
      "sidebar.tsx": [
        {
          find: "hsl(var(--sidebar-border))",
          replace: "var(--sidebar-border)",
          note: "hsl() removido do variant outline (os tokens são oklch, hsl(var()) é CSS inválido)",
        },
        {
          find: "hsl(var(--sidebar-accent))",
          replace: "var(--sidebar-accent)",
          note: "idem para --sidebar-accent",
        },
      ],
      "table.tsx": [
        {
          find: "border-t dark:border-[#1E1E1E] border-[#EBEBEB]",
          replace: "border-t border-border/50 dark:border-border/40",
          note: "hex do footer trocado pelos tokens de borda",
        },
        {
          find: "border-t dark:border-[#2A2A2A] border-[#EBEBEB]",
          replace: "border-t border-border/50 dark:border-border/40",
          note: "hex da caption trocado pelos tokens de borda",
        },
        {
          find: '        // "border-l border-[#EBEBEB] first:border-l-0 dark:border-[#1E1E1E]",\n',
          replace: "",
          note: "comentário com hex removido",
        },
      ],
    },
  },
  {
    from: "packages/ui/src/hooks",
    to: "registry/base-vega/hooks",
    ext: [".ts"],
    rewrites: uiRewrites,
    header: apacheHeader,
    patches: {},
  },
  {
    from: "apps/web/src/components/evilcharts",
    to: "registry/base-vega/components/evilcharts",
    ext: [".tsx", ".ts"],
    rewrites: [
      [
        /@\/components\/evilcharts\/ui\//g,
        "@/registry/base-vega/components/evilcharts/core/",
      ],
      [
        /@\/components\/evilcharts\//g,
        "@/registry/base-vega/components/evilcharts/",
      ],
      [/@\/lib\/utils/g, "@/registry/base-vega/lib/utils"],
      [/@foglamp\/ui\/lib\/utils/g, "@/registry/base-vega/lib/utils"],
      [/@foglamp\/ui\/components\//g, "@/registry/base-vega/ui/"],
    ],
    header: (upstreamPath, notes) =>
      [
        "// Evil Charts (https://evilcharts.com), MIT, (c) 2026 Gurbinder.",
        `// Vendorizado via Foglamp (https://github.com/foglamp-labs/foglamp, ${upstreamPath} @ ${commit}, Apache-2.0).`,
        `// Modificado por joaodadas/lume: ${["imports reescritos para @/registry/base-vega/*", ...notes].join("; ")}.`,
        "",
      ].join("\n"),
    patches: {},
  },
];

type MapEntry = { upstream: string; patches: string[] };
const map: { commit: string; files: Record<string, MapEntry> } = {
  commit,
  files: {},
};
let changed = 0;
let created = 0;
let same = 0;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function applyPatches(content: string, patches: Patch[], file: string) {
  let out = content;
  const notes: string[] = [];
  for (const p of patches) {
    if (!out.includes(p.find)) {
      console.error(`patch não encontrado em ${file}: ${p.find}`);
      process.exit(1);
    }
    out = out.split(p.find).join(p.replace);
    notes.push(p.note);
  }
  return { out, notes };
}

for (const source of SOURCES) {
  const fromDir = path.join(SRC, source.from);
  const files = (await walk(fromDir)).filter((f) =>
    source.ext.includes(path.extname(f)),
  );
  for (const abs of files) {
    const rel = path.relative(fromDir, abs);
    const upstreamPath = path.posix.join(
      source.from,
      rel.split(path.sep).join("/"),
    );
    // A pasta ui/ do evilcharts vira core/: a CLI do shadcn reescreve qualquer
    // import com /ui/<item> para o alias ui do consumidor, e tooltip colide.
    const relDest = rel.replace(/^ui(\/|$)/, "core$1");
    const dest = path.join(ROOT, source.to, relDest);
    const destRel = path.relative(ROOT, dest).split(path.sep).join("/");
    let content = await readFile(abs, "utf8");
    for (const [re, to] of source.rewrites) content = content.replace(re, to);
    const { out, notes } = applyPatches(
      content,
      source.patches[path.basename(rel)] ?? [],
      rel,
    );
    const final = source.header(upstreamPath, notes) + out;
    map.files[destRel] = { upstream: upstreamPath, patches: notes };
    const existing = existsSync(dest) ? await readFile(dest, "utf8") : null;
    if (existing === final) {
      same++;
      continue;
    }
    if (existing === null) created++;
    else changed++;
    console.log(`${existing === null ? "novo    " : "mudou   "} ${destRel}`);
    if (apply) {
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, final);
    }
  }
}

if (apply) {
  await mkdir(path.join(ROOT, "scripts"), { recursive: true });
  await writeFile(
    path.join(ROOT, "scripts/upstream-map.json"),
    `${JSON.stringify(map, null, 2)}\n`,
  );
}

console.log(
  `${apply ? "aplicado" : "simulação"}: ${created} novos, ${changed} alterados, ${same} iguais (foglamp @ ${commit})`,
);
