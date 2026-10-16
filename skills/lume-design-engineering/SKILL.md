---
name: lume-design-engineering
description: 'Design engineering rules for interfaces with the Foglamp look (Gustavo Fior), served by the joaodadas/lume shadcn registry: grey oklch tokens, shadow instead of border, squircle radii, Base UI primitives, Tabler icons, inset shell, tables, dashboards, forms, dialogs, motion and loading states. Use when the user asks for the "cara do Foglamp" or the "padrão do DS", for polish, dark mode, cards, tabelas or dashboards, for a "migração 52W", Radix or Lucide to lume, or to review UI against FRONTEND.md.'
metadata:
  author: joaodadas
  source: https://github.com/joaodadas/lume
  version: 0.1.1
  credits: Foglamp (Apache-2.0) e craft (MIT), Gustavo Fior
---

# lume design engineering

Gerado por `bun scripts/build-skill.ts`; não edite à mão. Fonte: `FRONTEND.md`, `docs/guia`, `docs/conceitos`, `docs/adocao` e `registry.json` de https://github.com/joaodadas/lume.

## O que é e quando usar

O lume é uma registry shadcn (`base-vega` sobre `@base-ui/react`, Tailwind v4, `@tabler/icons-react`) que copia a regra praticada no código do Foglamp (`2bc3bb5`): cinza oklch, sombra no lugar de borda, squircle, pílula de botão, shell inset, tabelas densas e loading que não mexe no layout. Use esta skill sempre que for escrever ou revisar uma tela num projeto que instalou o lume: novo componente, página de lista ou detalhe, formulário, dialog, dashboard, dark mode, animação, migração de 52W, Radix ou Lucide. Toda regra é dura salvo indicação em contrário: se um padrão não cabe, levante antes de contornar.

## Como usar

1. Ache a seção no digest abaixo (uma linha por seção do `FRONTEND.md`) ou no índice de references.
2. Leia a reference inteira antes de escrever código: ela traz as strings de classe exatas, os tokens e `arquivo:linha`.
3. Use os valores exatos (tokens, pares de raio, sombras, durações, curvas de `lib/motion.ts`); não invente um cinza, uma sombra ou uma curva nova.
4. Instale o que falta pela registry: `npx shadcn@latest add joaodadas/lume/<item>#v0.1.1` (lista em [12-itens](references/12-itens.md)); `components/ui/*` nunca é editado à mão, só atualizado com `--overwrite`.
5. Ao revisar UI, reporte cada mudança numa tabela Antes / Depois / Regra, citando a seção e `arquivo:linha`.

## Os 10 princípios

Do craft (a teoria, Gustavo Fior):

1. Detalhes que ninguém nota se acumulam: raio, espaçamento, easing e contraste certos por padrão são o que faz a interface parecer terminada.
2. Consistência vence novidade: as mesmas duas ou três curvas, as mesmas proporções de raio e a mesma receita de sombra no produto inteiro.
3. Movimento tem que merecer o lugar: o que é frequente é instantâneo; o raro ou espacial pode animar.
4. Respeite a intuição física: nada aparece do nada, cantos aninhados compartilham o centro, a luz vem de cima.

Do Foglamp (a regra praticada):

5. Cinza é estrutura e cor é significado: todo token é `oklch(L 0 0)`; emerald é ok, rose é erro, amber é aviso, e nenhuma tela inventa o próprio verde.
6. Sombra no lugar de borda: `shadow-(--custom-shadow)` separa superfícies; linha fina só em linha de tabela, divisor interno, campo no dark e no Empty tracejado.
7. Uma forma de botão: pílula `rounded-full`, `h-8`, `active:scale-[0.97]`, anel de 1.5px; a variant muda o peso da ação, não a forma.
8. Shell inset: canvas `bg-sidebar` mais escuro, a página é um cartão `bg-background` com sombra e squircle, scroll contido em três camadas.
9. Loading que não mexe no layout: skeleton só depois de 700 ms, `table-fixed` com larguras no header, header do `loading.tsx` idêntico ao da página.
10. Regra praticada vence a escrita: quando o `FRONTEND.md` original e o código do Foglamp divergem, vale o código; o lume marca o que é adição própria.

## Digest do FRONTEND.md

Uma linha por seção: o primeiro **Always** e o link para a seção inteira na reference.

<!-- digest:start -->
- **Cabeçalho, origem, como ler**: leia caminhos sem prefixo como relativos à raiz deste repo (`registry/base-vega/ui/button.tsx:10`); caminhos que começam em `apps/web/` ou `packages/ui/` são do Foglamp, citados para o que ainda não virou item da registry. ([ref](references/10-adocao.md#cabeçalho-origem-como-ler))
- **Layout do projeto**: trate `components/ui/*` como item da registry: é instalado pela CLI e atualizado com `add --overwrite`, nunca editado à mão. Uma variant nova entra por `className` com `cn()`; se for reusada, abre PR na base. ([ref](references/10-adocao.md#layout-do-projeto))
- **Composição: Base UI, `render`, `cn`, `data-slot`**: troque o elemento com a prop `render` do Base UI: `<Button render={<Link href="/x" />}>`, `<DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>`, `<TooltipTrigger render={<span />}>`. O filho (ícone e texto) fica no trigger; as props visuais vão no `render`. ([ref](references/02-primitivos.md#composição-base-ui-render-cn-data-slot))
- **Tokens e cor**: use os tokens semânticos: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-destructive`, `border-border`, `ring-ring`, `bg-sidebar`. Todos são `oklch(L 0 0)` em degraus da paleta `neutral` (`registry/base-vega/styles/globals.css:23-52,133-161`); a hierarquia vem da luminância: light `--background 0.99`, `--card 1`, `--sidebar 0.975`; dark `--sidebar 0.145`, `--background 0.17`, `--card 0.205`. ([ref](references/01-tokens-e-forma.md#tokens-e-cor))
- **Sombra no lugar de borda**: dê borda a uma superfície com `shadow-(--custom-shadow)`: light `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)` (`globals.css:53-56`); dark dois insets brancos de 0.75px a 3% mais anel e três drops pretos a 10% (`globals.css:162-166`). Card, Popover, Dropdown, Tooltip, Dialog, Alert, Kbd, Avatar e o inset do shell usam o mesmo token. ([ref](references/01-tokens-e-forma.md#sombra-no-lugar-de-borda))
- **Raio e squircle**: escreva o par `rounded-<menor> squircle:rounded-<maior> corner-squircle`: o raio grande só vale onde `corner-shape` existe (`@custom-variant squircle`, `globals.css:18`). Pares canônicos: `rounded-md squircle:rounded-2xl` (campos, popovers, skeleton), `rounded-md squircle:rounded-xl` (menus, botão da sidebar, tabs), `rounded-[5px] squircle:rounded-xl` (tile de ícone), `rounded-lg squircle:rounded-3xl` (Card, Popover, Alert, inset), `rounded-2xl squircle:rounded-[40px]` (Dialog), `rounded-xl squircle:rounded-4xl` (Empty), `rounded-sm squircle:rounded-[14px]` (Kbd). ([ref](references/01-tokens-e-forma.md#raio-e-squircle))
- **Superfícies**: monte superfície com a mesma receita: `bg-card` ou `bg-popover` (mesmo valor) + `shadow-(--custom-shadow)` + par de raio + padding + `text-sm`. Card: `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground` (`registry/base-vega/ui/card.tsx:17`). ([ref](references/01-tokens-e-forma.md#superfícies))
- **Tipografia**: viva em `text-sm` (14px) e `text-xs` (12px); `text-base` é o título de página e de card default. Degraus intermediários para dado denso e mono: `text-[13px]`, `text-[11px]`, `text-[10px]`. ([ref](references/01-tokens-e-forma.md#tipografia))
- **Espaçamento e ritmo**: empilhe com `flex flex-col gap-*` (`gap-2`, `gap-4`, `gap-1.5`, `gap-1`, `gap-3` são os cinco mais usados) ou `grid gap-4`; margens só para ajuste fino (`mt-1`, `mt-2`, `mt-3`, `-mt-2`). ([ref](references/03-shell-paginas-tabelas.md#espaçamento-e-ritmo))
- **Botões**: use o `Button` da registry: pílula `rounded-full`, `h-8` default (`xs` `h-6`, `sm` `h-7`, `lg` `h-8.5`, `icon-xs` `size-6`, `icon-sm` e `icon` `size-8`), `active:scale-[0.97]`, `focus-visible:ring-[1.5px] focus-visible:ring-ring/50`, ícone `size-3.5` e padding reduzido do lado do ícone `has-[>svg:first-child]:pl-2.5` (`registry/base-vega/ui/button.tsx:10,34-44`). ([ref](references/02-primitivos.md#botões))
- **Badges e chips**: use `Badge` para status: `rounded-full capitalize`, `md` (`h-5 px-2 gap-[5px] text-xs`, ícone `size-3!`) por padrão, `sm` (`h-4 text-[10px]`) só em chip de versão; 14 variants com sombra colorida no molde `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] dark:bg-{c}-500/15 dark:text-{c}-300` (`registry/base-vega/ui/badge.tsx:11-43`); `rose` e `red` usam `dark:text-{c}-400`. ([ref](references/02-primitivos.md#badges-e-chips))
- **Campos e formulários**: use `Input` (`h-9 ... rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base ... placeholder:text-muted-foreground/50 ... md:text-sm dark:bg-input/30`, `registry/base-vega/ui/input.tsx:14`), `Textarea` (`field-sizing-content min-h-16`), `SelectTrigger` (`data-[size=default]:h-9 data-[size=sm]:h-8`) e `Kbd`: a mesma superfície de campo, sombra no light e hairline no dark. ([ref](references/05-formularios-e-dialogs.md#campos-e-formulários))
- **Ícones**: importe de `@tabler/icons-react` e prefira o `*Filled` quando existir (`IconCircleCheckFilled`, `IconAlertTriangleFilled`, `IconCoinFilled`); outline só quando não há filled (`IconChevronRight`, `IconSearch`, `IconLoader`) ou como estado inativo. ([ref](references/02-primitivos.md#ícones))
- **Shell e sidebar**: use `Sidebar variant="inset"`, a única variante: `SIDEBAR_WIDTH = "14rem"` (`registry/base-vega/ui/sidebar.tsx:32`), canvas `bg-sidebar` sempre mais escuro que o inset `bg-background`, e o inset com `shadow-(--custom-shadow)` e `rounded-lg squircle:rounded-3xl corner-squircle` (`sidebar.tsx:312`), sem borda. ([ref](references/03-shell-paginas-tabelas.md#shell-e-sidebar))
- **Páginas: header, stat cards, grids**: defina o header uma vez por rota e renderize a mesma peça no `loading.tsx` e na página: `PageHeader` é `flex flex-wrap items-end justify-between gap-4 px-8 h-8` com `h1 flex items-center gap-2 text-base font-medium tracking-tight`, ícone de seção `size-4.5 shrink-0` com o tile do nav, e slot de ações `flex items-center gap-2 translate-y-1 empty:hidden` (apps/web/src/components/app/page-parts.tsx:90-131); `h-8` porque o range picker é `h-8`. ([ref](references/03-shell-paginas-tabelas.md#páginas-header-stat-cards-grids))
- **Tabelas e filtros**: use o `Table` da registry com `className="table-fixed min-w-5xl" stickyHeader`, larguras explícitas no `TableHead` (`w-28`, `w-32`, `w-36`, `w-40`), header `h-13 [&_tr]:h-13` (`registry/base-vega/ui/table.tsx:100`), célula `py-2 px-8.25` com altura na primeira (`h-12` uma linha, `h-16` título + meta), última coluna `pr-9`. ([ref](references/03-shell-paginas-tabelas.md#tabelas-e-filtros))
- **Loading, vazio e erro**: atrase o skeleton com `useDelayedLoading(loading, 700)` (`registry/base-vega/hooks/use-delayed-loading.ts:16`) e renderize `null` antes disso, nunca o empty state; skeleton só no corpo da tabela (`TableRowsSkeleton` com a mesma `rowHeight` das linhas reais) ou no valor do StatCard (`Skeleton className="h-3 w-20"` ao lado de um zero-width space que segura a line box). ([ref](references/07-estados.md#loading-vazio-e-erro))
- **Números, datas e formatação**: formate por `registry/base-vega/lib/format.ts`, função por função: `formatMoney(v, { currency: "BRL" | "USD" })`, `formatCost` (USD, 6 casas, zeros à direita caem até 2), `formatCostFixed(v, 6)` em coluna (alinha no decimal), `formatCount` (arredonda antes, compacta de 1000 em diante), `formatExactCount` (nunca "1 mil"), `formatCompact` (123, 12,3, 0,42), `formatDuration` (até duas unidades, "1h" e não "60min 0s"), `formatSpanDuration(0) = "<1ms"`, `formatPercent`, `formatRelative` ("agora", "há 3 min"), `formatDateTime` (dd/MM HH:mm), `formatDelta`. ([ref](references/04-dados-e-cor.md#números-datas-e-formatação))
- **Cor com significado**: use a tabela semântica fixa: emerald = ok, pass e embedding; rose = erro e falha; red = contagem de erro em célula; amber = aviso, abortado e agente; violet = llm; blue = tool; sky = sessões; orange = agentes; fuchsia = evals; yellow = alertas; lime = "varia por run". Paleta neutra `--chart-1..5` (cinzas iguais nos dois temas) para série sem semântica; `var(--destructive)` para erro em gráfico. ([ref](references/04-dados-e-cor.md#cor-com-significado))
- **Overlays e menus**: use os primitivos: `Dialog` (`rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm ... shadow-(--custom-shadow) duration-100 ... sm:max-w-md`, entra em `zoom-in-[96%]` e sai em `zoom-out-[99%]`, backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, `registry/base-vega/ui/dialog.tsx:36,58`), `AlertDialog` para confirmar remoção (`AlertDialogAction variant="destructive"`, cancelar ghost), `Popover`, `Tooltip`, `DropdownMenu`. ([ref](references/05-formularios-e-dialogs.md#overlays-e-menus))
- **Toasts**: monte um único `<Toaster />` no root (item `sonner`): ícones Tabler filled de 16px, só success verde e error vermelho, `--normal-bg: var(--popover)`, raio `--radius`, tema do `useTheme`. ([ref](references/07-estados.md#toasts))
- **Movimento**: anime primitivos só com CSS: `tw-animate-css` preso a `data-open`/`data-closed` (popups 100ms, Dialog 100ms), `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` no Accordion, `transition-colors` em link, `transition-opacity` em revelação; o default de 150ms vale para o resto. Entrada de página é `useEntranceOnce()` + `cn(entrance && "page-fade-in")`: 75ms, só opacidade, uma vez por hard load, no header e nos slots de card (a cópia do `loading.tsx` não anima). ([ref](references/06-movimento.md#movimento))
- **Dark mode**: monte `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` (item `theme-provider`, `app/layout.tsx:23-28`) ou `theme-provider-csp` com `public/theme.js` quando a CSP não aceita script inline; `suppressHydrationWarning` no `<html>`. ([ref](references/01-tokens-e-forma.md#dark-mode))
- **Fontes**: carregue pelo `base`: `@import "@fontsource-variable/inter/opsz.css"` e `@import "@fontsource-variable/geist-mono"` (`globals.css:9-10`), com `--font-sans: "Inter Variable"`, `--font-mono: "Geist Mono Variable"` e `--font-heading` igual à sans no `@theme inline` (`globals.css:227-231`); `html` e `body` em `font-sans`, `body` com `antialiased`. ([ref](references/01-tokens-e-forma.md#fontes))
- **Responsividade e camadas**: use só os breakpoints padrão do Tailwind v4 (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e três degraus no app: `md` para a sidebar fixa e grids de stats (`md:grid-cols-2`, `md:grid-cols-4`), `lg` para pares de cards (`lg:grid-cols-2`), `xl` para quatro colunas; `sm` só em Dialog (`sm:max-w-md`, `sm:flex-row` no footer) e marketing. ([ref](references/03-shell-paginas-tabelas.md#responsividade-e-camadas))
- **Acessibilidade e teclado**: use o anel canônico de foco: `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` (Button, Input, Select, Switch, linha interativa com `ring-inset`); erro espelha com `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`. ([ref](references/02-primitivos.md#acessibilidade-e-teclado))
- **Telas de detalhe e drawers**: siga o esqueleto comum: `PageHeader back={navItem(href)}` com `titleLeading` (ícone da entidade) ou `titleTrailing` (id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` + `CopyButton`), linha de `ContextChip` em `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`, faixa de `StatCard size="sm"` em `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1`, cards de gráfico e a tabela. ([ref](references/03-shell-paginas-tabelas.md#telas-de-detalhe-e-drawers))
- **Assistente de AI (chat)**: monte o painel como irmão flex do inset no canvas `bg-sidebar`, largura 354px (mínimo 320, máximo 640), tween `{ duration: 0.25, ease: ENTRANCE_EASE }` com `{ duration: 0 }` durante o arrasto, conteúdo interno de largura fixa para não refluir; `useReportLayoutReserve(open ? width : 0)` (item `header-slot`) avisa a Toolbar da largura futura. ([ref](references/08-chat-de-ai.md#assistente-de-ai-chat))
- **Marketing (opcional)**: use o container `mx-auto w-full max-w-7xl px-5 sm:px-8` e títulos em `font-display text-3xl font-[450] tracking-tight text-balance sm:text-4xl` (450 é o peso mais recente; 600 nas páginas antigas), corpo `text-lg text-muted-foreground text-pretty`. ([ref](references/01-tokens-e-forma.md#marketing-opcional))
- **Next.js e Vite: o que muda**: no Next: trio por rota (`header.tsx` com um `RouteHeader`, `loading.tsx` só com ele, `page.tsx` com o client ou `Suspense fallback={<XHeader />}` quando lê `useSearchParams`); `params` e `searchParams` são `Promise` e o server resolve e passa como prop; instale `link-next` (mesmo caminho `components/link.tsx`, sobre `next/link` com `prefetch`); imagens por `next/image` com `alt` obrigatório. ([ref](references/10-adocao.md#nextjs-e-vite-o-que-muda))
- **Regras para agentes**: instale e use junto: `npx skills add joaodadas/lume --skill lume-design-engineering` (este arquivo gerado em `SKILL.md` + `references/`), `npx skills add gustavo-fior/craft` (a teoria; o lume cita o craft, não o substitui), `web-design-guidelines` de `vercel-labs/agent-skills` (reviewer que reporta `arquivo:linha`) e `emilkowalski/skills` (animação); a ordem de leitura está em `docs/referencias.md`. ([ref](references/10-adocao.md#regras-para-agentes))
<!-- digest:end -->

## References

<!-- index:start -->
- [01-tokens-e-forma](references/01-tokens-e-forma.md): Tokens e forma
- [02-primitivos](references/02-primitivos.md): Primitivos
- [03-shell-paginas-tabelas](references/03-shell-paginas-tabelas.md): Shell, páginas e tabelas
- [04-dados-e-cor](references/04-dados-e-cor.md): Dados e cor
- [05-formularios-e-dialogs](references/05-formularios-e-dialogs.md): Formulários e dialogs
- [06-movimento](references/06-movimento.md): Movimento
- [07-estados](references/07-estados.md): Estados: loading, vazio, erro e toasts
- [08-chat-de-ai](references/08-chat-de-ai.md): Chat de AI
- [09-conceitos-craft](references/09-conceitos-craft.md): Conceitos do craft
- [10-adocao](references/10-adocao.md): Adoção
- [11-anti-padroes](references/11-anti-padroes.md): Anti-padrões
- [12-itens](references/12-itens.md): Itens da registry
<!-- index:end -->

## Anti-padrões

Lista completa, com o "em vez disso" de cada seção, em [11-anti-padroes](references/11-anti-padroes.md).

- `border` fechando caixa, `shadow-md`, `ring-1 ring-foreground/10`: em vez disso `shadow-(--custom-shadow)`.
- `asChild`, `data-[state=open]`, segunda lib de componentes: em vez disso `render`, `data-open`, só os primitivos da registry.
- `lucide-react`, mistura de libs de ícone, margem em ícone dentro de Button: em vez disso `@tabler/icons-react`, filled quando existe, `gap` do botão.
- Hex, `rgb()`, `slate`/`gray`/`zinc` em className: em vez disso tokens e `neutral`; hex só quando a cor é dado, com comentário.
- `space-y-*`, valor arbitrário sem comentário: em vez disso `flex flex-col gap-*` e os gutters `px-8` (texto) e `px-6` (controles).
- `font-bold`, `text-2xl`, mono para alinhar número: em vez disso `font-medium`, `text-sm`/`text-base`, `tracking-tight`, `tabular-nums`.
- Spinner dentro do botão, "Carregando..." cru, skeleton antes de 700 ms, erro em dialog: em vez disso texto do botão muda, `useDelayedLoading`, toast com retry.
- `hover:scale-*`, curva ou spring literal no componente: em vez disso hover só de cor e o vocabulário de `lib/motion.ts`.
- Travessão como placeholder: em vez disso `sem dado` em `text-muted-foreground/50`.
- TanStack Table, Zustand, provider de contexto dentro da página: em vez disso hooks pequenos sobre `Table`, URL para estado de lista, contexto no shell.

## Checklist de revisão

Antes de abrir PR (mapa 21.14), e reporte o resultado na tabela Antes / Depois / Regra:

<!-- checklist:start -->
- [ ] Dois temas, sempre: `defaultTheme="dark"` com `enableSystem`; cada superfície conferida em light e dark (botão com sombra nos dois, campo com hairline no dark).
- [ ] Duas larguras: 1440 e 390; a sidebar tem gatilho abaixo de 768 px.
- [ ] `prefers-reduced-motion` ligado: nada fica escondido esperando `onAnimationComplete`; charts em `animationType "none"`.
- [ ] Teclado: linhas com `tabIndex 0` e Enter/Espaço, `SortableHead` operável, `Cmd/Ctrl+B` na sidebar, `Escape` fecha painéis.
- [ ] Loading: nenhum skeleton antes de 700 ms, nenhuma troca skeleton/dados que mova coluna (`table-fixed`), header do `loading.tsx` idêntico ao da página.
- [ ] Fontes: `document.fonts` lista Inter Variable 100 a 900 e Geist Mono Variable (Host Grotesk só com `font-display`); `font-mono` computa Geist Mono.
- [ ] Erro decidido: query que falha vira toast com retry; "não existe" é `EmptyState` tracejado; `error.tsx` mínimo com `EmptyState` + `Button variant="outline"` (adição do lume); tela inteira de erro só fora do shell.
- [ ] Breakpoints e camadas: só os padrões do Tailwind (`md` sidebar e stats, `lg` pares de cards, `xl` quatro colunas, `sm` só em dialog e marketing); `z-50` só portal e `fixed`; 10/20/30 dentro de `relative isolate`; `-z-10` para fundo decorativo.
- [ ] Repo: nenhum `lucide`, `asChild`, `hsl(var(`, hex em classe fora de dado, travessão; `bun run check`, `bun run typecheck` e `bun run lint` verdes; `skills/` sem diff depois de `bun run skill:build`.
<!-- checklist:end -->

## Instalação e convivência

```bash
npx skills add joaodadas/lume --skill lume-design-engineering   # esta skill
npx skills add gustavo-fior/craft                                # a teoria; o lume cita o craft, não o substitui
npx skills add vercel-labs/agent-skills --skill web-design-guidelines   # reviewer de a11y e UX com arquivo:linha
npx skills add emilkowalski/skills                               # animação: quando não animar, duração e easing
```

- A skill entra em `.agents/skills/lume-design-engineering` com link em `.claude/skills` e `skills-lock.json` commitado; `npx skills update` atualiza.
- Ordem de leitura numa tarefa de UI: esta skill (a regra do sistema), depois o craft (o porquê), depois `web-design-guidelines` na revisão final. Conflito entre elas: vale o `FRONTEND.md` do lume, porque é a regra praticada no código que o projeto instalou.
- As regras do projeto (`AGENTS.md`) e o `FRONTEND.md` instalado pelo item `guia` (`docs/lume/FRONTEND.md`) têm a última palavra sobre esta skill quando divergirem.
