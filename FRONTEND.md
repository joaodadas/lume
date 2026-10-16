# Frontend

## Cabeçalho, origem, como ler

<!-- mapa: 1, 20.10, 21.12 | regras 22, 23 -->

Regras para construir qualquer interface com o lume. Toda regra é dura salvo indicação em contrário: se um padrão não cabe, levante antes de contornar. O texto segue a regra praticada no código do Foglamp (github.com/foglamp-labs/foglamp, commit `2bc3bb5`, Apache 2.0), não o `FRONTEND.md` original dele; onde os dois divergem (tema padrão `dark`, `motion/react` em uso, borda aceita em linha de tabela, divisor e campo no dark, `QueryCache.onError` em `utils/trpc.ts`, nenhum `error.tsx`), vale o código. Adições próprias estão marcadas com "(adição do lume)". A leitura longa, com tabelas e valores, fica em `docs/guia`; os conceitos do craft (Gustavo Fior, MIT) em `docs/conceitos`; as decisões do repo em `docs/DECISOES.md`.

- **Always** leia caminhos sem prefixo como relativos à raiz deste repo (`registry/base-vega/ui/button.tsx:10`); caminhos que começam em `apps/web/` ou `packages/ui/` são do Foglamp, citados para o que ainda não virou item da registry.
- **Always** instale pela registry: `npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y` (sem `-d`: o `-d` ignora o `base` e instala o style padrão por cima) e `npx shadcn@latest add joaodadas/lume/<item>#v0.1.0`; a skill vem com `npx skills add joaodadas/lume --skill lume-design-engineering`.
Porquê: o lume é uma cópia fiel de um sistema que está no ar; a autoridade é o código, e este arquivo é o que dev e agente leem antes de escrever qualquer tela.

## Layout do projeto

<!-- mapa: 2.2, 21.2 | regras 1, 7 -->

- **Always** trate `components/ui/*` como item da registry: é instalado pela CLI e atualizado com `add --overwrite`, nunca editado à mão. Uma variant nova entra por `className` com `cn()`; se for reusada, abre PR na base.
- **Always** ponha composições do app (shell, páginas, tabelas, chips) em `components/app/*` e helpers em `lib/{utils,format,motion,range}.ts` (itens `utils`, `format`, `motion`, `range`) e `hooks/*` (`use-mobile`, `use-delayed-loading`, `use-entrance-once`, `use-debounced-value`, `use-copied`).
- **Always** mantenha um único arquivo de tokens: `registry/base-vega/styles/globals.css` (o `base` o instala em `app/globals.css`); nenhum token mora em componente.
- **Never** crie um segundo primitivo com o mesmo papel em `components/app`; componha o da registry (`Button`, `Card`, `Table`...) ou proponha a mudança na base.

Porquê: o Foglamp tem um pacote de UI como fonte única (`packages/ui`) e um app que só compõe; separar os dois é o que deixa a sincronização com o upstream (`scripts/sync-upstream.ts`) e a camada da Lyx possíveis.

## Composição: Base UI, `render`, `cn`, `data-slot`

<!-- mapa: 5.1, 7.1, 19.3 | regras 7 -->

- **Always** troque o elemento com a prop `render` do Base UI: `<Button render={<Link href="/x" />}>`, `<DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>`, `<TooltipTrigger render={<span />}>`. O filho (ícone e texto) fica no trigger; as props visuais vão no `render`.
- **Always** mescle classes com `cn()` de `registry/base-vega/lib/utils.ts` (`clsx` + `tailwind-merge`) e mantenha `data-slot="..."` em todo subcomponente: os primitivos conversam por esses slots (`in-data-[slot=button-group]`, `has-[[data-slot=input-group-control]:focus-visible]`).
- **Always** estilize estado pelos atributos do Base UI: `data-open`, `data-closed`, `data-active`, `data-pressed`, `aria-expanded`, `data-starting-style`, `data-ending-style`.
- **Never** use `asChild` (Radix), `data-[state=open]` ou uma segunda biblioteca de componentes (Radix Themes, MUI, Mantine, HeroUI).

Porquê: os 56 primitivos são shadcn `base-vega` sobre `@base-ui/react`; `asChild` e `data-state` são seletores de Radix e simplesmente não casam (zero ocorrências no Foglamp, 304 `data-slot`).

## Tokens e cor

<!-- mapa: 4.3, 4.10, 9.6.2 | regras 1, 8 -->

- **Always** use os tokens semânticos: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-destructive`, `border-border`, `ring-ring`, `bg-sidebar`. Todos são `oklch(L 0 0)` em degraus da paleta `neutral` (`registry/base-vega/styles/globals.css:23-52,133-161`); a hierarquia vem da luminância: light `--background 0.99`, `--card 1`, `--sidebar 0.975`; dark `--sidebar 0.145`, `--background 0.17`, `--card 0.205`.
- **Always** prefira o token com opacidade para estado e texto secundário: `text-muted-foreground/50`, `/60`, `/70`; `bg-muted/50`; `bg-muted-foreground/15` e `/10` para chips e skeletons; `border-border/40` e `/50` para divisórias.
- **Always** use `neutral` quando precisar de cinza cru (`bg-neutral-800 dark:bg-neutral-100` é o botão default); cor cromática só com significado (seção "Cor com significado").
- **Never** use `slate`, `gray`, `zinc` ou `stone` (nem `--sidebar-primary` e `--custom-shadow-slate`, removidos do lume), nem hex, `rgb()` ou `oklch()` em `className` ou `style`, exceto quando a cor é dado (série de gráfico, cor de marca, hash de entidade) e com comentário de uma linha dizendo isso.

Porquê: cinza é estrutura e cor é significado; com chroma zero em tudo, L é a única variável e as superfícies se separam sem borda.

## Sombra no lugar de borda

<!-- mapa: 4.5, 19.3 | regras 2, 3, 4 -->

- **Always** dê borda a uma superfície com `shadow-(--custom-shadow)`: light `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)` (`globals.css:53-56`); dark dois insets brancos de 0.75px a 3% mais anel e três drops pretos a 10% (`globals.css:162-166`). Card, Popover, Dropdown, Tooltip, Dialog, Alert, Kbd, Avatar e o inset do shell usam o mesmo token.
- **Always** use o token da família quando houver: `--custom-outline-shadow` (botão outline e chips), `--custom-shadow-primary`, `-secondary`, `-destructive`, os 10 coloridos (`-green`, `-blue`, `-amber`, `-orange`, `-emerald`, `-rose`, `-red`, `-violet`, `-fuchsia`, `-sky`, fórmula light `0 0 0 .5px rgba(c,.25), 0 .5px 2px -.5px rgba(c,.18), 0 2px 4px 0 rgba(c,.12)`), `-lifted` (card sobre card) e `-chrome` (moldura de demo).
- **Always** aceite linha fina só nestes lugares, sempre atenuada: linha de tabela `border-b border-border/50 dark:border-border/40` (`registry/base-vega/ui/table.tsx:169`), divisor de seção `border-b border-border/40`, lista `divide-y divide-border/40`, rodapé de paginação `border-t border-border/50`, o `Empty` tracejado (`border-dashed border`), campos no dark (`dark:shadow-none dark:border-[0.5px] dark:border-border/50`) e hairline de marketing a `/50` até `/70`.
- **Never** feche uma caixa com `border` a 100% dentro do app, nem use `border`/`divide-*` para separar superfícies; nunca `shadow-md`, `shadow-lg` ou `ring-1 ring-foreground/10` em superfície nova.

Porquê: o anel de meio pixel a 6% separa sem ocupar espaço e some no dark, onde a aresta vem da luz (inset branco); o craft reserva a linha para "inputs, table rows and dividers", que não são superfícies e não devem parecer elevados.

## Raio e squircle

<!-- mapa: 4.4 | regras 5 -->

- **Always** escreva o par `rounded-<menor> squircle:rounded-<maior> corner-squircle`: o raio grande só vale onde `corner-shape` existe (`@custom-variant squircle`, `globals.css:18`). Pares canônicos: `rounded-md squircle:rounded-2xl` (campos, popovers, skeleton), `rounded-md squircle:rounded-xl` (menus, botão da sidebar, tabs), `rounded-[5px] squircle:rounded-xl` (tile de ícone), `rounded-lg squircle:rounded-3xl` (Card, Popover, Alert, inset), `rounded-2xl squircle:rounded-[40px]` (Dialog), `rounded-xl squircle:rounded-4xl` (Empty), `rounded-sm squircle:rounded-[14px]` (Kbd).
- **Always** derive de `--radius: 0.625rem`: `sm` 6px, `md` 8px, `lg` 10px, `xl` 14px, `2xl` 18px, `3xl` 22px, `4xl` 26px (`globals.css:261-267`); `rounded` nu (4px) e `rounded-xs` (2px) ficam fora da escala, evite.
- **Always** aninhe com raio concêntrico (interno = externo menos o recuo): `rounded-[calc(var(--radius)-5px)]` nos botões do InputGroup (`registry/base-vega/ui/input-group.tsx:78`), presets do range picker em `rounded-sm squircle:rounded-xl`.
- **Never** use `corner-round!` fora de dois casos: pílula `rounded-full` que o squircle achataria (busca da toolbar) e card envolvido por `BorderBeam`, que só desenha arco circular.

Porquê: no mesmo raio o squircle parece menor que o arco, então o raio sobe dois a três degraus só onde o browser sabe desenhá-lo; `corner-shape` não é herdado, por isso `corner-squircle` acompanha sempre.

## Superfícies

<!-- mapa: 6.2, 6.3 | regras 12 -->

- **Always** monte superfície com a mesma receita: `bg-card` ou `bg-popover` (mesmo valor) + `shadow-(--custom-shadow)` + par de raio + padding + `text-sm`. Card: `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground` (`registry/base-vega/ui/card.tsx:17`).
- **Always** use `Card size="sm"` no dashboard (`py-5 gap-2`, filhos `px-5`, título `text-sm`): é o card de 36 dos 62 usos do Foglamp. Título à esquerda e controle à direita é `<CardHeader className="flex flex-row items-center justify-between gap-4">`; distância header e conteúdo se ajusta com `CardContent className="mt-2"` ou `mt-3`.
- **Always** use `shadow-(--custom-shadow)` também no Tooltip, com `bg-popover` e `text-xs` (`registry/base-vega/ui/tooltip.tsx:58`), nunca o tooltip invertido do shadcn.
- **Never** use `--custom-shadow-lifted` para "flutuar" um overlay: o que separa modal de página é o backdrop (`bg-black/20`) e a animação, não uma sombra maior.

Porquê: card e popover são o mesmo material, e um tooltip invertido lê como painel claro no dark e escuro no light (comentário em `tooltip.tsx`).

## Tipografia

<!-- mapa: 4.6, 15.2.1, 19.3, 20.5 | regras 11 -->

- **Always** viva em `text-sm` (14px) e `text-xs` (12px); `text-base` é o título de página e de card default. Degraus intermediários para dado denso e mono: `text-[13px]`, `text-[11px]`, `text-[10px]`.
- **Always** limite o peso a `font-medium` no app (títulos, rótulos, botão, badge) com `tracking-tight` em título e valor de StatCard, e `font-normal` para desfazer o `font-medium` do Button em chips; `font-semibold` e `font-[450]` só em display de marketing com `font-display`; `text-balance` em título, `text-pretty` em parágrafo de apoio, `truncate` em célula e chip com texto livre.
- **Always** use `tabular-nums` em todo número (`TableCell align="right"` já injeta `text-right tabular-nums`, `table.tsx:17-21`) e `font-mono` só para ids, chaves, código e eyebrows (`font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground`); `font-mono` resolve na Geist Mono Variable (`globals.css:228-230`).
- **Never** use `text-2xl` no app, `font-bold`, ou mono para alinhar números: dígitos tabulares em Inter resolvem.

Porquê: 501 das 594 ocorrências de tamanho no Foglamp são `text-sm` e `text-xs`; a hierarquia vem de peso 500, tracking e cor muda, não de tamanho.

## Espaçamento e ritmo

<!-- mapa: 8.8, 19.3 | regras 13 -->

- **Always** empilhe com `flex flex-col gap-*` (`gap-2`, `gap-4`, `gap-1.5`, `gap-1`, `gap-3` são os cinco mais usados) ou `grid gap-4`; margens só para ajuste fino (`mt-1`, `mt-2`, `mt-3`, `-mt-2`).
- **Always** respeite os gutters da página: `px-8` (32px) para texto, título, grids de cards e estados vazios; `px-6` (24px) para controles (Toolbar `pl-6 pr-6`, rodapé de paginação); `px-8.25` (33px) nas células de tabela e `pr-9` na última coluna.
- **Always** use a coluna da página `flex flex-col gap-4 py-6 px-0 pb-16` (apps/web/src/components/app/app-shell.tsx:389) e o bloco header + toolbar em `flex flex-col gap-4 mt-1`, com a tabela em `-mt-2`.
- **Never** use `space-y-*`/`space-x-*` nem valor arbitrário de espaçamento (`p-[13px]`) sem comentário de uma linha; `size-3.25`, `gap-1.75`, `h-13`, `px-8.25` são da escala contínua do Tailwind v4, não arbitrários.

Porquê: 32px alinha texto, 24px alinha controles (que, por terem superfície própria, parecem alinhados a 32px), e a tabela usa 33px para o texto da célula cair na coluna do título.

## Botões

<!-- mapa: 5.2, 5.3 | regras 6, 17 -->

- **Always** use o `Button` da registry: pílula `rounded-full`, `h-8` default (`xs` `h-6`, `sm` `h-7`, `lg` `h-8.5`, `icon-xs` `size-6`, `icon-sm` e `icon` `size-8`), `active:scale-[0.97]`, `focus-visible:ring-[1.5px] focus-visible:ring-ring/50`, ícone `size-3.5` e padding reduzido do lado do ícone `has-[>svg:first-child]:pl-2.5` (`registry/base-vega/ui/button.tsx:10,34-44`).
- **Always** escolha a variant pelo peso da ação: `default` (`bg-neutral-800 dark:bg-neutral-100` + `--custom-shadow-primary`) uma por tela; `secondary` para ações de header ("Create key", com `strokeWidth={2.4}` no ícone); `outline` para chips e filtros; `ghost` para ícones de toolbar; `ghost-destructive` para apagar (vermelho só no hover); `link` para texto.
- **Always** anule o press em gatilho de popup e chip de filtro: `transition-[color,box-shadow] active:scale-100` (hover de fundo instantâneo, sem encolher).
- **Always** navegue com `render={<Link href="/x" />}` e desabilite submit por estado do form (`disabled={!canSubmit || isSubmitting}`), trocando o texto ("Entrando...") em vez de pôr spinner dentro do botão.
- **Never** use `destructive` cheio fora de danger zone, `mr-2` em ícone dentro de Button (o `gap` já cuida), ou `Button` dentro de `Link` (é o `render` que faz o link).

Porquê: o conjunto pílula, escala 0.97 em 150ms e anel de 1.5px é o que faz o botão parecer "deste produto" e não shadcn genérico; `ghost-destructive` só se arma no hover porque apagar é ação rara e perigosa.

## Badges e chips

<!-- mapa: 5.4, 9.4 | regras 8, 9, 17 -->

- **Always** use `Badge` para status: `rounded-full capitalize`, `md` (`h-5 px-2 gap-[5px] text-xs`, ícone `size-3!`) por padrão, `sm` (`h-4 text-[10px]`) só em chip de versão; 14 variants com sombra colorida no molde `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] dark:bg-{c}-500/15 dark:text-{c}-300` (`registry/base-vega/ui/badge.tsx:11-43`); `rose` e `red` usam `dark:text-{c}-400`.
- **Always** ponha um ícone Tabler filled antes do texto do badge de status (`<Badge variant="rose"><IconAlertTriangle />Erro</Badge>`) e `normal-case` quando o texto é técnico (versão, id, com `font-mono tabular-nums`).
- **Always** monte chip de contexto e gatilho de filtro sobre `Button variant="outline"` com `CHIP_SURFACE`: `bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)` (apps/web/src/components/app/context-chip.tsx:10-13); erro `border-rose-500/40 text-rose-600 dark:text-rose-400 dark:shadow-[0_0_0_1px_rgba(244,63,94,0.4)]`, abortado idem em amber.
- **Never** use badge para contagem de erro numa célula: é texto colorido `text-sm text-red-600 dark:text-red-400` com `IconAlertTriangle size-3.5 fill-current/20`, sem pílula.

Porquê: a sombra tingida é a mesma geometria do `--custom-shadow` na cor do status, então o badge continua "sem borda"; o chip repete a cara do trigger de filtro para toolbar e linha de contexto lerem como uma família.

## Campos e formulários

<!-- mapa: 5.5 a 5.8, 12.4 | regras 4, 7, 22 -->

- **Always** use `Input` (`h-9 ... rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base ... placeholder:text-muted-foreground/50 ... md:text-sm dark:bg-input/30`, `registry/base-vega/ui/input.tsx:14`), `Textarea` (`field-sizing-content min-h-16`), `SelectTrigger` (`data-[size=default]:h-9 data-[size=sm]:h-8`) e `Kbd`: a mesma superfície de campo, sombra no light e hairline no dark.
- **Always** use `InputGroup` + `InputGroupInput` + `InputGroupAddon align="inline-start | inline-end"` para ícone, prefixo, sufixo, botão ou `kbd` dentro do campo; o foco e o `aria-invalid` sobem para o container por `:has()`.
- **Always** siga a anatomia `Label` + controle + erro: wrapper `flex flex-col gap-2.5`, `Label` (`text-sm leading-none font-medium`), erro `<p className="text-xs text-destructive">` ou `Field data-invalid` + `FieldLabel` + `FieldError` (`text-sm font-normal text-destructive`, `registry/base-vega/ui/field.tsx:221`) em dialogs; campos empilhados em `flex flex-col gap-5`; `autoComplete` sempre (`email`, `current-password`, `new-password`).
- **Always** valide com Zod no submit (`validators: { onSubmit: schema }` no TanStack Form ou `zodResolver` no React Hook Form): a lib de form é livre desde que o campo seja o do lume; `login-form` é presentacional.
- **Never** embrulhe um `Input` cru em `div` com ícone `absolute` e `pl-7` na mão, nem use `border border-input` ou `shadow-xs` em campo.

Porquê: no light o anel de 0.5px já faz a linha; no dark um anel escuro some sobre `#0f0f0f`, e uma hairline branca a 5% custa menos que seis camadas de sombra; `text-base` abaixo de `md` evita o zoom do iOS.

## Ícones

<!-- mapa: 19.3, 8.2.4 | regras 9, 10 -->

- **Always** importe de `@tabler/icons-react` e prefira o `*Filled` quando existir (`IconCircleCheckFilled`, `IconAlertTriangleFilled`, `IconCoinFilled`); outline só quando não há filled (`IconChevronRight`, `IconSearch`, `IconLoader`) ou como estado inativo.
- **Always** dimensione por classe: `size-3.5` (14px) é o padrão dentro de Button, chips, metadados e títulos de card; `size-4` em menus, selects, empty states e stat de detalhe; `size-4.5` (18px) na sidebar e no ícone de seção do PageHeader; `size-3` em badge `md` e linha meta; `size-3.25` para alinhar opticamente ao texto de 12px (`className="mb-px size-3.25"`).
- **Always** use o par outline (inativo) e filled (ativo) na navegação, com crossfade `transition-opacity duration-100 ease-in-out` dos dois SVGs em `[grid-area:1/1]` (apps/web/src/components/app/app-shell.tsx:237); cor própria vai como `text-*` no svg, porque Button e Badge só pintam svgs sem `text-` (`[&_svg:not([class*='text-'])]`).
- **Never** misture bibliotecas (`lucide-react`, `react-icons`, Phosphor) nem ponha margem em ícone dentro de Button.

Porquê: filled lê melhor nos 14px que o sistema usa, e o seletor `:not([class*='size-'])` deixa um `size-*` explícito vencer o default sem `!important`.

## Shell e sidebar

<!-- mapa: 7.2, 8.2, 8.3 | regras 13 -->

- **Always** use `Sidebar variant="inset"`, a única variante: `SIDEBAR_WIDTH = "14rem"` (`registry/base-vega/ui/sidebar.tsx:32`), canvas `bg-sidebar` sempre mais escuro que o inset `bg-background`, e o inset com `shadow-(--custom-shadow)` e `rounded-lg squircle:rounded-3xl corner-squircle` (`sidebar.tsx:312`), sem borda.
- **Always** contenha o scroll em três camadas: `SidebarProvider className="group/shell relative h-svh min-h-0 overflow-hidden"`, `SidebarInset className="min-h-0 overflow-hidden ... md:rounded-lg squircle:md:rounded-3xl"` e um viewport interno `min-h-0 flex-1 overflow-y-auto` com a coluna `flex flex-col gap-4 py-6 px-0 pb-16` dentro (apps/web/src/components/app/app-shell.tsx:306-389); o wrapper do inset reaplica `md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0` porque o inset não é irmão direto do `peer`.
- **Always** marque o item ativo só com fundo e ícone filled: `data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50`, botão `rounded-md squircle:rounded-xl corner-squircle p-2 ... [&_svg]:size-4.5` (`sidebar.tsx:480`), link por `render={<Link href prefetch />}`; sem `font-medium`.
- **Always** renderize um `SidebarTrigger` num header só mobile (`flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3 md:hidden`, `registry/base-vega/blocks/app-shell/app-shell.tsx:217`) abaixo de 768px, onde a sidebar vira `Sheet` de `18rem` (adição do lume, já validada no painel do lyx-pr-agent); `Cmd/Ctrl+B` continua alternando.
- **Never** use `variant="sidebar"` ou `"floating"`, `SidebarRail`, ou tema, projeto e período em provider dentro da página: contexto vive no shell (`HeaderActionsSlotProvider`, `RangeProvider`, `ThemeProvider`).

Porquê: no inset o conteúdo é um único cartão flutuando sobre o canvas, o que a sombra resolve; `sidebar` precisaria de `border-r` e `floating` criaria dois cartões; o Foglamp não tem gatilho no mobile e isso é bug, não regra.

## Páginas: header, stat cards, grids

<!-- mapa: 8.4, 8.5, 8.11, 8.12 | regras 14, 15 -->

- **Always** defina o header uma vez por rota e renderize a mesma peça no `loading.tsx` e na página: `PageHeader` é `flex flex-wrap items-end justify-between gap-4 px-8 h-8` com `h1 flex items-center gap-2 text-base font-medium tracking-tight`, ícone de seção `size-4.5 shrink-0` com o tile do nav, e slot de ações `flex items-center gap-2 translate-y-1 empty:hidden` (apps/web/src/components/app/page-parts.tsx:90-131); `h-8` porque o range picker é `h-8`.
- **Always** use `back={navItem(href)}` para detalhe: `h1` com `gap-1.5`, link `text-muted-foreground transition-colors hover:text-foreground` e separador `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; nunca o primitivo `Breadcrumb`.
- **Always** monte faixa de métricas com `StatCard size="sm"` em `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1`, ordem Volume, Saúde, Performance, Custo (custo por último); valor `CardTitle className="tracking-tight tabular-nums"`, rótulo `text-sm` com ícone `size-3.5 text-muted-foreground`, delta em `text-xs font-[470] tabular-nums` verde `text-emerald-600 dark:text-emerald-500` ou vermelho `text-red-500`.
- **Always** use pares de gráficos em `grid gap-4 lg:grid-cols-2 px-8`, `Card size="sm"` com legenda clicável no `CardHeader` e `CardContent className="mt-2"`; breakdowns em `grid gap-4 lg:grid-cols-2 xl:grid-cols-4 px-8`.
- **Never** monte a página inteira num `Suspense` com skeleton: o chrome (header, toolbar, cabeçalhos de coluna) pinta na hora e só o corpo espera.

Porquê: a troca fallback para página é pixel-idêntica quando os dois renderizam o mesmo `header.tsx`, e um range vazio precisa do range picker para escapar.

## Tabelas e filtros

<!-- mapa: 7.3, 8.7, 8.10, 9.2 | regras 4, 16 -->

- **Always** use o `Table` da registry com `className="table-fixed min-w-5xl" stickyHeader`, larguras explícitas no `TableHead` (`w-28`, `w-32`, `w-36`, `w-40`), header `h-13 [&_tr]:h-13` (`registry/base-vega/ui/table.tsx:100`), célula `py-2 px-8.25` com altura na primeira (`h-12` uma linha, `h-16` título + meta), última coluna `pr-9`.
- **Always** marque linha clicável com `TableRow interactive {...rowNav(router, href)}`: `tabIndex 0`, Enter e Espaço, `hover:bg-muted`, anel `ring-[1.5px] ring-inset ring-ring/50`, e a borda da linha e da anterior somem no hover (`table.tsx:170-176`); linha sem `interactive` não tem hover.
- **Always** alinhe número à direita com `align="right"` (injeta `text-right tabular-nums`), ordene com `SortableHead` (tri-state desc, asc, off; seta `size-3.5` só no hover, `-mr-5` à direita) e pagine com `PaginationFooter` (`border-t border-border/50 px-6 pt-4`, `pageSizes [25, 50, 100]`, setas `icon-sm`, sem números de página).
- **Always** guarde filtro, busca, ordenação e página na URL (`useUrlFilters`, item `data-table`) e envolva a tabela em `TooltipProvider delay={150}` (o provider nasce com `delay = 0`, `tooltip.tsx:10`, e sem provider o Base UI usa 600ms); toolbar `flex flex-wrap items-center gap-2 pl-6 pr-6` com `SearchInput` (`h-8 w-56 rounded-full squircle:rounded-full corner-round!`), `FilterSelect` (`min-w-36 ... corner-round! bg-card hover:bg-muted/50 ... active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`), `ToggleChip`, `ClearFiltersButton`; o `trailing` sobe para o slot do header quando não cabe.
- **Never** instale TanStack Table, AG Grid ou similar; ordenação e paginação são hooks pequenos sobre o primitivo (servidor ordena o que é paginado, cliente ordena lista completa).

Porquê: `table-fixed` com larguras no header é o que impede a troca skeleton para dados de mover colunas, e o hover como bloco contínuo (sem riscos atravessando) é a versão em tabela de "sombra no lugar de borda".

## Loading, vazio e erro

<!-- mapa: 8.9, 6.7, 13.8 | regras 15, 22 -->

- **Always** atrase o skeleton com `useDelayedLoading(loading, 700)` (`registry/base-vega/hooks/use-delayed-loading.ts:16`) e renderize `null` antes disso, nunca o empty state; skeleton só no corpo da tabela (`TableRowsSkeleton` com a mesma `rowHeight` das linhas reais) ou no valor do StatCard (`Skeleton className="h-3 w-20"` ao lado de um zero-width space que segura a line box).
- **Always** use `Skeleton` (`animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted`, `registry/base-vega/ui/skeleton.tsx:10`; `bg-muted-foreground/15` dentro de superfície já `bg-muted`; `rounded-full squircle:rounded-full` para círculos), `Spinner` (`IconLoader size-4 animate-spin role="status"`) e `TextShimmerLoader` para "o modelo está pensando".
- **Always** use `placeholderData: (prev) => prev` em toda lista, para refetch não regredir a skeleton nem piscar o vazio.
- **Always** trate "não existe" como `EmptyState` (`Empty className="border border-dashed"`, `EmptyMedia variant="icon"` com o ícone em `opacity-40`, título `font-heading text-sm font-medium tracking-tight`, descrição `text-xs/relaxed text-muted-foreground`) em wrapper `mt-2 px-8`, com mensagem diferente quando há filtro ativo.
- **Always** trate erro de dado como toast com ação de retry (`QueryCache.onError`) e, no App Router, um `error.tsx` mínimo por grupo de rotas: cartão centrado com `BrandMark`, `h1 text-lg font-medium`, `p text-sm text-muted-foreground` e `Button variant="secondary"` "Tentar de novo" (adição do lume; o Foglamp não tem `error.tsx`).
- **Never** renderize a string "Carregando..." crua, nem um erro em dialog, nem um skeleton que mude de tamanho quando o dado chega.

Porquê: abaixo de 700ms o skeleton só piscaria; o que pinta primeiro no slot leva o fade e a troca skeleton para dado é instantânea; sem `error.tsx` uma exceção no render cai na página padrão do Next.

## Números, datas e formatação

<!-- mapa: 9.3 | regras 11, 22 -->

- **Always** formate por `registry/base-vega/lib/format.ts`, função por função: `formatMoney(v, { currency: "BRL" | "USD" })`, `formatCost` (USD, 6 casas, zeros à direita caem até 2), `formatCostFixed(v, 6)` em coluna (alinha no decimal), `formatCount` (arredonda antes, compacta de 1000 em diante), `formatExactCount` (nunca "1 mil"), `formatCompact` (123, 12,3, 0,42), `formatDuration` (até duas unidades, "1h" e não "60min 0s"), `formatSpanDuration(0) = "<1ms"`, `formatPercent`, `formatRelative` ("agora", "há 3 min"), `formatDateTime` (dd/MM HH:mm), `formatDelta`.
- **Always** mostre valor nulo como `EMPTY` = `sem dado` em `text-muted-foreground/50` (`format.ts:14`); zero só aparece quando o dado é zero; campo que não se aplica é omitido, não trocado por placeholder.
- **Always** use `Intl` com `LOCALE "pt-BR"` e `TIME_ZONE "America/Sao_Paulo"` para formato e `date-fns` (locale `ptBR`) só para aritmética e presets de período (`range.ts`); formatters cacheados em `Map`.
- **Always** reformate a cada frame quando o número anima (`number-ticker`, 600ms `easeOut`, primeira pintura estática) e re-renderize tempo relativo a cada 15s só no nó de texto.
- **Never** use travessão como placeholder (o `formatCost` do Foglamp usa; o lume não), `dayjs`, `moment`, `luxon`, ou `toLocaleString()` solto fora de `format.ts`.

Porquê: número consistente é a cara de um dashboard; um placeholder de texto diz "sem dado" sem parecer zero e sem o glifo que o repo proíbe.

## Cor com significado

<!-- mapa: 9.4 a 9.6, 13.2 | regras 8, 9 -->

- **Always** use a tabela semântica fixa: emerald = ok, pass e embedding; rose = erro e falha; red = contagem de erro em célula; amber = aviso, abortado e agente; violet = llm; blue = tool; sky = sessões; orange = agentes; fuchsia = evals; yellow = alertas; lime = "varia por run". Paleta neutra `--chart-1..5` (cinzas iguais nos dois temas) para série sem semântica; `var(--destructive)` para erro em gráfico.
- **Always** tinja no par que lê nos dois temas: tile `bg-{c}-100 dark:bg-{c}-950 text-{c}-500`, texto `text-{c}-600 dark:text-{c}-400`, badge `bg-{c}-500/10 text-{c}-700 dark:bg-{c}-500/15 dark:text-{c}-300`.
- **Always** faça tile de ícone 18px com `bg-{c}-100 dark:bg-{c}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{c}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)` (apps/web/src/components/app/nav.ts:43-44; `navTile(color)` no `app-shell`): anel interno a 14% e drop a 25% no light, token neutro no dark.
- **Always** centralize "o que cada opção significa" num `.ts` sem JSX (ícone, `badgeVariant`, cor, unidade), consumido por lista, dialog e detalhe; cor por entidade é hash determinístico (djb2) sobre 16 tons `*-500`; escala de calor por quintil `text-green-600 dark:text-green-400` até `text-red-600 dark:text-red-400`, classes literais para o Tailwind enxergar.
- **Never** invente cor por tela, use `slate` para "outro" (é `neutral`), ou coloque cor cromática num gráfico sem significado fixo.

Porquê: a tabela cinza deixa a cor contar a história; se cada tela escolhesse o próprio verde, verde deixaria de significar "ok".

## Overlays e menus

<!-- mapa: 6.4 a 6.6 | regras 12, 18 -->

- **Always** use os primitivos: `Dialog` (`rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm ... shadow-(--custom-shadow) duration-100 ... sm:max-w-md`, entra em `zoom-in-[96%]` e sai em `zoom-out-[99%]`, backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, `registry/base-vega/ui/dialog.tsx:36,58`), `AlertDialog` para confirmar remoção (`AlertDialogAction variant="destructive"`, cancelar ghost), `Popover`, `Tooltip`, `DropdownMenu`.
- **Always** mantenha a string canônica de popup: `origin-(--transform-origin) ... duration-100 data-[side=bottom]:slide-in-from-top-2 ... data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` com `bg-popover` e `shadow-(--custom-shadow)` em `rounded-md squircle:rounded-2xl` (menu, tooltip) ou `rounded-lg squircle:rounded-3xl` (popover) (`dropdown-menu.tsx:47`, `popover.tsx:42`).
- **Always** escreva item de menu como `cursor-pointer rounded-sm px-2 py-1.5 text-sm focus:bg-accent` com ícone `size-4`, destructive em `text-destructive focus:bg-destructive/10` (20% no dark), separador `bg-border/60` (`dropdown-menu.tsx:96,236`); controle `open` por `useState`, com `onOpenChangeComplete` para limpar estado depois da saída.
- **Never** construa portal, overlay ou focus trap próprios; nunca `DialogTrigger` para dialog com estado de formulário; dialog com seções usa a casca `gap-0 overflow-hidden p-0` e cada seção traz o próprio `p-6`.

Porquê: entrada de 96% a partir do gatilho (`--transform-origin`) e saída quase sem escala seguem "o que sai merece menos cerimônia"; o backdrop leve basta porque modal e página são o mesmo material.

## Toasts

<!-- mapa: 6.7.3, 12.12 | regras 22 -->

- **Always** monte um único `<Toaster />` no root (item `sonner`): ícones Tabler filled de 16px, só success verde e error vermelho, `--normal-bg: var(--popover)`, raio `--radius`, tema do `useTheme`.
- **Always** centralize erro de query em `QueryCache.onError` junto do `QueryClient` (`toast.error(error.message, { action: { label: "tentar de novo", onClick: query.invalidate } })`, apps/web/src/utils/trpc.ts:21-31) e, no lume, também `MutationCache.onError` global (adição do lume; o Foglamp repete `onError: (e) => toast.error(e.message)` em 22 mutations).
- **Always** escreva sucesso curto e nominal, sem ponto final: "Projeto criado", "Convite enviado", "Chave revogada".
- **Never** use `alert()`, toast para cópia (o ícone vira check), para abrir dialog ou trocar aba, nem `richColors`/`closeButton`.

Porquê: toast é feedback de rede e de mutation; o resto da interface já confirma pelo próprio estado.

## Movimento

<!-- mapa: 19.1, 19.2, 19.4, 19.6 | regras 17, 18, 19 -->

- **Always** anime primitivos só com CSS: `tw-animate-css` preso a `data-open`/`data-closed` (popups 100ms, Dialog 100ms), `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` no Accordion, `transition-colors` em link, `transition-opacity` em revelação; o default de 150ms vale para o resto. Entrada de página é `useEntranceOnce()` + `cn(entrance && "page-fade-in")`: 75ms, só opacidade, uma vez por hard load, no header e nos slots de card (a cópia do `loading.tsx` não anima).
- **Always** use `motion/react` em composições só com o vocabulário de `registry/base-vega/lib/motion.ts`: `EASE [0.22, 1, 0.36, 1]`, `ENTRANCE_EASE [0.32, 0.72, 0, 1]`, `REVEAL_EASE [0, 0.7, 0.5, 1]`, `MORPH { type: "spring", stiffness: 400, damping: 38 }` (pílula com `layoutId` e morph de altura), `TOOLBAR_SPRING 520/44`, `COPY_SPRING { duration: 0.25, bounce: 0 }` (troca de ícone com `scale 0.25` e `blur(4px)`); durações de UI entre 0.12 e 0.25s, revelação de dados entre 0.5 e 1s, acima de 1s só marketing.
- **Always** faça hover instantâneo ou só de cor (`text-muted-foreground hover:text-foreground`, `hover:bg-muted`, chips com `transition-[color,box-shadow]`), press só no Button (`active:scale-[0.97]`), `initial={false}` no que já está no lugar, saída mais curta que a entrada.
- **Always** respeite reduced motion como estado final: `useReduce()` e a receita devolve `{}` ou monta pronta; loops longos (névoa, dash) em keyframes CSS.
- **Never** crie curva ou spring dentro de componente, use `hover:scale-*`/`hover:translate-*`, anime na primeira pintura o que já está no lugar, ou troque `motion` por outra lib.

Porquê: o Foglamp duplica as mesmas cinco curvas em dez arquivos; centralizadas, todo controle segmentado desliza igual e a página inteira aparece em 75ms uma única vez por carga.

## Dark mode

<!-- mapa: 4.8, 20.9 | regras 20 -->

- **Always** monte `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` (item `theme-provider`, `app/layout.tsx:23-28`) ou `theme-provider-csp` com `public/theme.js` quando a CSP não aceita script inline; `suppressHydrationWarning` no `<html>`.
- **Always** desenhe e confira os dois temas: botões mantêm sombra no dark (bevel branco inset, `--custom-shadow-primary` e `--custom-outline-shadow` redefinidos em `globals.css:180-187`); campos trocam sombra por hairline (`dark:shadow-none dark:border-[0.5px] dark:border-border/50 dark:bg-input/30`); tile colorido volta ao `dark:shadow-(--custom-shadow)` neutro; texto colorido vai de `-600` para `dark:-400`.
- **Always** use `useTheme()` só para o que o CSS não resolve (cor de série de gráfico em JS, ícone do switcher) e espere `mounted` antes de ler `resolvedTheme`.
- **Never** escreva `dark:` manual para o que um token já flipa, toque `document.documentElement.classList` à mão, ou use preto puro (`--background` dark é `oklch(0.17 0 0)`).

Porquê: medido no ar, a primeira visita abre escura mesmo com `prefers-color-scheme: light`; no dark a hierarquia inverte (sidebar mais escura que a página, card mais claro) e a aresta vem da luz, não da sombra.

## Fontes

<!-- mapa: 4.6, 21.4 | regras 11, 22 -->

- **Always** carregue pelo `base`: `@import "@fontsource-variable/inter/opsz.css"` e `@import "@fontsource-variable/geist-mono"` (`globals.css:9-10`), com `--font-sans: "Inter Variable"`, `--font-mono: "Geist Mono Variable"` e `--font-heading` igual à sans no `@theme inline` (`globals.css:227-231`); `html` e `body` em `font-sans`, `body` com `antialiased`.
- **Always** instale o item `font-display` (Host Grotesk Variable, `--font-display`) só para marketing e títulos do próprio site; o app fica inteiro em Inter.
- **Always** mantenha `--font-mono` mapeada: o Foglamp carrega Geist Mono e nunca a mapeia (o lume corrige); em projeto Next sem Fontsource, `next/font/local` com os woff2 do rsms/inter e `variable: "--font-sans"` é a alternativa documentada.
- **Never** carregue fonte por `<link>` do Google Fonts nem `next/font/google` para a Inter (build antigo, sem o eixo `opsz` e sem as variantes OpenType); `font-feature-settings: "cv11", "ss01"` é opt-in no guia, fora do `base`.

Porquê: a InterVariable completa com `opsz` é parte da cara do sistema, e o Fontsource self-hosta em Next e em Vite sem passar woff2 pela registry.

## Responsividade e camadas

<!-- mapa: 8.13, 15.2.7, 19.3 | regras 13 -->

- **Always** use só os breakpoints padrão do Tailwind v4 (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e três degraus no app: `md` para a sidebar fixa e grids de stats (`md:grid-cols-2`, `md:grid-cols-4`), `lg` para pares de cards (`lg:grid-cols-2`), `xl` para quatro colunas; `sm` só em Dialog (`sm:max-w-md`, `sm:flex-row` no footer) e marketing.
- **Always** meça em vez de usar media query quando a largura depende de um painel vizinho: `ResizeObserver` na Toolbar, `@container` com `@lg:` na timeline, `useIsMobile()` (768px) só para a sidebar.
- **Always** reserve `z-50` para portal e `fixed` (popups com `isolate z-50` no Positioner, Dialog, Sheet); dentro da página três degraus (`z-10`, `z-20`, `z-30`) relativos a um pai `relative isolate`, fundo decorativo em `-z-10`.
- **Never** crie `--breakpoint-*`, `--z-*` ou `2xl:`; o app é desktop-first e degrada (tabela `min-w-5xl` rola, cards empilham), o marketing é mobile-first.

Porquê: sem escala nomeada, a consistência vem de poucos valores repetidos; `isolate` garante que `-z-10` fique atrás dos irmãos mas nunca atrás do fundo da página.

## Acessibilidade e teclado

<!-- mapa: 19.3, 8.10, 21.14 | regras 16 -->

- **Always** use o anel canônico de foco: `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` (Button, Input, Select, Switch, linha interativa com `ring-inset`); erro espelha com `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`.
- **Always** dê `aria-label` a botão só de ícone, `sr-only` a título de Sheet e Dialog sem texto visível, `role="status"` a Spinner e loader, `aria-pressed` a chip e pílula segmentada, `role="tab"`/`aria-selected` em barra de abas própria.
- **Always** faça linha de tabela e cabeçalho ordenável operáveis por teclado (`tabIndex 0`, Enter e Espaço espelham o click) com `router.prefetch` em `onMouseEnter` e `onFocus` (`rowNav`), `cursor-pointer` explícito em tudo que é clicável e `e.stopPropagation()` nos links dentro da linha; `Cmd/Ctrl+B` alterna a sidebar; `Escape` fecha painel.
- **Never** use `focus-visible:ring-[3px]` em componente novo (sobra do shadcn em Badge e Tabs), nem deixe dois `<main>` aninhados na mesma tela.

Porquê: teclado é primeira classe no Foglamp (linhas, sort, atalhos) e o anel de 1.5px é fino o bastante para não brigar com a sombra de 0.5px.

## Telas de detalhe e drawers

<!-- mapa: 11.2, 10.4 | regras 4, 14 -->

- **Always** siga o esqueleto comum: `PageHeader back={navItem(href)}` com `titleLeading` (ícone da entidade) ou `titleTrailing` (id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` + `CopyButton`), linha de `ContextChip` em `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`, faixa de `StatCard size="sm"` em `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1`, cards de gráfico e a tabela.
- **Always** faça seção de painel com `px-5 py-5` separada da seguinte por `border-b border-border/40`, nunca na última ("a trailing border on the last section reads as a bug", apps/web/src/app/(app)/traces/[traceId]/trace-detail-client.tsx:2072); par rótulo e valor em `flex min-w-0 flex-col gap-1` com `text-xs text-muted-foreground` e `text-[13px] tabular-nums` num `grid grid-cols-2 gap-4`.
- **Always** expanda linha de tabela em gaveta com `TableRow interactive aria-expanded`, chevron `size-3.5 text-muted-foreground/50 transition-[rotate,color] duration-300 ease-out` (`rotate-90` aberto), linha aberta `border-b-transparent bg-neutral-100 dark:bg-card`, gaveta `TableCell colSpan` em `bg-neutral-100 px-8 pt-2 pb-8 dark:bg-card`, deep link `?id=` espelhado com `router.replace(..., { scroll: false })`.
- **Never** mostre o empty state de uma seção antes dos stats chegarem (um rollup lento piscaria o vazio), nem use `Drawer`/`Sheet` para o que é linha expansível.

Porquê: o detalhe é a lista mais um painel; manter a mesma gramática (chips, stats, tabela) faz a navegação lista para detalhe parecer um zoom e não uma tela nova.

## Assistente de AI (chat)

<!-- mapa: 14 | regras 12, 18 -->

- **Always** monte o painel como irmão flex do inset no canvas `bg-sidebar`, largura 354px (mínimo 320, máximo 640), tween `{ duration: 0.25, ease: ENTRANCE_EASE }` com `{ duration: 0 }` durante o arrasto, conteúdo interno de largura fixa para não refluir; `useReportLayoutReserve(open ? width : 0)` (item `header-slot`) avisa a Toolbar da largura futura.
- **Always** diferencie os papéis: usuário é card `max-w-[85%] whitespace-pre-wrap rounded-lg squircle:rounded-3xl corner-squircle bg-card shadow-(--custom-shadow) px-3 py-2 text-sm text-primary` (Foglamp, apps/web/src/components/app/foggy/foggy-message.tsx:54); assistente é texto direto `max-w-[90%] px-3 py-0 text-sm leading-relaxed` renderizado por streamdown com `markdown-components`; tool call é pílula de texto `text-xs text-muted-foreground` com `animate-pulse` até terminar.
- **Always** mostre "pensando" com `TextShimmerLoader size="sm"` até o primeiro token (inclusive durante tool calls), erro em `rounded-lg squircle:rounded-3xl corner-squircle bg-destructive/10 px-3 py-2 text-sm text-destructive w-fit` (Foglamp, apps/web/src/components/app/foggy/foggy-widget.tsx:649) com `Button variant="outline" size="sm"` "Tentar de novo" que reenvia a mesma pergunta.
- **Never** use HUD em Shadow DOM, Command/cmdk ou um tema próprio para o chat: ele usa os mesmos tokens e primitivos do app; `ai-chat` como bloco fica para a v0.2.

Porquê: a resposta é "a página" e a pergunta é um objeto sobre ela; manter o chat no canvas, com a mesma superfície dos cards, é o que o faz parecer parte do produto e não um widget.

## Marketing (opcional)

<!-- mapa: 15 a 17 | regras 21 -->

- **Always** use o container `mx-auto w-full max-w-7xl px-5 sm:px-8` e títulos em `font-display text-3xl font-[450] tracking-tight text-balance sm:text-4xl` (450 é o peso mais recente; 600 nas páginas antigas), corpo `text-lg text-muted-foreground text-pretty`.
- **Always** faça CTA por cima do Button: `size="lg"` + `text-base h-10 px-4` no hero e `text-base h-11 px-5` no fechamento; o resto fica em 32 a 34px.
- **Always** construa figuras com os componentes reais e dados fake, animadas uma vez com `useInView({ once: true, amount: 0.35 })`, copy em "rise" (`opacity 0, y 12, blur(6px)` em 0.7s `EASE`), hairlines `border-border/50` a `/70` em navbar, footer e FAQ; cards continuam só com sombra; `BorderBeam` só com `corner-round!`.
- **Never** leve hex de marca, `font-display`, texturas (névoa, cutting mat) ou durações acima de 1s para dentro do app.

Porquê: o marketing é feito da matéria do produto (os mesmos cards, tabelas e gráficos) e é o único terreno onde o autor quebra as regras com intenção.

## Next.js e Vite: o que muda

<!-- mapa: 8.4, 21.7, painel | regras 14, 15 -->

- **Always** no Next: trio por rota (`header.tsx` com um `RouteHeader`, `loading.tsx` só com ele, `page.tsx` com o client ou `Suspense fallback={<XHeader />}` quando lê `useSearchParams`); `params` e `searchParams` são `Promise` e o server resolve e passa como prop; instale `link-next` (mesmo caminho `components/link.tsx`, sobre `next/link` com `prefetch`); imagens por `next/image` com `alt` obrigatório.
- **Always** no Vite (como o painel do lyx-pr-agent): instale `link` no lugar de `link-next` (os dois gravam o mesmo `components/link.tsx`; o `link` é um `<a>` puro com `href` string, sem adaptador de rota); `useUrlFilters` (`registry/base-vega/blocks/data-table/url-filters.ts`) funciona sem roteador porque lê `window.location.search` por `useSyncExternalStore` e grava com `history.replaceState`; `theme-provider-csp` + `public/theme.js` no `<head>` quando não há script inline.
- **Always** importe os blocos de `components/link`, nunca de `next/link` ou de `react-router` diretamente, para o mesmo bloco instalar nos dois.
- **Never** use o Pages Router, `<a href>` para rota interna no Next (reload completo; `<a>` só para `mailto:`, `tel:` e externo), ou `<img>` cru fora de URL de terceiro com `referrerPolicy="no-referrer"`.

Porquê: a indireção de `link` e o estado de URL sem roteador são o que deixa os blocos puros; `route-header` é a única peça `nextOnly` e por isso sai só na v0.2.

## Regras para agentes

<!-- mapa: 3.7, 21.12 | regras 22, 23 -->

- **Always** instale e use junto: `npx skills add joaodadas/lume --skill lume-design-engineering` (este arquivo gerado em `SKILL.md` + `references/`), `npx skills add gustavo-fior/craft` (a teoria; o lume cita o craft, não o substitui), `web-design-guidelines` de `vercel-labs/agent-skills` (reviewer que reporta `arquivo:linha`) e `emilkowalski/skills` (animação); a ordem de leitura está em `docs/referencias.md`.
- **Always** afine botão, badge e chip no playground `/botoes` (`app/botoes/page.tsx`, tecla `T` alterna o tema) antes de abrir PR, e reporte revisão em tabela Before / After / Regra.
- **Always** comente em uma linha todo valor arbitrário (`[...]`), todo hex e toda exceção a este arquivo, e marque o que é adição própria.
- **Never** instale biblioteca de componentes, ícones, tabela, estado global (Zustand, Redux, Jotai) ou CSS file por componente; se parecer necessário, levante antes.

Porquê: o Foglamp codifica com agentes em camadas (skills genéricas, regras do repo, comentários no código); o lume mantém a mesma pilha e o `check` do repo garante que este arquivo e o código não divirjam.
