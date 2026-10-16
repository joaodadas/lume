// /llms.txt (https://llmstxt.org): o índice que um agente encontra ao cair em
// lume-ashmont.vercel.app. Título, descrição, os três comandos de instalação, links
// para o FRONTEND.md cru e para o GitHub, e a lista de itens da registry lida
// de registry.json (nome, tipo, descrição, URL do JSON). Molde: o llms.txt do
// Foglamp (apps/web/src/app/llms.txt/route.ts). Sem request nem relógio, o
// Cache Components pré-renderiza o GET em build (o config
// `dynamic = "force-static"` não é aceito com cacheComponents).
import pkg from "@/package.json";
import registry from "@/registry.json";

const SITE_URL = "https://lume-ashmont.vercel.app";
const GITHUB_URL = "https://github.com/joaodadas/lume";

type Item = {
  name: string;
  type: string;
  title?: string;
  description?: string;
};

// Ordem e rótulo de cada tipo da registry no índice.
const TIPOS: { tipo: string; rotulo: string }[] = [
  { tipo: "registry:base", rotulo: "Base" },
  { tipo: "registry:ui", rotulo: "Primitivos (ui)" },
  { tipo: "registry:component", rotulo: "Componentes" },
  { tipo: "registry:block", rotulo: "Blocos" },
  { tipo: "registry:lib", rotulo: "Lib" },
  { tipo: "registry:hook", rotulo: "Hooks" },
  { tipo: "registry:item", rotulo: "Outros itens" },
];

function linhaDoItem(item: Item) {
  const descricao = (item.description ?? "").replace(/\s+/g, " ").trim();
  return `- [${item.name}](${SITE_URL}/r/${item.name}.json): ${item.type}${
    descricao ? `. ${descricao}` : ""
  }`;
}

function secoesDaRegistry(itens: Item[]) {
  const vistos = new Set<string>();
  const secoes: string[] = [];
  for (const { tipo, rotulo } of TIPOS) {
    const doTipo = itens.filter((i) => i.type === tipo);
    if (doTipo.length === 0) continue;
    for (const i of doTipo) vistos.add(i.name);
    secoes.push(`### ${rotulo}\n${doTipo.map(linhaDoItem).join("\n")}`);
  }
  const resto = itens.filter((i) => !vistos.has(i.name));
  if (resto.length > 0)
    secoes.push(`### Demais\n${resto.map(linhaDoItem).join("\n")}`);
  return secoes.join("\n\n");
}

const itens = registry.items as Item[];
const v = pkg.version;

const BODY = `# lume

> Design system com a cara do Foglamp (github.com/foglamp-labs/foglamp, Apache-2.0): tokens oklch em cinza, sombra no lugar de borda, squircle, botões em pílula, tabelas densas e movimento contido. Componentes, blocos, guia e skill de agente, instaláveis por registry shadcn (base-vega sobre Base UI, ícones Tabler, Tailwind 4). Versão ${v}.

## Instalação
\`\`\`bash
npx shadcn@latest init joaodadas/lume/base#v${v} -y
npx shadcn@latest add joaodadas/lume/kit-shell#v${v}
npx skills add joaodadas/lume --skill lume-design-engineering
\`\`\`

Sem \`-d\` no init: o \`-d\` ignora o \`base\` e instala o style padrão por cima.

## Leia antes de escrever uma tela
- [FRONTEND.md cru](${SITE_URL}/guia.md): as regras duras do design system, em Markdown, para dev e agente.
- [Guia renderizado](${SITE_URL}/guia): regras, guia longo com valores, conceitos do craft, roteiros de adoção, referências e decisões.
- [Componentes](${SITE_URL}/componentes): vitrine dos primitivos, variants e tamanhos.
- [Blocos](${SITE_URL}/blocos): o app-shell com um dashboard real dentro e as peças avulsas.
- [Repositório](${GITHUB_URL}): código, registry/items.ts, scripts e CHANGELOG.

## Itens da registry
Cada item é um JSON em \`${SITE_URL}/r/<nome>.json\`; instale com \`npx shadcn@latest add joaodadas/lume/<nome>#v${v}\`. ${itens.length} itens.

${secoesDaRegistry(itens)}

## Notas para agentes
- Imports entre arquivos instalados seguem os aliases do components.json do projeto (components/ui, lib, hooks, components).
- Base UI usa \`render\`, nunca \`asChild\`; estado por \`data-open\`, \`data-pressed\`, \`aria-expanded\`.
- Superfície separa por \`shadow-(--custom-shadow)\`, não por \`border\`; nenhum hex em className.
- Texto do projeto em pt-BR, sem travessão. "AI", nunca "IA".
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400",
    },
  });
}
