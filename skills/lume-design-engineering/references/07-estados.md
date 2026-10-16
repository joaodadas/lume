# Estados: loading, vazio, erro e toasts

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/03-shell-e-paginas.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Loading, vazio e erro

<!-- mapa: 8.9, 6.7, 13.8 | regras 15, 22 -->

- **Always** atrase o skeleton com `useDelayedLoading(loading, 700)` (`registry/base-vega/hooks/use-delayed-loading.ts:16`) e renderize `null` antes disso, nunca o empty state; skeleton só no corpo da tabela (`TableRowsSkeleton` com a mesma `rowHeight` das linhas reais) ou no valor do StatCard (`Skeleton className="h-3 w-20"` ao lado de um zero-width space que segura a line box).
- **Always** use `Skeleton` (`animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted`, `registry/base-vega/ui/skeleton.tsx:10`; `bg-muted-foreground/15` dentro de superfície já `bg-muted`; `rounded-full squircle:rounded-full` para círculos), `Spinner` (`IconLoader size-4 animate-spin role="status"`) e `TextShimmerLoader` para "o modelo está pensando".
- **Always** use `placeholderData: (prev) => prev` em toda lista, para refetch não regredir a skeleton nem piscar o vazio.
- **Always** trate "não existe" como `EmptyState` (`Empty className="border border-dashed"`, `EmptyMedia variant="icon"` com o ícone em `opacity-40`, título `font-heading text-sm font-medium tracking-tight`, descrição `text-xs/relaxed text-muted-foreground`) em wrapper `mt-2 px-8`, com mensagem diferente quando há filtro ativo.
- **Always** trate erro de dado como toast com ação de retry (`QueryCache.onError`) e, no App Router, um `error.tsx` mínimo por grupo de rotas: cartão centrado com `BrandMark`, `h1 text-lg font-medium`, `p text-sm text-muted-foreground` e `Button variant="secondary"` "Tentar de novo" (adição do lume; o Foglamp não tem `error.tsx`).
- **Never** renderize a string "Carregando..." crua, nem um erro em dialog, nem um skeleton que mude de tamanho quando o dado chega.

Porquê: abaixo de 700ms o skeleton só piscaria; o que pinta primeiro no slot leva o fade e a troca skeleton para dado é instantânea; sem `error.tsx` uma exceção no render cai na página padrão do Next.

## Toasts

<!-- mapa: 6.7.3, 12.12 | regras 22 -->

- **Always** monte um único `<Toaster />` no root (item `sonner`): ícones Tabler filled de 16px, só success verde e error vermelho, `--normal-bg: var(--popover)`, raio `--radius`, tema do `useTheme`.
- **Always** centralize erro de query em `QueryCache.onError` junto do `QueryClient` (`toast.error(error.message, { action: { label: "tentar de novo", onClick: query.invalidate } })`, apps/web/src/utils/trpc.ts:21-31) e, no lume, também `MutationCache.onError` global (adição do lume; o Foglamp repete `onError: (e) => toast.error(e.message)` em 22 mutations).
- **Always** escreva sucesso curto e nominal, sem ponto final: "Projeto criado", "Convite enviado", "Chave revogada".
- **Never** use `alert()`, toast para cópia (o ícone vira check), para abrir dialog ou trocar aba, nem `richColors`/`closeButton`.

Porquê: toast é feedback de rede e de mutation; o resto da interface já confirma pelo próprio estado.

## Do guia: 03. Shell, navegação e páginas de lista

### Loading e erro

- `useDelayedLoading(loading, 700)` (`use-delayed-loading`): skeleton só após 700 ms contínuos; antes disso renderize `null`, nunca o empty state (hooks.ts:13-24). Só o `TableBody` espera; toolbar e cabeçalhos pintam na hora, mesmo com resultado vazio ("um range vazio precisa do range picker para escapar").
- `useEntranceOnce()` (`use-entrance-once`): flag de módulo; só a primeira página após hard load ganha `.page-fade-in { animation: page-fade-in 75ms ease-out }`, só opacidade, `none` em `prefers-reduced-motion` (index.css:66-81). O `PageHeader` fica num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o loading.tsx repete.
- `useSkeletonShown(showing)`: latch; quem pinta primeiro ganha o fade, a troca skeleton para dado é instantânea (`entrance && !skeletonShown && "page-fade-in"`).
- `useQuery` com `placeholderData: (prev) => prev` em toda lista: a página atual fica visível enquanto a próxima carrega; mudar range não regride para skeleton.
- Erro de dados é toast com retry (`QueryCache.onError`); "não existe" é `EmptyState` tracejado ("Trace not found", "No turns in this session"); nenhum client lê `isError`. O Foglamp não tem `error.tsx`; o lume adiciona um `error.tsx` mínimo com `EmptyState` + `Button variant="outline"` "Tentar de novo" (adição do lume).
