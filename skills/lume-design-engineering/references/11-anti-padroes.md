# Anti-padrões

Gerado por `bun scripts/build-skill.ts` a partir de `docs/guia/11-receita.md`, os **Never** do `FRONTEND.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Nunca, e em vez disso

### Layout do projeto

- **Never** crie um segundo primitivo com o mesmo papel em `components/app`; componha o da registry (`Button`, `Card`, `Table`...) ou proponha a mudança na base.
- Em vez disso: trate `components/ui/*` como item da registry: é instalado pela CLI e atualizado com `add --overwrite`, nunca editado à mão. Uma variant nova entra por `className` com `cn()`; se for reusada, abre PR na base. ([seção](10-adocao.md#layout-do-projeto))

### Composição: Base UI, `render`, `cn`, `data-slot`

- **Never** use `asChild` (Radix), `data-[state=open]` ou uma segunda biblioteca de componentes (Radix Themes, MUI, Mantine, HeroUI).
- Em vez disso: troque o elemento com a prop `render` do Base UI: `<Button render={<Link href="/x" />}>`, `<DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>`, `<TooltipTrigger render={<span />}>`. O filho (ícone e texto) fica no trigger; as props visuais vão no `render`. ([seção](02-primitivos.md#composição-base-ui-render-cn-data-slot))

### Tokens e cor

- **Never** use `slate`, `gray`, `zinc` ou `stone` (nem `--sidebar-primary` e `--custom-shadow-slate`, removidos do lume), nem hex, `rgb()` ou `oklch()` em `className` ou `style`, exceto quando a cor é dado (série de gráfico, cor de marca, hash de entidade) e com comentário de uma linha dizendo isso.
- Em vez disso: use os tokens semânticos: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-destructive`, `border-border`, `ring-ring`, `bg-sidebar`. Todos são `oklch(L 0 0)` em degraus da paleta `neutral` (`registry/base-vega/styles/globals.css:23-52,133-161`); a hierarquia vem da luminância: light `--background 0.99`, `--card 1`, `--sidebar 0.975`; dark `--sidebar 0.145`, `--background 0.17`, `--card 0.205`. ([seção](01-tokens-e-forma.md#tokens-e-cor))

### Sombra no lugar de borda

- **Never** feche uma caixa com `border` a 100% dentro do app, nem use `border`/`divide-*` para separar superfícies; nunca `shadow-md`, `shadow-lg` ou `ring-1 ring-foreground/10` em superfície nova.
- Em vez disso: dê borda a uma superfície com `shadow-(--custom-shadow)`: light `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)` (`globals.css:53-56`); dark dois insets brancos de 0.75px a 3% mais anel e três drops pretos a 10% (`globals.css:162-166`). Card, Popover, Dropdown, Tooltip, Dialog, Alert, Kbd, Avatar e o inset do shell usam o mesmo token. ([seção](01-tokens-e-forma.md#sombra-no-lugar-de-borda))

### Raio e squircle

- **Never** use `corner-round!` fora de dois casos: pílula `rounded-full` que o squircle achataria (busca da toolbar) e card envolvido por `BorderBeam`, que só desenha arco circular.
- Em vez disso: escreva o par `rounded-<menor> squircle:rounded-<maior> corner-squircle`: o raio grande só vale onde `corner-shape` existe (`@custom-variant squircle`, `globals.css:18`). Pares canônicos: `rounded-md squircle:rounded-2xl` (campos, popovers, skeleton), `rounded-md squircle:rounded-xl` (menus, botão da sidebar, tabs), `rounded-[5px] squircle:rounded-xl` (tile de ícone), `rounded-lg squircle:rounded-3xl` (Card, Popover, Alert, inset), `rounded-2xl squircle:rounded-[40px]` (Dialog), `rounded-xl squircle:rounded-4xl` (Empty), `rounded-sm squircle:rounded-[14px]` (Kbd). ([seção](01-tokens-e-forma.md#raio-e-squircle))

### Superfícies

- **Never** use `--custom-shadow-lifted` para "flutuar" um overlay: o que separa modal de página é o backdrop (`bg-black/20`) e a animação, não uma sombra maior.
- Em vez disso: monte superfície com a mesma receita: `bg-card` ou `bg-popover` (mesmo valor) + `shadow-(--custom-shadow)` + par de raio + padding + `text-sm`. Card: `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground` (`registry/base-vega/ui/card.tsx:17`). ([seção](01-tokens-e-forma.md#superfícies))

### Tipografia

- **Never** use `text-2xl` no app, `font-bold`, ou mono para alinhar números: dígitos tabulares em Inter resolvem.
- Em vez disso: viva em `text-sm` (14px) e `text-xs` (12px); `text-base` é o título de página e de card default. Degraus intermediários para dado denso e mono: `text-[13px]`, `text-[11px]`, `text-[10px]`. ([seção](01-tokens-e-forma.md#tipografia))

### Espaçamento e ritmo

- **Never** use `space-y-*`/`space-x-*` nem valor arbitrário de espaçamento (`p-[13px]`) sem comentário de uma linha; `size-3.25`, `gap-1.75`, `h-13`, `px-8.25` são da escala contínua do Tailwind v4, não arbitrários.
- Em vez disso: empilhe com `flex flex-col gap-*` (`gap-2`, `gap-4`, `gap-1.5`, `gap-1`, `gap-3` são os cinco mais usados) ou `grid gap-4`; margens só para ajuste fino (`mt-1`, `mt-2`, `mt-3`, `-mt-2`). ([seção](03-shell-paginas-tabelas.md#espaçamento-e-ritmo))

### Botões

- **Never** use `destructive` cheio fora de danger zone, `mr-2` em ícone dentro de Button (o `gap` já cuida), ou `Button` dentro de `Link` (é o `render` que faz o link).
- Em vez disso: use o `Button` da registry: pílula `rounded-full`, `h-8` default (`xs` `h-6`, `sm` `h-7`, `lg` `h-8.5`, `icon-xs` `size-6`, `icon-sm` e `icon` `size-8`), `active:scale-[0.97]`, `focus-visible:ring-[1.5px] focus-visible:ring-ring/50`, ícone `size-3.5` e padding reduzido do lado do ícone `has-[>svg:first-child]:pl-2.5` (`registry/base-vega/ui/button.tsx:10,34-44`). ([seção](02-primitivos.md#botões))

### Badges e chips

- **Never** use badge para contagem de erro numa célula: é texto colorido `text-sm text-red-600 dark:text-red-400` com `IconAlertTriangle size-3.5 fill-current/20`, sem pílula.
- Em vez disso: use `Badge` para status: `rounded-full capitalize`, `md` (`h-5 px-2 gap-[5px] text-xs`, ícone `size-3!`) por padrão, `sm` (`h-4 text-[10px]`) só em chip de versão; 14 variants com sombra colorida no molde `bg-{c}-500/10 text-{c}-700 shadow-[var(--custom-shadow-{c})] dark:bg-{c}-500/15 dark:text-{c}-300` (`registry/base-vega/ui/badge.tsx:11-43`); `rose` e `red` usam `dark:text-{c}-400`. ([seção](02-primitivos.md#badges-e-chips))

### Campos e formulários

- **Never** embrulhe um `Input` cru em `div` com ícone `absolute` e `pl-7` na mão, nem use `border border-input` ou `shadow-xs` em campo.
- Em vez disso: use `Input` (`h-9 ... rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base ... placeholder:text-muted-foreground/50 ... md:text-sm dark:bg-input/30`, `registry/base-vega/ui/input.tsx:14`), `Textarea` (`field-sizing-content min-h-16`), `SelectTrigger` (`data-[size=default]:h-9 data-[size=sm]:h-8`) e `Kbd`: a mesma superfície de campo, sombra no light e hairline no dark. ([seção](05-formularios-e-dialogs.md#campos-e-formulários))

### Ícones

- **Never** misture bibliotecas (`lucide-react`, `react-icons`, Phosphor) nem ponha margem em ícone dentro de Button.
- Em vez disso: importe de `@tabler/icons-react` e prefira o `*Filled` quando existir (`IconCircleCheckFilled`, `IconAlertTriangleFilled`, `IconCoinFilled`); outline só quando não há filled (`IconChevronRight`, `IconSearch`, `IconLoader`) ou como estado inativo. ([seção](02-primitivos.md#ícones))

### Shell e sidebar

- **Never** use `variant="sidebar"` ou `"floating"`, `SidebarRail`, ou tema, projeto e período em provider dentro da página: contexto vive no shell (`HeaderActionsSlotProvider`, `RangeProvider`, `ThemeProvider`).
- Em vez disso: use `Sidebar variant="inset"`, a única variante: `SIDEBAR_WIDTH = "14rem"` (`registry/base-vega/ui/sidebar.tsx:32`), canvas `bg-sidebar` sempre mais escuro que o inset `bg-background`, e o inset com `shadow-(--custom-shadow)` e `rounded-lg squircle:rounded-3xl corner-squircle` (`sidebar.tsx:312`), sem borda. ([seção](03-shell-paginas-tabelas.md#shell-e-sidebar))

### Páginas: header, stat cards, grids

- **Never** monte a página inteira num `Suspense` com skeleton: o chrome (header, toolbar, cabeçalhos de coluna) pinta na hora e só o corpo espera.
- Em vez disso: defina o header uma vez por rota e renderize a mesma peça no `loading.tsx` e na página: `PageHeader` é `flex flex-wrap items-end justify-between gap-4 px-8 h-8` com `h1 flex items-center gap-2 text-base font-medium tracking-tight`, ícone de seção `size-4.5 shrink-0` com o tile do nav, e slot de ações `flex items-center gap-2 translate-y-1 empty:hidden` (apps/web/src/components/app/page-parts.tsx:90-131); `h-8` porque o range picker é `h-8`. ([seção](03-shell-paginas-tabelas.md#páginas-header-stat-cards-grids))

### Tabelas e filtros

- **Never** instale TanStack Table, AG Grid ou similar; ordenação e paginação são hooks pequenos sobre o primitivo (servidor ordena o que é paginado, cliente ordena lista completa).
- Em vez disso: use o `Table` da registry com `className="table-fixed min-w-5xl" stickyHeader`, larguras explícitas no `TableHead` (`w-28`, `w-32`, `w-36`, `w-40`), header `h-13 [&_tr]:h-13` (`registry/base-vega/ui/table.tsx:100`), célula `py-2 px-8.25` com altura na primeira (`h-12` uma linha, `h-16` título + meta), última coluna `pr-9`. ([seção](03-shell-paginas-tabelas.md#tabelas-e-filtros))

### Loading, vazio e erro

- **Never** renderize a string "Carregando..." crua, nem um erro em dialog, nem um skeleton que mude de tamanho quando o dado chega.
- Em vez disso: atrase o skeleton com `useDelayedLoading(loading, 700)` (`registry/base-vega/hooks/use-delayed-loading.ts:16`) e renderize `null` antes disso, nunca o empty state; skeleton só no corpo da tabela (`TableRowsSkeleton` com a mesma `rowHeight` das linhas reais) ou no valor do StatCard (`Skeleton className="h-3 w-20"` ao lado de um zero-width space que segura a line box). ([seção](07-estados.md#loading-vazio-e-erro))

### Números, datas e formatação

- **Never** use travessão como placeholder (o `formatCost` do Foglamp usa; o lume não), `dayjs`, `moment`, `luxon`, ou `toLocaleString()` solto fora de `format.ts`.
- Em vez disso: formate por `registry/base-vega/lib/format.ts`, função por função: `formatMoney(v, { currency: "BRL" | "USD" })`, `formatCost` (USD, 6 casas, zeros à direita caem até 2), `formatCostFixed(v, 6)` em coluna (alinha no decimal), `formatCount` (arredonda antes, compacta de 1000 em diante), `formatExactCount` (nunca "1 mil"), `formatCompact` (123, 12,3, 0,42), `formatDuration` (até duas unidades, "1h" e não "60min 0s"), `formatSpanDuration(0) = "<1ms"`, `formatPercent`, `formatRelative` ("agora", "há 3 min"), `formatDateTime` (dd/MM HH:mm), `formatDelta`. ([seção](04-dados-e-cor.md#números-datas-e-formatação))

### Cor com significado

- **Never** invente cor por tela, use `slate` para "outro" (é `neutral`), ou coloque cor cromática num gráfico sem significado fixo.
- Em vez disso: use a tabela semântica fixa: emerald = ok, pass e embedding; rose = erro e falha; red = contagem de erro em célula; amber = aviso, abortado e agente; violet = llm; blue = tool; sky = sessões; orange = agentes; fuchsia = evals; yellow = alertas; lime = "varia por run". Paleta neutra `--chart-1..5` (cinzas iguais nos dois temas) para série sem semântica; `var(--destructive)` para erro em gráfico. ([seção](04-dados-e-cor.md#cor-com-significado))

### Overlays e menus

- **Never** construa portal, overlay ou focus trap próprios; nunca `DialogTrigger` para dialog com estado de formulário; dialog com seções usa a casca `gap-0 overflow-hidden p-0` e cada seção traz o próprio `p-6`.
- Em vez disso: use os primitivos: `Dialog` (`rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm ... shadow-(--custom-shadow) duration-100 ... sm:max-w-md`, entra em `zoom-in-[96%]` e sai em `zoom-out-[99%]`, backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, `registry/base-vega/ui/dialog.tsx:36,58`), `AlertDialog` para confirmar remoção (`AlertDialogAction variant="destructive"`, cancelar ghost), `Popover`, `Tooltip`, `DropdownMenu`. ([seção](05-formularios-e-dialogs.md#overlays-e-menus))

### Toasts

- **Never** use `alert()`, toast para cópia (o ícone vira check), para abrir dialog ou trocar aba, nem `richColors`/`closeButton`.
- Em vez disso: monte um único `<Toaster />` no root (item `sonner`): ícones Tabler filled de 16px, só success verde e error vermelho, `--normal-bg: var(--popover)`, raio `--radius`, tema do `useTheme`. ([seção](07-estados.md#toasts))

### Movimento

- **Never** crie curva ou spring dentro de componente, use `hover:scale-*`/`hover:translate-*`, anime na primeira pintura o que já está no lugar, ou troque `motion` por outra lib.
- Em vez disso: anime primitivos só com CSS: `tw-animate-css` preso a `data-open`/`data-closed` (popups 100ms, Dialog 100ms), `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` no Accordion, `transition-colors` em link, `transition-opacity` em revelação; o default de 150ms vale para o resto. Entrada de página é `useEntranceOnce()` + `cn(entrance && "page-fade-in")`: 75ms, só opacidade, uma vez por hard load, no header e nos slots de card (a cópia do `loading.tsx` não anima). ([seção](06-movimento.md#movimento))

### Dark mode

- **Never** escreva `dark:` manual para o que um token já flipa, toque `document.documentElement.classList` à mão, ou use preto puro (`--background` dark é `oklch(0.17 0 0)`).
- Em vez disso: monte `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` (item `theme-provider`, `app/layout.tsx:23-28`) ou `theme-provider-csp` com `public/theme.js` quando a CSP não aceita script inline; `suppressHydrationWarning` no `<html>`. ([seção](01-tokens-e-forma.md#dark-mode))

### Fontes

- **Never** carregue fonte por `<link>` do Google Fonts nem `next/font/google` para a Inter (build antigo, sem o eixo `opsz` e sem as variantes OpenType); `font-feature-settings: "cv11", "ss01"` é opt-in no guia, fora do `base`.
- Em vez disso: carregue pelo `base`: `@import "@fontsource-variable/inter/opsz.css"` e `@import "@fontsource-variable/geist-mono"` (`globals.css:9-10`), com `--font-sans: "Inter Variable"`, `--font-mono: "Geist Mono Variable"` e `--font-heading` igual à sans no `@theme inline` (`globals.css:227-231`); `html` e `body` em `font-sans`, `body` com `antialiased`. ([seção](01-tokens-e-forma.md#fontes))

### Responsividade e camadas

- **Never** crie `--breakpoint-*`, `--z-*` ou `2xl:`; o app é desktop-first e degrada (tabela `min-w-5xl` rola, cards empilham), o marketing é mobile-first.
- Em vez disso: use só os breakpoints padrão do Tailwind v4 (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e três degraus no app: `md` para a sidebar fixa e grids de stats (`md:grid-cols-2`, `md:grid-cols-4`), `lg` para pares de cards (`lg:grid-cols-2`), `xl` para quatro colunas; `sm` só em Dialog (`sm:max-w-md`, `sm:flex-row` no footer) e marketing. ([seção](03-shell-paginas-tabelas.md#responsividade-e-camadas))

### Acessibilidade e teclado

- **Never** use `focus-visible:ring-[3px]` em componente novo (sobra do shadcn em Badge e Tabs), nem deixe dois `<main>` aninhados na mesma tela.
- Em vez disso: use o anel canônico de foco: `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` (Button, Input, Select, Switch, linha interativa com `ring-inset`); erro espelha com `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`. ([seção](02-primitivos.md#acessibilidade-e-teclado))

### Telas de detalhe e drawers

- **Never** mostre o empty state de uma seção antes dos stats chegarem (um rollup lento piscaria o vazio), nem use `Drawer`/`Sheet` para o que é linha expansível.
- Em vez disso: siga o esqueleto comum: `PageHeader back={navItem(href)}` com `titleLeading` (ícone da entidade) ou `titleTrailing` (id em `hidden max-w-44 truncate font-mono text-xs font-normal text-muted-foreground sm:inline` + `CopyButton`), linha de `ContextChip` em `mt-1 flex flex-wrap items-center gap-2 text-xs px-6`, faixa de `StatCard size="sm"` em `grid grid-cols-2 gap-4 md:grid-cols-4 px-8 mt-1`, cards de gráfico e a tabela. ([seção](03-shell-paginas-tabelas.md#telas-de-detalhe-e-drawers))

### Assistente de AI (chat)

- **Never** use HUD em Shadow DOM, Command/cmdk ou um tema próprio para o chat: ele usa os mesmos tokens e primitivos do app; `ai-chat` como bloco fica para a v0.2.
- Em vez disso: monte o painel como irmão flex do inset no canvas `bg-sidebar`, largura 354px (mínimo 320, máximo 640), tween `{ duration: 0.25, ease: ENTRANCE_EASE }` com `{ duration: 0 }` durante o arrasto, conteúdo interno de largura fixa para não refluir; `useReportLayoutReserve(open ? width : 0)` (item `header-slot`) avisa a Toolbar da largura futura. ([seção](08-chat-de-ai.md#assistente-de-ai-chat))

### Marketing (opcional)

- **Never** leve hex de marca, `font-display`, texturas (névoa, cutting mat) ou durações acima de 1s para dentro do app.
- Em vez disso: use o container `mx-auto w-full max-w-7xl px-5 sm:px-8` e títulos em `font-display text-3xl font-[450] tracking-tight text-balance sm:text-4xl` (450 é o peso mais recente; 600 nas páginas antigas), corpo `text-lg text-muted-foreground text-pretty`. ([seção](01-tokens-e-forma.md#marketing-opcional))

### Next.js e Vite: o que muda

- **Never** use o Pages Router, `<a href>` para rota interna no Next (reload completo; `<a>` só para `mailto:`, `tel:` e externo), ou `<img>` cru fora de URL de terceiro com `referrerPolicy="no-referrer"`.
- Em vez disso: no Next: trio por rota (`header.tsx` com um `RouteHeader`, `loading.tsx` só com ele, `page.tsx` com o client ou `Suspense fallback={<XHeader />}` quando lê `useSearchParams`); `params` e `searchParams` são `Promise` e o server resolve e passa como prop; instale `link-next` (mesmo caminho `components/link.tsx`, sobre `next/link` com `prefetch`); imagens por `next/image` com `alt` obrigatório. ([seção](10-adocao.md#nextjs-e-vite-o-que-muda))

### Regras para agentes

- **Never** instale biblioteca de componentes, ícones, tabela, estado global (Zustand, Redux, Jotai) ou CSS file por componente; se parecer necessário, levante antes.
- Em vez disso: instale e use junto: `npx skills add joaodadas/lume --skill lume-design-engineering` (este arquivo gerado em `SKILL.md` + `references/`), `npx skills add gustavo-fior/craft` (a teoria; o lume cita o craft, não o substitui), `web-design-guidelines` de `vercel-labs/agent-skills` (reviewer que reporta `arquivo:linha`) e `emilkowalski/skills` (animação); a ordem de leitura está em `docs/referencias.md`. ([seção](10-adocao.md#regras-para-agentes))

## Do guia: 11. Receita: do zero a um app com a cara do Foglamp

### O que não copiar (mapa 21.13) e o que o lume já corrigiu

| Do Foglamp | Estado no lume |
|---|---|
| `hsl(var(--sidebar-border))` e `hsl(var(--sidebar-accent))` em sombra (CSS inválido com oklch) | corrigido: `shadow-[0_0_0_1px_var(--sidebar-border)]` (`registry/base-vega/ui/sidebar.tsx:487`) |
| `--custom-shadow-slate` e `--sidebar-primary*` sem uso; `--font-mono` nunca mapeada | removidos do `globals.css`; `--font-mono` aponta para Geist Mono Variable (`styles/globals.css:228`) |
| Hex `#EBEBEB`/`#1E1E1E`/`#2A2A2A` no footer e caption da tabela; `#B8B8B8`/`#5B5B5B` em ícone de busca; `#EFEFEF`/`#252525` em hairline | corrigido: `border-t border-border/50 dark:border-border/40` (`ui/table.tsx:130,232`), `text-muted-foreground/50` e `border-border/50` (`data-table`, `range-picker`) |
| `slate` no `span-type` e `rgba(100,116,139)` nas sombras inset | corrigido: neutral e `rgba(115,115,115)` (`components/span-type.tsx`) |
| Ausência de `SidebarTrigger` no mobile; curvas e springs duplicados em 10 arquivos | corrigido: header `md:hidden` com o trigger no `app-shell`; `lib/motion.ts` (os charts mantêm cópia local) |
| `@number-flow/react`, `ogl` órfãos; `cn` do npm; código morto (`prefetch.ts`, `user-menu.tsx`, `CardsSkeleton`, `Stat`, `pageWindow`, `BrazilFlag`, `HeroGrain`, keyframes `poster-*`) | não entram: `number-ticker` à mão, `clsx` + `tailwind-merge`; nada copiado |
| `Kbd` dentro de tooltip (feito para o tooltip invertido), `light:border-overlay` (variante inexistente), `squircle:rounded-[60]` (sem unidade, Foglamp figures-traces.tsx), cookie `sidebar_state` que ninguém lê | não copiados |
| Tooltip sem `duration-100` (anima em 150 ms); `transition-all hover:duration-150` no Button | pendente: verbatim na v0.1; mantido verbatim (é o look), não replicar em componente novo |
