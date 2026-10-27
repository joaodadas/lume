# Shell, páginas e tabelas

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/03-shell-e-paginas.md`, `docs/guia/04-dados.md`, `docs/guia/05-telas-de-detalhe.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Espaçamento e ritmo

<!-- mapa: 8.8, 19.3 | regras 13 -->

- **Always** empilhe com `flex flex-col gap-*` (`gap-2`, `gap-4`, `gap-1.5`, `gap-1`, `gap-3` são os cinco mais usados) ou `grid gap-4`; margens só para ajuste fino (`mt-1`, `mt-2`, `mt-3`, `-mt-2`).
- **Always** respeite os gutters da página: `px-8` (32px) para texto, título, grids de cards e estados vazios; `px-6` (24px) para controles (Toolbar `pl-6 pr-6`, rodapé de paginação); `px-8.25` (33px) nas células de tabela e `pr-9` na última coluna.
- **Always** use a coluna da página `flex flex-col gap-4 py-6 px-0 pb-16` (apps/web/src/components/app/app-shell.tsx:389) e o bloco header + toolbar em `flex flex-col gap-4 mt-1`, com a tabela em `-mt-2`.
- **Never** use `space-y-*`/`space-x-*` nem valor arbitrário de espaçamento (`p-[13px]`) sem comentário de uma linha; `size-3.25`, `gap-1.75`, `h-13`, `px-8.25` são da escala contínua do Tailwind v4, não arbitrários.

Porquê: 32px alinha texto, 24px alinha controles (que, por terem superfície própria, parecem alinhados a 32px), e a tabela usa 33px para o texto da célula cair na coluna do título.

## Shell e sidebar

<!-- mapa: 7.2, 8.2, 8.3 | regras 13 -->

- **Always** monte todo app com navegação sobre o `AppShell`, em um de dois layouts (adição do lume). `layout="sidebar"`, o padrão: `Sidebar variant="inset"`, a única variante, com `SIDEBAR_WIDTH = "14rem"` (`registry/base-vega/ui/sidebar.tsx:32`), que recolhe para o trilho de `3rem` com `collapsible="icon"` (padrão) ou some com `"offcanvas"`. `layout="topbar"`: barra `h-12` opaca no canvas, sem `Sidebar` no desktop, com um nível de até 7 zonas, que rolam dentro da barra quando ela estreita, com a busca reduzida à lupa. Nos dois, o canvas `bg-sidebar` é sempre mais escuro que o inset `bg-background`, e o inset leva `shadow-(--custom-shadow)` e `rounded-lg squircle:rounded-3xl corner-squircle` (`sidebar.tsx:312`), sem borda.
- **Always** contenha o scroll em três camadas: provider `group/shell relative h-svh min-h-0 overflow-hidden`, `SidebarInset className="min-h-0 overflow-hidden ... md:rounded-lg squircle:md:rounded-3xl"` (o único `main`) e um viewport `div`, nunca um segundo `main`, em `min-h-0 flex-1 overflow-y-auto outline-none`, com a coluna `flex flex-col gap-4 py-6 px-0 pb-16` dentro (`registry/base-vega/blocks/app-shell/app-shell.tsx`). Com `fill`, a página é dona do scroll e a coluna vira `flex min-h-0 flex-1 flex-col`. O wrapper do inset reaplica `md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0` porque o inset não é irmão direto do `peer`, e usa `ml-0.5` no trilho para o cartão ficar a 8 px da sidebar nos dois estados.
- **Always** escreva a navegação com o modelo `Nav` de `components/app-shell/nav.ts`: até 7 itens sem rótulo; acima disso, seções com rótulo de 5 a 9 itens; um nível de filho, que abre no lugar na sidebar e na gaveta e vira menu ao lado no trilho e abaixo na barra; `external: "tab"` com seta e "abre em nova aba", `"page"` sem seta e com navegação inteira; `badge` só com dado e com texto para leitor de tela; `menu` só como atalho de ação que também existe na página.
- **Always** marque o item ativo só com fundo, ícone filled e `aria-current="page"`: `data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50`, botão `rounded-md squircle:rounded-xl corner-squircle p-2 ... [&_svg]:size-4.5` (`sidebar.tsx:480`), link por `render={<Link href={href} aria-current="page" />}`, sem `font-medium`. O mesmo item serve a sidebar, o trilho, a gaveta e a barra, sem área morta entre um e outro: `SidebarMenu className="gap-0"` e o `NAV_BUTTON` de `components/app-shell/nav-list.tsx` (`h-9 border-y-2 border-transparent bg-clip-padding`), pílula de 32 px em passo de 36 px e de 44 px na gaveta; um tool do app usa a mesma classe.
- **Always** deixe o gatilho visível: `ShellTrigger` em (16, 16) no desktop nos três estados (aberta, trilho e recolhida em `offcanvas`, quando o cabeçalho do cartão aparece) e no cabeçalho `h-12` do cartão no celular. Abaixo de 768 px, a sidebar e a barra viram a gaveta, o `Sheet` do primitivo, com 3/4 da tela (o `data-[side=left]:w-3/4` do Sheet vence os `18rem` de `SIDEBAR_WIDTH_MOBILE`) e itens de 44 px. `Cmd/Ctrl+B` alterna sem animação, não age em `contenteditable` e não faz nada no desktop do `layout="topbar"`.
- **Never** use `variant="sidebar"` ou `"floating"`; `SidebarRail` (a faixa de arrastar com `tabIndex={-1}`, `sidebar.tsx:282-305`; o modo `icon` não é ele); barra com `border-b`, blur ou segunda linha; `NavigationMenu` na barra ou menu de zona que abre no hover; dois níveis de filho; busca, sino ou contagem sem fonte de dado; `layout="topbar"` como navegação principal de front da Lyx; ou tema, projeto e período em provider dentro da página. Contexto vive no shell (`HeaderActionsSlotProvider`, `RangeProvider`, `ThemeProvider`), e o controle do filtro global vai nas ações do `PageHeader`.
- **Always** faça como página solta a tela que não navega entre telas (login, link por token, convite, sem acesso, onboarding, embed): `main` no canvas `bg-sidebar` com um `Card` centrado, sem `AppShell` (receita em `docs/guia/03-shell-e-paginas.md`).

Porquê: um shell só, em que o formato muda onde a navegação mora e nunca o material. No inset, o conteúdo é um único cartão flutuando sobre o canvas, e a sombra resolve a separação; `sidebar` precisaria de `border-r` e `floating` criaria dois cartões. O trilho é adição do lume, porque os fronts da Lyx recolhem para ícones, embora Vercel e Linear escondam a sidebar inteira em 2026. O Foglamp não tem gatilho no mobile, e isso é bug, não regra.

## Páginas: header, stat cards, grids

<!-- mapa: 8.4, 8.5, 8.11, 8.12 | regras 14, 15 -->

- **Always** defina o header uma vez por rota e renderize a mesma peça no `loading.tsx` e na página: `PageHeader` é `flex flex-wrap items-end justify-between gap-4 px-8 h-8` com `h1 flex items-center gap-2 text-base font-medium tracking-tight`, ícone de seção `size-4.5 shrink-0` com o tile do nav, e slot de ações `flex items-center gap-2 translate-y-1 empty:hidden` (apps/web/src/components/app/page-parts.tsx:90-131); `h-8` porque o range picker é `h-8`.
- **Always** use `back={navItem(nav, href)}` para detalhe (o ícone é opcional: sem ele, o crumb sai só com o rótulo): `h1` com `gap-1.5`, link `text-muted-foreground transition-colors hover:text-foreground` e separador `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; nunca o primitivo `Breadcrumb`.
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

## Responsividade e camadas

<!-- mapa: 8.13, 15.2.7, 19.3 | regras 13 -->

- **Always** use só os breakpoints padrão do Tailwind v4 (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e três degraus no app: `md` para a sidebar fixa e grids de stats (`md:grid-cols-2`, `md:grid-cols-4`), `lg` para pares de cards (`lg:grid-cols-2`), `xl` para quatro colunas; `sm` só em Dialog (`sm:max-w-md`, `sm:flex-row` no footer) e marketing.
- **Always** meça em vez de usar media query quando a largura depende de um painel vizinho: `ResizeObserver` na Toolbar, `@container` com `@lg:` na timeline, `useIsMobile()` (768px) só para a sidebar.
- **Always** reserve `z-50` para portal e `fixed` (popups com `isolate z-50` no Positioner, Dialog, Sheet); dentro da página três degraus (`z-10`, `z-20`, `z-30`) relativos a um pai `relative isolate`, fundo decorativo em `-z-10`.
- **Never** crie `--breakpoint-*`, `--z-*` ou `2xl:`; o app é desktop-first e degrada (tabela `min-w-5xl` rola, cards empilham), o marketing é mobile-first.

Porquê: sem escala nomeada, a consistência vem de poucos valores repetidos; `isolate` garante que `-z-10` fique atrás dos irmãos mas nunca atrás do fundo da página.

## Telas de detalhe e drawers

<!-- mapa: 11.2, 10.4 | regras 4, 14 -->

- **Always** siga o esqueleto comum: `PageHeader back={navItem(nav, href)}` com `titleLeading` (ícone da entidade) ou `titleTrailing` (id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` + `CopyButton`), linha de `ContextChip` em `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`, faixa de `StatCard size="sm"` em `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1`, cards de gráfico e a tabela.
- **Always** faça seção de painel com `px-5 py-5` separada da seguinte por `border-b border-border/40`, nunca na última ("a trailing border on the last section reads as a bug", apps/web/src/app/(app)/traces/[traceId]/trace-detail-client.tsx:2072); par rótulo e valor em `flex min-w-0 flex-col gap-1` com `text-xs text-muted-foreground` e `text-[13px] tabular-nums` num `grid grid-cols-2 gap-4`.
- **Always** expanda linha de tabela em gaveta com `TableRow interactive aria-expanded`, chevron `size-3.5 text-muted-foreground/50 transition-[rotate,color] duration-300 ease-out` (`rotate-90` aberto), linha aberta `border-b-transparent bg-neutral-100 dark:bg-card`, gaveta `TableCell colSpan` em `bg-neutral-100 px-8 pt-2 pb-8 dark:bg-card`, deep link `?id=` espelhado com `router.replace(..., { scroll: false })`.
- **Never** mostre o empty state de uma seção antes dos stats chegarem (um rollup lento piscaria o vazio), nem use `Drawer`/`Sheet` para o que é linha expansível: o item `drawer` é Base UI desde a v0.2.0 (sem vaul, sem Radix) e serve para painel inferior em mobile com `side="bottom"` e alça; `Sheet` é o painel lateral no desktop; a linha expansível continua sendo `TableRow aria-expanded` com `TableCell colSpan`.

Porquê: o detalhe é a lista mais um painel; manter a mesma gramática (chips, stats, tabela) faz a navegação lista para detalhe parecer um zoom e não uma tela nova.

## Do guia: 03. Shell, navegação e páginas de lista

### Camadas do shell

| Camada | Elemento | Classes exatas | Fonte |
|---|---|---|---|
| Canvas | `SidebarProvider` | `group/shell relative h-svh min-h-0 overflow-hidden [&_[data-slot=sidebar-gap]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-slot=sidebar-container]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-sidebar=group-label]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&[data-instant]_*]:transition-none motion-reduce:[&_[data-slot=sidebar-gap]]:transition-none motion-reduce:[&_[data-slot=sidebar-container]]:transition-none motion-reduce:[&_[data-sidebar=group-label]]:transition-none motion-reduce:[&_[data-sidebar=menu-button]]:transition-none`; no `topbar`, mais `md:bg-sidebar`, porque sem `Sidebar` no desktop o `has-data-[variant=inset]:bg-sidebar` do primitivo não acende | `CANVAS`; o começo, `group/shell relative h-svh min-h-0 overflow-hidden`, é o do Foglamp (app-shell.tsx:306) |
| Skip link | `a data-slot="shell-skip-link"`, o primeiro foco | `sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-popover focus:px-3 focus:py-1.5 focus:text-sm focus:shadow-(--custom-shadow)` | `SKIP_LINK` |
| Sidebar | `Sidebar variant="inset"` (a única variante) com `collapsible="icon"` (padrão) ou `"offcanvas"` | container `fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear ... md:flex` + `p-2`; `--sidebar-width: 14rem`, `--sidebar-width-icon: 3rem`; no trilho, o gap vai a `calc(var(--sidebar-width-icon)+(--spacing(4)))` e o container fica `2px` maior; abaixo de 768 px vira a gaveta | registry/base-vega/ui/sidebar.tsx:32-34,184-207,220-242 |
| Linha do topo | `div` no `SidebarHeader`, com `ShellTrigger` e marca (ou `top`) | `flex min-w-0 items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-start`; abaixo dela, `tools` numa `SidebarMenu className="gap-0"`, e sem `tools` nada é renderizado | `TOP_LINE` |
| Marca | `div` em volta de `brand` | `flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:*:not-first:hidden`: no trilho sobra o primeiro filho, centrado em 32 px, por isso a marca e o nome vão como irmãos; na barra, `w-auto shrink-0` no lugar de `w-full min-w-0` e sem os `group-data-*` | `BRAND`, `BRAND_BAR` |
| Conteúdo | `SidebarContent` com a nav | `group-data-[collapsible=icon]:overflow-y-auto`: o primitivo trava em `overflow-hidden` no trilho (registry/base-vega/ui/sidebar.tsx:376) e cortaria lista longa | |
| Barra (`topbar`) | `header data-slot="shell-bar"`, montado só fora do celular | `@container/shell-bar hidden h-12 shrink-0 items-center gap-3 px-2 md:flex` | |
| Wrapper | `div data-slot="shell-wrapper"` | sidebar: `flex min-h-0 min-w-0 flex-1 flex-col gap-2 transition-[margin] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[collapsible=offcanvas]:ml-2 md:peer-data-[variant=inset]:peer-data-[collapsible=icon]:ml-0.5`; topbar: `flex min-h-0 min-w-0 flex-1 flex-col md:mx-2 md:mb-2` | `WRAPPER`, `WRAPPER_BAR` |
| Inset (o cartão) | `SidebarInset`, o único `<main>` | base `relative shadow-(--custom-shadow) dark:shadow-(--custom-shadow) flex w-full flex-1 flex-col bg-background ...` + `min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl` | registry/base-vega/ui/sidebar.tsx:307-312 |
| Cabeçalho do cartão | `header data-slot="shell-card-header"`, com `ShellTrigger`, marca (ou `top`) e a página atual | `flex h-12 shrink-0 box-content items-center gap-2 border-b border-border/40 px-3 pt-[env(safe-area-inset-top)] md:hidden`; com a sidebar recolhida em offcanvas no desktop, mais `md:flex md:px-2`; marca em `flex min-w-0 flex-1 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0`; página atual (de `findActive`) em `ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground`, com o `NavIcon` | `CARD_HEADER`, `CARD_BRAND` |
| Faixa | `div data-slot="shell-banner"`, só com `banner` | `shrink-0`, entre o cabeçalho e o viewport, fora do scroll | |
| Viewport de scroll | `div data-slot="shell-viewport"` com `tabIndex={-1}`, alvo do skip link | `min-h-0 flex-1 overflow-y-auto outline-none`; com `fill`, `flex min-h-0 flex-1 flex-col overflow-hidden outline-none` | `VIEWPORT`, `VIEWPORT_FILL`; no Foglamp era um `<main>` (app-shell.tsx:388) |
| Coluna da página | `div data-slot="shell-column"` | `flex flex-col gap-4 py-6 px-0 pb-16`; com `fill`, `flex min-h-0 flex-1 flex-col` | `COLUMN`, `COLUMN_FILL`; Foglamp app-shell.tsx:389 |

A árvore é a mesma nos dois layouts, com `null` no lugar do que falta:

```text
HeaderActionsSlotProvider > LayoutReserveProvider > ShellLayoutProvider (layout)
  SidebarProvider                          canvas; ref para o data-instant do atalho
    a data-slot="shell-skip-link"          "Pular para o conteúdo"
    CloseOnNavigate, ShellKeys             sem DOM
    SidebarMenu hidden com tools ou null   só no celular com a gaveta fechada: mantém o Cmd/Ctrl+K
    TooltipProvider delay={150}            sem DOM: o peer da Sidebar continua irmão do wrapper
      Sidebar ou null                      no topbar, só no celular (a gaveta)
    div data-slot="shell-wrapper"
      header data-slot="shell-bar" ou null só no topbar, fora do celular
      SidebarInset                         o cartão e o único main
        header data-slot="shell-card-header"
        div data-slot="shell-banner" ou null
        div data-slot="shell-viewport"     id do skip link, tabIndex -1
          div data-slot="shell-column"
            children
    panel ou null                          irmão do wrapper, no canvas
```

### Formatos

| Formato | Como se monta |
|---|---|
| Lateral | `layout="sidebar"`, o padrão |
| Agente | a Lateral em trilho, com `fill` e `panel` |
| Barra de zonas | `layout="topbar"` |
| Página solta | receita sem `AppShell` (seção Página solta, neste capítulo) |

**Regra de escolha.**

1. Não navega entre telas (login, link por token, convite, sem acesso, indisponível, onboarding, embed): página solta.
2. Um nível com até 7 zonas, produto de leitura que quer a largura toda, ou mural de TV: `layout="topbar"`. Hoje vale só para a Horizonte (Plataforma, Início, Carteira e Conta) e para o mural do BI. Front da Lyx que navega nunca usa a barra.
3. Todo o resto: `layout="sidebar"`, o padrão. A barra que passar de 7 zonas ou pedir segundo nível vira Lateral.
4. Recolher: `collapsible="icon"` (padrão) quando todo item de primeiro nível tem ícone e o app é de uso diário; `"offcanvas"` quando a nav é texto ou a tela às vezes pede a largura toda; `defaultOpen={false}` quando a lista é longa e o conteúdo manda (BI). O trilho é sempre estado recolhido, nunca o único estado: a primeira visita abre a sidebar.
5. Agrupar: até 7 itens sem rótulo; acima disso, seções com rótulo de 5 a 9. Um nível de filho, nunca dois. O excedente vai para a paleta ou para um item com filhos. Seção vazia não aparece, e o filtro por papel roda antes do shell.
6. Altura e paralelo: `fill` quando a página é dona do scroll (chat, mural, editor); `panel` quando um assistente ou a carteira trabalha ao lado; o que é passageiro abre em Sheet, e o que é destino vira rota.
7. Contexto: `top` recebe o `ContextSwitcher` só quando há mais de um contexto (sistemas irmãos, obra, setor, praça, conta). O Hub não leva. Trocar de contexto é link.
8. Dados: busca, contagem e sino só com fonte real; contagem zero não aparece. Na Lateral, notificação é item com badge (Inbox). Na barra, é um botão de ícone em `tools`.
9. Filtro global (obra, período) mora num provider do shell, e o controle vai nas ações do `PageHeader`, como o `RangePicker`. Não existe barra de filtros no chrome.
10. Conta na Lyx: "Voltar ao Hub" (mantém o SSO) e "Sair de todos os sistemas" (signOut) são dois itens do `userMenu`, montados pela camada Lyx. A pesquisa achou 20 arquivos em 12 repos misturando as duas semânticas.

### Formatos

**Lateral: recolher.**

| Estado | Desktop | Gatilho |
|---|---|---|
| Aberta | 14rem; o cartão fica a 8 px do miolo da sidebar | `ShellTrigger` no topo da sidebar, em (16, 16) |
| Trilho (`collapsible="icon"`, padrão) | gap de `3rem` mais `1rem` e container `2px` maior (registry/base-vega/ui/sidebar.tsx:226-238); o wrapper vai a `ml-0.5` e o cartão continua a 8 px. A linha do topo vira coluna: a marca desce para (16, 52), centrada na mesma coluna dos ícones; seção sem item com ícone, item sem ícone e item desabilitado somem; os rótulos continuam no DOM, cortados por overflow | o mesmo `ShellTrigger`, na mesma posição |
| Recolhida (`collapsible="offcanvas"`) | sidebar fora da tela e fora da ordem do Tab (`inert` no container), wrapper com `ml-2` | `ShellTrigger` no cabeçalho do cartão, em (16, 16): 8 do wrapper mais 8 do `md:px-2` |

Recolher ou expandir não perde o foco. Quando o elemento focado some (no trilho, o rótulo do pai, um filho, o item sem ícone, o ⋯ ou o seletor sem ícone; ao expandir, o cabeçalho do cartão) ou fica `inert` (a sidebar em offcanvas), o `AppShell` leva o foco, logo depois do commit, ao `ShellTrigger` à vista: o do cabeçalho do cartão com a sidebar fora, o do topo da sidebar nos outros estados. Sem isso o navegador o largaria no `body` (WCAG 2.4.3). Foco num campo da página fica onde está.

**Lateral: celular**, abaixo de 768 px (registry/base-vega/hooks/use-mobile.ts:5).

- A sidebar vira o `Sheet` do primitivo (registry/base-vega/ui/sidebar.tsx:184-207). O `SIDEBAR_WIDTH_MOBILE` pede `18rem`, mas o `data-[side=left]:w-3/4` do `SheetContent` vence o `w-(--sidebar-width)` por especificidade: a gaveta sai com 3/4 da tela (292,5 px em 390) e para em `sm:max-w-sm`. É do primitivo e só muda com um `Patch`.
- A gaveta abre pelo `ShellTrigger` do cabeçalho `h-12` do cartão. O cartão encosta nas bordas: margem e raio só valem a partir de `md`.
- Na gaveta ficam a linha do topo (`ShellTrigger` como "Fechar menu" e a marca), `tools`, as seções e a conta.
- Itens de 44 px por `in-data-[mobile=true]:h-12` (a pílula de 44 entre as bordas transparentes de 2 px), sobre o `data-mobile="true"` de registry/base-vega/ui/sidebar.tsx:191; a contagem e o ⋯ descem para `top-3.5`. O `ShellTrigger` ("Abrir menu" e "Fechar menu") e o `ContextSwitcher` também chegam a 44 px de alvo, no cabeçalho do cartão e na gaveta.
- Os `tools` moram na gaveta, e o `Sheet` desmonta o conteúdo fechado. Para o Cmd/Ctrl+K do `SearchTrigger` valer com a gaveta fechada, o `AppShell` monta uma cópia escondida dos `tools` (`SidebarMenu hidden`, fora do Tab e do leitor de tela) enquanto ela está fechada e a tira quando ela abre. Na saída animada da gaveta as duas coexistem, e o `defaultPrevented` do `useShortcut` deixa só uma abrir a paleta.
- O ⋯ fica sempre visível, porque o `showOnHover` só esconde a partir de `md` (registry/base-vega/ui/sidebar.tsx:572); com contagem e ⋯ no mesmo item, a contagem anda para a esquerda dele.
- Item com filhos abre no lugar, e não há tooltip. O menu de conta abre com `side="top"`.
- A gaveta fecha ao navegar (`CloseOnNavigate`).
- Área segura: o cabeçalho do cartão já soma `pt-[env(safe-area-inset-top)]`, que vale 0 sem `viewport-fit=cover`.
- O "Sidebar" e o "Displays the mobile sidebar." em inglês da gaveta e o `shadow-lg` do Sheet vêm do primitivo (registry/base-vega/ui/sidebar.tsx:200-203; registry/base-vega/ui/sheet.tsx:61): também só mudam com um `Patch`.

### Formatos

**Barra de zonas: camadas.**

| Camada | Classes |
|---|---|
| Canvas | o `CANVAS` da Lateral mais `md:bg-sidebar`: sem `Sidebar` no desktop, o `has-data-[variant=inset]:bg-sidebar` do primitivo (registry/base-vega/ui/sidebar.tsx:143) não acende |
| Wrapper | `flex min-h-0 min-w-0 flex-1 flex-col md:mx-2 md:mb-2` |
| Barra | `header data-slot="shell-bar"` em `@container/shell-bar hidden h-12 shrink-0 items-center gap-3 px-2 md:flex`: opaca, sem `border-b`, sem blur, fora do viewport de scroll e nunca `sticky` (o documento não rola, então nada precisa de `scroll-padding`). Ela só é montada fora do celular: escondida por CSS, o `SearchTrigger` dela registraria o Cmd+K de novo com a gaveta aberta. É o container `shell-bar` da barra estreita (linha Direita) |
| Marca ou `top` | `flex h-8 w-auto shrink-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0`, aberta em x = 16 (8 do wrapper mais 8 da barra), a coluna do `ShellTrigger` da Lateral; a marca não encolhe |
| Zonas | `nav aria-label="Principal" className="flex min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain no-scrollbar"`, com uma `SidebarMenu className="w-auto shrink-0 flex-row items-center gap-1"` por seção: o espaço separa, sem divisor. A zona não encolhe (o rótulo inteiro entra no min-content do item, com ou sem `truncate`), e o `shrink-0` da seção vence o `min-w-0` da `SidebarMenu`, que deixaria uma seção passar por cima da outra. O que não cabe rola dentro da nav, sem barra visível; o Tab traz a zona focada para a vista, e o `overscroll-x-contain` impede que o gesto vire o voltar do navegador |
| Zona | o mesmo `NavLink` da Lateral em modo barra (`w-auto`, sem tooltip, que só existe no trilho): pílula `rounded-md squircle:rounded-xl`, ativo com fundo e `aria-current`, ícone filled quando há ícone |
| Zona com filhos | `DropdownMenuTrigger render={<SidebarMenuButton className={cn(NAV_BUTTON, "w-auto")} isActive={filhoAtivo} />}` com `IconChevronDown className="size-3.5! text-muted-foreground/50"`; conteúdo `side="bottom" align="start" sideOffset={8} className="w-auto min-w-56 data-open:duration-0"`, com cada filho num `NavMenuItem` (`DropdownMenuItem render={<Link href />}` com rótulo e `hint`) e o filho desabilitado em `DropdownMenuItem disabled` com o selo. Abre no mousedown, o padrão do Base UI, nunca no hover |
| Direita | `ml-auto flex shrink-0 items-center gap-1`: `tools` e, depois, a conta, que é o `AccountMenu` compacto com `user` ou, sem `user`, os itens de `account` como links em `nav aria-label="Conta"`. Não encolhe, e nada passa por baixo dela |
| Barra estreita | abaixo de 64rem de barra (`@max-5xl/shell-bar`: o painel aberto, uma janela de tablet), o chip do `SearchTrigger` vira só a lupa, com o rótulo para o leitor de tela, e um tool do app pode se compactar com a mesma variante (na vitrine, "Minha carteira"). Medido na vitrine, em janelas de 768 a 1440: a barra de 5 zonas com chip, carteira, alertas e conta pede 1000 px; compacta, ela cabe sem painel a partir de 768 e com o painel de 320 px a partir de 1152, e abaixo disso, com o painel, as zonas rolam |
| Cartão, faixa, viewport e coluna | os mesmos da Lateral |

**Barra de zonas: celular.** Abaixo de `md` a barra some e o celular é o mesmo da Lateral: o cabeçalho `h-12` no cartão com `ShellTrigger`, marca e zona atual, e a gaveta (a `Sidebar` com `collapsible="offcanvas"`, que no `topbar` só existe no celular) com `tools`, as zonas como seções (zona com filhos abre no lugar) e a conta. Não há segunda linha de zonas nem barra inferior. No desktop, `Cmd/Ctrl+B` não faz nada.

### Nav e tile de ícone

```ts
type NavBadge =
  | { count: number; label: string }                // "3 não lidas"; some com 0; "99+" acima de 99
  | { status: "working" | "unread"; label: string } // ponto; working em amber (agente)
  | { text: string };                               // selo: "Em breve", "fase 2"

type NavBase = {
  label: string;
  icon?: Icon;            // outline, inativo; item sem ícone (conversa, favorito) não aparece no trilho
  activeIcon?: Icon;      // filled, ativo; sem ele, o glifo de icon fica nos dois estados
  iconClassName?: string; // navTile(cor), ou "text-muted-foreground/70" em item de conta
  badge?: NavBadge;
  menu?: React.ReactNode; // DropdownMenuItem do botão ⋯: atalho de uma ação que também existe na página
};

type NavLinkItem = NavBase & {
  href: string;              // rota como string, nunca o tipo Route
  exact?: boolean;           // quando um href é prefixo de outro ("/configuracoes" e "/configuracoes/equipe")
  external?: "tab" | "page"; // nova aba com seta, ou navegação inteira até outra zona do domínio; nunca ativo
  disabled?: string;         // motivo visível ("Em breve"): sem link, sem tooltip, fora do trilho, nunca ativo
  hint?: string;             // linha de apoio quando o item aparece num menu
  children?: never;
};
type NavParentItem = NavBase & { children: NavLinkItem[]; defaultOpen?: boolean; href?: never };
type NavItem = NavLinkItem | NavParentItem;
type NavSection = { label?: string; items: NavItem[] }; // sem rótulo no núcleo; o rótulo some no trilho
type Nav = NavItem[] | NavSection[];                     // lista plana (o contrato da v0.2.0) ou seções
```

Funções de `nav.ts`: `toSections(nav)` (a lista plana vira uma seção sem rótulo; o primeiro elemento decide a forma, porque seção tem `items` e item nunca tem); `flattenNav(nav)` (todos os links, filhos inclusive, na ordem da tela); `findActive(nav, pathname)` (o link da página atual e o pai, quando ele é filho; externo e desabilitado nunca; se mais de um casa, vence o href mais longo e, no empate, o primeiro da tela); `isActive(pathname, href, exact?)` (igualdade ou prefixo de segmento, e `/` só exata); `navItem(nav, href)` (para o `back` do `PageHeader`, aceita seções e procura nos filhos); `navTile(cor)`; `SIDEBAR_COOKIE` e `readSidebarOpen` (seção Persistência do recolhido). A seção vazia continua na lista, para a key por índice não mudar quando o filtro por papel a esvazia, e quem renderiza a pula.

| Caso | Como fica |
|---|---|
| Item | `SidebarMenuButton isActive tooltip={label} render={<Link href={href} aria-current="page" />}` com `NAV_BUTTON`; rótulo em `min-w-0 flex-1 truncate`, `NavIcon` com `shrink-0`. O tooltip só aparece no trilho (registry/base-vega/ui/sidebar.tsx:549), e o tooltip do trilho mostra o rótulo e o texto do badge |
| Sem área morta | a `SidebarMenu` vai com `gap-0` e o botão com `relative h-9 border-y-2 border-transparent bg-clip-padding focus-visible:ring-inset group-has-data-[sidebar=menu-badge]/menu-item:pr-8 group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:p-1.75! in-data-[mobile=true]:h-12` (`NAV_BUTTON`): os 2 px de borda transparente em cima e embaixo ficam fora do fundo e dentro do alvo, com passo de 36 px e pílula de 32 (32 por 36 no trilho), 44 px na gaveta, e o anel de foco entra para contornar a pílula. Um `after` com inset negativo não serve, porque o `overflow-hidden` do botão o corta. Um tool do app usa a mesma classe |
| Contagem | `SidebarMenuBadge className="rounded-full"` com `aria-hidden`, `99+` acima de 99 e o `label` em `sr-only` dentro do botão; com zero, não renderiza. Quando o item tem `menu`, a contagem some no hover e no foco para o ⋯ aparecer; na gaveta, onde o ⋯ fica sempre visível, ela anda para a esquerda dele |
| Status | ponto `ml-auto size-1.5 shrink-0 rounded-full` com o `label` em `sr-only`: `bg-amber-500 motion-safe:animate-pulse` em `working` (amber é agente) e `bg-sidebar-foreground/70` em `unread` |
| Selo | `ml-auto shrink-0 text-xs text-muted-foreground/70` |
| No trilho | contagem, status e selo viram um ponto `absolute top-1.5 right-1.5 hidden size-1.5 rounded-full group-data-[collapsible=icon]:block` dentro do botão, e o texto vai para o tooltip ("Inbox, 3 não lidas") |
| Externo | `"tab"`: `<a href target="_blank" rel="noreferrer">` com `IconArrowUpRight className="ml-auto size-3.5! text-muted-foreground/50!"` e "(abre em nova aba)" em `sr-only`. `"page"`: `<a href>` puro, com navegação inteira e sem seta, porque o `link-next` trataria o caminho como rota do app. Nunca fica ativo |
| Desabilitado | `render={<span aria-disabled="true" />}`, o motivo como selo e sem tooltip (FRONTEND.md, Botões); o `li` some no trilho |
| Menu ⋯ | `DropdownMenuTrigger render={<SidebarMenuAction showOnHover aria-label="Mais ações: rótulo" />}` com `IconDotsFilled`; conteúdo `side="right" align="start" sideOffset={8} className="w-auto min-w-48 data-open:duration-0"` (abaixo, na barra) com os itens de `menu`. A mesma ação existe na página |

**Item com filhos**, um nível só:

- Na sidebar aberta e na gaveta, é um `Collapsible` dentro do `SidebarMenuItem`. Gatilho `CollapsibleTrigger render={<SidebarMenuButton isActive={filhoAtivo && !aberto} />}` com `NavIcon`, rótulo e `IconChevronRight className="ml-auto size-3.5! text-muted-foreground/50 transition-transform duration-150 group-data-[panel-open]/menu-button:rotate-90"`; painel `CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none group-data-[collapsible=icon]:hidden"` (o Base UI mede a altura); lista `SidebarMenuSub className="mx-0 gap-0 border-l-0 px-0 py-0"`.
- O filho é `SidebarMenuSubButton isActive render={<Link href={href} aria-current="page" />}` com `h-9 border-y-2 border-transparent bg-clip-padding pl-8.5 rounded-md squircle:rounded-xl corner-squircle hover:bg-sidebar-accent/70 active:bg-sidebar-accent/70 data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50 focus-visible:ring-inset group-has-data-[sidebar=menu-action]/menu-sub-item:pr-8 in-data-[mobile=true]:h-12`: com 8 px de padding, 18 de ícone e 8 de gap, o texto do filho cai na coluna do rótulo do pai.
- Abre sozinho quando um filho fica ativo (um efeito no `pathname`), e a pessoa pode fechar; `defaultOpen` vale na montagem. Fechado com um filho ativo, o pai acende.
- No trilho, o mesmo `li` mostra outro gatilho: `DropdownMenuTrigger render={<SidebarMenuButton isActive={filhoAtivo} aria-label={label} />}`, sem tooltip (tooltip e menu no mesmo gatilho ficam de fora), com conteúdo `side="right" align="start" sideOffset={8} className="w-auto min-w-48 data-open:duration-0"`: o `DropdownMenuLabel` do pai e um `NavMenuItem` por filho, com o `hint` em `text-xs text-muted-foreground`. Os dois gatilhos ficam montados e o CSS mostra um, então recolher e expandir não perde o aberto. Pai sem ícone some do trilho.
- Na barra, a zona com filhos é um menu abaixo (seção Formatos, Barra de zonas).

Gotcha: todo svg dentro do `SidebarMenuButton` sai com 18 px, porque o `[&_svg]:size-4.5` do primitivo (registry/base-vega/ui/sidebar.tsx:480) vence o `size-3.5` do próprio ícone por especificidade. Para outro tamanho, use `size-3.5!`, como no chevron do item com filhos, na seta do externo e no chevron do menu de conta. Do mesmo jeito, a cor de um svg dentro do `SidebarMenuSubButton` leva `!`, porque o sub-botão pinta todo svg filho direto (registry/base-vega/ui/sidebar.tsx:685).

### Nav e tile de ícone

Receita do tile (nav.ts:38-45; no lume `navTile(color)` dentro de `app-shell`): `bg-{cor}-100 dark:bg-{cor}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{cor}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`: anel interno de 1px a 14% da cor mais sombra curta a 25% no light; no dark só a sombra neutra. Cores usadas: rose `244,63,94`, emerald `16,185,129`, orange `249,115,22`, sky `14,165,233`, fuchsia `217,70,239`, yellow `234,179,8`. Itens de conta sem tile: `text-muted-foreground/70`. A mesma receita tinge `span-type` e os chips de score (ver [04-dados](04-dados-e-cor.md)).

### Peças do shell

| Peça | Contrato | Classes e comportamento |
|---|---|---|
| `ShellTrigger({ className? })` | abre e fecha a sidebar: recolhe e expande no desktop, abre e fecha a gaveta no celular | `Button variant="ghost" size="icon-sm"` com `aria-expanded:bg-transparent aria-expanded:hover:bg-muted`, porque o ghost pintaria o estado da sidebar como popup aberto; rótulo "Recolher barra lateral" e "Expandir barra lateral" no desktop, "Fechar menu" e "Abrir menu" no celular; `aria-expanded` e `aria-keyshortcuts="Meta+B Control+B"`; `IconLayoutSidebarLeftCollapseFilled` aberta e `IconLayoutSidebarLeftExpandFilled` fechada; `relative after:absolute after:-inset-1.5 md:after:hidden`, 44 px de alvo no celular sem mudar o desenho de 32; `data-shell-trigger`, por onde o `AppShell` acha o gatilho à vista para devolver o foco. No lugar do `SidebarTrigger` do primitivo, que diz "Toggle Sidebar" |
| `ContextSwitcher({ label, value, options, onSelect?, footer? })` | troca de contexto no `top` (sistema, obra, setor, praça, conta), só quando há mais de um; `ContextOption = { id, label, href?, external?, icon?, detail? }` | gatilho na geometria do ProjectSwitcher do Foglamp, `SidebarMenuButton aria-label="Sistema: Jurídico"` com `w-auto min-w-0 gap-2 pr-2 pl-1.75 in-data-[slot=sidebar]:flex-1 max-md:h-11 [&_svg]:size-3.5 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.75!` (o `max-md:h-11` dá 44 px de alvo na gaveta e no cabeçalho do cartão), ícone, rótulo `min-w-0 flex-1 truncate` e chevron `ml-auto opacity-15`; no trilho sobra o ícone, e opção sem ícone deixa o seletor de fora. Conteúdo `align="start" sideOffset={8} className="w-auto min-w-56 data-open:duration-0"`, ao lado (`side="right"`) dentro da sidebar do desktop e abaixo na barra, na gaveta e no cabeçalho do cartão: `DropdownMenuLabel` com o `label`, uma opção por contexto em `DropdownMenuItem render={<Link href />}` (`<a>` quando `external`), `detail` em `ml-auto text-xs text-muted-foreground tabular-nums`, `IconCheck` na atual e o `footer` depois de um separador. Trocar de contexto é link: a URL guarda o contexto e Cmd+clique abre outra aba |
| `SearchTrigger({ onOpen, label?, shortcut? })` | abre a paleta do app pelo clique e por Cmd/Ctrl mais a tecla (`"k"` por padrão; `null` desliga; um por tela) | na sidebar e na gaveta, `SidebarMenuItem` com `SidebarMenuButton tooltip={label}` e `NAV_BUTTON`, `IconSearch`, rótulo e `Kbd className="ml-auto pointer-coarse:hidden @max-5xl/shell-bar:hidden"`; na barra, `Button variant="outline"` com `w-56 justify-start gap-2 bg-card font-normal text-muted-foreground transition-[color,box-shadow] hover:bg-muted/50 active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`, a superfície de chip, que na barra estreita ganha `@max-5xl/shell-bar:w-8 @max-5xl/shell-bar:justify-center @max-5xl/shell-bar:p-0!`, com o rótulo em `@max-5xl/shell-bar:sr-only` e sem o Kbd. Abaixo de 768 px o atalho vale com a gaveta fechada (a cópia escondida dos `tools`, seção Lateral: celular). O Kbd mostra ⌘K no Mac e Ctrl K no resto, decidido depois do mount; `aria-keyshortcuts="Meta+K Control+K"`. A paleta é do app, sobre o item `command`, com `title` e `description` em pt-BR (o padrão é "Command Palette") e `className="data-open:duration-0"` |
| `useShortcut(key, onPress, { mod?, enabled? })` | atalho com listener no `ownerDocument` do shell, na bolha | com `mod` (Cmd ou Ctrl, sem Alt e sem Shift), ignora `contenteditable` e vale em `input` e `textarea`; sem `mod`, é a tecla sozinha, fora de qualquer campo; evento já tratado (`defaultPrevented`), em composição de IME ou sem `key` (o autofill do Chrome) passa; o que casa leva `preventDefault` |
| `isEditableTarget(target, { richTextOnly? })` | `INPUT`, `TEXTAREA`, `SELECT` ou `contenteditable`; com `richTextOnly`, só `contenteditable` | testa pela forma, sem `instanceof`, porque o alvo pode vir de outra janela |
| `useShellLayout()` | `"sidebar"` ou `"topbar"` (`"sidebar"` fora do shell) | um tool do app lê isto e `useSidebar().isMobile` para saber se está na barra ou na gaveta, como o `SearchTrigger` |
| Menu de conta (interno ao `app-shell.tsx`) | `user` e `userMenu` | na sidebar e na gaveta, `SidebarMenuButton aria-label="Conta: nome"` com `NAV_BUTTON` e `pr-1.5`, `Avatar size="xs"` (18 px, cabe no trilho), o nome e o chevron `ml-auto size-3.5! opacity-15`, abrindo `side="right"` (`"top"` no celular) e `align="end"` em `min-w-(--anchor-width) w-fit`. Na barra, compacto: `Button variant="ghost" size="icon-sm"` com `Avatar size="sm"` e o mesmo `aria-label`, abrindo `side="bottom" align="end" sideOffset={8}` em `w-auto min-w-56`. Dentro: a identidade (avatar, nome, `detail` e email), um separador, os itens de `account` no compacto, o `ThemeSubmenu` e o `userMenu`. Os avatares levam `alt=""`, porque o nome já está no rótulo |

### Persistência do recolhido

```tsx
// Next: no layout do grupo que já lê a sessão (rota dinâmica). cookies vem de next/headers;
// readSidebarOpen e SIDEBAR_COOKIE, de components/app-shell/nav. Com cacheComponents, cookies()
// (e o usePathname do Shell, em rota com param dinâmico) fica dentro de Suspense: o layout
// devolve <Suspense><ShellComEstado>{children}</ShellComEstado></Suspense>.
async function ShellComEstado({ children }: { children: React.ReactNode }) {
  const aberto = readSidebarOpen((await cookies()).get(SIDEBAR_COOKIE)?.value, true);
  return <Shell defaultOpen={aberto}>{children}</Shell>; // o wrapper client que monta o AppShell
}
```

```tsx
// Vite: sem SSR, o estado inicial sai do document.cookie antes da primeira pintura
// (useState de react; readSidebarOpen e SIDEBAR_COOKIE de components/app-shell/nav).
function lerCookie(nome: string) {
  return document.cookie.split("; ").find((par) => par.startsWith(`${nome}=`))?.slice(nome.length + 1);
}

// dentro do componente que monta o AppShell:
const [aberto] = useState(() => readSidebarOpen(lerCookie(SIDEBAR_COOKIE), true));
// <AppShell defaultOpen={aberto} ... />
```

O layout do Next inteiro, com os imports e a sessão, está no passo 5 de `docs/adocao/next-novo.md`.

- `readSidebarOpen` aceita os dois valores que o primitivo grava, `"true"` e `"false"`; ausente ou qualquer outro valor cai no fallback, aberto por padrão. A primeira visita abre a sidebar.
- O cookie vale por host: cada subdomínio da Lyx guarda o seu estado, e as zonas da Horizonte no mesmo domínio dividem um só.
- Com Cache Components, ler `cookies()` tira o layout do prerender: um app de shell estático, sem sessão no layout, fica sem o recolhido sem piscar.
- Com `open` controlado, o primitivo grava o cookie com o valor pedido mesmo quando o app recusa a troca (registry/base-vega/ui/sidebar.tsx:78-89). Medido na bancada: `onOpenChange` recebe `true`, a sidebar continua recolhida e o cookie fica `true`. Num modo controlado, como a tela cheia do BI, não confie no cookie.
- O `layout="topbar"` não lê nem grava: `defaultOpen` e `open` não existem nele, e no desktop o atalho não alterna.

### Header de rota: o trio do Next

`page-header` (page-parts.tsx:58-133):

| Parte | Classes exatas |
|---|---|
| Raiz | `flex flex-wrap items-end justify-between gap-4 px-8 h-8` (`h-8` porque o `RangePicker` é `h-8`; com `h-7` empurrava o conteúdo ~4px) |
| `h1` normal / com `back` | `flex items-center gap-2 text-base font-medium tracking-tight` / `gap-1.5` no lugar de `gap-2` |
| Ícone de seção | `size-4.5 shrink-0` + `iconClassName` (o tile do nav); 18px, um degrau acima do `size-4` do FRONTEND.md original |
| Link do crumb | `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground`; separador `IconChevronRight` `size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]` |
| Título / descrição | `<span className="truncate">` / `<p className="text-sm text-muted-foreground">` |
| Slot de ações | `flex items-center gap-2 translate-y-1 empty:hidden`, sempre renderizado, `ref={slot?.setEl}` |

Ações fora do range picker: `Button variant="secondary"` com ícone e `strokeWidth={2.4}` ("Create key"); em listas com criação o botão vai para o `trailing` da `Toolbar` e só sobe ao header quando ela levanta. O `page-header` do lume exporta `PX = "px-4 md:px-8"` e recebe `back` pelo `link` (adição do lume). `back.icon` é opcional, como no `Nav`: `back={navItem(nav, href)}` serve com item sem ícone, e o crumb sai só com o rótulo (`Rótulo › Título`); a prop `icon` da página continua ignorada quando há `back`. O slot de ações funciona dentro do `AppShell` sem provider extra, porque o shell monta o `HeaderActionsSlotProvider`.

### Range picker (`range-picker`)

| Peça | Classes exatas (range-picker.tsx) |
|---|---|
| `RangePresetButton` | `Button variant={active ? "secondary" : "outline"} aria-pressed` + `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50` (:37-65) |
| Trigger | `Button variant={compact ? "outline" : "secondary"}` + `w-fit justify-start transition-[color,box-shadow] bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted active:scale-100 font-normal gap-1.5`; `IconCalendarFilled` `ml-0.5 mb-px` em `text-foreground/95` ou `text-muted-foreground/50`; rótulo `grid overflow-hidden transition-[width,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` com `width` em px medido por `ResizeObserver` (`-ml-1.5` compacto); chevron `ml-auto size-3.5 text-muted-foreground/50 mt-px` (:145-176) |
| Popover | `PopoverContent align="end" sideOffset={10} className="flex-row w-auto gap-0 overflow-hidden p-0"`; coluna de presets `flex w-40 flex-col gap-1 p-3` com hairline `border-r-[0.5px] border-solid` (hex `#EFEFEF`/`#252525` no Foglamp; `border-border/50` no lume); cada preset `Button size="sm"` `secondary` ou `ghost` + `justify-start font-normal transition-transform rounded-sm squircle:rounded-xl corner-squircle active:scale-100` (raio concêntrico: 8px do popover menos 12px de padding) (:178-200) |
| Calendário | `p-1 pl-2 pt-2` > `Calendar mode="range" numberOfMonths={2} disabled={{ after: new Date() }} className="**:data-day:transition-none"`; dois cliques: o primeiro sempre começa um range novo, o segundo aplica `customRange` e fecha (:202-225) |

### Toolbar e filtros (`data-table`)

| Controle | Classes exatas e comportamento (data-table.tsx) |
|---|---|
| `Toolbar({ children, trailing?, className? })` | `flex flex-wrap items-center gap-2 pl-6 pr-6`; `trailing` em `motion.div` `ml-auto flex items-center gap-2` com `layoutId` e `transition={{ type: "spring", stiffness: 520, damping: 44 }}` (`TOOLBAR_SPRING` em `motion`); mede filhos + gaps contra a largura disponível e, se `need + 2 > avail`, portala o trailing para o slot do `PageHeader` (:285-381) |
| `SearchInput` | `InputGroup` em `h-8 w-56 rounded-full squircle:rounded-full corner-round! shadow-(--custom-outline-shadow) dark:shadow-(--custom-outline-shadow) dark:border-0 bg-card dark:bg-card hover:bg-muted/50 dark:hover:bg-muted`; `IconSearch size-3.5`; limpar `InputGroupButton size="icon-xs"` `rounded-full text-muted-foreground/60 hover:text-foreground` (:404-452). `corner-round!` porque a superelipse achataria a pílula; `dark:bg-card` porque a base do `InputGroup` tem `dark:bg-input/30` |
| `ToggleChip` | `Button variant={active ? "destructive" : "outline"} aria-pressed` + `font-normal transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted [&_svg:not([class*='text-'])]:text-muted-foreground/50` (:456-484) |
| `FilterSelect` | trigger `SelectTrigger size="sm"` com `buttonVariants({ variant: "outline" })` + `min-w-36 justify-between font-normal corner-round! bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`; conteúdo `w-auto min-w-44 max-w-80` `align="start" sideOffset={8}`; busca inline acima de `FILTER_SEARCH_THRESHOLD = 8` opções; `modal={false}` e hover troca o dropdown aberto (:486-697) |
| `ClearFiltersButton` | `AnimatePresence`, `initial={{ opacity: 0, scale: 0.98, x: -4 }}`, `transition={{ duration: 0.13, ease: "easeOut" }}`; `Button variant="outline"` `text-muted-foreground gap-1 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted` com `IconX` (:703-731) |
| `PaginationFooter` | `flex items-center justify-end gap-1 border-t border-border/50 px-6 pt-4 dark:border-border/40`; contagem `text-xs text-muted-foreground/50 tabular-nums`; barra `text-xs text-muted-foreground/20 mx-3`; "1 to 25" é um `SelectTrigger` despido (`h-auto data-[size=default]:h-auto gap-1.5 rounded-md squircle:rounded-md border-0 bg-transparent p-0 text-xs text-muted-foreground/50 tabular-nums shadow-none transition-[color,box-shadow] hover:text-foreground dark:border-0 dark:bg-transparent dark:shadow-none dark:hover:bg-transparent`) com `pageSizes = [25, 50, 100]`; chevrons `Button size="icon-sm"` `outline` ativo, `ghost` desabilitado; sem números de página; só renderiza com linhas (:737-820) |

### Ritmo vertical e gutters

| Onde | Valor |
|---|---|
| Coluna da página | `gap-4` entre blocos de primeiro nível, `py-6` em cima, `pb-16` embaixo, `px-0` |
| Header, grids de cards e empty states | `px-8` (32px): alinhamento "de texto" |
| Toolbar e footer de paginação | `pl-6 pr-6` / `px-6` (24px): alinhamento "de controle", que por ter superfície própria parece 32px |
| Células da tabela | `px-8.25` (33px) para o texto cair na coluna do título, última coluna `pr-9`, header `h-13`, célula `py-2` (registry/base-vega/ui/table.tsx:82,100,193,214) |
| Header para Toolbar | bloco `flex flex-col gap-4 mt-1` (20px até a Toolbar); Toolbar para tabela `flex flex-col -mt-2` (8px, para o footer encostar na última linha) |
| Empty state de lista / grids | `mt-2 px-8`; `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1` (stats), `grid gap-4 lg:grid-cols-2 px-8` (charts) |
| Cards | `py-6`, `size="sm"` `py-5` e `gap-2`; header e conteúdo `px-6`, `sm` `px-5` (registry/base-vega/ui/card.tsx:17,30,78) |

### Página solta

| Parte | Classes e regra |
|---|---|
| Raiz | `<main className="flex min-h-svh flex-col items-center bg-sidebar px-4 py-12 md:py-24 [html:has(&)]:bg-sidebar">`: um `main` só, sobre o canvas. O `[html:has(&)]:bg-sidebar` pinta o `html` com o mesmo tom enquanto a página está montada (o seletor gerado é `html:has(...)`), e o overscroll do Safari mostra o canvas acima e abaixo dela, não o `--background` (docs/conceitos/html-background.md) |
| Marca | `flex h-8 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0` |
| Cartão | `Card className="mt-6 w-full max-w-lg"`, a receita de `registry/base-vega/ui/card.tsx:17`, com um `Button` default por tela |
| Sem acesso e link vencido | `EmptyState` dentro do Card, com a ação do próximo passo ("Voltar ao Hub", "Pedir novo link"): nunca um beco sem saída |
| Login | o item `login-form` |
| Onboarding | "Etapa X de 5" é conteúdo da coluna, não chrome |
| Embed | o conteúdo direto em `h-dvh`, sem canvas: quem emoldura é a outra app |
| Celular | `px-4` e o Card na largura toda; nada `fixed` no rodapé, por causa do teclado virtual; a ação principal ganha alvo de 44 px por pseudo-elemento (`relative after:absolute after:-inset-1.5` sobre os 32 px do `Button`) |

## Do guia: 04. Dados: tabela, números, chips e gráficos

### Densidade da tabela

| Item | Valor | Fonte |
|---|---|---|
| Header | `h-13 [&_tr]:h-13` (52px); sticky: `sticky top-0 z-10 bg-background [&_tr]:border-b-0 [&_th]:shadow-[inset_0_-1px_0_0] [&_th]:shadow-border/50 dark:[&_th]:shadow-border/40` | registry/base-vega/ui/table.tsx:100,107 |
| Célula | `align-middle whitespace-nowrap py-2 px-8.25` (33px laterais); header `text-left align-middle font-medium whitespace-nowrap px-8.25`; última coluna `[&_th:last-child]:pr-9 [&_td:last-child]:pr-9` no `table` | table.tsx:82,193,214 |
| Linha | `border-b border-border/50 dark:border-border/40`; `interactive` = `tabIndex 0`, `data-interactive:cursor-pointer data-interactive:hover:bg-muted`, ring `focus-visible:ring-[1.5px] ring-inset ring-ring/50`, Enter e Espaço disparam `click()`; no hover apaga a própria borda e a da linha anterior | table.tsx:149-176 |
| Linha de uma linha de texto | primeira `TableCell className="h-12"` (48px) | agents-client.tsx, workflows-client.tsx |
| Linha de duas linhas (título + meta) | `TableCell className="h-16"` (64px); título `truncate text-[14px]`; meta `mt-0.5 flex items-center gap-3 text-xs text-muted-foreground`, links `inline-flex min-w-0 shrink items-center gap-1 transition-colors hover:text-foreground`, ícone `size-3` | traces-client.tsx:731-867 |
| Layout | `<Table className="table-fixed min-w-5xl" stickyHeader>`; larguras no `TableHead`: `w-28` Spans, `w-30` Tokens, `w-32` Duration, `w-38` Cost, `w-36` When, `w-40` metadata | traces-client.tsx:645-699 |
| Contagem secundária | `text-right tabular-nums text-muted-foreground` | traces-client.tsx:894 |
| Erro inline | `flex shrink-0 items-center gap-0.75 font-sans text-sm text-red-600 dark:text-red-400` + `IconAlertTriangle size-3.5 fill-current/20` ("texto colorido, sem pílula"); aborto `text-amber-600 dark:text-amber-400` + `IconPlayerStopFilled size-3.5` | traces-client.tsx:752-767 |
| Valor ausente | `<span className="text-muted-foreground/50">{EMPTY}</span>` (Foglamp: `/40` com travessão) | traces-client.tsx:888 |

## Do guia: 05. Telas de detalhe: painel lateral, linha expansível, prosa, código e copy

### Esqueleto comum

| Bloco | Regra praticada |
|---|---|
| `loading.tsx` | só `<RouteHeader href="/agents" back title="Agent" withRange />`: o título real é parâmetro de rota, então o fallback mostra o crumb genérico até a página chegar; `LiveRangePicker` continua vivo porque o contexto está acima do boundary |
| Header breadcrumb (`page-header`) | `h1` `flex items-center gap-1.5 text-base font-medium tracking-tight`; link de volta `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground` com o ícone `size-4.5 shrink-0` + tile do nav; `IconChevronRight size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]`; título `<span className="truncate">`; `titleLeading` (ícone da entidade `size-4.5`), `titleTrailing` (`CopyButton` do id, ou o id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` quando difere do nome); `actions` = `RangeControl`. O primitivo `Breadcrumb` não é usado: o breadcrumb é o próprio `h1` |
| Entrada | `PageHeader` num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o `loading.tsx` repete; cards de gráfico recebem `className={cn(entrance && "page-fade-in")}` um a um |
| Chips de contexto (`context-chip`) | container `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`; `ContextChip` com `href` para a entidade dona (cliente, agente, workflow); placeholder enquanto carrega é `div` cru `h-8 w-32 animate-pulse rounded-full bg-muted` (`w-28`, `w-36`), nunca `Skeleton`: o `corner-squircle` do primitivo quadra o `rounded-full` |
| Stats | `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1` com `StatCard size="sm"`, custos em `formatCostFixed(n, 4)`; o empty "sem atividade" espera os stats carregarem para um rollup lento não piscar o vazio antes dos números |
| Gráficos | `section` `grid gap-4 lg:grid-cols-2 px-8`; `Card size="sm"`, chart `h-55 w-full`, `syncId` por página; empty no card `EmptyState icon={IconChartAreaFilled} title="Sem dados neste período"` |
| Empty state (`empty-state`) | `Empty className="border border-dashed"` + ícone `opacity-40` (registry/base-vega/components/empty-state.tsx:33-36), sempre num wrapper `px-8`; "sem atividade" e "tabela vazia" têm textos diferentes |

### Painel lateral e `Field`

| Peça | Valor exato | Fonte |
|---|---|---|
| Aside | `group/panel sticky top-4 shrink-0 self-start` com `style={{ width }}`; `PANEL_WIDTH = 420`, mínimo 340, máximo 720, salvo em `localStorage` (`"<app>:trace-panel-width"`, preferência de workspace) e aplicado num `useEffect` pós-mount para servidor e cliente renderizarem o mesmo markup | trace-detail-client.tsx:1645-1756 |
| Handle de resize | `div role="separator" aria-orientation="vertical"` `absolute inset-y-0 -left-3 z-10 w-3 cursor-col-resize touch-none` + `setPointerCapture`; arrastar para a esquerda alarga | :1791 |
| Borda acesa no drag | overlay `pointer-events-none absolute inset-0 z-10 rounded-lg squircle:rounded-3xl corner-squircle border-l border-border opacity-0 transition-opacity duration-200 group-has-[[data-trace-resize]:hover]/panel:opacity-100 group-has-[[data-trace-resize][data-resizing]]/panel:opacity-100` | Foglamp trace-detail-client.tsx:1799 |
| Card (`card`) | `Card` com `gap-0 py-0` e `max-h-[calc(100svh-14rem)]` (ou `max-h-[calc(100svh-6rem)]` quando a página já rola) | :1883 |
| Header | `CardHeader className="flex shrink-0 items-center gap-2 p-5 px-5 pb-1"`; `CardTitle` `flex min-w-0 flex-1 items-center gap-2` com `SpanTypeChip` + nome `truncate`; controles `flex shrink-0 items-center gap-1`: `Button size="xs" variant="ghost"` com o nome do destino ("Raw"/"Overview", nomeia para onde vai, não onde está), dois `size="icon-xs" variant="ghost"` com `IconChevronUp/Down size-4 text-current`, `CopyButton`; todos `text-muted-foreground/60 hover:text-foreground` | mapa 10.4.2 |
| Corpo | `CardContent className="flex min-h-0 flex-1 flex-col p-0"` > `Tabs className="flex min-h-0 flex-1 flex-col gap-0"` > `TabsContent className="flex min-h-0 flex-1 flex-col"` > `ScrollFade containerClassName="flex min-h-0 flex-1 flex-col" className="flex min-h-0 flex-1 flex-col gap-4 py-5"` (registry/base-vega/components/scroll-fade.tsx:19) | |
| Seção | `px-5 py-5` (`pb-5` na primeira, `pt-5` na última) + `border-b border-border/40`, nunca na última: `cn("px-5 py-5", temProxima && "border-b border-border/40")` ("uma borda sobrando na última seção lê como bug"); divisor edge-to-edge dentro de um pai com `px-5` sangra com `-mx-5 border-t border-border/40 px-5 pt-4` | :1954,2383 |
| `Field` | `div.flex min-w-0 flex-col gap-1` > label `text-xs text-muted-foreground` > valor `text-[13px] tabular-nums`; grid `grid grid-cols-2 gap-4`, `wide` = `col-span-2`, `separated` = `border-t border-border/40 pt-4`. É o mesmo par de `Meta` no drawer e dos stats do rail de sessão | :1592-1604 |
| Skeleton do valor | `span.flex h-5 items-center` + `Skeleton h-3` ("do tamanho da line box de um valor de 13px"); o skeleton da tela é "shaped like the loaded page": labels reais, só os valores em skeleton | :2971 |

### Linha expansível (drawer)

| Peça | Valor exato | Fonte |
|---|---|---|
| `Table` | `table-fixed [&_th:last-child]:pr-11 [&_td:last-child]:pr-11` + `stickyHeader`: o range picker está no header (`px-8`), não numa toolbar (`pr-6`), então a última coluna ganha 8px a mais que o `pr-9` do primitivo | mapa 11.2.6 |
| Linha | `TableRow interactive aria-expanded={isOpen} className={cn("group", isOpen && OPEN_ROW_CLASS, isFocused && FOCUSED_ROW_CLASS)}` | |
| `OPEN_ROW_CLASS` | `border-b-transparent bg-neutral-100 dark:bg-card`: no light página e card têm quase o mesmo branco, então `bg-card` sumiria | run-exchange.tsx:58 |
| `FOCUSED_ROW_CLASS` | `bg-primary/5 dark:bg-primary/10 data-interactive:hover:bg-primary/10 dark:data-interactive:hover:bg-primary/15` (linha vinda de deep link `?trace=`, com `scrollIntoView({ block: "center", behavior: "smooth" })`; o primeiro toggle manual limpa) | :62 |
| Primeira célula | `h-12 font-normal` > `flex items-center gap-2` com `ExpandChevron` + `span.truncate`; fallback de id em `font-mono text-xs text-muted-foreground` | |
| `ExpandChevron` | `IconChevronRight size-3.5 shrink-0 text-muted-foreground/50 transition-[rotate,color] duration-300 ease-out group-hover:text-muted-foreground`, aberto `rotate-90 text-muted-foreground` | :43-48 |
| `DrawerRow` | `TableRow className="hover:bg-transparent"` > `TableCell colSpan` `bg-neutral-100 px-8 pt-2 pb-8 dark:bg-card` (as páginas passam `pt-6`) | :68-82 |
| `DrawerColumns` | `flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8`; overview `flex shrink-0 flex-col gap-4 lg:w-88` (88 + gap de 2rem = 96, a largura da primeira coluna); conteúdo `min-w-0 flex-1` | :93-103 |
| `Meta` / `MetaEmpty` | `flex min-w-0 flex-col gap-1`, label `text-xs text-muted-foreground`, valor `min-w-0 text-[13px] tabular-nums`, grade `grid grid-cols-2 gap-4`; vazio = `EMPTY` em `text-muted-foreground/40` (Foglamp usa travessão) | :110-128 |
| Botões do drawer | `Button size="sm" variant="secondary" className={cn("w-fit", DRAWER_BUTTON_CLASS)}` + `IconArrowUpRight className="mt-px"`; `DRAWER_BUTTON_CLASS` = `bg-background shadow-(--custom-outline-shadow) hover:bg-muted hover:text-foreground [&_svg:not([class*='text-'])]:text-neutral-500 dark:bg-secondary dark:shadow-[var(--custom-shadow-secondary)] dark:hover:bg-muted-foreground/25 dark:hover:text-secondary-foreground dark:[&_svg:not([class*='text-'])]:text-neutral-300` | button-styles.ts:1 |
| Erros | na célula, texto colorido sem pílula (`text-red-600 dark:text-red-400` + `IconAlertTriangle size-3.5 fill-current/20`); `Badge variant="rose" className="font-sans"` só no overview do drawer e em cabeçalhos de turno | |
| Skeleton dentro do drawer | barras em `bg-muted-foreground/15`, porque o drawer já é `bg-neutral-100`, que é o `bg-muted` do `Skeleton` no light | :446-466 |
| Clamp | `Conversation clamp={320}` (`ClampedBody maxHeight` + botão com `DRAWER_BUTTON_CLASS`); 220 para "dez linhas de texto de 13px" | :219-255 |

### Code block (`code-block`)

- Shiki `createHighlighterCore` com `createJavaScriptRegexEngine()` (sem wasm), singleton lazy, temas `github-light` e `vesper` com `defaultColor: false` (registry/base-vega/components/code-block.tsx:38-53); só `typescript` e `json`; acima de `HIGHLIGHT_MAX_CHARS = 50_000` fica o `pre` cru (:34).
- O CSS que escolhe o tema vem no campo `css` do item e cai no `globals.css`: `.shiki { background-color: var(--shiki-light-bg) }`, `.shiki, .shiki span { color: var(--shiki-light) }`, `.dark .shiki { ... var(--shiki-dark-bg) }`, `.dark .shiki, .dark .shiki span { color: var(--shiki-dark) }`. Sem essas quatro regras o bloco renderiza sem cor (:23-29).
- Container `relative text-left text-xs [&_pre]:m-0 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted/50! [&_pre]:dark:bg-muted/20!  [&_pre]:p-5 [&_pre]:leading-relaxed [&_pre]:shadow-(--custom-shadow) corner-squircle` (o espaço duplo é do original) + `[&_pre]:pr-10` (espaço do copy) ou `[&_pre]:pt-5` com `actions`/`hideCopy` (:113-117). Fallback imediato `pre.bg-muted!.dark:bg-muted!.text-foreground` para nunca haver flash vazio (:125).
- Controles `absolute right-3 top-3 flex items-center gap-1`: `{actions}` + `Button size="icon-sm" variant="outline" className="text-muted-foreground hover:text-foreground dark:bg-input/20" aria-label="Copiar código"` com `CopyIcon` e `useCopied(2000)` (:130-141). Sem números de linha e sem soft wrap: o `pre` rola na horizontal.
- `useShikiHtml(code, lang)` (:61) é exportado para blocos de JSON em painéis: `[&_pre]:bg-transparent!` quando o container já tem fundo.

### Markdown (`markdown-components`)

O espaçamento vem do wrapper de prosa, por seletor arbitrário, não dos componentes:

| Onde | Classes |
|---|---|
| Bolha de assistente | `text-sm leading-relaxed [&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_pre]:my-2 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 *:last:mb-0 [&>*:first-child>*:first-child]:mt-0 [&>*:first-child>*:first-child>*:first-child]:mt-0` (session-detail-client.tsx:506) |
| `Prose` (system prompt no drawer) | `text-xs leading-relaxed wrap-anywhere` com headings rebaixados (`[&_h1]:text-[13px] [&_h1]:font-semibold`, h2 a h6 `text-xs`), `[&_code]:text-[11px]`, `[&_pre]:text-[11px] [&_pre]:whitespace-pre-wrap` (payload-view.tsx:71-73) |

### Copy (`use-copied`, `copy-icon`, `copy-button`)

- `useCopied(timeoutMs = 1500)` (registry/base-vega/hooks/use-copied.ts:13): `{ copied, markCopied, resetCopied }`; o timer é limpo no unmount e na re-cópia. 1500 ms no `CopyButton`; 2000 ms no `CodeBlock` e em botões de prompt.
- `CopyIcon` (registry/base-vega/components/copy-icon.tsx:28-52): `span.relative.inline-flex` > `AnimatePresence mode="popLayout" initial={false}` > `motion.span key={copied ? "check" : "copy"}` com `initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}`, `animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}`, `exit` igual ao `initial`, `transition={COPY_SPRING}` (`{ type: "spring", duration: 0.25, bounce: 0 }`, registry/base-vega/lib/motion.ts:41-45). `IconCopyFilled` vira `IconCircleCheckFilled` em `text-green-600 dark:text-green-400`; dentro de um `Button` default (fundo invertido) passe `checkClassName="text-green-400 dark:text-green-600"`. `popLayout` + `relative` põem o ícone que sai sobre o que entra em vez de empilhar por um frame.
- `CopyButton({ value, title, stopPropagation?, iconSize = "size-4" })` (registry/base-vega/components/copy-button.tsx:35-53): `button` nu, não o primitivo, `inline-flex shrink-0 items-center justify-center rounded p-1 text-muted-foreground/60 cursor-pointer transition-colors hover:text-foreground`; `title` obrigatório; `stopPropagation` dentro de linha clicável; nunca aninhe o botão num toggle, ponha como irmão; copie a string original, nunca o DOM animado.
