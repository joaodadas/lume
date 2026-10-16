// Gera a skill de agente em skills/lume-design-engineering (SKILL.md e
// references/*.md) a partir de FRONTEND.md, dos blocos skill:start/skill:end
// de docs/guia e docs/adocao, de docs/conceitos inteiro e de registry.json.
// Rode `bun run skill:build` depois de mexer em qualquer uma dessas fontes e
// commite a saída. O script é idempotente e falha se o SKILL.md passar do teto
// de linhas, se alguma saída tiver travessão ou meia-risca, ou se um link
// interno das saídas não resolver.
//
// Forma adaptada de craft/scripts/build-skill.ts (Gustavo Fior, MIT):
// demoteHeadings, anchor() e os marcadores de índice vêm de lá.

import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKILL_DIR = path.join("skills", "lume-design-engineering");
const REFERENCES_DIR = path.join(SKILL_DIR, "references");
const REPO_URL = "https://github.com/joaodadas/lume";
const SKILL_LINE_CAP = 499; // scripts/check.ts falha a partir de 500
// Travessão (U+2014) e meia-risca (U+2013), montados por código para o glifo não entrar no repo.
const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

// --------------------------------------------------------------- references

const REFERENCES = {
  "01-tokens-e-forma": "Tokens e forma",
  "02-primitivos": "Primitivos",
  "03-shell-paginas-tabelas": "Shell, páginas e tabelas",
  "04-dados-e-cor": "Dados e cor",
  "05-formularios-e-dialogs": "Formulários e dialogs",
  "06-movimento": "Movimento",
  "07-estados": "Estados: loading, vazio, erro e toasts",
  "08-chat-de-ai": "Chat de AI",
  "09-conceitos-craft": "Conceitos do craft",
  "10-adocao": "Adoção",
  "11-anti-padroes": "Anti-padrões",
  "12-itens": "Itens da registry",
} as const;

type Ref = keyof typeof REFERENCES;
const REF_IDS = Object.keys(REFERENCES) as Ref[];

// Mapa fixo: cada seção do FRONTEND.md (título do H2, ou o H1 para a seção 0)
// vai inteira para uma reference. Seção nova sem entrada aqui faz o build
// falhar de propósito.
const FRONTEND_MAP: Record<string, Ref> = {
  // "Frontend" é o H1: só vira seção 0 se tiver texto antes do primeiro H2.
  Frontend: "10-adocao",
  "Cabeçalho, origem, como ler": "10-adocao",
  "Layout do projeto": "10-adocao",
  "Composição: Base UI, `render`, `cn`, `data-slot`": "02-primitivos",
  "Tokens e cor": "01-tokens-e-forma",
  "Sombra no lugar de borda": "01-tokens-e-forma",
  "Raio e squircle": "01-tokens-e-forma",
  Superfícies: "01-tokens-e-forma",
  Tipografia: "01-tokens-e-forma",
  "Espaçamento e ritmo": "03-shell-paginas-tabelas",
  Botões: "02-primitivos",
  "Badges e chips": "02-primitivos",
  "Campos e formulários": "05-formularios-e-dialogs",
  Ícones: "02-primitivos",
  "Shell e sidebar": "03-shell-paginas-tabelas",
  "Páginas: header, stat cards, grids": "03-shell-paginas-tabelas",
  "Tabelas e filtros": "03-shell-paginas-tabelas",
  "Loading, vazio e erro": "07-estados",
  "Números, datas e formatação": "04-dados-e-cor",
  "Cor com significado": "04-dados-e-cor",
  "Overlays e menus": "05-formularios-e-dialogs",
  Toasts: "07-estados",
  Movimento: "06-movimento",
  "Dark mode": "01-tokens-e-forma",
  Fontes: "01-tokens-e-forma",
  "Responsividade e camadas": "03-shell-paginas-tabelas",
  "Acessibilidade e teclado": "02-primitivos",
  "Telas de detalhe e drawers": "03-shell-paginas-tabelas",
  "Assistente de AI (chat)": "08-chat-de-ai",
  "Marketing (opcional)": "01-tokens-e-forma",
  "Next.js e Vite: o que muda": "10-adocao",
  "Regras para agentes": "10-adocao",
};

// Blocos skill:start/skill:end do guia: destino por capítulo, com desvio por
// título do H2 que antecede o bloco (prefixo). "checklist" é o bloco que vai
// para o SKILL.md, não para uma reference. Capítulo com `null` não pode ter
// bloco.
type Rota = Ref | "checklist";
const GUIA_MAP: Record<
  string,
  { padrao: Rota | null; desvios?: [prefixo: string, rota: Rota][] }
> = {
  "00-como-ler": { padrao: "10-adocao" },
  "01-fundacoes": { padrao: "01-tokens-e-forma" },
  "02-primitivos": { padrao: "02-primitivos" },
  "03-shell-e-paginas": {
    padrao: "03-shell-paginas-tabelas",
    desvios: [["Loading e erro", "07-estados"]],
  },
  "04-dados": {
    padrao: "04-dados-e-cor",
    desvios: [
      ["Densidade da tabela", "03-shell-paginas-tabelas"],
      ["Ordenação e URL", "03-shell-paginas-tabelas"],
    ],
  },
  "05-telas-de-detalhe": { padrao: "03-shell-paginas-tabelas" },
  "06-formularios-auth-settings": { padrao: "05-formularios-e-dialogs" },
  "07-dialogs-e-wizards": { padrao: "05-formularios-e-dialogs" },
  "08-assistente-de-ai": { padrao: "08-chat-de-ai" },
  "09-movimento": { padrao: "06-movimento" },
  "10-fingerprint": { padrao: "01-tokens-e-forma" },
  "11-receita": {
    padrao: "10-adocao",
    desvios: [
      ["Passo 3", "02-primitivos"],
      ["O que não copiar", "11-anti-padroes"],
      ["Checklist de verificação", "checklist"],
    ],
  },
  "12-marketing": { padrao: null },
  glossario: { padrao: null },
};

const TIPOS: [tipo: string, rotulo: string][] = [
  ["registry:base", "Base"],
  ["registry:item", "Itens de configuração"],
  ["registry:lib", "Lib"],
  ["registry:hook", "Hooks"],
  ["registry:ui", "Primitivos (ui)"],
  ["registry:component", "Componentes"],
  ["registry:block", "Blocos e kits"],
];

// ---------------------------------------------------------------- utilidades

const abs = (p: string) => path.join(ROOT, p);
const ler = (p: string) => readFile(abs(p), "utf8");

function falhar(msg: string): never {
  throw new Error(msg);
}

// Rebaixa todo heading `levels` níveis, pulando cercas de código (craft).
function demoteHeadings(markdown: string, levels = 1) {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      if (!inFence && /^#{1,5} /.test(line))
        return `${"#".repeat(levels)}${line}`;
      return line;
    })
    .join("\n");
}

// Âncora no padrão do GitHub, igual à de scripts/check.ts (craft, estendida
// para tirar formatação e links do título).
function anchor(title: string) {
  return title
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

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

// Slugs dos títulos de um markdown, com -1, -2 para repetidos (check.ts).
function slugs(md: string) {
  const vistos = new Map<string, number>();
  const out = new Set<string>();
  for (const linha of semCercas(md).split("\n")) {
    const m = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/.exec(linha);
    if (!m) continue;
    const base = anchor(m[1] ?? "");
    const vezes = vistos.get(base) ?? 0;
    vistos.set(base, vezes + 1);
    out.add(vezes === 0 ? base : `${base}-${vezes}`);
  }
  return out;
}

function tituloH1(md: string) {
  return /^# (.+)$/m.exec(md)?.[1]?.trim() ?? falhar("markdown sem H1");
}

function celula(s: string) {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

// ------------------------------------------------------------------ FRONTEND

type Secao = {
  titulo: string;
  corpo: string;
  always: string[];
  never: string[];
  ref: Ref;
};

function parseFrontend(md: string): Secao[] {
  const linhas = md.split("\n");
  const secoes: { titulo: string; linhas: string[] }[] = [];
  for (const linha of linhas) {
    const h2 = /^## (.+)$/.exec(linha);
    const h1 = /^# (.+)$/.exec(linha);
    if (h2 || (h1 && secoes.length === 0)) {
      secoes.push({ titulo: (h2 ?? h1)?.[1]?.trim() ?? "", linhas: [] });
      continue;
    }
    secoes.at(-1)?.linhas.push(linha);
  }
  // O H1 só conta como seção 0 quando tem texto antes do primeiro H2.
  if (secoes[0] && !secoes[0].linhas.some((l) => l.trim())) secoes.shift();
  return secoes.map(({ titulo, linhas }) => {
    const ref = FRONTEND_MAP[titulo];
    if (!ref)
      falhar(`FRONTEND.md: seção "${titulo}" sem entrada em FRONTEND_MAP`);
    const bullets = (marca: string) =>
      linhas
        .filter((l) => l.startsWith(`- **${marca}**`))
        .map((l) => l.replace(/^- \*\*\w+\*\*\s*/, "").trim());
    return {
      titulo,
      corpo: linhas.join("\n").trim(),
      always: bullets("Always"),
      never: bullets("Never"),
      ref,
    };
  });
}

// ------------------------------------------------------------------- blocos

type Bloco = {
  arquivo: string; // docs/guia/03-shell-e-paginas.md
  capitulo: string; // 03. Shell, navegação e páginas de lista
  heading: string | null; // H2 que antecede o bloco
  conteudo: string;
};

function extrairBlocos(arquivo: string, md: string): Bloco[] {
  const capitulo = tituloH1(md);
  const blocos: Bloco[] = [];
  let heading: string | null = null;
  let atual: string[] | null = null;
  for (const linha of md.split("\n")) {
    if (atual === null) {
      const h2 = /^## (.+)$/.exec(linha);
      if (h2) heading = h2[1]?.trim() ?? null;
      if (/^<!--\s*skill:start\s*-->/.test(linha)) atual = [];
      continue;
    }
    if (/^<!--\s*skill:end\s*-->/.test(linha)) {
      blocos.push({ arquivo, capitulo, heading, conteudo: atual.join("\n") });
      atual = null;
      continue;
    }
    if (/^<!--\s*skill:start\s*-->/.test(linha))
      falhar(`${arquivo}: skill:start dentro de bloco aberto`);
    atual.push(linha);
  }
  if (atual !== null) falhar(`${arquivo}: bloco skill:start sem skill:end`);
  return blocos;
}

function rotaDoBloco(b: Bloco): Rota {
  const base = path.basename(b.arquivo, ".md");
  const rota = GUIA_MAP[base];
  if (!rota) falhar(`${b.arquivo}: capítulo sem entrada em GUIA_MAP`);
  const desvio = rota.desvios?.find(([p]) => b.heading?.startsWith(p));
  const destino = desvio?.[1] ?? rota.padrao;
  if (!destino)
    falhar(`${b.arquivo}: bloco em "${b.heading}" sem rota (padrao null)`);
  return destino;
}

// Links relativos do texto copiado: capítulo do guia vira a reference que o
// absorve, conceito vira âncora em 09, o resto vira URL do repo.
function reescreverLinks(texto: string, origem: string, destino: Ref) {
  return texto.replace(
    /\]\((\.{0,2}\/?[^)\s#]+\.md)(#[^)\s]*)?\)/g,
    (m, alvo: string, ancora: string | undefined) => {
      if (/^(https?:|mailto:|tel:)/.test(alvo)) return m;
      const caminho = path.posix.normalize(
        path.posix.join(path.posix.dirname(origem), alvo),
      );
      const base = path.posix.basename(caminho, ".md");
      const dir = path.posix.dirname(caminho);
      if (dir === "docs/guia" && GUIA_MAP[base]?.padrao) {
        const ref = GUIA_MAP[base].padrao;
        return ref === destino ? `](#${anchor(base)})` : `](${ref}.md)`;
      }
      if (dir === "docs/conceitos" && base !== "README") {
        const ref: Ref = "09-conceitos-craft";
        const a = `#${anchor(conceitosTitulos.get(base) ?? base)}`;
        return ref === destino ? `](${a})` : `](${ref}.md${a})`;
      }
      return `](${REPO_URL}/blob/main/${caminho}${ancora ?? ""})`;
    },
  );
}

const conceitosTitulos = new Map<string, string>();

// --------------------------------------------------------------------- fontes

async function lerGuia() {
  const dir = "docs/guia";
  const blocos: Bloco[] = [];
  for (const f of (await readdir(abs(dir))).sort()) {
    if (!f.endsWith(".md")) continue;
    blocos.push(...extrairBlocos(`${dir}/${f}`, await ler(`${dir}/${f}`)));
  }
  return blocos;
}

async function lerConceitos() {
  const dir = "docs/conceitos";
  const arquivos = (await readdir(abs(dir)))
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) =>
      a === "README.md" ? -1 : b === "README.md" ? 1 : a.localeCompare(b),
    );
  const docs: { arquivo: string; md: string }[] = [];
  for (const f of arquivos) {
    const md = await ler(`${dir}/${f}`);
    if (f !== "README.md")
      conceitosTitulos.set(f.replace(/\.md$/, ""), tituloH1(md));
    docs.push({ arquivo: `${dir}/${f}`, md });
  }
  return docs;
}

// docs/adocao: para cada guia, as cercas ```bash (comandos) e os blocos
// skill:start/skill:end, na ordem do documento.
async function lerAdocao() {
  const dir = "docs/adocao";
  const saida: string[] = [];
  for (const f of (await readdir(abs(dir))).sort()) {
    if (!f.endsWith(".md")) continue;
    const arquivo = `${dir}/${f}`;
    const md = await ler(arquivo);
    const partes: string[] = [];
    let heading: string | null = null;
    let cerca: string[] | null = null;
    let bloco: string[] | null = null;
    // O H2 do guia vira #### uma vez só, antes da primeira parte que ele cobre.
    const empurrar = (parte: string) => {
      partes.push(heading ? `#### ${heading}\n\n${parte}` : parte);
      heading = null;
    };
    for (const linha of md.split("\n")) {
      if (cerca) {
        if (/^```/.test(linha)) {
          empurrar(`\`\`\`bash\n${cerca.join("\n")}\n\`\`\``);
          cerca = null;
        } else cerca.push(linha);
        continue;
      }
      if (bloco) {
        if (/^<!--\s*skill:end\s*-->/.test(linha)) {
          empurrar(demoteHeadings(bloco.join("\n"), 3));
          bloco = null;
        } else bloco.push(linha);
        continue;
      }
      const h2 = /^## (.+)$/.exec(linha);
      if (h2) heading = h2[1]?.trim() ?? null;
      else if (/^```bash\s*$/.test(linha)) cerca = [];
      else if (/^<!--\s*skill:start\s*-->/.test(linha)) bloco = [];
    }
    if (cerca || bloco) falhar(`${arquivo}: cerca ou bloco sem fechamento`);
    saida.push(
      `### ${tituloH1(md)}\n\nFonte: [${arquivo}](${REPO_URL}/blob/main/${arquivo}).\n\n${reescreverLinks(partes.join("\n\n"), arquivo, "10-adocao")}`,
    );
  }
  return saida.join("\n\n");
}

type Item = {
  name: string;
  type: string;
  title?: string;
  description?: string;
};

async function lerRegistry() {
  const json = JSON.parse(await ler("registry.json")) as { items: Item[] };
  return json.items;
}

// --------------------------------------------------------------------- saídas

function cabecalho(ref: Ref, fontes: string) {
  return `# ${REFERENCES[ref]}\n\nGerado por \`bun scripts/build-skill.ts\` a partir de ${fontes}; não edite à mão. Caminhos sem prefixo são relativos à raiz de ${REPO_URL}; \`apps/web/\` e \`packages/ui/\` são do Foglamp (commit \`2bc3bb5\`).\n`;
}

function montarReferences(
  secoes: Secao[],
  blocos: Bloco[],
  conceitos: { arquivo: string; md: string }[],
  adocao: string,
  itens: Item[],
  versao: string,
) {
  const out = new Map<Ref, string>();

  for (const ref of REF_IDS) {
    if (ref === "09-conceitos-craft" || ref === "12-itens") continue;
    const partes: string[] = [];
    const fontes = new Set<string>();

    const minhas = secoes.filter((s) => s.ref === ref);
    if (minhas.length) fontes.add("`FRONTEND.md`");
    for (const s of minhas) {
      partes.push(
        `## ${s.titulo}\n\n${reescreverLinks(s.corpo, "FRONTEND.md", ref)}`,
      );
    }

    const meus = blocos.filter((b) => rotaDoBloco(b) === ref);
    const porCapitulo = new Map<string, Bloco[]>();
    for (const b of meus) {
      porCapitulo.set(b.arquivo, [...(porCapitulo.get(b.arquivo) ?? []), b]);
    }
    for (const [arquivo, lista] of porCapitulo) {
      fontes.add(`\`${arquivo}\``);
      const cap = lista[0]?.capitulo ?? arquivo;
      const corpo = lista
        .map((b) =>
          b.heading
            ? `### ${b.heading}\n\n${demoteHeadings(b.conteudo, 2)}`
            : demoteHeadings(b.conteudo, 1),
        )
        .join("\n\n");
      partes.push(
        `## Do guia: ${cap}\n\n${reescreverLinks(corpo, arquivo, ref)}`,
      );
    }

    if (ref === "10-adocao") {
      fontes.add("`docs/adocao/*.md`");
      partes.push(
        `## Guias de adoção: comandos e tabela Lucide para Tabler\n\n${adocao}`,
      );
    }

    if (ref === "11-anti-padroes") {
      fontes.add("os **Never** do `FRONTEND.md`");
      partes.unshift(montarAntiPadroes(secoes));
    }

    if (!partes.length) falhar(`reference ${ref} ficou vazia`);
    out.set(
      ref,
      `${cabecalho(ref, [...fontes].join(", "))}\n${partes.join("\n\n")}\n`,
    );
  }

  // 09: conceitos inteiros, headings rebaixados, README primeiro.
  {
    const ref: Ref = "09-conceitos-craft";
    const corpo = conceitos
      .map(({ arquivo, md }) =>
        reescreverLinks(demoteHeadings(md.trim(), 1), arquivo, ref),
      )
      .join("\n\n");
    out.set(ref, `${cabecalho(ref, "`docs/conceitos/*.md`")}\n${corpo}\n`);
  }

  // 12: lista de itens da registry.
  {
    const ref: Ref = "12-itens";
    const grupos = TIPOS.map(([tipo, rotulo]) => {
      const lista = itens.filter((i) => i.type === tipo);
      if (!lista.length) return "";
      const linhas = lista.map((i) => {
        const cmd =
          tipo === "registry:base"
            ? `npx shadcn@latest init joaodadas/lume/${i.name}#v${versao} -y`
            : `npx shadcn@latest add joaodadas/lume/${i.name}#v${versao}`;
        return `| \`${i.name}\` | ${celula(i.title ?? "")} | ${celula(i.description ?? "")} | \`${cmd}\` |`;
      });
      return `## ${rotulo} (${lista.length})\n\n| Item | Título | Descrição | Comando |\n|---|---|---|---|\n${linhas.join("\n")}`;
    }).filter(Boolean);
    const sobra = itens.filter((i) => !TIPOS.some(([t]) => t === i.type));
    if (sobra.length)
      falhar(
        `registry.json: tipo sem rótulo em TIPOS: ${sobra.map((i) => i.type).join(", ")}`,
      );
    out.set(
      ref,
      `${cabecalho(ref, "`registry.json`")}\n${itens.length} itens na versão \`v${versao}\`. Vários itens vão num comando só; \`--diff\` mostra o que mudaria e \`--overwrite\` aplica. Alias opcional em \`components.json\`: \`"registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }\`.\n\n${grupos.join("\n\n")}\n`,
    );
  }

  return out;
}

function montarAntiPadroes(secoes: Secao[]) {
  const linhas = ["## Nunca, e em vez disso", ""];
  for (const s of secoes) {
    if (!s.never.length) continue;
    const em = s.always[0] ?? "";
    linhas.push(`### ${s.titulo}`, "");
    for (const n of s.never) linhas.push(`- **Never** ${n}`);
    linhas.push(
      `- Em vez disso: ${em} ([seção](${s.ref}.md#${anchor(s.titulo)}))`,
      "",
    );
  }
  return linhas.join("\n").trimEnd();
}

function montarSkill(secoes: Secao[], checklist: string, versao: string) {
  const digest = secoes.map((s) => {
    const primeiro = s.always[0] ?? falhar(`seção "${s.titulo}" sem Always`);
    return `- **${s.titulo}**: ${primeiro} ([ref](references/${s.ref}.md#${anchor(s.titulo)}))`;
  });
  const indice = REF_IDS.map(
    (ref) => `- [${ref}](references/${ref}.md): ${REFERENCES[ref]}`,
  );

  return `---
name: lume-design-engineering
description: 'Design engineering rules for interfaces with the Foglamp look (Gustavo Fior), served by the joaodadas/lume shadcn registry: grey oklch tokens, shadow instead of border, squircle radii, Base UI primitives, Tabler icons, inset shell, tables, dashboards, forms, dialogs, motion and loading states. Use when the user asks for the "cara do Foglamp" or the "padrão do DS", for polish, dark mode, cards, tabelas or dashboards, for a "migração 52W", Radix or Lucide to lume, or to review UI against FRONTEND.md.'
metadata:
  author: joaodadas
  source: ${REPO_URL}
  version: ${versao}
  credits: Foglamp (Apache-2.0) e craft (MIT), Gustavo Fior
---

# lume design engineering

Gerado por \`bun scripts/build-skill.ts\`; não edite à mão. Fonte: \`FRONTEND.md\`, \`docs/guia\`, \`docs/conceitos\`, \`docs/adocao\` e \`registry.json\` de ${REPO_URL}.

## O que é e quando usar

O lume é uma registry shadcn (\`base-vega\` sobre \`@base-ui/react\`, Tailwind v4, \`@tabler/icons-react\`) que copia a regra praticada no código do Foglamp (\`2bc3bb5\`): cinza oklch, sombra no lugar de borda, squircle, pílula de botão, shell inset, tabelas densas e loading que não mexe no layout. Use esta skill sempre que for escrever ou revisar uma tela num projeto que instalou o lume: novo componente, página de lista ou detalhe, formulário, dialog, dashboard, dark mode, animação, migração de 52W, Radix ou Lucide. Toda regra é dura salvo indicação em contrário: se um padrão não cabe, levante antes de contornar.

## Como usar

1. Ache a seção no digest abaixo (uma linha por seção do \`FRONTEND.md\`) ou no índice de references.
2. Leia a reference inteira antes de escrever código: ela traz as strings de classe exatas, os tokens e \`arquivo:linha\`.
3. Use os valores exatos (tokens, pares de raio, sombras, durações, curvas de \`lib/motion.ts\`); não invente um cinza, uma sombra ou uma curva nova.
4. Instale o que falta pela registry: \`npx shadcn@latest add joaodadas/lume/<item>#v${versao}\` (lista em [12-itens](references/12-itens.md)); \`components/ui/*\` nunca é editado à mão, só atualizado com \`--overwrite\`.
5. Ao revisar UI, reporte cada mudança numa tabela Antes / Depois / Regra, citando a seção e \`arquivo:linha\`.

## Os 10 princípios

Do craft (a teoria, Gustavo Fior):

1. Detalhes que ninguém nota se acumulam: raio, espaçamento, easing e contraste certos por padrão são o que faz a interface parecer terminada.
2. Consistência vence novidade: as mesmas duas ou três curvas, as mesmas proporções de raio e a mesma receita de sombra no produto inteiro.
3. Movimento tem que merecer o lugar: o que é frequente é instantâneo; o raro ou espacial pode animar.
4. Respeite a intuição física: nada aparece do nada, cantos aninhados compartilham o centro, a luz vem de cima.

Do Foglamp (a regra praticada):

5. Cinza é estrutura e cor é significado: todo token é \`oklch(L 0 0)\`; emerald é ok, rose é erro, amber é aviso, e nenhuma tela inventa o próprio verde.
6. Sombra no lugar de borda: \`shadow-(--custom-shadow)\` separa superfícies; linha fina só em linha de tabela, divisor interno, campo no dark e no Empty tracejado.
7. Uma forma de botão: pílula \`rounded-full\`, \`h-8\`, \`active:scale-[0.97]\`, anel de 1.5px; a variant muda o peso da ação, não a forma.
8. Shell inset: canvas \`bg-sidebar\` mais escuro, a página é um cartão \`bg-background\` com sombra e squircle, scroll contido em três camadas.
9. Loading que não mexe no layout: skeleton só depois de 700 ms, \`table-fixed\` com larguras no header, header do \`loading.tsx\` idêntico ao da página.
10. Regra praticada vence a escrita: quando o \`FRONTEND.md\` original e o código do Foglamp divergem, vale o código; o lume marca o que é adição própria.

## Digest do FRONTEND.md

Uma linha por seção: o primeiro **Always** e o link para a seção inteira na reference.

<!-- digest:start -->
${digest.join("\n")}
<!-- digest:end -->

## References

<!-- index:start -->
${indice.join("\n")}
<!-- index:end -->

## Anti-padrões

Lista completa, com o "em vez disso" de cada seção, em [11-anti-padroes](references/11-anti-padroes.md).

- \`border\` fechando caixa, \`shadow-md\`, \`ring-1 ring-foreground/10\`: em vez disso \`shadow-(--custom-shadow)\`.
- \`asChild\`, \`data-[state=open]\`, segunda lib de componentes: em vez disso \`render\`, \`data-open\`, só os primitivos da registry.
- \`lucide-react\`, mistura de libs de ícone, margem em ícone dentro de Button: em vez disso \`@tabler/icons-react\`, filled quando existe, \`gap\` do botão.
- Hex, \`rgb()\`, \`slate\`/\`gray\`/\`zinc\` em className: em vez disso tokens e \`neutral\`; hex só quando a cor é dado, com comentário.
- \`space-y-*\`, valor arbitrário sem comentário: em vez disso \`flex flex-col gap-*\` e os gutters \`px-8\` (texto) e \`px-6\` (controles).
- \`font-bold\`, \`text-2xl\`, mono para alinhar número: em vez disso \`font-medium\`, \`text-sm\`/\`text-base\`, \`tracking-tight\`, \`tabular-nums\`.
- Spinner dentro do botão, "Carregando..." cru, skeleton antes de 700 ms, erro em dialog: em vez disso texto do botão muda, \`useDelayedLoading\`, toast com retry.
- \`hover:scale-*\`, curva ou spring literal no componente: em vez disso hover só de cor e o vocabulário de \`lib/motion.ts\`.
- Travessão como placeholder: em vez disso \`sem dado\` em \`text-muted-foreground/50\`.
- TanStack Table, Zustand, provider de contexto dentro da página: em vez disso hooks pequenos sobre \`Table\`, URL para estado de lista, contexto no shell.

## Checklist de revisão

Antes de abrir PR (mapa 21.14), e reporte o resultado na tabela Antes / Depois / Regra:

<!-- checklist:start -->
${checklist}
<!-- checklist:end -->

## Instalação e convivência

\`\`\`bash
npx skills add joaodadas/lume --skill lume-design-engineering   # esta skill
npx skills add gustavo-fior/craft                                # a teoria; o lume cita o craft, não o substitui
npx skills add vercel-labs/agent-skills --skill web-design-guidelines   # reviewer de a11y e UX com arquivo:linha
npx skills add emilkowalski/skills                               # animação: quando não animar, duração e easing
\`\`\`

- A skill entra em \`.agents/skills/lume-design-engineering\` com link em \`.claude/skills\` e \`skills-lock.json\` commitado; \`npx skills update\` atualiza.
- Ordem de leitura numa tarefa de UI: esta skill (a regra do sistema), depois o craft (o porquê), depois \`web-design-guidelines\` na revisão final. Conflito entre elas: vale o \`FRONTEND.md\` do lume, porque é a regra praticada no código que o projeto instalou.
- As regras do projeto (\`AGENTS.md\`) e o \`FRONTEND.md\` instalado pelo item \`guia\` (\`docs/lume/FRONTEND.md\`) têm a última palavra sobre esta skill quando divergirem.
`;
}

// ------------------------------------------------------------------ validação

function validar(saidas: Map<string, string>) {
  const erros: string[] = [];
  const LINK_RE = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const [arquivo, texto] of saidas) {
    texto.split("\n").forEach((l, i) => {
      if (DASHES.test(l))
        erros.push(`${arquivo}:${i + 1}: travessão ou meia-risca`);
    });
    const limpo = semCercas(texto).replace(/`[^`\n]*`/g, (m) =>
      " ".repeat(m.length),
    );
    for (const m of limpo.matchAll(LINK_RE)) {
      const alvo = m[1] ?? "";
      if (/^(https?:|mailto:|tel:)/.test(alvo)) continue;
      const linha = limpo.slice(0, m.index).split("\n").length;
      const [caminho, ancora] = alvo.split("#", 2);
      const destino = caminho
        ? path.posix.normalize(
            path.posix.join(path.posix.dirname(arquivo), caminho),
          )
        : arquivo;
      const conteudo = saidas.get(destino);
      if (conteudo === undefined && !existsSync(abs(destino))) {
        erros.push(
          `${arquivo}:${linha}: link ${alvo} não resolve (${destino})`,
        );
        continue;
      }
      if (ancora !== undefined && destino.endsWith(".md")) {
        const md = conteudo ?? readFileSync(abs(destino), "utf8");
        if (!slugs(md).has(decodeURIComponent(ancora).toLowerCase()))
          erros.push(
            `${arquivo}:${linha}: âncora #${ancora} não existe em ${destino}`,
          );
      }
    }
  }
  const skill = saidas.get(`${SKILL_DIR}/SKILL.md`) ?? "";
  const n = skill.split("\n").length;
  if (n > SKILL_LINE_CAP)
    erros.push(`${SKILL_DIR}/SKILL.md: ${n} linhas (teto ${SKILL_LINE_CAP})`);
  if (erros.length) falhar(`saída inválida:\n${erros.join("\n")}`);
  return n;
}

// ----------------------------------------------------------------------- main

async function main() {
  const versao = (JSON.parse(await ler("package.json")) as { version: string })
    .version;
  const secoes = parseFrontend(await ler("FRONTEND.md"));
  const blocos = await lerGuia();
  const conceitos = await lerConceitos();
  const adocao = await lerAdocao();
  const itens = await lerRegistry();

  const checklist = blocos
    .filter((b) => rotaDoBloco(b) === "checklist")
    .map((b) => reescreverLinks(b.conteudo.trim(), b.arquivo, "10-adocao"))
    .join("\n");
  if (!checklist)
    falhar("docs/guia/11-receita.md: bloco do checklist não encontrado");

  const references = montarReferences(
    secoes,
    blocos.filter((b) => rotaDoBloco(b) !== "checklist"),
    conceitos,
    adocao,
    itens,
    versao,
  );
  const saidas = new Map<string, string>();
  for (const [ref, texto] of references)
    saidas.set(`${REFERENCES_DIR}/${ref}.md`, texto);
  saidas.set(`${SKILL_DIR}/SKILL.md`, montarSkill(secoes, checklist, versao));

  const linhas = validar(saidas);

  await rm(abs(REFERENCES_DIR), { recursive: true, force: true });
  await mkdir(abs(REFERENCES_DIR), { recursive: true });
  for (const [arquivo, texto] of saidas) await writeFile(abs(arquivo), texto);

  console.log(
    `skill: ${secoes.length} seções do FRONTEND.md, ${blocos.length} blocos do guia, ${conceitos.length} conceitos, ${itens.length} itens; SKILL.md com ${linhas} linhas e ${references.size} references.`,
  );
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
