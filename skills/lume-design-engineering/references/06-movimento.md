# Movimento

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/09-movimento.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Movimento

<!-- mapa: 19.1, 19.2, 19.4, 19.6 | regras 17, 18, 19 -->

- **Always** anime primitivos só com CSS: `tw-animate-css` preso a `data-open`/`data-closed` (popups 100ms, Dialog 100ms), `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` no Accordion, `transition-colors` em link, `transition-opacity` em revelação; o default de 150ms vale para o resto. Entrada de página é `useEntranceOnce()` + `cn(entrance && "page-fade-in")`: 75ms, só opacidade, uma vez por hard load, no header e nos slots de card (a cópia do `loading.tsx` não anima).
- **Always** use `motion/react` em composições só com o vocabulário de `registry/base-vega/lib/motion.ts`: `EASE [0.22, 1, 0.36, 1]`, `ENTRANCE_EASE [0.32, 0.72, 0, 1]`, `REVEAL_EASE [0, 0.7, 0.5, 1]`, `MORPH { type: "spring", stiffness: 400, damping: 38 }` (pílula com `layoutId` e morph de altura), `TOOLBAR_SPRING 520/44`, `COPY_SPRING { duration: 0.25, bounce: 0 }` (troca de ícone com `scale 0.25` e `blur(4px)`); durações de UI entre 0.12 e 0.25s, revelação de dados entre 0.5 e 1s, acima de 1s só marketing.
- **Always** faça hover instantâneo ou só de cor (`text-muted-foreground hover:text-foreground`, `hover:bg-muted`, chips com `transition-[color,box-shadow]`), press só no Button (`active:scale-[0.97]`), `initial={false}` no que já está no lugar, saída mais curta que a entrada.
- **Always** respeite reduced motion como estado final: `useReduce()` e a receita devolve `{}` ou monta pronta; loops longos (névoa, dash) em keyframes CSS.
- **Never** crie curva ou spring dentro de componente, use `hover:scale-*`/`hover:translate-*`, anime na primeira pintura o que já está no lugar, ou troque `motion` por outra lib.

Porquê: o Foglamp duplica as mesmas cinco curvas em dez arquivos; centralizadas, todo controle segmentado desliza igual e a página inteira aparece em 75ms uma única vez por carga.

## Do guia: 09. Movimento

### Dois sistemas que não se misturam

| Camada | Como anima | Onde | Regra |
|---|---|---|---|
| Primitivos (`registry/base-vega/ui/*`) | Só CSS: `tw-animate-css` preso a `data-open`/`data-closed`/`data-starting-style`/`data-ending-style` do Base UI, mais `transition-*` do Tailwind | 12 arquivos com `animate-in`/`animate-out`: alert-dialog, combobox, context-menu, dialog, drawer, dropdown-menu, hover-card, menubar, navigation-menu, popover, select, tooltip | Nenhum primitivo importa `motion/react` |
| Composições (`components/*`, `blocks/*`) | `motion/react` com o vocabulário fechado de `lib/motion.ts` | `copy-icon`, `theme-switcher`, `number-ticker`, `data-table` (Toolbar e ClearFiltersButton), os três charts | Curva ou mola nova não nasce dentro de componente |
| Restrição | Hover instantâneo ou só cor; press `scale(0.97)` só no Button; popup entra em 100 ms; a página aparece em 75 ms uma vez por carga | | Motion longa (acima de 1 s) só em marketing e em revelação de dados que roda uma vez |

### Vocabulário: easings e durações

| Nome em `registry/base-vega/lib/motion.ts` | Valor | Uso |
|---|---|---|
| `EASE` (:18) | `[0.22, 1, 0.36, 1]` | Copy "blur up" (0.7 s), barras e pontos das figuras (0.25 a 0.6 s); é a mesma curva CSS `ease-[cubic-bezier(0.22,1,0.36,1)]` do Accordion (`ui/accordion.tsx:67`), do rótulo do `range-picker` (:164) e o `easing` do `rolling-text` (:61) |
| `ENTRANCE_EASE` (:22) | `[0.32, 0.72, 0, 1]` | Pílula de abas (0.2 s), largura de painel (0.25 s), entrada 3D do demo (1.7 s e 1.1 s) |
| `REVEAL_EASE` (:25) | `[0, 0.7, 0.5, 1]` | Wipe de 1 s e grow-in de 0.5 s dos charts (os três charts ainda carregam a cópia local verbatim: `charts/area-chart.tsx:68`, `bar-chart.tsx:68`, `line-chart.tsx:67`) |
| `MORPH` (:29) | `{ type: "spring", stiffness: 400, damping: 38 }` | Pílula segmentada com `layoutId` e morph de altura e largura; "todo controle segmentado do app desliza igual" |
| `TOOLBAR_SPRING` (:33) | `{ type: "spring", stiffness: 520, damping: 44 }` | Grupo `trailing` da Toolbar quando troca de pai (`blocks/data-table/data-table.tsx:299-304`) |
| `COPY_SPRING` (:41) | `{ type: "spring", duration: 0.25, bounce: 0 }` | Troca de ícone copy/check (`components/copy-icon.tsx:36`); a share-bar do Foglamp usa 0.3 |
| `useReduce()` (:49) | `useReducedMotion() ?? false` | Quem anima testa e devolve `{}` ou o estado final |
| Sem nome no lume | `"easeOut"` 0.12 a 0.6 s; `"linear"` no shimmer de 2000 ms; `[0.4, 0, 0.2, 1]` só no colapso da dev toolbar; `{ stiffness: 300, damping: 35, mass: 0.8 }` no brush (`evilcharts/ui/evil-brush.tsx:94`) | Não promova a token sem segundo uso |

Durações em Motion (s): 0.12 a 0.25 para UI do produto (fade de painel 0.15, troca de passo 0.18, pílula 0.2, largura de painel e ícone 0.25, Clear filters 0.13); 0.5 a 1 para dados revelando-se uma vez (barras 0.5, count-up 0.6, wipe de chart 1); 0.7 no `rise()` do copy; 1.1 e 1.7 só na entrada 3D da landing; `{ duration: 0 }` enquanto o usuário arrasta ou na primeira medida. Em CSS: `duration-100` nos popups e no Dialog, `duration-200 ease-linear` na Sidebar (`ui/sidebar.tsx:223,235`, único `ease-linear` do sistema), `duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` no Accordion; 126 strings com `transition-*` ficam no default de 150 ms. Não existe token `--ease-*`: as curvas vivem em TS.

### As 12 receitas

1. **Rise (blur up) do copy** (hero.tsx:151-158; também scan e hud). Sempre desligada sob reduced motion: devolve `{}` e o elemento renderiza no lugar. Delays no hero: h1 0.3, p 0.4, botões 0.5 e 0.6 (stagger de 0.1 entre blocos de copy, acima dos 30 a 60 ms do craft para listas).

```tsx
const reduce = useReduce();
const rise = (delay: number): MotionProps =>
  reduce ? {} : {
    initial: { opacity: 0, y: 12, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE, delay },
  };
```

2. **Pílula compartilhada** (`components/theme-switcher.tsx:62-83`; Segmented no Foglamp, apps/web/src/app/(app)/evals/eval-settings-fields.tsx:171-190). Um `button relative` por opção, o `motion.span` absoluto só dentro do ativo, rótulo em `relative z-10` (a pílula em voo vive no botão de destino e seu transform a empilha acima dos irmãos). `pillId = useId()` para dois controles na mesma tela não dividirem a pílula. Superfícies: `bg-input/50 shadow-(--custom-shadow) dark:bg-input/50` (tema), `bg-background shadow-(--custom-shadow) dark:bg-input/50` (Segmented), `bg-muted dark:bg-muted/50` (abas de settings). As abas de settings tiram `transition-colors` do botão e deixam só `hover:transition-colors`: a pílula sai na hora, um fade de cor atrasado leria como "flick".

```tsx
<button className={cn("relative ... rounded-full transition-colors",
  active ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground")}>
  {active && <motion.span layoutId={pillId} transition={MORPH}
    className="absolute inset-0 rounded-full bg-input/50 shadow-(--custom-shadow) dark:bg-input/50" />}
  <Icon className="relative z-10 size-3.5" />
</button>
```

3. **Troca de ícone com blur** (`components/copy-icon.tsx:28-52`): `AnimatePresence mode="popLayout" initial={false}` dentro de um `span relative inline-flex` (o ícone que sai, absoluto, fica sobre o que entra); `initial`/`exit` `{ opacity: 0, scale: 0.25, filter: "blur(4px)" }`, `transition={COPY_SPRING}`. Check `IconCircleCheckFilled text-green-600 dark:text-green-400`; dentro de um `Button default` o par inverte via `checkClassName`. Estado por `useCopied(1500)` (`hooks/use-copied.ts:13`); 2000 ms em botões de prompt e no `code-block`.
4. **Morph de altura e largura** (`AutoHeight`, evals-client.tsx:190-229): `motion.div` com `animate={{ height }}` lido por `ResizeObserver`; primeira medida sem tween (`transition={ready.current ? MORPH : { duration: 0 }}`); mede `offsetHeight`, não `getBoundingClientRect`, porque o dialog abre em `zoom-in` e o rect viria reduzido; o padding fica no filho medido para o `overflow-hidden` ter espaço para o anel de foco. Largura do wizard com o mesmo `MORPH` entre 460, 800 e 600 px (:509); cada passo faz fade de 0.18 s (:540).
5. **Saída encenada, mais rápida que a entrada** (dev-toolbar.tsx:402-428): `FADE_S = 0.1`, `COLLAPSE_S = 0.25`; o conteúdo some em 0.1 s e só então altura e `marginBottom: "-0.5rem"` colapsam em 0.25 s com `[0.4, 0, 0.2, 1]`. É o "exit em metade da entrada" do craft (content/motion/exit-animations.mdx). A única saída que espelha a entrada é o `CopyIcon`, cujo `exit` repete o `initial`.
6. **Entrada 3D do demo** (entrance.ts:18-38; hero.tsx:114-115,230-236): `ENTRANCE_EASE`; `LIFT 40`, `DROP 84`, `DURATION 1.7`; peças `PIECE_DROP 40`, `PIECE_DURATION 1.1`, `PIECE_GAP 0.065`, `PIECE_AFTER 0.25`; `DROP_AT { inset: 0.9, sidebar: 1, content: 1.8 }`; `SURFACE_TINT_AT 0.3`; `TILT { rotateX: 8, rotateZ: -6, scale: 1.15, x: 40, y: 60 }`, `FLAT` tudo zero, `transformPerspective: 2400`. A placa aparece na cor do chrome e só opaca muda para `--background` (`times: [0, 0.3, 1]`): no dark a superfície é três níveis mais clara que o chrome e uma placa translúcida tremeria no compositor. Peça montada depois da entrada passa `initial={false}`. Só marketing.
7. **Figuras que animam uma vez ao entrar em vista** (figure-reveal.tsx:23,41-46): `useInView(ref, { once: true, amount: 0.35 })` mais `LEAD_MS = 400` de pausa; sob reduced motion `shown` já é true na primeira pintura. Barras `initial={false}`, `animate={{ width: shown ? width : "0%" }}`, `duration 0.5, ease: EASE, delay: 0.3 + index * 0.1`; pontos `scale: shown ? 1 : 0` em 0.25 s.
8. **Névoa dirigida por scroll** (cta.tsx:90-100): `useScroll({ target: ref, offset: ["start end", "center center"] })`, `useTransform` de opacidade 1 para 0.42 e `blur(4px)` para `blur(0px)`; só renderiza com `useInView(ref, { margin: "30% 0px 30% 0px" })`. O drift é CSS (`.fog-layer { will-change: transform }`, index.css:142-148): a versão JS "deixava todo hover da página lento". Reduced motion: `opacity: 0.5` fixo e `animation: none`.
9. **Gráficos** (`components/evilcharts/charts/*`): wipe de entrada por `<mask>` com `motion.rect` em `scaleX` 0 para 1, `REVEAL_DURATION = 1` com `REVEAL_EASE`, o mesmo mask sobre fill, stroke e dots (area-chart.tsx:67-68,950); barras `BAR_GROW_DURATION = 0.5`, `BAR_STAGGER = 0.05` ancoradas em `introStartedAt` porque o Recharts remonta cada barra no hover (bar-chart.tsx:66-67,909-922); shimmer `LOADING_ANIMATION_DURATION = 2000` linear; brush em `useSpring` 300/35/0.8 (`ui/evil-brush.tsx:94,361`); dim de refetch `opacity-50 delay-150 duration-300` ao entrar e `duration-150` ao sair (`ui/chart.tsx:135`), `useFrozen` congela a vista anterior (`components/trend-charts.tsx:240`). Tipos: `left-to-right`, `right-to-left`, `center-out`, `edges-in`, `none` (fallback automático sob reduced motion).
10. **Números que contam** (`components/number-ticker.tsx:50-55`): `animate(from, value, { duration: 0.6, ease: "easeOut", onUpdate, onComplete })` formatando a cada frame; a primeira pintura é estática, só mudanças animam; sob `useReduce()` o número troca de uma vez (adição do lume). `@number-flow/react` não entra: o Foglamp declara e nunca importa.
11. **Waterfall que replica o trace** (trace-timeline.tsx:212-231, CSS puro): `TIMELINE_REVEAL_SECONDS = 1.2`; cada barra `transition: transform ${seconds}s linear ${delay}s`, `seconds = max(0.15, durationFraction * 1.2)`, `delay = offsetFraction * 1.2`. Linear de propósito: o tempo da barra é o tempo do span; o piso de 0.15 s evita "pop" em spans minúsculos.
12. **Painel lateral de chat** (foggy-widget.tsx:64-70,471,503,555,606): `motion.aside` com `animate={{ width: open ? displayWidth : 0 }}` em `0.25 s` `ENTRANCE_EASE`, `{ duration: 0 }` enquanto arrasta; o inner tem largura fixa para o conteúdo não refluir; `PANEL_WIDTH 354`, mínimo 320, máximo 640, rubber-band de 28 px; fades internos 0.15 s `easeOut` em `AnimatePresence mode="wait" initial={false}`; o botão aparece com `delay 0.2, duration 0.12`.

### Primitivos: a string canônica de popup

Dropdown, select, popover, combobox, context-menu, menubar e hover-card compartilham (`ui/dropdown-menu.tsx:47`, `ui/popover.tsx:42`, `ui/context-menu.tsx:58`):

```text
origin-(--transform-origin) ... duration-100
data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
```

| Primitivo | Entrada | Duração | Observação |
|---|---|---|---|
| Dialog e AlertDialog (`ui/dialog.tsx:58`, `ui/alert-dialog.tsx:57`) | `data-open:zoom-in-[96%]` / `data-closed:zoom-out-[99%]` + fade | `duration-100` | a saída quase não encolhe; o shadcn padrão usa 95 |
| Overlay de Dialog e AlertDialog (`ui/dialog.tsx:36`) | `fade-in-0` / `fade-out-0` | `duration-100` | `fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-[2px]`; o do Drawer é `bg-black/10 supports-backdrop-filter:backdrop-blur-xs` sem duração (`ui/drawer.tsx:42`) |
| Tooltip (`ui/tooltip.tsx:58`) | fade + `zoom-in-95` + slide 2 | sem `duration-*` (150 ms do tw-animate) | mesma superfície do popover, não invertida; `TooltipProvider delay={150}` em volta de tabelas (default do provider é 0, :10) |
| Sheet (`ui/sheet.tsx:33,61`) | `data-starting-style:opacity-0` + translate | `transition duration-200 ease-in-out`, overlay `transition-opacity duration-150` | única superfície com `transition` em vez de tw-animate |
| Accordion (`ui/accordion.tsx:46,67`) | `transition-[height] data-starting-style:h-0 data-ending-style:h-0` | `duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` | chevron `rotate-180 transition-transform duration-300` |
| Sidebar (`ui/sidebar.tsx:223,235,405`) | `transition-[width]`, `transition-[left,right,width]`, `transition-[margin,opacity]` | `duration-200 ease-linear` | único `ease-linear` em UI |
| NavigationMenu (`ui/navigation-menu.tsx:111`) | `slide-in-from-right-52` / `-left-52` por `data-[motion]` | `duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]` | os únicos `duration-[...]` arbitrários |
| Todos | `data-open:animate-in` / `data-closed:animate-out` | | substituem o `data-[state=open]:` do shadcn Radix (zero ocorrências), porque os primitivos são Base UI |

### Entrada de página: 75 ms, uma vez por carga

`use-entrance-once` instala o CSS pelo campo `css` do item: `@keyframes page-fade-in { from { opacity: 0 } }`, `.page-fade-in { animation: page-fade-in 75ms ease-out }`, `animation: none` sob `prefers-reduced-motion` (index.css:66-81). O gate é `useEntranceOnce()` (`hooks/use-entrance-once.ts:19-25`): `let entrancePlayed = false` em escopo de módulo sobrevive a navegações client-side e reseta só em hard reload, então exatamente uma página por boot faz o fade ("Linear-style"). Uso: `const entrance = useEntranceOnce()` e `cn(entrance && "page-fade-in")` no header e nos slots de card; o wrapper fica fora do header que o `loading.tsx` repete. `useSkeletonShown` garante que quem pinta primeiro no slot leva o fade e a troca skeleton para card é instantânea. Só opacidade: curto demais para ler como animação, suficiente para o primeiro frame não "estalar".

### Reduced motion

- Idioma: `const reduce = useReduce()` e cada receita devolve `{}` (rise), `shown: true` (figuras), `opacity: 0.5` fixo (névoa) ou o valor final sem tween (ticker). Reduced motion é "estado final desde o primeiro frame", nunca uma versão mais curta.
- Charts caem para `animationType "none"` automaticamente (area-chart.tsx:391-402). `page-fade-in` e os loops CSS (`.fog-layer`, `mat-dash`) têm bloco `@media (prefers-reduced-motion: reduce)`.
- `Spinner` (`animate-spin`), `Skeleton` (`animate-pulse`) e as entradas `animate-in` dos popups não têm gating no Foglamp; um único call site adiciona `motion-reduce:animate-none` (setup-summary.tsx:85). O lume mantém os primitivos verbatim: aplique `motion-reduce:animate-none` no call site quando o spinner ficar visível por mais de um instante (adição do lume). Nada pode ficar escondido esperando `onAnimationComplete`: quem desliga a animação monta pronto.

### Hover, press, focus e cursor

| Estado | Regra praticada | Strings exatas |
|---|---|---|
| Hover | Instantâneo ou só cor: 231 `hover:*`, 105 trocam texto, 102 fundo, 7 opacidade; zero `hover:scale-*`, `hover:translate-*` ou `hover:rotate-*` diretos (content/motion/hover-restraint.mdx: "Instant is the correct default for hover") | `text-muted-foreground hover:text-foreground` (87), `hover:bg-muted` (ghost, outline, linha interativa), `hover:bg-muted/50` (chips), `aria-expanded:bg-muted` (gatilho fica "hovered" com o popup aberto), `hover:opacity-80` (logos) |
| Hover composto | Transform só via grupo (2 usos): chevron do `stat-card` e sublinhado de CTA | `opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 group-hover/stat:translate-x-0 group-hover/stat:opacity-100` (`components/stat-card.tsx:121`); revelar ao passar: `opacity-0 transition-opacity group-hover/bubble:opacity-100` no filho, `group/bubble` no pai |
| Hover de chip | Fundo estala, texto e sombra suavizam | `transition-[color,box-shadow]` exclui `background-color` (`components/context-chip.tsx:13`, `ui/input.tsx:14`) |
| Press | `active:scale-[0.97]` só no Button, via `transition-all` de 150 ms (`ui/button.tsx:10`); anulado em gatilho de popup e chip de filtro; sem press por opacidade | `active:scale-100` (`CHIP_SURFACE`, FilterSelect, `range-picker`); Sidebar usa cor: `active:bg-sidebar-accent/70` |
| Focus | Anel fino, 15 ocorrências; desvio do base-vega (`ring-[3px]`), que sobrevive em `badge.tsx:11`, `tabs.tsx:63`, item, scroll-area e toggle; erro espelha o anel | `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50` + `aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40`; linhas: `data-interactive:focus-visible:ring-[1.5px] data-interactive:focus-visible:ring-inset data-interactive:focus-visible:ring-ring/50` (`ui/table.tsx:170`); itens de menu `focus:bg-accent focus:text-accent-foreground` |
| Cursor | `cursor-pointer` em todo clicável (o Button já traz; `TableRow` via `data-interactive:cursor-pointer`) | `cursor-default` em item de menu e rótulo, `disabled:cursor-not-allowed`, `cursor-help`, `cursor-col-resize`/`cursor-ew-resize` em alça de resize, `cursor-grab` + `active:cursor-grabbing` no brush |

### Receitas canônicas do cap. 19.6 (strings exatas)

| Receita | String |
|---|---|
| Botão primário (`ui/button.tsx:10` base + variant default + size default) | `group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-clip-padding text-sm font-medium whitespace-nowrap transition-all hover:duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5` + `bg-neutral-800 dark:bg-neutral-100 shadow-[var(--custom-shadow-primary)] text-primary-foreground hover:bg-primary/80 dark:hover:bg-primary/90 [&_svg:not([class*='text-'])]:text-neutral-300 dark:[&_svg:not([class*='text-'])]:text-neutral-700` + `h-8 gap-[5.5px] px-3 in-data-[slot=button-group]:rounded-full has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5`; variant outline `shadow-(--custom-outline-shadow) bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-card dark:hover:bg-muted [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-400` |
| Card (`ui/card.tsx:17`) | `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground has-[>img:first-child]:pt-0 data-[size=sm]:gap-2 data-[size=sm]:py-5`; título `font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm`; descrição `text-sm text-muted-foreground text-balance`; conteúdo `px-6 group-data-[size=sm]/card:px-5` |
| Chip / gatilho de filtro (`components/context-chip.tsx:13,20`, sobre `Button variant="outline"`) | `bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`; erro `border-rose-500/40 text-rose-600 dark:text-rose-400 dark:shadow-[0_0_0_1px_rgba(244,63,94,0.4)]` |
| Badge colorido (`ui/badge.tsx:11` + size md + variant emerald) | `group/badge inline-flex w-fit rounded-full shrink-0 items-center justify-center capitalize overflow-hidden font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` + `h-5 px-2 gap-[5px] text-xs has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5 [&_svg:not([class*='size-'])]:size-3!` + `bg-emerald-500/10 text-emerald-700 shadow-[var(--custom-shadow-emerald)] focus-visible:ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:focus-visible:ring-emerald-500/40 [a]:hover:bg-emerald-500/20` |
| Tile de ícone colorido 18 px (`blocks/app-shell/nav.ts`) | `bg-emerald-100 dark:bg-emerald-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-emerald-500 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.14),0_2px_6px_-2px_rgba(16,185,129,0.25)] dark:shadow-(--custom-shadow)` |
| Pílula segmentada (Foglamp, apps/web/src/app/(app)/evals/eval-settings-fields.tsx:171-190) | container `inline-flex w-full rounded-md squircle:rounded-2xl corner-squircle bg-muted p-0.75 dark:bg-muted/50`; opção `relative flex-1 cursor-pointer rounded-md squircle:rounded-xl corner-squircle px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors` + `text-foreground` ativo ou `text-foreground/60 hover:text-foreground`; pílula `absolute inset-0 rounded-md squircle:rounded-xl corner-squircle bg-background shadow-(--custom-shadow) dark:bg-input/50` com `layoutId` e `MORPH` |
| Eyebrow / micro-rótulo / rótulo de stat / texto mudo / mono | `font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground`; `text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60`; `text-xs text-muted-foreground` sobre valor `tabular-nums`; `text-sm text-muted-foreground` (descrições) e `text-xs text-muted-foreground` (metadados), graus `/50`, `/60`, `/70`, `/40`; `font-mono text-xs text-foreground` (chave), `font-mono text-[11px] text-muted-foreground` (ids e paths), `font-mono text-base tracking-widest uppercase` (código de device) |
| Título de página (`components/page-header.tsx`) | `flex items-center gap-2 text-base font-medium tracking-tight` dentro de `flex flex-wrap items-end justify-between gap-4 px-8 h-8`; descrição `text-sm text-muted-foreground` |
| Hover de linha (`ui/table.tsx:167-176`) | `[&_th:last-child]:border-0 border-b dark:border-border/40 border-border/50 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50` + `data-interactive:cursor-pointer data-interactive:hover:bg-muted data-interactive:outline-none data-interactive:focus-visible:bg-muted/50 data-interactive:focus-visible:ring-[1.5px] data-interactive:focus-visible:ring-inset data-interactive:focus-visible:ring-ring/50` + `data-interactive:hover:border-transparent has-[+tr[data-interactive]:not([aria-expanded=true]):hover]:border-transparent`; em listas `divide-y divide-border/40` o item leva `hover:border-transparent hover:bg-muted/50` e o anterior `has-[+a:hover]:border-transparent` |
| Foco (tokens de `ui/button.tsx:10` e `ui/input.tsx:14`) | `outline-none focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40` |
| Input (`ui/input.tsx:14`, sem `file:*`, `focus-visible:*`, `disabled:*`, `aria-invalid:*`) | `h-9 w-full min-w-0 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base hover:dark:border-border/70 transition-[color,box-shadow] outline-none ... placeholder:text-muted-foreground/50 ... md:text-sm dark:bg-input/30` |
| Popup (`ui/context-menu.tsx:58`; menubar, hover-card e combobox trazem o mesmo `shadow-md ring-1 ring-foreground/10`, select usa `ring-[0.5px]`, dropdown-menu e popover trocam o ring por `shadow-(--custom-shadow)`) | `z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md squircle:rounded-2xl corner-squircle bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` |
| Kbd (`ui/kbd.tsx:10`) | `pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 shadow-(--custom-shadow) dark:shadow-none dark:border dark:border-border/50 rounded-sm squircle:rounded-[14px] corner-squircle dark:bg-muted bg-background px-1 font-sans text-xs font-medium text-foreground select-none` |
| Skeleton / placeholder / spinner | `animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted` (`ui/skeleton.tsx:10`); chip `h-8 w-32 animate-pulse rounded-full bg-muted`; `IconLoader` `size-4 animate-spin` com `role="status" aria-label="Loading"` (`ui/spinner.tsx:11`) |
| Entrada de página / revelar ao passar / link textual | `cn(entrance && "page-fade-in")` com `const entrance = useEntranceOnce()`; `opacity-0 transition-opacity group-hover/bubble:opacity-100` no filho, `group/bubble` no pai; `text-muted-foreground transition-colors hover:text-foreground` e ícone `size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground` |
