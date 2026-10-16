// Verificações do lume, em ordem: hex fora do globals.css, border fechando
// caixa, imports proibidos, travessão nos docs, formas de import da registry,
// registry.json em dia, limites de arquivo, cabeçalhos de atribuição, skill,
// strings de classe citadas nos docs, links internos e, por fim, next build.
//
// uso: bun scripts/check.ts [--no-build] [--only 1,2,5]
//
// Forma adaptada de lyx-pr-agent/painel/scripts/fumaca.ts: acumula as falhas
// de todas as verificações, imprime agrupado por verificação com arquivo:linha
// e sai com código 1 se houver qualquer uma. Nada aqui grava arquivo.

import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const noBuild = args.includes("--no-build");
const onlyIdx = args.indexOf("--only");
const only =
  onlyIdx >= 0
    ? new Set(
        (args[onlyIdx + 1] ?? "")
          .split(",")
          .map(Number)
          .filter((n) => n > 0),
      )
    : null;

type Falha = { onde?: string; msg: string };
type Grupo = { n: number; nome: string; falhas: Falha[]; pulado?: string };

const grupos: Grupo[] = [];
let atual: Grupo | null = null;

function verificacao(n: number, nome: string, corpo: () => void) {
  const g: Grupo = { n, nome, falhas: [] };
  grupos.push(g);
  if (only && !only.has(n)) {
    g.pulado = "--only";
    return;
  }
  atual = g;
  try {
    corpo();
  } catch (e) {
    g.falhas.push({ msg: `erro interno da verificação: ${String(e)}` });
  }
  atual = null;
}

function falha(msg: string, arquivo?: string, linha?: number) {
  atual?.falhas.push({
    onde: arquivo ? (linha ? `${arquivo}:${linha}` : arquivo) : undefined,
    msg,
  });
}

function pular(motivo: string) {
  if (atual) atual.pulado = motivo;
}

// ---------------------------------------------------------------- utilidades

const IGNORADOS = new Set(["node_modules", ".next", ".git", "dist", "out"]);

function abs(relPath: string) {
  return path.join(ROOT, relPath);
}

// Lista recursiva (caminhos relativos à raiz, com /), pulando node_modules e
// afins. Tolerante a pasta ausente: devolve lista vazia.
function walk(dirRel: string): string[] {
  const dir = abs(dirRel);
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORADOS.has(entry.name)) continue;
    const full = path.posix.join(dirRel, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out.sort();
}

const cache = new Map<string, string>();
function ler(relPath: string): string {
  const hit = cache.get(relPath);
  if (hit !== undefined) return hit;
  const texto = readFileSync(abs(relPath), "utf8");
  cache.set(relPath, texto);
  return texto;
}

function linhaDe(texto: string, indice: number) {
  let n = 1;
  for (let i = 0; i < indice && i < texto.length; i++)
    if (texto.charCodeAt(i) === 10) n++;
  return n;
}

const ehCodigo = (f: string) => /\.(tsx?|mts|mjs|js)$/.test(f);
const ehTs = (f: string) => /\.tsx?$/.test(f);

// Copia uma string literal (aspas simples, duplas ou template) de src[i] para
// out e devolve o índice logo depois dela. Dentro de template, ${...} é
// copiado contando chaves, com strings aninhadas passando por aqui de novo.
function copiaString(src: string, inicio: number, q: string, out: string[]) {
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
    // string de aspas que não fechou na linha: desiste e segue o código
    if (q !== "`" && ch === "\n") {
      out.push(ch);
      return i + 1;
    }
    out.push(ch);
    i++;
  }
  return i;
}

// Devolve o código com os comentários (// e /* */) trocados por espaço,
// preservando as quebras de linha para que os índices continuem apontando
// para a linha certa. Strings e literais de regex são copiados inteiros,
// então um "//" dentro de "https://" não vira comentário.
function semComentarios(src: string): string {
  const out: string[] = [];
  const n = src.length;
  let i = 0;
  // último caractere de código fora de espaço, para distinguir regex de divisão
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
      // literal de regex: copia até a barra de fechamento fora de [...]
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

function semComentariosCss(src: string) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

// Mesma expressão do build-registry.ts: import/export ... from "x" e import("x").
const IMPORT_RE =
  /(?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function imports(texto: string): { spec: string; indice: number }[] {
  const out: { spec: string; indice: number }[] = [];
  for (const m of texto.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    out.push({ spec, indice: m.index + m[0].indexOf(spec) });
  }
  return out;
}

// Literais de string (conteúdo e índice) de um código já sem comentários.
const STRING_RE =
  /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;

function literais(texto: string): { valor: string; indice: number }[] {
  const out: { valor: string; indice: number }[] = [];
  for (const m of texto.matchAll(STRING_RE)) {
    const valor = (m[1] ?? m[2] ?? m[3] ?? "").replace(/\$\{[^}]*\}/g, " ");
    out.push({ valor, indice: m.index });
  }
  return out;
}

// Separa variantes e utilitário de um token do Tailwind, ignorando ":" dentro
// de [] e (): "dark:hover:border" vira { variantes: [dark, hover], base: "border" }.
function partesDoToken(token: string) {
  const partes: string[] = [];
  let prof = 0;
  let buf = "";
  for (const ch of token) {
    if (ch === "[" || ch === "(") prof++;
    else if (ch === "]" || ch === ")") prof--;
    if (ch === ":" && prof === 0) {
      partes.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  partes.push(buf);
  const base = (partes.pop() ?? "").replace(/^!/, "");
  return { variantes: partes, base };
}

type RegItem = {
  name: string;
  type: string;
  files?: { path: string; type?: string; target?: string }[];
  meta?: { group?: string; tier?: string; nextOnly?: boolean };
};

function registryJson(): RegItem[] | null {
  if (!existsSync(abs("registry.json"))) return null;
  try {
    return (JSON.parse(ler("registry.json")) as { items: RegItem[] }).items;
  } catch {
    return null;
  }
}

function donoDosArquivos(itens: RegItem[]) {
  const dono = new Map<string, RegItem>();
  for (const item of itens)
    for (const f of item.files ?? []) dono.set(f.path, item);
  return dono;
}

// Remove blocos de código cercados (```), mantendo as linhas para contagem.
function semCercas(md: string) {
  let dentro = false;
  return md
    .split("\n")
    .map((l) => {
      if (/^\s*(```|~~~)/.test(l)) {
        dentro = !dentro;
        return "";
      }
      return dentro ? "" : l;
    })
    .join("\n");
}

// Slug de título no padrão do GitHub: minúsculas, só letras, números, espaço,
// hífen e sublinhado; espaço vira hífen; repetidos ganham -1, -2...
function slugsDosTitulos(md: string): Set<string> {
  const vistos = new Map<string, number>();
  const out = new Set<string>();
  for (const linha of semCercas(md).split("\n")) {
    const m = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/.exec(linha);
    if (!m) continue;
    const texto = (m[1] ?? "")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "");
    const base = texto
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .trim()
      .replace(/\s/g, "-");
    const vezes = vistos.get(base) ?? 0;
    vistos.set(base, vezes + 1);
    out.add(vezes === 0 ? base : `${base}-${vezes}`);
  }
  return out;
}

function docsMarkdown() {
  return [
    ...walk("docs").filter((f) => f.endsWith(".md")),
    ...(existsSync(abs("FRONTEND.md")) ? ["FRONTEND.md"] : []),
    ...walk("skills").filter((f) => f.endsWith(".md")),
  ];
}

function roda(cmd: string[]) {
  const r = Bun.spawnSync(cmd, { cwd: ROOT, stdout: "pipe", stderr: "pipe" });
  return {
    ok: r.exitCode === 0,
    saida: `${r.stdout.toString()}${r.stderr.toString()}`.trim(),
  };
}

function cauda(texto: string, linhas: number) {
  return texto.split("\n").slice(-linhas).join("\n");
}

// --------------------------------------------------------------- verificações

// 1. Hex só no globals.css da registry. Cor entra por token. Dois usos de hex
// que não pintam nada passam por regra: seletor de atributo que casa com o
// que o recharts emite ([stroke='#ccc']) e o idioma de máscara
// linear-gradient(#fff 0 0), onde a cor só define o alfa.
verificacao(1, "hex fora de registry/base-vega/styles/globals.css", () => {
  const arquivos = [
    ...walk("registry").filter(ehTs),
    ...walk("app").filter((f) => /\.(tsx?|css|mjs|js)$/.test(f)),
    ...walk("components").filter((f) => /\.(tsx?|css)$/.test(f)),
  ];
  for (const f of arquivos) {
    const bruto = ler(f);
    const texto = f.endsWith(".css")
      ? semComentariosCss(bruto)
      : semComentarios(bruto);
    for (const m of texto.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const antes = texto.slice(Math.max(0, m.index - 17), m.index);
      if (/=['"]$/.test(antes)) continue;
      if (
        antes.endsWith("linear-gradient(") &&
        /^#fff 0 0\)/.test(texto.slice(m.index))
      )
        continue;
      falha(`hex ${m[0]}; use um token`, f, linhaDe(texto, m.index));
    }
  }
});

// 2. border fechando caixa fora da allowlist. A separação é shadow-(--custom-shadow).
verificacao(2, "border fechando caixa fora de scripts/check-allow.txt", () => {
  const allowArq = "scripts/check-allow.txt";
  const allow = new Set<string>();
  if (existsSync(abs(allowArq))) {
    for (const linha of ler(allowArq).split("\n")) {
      const limpa = linha.replace(/#.*$/, "").trim();
      if (limpa) allow.add(limpa);
    }
    for (const a of allow)
      if (!existsSync(abs(a)))
        falha(`entrada da allowlist não existe: ${a}`, allowArq);
  } else {
    falha("allowlist não encontrada", allowArq);
  }
  for (const f of walk("registry").filter(ehTs)) {
    const texto = semComentarios(ler(f));
    for (const { valor, indice } of literais(texto)) {
      const tokens = valor.trim().split(/\s+/).filter(Boolean);
      // uma palavra só é nome de variant ou de prop, não lista de classes
      if (tokens.length < 2) continue;
      // prosa (frase com maiúscula ou pontuação) não é lista de classes
      if (tokens.some((t) => /^[A-Z]/.test(t) || /[.,;!?]$/.test(t))) continue;
      const bases = tokens.map(partesDoToken);
      const temTransparente = bases.some(
        (b) => b.base === "border-transparent",
      );
      const temDarkSemSombra = tokens.includes("dark:shadow-none");
      for (const [i, t] of tokens.entries()) {
        const { variantes, base } = bases[i] ?? { variantes: [], base: "" };
        if (!(base === "border" || /^border-[124]$/.test(base))) continue;
        // "border border-transparent" só reserva espaço para o anel de foco
        if (base === "border" && temTransparente) continue;
        // receita dark do Foglamp: a sombra some e entra uma borda a 50%
        if (variantes.includes("dark") && temDarkSemSombra) continue;
        if (allow.has(f)) continue;
        falha(
          `"${t}" fecha caixa em "${valor.length > 90 ? `${valor.slice(0, 90)}...` : valor}"`,
          f,
          linhaDe(texto, indice),
        );
      }
    }
  }
});

// 3. Bibliotecas de ícones proibidas em qualquer código do repo. Só Tabler.
verificacao(
  3,
  "imports proibidos (lucide-react, react-icons, @phosphor-icons, @heroicons)",
  () => {
    const PROIBIDOS = [
      "lucide-react",
      "react-icons",
      "@phosphor-icons",
      "@heroicons",
    ];
    for (const f of walk(".").filter(ehCodigo)) {
      if (f.startsWith("public/")) continue;
      const texto = semComentarios(ler(f));
      for (const { spec, indice } of imports(texto)) {
        const ruim = PROIBIDOS.find(
          (p) => spec === p || spec.startsWith(`${p}/`),
        );
        if (ruim)
          falha(
            `import de ${spec}; use @tabler/icons-react`,
            f,
            linhaDe(texto, indice),
          );
      }
    }
  },
);

// 4. Travessão e meia-risca fora dos textos.
verificacao(4, "travessão (U+2014) e meia-risca (U+2013) nos textos", () => {
  const arquivos = [
    ...walk("docs").filter((f) => f.endsWith(".md")),
    ...["README.md", "CHANGELOG.md", "CONTRIBUTING.md", "FRONTEND.md"].filter(
      (f) => existsSync(abs(f)),
    ),
    ...walk("skills").filter((f) => /\.(md|txt|json|ya?ml)$/.test(f)),
  ];
  for (const f of arquivos) {
    const linhas = ler(f).split("\n");
    for (const [i, linha] of linhas.entries()) {
      const col = linha.search(/[—–]/);
      if (col >= 0)
        falha(`coluna ${col + 1}: use vírgula, dois pontos ou ponto`, f, i + 1);
    }
  }
});

// 5. Imports da registry só nas três formas; next/* só em item nextOnly; zero @foglamp/.
verificacao(
  5,
  "formas de import na registry (npm, relativo no mesmo bloco, @/registry/base-vega/*)",
  () => {
    const itens = registryJson();
    const dono = itens ? donoDosArquivos(itens) : new Map<string, RegItem>();
    for (const f of walk("registry/base-vega").filter(ehTs)) {
      const texto = semComentarios(ler(f));
      const bloco = /^registry\/base-vega\/blocks\/([^/]+)\//.exec(f)?.[1];
      for (const { spec, indice } of imports(texto)) {
        const linha = linhaDe(texto, indice);
        if (spec.startsWith("@/registry/base-vega/")) continue;
        if (spec.startsWith("@foglamp/")) {
          falha(
            `import ${spec}: reescreva para @/registry/base-vega/*`,
            f,
            linha,
          );
          continue;
        }
        if (spec.startsWith("@/")) {
          falha(
            `import ${spec}: só @/registry/base-vega/* é permitido`,
            f,
            linha,
          );
          continue;
        }
        if (spec.startsWith(".")) {
          const alvo = path.posix.normalize(
            path.posix.join(path.posix.dirname(f), spec),
          );
          const mesmoBloco =
            bloco && alvo.startsWith(`registry/base-vega/blocks/${bloco}/`);
          if (!mesmoBloco)
            falha(
              `import relativo ${spec}: só entre arquivos do mesmo bloco; use @/registry/base-vega/*`,
              f,
              linha,
            );
          continue;
        }
        if (spec === "next" || spec.startsWith("next/")) {
          const item = dono.get(f);
          if (!item)
            falha(
              `importa ${spec} e não pertence a nenhum item do registry.json`,
              f,
              linha,
            );
          else if (!item.meta?.nextOnly)
            falha(
              `importa ${spec} sem meta.nextOnly no item ${item.name}`,
              f,
              linha,
            );
        }
      }
    }
    for (const f of [
      ...walk("registry"),
      ...walk("app"),
      ...walk("components"),
      ...walk("src"),
    ].filter(ehCodigo)) {
      const texto = semComentarios(ler(f));
      const i = texto.indexOf("@foglamp/");
      if (i >= 0) falha("referência a @foglamp/", f, linhaDe(texto, i));
    }
  },
);

// 6. registry.json em dia e coerente com os arquivos e com public/r.
verificacao(6, "registry.json e public/r em dia", () => {
  const r = roda(["bun", "scripts/build-registry.ts", "--check"]);
  if (!r.ok) falha(r.saida || "build-registry --check falhou", "registry.json");
  const itens = registryJson();
  if (!itens) {
    falha("registry.json ausente ou inválido", "registry.json");
    return;
  }
  const dono = donoDosArquivos(itens);
  for (const item of itens) {
    const arquivos = item.files ?? [];
    for (const f of arquivos)
      if (!existsSync(abs(f.path)))
        falha(
          `${item.name}: files[].path não existe: ${f.path}`,
          "registry.json",
        );
    const json = `public/r/${item.name}.json`;
    if (!existsSync(abs(json))) {
      falha(`sem ${json}; rode bun run registry:build`, "public/r");
      continue;
    }
    // Se a fonte importa outros arquivos da registry, o JSON buildado tem que
    // carregar o import intacto (é o "add" no consumidor que reescreve).
    const fonteDoItem = arquivos
      .filter((f) => existsSync(abs(f.path)))
      .map((f) => ler(f.path))
      .join("\n");
    if (
      fonteDoItem.includes("@/registry/base-vega/") &&
      !ler(json).includes("@/registry/base-vega/")
    )
      falha(
        `${json} não contém "@/registry/base-vega/"; rode bun run registry:build`,
        json,
      );
  }
  for (const f of walk("registry/base-vega").filter(ehTs)) {
    if (f.startsWith("registry/base-vega/styles/")) continue;
    if (!dono.has(f)) falha("arquivo sem item em registry/items.ts", f);
  }
});

// 7. Limites do modo GitHub da CLI: nada acima de 1 MiB nem symlink.
verificacao(7, "tamanho (<= 1 MiB) e symlinks em registry/", () => {
  for (const f of walk("registry")) {
    const st = lstatSync(abs(f));
    if (st.isSymbolicLink()) falha("symlink não entra na registry", f);
    else if (st.size > 1024 * 1024)
      falha(`${Math.round(st.size / 1024)} KiB (teto 1024 KiB)`, f);
  }
});

// 8. Cabeçalho de atribuição em todo arquivo derivado (Apache-2.0 §4b).
verificacao(
  8,
  "cabeçalhos de atribuição dos arquivos de scripts/upstream-map.json",
  () => {
    const mapa = "scripts/upstream-map.json";
    if (!existsSync(abs(mapa))) {
      falha("mapa não encontrado", mapa);
      return;
    }
    const { files } = JSON.parse(ler(mapa)) as {
      files: Record<string, unknown>;
    };
    const notices = existsSync(abs("THIRD_PARTY_NOTICES.md"))
      ? ler("THIRD_PARTY_NOTICES.md")
      : null;
    for (const f of Object.keys(files)) {
      if (!existsSync(abs(f))) {
        falha("listado no mapa e não existe", f);
        continue;
      }
      const primeira = ler(f).split("\n")[0] ?? "";
      const evil = f.includes("/evilcharts/");
      const esperado = evil ? "// Evil Charts" : "// Derivado do Foglamp";
      if (!primeira.startsWith(esperado))
        falha(`primeira linha deve começar com "${esperado}"`, f, 1);
      if (notices !== null && !notices.includes(f))
        falha("não listado em THIRD_PARTY_NOTICES.md", f);
    }
  },
);

// 9. Skill: frontmatter com name igual à pasta e description; menos de 500 linhas.
verificacao(9, "skill lume-design-engineering", () => {
  const pasta = "skills/lume-design-engineering";
  const skill = `${pasta}/SKILL.md`;
  if (!existsSync(abs(skill))) {
    pular("skills/lume-design-engineering/SKILL.md ainda não existe");
    return;
  }
  const texto = ler(skill);
  const linhas = texto.split("\n");
  const fm = /^---\n([\s\S]*?)\n---/.exec(texto);
  if (!fm) {
    falha("sem frontmatter ---", skill, 1);
    return;
  }
  const campo = (k: string) =>
    new RegExp(`^${k}:\\s*(.+)$`, "m").exec(fm[1] ?? "")?.[1]?.trim();
  const name = campo("name");
  if (name !== path.posix.basename(pasta))
    falha(
      `frontmatter name "${name ?? ""}" difere da pasta "${path.posix.basename(pasta)}"`,
      skill,
      2,
    );
  if (!campo("description")) falha("frontmatter sem description", skill, 2);
  if (linhas.length >= 500) falha(`${linhas.length} linhas (teto 499)`, skill);
});

// 10. Toda string de classe citada nos docs com shadow-(--custom ou squircle:
// existe literalmente em algum arquivo de registry/.
verificacao(
  10,
  "strings de classe citadas nos docs existem em registry/",
  () => {
    const docs = docsMarkdown();
    if (!docs.length) {
      pular("sem docs/ nem FRONTEND.md");
      return;
    }
    const fonte = walk("registry")
      .filter((f) => /\.(tsx?|css)$/.test(f))
      .map((f) => ler(f))
      .join("\n");
    for (const f of docs) {
      const texto = ler(f);
      for (const m of texto.matchAll(/`([^`\n]+)`/g)) {
        const s = m[1] ?? "";
        if (!(s.includes("shadow-(--custom") || s.includes("squircle:")))
          continue;
        // modelo com placeholder ({c}, <menor>, rounded-*, R,G,B, ...) não é citação literal
        if (/\{[^}]*\}|<[^>]*>|\*|R,G,B|\.\.\./.test(s)) continue;
        // citação de código do Foglamp que não entrou na registry: a linha
        // precisa dizer de onde veio (Foglamp, apps/web ou packages/ui)
        const linhaDaCitacao =
          texto.split("\n")[linhaDe(texto, m.index) - 1] ?? "";
        if (/foglamp|apps\/web|packages\/ui/i.test(linhaDaCitacao)) continue;
        if (!fonte.includes(s))
          falha(
            `não existe em registry/: \`${s.length > 100 ? `${s.slice(0, 100)}...` : s}\``,
            f,
            linhaDe(texto, m.index),
          );
      }
    }
  },
);

// 11. Links internos relativos e âncoras resolvem (slug do GitHub).
verificacao(
  11,
  "links internos e âncoras em docs/**/*.md e FRONTEND.md",
  () => {
    const docs = docsMarkdown();
    if (!docs.length) {
      pular("sem docs/ nem FRONTEND.md");
      return;
    }
    const LINK_RE = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    for (const f of docs) {
      const bruto = ler(f);
      const texto = semCercas(bruto).replace(/`[^`\n]*`/g, (m) =>
        " ".repeat(m.length),
      );
      for (const m of texto.matchAll(LINK_RE)) {
        const alvo = m[1] ?? "";
        const linha = linhaDe(texto, m.index);
        if (/^(https?:|mailto:|tel:)/.test(alvo)) continue;
        const [caminho, ancora] = alvo.split("#", 2);
        const destino = caminho
          ? path.posix.normalize(
              path.posix.join(path.posix.dirname(f), caminho),
            )
          : f;
        if (caminho?.startsWith("/")) {
          falha(`link absoluto ${alvo}; use caminho relativo`, f, linha);
          continue;
        }
        if (!existsSync(abs(destino))) {
          falha(`link para ${alvo} não resolve (${destino})`, f, linha);
          continue;
        }
        if (ancora !== undefined && destino.endsWith(".md")) {
          const slugs = slugsDosTitulos(ler(destino));
          if (!slugs.has(decodeURIComponent(ancora).toLowerCase()))
            falha(`âncora #${ancora} não existe em ${destino}`, f, linha);
        }
      }
    }
  },
);

// 12. next build. Pule com --no-build quando só quiser as verificações estáticas.
verificacao(12, "next build", () => {
  if (noBuild) {
    pular("--no-build");
    return;
  }
  const r = roda(["bun", "run", "build"]);
  if (!r.ok) falha(`next build falhou:\n${cauda(r.saida, 40)}`);
});

// ---------------------------------------------------------------- relatório

let total = 0;
for (const g of grupos) {
  const cab = `[${String(g.n).padStart(2)}/${grupos.length}] ${g.nome}`;
  if (g.pulado) {
    console.log(`${cab}: pulado (${g.pulado})`);
    continue;
  }
  if (!g.falhas.length) {
    console.log(`${cab}: ok`);
    continue;
  }
  total += g.falhas.length;
  console.log(`${cab}: ${g.falhas.length} falha(s)`);
  for (const f of g.falhas) {
    const msg = f.msg.includes("\n")
      ? `\n      ${f.msg.split("\n").join("\n      ")}`
      : f.msg;
    console.log(`  ${f.onde ? `${f.onde}  ` : ""}${msg}`);
  }
}

if (total) {
  console.error(`\ncheck: ${total} falha(s)`);
  process.exit(1);
}
console.log("\ncheck: tudo verde");
