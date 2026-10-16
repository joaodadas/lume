# lume: regras para agentes

Registry shadcn + guia + skill com a cara do Foglamp (Apache-2.0, Gustavo Fior).
Next 16 na raiz, bun, Biome, Tailwind 4, shadcn `base-vega` sobre
`@base-ui/react`, ícones `@tabler/icons-react`. As regras de design estão em
`FRONTEND.md` e o guia longo em `docs/guia/`. Leia `CONTRIBUTING.md` antes de
adicionar item.

## Código

- Imports entre arquivos da registry sempre `@/registry/base-vega/ui/<x>`,
  `@/registry/base-vega/lib/<x>`, `@/registry/base-vega/hooks/<x>`,
  `@/registry/base-vega/components/<x>`. Nunca `@/components`, `@/lib`,
  `@/hooks`, `@foglamp/*`. Relativo só entre arquivos do mesmo
  `blocks/<bloco>/`.
- `next/*` só em item marcado `nextOnly` em `registry/items.ts` (`link-next`).
  Navegação em bloco vai pelo `Link` de `@/registry/base-vega/components/link`;
  rotas por string, nunca o tipo `Route`.
- `cn` vem de `@/registry/base-vega/lib/utils`. Ícones só de
  `@tabler/icons-react` (filled quando existe). Nada de lucide, react-icons,
  phosphor, heroicons.
- Nenhum hex em className ou style: tokens (`bg-card`,
  `text-muted-foreground/50`, `shadow-(--custom-shadow)`). Hex só em
  `registry/base-vega/styles/globals.css`.
- Separação por `shadow-(--custom-shadow)`, nunca `border` fechando caixa.
  `border` só em linha de tabela, divisor interno e no Empty tracejado
  (allowlist com motivo em `scripts/check-allow.txt`).
- Base UI usa `render`, não `asChild`. Classes do Foglamp ficam verbatim salvo
  generalização pedida; comentários do autor em inglês, os seus em pt-BR.
- `"use client"` em arquivo com hook, handler ou motion; não em lib que só
  exporta constantes e funções.

## Registry

- `registry.json` e `public/r` são GERADOS: nunca edite à mão. Metadados em
  `registry/items.ts`, depois `bun run registry:build` e commite a saída.
- Arquivo derivado do Foglamp (ou do painel do lyx-pr-agent) começa com
  `// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, <caminho upstream> @ 2bc3bb5), Apache-2.0.`
  e `// Modificado por joaodadas/lume: <resumo>.`; evilcharts começa com
  `// Evil Charts`. `scripts/upstream-map.json` lista as cópias verbatim e é
  gerado por `bun run sync:upstream -- --apply`.
- Dependência nova não entra sem combinar: liste no PR o que falta.

## Antes de entregar

- `bun run typecheck`, `bun run lint`, `bun run check` (ou `--no-build` para a
  parte estática). O check lista todas as falhas com `arquivo:linha`.
- Texto em pt-BR, sem travessão nem meia-risca (o check barra em docs, README,
  CHANGELOG, CONTRIBUTING, FRONTEND.md e skills). "AI", nunca "IA".
- Commit sem `Co-Authored-By`. Release só por `bun scripts/release.ts <versão>`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
