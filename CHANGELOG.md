# Changelog

Todas as mudanças relevantes do lume ficam aqui. O formato segue o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem
o [SemVer](https://semver.org/lang/pt-BR/): patch é correção visual, minor é item
ou prop nova, major é token removido ou prop quebrada. Cada versão tem uma tag
`vX.Y.Z`; o consumidor fixa a tag no comando (`npx shadcn@latest add
joaodadas/lume/<item>#vX.Y.Z`) e atualiza com `--diff` para ver e `--overwrite`
para aplicar. Quando um item muda de API, a seção traz "Como migrar".

## [0.3.1] - 2026-10-30

Correções de hierarquia e de leitura achadas no Horizonte, o primeiro produto
que consome o lume nas telas de dados. Nenhuma API mudou.

### Corrigido

- `section`: o título sobe para `text-base` com `tracking-tight`, um degrau
  acima do título de card; antes o grupo e o item tinham o mesmo tamanho.
- `stat-card`: o rótulo vai a `text-xs text-muted-foreground` e o número fica
  como protagonista; o `DeltaBadge` passa a `emerald-700` e `red-600` no claro
  (5,5 e 4,8 para 1 sobre branco; antes 3,8) e `red-400` no escuro.
- `range-picker`: o preset inativo usa o `muted-foreground` cheio e vai a
  `foreground` no hover; o `/50` lia como botão desabilitado.
- `badge`: o tamanho `sm` vai de 10 px para `text-xs` (`h-4.5`).

## [0.3.0] - 2026-10-26

Formatos de shell: um `AppShell` com dois layouts sobre o mesmo canvas e o
mesmo cartão, o modelo de navegação com seções e filhos, e a página solta como
receita do guia. Nenhum primitivo verbatim mudou e nenhuma dependência entrou.
Junto vêm o guia de identidade visual por produto (só a cor muda, e por
enquanto todo produto usa as cores do Foglamp) e o conserto do `next dev`.

### Adicionado

- `app-shell`: `layout="topbar"`, barra `h-12` opaca no canvas com um nível de
  até 7 zonas, para produto de leitura e mural de TV; a zona com filhos abre um
  menu no clique, nunca no hover; na barra estreita (painel aberto, tablet), a
  busca vira só a lupa e as zonas que não cabem rolam dentro da nav, sem passar
  por baixo dos tools; abaixo de 768 px o celular é o mesmo da sidebar, com as
  zonas na gaveta.
- `app-shell`: modelo de navegação com seções (`NavSection`), item com filhos
  (`NavParentItem`, `children`, um nível), `badge` tipado (contagem, status e
  selo), `external` (`tab` e `page`), `disabled` com motivo, `hint` e menu de
  ações (`menu`); `toSections`, `flattenNav`, `findActive`, `SIDEBAR_COOKIE` e
  `readSidebarOpen` em `nav.ts`.
- `app-shell`: trilho de ícones (`collapsible="icon"`) com tooltip do rótulo;
  `ShellTrigger` visível no desktop; slots `top`, `tools`, `banner` e `panel`;
  `fill`; `defaultOpen`, `open` e `onOpenChange`; `user.detail`.
- `app-shell`, arquivo novo `shell-parts.tsx`: `ShellTrigger`,
  `ContextSwitcher`, `SearchTrigger`, `useShortcut`, `isEditableTarget` e
  `useShellLayout`. O Cmd/Ctrl+K do `SearchTrigger` vale também com a gaveta do
  celular fechada.
- `app-shell`, arquivo novo `nav-list.tsx`: `NavSections`, `NavZones`,
  `NavLink`, `NavParent` e `NavMenuItem`, os renderizadores de item da sidebar,
  do trilho, da gaveta e da barra, e a classe `NAV_BUTTON`.
- Acessibilidade do shell: link "Pular para o conteúdo", `nav` com rótulo
  ("Principal" e "Conta"), `aria-current="page"`, viewport com
  `tabIndex={-1}`, itens de 44 px na gaveta, alvo de 44 px no gatilho e no
  seletor de contexto do celular, rótulos do gatilho em pt-BR, a sidebar
  recolhida em offcanvas fora da ordem do Tab e o foco devolvido ao
  `ShellTrigger` à vista quando recolher ou expandir esconde o elemento
  focado.
- Guia: formatos do shell, regra de escolha, peças do shell, persistência do
  recolhido e página solta em `docs/guia/03-shell-e-paginas.md`; chat como
  página em `fill` em `docs/guia/08-assistente-de-ai.md`.
- Guia de identidade visual por produto em `docs/adocao/identidade-visual.md`:
  o que pode mudar (só a cor), o que fica travado, o que um tema do produto
  alcança hoje e o que espera as cores por significado, com o teal da Lyx como
  exemplo. A regra entrou também no `FRONTEND.md` (Tokens e cor) e na skill.
- `check`: a verificação 12 barra exemplo de classe com placeholder (`{c}`,
  `<cor>`) dentro de colchetes nos textos; o `next build` passa a ser a 13.

### Mudado

- `app-shell`: o padrão de recolher passa de offcanvas sem gatilho para o
  trilho de ícones; `Cmd/Ctrl+B` recolhe sem animação, não age em
  `contenteditable` e não faz nada na barra; o clique recolhe em 200 ms com
  `EASE` no lugar do `ease-linear`.
- `app-shell`: o viewport de scroll deixa de ser `<main>` e vira `div`
  (`data-slot="shell-viewport"`); o `SidebarInset` é o único `main`.
- `app-shell`: o header só de celular, com `SidebarTrigger`, virou o cabeçalho
  do cartão (`data-slot="shell-card-header"`), com `ShellTrigger`, marca e
  página atual, que também aparece no desktop com a sidebar recolhida em
  offcanvas.
- `app-shell`: o cartão fica a 8 px da sidebar aberta e do trilho, e o shell
  monta `HeaderActionsSlotProvider`, `LayoutReserveProvider` e o
  `TooltipProvider delay={150}` da sidebar.
- `app-shell`: o item ativo é o de href mais longo que casa (`findActive`), e
  não mais o primeiro da lista; `icon` e `activeIcon` ficam opcionais, e item
  sem ícone some do trilho; `navItem(nav, href)` aceita seções e procura nos
  filhos.
- `app-shell`: sem área morta entre os itens (`SidebarMenu` com `gap-0` e botão
  de 36 px com pílula de 32, ou 44 na gaveta), no lugar do `gap-1` do
  primitivo.
- `app-shell`: o menu de conta ganha `aria-label` "Conta: nome", o `detail` sob
  o nome e, na barra, o modo compacto com os itens de `account` no topo.
- `page-header`: `PageHeaderBack.icon` fica opcional; sem ele, o crumb sai só
  com o rótulo.
- Skill `lume-design-engineering`: o princípio 8 vale para todo formato
  (sidebar, trilho ou barra).
- Camada Lyx (`docs/adocao/camada-lyx.md`) e migração da 52W: o teal sai do
  plano atual. O `theme-lyx` fica só com a variante dark de transição, a cópia
  de `badge` e `button` com a variante `brand` sai, e os aliases da 52W
  apontam para o `--primary`.

### Corrigido

- `next dev` respondia 500 em toda rota do site ("Parsing CSS source code
  failed"): exemplos de classe com `{c}` e `<cor>` dentro de colchetes no
  `FRONTEND.md` e no guia viravam CSS inválido, porque o Tailwind lê os `.md`.
  Os exemplos agora usam o emerald, e o mesmo texto deixa de chegar ao
  `docs/lume` do app pelo item `guia`. O `next build` já passava.

### Como migrar

- Para manter o recolher antigo, passe `collapsible="offcanvas"`; com a sidebar
  fora, o gatilho passa a aparecer no cabeçalho do cartão.
- Leia o cookie `sidebar_state` (`SIDEBAR_COOKIE` e `readSidebarOpen`) e passe
  `defaultOpen` (guia 03, Persistência do recolhido); sem isso, a sidebar abre
  expandida a cada carga, como hoje.
- CSS que mirava o `main` do viewport passa a mirar
  `[data-slot=shell-viewport]`, e o código que rolava o `main` para o topo ao
  navegar passa a rolar esse elemento.
- `NavItem[]` continua aceito em `nav`. Quem anota a lista como `NavItem[]` e lê
  `href` ou `exact` direto passa a anotar `NavLinkItem[]` (o `NavItem` agora
  inclui o item com filhos, que não tem `href`) ou estreita por `children`;
  `account` pede `NavLinkItem[]`.
- Quem renderiza `item.icon` ou `item.activeIcon` direto (`<item.icon />`)
  passa a tratar o ausente, porque os dois ficaram opcionais: use
  `item.activeIcon ?? item.icon` e não renderize nada quando os dois faltam, ou
  troque pelo `NavIcon`, que já faz isso.
- Passe a marca e o nome como irmãos em `brand`
  (`<><Logo /><span>Nome</span></>`): no trilho fica só o primeiro filho.
- O `HeaderActionsSlotProvider` e o `LayoutReserveProvider` em volta do
  `AppShell` podem sair: os de dentro vencem.
- `npx shadcn@latest add joaodadas/lume/app-shell#vX.Y.Z --overwrite` e o
  mesmo para `page-header`, com a tag da release.

### Decisões registradas (`docs/DECISOES.md`)

- Um `AppShell` com dois layouts e a página solta como receita, sem item.
- O trilho de ícones é o padrão de recolher.
- A barra superior só para produto de leitura com até 7 zonas e mural de TV,
  nunca como navegação principal de front da Lyx.
- Nenhum primitivo verbatim muda; `TooltipProvider delay={150}` no trilho;
  busca, contagem e sino só com fonte real; "Voltar ao Hub" e "Sair de todos os
  sistemas" como dois itens; "Vercel Finance Agent" fora das referências.
- Só a cor varia por produto, e por enquanto a Lyx e a Horizonte usam as cores
  do Foglamp; o teal sai do plano da camada Lyx; exemplo de classe nos docs vai
  com cor real.

### Próximo (fora da v0.3.0)

- Capítulo de marketing do guia.
- Bloco `ai-chat` (do Foggy) e o HUD.
- `route-header` (trio header, loading e page) como item `nextOnly`.
- `number-flow`, `model-chip` e logos de marcas.
- Migração efetiva dos fronts da Lyx (trabalho da camada `lyx-ds`, com o guia de adoção).
- Cores por significado na base, quando um produto pedir identidade própria
  (`docs/adocao/identidade-visual.md`).

## [0.2.0] - 2026-10-17

Esta versão incorpora o levantamento dos sete design engineers que o craft do
Gustavo Fior credita (Rauno Freiberg, Emil Kowalski, Jakub Krehel, Paco Coursey,
Shu Ding, Benji Taylor e Raphael Salaja). O que entrou são regras e conceitos
com fonte primária; de código, só o que a regra pedia. O levantamento está em
`docs/pesquisa/goats-do-craft.md`.

### Adicionado

- Nove conceitos em `docs/conceitos/`, marcados como adição do lume e com fonte
  nos autores: frequência decide, duração por componente, sombra no dark,
  exceções da borda, hit areas, focus ring, continuidade, novelty budget e
  curve smoothing. Cinco conceitos do craft ganharam fontes além do craft
  (hover-restraint, button-press, image-outlines, nested-border-radius,
  scroll-fades).
- `docs/referencias.md`: seção Pessoas com os sete autores, leituras novas em
  grupos, skills `jakubkrehel/skills` e `raphaelsalaja/userinterface-wiki`
  como recomendadas, `react-best-practices` e `oklch-skill` como opcionais.
- `FRONTEND.md`: regras novas em Sombra, Tipografia, Botões, Overlays, Toasts,
  Movimento, Acessibilidade e Regras para agentes (duração por componente,
  frequência decide, menu abre instantâneo e fecha com fade, hit area mínima,
  setas em lista, peso mínimo 400, texto em rem, submit não pré-desabilitado).
- `button`: size `icon-xs` expande a área de toque para 32 px com
  `relative after:absolute after:-inset-1`.
- `tooltip`: `data-instant:duration-0`, tooltip vizinho abre sem animação.
- `dialog`, `sheet`, `drawer`, `dropdown-menu`, `select`, `popover`:
  `overscroll-contain` no popup rolável.
- Skill `lume-design-engineering` regenerada com tudo acima.

### Mudado

- `drawer` reescrito sobre o Dialog do Base UI, sem `vaul` (o autor marcou o
  pacote como não mantido e ele depende de Radix Dialog). API: `direction` do
  Root virou `side` do `DrawerContent` (bottom padrão; top, left, right), como
  no Sheet; sem arraste nem snap points; transição de 300 ms com a curva de
  drawer do Emil Kowalski. O `scripts/sync-upstream.ts` não sobrescreve mais
  esse arquivo.
- Correção de atribuição: as Web Interface Guidelines da skill são de
  `vercel-labs/web-interface-guidelines` (John Pham, MIT); a lista de 2023 do
  Rauno é `interfaces.rauno.me`; `cmdk` é do Paco Coursey (hoje na org Dip).

### Como migrar

- Quem usava `<Drawer direction="right">` passa a usar
  `<DrawerContent side="right">`. Reinstale com
  `npx shadcn@latest add joaodadas/lume/drawer#v0.2.0 --overwrite` e remova
  `vaul` do `package.json` se nada mais o usar.
- Os outros itens mudam só classes: `--overwrite` nos itens `button`,
  `tooltip`, `dialog`, `sheet`, `dropdown-menu`, `select` e `popover`, ou
  `--diff` para ver antes.

### Decisões registradas (`docs/DECISOES.md`)

- `cmdk` continua, apesar de trazer Radix: é o que o shadcn usa.
- Press fica em 0.97 (Jakub e Rauno usam 0.96).
- Som continua fora.
- `nstr` não entrou: os `toFixed` da registry são coordenadas de SVG.

## [0.1.1] - 2026-10-16

### Corrigido

- A pasta `ui/` do Evil Charts virou `core/`: a CLI do shadcn reescrevia o import de `evilcharts/ui/tooltip` para o alias `ui` do consumidor e o `line-chart` quebrava o build.
- O alias `@lume` e o site passam a usar `https://lume-ashmont.vercel.app` (`lume.vercel.app` pertence a outro projeto).
- Proteção de deploy da Vercel desligada no projeto: a registry precisa ser pública.

## [0.1.0] - 2026-10-16

### Adicionado

- Tokens em `registry/base-vega/styles/globals.css` (item `base`, `registry:base` com `extends: "none"`): neutros em oklch, 16 `--custom-shadow-*` mais `--custom-outline-shadow` por tema, raios, `@custom-variant squircle`, plugin `@toolwind/corner-shape`, fontes Inter e Geist Mono via Fontsource e `--font-mono` mapeada.
- 56 primitivos do Foglamp sobre `@base-ui/react`, cópia verbatim com cabeçalho de atribuição: 41 core (button, badge, card, input, textarea, label, field, input-group, native-select, select, combobox, checkbox, radio-group, switch, toggle, toggle-group, dialog, alert-dialog, sheet, popover, tooltip, hover-card, dropdown-menu, tabs, accordion, collapsible, table, pagination, avatar, separator, scroll-area, skeleton, spinner, loader, sonner, alert, empty, kbd, progress, calendar, sidebar) e 15 extra, publicados verbatim e sem vitrine (aspect-ratio, breadcrumb, button-group, carousel, chart, command, context-menu, direction, drawer, input-otp, item, menubar, navigation-menu, resizable, slider).
- Lib e hooks: `utils` (`cn`), `format` (Intl pt-BR, `America/Sao_Paulo`, `formatMoney` BRL e USD), `motion` (`EASE`, springs), `range`, `use-mobile`, `use-delayed-loading`, `use-entrance-once`, `use-debounced-value`, `use-copied`.
- Blocos: `link` e `link-next` (indireção de navegação; blocos ficam puros e servem em Vite), `header-slot`, `page-header`, `stat-card`, `stat-grid`, `card-sparkline`, `pill-meter`, `scroll-fade`, `empty-state`, `table-skeletons`, `notice`, `section`, `app-shell` (com `nav-icon` e `nav`), `data-table` (com `url-filters` sobre `history.replaceState`), `range-picker`, `context-chip`, `span-type`, `copy-icon`, `copy-button`, `code-block` (shiki, tema duplo), `markdown-components`, `theme-provider`, `theme-provider-csp` (com `public/theme.js`), `theme-switcher`, `login-form` (presentacional, validação com zod).
- Gráficos: `evilcharts` (fork vendorizado, MIT), `area-chart`, `bar-chart`, `line-chart`, `donut-chart`, `trend-charts`.
- Extras: `number-ticker`, `rolling-text` (slot-text), `border-beam-card` (border-beam), `font-display` (Host Grotesk via Fontsource).
- Kits (`registry:block` só com `registryDependencies`): `kit-shell`, `kit-tabela`, `kit-formulario`, `kit-feedback`, `kit-dados`, `kit-graficos`.
- Guia: `FRONTEND.md` (regras Always e Never), `docs/guia`, `docs/conceitos` (craft, reescrito em pt-BR), `docs/referencias.md`, `docs/adocao` (Next novo, Vite, migração 52W, camada Lyx) e o item `guia`, que instala tudo em `docs/lume/`.
- Skill `lume-design-engineering` (`skills/lume-design-engineering`), gerada do `FRONTEND.md` e do guia, instalável com `npx skills add joaodadas/lume --skill lume-design-engineering`.
- Site de vitrine em https://lume-ashmont.vercel.app, que também serve a registry em `/r/<item>.json` (alias `@lume`).
- Tooling: `scripts/check.ts` (12 verificações), `scripts/release.ts`, `scripts/sync-upstream.ts`, CI em `.github/workflows/check.yml`.

### Mudado

Correções em relação ao Foglamp, aplicadas pelo `sync-upstream` e registradas no cabeçalho de cada arquivo:

- `sidebar.tsx`: `hsl(var(--sidebar-border))` e `hsl(var(--sidebar-accent))` viraram `var(--sidebar-border)` e `var(--sidebar-accent)` (os tokens são oklch; `hsl(var())` é CSS inválido).
- `table.tsx`: os hex `#EBEBEB`, `#1E1E1E` e `#2A2A2A` do footer e da caption viraram `border-border/50 dark:border-border/40`; comentário com hex removido.
- `globals.css`: `--font-mono` mapeada para Geist Mono no `@theme inline`; `--sidebar-primary` e `--sidebar-primary-foreground` removidos (sem uso); `--custom-shadow-slate` removido (sem uso).
- Imports reescritos de `@foglamp/ui/*` para `@/registry/base-vega/*`.

### Upstream

- Foglamp `2bc3bb5` (2026-10-12).
