// Índice dos documentos do site /guia: lê FRONTEND.md e docs/** com node:fs
// no servidor e devolve slug, grupo, título e descrição de uma linha. Só
// roda em build (rotas estáticas); nada aqui lê relógio ou request. Arquivo
// do site, fora da registry.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type Grupo =
  | "Regras"
  | "Guia"
  | "Conceitos"
  | "Adoção"
  | "Referências"
  | "Decisões";

export type Doc = {
  /** Slug da rota, sem a barra inicial: "frontend", "guia/01-fundacoes". */
  slug: string;
  /** Caminho do arquivo relativo à raiz do repo, com "/". */
  arquivo: string;
  grupo: Grupo;
  titulo: string;
  descricao: string;
};

export const GRUPOS: readonly Grupo[] = [
  "Regras",
  "Guia",
  "Conceitos",
  "Adoção",
  "Referências",
  "Decisões",
];

type Fonte =
  | { grupo: Grupo; arquivo: string; slug: string }
  | { grupo: Grupo; dir: string; prefixo: string };

const FONTES: readonly Fonte[] = [
  { grupo: "Regras", arquivo: "FRONTEND.md", slug: "frontend" },
  { grupo: "Guia", dir: "docs/guia", prefixo: "guia" },
  { grupo: "Conceitos", dir: "docs/conceitos", prefixo: "conceitos" },
  { grupo: "Adoção", dir: "docs/adocao", prefixo: "adocao" },
  { grupo: "Referências", arquivo: "docs/referencias.md", slug: "referencias" },
  { grupo: "Decisões", arquivo: "docs/DECISOES.md", slug: "decisoes" },
];

// Caminhos sempre ancorados em "FRONTEND.md" ou na pasta "docs": com o
// prefixo estático o tracing do Turbopack inclui só essa pasta no bundle, e
// não o projeto inteiro.
function abs(rel: string) {
  if (rel === "FRONTEND.md") return path.join(process.cwd(), "FRONTEND.md");
  return path.join(process.cwd(), "docs", rel.replace(/^docs\//, ""));
}

// Tolerante a pasta ausente (no runtime da Vercel os docs podem não estar
// no bundle): devolve lista vazia e a página cai em notFound.
function listarMd(dirRel: string): string[] {
  try {
    return readdirSync(abs(dirRel))
      .filter((n) => n.endsWith(".md"))
      .sort((a, b) => {
        // README primeiro: é a abertura da pasta.
        if (a === "README.md") return -1;
        if (b === "README.md") return 1;
        return a.localeCompare(b, "pt-BR");
      })
      .map((n) => `${dirRel}/${n}`);
  } catch {
    return [];
  }
}

function lerArquivo(rel: string): string | null {
  try {
    if (!existsSync(abs(rel))) return null;
    return readFileSync(abs(rel), "utf8");
  } catch {
    return null;
  }
}

// Tira marcação inline (link, código, ênfase) para título e descrição.
function limparInline(texto: string) {
  return texto
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

export function tituloDe(md: string, fallback: string) {
  const m = /^#\s+(.+?)\s*$/m.exec(md);
  return m ? limparInline(m[1] ?? "") : fallback;
}

// Primeiro parágrafo de prosa: pula título, comentário HTML, tabela, lista e
// cerca de código; corta na primeira frase ou em ~160 caracteres.
export function descricaoDe(md: string) {
  const linhas = md.split("\n");
  let dentroCerca = false;
  const paragrafo: string[] = [];
  for (const linha of linhas) {
    if (/^\s*(```|~~~)/.test(linha)) {
      dentroCerca = !dentroCerca;
      continue;
    }
    if (dentroCerca) continue;
    const l = linha.trim();
    if (paragrafo.length === 0) {
      if (
        !l ||
        l.startsWith("#") ||
        l.startsWith("<!--") ||
        l.startsWith("|") ||
        l.startsWith("- ") ||
        l.startsWith("* ") ||
        /^\d+\.\s/.test(l) ||
        l.startsWith(">")
      )
        continue;
      paragrafo.push(l);
      continue;
    }
    if (!l) break;
    paragrafo.push(l);
  }
  const texto = limparInline(paragrafo.join(" "));
  if (!texto) return "";
  const frase = /^(.{20,}?[.!?])(\s|$)/.exec(texto);
  const curto = frase ? (frase[1] ?? texto) : texto;
  if (curto.length <= 160) return curto;
  return `${curto.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}

function slugDoNome(nome: string) {
  return nome.replace(/\.md$/, "").toLowerCase();
}

let cache: Doc[] | null = null;

export function listarDocs(): Doc[] {
  if (cache) return cache;
  const docs: Doc[] = [];
  for (const fonte of FONTES) {
    const arquivos = "dir" in fonte ? listarMd(fonte.dir) : [fonte.arquivo];
    for (const arquivo of arquivos) {
      const md = lerArquivo(arquivo);
      if (md == null) continue;
      const nome = arquivo.split("/").pop() ?? arquivo;
      const slug =
        "dir" in fonte ? `${fonte.prefixo}/${slugDoNome(nome)}` : fonte.slug;
      docs.push({
        slug,
        arquivo,
        grupo: fonte.grupo,
        titulo: tituloDe(md, slugDoNome(nome)),
        descricao: descricaoDe(md),
      });
    }
  }
  cache = docs;
  return docs;
}

export function docsPorGrupo(): { grupo: Grupo; docs: Doc[] }[] {
  const todos = listarDocs();
  return GRUPOS.map((grupo) => ({
    grupo,
    docs: todos.filter((d) => d.grupo === grupo),
  })).filter((g) => g.docs.length > 0);
}

export function acharDoc(slug: string): Doc | null {
  return listarDocs().find((d) => d.slug === slug) ?? null;
}

export function lerDoc(slug: string): { doc: Doc; markdown: string } | null {
  const doc = acharDoc(slug);
  if (!doc) return null;
  const markdown = lerArquivo(doc.arquivo);
  if (markdown == null) return null;
  return { doc, markdown };
}

// Resolve um link relativo escrito no markdown (./01-fundacoes.md#x,
// ../conceitos/README.md) para a rota do site; null quando o alvo não é um
// documento publicado.
export function rotaDoLink(docAtual: Doc, href: string): string | null {
  const [caminho, hash] = href.split("#");
  if (!caminho || !/\.md$/i.test(caminho)) return null;
  const dir = path.posix.dirname(docAtual.arquivo);
  const alvo = path.posix.normalize(path.posix.join(dir, caminho));
  const doc = listarDocs().find(
    (d) => d.arquivo.toLowerCase() === alvo.toLowerCase(),
  );
  if (!doc) return null;
  return `/guia/${doc.slug}${hash ? `#${hash}` : ""}`;
}

// Caminho de um arquivo do repo citado por link relativo (sem .md) vira link
// para o GitHub, no branch principal.
export function linkDoRepo(docAtual: Doc, href: string): string {
  const dir = path.posix.dirname(docAtual.arquivo);
  const alvo = path.posix.normalize(path.posix.join(dir, href));
  return `https://github.com/joaodadas/lume/blob/main/${alvo}`;
}
