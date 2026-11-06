// lume check: confere, sem julgar, se o projeto segue o lume. Cada violação
// tem regra, arquivo e linha. O mesmo comando roda no fim do init e no CI.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { adotouLume, LAYOUTS, lerProjeto, listar } from "./projeto.mjs";
import { criarRegistry, emLotes } from "./registry.mjs";
import {
  linhaDe,
  normalizar,
  semComentarios,
  semComentariosCss,
} from "./texto.mjs";

export const REGRAS = {
  "config/lume-json":
    "Rode `npx -y @joaodadas/lume@latest init`: ele grava o lume.json com a versão e o layout.",
  "config/components-json":
    "O components.json precisa ser o do lume (style base-vega, iconLibrary tabler, tsx). Apague o atual e rode o init do base.",
  "config/alias":
    "Os aliases do components.json desviam os componentes para outra pasta. O padrão é ui em @/components/ui, components em @/components e utils em @/lib/utils: o lume mora em components/ui, sem pasta paralela.",
  "css/base": "O CSS global não tem a base do lume. Rode o init do base.",
  "css/fonte":
    "A fonte é a da base (Inter Variable e Geist Mono pelo Fontsource), sem font-feature-settings, sem outro pacote de fonte e sem redefinir --font-sans.",
  "deps/proibida":
    "Tire a dependência: ícone é Tabler, primitivo é Base UI, os dois pelo lume.",
  "ui/editado":
    "Arquivo da registry editado à mão. Reinstale o item com --overwrite e leve a variação para className na composição.",
  "ui/fora-da-registry":
    "Componente que não é do lume dentro de components/ui. Troque os usos pelo componente do lume e apague o arquivo; composição do produto mora em components/app.",
  "ui/paralelo":
    "Pasta com cópias de primitivos fora de components/ui. Troque os imports para components/ui e apague a pasta.",
  "codigo/import":
    "Import de biblioteca que o lume substitui: ícone é @tabler/icons-react, primitivo é o de components/ui, fonte vem do CSS.",
  "codigo/aschild": 'asChild é do Radix. No lume: render={<Link href="/x" />}.',
  "codigo/data-state":
    "data-[state=...] é do Radix. No lume: data-open, data-closed, data-active.",
  "codigo/peso": "O peso máximo no app é font-medium.",
  "codigo/titulo":
    "Título de página é text-base. text-2xl ou maior não existe no app.",
  "codigo/cinza":
    "Cinza cru é neutral ou token. slate, gray, zinc e stone não entram.",
  "codigo/sombra":
    "Sombra do Tailwind não entra: a superfície usa shadow-(--custom-shadow).",
  "codigo/espaco": "space-x e space-y não entram: empilhe com flex e gap.",
};

// Pacotes que o lume substitui. A mesma lista barra a dependência no
// package.json e o import no código; o import pega também os subcaminhos.
const PACOTES_PROIBIDOS = [
  "lucide-react",
  "radix-ui",
  "@radix-ui/*",
  "react-icons",
  "@heroicons/*",
  "@mui/*",
  "@mantine/*",
  "@headlessui/*",
  "@chakra-ui/*",
  "antd",
  "inter-ui",
];

const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const DEPS_PROIBIDAS = PACOTES_PROIBIDOS.map((p) =>
  p.endsWith("/*")
    ? new RegExp(`^${escapar(p.slice(0, -1))}`)
    : new RegExp(`^${escapar(p)}$`),
);

const ALTERNATIVAS_IMPORT = [
  ...PACOTES_PROIBIDOS.map((p) =>
    p.endsWith("/*")
      ? `${escapar(p.slice(0, -1))}[^"']+`
      : `${escapar(p)}(?:/[^"']*)?`,
  ),
  "next\\/font\\/(?:google|local)",
];

const IMPORTS_PROIBIDOS = new RegExp(
  `(?:from\\s+|import\\s*\\(\\s*|import\\s+)["'](${ALTERNATIVAS_IMPORT.join("|")})["']`,
  "g",
);

const PADROES_CODIGO = [
  ["codigo/aschild", /\basChild\b/g],
  [
    "codigo/data-state",
    /data-\[state=(?!["']?selected["']?\])["']?[a-z-]+["']?\]/g,
  ],
  ["codigo/peso", /(?<![\w-])font-(?:bold|semibold|extrabold|black)(?![\w-])/g],
  ["codigo/titulo", /(?<![\w-])text-(?:[2-9]xl)(?![\w-])/g],
  [
    "codigo/cinza",
    /(?<![\w-])(?:[a-z-]+-)?(?:slate|gray|zinc|stone)-(?:50|[1-9]00|950)(?![\w-])/g,
  ],
  // shadow sozinho e shadow-xs a shadow-2xl; shadow-(--custom-shadow) e
  // shadow-[...] passam, e o nome solto de variável (shadow =, { shadow }) não conta.
  [
    "codigo/sombra",
    /(?<![\w.-])shadow(?:-(?:xs|sm|md|lg|xl|2xl))?(?![\w\-/([])(?!\s*[=:,;.)}?])/g,
  ],
  ["codigo/espaco", /(?<![\w-])-?space-[xy]-[\w.[\]]+/g],
];

const EXCECAO = /lume:excecao\s+motivo=\S/;
const CODIGO = /\.(tsx?|jsx?|mjs|cjs)$/;
const NAO_ESCANEAR =
  /(\.spec\.|\.test\.|\.stories\.|\.config\.|(^|\/)(e2e|__tests__|__mocks__|__fixtures__)\/)/;

/**
 * O que é código do app, o mesmo para código e CSS: a pasta do `@/*` do
 * tsconfig; com o app na raiz, as pastas de sempre.
 */
function escopoDoApp(projeto) {
  if (projeto.prefixo) return (rel) => rel.startsWith(projeto.prefixo);
  return (rel) =>
    /^(app|components|lib|hooks|pages|features|styles)\//.test(rel);
}

/** Caminho de instalação de um arquivo da registry, já no layout do projeto. */
function caminhoInstalado(arquivo, tipo, projeto) {
  const nome = path.posix.basename(arquivo.path);
  if (arquivo.target) {
    if (arquivo.target.startsWith("~/")) return arquivo.target.slice(2);
    if (arquivo.target.startsWith("components/")) {
      return `${projeto.dirComponentes}/${arquivo.target.slice("components/".length)}`;
    }
    return `${projeto.prefixo}${arquivo.target}`;
  }
  if (tipo === "registry:ui") return `${projeto.dirUi}/${nome}`;
  if (tipo === "registry:component" || tipo === "registry:block") {
    return `${projeto.dirComponentes}/${nome}`;
  }
  if (tipo === "registry:hook") return `${projeto.dirHooks}/${nome}`;
  // lib/utils.ts recebe helpers do produto: fica fora da comparação.
  if (tipo === "registry:lib" && LIBS_CONFERIDAS.has(nome)) {
    return `${projeto.dirLib}/${nome}`;
  }
  return null;
}

/** Kits que o init instala, além de todos os primitivos. */
export const KITS = [
  "kit-shell",
  "kit-tabela",
  "kit-formulario",
  "kit-feedback",
  "kit-dados",
];

const LIBS_CONFERIDAS = new Set(["format.ts", "motion.ts", "range.ts"]);

/** "joaodadas/lume/button#v0.4.0" (ou uma URL de item) vira "button". */
function nomeDaDependencia(dep) {
  return String(dep)
    .replace(/#.*$/, "")
    .split("/")
    .pop()
    .replace(/\.json$/, "");
}

/**
 * Os itens que o lume de fato pôs no projeto: todos os primitivos, os kits do
 * init (kit-graficos quando o projeto tem recharts), login-form, guia,
 * link-next no Next e o que o lume.json lista em `itens`, com as dependências
 * de cada um. Componente do produto com nome igual a um item fora disso não é
 * do lume e não é comparado.
 */
export function itensDoLume(itens, projeto) {
  const porNome = new Map(itens.map((i) => [i.name, i]));
  const raizes = [
    ...itens.filter((i) => i.type === "registry:ui").map((i) => i.name),
    ...KITS,
    ...(projeto.deps?.recharts ? ["kit-graficos"] : []),
    "login-form",
    "guia",
    ...(projeto.framework === "next" ? ["link-next"] : []),
    ...(Array.isArray(projeto.lumeJson?.itens) ? projeto.lumeJson.itens : []),
  ];
  const vistos = new Set();
  const fila = [...raizes];
  while (fila.length > 0) {
    const nome = fila.pop();
    if (vistos.has(nome) || !porNome.has(nome)) continue;
    vistos.add(nome);
    for (const dep of porNome.get(nome).registryDependencies ?? []) {
      fila.push(nomeDaDependencia(dep));
    }
  }
  return vistos;
}

const ALIASES_ESPERADOS = {
  components: /\/components$/,
  ui: /\/components\/ui$/,
  utils: /\/lib\/utils$/,
};

const MARCAS_BASE = [
  "--custom-shadow",
  "@toolwind/corner-shape",
  "shadcn/tailwind.css",
];

/**
 * A base do lume está instalada? A mesma régua do check: components.json do
 * lume, os três aliases e as marcas da base no CSS global ou num que ele
 * importa.
 */
export function baseInstalada(projeto) {
  const cj = projeto.componentsJson;
  if (!cj || cj.__invalido) return false;
  if (cj.style !== "base-vega" || cj.iconLibrary !== "tabler") return false;
  if (cj.tsx === false) return false;
  const a = cj.aliases ?? {};
  for (const [chave, re] of Object.entries(ALIASES_ESPERADOS)) {
    if (!re.test(String(a[chave] ?? ""))) return false;
  }
  if (!projeto.css) return false;
  const junto = cssComImports(projeto.raiz, projeto.css)
    .map((c) => c.css)
    .join("\n");
  return MARCAS_BASE.every((m) => junto.includes(m));
}

function add(violacoes, regra, arquivo, linha, trecho) {
  violacoes.push({
    regra,
    arquivo,
    linha: linha ?? null,
    trecho: trecho ?? null,
  });
}

function conferirConfig(projeto, violacoes) {
  const lj = projeto.lumeJson;
  if (!lj) add(violacoes, "config/lume-json", "lume.json", null, "não existe");
  else if (lj.__invalido)
    add(violacoes, "config/lume-json", "lume.json", null, "JSON inválido");
  else {
    if (!/^\d+\.\d+\.\d+$/.test(String(lj.versao ?? ""))) {
      add(
        violacoes,
        "config/lume-json",
        "lume.json",
        null,
        "versao ausente ou fora do formato X.Y.Z",
      );
    }
    if (!LAYOUTS.includes(lj.layout)) {
      add(
        violacoes,
        "config/lume-json",
        "lume.json",
        null,
        `layout precisa ser ${LAYOUTS.join(", ")}`,
      );
    }
    if (
      lj.itens !== undefined &&
      (!Array.isArray(lj.itens) || lj.itens.some((x) => typeof x !== "string"))
    ) {
      add(
        violacoes,
        "config/lume-json",
        "lume.json",
        null,
        "itens precisa ser uma lista de nomes de item",
      );
    }
    for (const [nome, motivo] of Object.entries(lj.extras ?? {})) {
      if (typeof motivo !== "string" || motivo.trim().length < 8) {
        add(
          violacoes,
          "config/lume-json",
          "lume.json",
          null,
          `extras.${nome} sem motivo`,
        );
      }
    }
  }
  const cj = projeto.componentsJson;
  if (!cj || cj.__invalido) {
    add(
      violacoes,
      "config/components-json",
      "components.json",
      null,
      cj ? "JSON inválido" : "não existe",
    );
    return;
  }
  if (cj.style !== "base-vega") {
    add(
      violacoes,
      "config/components-json",
      "components.json",
      null,
      `style "${cj.style}"`,
    );
  }
  if (cj.iconLibrary !== "tabler") {
    add(
      violacoes,
      "config/components-json",
      "components.json",
      null,
      `iconLibrary "${cj.iconLibrary}"`,
    );
  }
  if (cj.tsx === false)
    add(
      violacoes,
      "config/components-json",
      "components.json",
      null,
      "tsx false",
    );
  const a = cj.aliases ?? {};
  for (const [chave, re] of Object.entries(ALIASES_ESPERADOS)) {
    if (!re.test(String(a[chave] ?? ""))) {
      add(
        violacoes,
        "config/alias",
        "components.json",
        null,
        `aliases.${chave} = "${a[chave]}"`,
      );
    }
  }
}

/** O CSS global e os arquivos que ele importa por caminho relativo. */
export function cssComImports(raiz, rel, vistos = new Set()) {
  if (vistos.has(rel) || !existsSync(path.join(raiz, rel))) return [];
  vistos.add(rel);
  const css = semComentariosCss(readFileSync(path.join(raiz, rel), "utf8"));
  const saida = [{ rel, css }];
  for (const m of css.matchAll(/@import\s+["'](\.{1,2}\/[^"']+\.css)["']/g)) {
    const proximo = path.posix.normalize(
      path.posix.join(path.posix.dirname(rel), m[1]),
    );
    saida.push(...cssComImports(raiz, proximo, vistos));
  }
  return saida;
}

function conferirCss(projeto, violacoes, arquivosDoProjeto) {
  if (!projeto.css) {
    add(violacoes, "css/base", "(CSS global)", null, "não achei o CSS global");
    return;
  }
  const doGlobal = cssComImports(projeto.raiz, projeto.css);
  const junto = doGlobal.map((c) => c.css).join("\n");
  for (const marca of MARCAS_BASE) {
    if (!junto.includes(marca))
      add(violacoes, "css/base", projeto.css, null, `falta ${marca}`);
  }
  const escopo = escopoDoApp(projeto);
  const todos = arquivosDoProjeto.filter(
    (r) => r.endsWith(".css") && (escopo(r) || r === projeto.css),
  );
  for (const rel of todos) {
    const css = semComentariosCss(
      readFileSync(path.join(projeto.raiz, rel), "utf8"),
    );
    for (const m of css.matchAll(/font-feature-settings\s*:/g)) {
      add(
        violacoes,
        "css/fonte",
        rel,
        linhaDe(css, m.index),
        "font-feature-settings",
      );
    }
    for (const m of css.matchAll(/--font-sans\s*:\s*([^;]+);/g)) {
      if (!/^\s*["']Inter Variable["']/.test(m[1])) {
        add(
          violacoes,
          "css/fonte",
          rel,
          linhaDe(css, m.index),
          `--font-sans: ${m[1].trim().slice(0, 40)}`,
        );
      }
    }
    for (const m of css.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/g)) {
      const spec = m[1];
      const fonte = /font|inter|googleapis/i.test(spec);
      const permitida =
        /^@fontsource-variable\/(inter|geist-mono|host-grotesk)/.test(spec);
      if (fonte && !permitida)
        add(violacoes, "css/fonte", rel, linhaDe(css, m.index), spec);
    }
  }
}

function conferirDeps(projeto, violacoes) {
  for (const nome of Object.keys(projeto.deps)) {
    if (DEPS_PROIBIDAS.some((re) => re.test(nome))) {
      add(violacoes, "deps/proibida", "package.json", null, nome);
    }
  }
}

async function conferirRegistry(
  projeto,
  registry,
  violacoes,
  arquivosDoProjeto,
) {
  const itens = await registry.itens();
  const nomesUi = new Set(
    itens.filter((i) => i.type === "registry:ui").map((i) => i.name),
  );
  const doLume = itensDoLume(itens, projeto);
  const instalados = new Map();
  for (const item of itens) {
    if (!doLume.has(item.name)) continue;
    for (const arquivo of item.files ?? []) {
      const destino = caminhoInstalado(arquivo, item.type, projeto);
      if (!destino) continue;
      if (!instalados.has(destino)) instalados.set(destino, []);
      instalados.get(destino).push({ item: item.name, path: arquivo.path });
    }
  }
  const existentes = [...instalados.keys()].filter((d) =>
    existsSync(path.join(projeto.raiz, d)),
  );
  await emLotes(existentes, 8, async (destino) => {
    const prefixos = projeto.prefixosLocais;
    const local = normalizar(
      readFileSync(path.join(projeto.raiz, destino), "utf8"),
      prefixos,
    );
    for (const cand of instalados.get(destino)) {
      const json = await registry.item(cand.item);
      const f = (json.files ?? []).find((x) => x.path === cand.path);
      if (f && normalizar(f.content ?? "", prefixos) === local) return;
    }
    const itensDoArquivo = instalados
      .get(destino)
      .map((c) => c.item)
      .join(" ou ");
    add(
      violacoes,
      "ui/editado",
      destino,
      null,
      `difere de ${itensDoArquivo} da v${registry.versao}`,
    );
  });

  const extras = projeto.lumeJson?.extras ?? {};
  const prefixoUi = `${projeto.dirUi}/`;
  for (const rel of arquivosDoProjeto) {
    if (
      !rel.startsWith(prefixoUi) ||
      !CODIGO.test(rel) ||
      NAO_ESCANEAR.test(rel)
    )
      continue;
    const nome = path.posix.basename(rel).replace(CODIGO, "");
    if (instalados.has(rel) || extras[nome]) continue;
    add(violacoes, "ui/fora-da-registry", rel, null, nome);
  }

  const porPasta = new Map();
  for (const rel of arquivosDoProjeto) {
    if (!CODIGO.test(rel) || rel.startsWith(prefixoUi) || instalados.has(rel))
      continue;
    const nome = path.posix.basename(rel).replace(CODIGO, "");
    if (!nomesUi.has(nome)) continue;
    const pasta = path.posix.dirname(rel);
    if (!porPasta.has(pasta)) porPasta.set(pasta, []);
    porPasta.get(pasta).push(rel);
  }
  for (const [pasta, arquivos] of porPasta) {
    if (arquivos.length >= 4) {
      add(
        violacoes,
        "ui/paralelo",
        pasta,
        null,
        `${arquivos.length} primitivos com nome do lume`,
      );
    }
  }
  return { instalados };
}

function conferirCodigo(projeto, instalados, violacoes, arquivosDoProjeto) {
  const escopo = escopoDoApp(projeto);
  const prefixoUi = `${projeto.dirUi}/`;
  for (const rel of arquivosDoProjeto) {
    if (!CODIGO.test(rel) || NAO_ESCANEAR.test(rel) || !escopo(rel)) continue;
    if (rel.startsWith(prefixoUi) || instalados.has(rel)) continue;
    const bruto = readFileSync(path.join(projeto.raiz, rel), "utf8");
    const linhas = bruto.split("\n");
    const codigo = semComentarios(bruto);
    const excecao = (linha) =>
      EXCECAO.test(linhas[linha - 1] ?? "") ||
      EXCECAO.test(linhas[linha - 2] ?? "");
    for (const m of codigo.matchAll(IMPORTS_PROIBIDOS)) {
      const linha = linhaDe(codigo, m.index);
      if (!excecao(linha)) add(violacoes, "codigo/import", rel, linha, m[1]);
    }
    for (const [regra, re] of PADROES_CODIGO) {
      for (const m of codigo.matchAll(re)) {
        const linha = linhaDe(codigo, m.index);
        if (!excecao(linha)) add(violacoes, regra, rel, linha, m[0]);
      }
    }
  }
}

/**
 * Confere o projeto em `raiz`. `versao` vem do lume.json (ou do argumento) e
 * escolhe a tag da registry contra a qual os arquivos são comparados.
 */
export async function conferir(raiz, opcoes = {}) {
  const lido = lerProjeto(raiz);
  // Com o alias desviado (components/lume/ui, components/ds), a conferência
  // usa as pastas padrão: é lá que o lume tem que estar.
  const projeto = {
    ...lido,
    dirUi: /\/components\/ui$/.test(
      lido.componentsJson?.aliases?.ui ?? "@/components/ui",
    )
      ? lido.dirUi
      : `${lido.prefixo}components/ui`,
    dirComponentes: /\/components$/.test(
      lido.componentsJson?.aliases?.components ?? "@/components",
    )
      ? lido.dirComponentes
      : `${lido.prefixo}components`,
  };
  const violacoes = [];
  const versao =
    opcoes.versao ?? projeto.lumeJson?.versao ?? opcoes.versaoPadrao;
  conferirConfig(projeto, violacoes);
  const arquivos = listar(raiz);
  conferirCss(projeto, violacoes, arquivos);
  conferirDeps(projeto, violacoes);
  const registry = criarRegistry(versao, opcoes.buscar);
  registry.versao = versao;
  const { instalados } = await conferirRegistry(
    projeto,
    registry,
    violacoes,
    arquivos,
  );
  conferirCodigo(projeto, instalados, violacoes, arquivos);
  return {
    ok: violacoes.length === 0,
    adotou: adotouLume(projeto),
    versao,
    layout: projeto.lumeJson?.layout ?? null,
    violacoes,
  };
}

/** Relatório legível, agrupado por regra, com até `max` ocorrências cada. */
export function relatorio(resultado, max = 15) {
  if (resultado.ok) {
    return `lume check: tudo certo (v${resultado.versao}, layout ${resultado.layout}).`;
  }
  const porRegra = new Map();
  for (const v of resultado.violacoes) {
    if (!porRegra.has(v.regra)) porRegra.set(v.regra, []);
    porRegra.get(v.regra).push(v);
  }
  const linhas = [
    `lume check: ${resultado.violacoes.length} violações em ${porRegra.size} regras (v${resultado.versao}).`,
    "",
  ];
  for (const [regra, lista] of porRegra) {
    linhas.push(`${regra} (${lista.length}): ${REGRAS[regra] ?? ""}`);
    for (const v of lista.slice(0, max)) {
      const onde = v.linha ? `${v.arquivo}:${v.linha}` : v.arquivo;
      linhas.push(`  ${onde}${v.trecho ? `  ${v.trecho}` : ""}`);
    }
    if (lista.length > max) linhas.push(`  ... e mais ${lista.length - max}`);
    linhas.push("");
  }
  linhas.push(
    "Exceção de código, quando a regra não cabe de verdade: comentário `lume:excecao motivo=<o porquê>` na linha ou na de cima.",
  );
  return linhas.join("\n");
}
