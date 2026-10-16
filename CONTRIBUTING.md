# Contribuindo com o lume

O lume é a base pública: tokens, primitivos, blocos, guia e skill com a cara do
Foglamp. Quem usa o lume num produto (Ashmont, pessoal, Lyx) e melhora algo
geral traz a melhoria para cá. O que é de marca ou de regra interna fica na
camada do produto (na Lyx, o repo `Lyx-Engenharia/lyx-ds`).

## Fluxo de upstream

1. A melhoria nasce no produto, validada em tela de verdade.
2. Abre PR aqui com o que é geral. O template da PR pede: dois temas, 1440 e
   390, reduced motion, `check` verde, linha no `CHANGELOG.md`, sem `lucide`,
   sem `asChild`, sem hex, cabeçalho de atribuição em arquivo derivado.
3. Cor nova, variant nova ou componente novo abre issue antes de codar
   ("levante antes de contornar"): o look é cinza estrutural com cor só por
   significado, e cada acréscimo precisa caber nisso.
4. Depois do merge, o produto atualiza com `npx shadcn@latest add
   joaodadas/lume/<item>#vX.Y.Z --diff` para ver e `--overwrite` para aplicar.

## Como rodar

```bash
bun install
bun run dev              # site de vitrine em http://localhost:3000
bun run typecheck        # tsc --noEmit
bun run lint             # biome check
bun run check            # scripts/check.ts (12 verificações, inclui next build)
bun run check --no-build # só as verificações estáticas
```

`bun run check` acumula todas as falhas e imprime agrupado por verificação com
`arquivo:linha`. Use `--only 2,5` para rodar só algumas.

## Como adicionar um item

1. Crie o arquivo em `registry/base-vega/{ui,components,lib,hooks,blocks/<bloco>}/`.
   Imports entre arquivos da registry sempre `@/registry/base-vega/<pasta>/<x>`;
   import relativo só entre arquivos do mesmo bloco. Nada de `next/*` fora de
   item `nextOnly`; navegação pelo `Link` de
   `@/registry/base-vega/components/link`.
2. Classes: tokens, nunca hex; separação por `shadow-(--custom-shadow)`, nunca
   `border` fechando caixa (as exceções estão em `scripts/check-allow.txt`, cada
   uma com o motivo). Ícones só de `@tabler/icons-react`.
3. Adicione os metadados em `registry/items.ts` (name, title, description em
   pt-BR, group, tier, files com `target` quando o arquivo está em
   `blocks/<bloco>/`, e só o que o import não revela: `dependencies`,
   `registryDependencies`, `css`, `nextOnly`).
4. `bun run registry:build` regenera `registry.json` e `public/r`; commite os
   dois. Nunca edite `registry.json` à mão.
5. Se o arquivo deriva do Foglamp ou do painel do lyx-pr-agent, comece com:

   ```ts
   // Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, <caminho upstream> @ 2bc3bb5), Apache-2.0.
   // Modificado por joaodadas/lume: <resumo das mudanças>.
   ```

   Arquivo novo começa com um comentário de uma linha dizendo o que é.
6. Mostre o item na vitrine (`app/componentes` ou `app/blocos`) e cite no guia
   quando ele cria regra nova.

## Como sincronizar com o Foglamp

Os 56 primitivos, o `use-mobile` e o fork do evilcharts são cópias verbatim do
Foglamp com imports reescritos, patches fixos e cabeçalho de atribuição.

```bash
git clone --depth 1 https://github.com/foglamp-labs/foglamp /tmp/foglamp
bun run sync:upstream            # simulação: lista o que mudaria
bun run sync:upstream -- --apply # grava e atualiza scripts/upstream-map.json
```

Depois do `--apply`: revise o diff item a item, rode `bun run registry:build`
e `bun run check`, atualize a lista de arquivos em `THIRD_PARTY_NOTICES.md` e
registre o commit sincronizado na seção Upstream do `CHANGELOG.md`.

## Como lançar

```bash
bun scripts/release.ts 0.2.0 --dry-run # só valida
bun scripts/release.ts 0.2.0           # lança
```

A release exige árvore limpa, `check` verde, `gh` autenticado e a seção
`## [0.2.0]` no `CHANGELOG.md`. Ela grava a versão no `package.json`, regenera
`registry.json` (as tags das `registryDependencies` mudam), `public/r` e a
skill, commita `release: v0.2.0` (sem `Co-Authored-By`), cria a tag anotada com
a seção do changelog, faz push e cria a GitHub Release a partir da tag.

## Regras de texto

- Português do Brasil, direto. Sem travessão nem meia-risca (o `check` barra);
  use vírgula, dois pontos ou ponto.
- Identificadores, classes, props e nomes de arquivo em inglês. "AI", nunca "IA".
- Comentários do autor original ficam em inglês; os seus, em pt-BR.
- Rótulos e textos de UI em pt-BR.
