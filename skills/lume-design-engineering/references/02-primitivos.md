# Primitivos

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/02-primitivos.md`, `docs/guia/11-receita.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Composição: Base UI, `render`, `cn`, `data-slot`

<!-- mapa: 5.1, 7.1, 19.3 | regras 7 -->

- **Always** troque o elemento com a prop `render` do Base UI: `<Button render={<Link href="/x" />}>`, `<DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>`, `<TooltipTrigger render={<span />}>`. O filho (ícone e texto) fica no trigger; as props visuais vão no `render`.
- **Always** mescle classes com `cn()` de `registry/base-vega/lib/utils.ts` (`clsx` + `tailwind-merge`) e mantenha `data-slot="..."` em todo subcomponente: os primitivos conversam por esses slots (`in-data-[slot=button-group]`, `has-[[data-slot=input-group-control]:focus-visible]`).
- **Always** estilize estado pelos atributos do Base UI: `data-open`, `data-closed`, `data-active`, `data-pressed`, `aria-expanded`, `data-starting-style`, `data-ending-style`.
- **Never** use `asChild` (Radix), `data-[state=open]` ou uma segunda biblioteca de componentes (Radix Themes, MUI, Mantine, HeroUI).

Porquê: os 56 primitivos são shadcn `base-vega` sobre `@base-ui/react`; `asChild` e `data-state` são seletores de Radix e simplesmente não casam (zero ocorrências no Foglamp, 304 `data-slot`).

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

## Ícones

<!-- mapa: 19.3, 8.2.4 | regras 9, 10 -->

- **Always** importe de `@tabler/icons-react` e prefira o `*Filled` quando existir (`IconCircleCheckFilled`, `IconAlertTriangleFilled`, `IconCoinFilled`); outline só quando não há filled (`IconChevronRight`, `IconSearch`, `IconLoader`) ou como estado inativo.
- **Always** dimensione por classe: `size-3.5` (14px) é o padrão dentro de Button, chips, metadados e títulos de card; `size-4` em menus, selects, empty states e stat de detalhe; `size-4.5` (18px) na sidebar e no ícone de seção do PageHeader; `size-3` em badge `md` e linha meta; `size-3.25` para alinhar opticamente ao texto de 12px (`className="mb-px size-3.25"`).
- **Always** use o par outline (inativo) e filled (ativo) na navegação, com crossfade `transition-opacity duration-100 ease-in-out` dos dois SVGs em `[grid-area:1/1]` (apps/web/src/components/app/app-shell.tsx:237); cor própria vai como `text-*` no svg, porque Button e Badge só pintam svgs sem `text-` (`[&_svg:not([class*='text-'])]`).
- **Never** misture bibliotecas (`lucide-react`, `react-icons`, Phosphor) nem ponha margem em ícone dentro de Button.

Porquê: filled lê melhor nos 14px que o sistema usa, e o seletor `:not([class*='size-'])` deixa um `size-*` explícito vencer o default sem `!important`.

## Acessibilidade e teclado

<!-- mapa: 19.3, 8.10, 21.14 | regras 16 -->

- **Always** use o anel canônico de foco: `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` (Button, Input, Select, Switch, linha interativa com `ring-inset`); erro espelha com `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`.
- **Always** dê `aria-label` a botão só de ícone, `sr-only` a título de Sheet e Dialog sem texto visível, `role="status"` a Spinner e loader, `aria-pressed` a chip e pílula segmentada, `role="tab"`/`aria-selected` em barra de abas própria.
- **Always** faça linha de tabela e cabeçalho ordenável operáveis por teclado (`tabIndex 0`, Enter e Espaço espelham o click) com `router.prefetch` em `onMouseEnter` e `onFocus` (`rowNav`), `cursor-pointer` explícito em tudo que é clicável e `e.stopPropagation()` nos links dentro da linha; `Cmd/Ctrl+B` alterna a sidebar; `Escape` fecha painel.
- **Never** use `focus-visible:ring-[3px]` em componente novo (sobra do shadcn em Badge e Tabs), nem deixe dois `<main>` aninhados na mesma tela.

Porquê: teclado é primeira classe no Foglamp (linhas, sort, atalhos) e o anel de 1.5px é fino o bastante para não brigar com a sombra de 0.5px.

## Do guia: 02. Primitivos: os 41 do core, string a string

### DNA comum

| Preocupação | Classes | Onde |
|---|---|---|
| Foco por teclado | `focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` | button, input, textarea, input-group, select, native-select, checkbox, radio, switch, table row interativa |
| Foco de 3px (sobra do shadcn) | `focus-visible:ring-[3px] focus-visible:ring-ring/50` | badge, toggle, tabs trigger, scroll-area, item |
| Inválido | `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40` | button, input, textarea, select, native-select, checkbox, radio, switch |
| Desabilitado | `disabled:pointer-events-none disabled:opacity-50` (botões) ou `disabled:cursor-not-allowed disabled:opacity-50` (campos) | todos; switch usa `data-disabled:` |
| Superfície de campo | `rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent` + `dark:bg-input/30` | input, select trigger; input-group e textarea com `squircle:rounded-xl`; native-select com `rounded-lg` e `dark:border` |
| Superfície flutuante | `bg-popover`, `text-popover-foreground`, `shadow-(--custom-shadow)` + `rounded-md squircle:rounded-2xl corner-squircle` (menus, tooltip) ou `rounded-lg squircle:rounded-3xl` (popover) | popover, tooltip, dropdown-menu, dialog |
| Animação de popup | `origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` + `data-[side=bottom]:slide-in-from-top-2` e equivalentes | popover, dropdown-menu, select, hover-card, tooltip (sem `duration-*`: 150ms do tw-animate-css) |
| Placeholder | `placeholder:text-muted-foreground/50` (select: `data-placeholder:text-muted-foreground/50`) | input, textarea, native-select, select |
| Transição de campo | `transition-[color,box-shadow]` | input, textarea, input-group, native-select, toggle |
| Área de toque | `after:absolute after:-inset-x-3 after:-inset-y-2` | checkbox, radio, switch |

### Button (`registry/base-vega/ui/button.tsx`)

Base (:10): `group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-clip-padding text-sm font-medium whitespace-nowrap transition-all hover:duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5`

| variant (:14-31) | String completa | Sombra |
|---|---|---|
| default | `bg-neutral-800 dark:bg-neutral-100 shadow-[var(--custom-shadow-primary)] text-primary-foreground hover:bg-primary/80 dark:hover:bg-primary/90 [&_svg:not([class*='text-'])]:text-neutral-300 dark:[&_svg:not([class*='text-'])]:text-neutral-700` | `--custom-shadow-primary` |
| outline | `shadow-(--custom-outline-shadow) bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-card dark:hover:bg-muted [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-400` | `--custom-outline-shadow` |
| secondary | `bg-secondary shadow-[var(--custom-shadow-secondary)] text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:hover:bg-muted-foreground/25 [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-300` | `--custom-shadow-secondary` |
| ghost | `hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-400` | nenhuma |
| ghost-destructive | `hover:bg-destructive/10 hover:text-destructive text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:hover:bg-destructive/20 dark:focus-visible:ring-destructive/40` | nenhuma |
| destructive | `bg-destructive/10 shadow-[var(--custom-shadow-destructive)] text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40` | `--custom-shadow-destructive` |
| link | `text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground` | nenhuma |

| size (:34-44) | String completa | Altura |
|---|---|---|
| xs | `h-6 gap-[4.5px] rounded-full px-2.5 text-xs in-data-[slot=button-group]:rounded-full has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2 [&_svg:not([class*='size-'])]:size-[11px]` | 24px |
| sm | `h-7 gap-[5px] rounded-full px-3 in-data-[slot=button-group]:rounded-full has-[>svg:first-child]:pl-[9px] has-[>svg:last-child]:pr-[9px]` | 28px |
| default | `h-8 gap-[5.5px] px-3 in-data-[slot=button-group]:rounded-full has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5` | 32px |
| lg | `h-8.5 gap-1.5 px-[15px] has-[>svg:first-child]:pl-3 has-[>svg:last-child]:pr-3 [&_svg:not([class*='size-'])]:size-3.5` | 34px |
| icon / icon-sm | `size-8` / `size-8 rounded-full in-data-[slot=button-group]:rounded-full` | 32px (iguais) |
| icon-xs | `size-6 rounded-full in-data-[slot=button-group]:rounded-full [&_svg:not([class*='size-'])]:size-3` | 24px, ícone 12px |
| icon-lg | `size-10` | 40px |

### Badge (`badge.tsx`)

Molde das 10 cromáticas (:13-38): `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] focus-visible:ring-{c}-500/20 dark:bg-{c}-500/15 dark:text-{c}-300 dark:focus-visible:ring-{c}-500/40 [a]:hover:bg-{c}-500/20` para green, blue, amber, emerald, violet, fuchsia, sky; desvios: orange `text-orange-600 dark:bg-orange-600/15 dark:text-orange-400`, rose e red `dark:text-{c}-400`. Mais: default `bg-primary text-primary-foreground shadow-[var(--custom-shadow-primary)] [a]:hover:bg-primary/80`; secondary `bg-secondary shadow-(--custom-shadow-secondary) text-secondary-foreground [a]:hover:bg-secondary/80`; destructive `bg-destructive/10 text-destructive shadow-(--custom-shadow-destructive) focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20`; outline `shadow-(--custom-shadow) text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground`. Total 14 variants.

| size (:41-43) | String completa |
|---|---|
| sm | `h-4 px-1.5 gap-1 text-[10px] has-[>svg:first-child]:pl-1 has-[>svg:last-child]:pr-1 [&_svg:not([class*='size-'])]:size-2.5!` |
| md (default) | `h-5 px-2 gap-[5px] text-xs has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5 [&_svg:not([class*='size-'])]:size-3!` |
| lg | `h-6 px-2.5 gap-1.5 text-sm has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2 [&_svg:not([class*='size-'])]:size-3.5!` |

### Input e Textarea (`input.tsx`, `textarea.tsx`)

Input (:14): `h-9 w-full min-w-0 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base hover:dark:border-border/70 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40`

Textarea (:12): `flex field-sizing-content min-h-16 w-full rounded-md squircle:rounded-xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border dark:border-border/50 hover:dark:border-border/70 bg-transparent px-2.5 py-2 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40`

### Select e NativeSelect (`select.tsx`, `native-select.tsx`)

SelectTrigger (:90): `flex w-fit cursor-pointer items-center justify-between gap-1.5 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent py-2 pr-3 pl-3 text-sm whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground/50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`; ícone `IconSelector` `size-3.5 text-muted-foreground/50` (:98). Sizes `default` 36px, `sm` 32px; `w-fit` por padrão (forms passam `w-full`).

SelectContent (:133): `relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md squircle:rounded-2xl corner-squircle bg-popover p-1 text-popover-foreground shadow-md ring-[0.5px] ring-foreground/10 duration-100 outline-none ...` + animação de popup; `sideOffset=4`, `alignItemWithTrigger=false`. SelectItem (:177): `relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground ...` com `IconCheck` absoluto `right-2 size-4`; SelectLabel `px-2 py-1.5 text-xs text-muted-foreground` (:154); SelectSeparator `-mx-1 my-1 h-px bg-border` (:203).

### Card (`card.tsx`)

Card (:17): `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground has-[>img:first-child]:pt-0 data-[size=sm]:gap-2 data-[size=sm]:py-5 *:[img:first-child]:rounded-t-3xl *:[img:first-child]:corner-squircle *:[img:last-child]:rounded-b-3xl *:[img:last-child]:corner-squircle`

| Parte | Classes |
|---|---|
| CardHeader | `group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-6 group-data-[size=sm]/card:px-5 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4` |
| CardTitle (:43) | `font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm` |
| CardDescription | `text-sm text-muted-foreground text-balance` |
| CardAction | `col-start-2 row-span-2 row-start-1 self-start justify-self-end` |
| CardContent | `px-6 group-data-[size=sm]/card:px-5` (sem padding vertical: o espaçamento vem do `gap`) |
| CardFooter | `flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-5 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-5` |

`Card size="sm"` (`py-5 px-5 gap-2`, título `text-sm`) é o card de fato do dashboard (36 de 62 usos no Foglamp). Receitas: título à esquerda e controle à direita com `<CardHeader className="flex flex-row items-center justify-between gap-4">`; ajuste de distância com `<CardContent className="mt-2">`; conteúdo full-bleed com `Card className="pb-0! group-data-[size=sm]/card:pb-0!"` + `CardContent className="px-0 group-data-[size=sm]/card:px-0!"` (o `!` é necessário porque a variante `group-data-*` vence a utility simples); painel com scroll interno `className="gap-0 py-0"` + `CardContent className="flex min-h-0 flex-1 flex-col p-0"`.

### Dialog, AlertDialog, Sheet (`dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`)

| | Dialog | AlertDialog | Sheet |
|---|---|---|---|
| Backdrop | `fixed inset-0 isolate z-50 bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0` (:36) | igual (:35) | `fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-[2px]` (:33) |
| Superfície | `fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm text-popover-foreground shadow-(--custom-shadow) duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[96%] data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[99%]` (:58) | igual com `group/alert-dialog-content`, sem `text-sm`, largura `data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg` (:57) | `fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out ...` com `border-l`/`border-r`/`border-t`/`border-b` por lado e `w-3/4 sm:max-w-sm` (:61); `variant="floating"` `data-[variant=floating]:rounded-2xl squircle:data-[variant=floating]:rounded-[40px] data-[variant=floating]:corner-squircle data-[variant=floating]:border data-[variant=floating]:shadow-2xl` + `inset-y-3 right-3` por lado (:63-65) |
| Fechar | `Button variant="ghost" size="icon-sm"` `absolute top-4 right-4` com `IconX` + `sr-only`; `showCloseButton` default true | nenhum X; `AlertDialogCancel` é `Close render={<Button variant="ghost" />}` (:159), `AlertDialogAction` um Button comum (consumidores passam `variant="destructive"`) | igual ao Dialog em `top-5 right-5` (:79) |
| Header / título | `flex flex-col gap-1.5` / `font-heading leading-none font-medium text-base` (:126) | `grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center`, `sm:...:place-items-start sm:...:text-left` / `font-heading font-medium` | `flex flex-col gap-1.5 p-6` / `font-heading font-medium text-foreground` |
| Footer | `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` (:106) | igual; size sm vira `grid grid-cols-2` | `mt-auto flex flex-col gap-2 p-6` |

### Popover, HoverCard, Tooltip (`popover.tsx`, `hover-card.tsx`, `tooltip.tsx`)

| | Superfície | Defaults |
|---|---|---|
| PopoverContent (:42) | `z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-lg squircle:rounded-3xl corner-squircle bg-popover p-3 text-sm text-popover-foreground shadow-(--custom-shadow) outline-hidden duration-100` + popup | align center, side bottom, sideOffset 4; `PopoverHeader flex flex-col gap-1 text-sm`, `PopoverTitle font-medium`, `PopoverDescription text-muted-foreground` |
| TooltipContent (:58) | `z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md squircle:rounded-2xl corner-squircle bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-(--custom-shadow) has-data-[slot=kbd]:pr-1.5 ...` + popup sem `duration-*` | side top, sideOffset 4; `TooltipProvider delay={0}` (:10); seta `size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-popover fill-popover` (:64) |
| HoverCardContent (:43) | `z-50 w-64 origin-(--transform-origin) rounded-md squircle:rounded-2xl corner-squircle bg-popover p-3 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/5 outline-hidden duration-100` + popup | side bottom, sideOffset 4, alignOffset 4 |

### DropdownMenu (`dropdown-menu.tsx`)

Content (:47): `z-50 max-h-(--available-height) shadow-(--custom-shadow) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md squircle:rounded-2xl corner-squircle bg-popover p-1 text-popover-foreground duration-100 outline-none ...` + popup e `data-closed:overflow-hidden`; defaults align start, side bottom, sideOffset 4; SubContent reusa com `w-auto min-w-24`, side right, alignOffset -3.

Item (:96): `group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive` (32px de altura). CheckboxItem e RadioItem `py-1.5 pr-8 pl-2` com indicador `absolute right-2` (à direita, não à esquerda como o shadcn clássico); SubTrigger (:121) idem + `data-popup-open:bg-accent` + `IconChevronRight className="ml-auto"`; Label `px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8`; Separator `-mx-1 my-1 h-px bg-border/60` (:236); Shortcut `ml-auto text-xs tracking-widest text-muted-foreground`.

### Skeleton, Spinner, Loader (`skeleton.tsx`, `spinner.tsx`, `loader.tsx`)

Skeleton (:10): `animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted`. Vocabulário: linha de texto `h-3.5 w-full` / `w-2/3` / `w-28`, meta `h-3 w-16`, célula `h-4` + largura da coluna, ícone `size-4 shrink-0 rounded-md`, avatar `size-3.5 shrink-0 rounded-full squircle:rounded-full` (anula o squircle; Foglamp, apps/web/src/app/(app)/overview/overview-client.tsx), botão `h-7 w-12`; dentro de superfície já `bg-muted` troque por `bg-muted-foreground/15`. Spinner (:8-11): `<IconLoader role="status" aria-label="Loading" className="size-4 animate-spin" />` (é `IconLoader`, não o `IconLoader2` da regra escrita). TextShimmerLoader (`loader`): texto com `bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-clip-text text-transparent bg-size-[200%_auto] animate-shimmer` (:32-34), sizes `sm text-xs`, `md text-sm`, `lg text-base`, texto default "Thinking"; é o loader de "o modelo está pensando" (prompt-kit, MIT).

### Table (`table.tsx`)

| Parte | Classes | Pixels |
|---|---|---|
| `table` (:82) | `w-full caption-bottom text-sm [&_th:last-child]:pr-9 [&_td:last-child]:pr-9` | última coluna 36px |
| `TableHeader` (:100) | `h-13 [&_tr]:h-13`; sticky: `sticky top-0 z-10 bg-background [&_tr]:border-b-0 [&_th]:shadow-[inset_0_-1px_0_0] [&_th]:shadow-border/50 dark:[&_th]:shadow-border/40` | 52px (altura também no `tr` por causa do Safari) |
| `TableBody` | `[&_tr:last-child]:border-0` | |
| `TableRow` (:169) | `[&_th:last-child]:border-0 border-b dark:border-border/40 border-border/50 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50` | sem hover e sem transição por padrão |
| `TableRow interactive` (:170-176) | `data-interactive:cursor-pointer data-interactive:hover:bg-muted data-interactive:outline-none data-interactive:focus-visible:bg-muted/50 data-interactive:focus-visible:ring-[1.5px] data-interactive:focus-visible:ring-inset data-interactive:focus-visible:ring-ring/50 data-interactive:hover:border-transparent has-[+tr[data-interactive]:not([aria-expanded=true]):hover]:border-transparent` | `tabIndex 0`, Enter e Space clicam; a linha e a anterior apagam a borda no hover |
| `TableHead` (:193) | `text-left align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0 px-8.25` | 33px laterais, sem altura própria |
| `TableCell` (:214) | `align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 py-2 px-8.25`; altura fixada pelo consumidor com `h-12` ou `h-16` | |
| `align` (:20) | `left: text-left`, `center: text-center`, `right: text-right tabular-nums` em `TableHead` e `TableCell` | |
| `TableFooter` (:130), `TableCaption` (:232) | `border-t border-border/50 dark:border-border/40 bg-muted/50 ...` (lume trocou os hex `#EBEBEB`/`#1E1E1E`/`#2A2A2A`) | zero usos |

### Sidebar (`sidebar.tsx`)

`SidebarInset` (:312): `relative shadow-(--custom-shadow) dark:shadow-(--custom-shadow) flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg squircle:md:peer-data-[variant=inset]:rounded-3xl corner-squircle md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2`. As classes `peer-*` só disparam se o inset for irmão direto do `Sidebar`; o `app-shell` o embrulha num wrapper e reaplica `m-2 ml-0` e `md:rounded-lg squircle:md:rounded-3xl` por `className`.

`sidebarMenuButtonVariants` base (:480): `peer/menu-button group/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md squircle:rounded-xl corner-squircle p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent/70 active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground dark:data-active:bg-sidebar-accent/50 data-active:bg-sidebar-accent/70 data-active:text-sidebar-accent-foreground [&_svg]:size-4.5 [&_svg]:shrink-0 [&>span:last-child]:truncate`; variant `default hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground`, `outline bg-background shadow-[0_0_0_1px_var(--sidebar-border)] ...` (:487, corrigido); sizes `default h-8 text-sm`, `sm h-7 text-xs`, `lg h-12 text-sm`. O ativo é só fundo (70% light, 50% dark) sem `font-medium`; o sinal de ativo vem do ícone trocar de outline para filled.

## Do guia: 11. Receita: do zero a um app com a cara do Foglamp

### Passo 3: os primitivos

| Primitivo | Confira |
|---|---|
| `button`; `badge` | `rounded-full`, `h-8`, `active:scale-[0.97]`, `focus-visible:ring-[1.5px]`, ícone `size-3.5`, `has-[>svg:first-child]:pl-2.5`; variants `default bg-neutral-800 dark:bg-neutral-100`, `outline` com `shadow-(--custom-outline-shadow)`, `ghost-destructive`; badge `rounded-full capitalize`, `md h-5 text-xs`, 14 variants `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] dark:bg-{c}-500/15 dark:text-{c}-300` |
| `input`, `textarea`, `input-group`, `select`, `kbd`; `card` | `rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50`, `placeholder:text-muted-foreground/50`, `transition-[color,box-shadow]`; card `shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6`, `size="sm"` com `py-5 gap-2 px-5` |
| `dialog`, `alert-dialog`; `popover`, `tooltip`, `dropdown-menu` | backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, popup `rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6`, `zoom-in-[96%]` / `zoom-out-[99%]`; `Positioner isolate z-50` > `Popup origin-(--transform-origin) duration-100 data-open:animate-in ...`, tooltip não invertido, `TooltipProvider delay={150}` em volta de tabelas |
| `tabs`; `skeleton`, `empty`, `spinner`, `loader`, `separator` | lista `rounded-md squircle:rounded-2xl corner-squircle` + `bg-muted dark:bg-muted/50`, ativo `data-active:bg-background data-active:text-foreground data-active:shadow-(--custom-shadow) dark:data-active:bg-input/50`; `animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted`; `border-dashed border`; `IconLoader size-4 animate-spin role="status"`; `animate-shimmer`; `bg-border/70` |
