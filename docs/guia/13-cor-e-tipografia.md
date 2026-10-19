# 13. Escalas de cor e tipografia: papel de cada degrau e de cada texto

Origem: adição do lume, a partir do código de `registry/base-vega/`. O lume não tem escala de cor própria nem componente de texto: usa as paletas do Tailwind v4 e os tokens de `registry/base-vega/styles/globals.css`, e este capítulo diz qual degrau e qual classe cumprem cada papel, no vocabulário das 12 etapas do Radix Colors (fundo, elemento, hover, borda, sólido, texto) para quem chega de lá. Nenhum token novo, nenhum componente novo: os valores dos tokens e o carregamento das fontes estão em [01-fundacoes](./01-fundacoes.md), a tabela de significado em [04-dados](./04-dados.md) e no `FRONTEND.md` ("Cor com significado"). A vitrine visual é a rota `/cor-e-tipografia` do site (`app/cor-e-tipografia/page.tsx`).

![Escalas e papéis tipográficos na vitrine, light, 1440](https://raw.githubusercontent.com/joaodadas/lume/main/docs/verificacao/v0.2.1/cor-e-tipografia-light-1440.png)

![A mesma vitrine no dark, 1440](https://raw.githubusercontent.com/joaodadas/lume/main/docs/verificacao/v0.2.1/cor-e-tipografia-dark-1440.png)

## Como ler uma escala

Uma paleta do Tailwind v4 tem 11 degraus (`50`, `100` a `900` de cem em cem, `950`). O Radix Colors tem 12 e dá um papel a cada um. O lume fica no meio: usa os 11 degraus do Tailwind, mas só alguns têm papel, e o resto é proibido. Cinza é estrutura e vem dos tokens (que já são degraus da `neutral`); cor cromática é significado e vem da paleta crua, sempre em par light e dark.

| Etapa do Radix | Papel | Cinza (token) | Cor cromática (paleta) |
|---|---|---|---|
| 1 e 2 | fundo do app, fundo sutil | `bg-sidebar`, `bg-background` | nunca: cor não pinta página |
| 3 | fundo de elemento | `bg-card`, `bg-muted/50` | `-500/10` translúcido ou `-100` opaco |
| 4 | hover | `hover:bg-muted/50` | `-500/20` |
| 5 | selecionado | `bg-sidebar-accent/70` | sem uso |
| 6 e 7 | borda e anel de foco | `shadow-(--custom-shadow)`, `border-border/50`, `ring-ring/50` | `--custom-shadow-{c}`, `-500/40`, anel `-500/20` |
| 8 | borda em hover | sem uso | sem uso |
| 9 e 10 | sólido e sólido em hover | `bg-primary` | `-500` só em ícone, ponto e barra |
| 11 | texto de baixo contraste | `text-muted-foreground` | `-600` / `-400`, `-700` / `-300` |
| 12 | texto de alto contraste | `text-foreground` | `-900` / `-200` |

## Escala neutra

Os valores exatos de cada token estão em [01-fundacoes](./01-fundacoes.md#tokens-de-cor); aqui a leitura é por papel.

<!-- skill:start -->
Os tokens são degraus da paleta `neutral`. Escolha pelo papel, nunca pelo número:

| Papel | Classe | Light | Dark | Onde |
|---|---|---|---|---|
| Canvas atrás do inset | `bg-sidebar` | 0.975 | 0.145 (950) | `registry/base-vega/ui/sidebar.tsx` |
| Página | `bg-background` | 0.99 | 0.17 | `globals.css`, `html` e `body` |
| Superfície (card, popover, dialog) | `bg-card`, `bg-popover` | branco | 0.205 (900) | `registry/base-vega/ui/card.tsx:17` |
| Fundo de chip, skeleton, código | `bg-muted` | 100 | 800 | `registry/base-vega/ui/skeleton.tsx:10` |
| Hover e aberto | `hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted` | 100 a 50% | 800 | `registry/base-vega/components/context-chip.tsx:13` |
| Item ativo da navegação | `dark:data-active:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70` | 0.95 a 70% | 800 a 50% | `registry/base-vega/ui/sidebar.tsx:480` |
| Divisória | `border-border/40`, `border-border/50` | 200 | branco a 10% | `registry/base-vega/ui/table.tsx:169`, lista fechada em Onde a borda vale |
| Aresta de superfície | `shadow-(--custom-shadow)` | anel 0.5px a 6% | inset branco a 3% | `registry/base-vega/ui/card.tsx:17` |
| Anel de foco | `focus-visible:ring-[1.5px] focus-visible:ring-ring/50` | 400 a 50% | 500 a 50% | `registry/base-vega/ui/button.tsx:10` |
| Sólido (ação principal) | `bg-neutral-800 dark:bg-neutral-100` | 800 | 100 | `registry/base-vega/ui/button.tsx:15` |
| Texto secundário | `text-muted-foreground` | 500 | 400 | todo `Description` |
| Placeholder, meta, ícone apagado | `text-muted-foreground/50` | 500 a 50% | 400 a 50% | `registry/base-vega/blocks/data-table/data-table.tsx:376` |
| Texto principal | `text-foreground` | 950 | 50 | herdado do `body` |

`neutral` cru só onde o token não alcança (o sólido do Button, a gaveta de linha expandida do Foglamp, `bg-neutral-100 dark:bg-card`); `slate`, `gray`, `zinc` e `stone` nunca.
<!-- skill:end -->

## Escala cromática

<!-- skill:start -->
Seis degraus têm papel, e cada um tem o seu espelho no dark. `{c}` é uma das cores da seção seguinte. Use só estas combinações:

| Papel | Light | Dark | Onde |
|---|---|---|---|
| Fundo translúcido (badge, chip de tipo) | `bg-{c}-500/10` | `dark:bg-{c}-500/15` | `registry/base-vega/ui/badge.tsx:21-36` |
| Hover do fundo translúcido | `[a]:hover:bg-{c}-500/20` | igual | `registry/base-vega/ui/badge.tsx:21-36` |
| Fundo opaco (tile de ícone) | `bg-{c}-100` | `dark:bg-{c}-950` | `registry/base-vega/blocks/app-shell/nav.ts:39-53` |
| Aresta | `shadow-[var(--custom-shadow-{c})]` | o token já flipa | `registry/base-vega/ui/badge.tsx:21-36` |
| Aresta de erro em chip | `border-{c}-500/40` | `dark:shadow-[0_0_0_1px_rgba(R,G,B,0.4)]` | `registry/base-vega/components/context-chip.tsx:20-22` |
| Anel de foco | `focus-visible:ring-{c}-500/20` | `dark:focus-visible:ring-{c}-500/40` | `registry/base-vega/ui/badge.tsx:21-36` |
| Sólido: ícone, ponto, barra de série | `text-{c}-500`, `bg-{c}-500` | igual | `registry/base-vega/blocks/app-shell/nav.ts:39-53`, `registry/base-vega/components/span-type.tsx:46-49` |
| Texto colorido sobre a página | `text-{c}-600` | `dark:text-{c}-400` | `registry/base-vega/components/context-chip.tsx:20`, `registry/base-vega/components/span-type.tsx:73-80` |
| Texto sobre fundo tingido | `text-{c}-700` | `dark:text-{c}-300` (rose e red: `-400`; orange fica em `text-orange-600` e `dark:text-orange-400`) | `registry/base-vega/ui/badge.tsx:21-36` |
| Parágrafo em caixa tingida | `text-{c}-900` | `dark:text-{c}-200` | `registry/base-vega/components/notice.tsx:22-32` |

Regra do espelho: no dark o degrau vira o simétrico em torno do 500 (100 e 950, 600 e 400, 700 e 300, 900 e 200), o fundo translúcido sobe de 10% para 15% e o anel de foco de 20% para 40%; o 500 não muda. Degraus sem papel (`50`, `200` e `800` como fundo ou borda, `300` e `400` no light, `600` e `700` no dark) não entram em composição nova. Exceção conhecida: o delta do `StatCard` usa `text-emerald-600 dark:text-emerald-500` e `text-red-500` (`registry/base-vega/components/stat-card.tsx:206-207`).
<!-- skill:end -->

## Cores que existem

<!-- skill:start -->
O look é cinza com cor só por significado. As cores com papel são estas; cor nova abre issue antes (ver `CONTRIBUTING.md`).

| Cor | Significado | `Badge variant` | `--custom-shadow-{c}` | Tile em `nav.ts` |
|---|---|---|---|---|
| emerald | ok, pass, embedding | sim | sim | sim |
| green | ponta boa da escala de calor (`HeatCell`) | sim | sim | não |
| rose | erro, falha | sim | sim | sim |
| red | contagem de erro em célula | sim | sim | não |
| amber | aviso, abortado, agente | sim | sim | sim |
| orange | agentes | sim | sim | sim |
| yellow | alertas | não | não | sim |
| violet | llm | sim | sim | sim |
| blue | tool | sim | sim | sim |
| sky | sessões | sim | sim | sim |
| fuchsia | evals | sim | sim | sim |
| lime | "varia por run" | não | não | não |

Erro de interface (campo inválido, ação destrutiva) usa o token `destructive`, não `rose` nem `red`: `text-destructive`, `bg-destructive/10`, `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`. Série de gráfico sem significado usa `--chart-1..5` (cinzas). Cor por entidade é hash sobre 16 tons `-500`, em classes literais.
<!-- skill:end -->

## Estados

<!-- skill:start -->
| Estado | Cinza | Cor cromática |
|---|---|---|
| Hover | `hover:bg-muted/50` (light), `dark:hover:bg-muted` | `[a]:hover:bg-{c}-500/20` |
| Aberto (`aria-expanded`) | `aria-expanded:bg-muted/50`, `dark:aria-expanded:bg-muted` | sem uso |
| Selecionado | `data-active:bg-sidebar-accent/70`, `dark:data-active:bg-sidebar-accent/50` | sem uso |
| Foco | `focus-visible:ring-[1.5px] focus-visible:ring-ring/50` | `focus-visible:ring-{c}-500/20 dark:focus-visible:ring-{c}-500/40` |
| Inválido | `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20` | só `destructive` |
| Desabilitado | `disabled:opacity-50` | `disabled:opacity-50` |
| Item destrutivo em menu | `focus:bg-destructive/10` | sem uso |

Hover troca fundo ou cor, nunca escala; o press (`active:scale-[0.97]`) é só do Button ([09-movimento](./09-movimento.md)).
<!-- skill:end -->

## Famílias

<!-- skill:start -->
| Família | Utility | Papel | Nunca |
|---|---|---|---|
| Inter Variable (eixo `opsz`) | `font-sans`, já no `html` e no `body` | todo texto do app | trocar por outra sans |
| Inter como heading | `font-heading` | título de Card, Dialog, Sheet, Drawer, Empty e AlertDialog | em texto que não é título |
| Host Grotesk Variable | `font-display` (item `font-display`) | título de marketing e do site | dentro do app |
| Geist Mono Variable | `font-mono` | id, chave, código, payload, eyebrow em caixa alta | número de tabela (Inter com `tabular-nums` alinha) |
<!-- skill:end -->

Carregamento, `@theme inline` e o opt-in `"cv11", "ss01"` estão em [01-fundacoes](./01-fundacoes.md#fontes).

## Tamanhos

<!-- skill:start -->
Escala do Tailwind sem customização, em `rem`. O app vive em `text-sm` e `text-xs`; a hierarquia vem de peso, tracking e cor, não de tamanho.

| Classe | Tamanho e entrelinha | Papel |
|---|---|---|
| `text-[10px]` | 10px | badge `sm`, micro rótulo em caixa alta |
| `text-[11px]` | 11px | eyebrow mono (site e Foglamp) |
| `text-xs` | 12px / 16px | meta, legenda, descrição curta, badge `md`, tooltip, delta |
| `text-[13px]` | 13px | valor denso de painel, par rótulo e valor (Foglamp, [05-telas-de-detalhe](./05-telas-de-detalhe.md)) |
| `text-sm` | 14px / 20px | corpo, rótulo, título de seção, título de card `sm` |
| `text-base` | 16px / 24px | título de página, de card default e de dialog; input abaixo de `md` |
| `text-lg` | 18px / 28px | título de passo no `login-form`; corpo de marketing |
| `text-xl` | 20px / 28px | título de tela de auth (`login-form`) |
| `text-3xl`, `text-4xl` | 30px, 36px | display de marketing e do site, sempre com `font-display` |

`text-2xl` não existe no app. 13 px é o menor tamanho de leitura corrida; 10 e 11 px só em rótulo curto.
<!-- skill:end -->

## Papéis tipográficos

<!-- skill:start -->
O equivalente aos `Heading` e `Text` do Radix Themes, em classes. Copie a string, não invente uma parecida.

| Papel | Classe | Onde |
|---|---|---|
| Título de página (`h1`) | `text-base font-medium tracking-tight` | `registry/base-vega/components/page-header.tsx:84` |
| Título de card | `font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm` | `registry/base-vega/ui/card.tsx:43` |
| Título de dialog | `font-heading leading-none font-medium text-base` | `registry/base-vega/ui/dialog.tsx:126` |
| Título de seção (`h2`) | `text-sm font-medium` | `registry/base-vega/components/section.tsx:27` |
| Título de estado vazio | `font-heading text-sm font-medium tracking-tight` | `registry/base-vega/ui/empty.tsx:65` |
| Título de tela de auth | `text-xl font-medium text-balance` | `registry/base-vega/blocks/login-form/login-form.tsx:200` |
| Corpo | `text-sm` (herdado da superfície) | `registry/base-vega/ui/card.tsx:17` |
| Texto de apoio | `text-sm text-muted-foreground text-balance` | `registry/base-vega/ui/card.tsx:55` |
| Descrição curta | `text-xs text-muted-foreground text-pretty` | `registry/base-vega/components/section.tsx:29` |
| Descrição de vazio | `text-xs/relaxed text-muted-foreground` | `registry/base-vega/ui/empty.tsx:78` |
| Rótulo de campo | `text-sm leading-none font-medium` | `registry/base-vega/ui/label.tsx:14` |
| Valor de métrica | `tracking-tight tabular-nums` no `CardTitle` | `registry/base-vega/components/stat-card.tsx:134` |
| Delta | `text-xs font-[470] tabular-nums` | `registry/base-vega/components/stat-card.tsx:204` |
| Número em coluna | `text-right tabular-nums` (`TableCell align="right"`) | `registry/base-vega/ui/table.tsx:20` |
| Código e id | `font-mono text-xs text-foreground` | `registry/base-vega/components/rolling-text.tsx:65` |
| Link em texto | `font-medium text-primary underline underline-offset-2` | `registry/base-vega/components/markdown-components.tsx:25` |
| Link discreto | `Button variant="link"`: `text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground` | `registry/base-vega/ui/button.tsx:31` |
| Tecla | `Kbd` (`font-sans text-xs font-medium`) | `registry/base-vega/ui/kbd.tsx:10` |
| Eyebrow | `font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase` | site, `app/guia/page.tsx:50` (eyebrow do Foglamp) |
| Display | `font-display text-3xl font-[450] tracking-[-0.025em] text-balance` | site, `app/guia/page.tsx:22`; `tracking-[-0.025em]` é o mesmo valor de `tracking-tight` |
<!-- skill:end -->

## Peso, tracking e entrelinha

<!-- skill:start -->
| Eixo | Valores com papel | Fora |
|---|---|---|
| Peso | `font-normal` (400, piso abaixo de 18px), `font-medium` (500, teto no app), `font-[470]` (delta), `font-[450]` (display) | `font-light`, `font-semibold` e `font-bold` no app |
| Tracking | `tracking-tight` em título e valor; `tracking-[0.18em]` só em eyebrow `uppercase`; corpo sem tracking (o `opsz` da Inter ajusta) | tracking positivo em minúscula |
| Entrelinha | `leading-none` em rótulo e título de uma linha; `leading-normal` no título de card; `text-xs/relaxed` e `leading-relaxed` em texto de várias linhas | `leading-loose` |
| Quebra | `text-balance` em título, `text-pretty` em parágrafo, `truncate` em célula e chip | quebra manual com `<br>` |
<!-- skill:end -->

## Snippets de layout

<!-- skill:start -->
O lume não tem `Flex`, `Grid`, `Container` nem `Box`: são classes. Estes são os moldes que a registry já usa; copie e troque só o conteúdo.

Coluna da página, dentro do `SidebarInset` (`registry/base-vega/blocks/app-shell/app-shell.tsx:238`):

```tsx
<div className="flex flex-col gap-4 py-6 px-0 pb-16">{/* header, toolbar, seções */}</div>
```

Cabeçalho de seção com ações à direita, no gutter `PX` (`px-4 md:px-8`, `registry/base-vega/components/section.tsx:24-31`):

```tsx
<section className="flex flex-col gap-3">
  <div className={cn("flex flex-wrap items-end justify-between gap-2", PX)}>
    <div className="flex flex-col gap-0.5">
      <h2 className="text-sm font-medium">Uso por modelo</h2>
      <p className="text-xs text-muted-foreground text-pretty">Últimos 30 dias</p>
    </div>
    <Button variant="outline" size="sm">Exportar</Button>
  </div>
  {/* conteúdo com o próprio gutter */}
</section>
```

Grade de métricas que reage à largura do painel, não da janela (`registry/base-vega/components/stat-grid.tsx:24-31`; prefira o item `stat-grid`):

```tsx
<section className={cn("@container", PX)}>
  <div className="grid gap-4 @lg:grid-cols-2 @min-[62rem]:grid-cols-4">{/* StatCard size="sm" */}</div>
</section>
```

Linha de itens e pilha:

```tsx
<div className="flex items-center gap-2">{/* ícone + texto, chips */}</div>
<div className="flex min-w-0 flex-col gap-1">{/* rótulo em cima, valor embaixo */}</div>
```

Container de marketing e do site: `mx-auto w-full max-w-7xl px-5 sm:px-8` (Foglamp, landing) ou `container mx-auto max-w-6xl px-6 py-10` (site do lume, `app/componentes/page.tsx`). Dentro do app não há container: a largura é a do inset.
<!-- skill:end -->

## Snippets de texto

<!-- skill:start -->
```tsx
<h1 className="text-base font-medium tracking-tight">Traces</h1>
<h2 className="text-sm font-medium">Uso por modelo</h2>
<p className="text-sm text-muted-foreground text-balance">Texto de apoio de uma ou duas linhas.</p>
<p className="text-xs text-muted-foreground text-pretty">Legenda ou descrição curta.</p>
<span className="text-sm tabular-nums">{formatCount(1234)}</span>
<span className="text-xs text-muted-foreground/50">{EMPTY}</span>
```

Código e id inline: `font-mono text-xs text-foreground`, com fundo só quando o código está no meio de prosa (`rounded-sm bg-muted px-1 py-0.5 font-mono text-xs`, o `code` do `/guia` em `components/guia/markdown.tsx`). Bloco de código é o item `code-block`, nunca um `<pre>` estilizado à mão.

```tsx
<code className="font-mono text-xs text-foreground">tr_8f2a91</code>
<CodeBlock code={payload} lang="json" />
```

Citação (adição do lume: a registry não tem uma). É linha, não caixa: a aresta da esquerda é um divisor, como nas [exceções da borda](../conceitos/excecoes-da-borda.md).

```tsx
<blockquote className="border-l-2 border-border/50 pl-3 text-sm text-muted-foreground text-pretty">
  A frase citada.
</blockquote>
```

Eyebrow acima de um título e display de marketing (fora do app):

```tsx
<p className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">Guia</p>
<h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">Título de marketing</h1>
```
<!-- skill:end -->

## O que não copiar

Do Radix Themes: `Flex`, `Grid`, `Container`, `Section`, `Box`, `Text`, `Heading`, `Code`, `Quote` como componentes (são classes aqui), as 12 variáveis `--accent-1..12` e `--gray-1..12`, e o `Theme` com `accentColor`, `radius` e `scaling` (tema configurável fica fora até alguém precisar). Da paleta do Tailwind: degrau sem papel (`bg-{c}-50`, `bg-{c}-200`, `border-{c}-800`), cor sem significado fixo e `slate`, `gray`, `zinc`, `stone`. Da tipografia: `text-2xl`, `font-bold`, `font-semibold` no app, mono para alinhar número e `font-display` dentro do produto.
