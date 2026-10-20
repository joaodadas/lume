# 13. Cor e tipografia: tabelas para agentes

Origem: adição do lume, a partir das classes de `registry/base-vega/`. Este capítulo é a versão para agentes, só tabelas e snippets, e vira a skill. A versão para pessoas, com exemplo, faça e evite, é a página `/fundacoes` do site (`app/fundacoes/page.tsx`), e o `/guia` leva para ela. Valores dos tokens e carregamento das fontes: [01-fundacoes](./01-fundacoes.md).

![Página visual Fundações, light, 1440](https://raw.githubusercontent.com/joaodadas/lume/main/docs/verificacao/v0.2.1/fundacoes-light-1440.png)

## Escala neutra

<!-- skill:start -->
| Papel | Classe | Light | Dark |
|---|---|---|---|
| Canvas atrás do inset | `bg-sidebar` | 0.975 | 0.145 (950) |
| Página | `bg-background` | 0.99 | 0.17 |
| Superfície | `bg-card`, `bg-popover` | branco | 0.205 (900) |
| Chip, skeleton, código | `bg-muted` | 100 | 800 |
| Hover | `hover:bg-muted/50`, `dark:hover:bg-muted` | 100 a 50% | 800 |
| Item ativo | `data-active:bg-sidebar-accent/70`, `dark:data-active:bg-sidebar-accent/50` | 0.95 a 70% | 800 a 50% |
| Divisória | `border-border/40`, `border-border/50` | 200 | branco a 10% |
| Aresta de superfície | `shadow-(--custom-shadow)` | anel 0.5px a 6% | inset branco a 3% |
| Anel de foco | `focus-visible:ring-[1.5px] focus-visible:ring-ring/50` | 400 a 50% | 500 a 50% |
| Sólido | `bg-neutral-800 dark:bg-neutral-100` | 800 | 100 |
| Texto secundário | `text-muted-foreground` | 500 | 400 |
| Placeholder, meta | `text-muted-foreground/50` | 500 a 50% | 400 a 50% |
| Texto principal | `text-foreground` | 950 | 50 |
<!-- skill:end -->

## Escala cromática

<!-- skill:start -->
| Papel | Light | Dark | Onde |
|---|---|---|---|
| Fundo translúcido | `bg-{c}-500/10` | `dark:bg-{c}-500/15` | `registry/base-vega/ui/badge.tsx:21-36` |
| Hover do fundo | `[a]:hover:bg-{c}-500/20` | igual | `registry/base-vega/ui/badge.tsx:21-36` |
| Fundo opaco (tile) | `bg-{c}-100` | `dark:bg-{c}-950` | `registry/base-vega/blocks/app-shell/nav.ts:39-53` |
| Aresta | `shadow-[var(--custom-shadow-{c})]` | o token flipa | `registry/base-vega/ui/badge.tsx:21-36` |
| Aresta de erro em chip | `border-{c}-500/40` | `dark:shadow-[0_0_0_1px_rgba(R,G,B,0.4)]` | `registry/base-vega/components/context-chip.tsx:20-22` |
| Anel de foco | `focus-visible:ring-{c}-500/20` | `dark:focus-visible:ring-{c}-500/40` | `registry/base-vega/ui/badge.tsx:21-36` |
| Sólido: ícone, ponto, barra | `text-{c}-500`, `bg-{c}-500` | igual | `registry/base-vega/components/span-type.tsx:46-49` |
| Texto na página | `text-{c}-600` | `dark:text-{c}-400` | `registry/base-vega/components/context-chip.tsx:20` |
| Texto sobre fundo tingido | `text-{c}-700` | `dark:text-{c}-300`; rose e red `-400` | `registry/base-vega/ui/badge.tsx:21-36` |
| Parágrafo em caixa tingida | `text-{c}-900` | `dark:text-{c}-200` | `registry/base-vega/components/notice.tsx:22-32` |

- Espelho no dark: 100 e 950, 600 e 400, 700 e 300, 900 e 200; fundo 10% vira 15%, anel 20% vira 40%; 500 não muda.
- Sem papel: `-50`, `-200` e `-800` como fundo ou borda; `-300` e `-400` no light; `-600` e `-700` no dark.
- Exceções da registry: badge orange (`text-orange-600`, `dark:text-orange-400`), delta do `StatCard` (`text-emerald-600 dark:text-emerald-500`, `text-red-500`).
<!-- skill:end -->

## Cores que existem

<!-- skill:start -->
| Cor | Significado | `Badge variant` | `--custom-shadow-{c}` | Tile |
|---|---|---|---|---|
| emerald | ok, pass, embedding | sim | sim | sim |
| green | ponta boa da escala de calor | sim | sim | não |
| rose | erro, falha | sim | sim | sim |
| red | contagem de erro em célula | sim | sim | não |
| amber | aviso, abortado, agente | sim | sim | sim |
| orange | agentes | sim | sim | sim |
| yellow | alertas | não | não | sim |
| violet | llm | sim | sim | sim |
| blue | tool | sim | sim | sim |
| sky | sessões | sim | sim | sim |
| fuchsia | evals | sim | sim | sim |
| lime | varia por run | não | não | não |

- Erro de interface: `text-destructive`, `bg-destructive/10`, nunca rose ou red.
- Série sem significado: `--chart-1..5`. Cor nova: issue antes (`CONTRIBUTING.md`).
<!-- skill:end -->

## Estados

<!-- skill:start -->
| Estado | Cinza | Cor |
|---|---|---|
| Hover | `hover:bg-muted/50`, `dark:hover:bg-muted` | `[a]:hover:bg-{c}-500/20` |
| Aberto | `aria-expanded:bg-muted/50`, `dark:aria-expanded:bg-muted` | sem uso |
| Selecionado | `data-active:bg-sidebar-accent/70` | sem uso |
| Foco | `focus-visible:ring-[1.5px] focus-visible:ring-ring/50` | `focus-visible:ring-{c}-500/20` |
| Inválido | `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20` | só `destructive` |
| Desabilitado | `disabled:opacity-50` | `disabled:opacity-50` |
| Item destrutivo de menu | `focus:bg-destructive/10` | sem uso |
<!-- skill:end -->

## Famílias

<!-- skill:start -->
| Família | Utility | Papel | Nunca |
|---|---|---|---|
| Inter Variable | `font-sans` | todo texto do app | outra sans |
| Inter como heading | `font-heading` | título de Card, Dialog, Sheet, Drawer, Empty | texto que não é título |
| Host Grotesk Variable | `font-display` | marketing e título do site | dentro do app |
| Geist Mono Variable | `font-mono` | id, chave, código, eyebrow | número de tabela |
<!-- skill:end -->

## Tamanhos

<!-- skill:start -->
| Classe | px | Papel |
|---|---|---|
| `text-[10px]` | 10 | badge `sm` |
| `text-[11px]` | 11 | eyebrow mono (site e Foglamp) |
| `text-xs` | 12 | meta, legenda, descrição curta, badge `md`, tooltip, delta |
| `text-[13px]` | 13 | valor denso de painel (Foglamp) |
| `text-sm` | 14 | corpo, rótulo, título de seção, título de card `sm` |
| `text-base` | 16 | título de página, card e dialog; input abaixo de `md` |
| `text-lg` | 18 | título de passo do `login-form`, corpo de marketing |
| `text-xl` | 20 | título de auth |
| `text-3xl`, `text-4xl` | 30, 36 | display com `font-display`, fora do app |
<!-- skill:end -->

## Papéis tipográficos

<!-- skill:start -->
| Papel | Classe | Onde |
|---|---|---|
| Título de página | `text-base font-medium tracking-tight` | `registry/base-vega/components/page-header.tsx:84` |
| Título de card | `font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm` | `registry/base-vega/ui/card.tsx:43` |
| Título de dialog | `font-heading leading-none font-medium text-base` | `registry/base-vega/ui/dialog.tsx:126` |
| Título de seção | `text-sm font-medium` | `registry/base-vega/components/section.tsx:27` |
| Título de vazio | `font-heading text-sm font-medium tracking-tight` | `registry/base-vega/ui/empty.tsx:65` |
| Título de auth | `text-xl font-medium text-balance` | `registry/base-vega/blocks/login-form/login-form.tsx:200` |
| Texto de apoio | `text-sm text-muted-foreground text-balance` | `registry/base-vega/ui/card.tsx:55` |
| Descrição curta | `text-xs text-muted-foreground text-pretty` | `registry/base-vega/components/section.tsx:29` |
| Descrição de vazio | `text-xs/relaxed text-muted-foreground` | `registry/base-vega/ui/empty.tsx:78` |
| Rótulo de campo | `text-sm leading-none font-medium` | `registry/base-vega/ui/label.tsx:14` |
| Valor de métrica | `tracking-tight tabular-nums` | `registry/base-vega/components/stat-card.tsx:134` |
| Delta | `text-xs font-[470] tabular-nums` | `registry/base-vega/components/stat-card.tsx:204` |
| Número em coluna | `text-right tabular-nums` | `registry/base-vega/ui/table.tsx:20` |
| Código e id | `font-mono text-xs text-foreground` | `registry/base-vega/components/rolling-text.tsx:65` |
| Link em texto | `font-medium text-primary underline underline-offset-2` | `registry/base-vega/components/markdown-components.tsx:25` |
| Tecla | `Kbd` | `registry/base-vega/ui/kbd.tsx:10` |
| Eyebrow | `font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase` | site, `app/guia/page.tsx:50` |
| Display | `font-display text-3xl font-[450] tracking-[-0.025em] text-balance` | site, `app/guia/page.tsx:22` |

| Eixo | Com papel | Fora |
|---|---|---|
| Peso | `font-normal`, `font-medium` (teto do app), `font-[470]` (delta), `font-[450]` (display) | `font-light`, `font-semibold`, `font-bold` |
| Tracking | `tracking-tight` em título e valor; `tracking-[0.18em]` só com `uppercase` | tracking positivo em minúscula |
| Entrelinha | `leading-none` em uma linha; `text-xs/relaxed` em várias | `leading-loose` |
| Quebra | `text-balance` em título, `text-pretty` em parágrafo, `truncate` em célula | `<br>` manual |
<!-- skill:end -->

## Snippets de layout

<!-- skill:start -->
Coluna da página (`registry/base-vega/blocks/app-shell/app-shell.tsx:238`):

```tsx
<div className="flex flex-col gap-4 py-6 px-0 pb-16">{children}</div>
```

Cabeçalho de seção (`registry/base-vega/components/section.tsx:24-31`):

```tsx
<section className="flex flex-col gap-3">
  <div className={cn("flex flex-wrap items-end justify-between gap-2", PX)}>
    <div className="flex flex-col gap-0.5">
      <h2 className="text-sm font-medium">Uso por modelo</h2>
      <p className="text-xs text-muted-foreground text-pretty">Últimos 30 dias</p>
    </div>
    <Button variant="outline" size="sm">Exportar</Button>
  </div>
</section>
```

Grade de métricas (`registry/base-vega/components/stat-grid.tsx:24-31`, ou o item `stat-grid`):

```tsx
<section className={cn("@container", PX)}>
  <div className="grid gap-4 @lg:grid-cols-2 @min-[62rem]:grid-cols-4">{statCards}</div>
</section>
```

Linha e pilha:

```tsx
<div className="flex items-center gap-2">{iconAndText}</div>
<div className="flex min-w-0 flex-col gap-1">{labelAndValue}</div>
```
<!-- skill:end -->

## Snippets de texto

<!-- skill:start -->
```tsx
<h1 className="text-base font-medium tracking-tight">Traces</h1>
<h2 className="text-sm font-medium">Uso por modelo</h2>
<p className="text-sm text-muted-foreground text-balance">Texto de apoio.</p>
<p className="text-xs text-muted-foreground text-pretty">Legenda.</p>
<span className="text-sm tabular-nums">{formatCount(1234)}</span>
<span className="text-xs text-muted-foreground/50">{EMPTY}</span>
<code className="font-mono text-xs text-foreground">tr_8f2a91</code>
<CodeBlock code={payload} lang="json" />
```

Citação (adição do lume; a aresta é divisor, não caixa):

```tsx
<blockquote className="border-l-2 border-border/50 pl-3 text-sm text-muted-foreground text-pretty">
  A frase citada.
</blockquote>
```
<!-- skill:end -->

## O que não copiar

Do Radix Themes: `Flex`, `Grid`, `Container`, `Box`, `Text`, `Heading`, `Code` e `Quote` como componentes, as variáveis `--accent-1..12` e `--gray-1..12` e o `Theme` configurável. Da paleta: degrau sem papel, cor sem significado fixo, `slate`, `gray`, `zinc` e `stone`. Da tipografia: `text-2xl`, `font-bold` e `font-semibold` no app, mono para alinhar número, `font-display` dentro do produto.
