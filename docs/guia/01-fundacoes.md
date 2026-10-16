# 01. Fundações: tokens, raios, sombras, fontes e dark mode

Origem: mapa cap. 4. Tudo deste capítulo mora em um arquivo: `registry/base-vega/styles/globals.css` (329 linhas), instalado pelo item `base` como o `globals.css` do projeto. É a cópia do `packages/ui/src/styles/globals.css` do Foglamp (333 linhas) com quatro mudanças: fontes via Fontsource em vez de `next/font`, `--font-mono` mapeada, `--sidebar-primary*` e `--custom-shadow-slate` removidos (ninguém os usava), e `html` pintado com `--background`. Nada de spacing, breakpoints, font-size ou easings é customizado no `@theme`: tudo isso é o default do Tailwind v4.

## Tokens de cor

Todos os tokens são `oklch`; os cinzas são `oklch(L 0 0)` e L é a única variável. A coluna "neutral" diz quando o valor é idêntico a um degrau da paleta `neutral` do Tailwind v4, e é por isso que o `FRONTEND.md` só permite `neutral` como cinza cru: é a mesma escala dos tokens. Light em `:root` (globals.css:22-52), dark em `.dark` (globals.css:132-161).

<!-- skill:start -->
| Token | Light | Dark | neutral (light / dark) |
|---|---|---|---|
| `--background` | `oklch(0.99 0 0)` | `oklch(0.17 0 0)` | fora da escala / fora da escala (entre 950 e 900) |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | 950 / 50 |
| `--card`, `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | branco / 900 |
| `--card-foreground`, `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | 950 / 50 |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | 900 / 200 |
| `--primary-foreground` | `oklch(0.98 0 0)` | `oklch(0.205 0 0)` | fora da escala / 900 |
| `--secondary` | `oklch(0.95 0 0)` | `oklch(0.269 0 0)` | fora da escala / 800 |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | 900 / 50 |
| `--muted`, `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | 100 / 800 |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | 500 / 400 |
| `--accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | 900 / 50 |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | red-600 / red-400 (único token cromático) |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | 200 / branco a 10% |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | 200 / branco a 15% |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | 400 / 500 |
| `--chart-1..5` | `0.87`, `0.556`, `0.439`, `0.371`, `0.269` | iguais ao light | 300, 500, 600, 700, 800 (preset neutral do shadcn, não é mudança do Foglamp) |
| `--radius` | `0.625rem` | | 10px |
| `--sidebar` | `oklch(0.975 0 0)` | `oklch(0.145 0 0)` | fora da escala / 950 |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | 950 / 50 |
| `--sidebar-accent` | `oklch(0.95 0 0)` | `oklch(0.269 0 0)` | fora da escala / 800 |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | 900 / 50 |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | 200 / branco a 10% |
| `--sidebar-ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | 400 / 500 |
<!-- skill:end -->

Leitura: no light a página não é branca (0.99), o card é branco (1.0) e a sidebar fica um degrau abaixo da página (0.975); essa diferença de 1 a 2 centésimos de L separa superfícies sem borda. No dark a ordem inverte: sidebar 0.145, página 0.17, card 0.205, e bordas viram branco translúcido. Em relação ao preset `neutral` do shadcn o Foglamp mudou só isto: light `--background` 1 para 0.99, `--secondary` e `--sidebar-accent` 0.97 para 0.95, `--sidebar` 0.985 para 0.975, `--primary-foreground` 0.985 para 0.98; dark `--background` 0.145 para 0.17 e `--sidebar` 0.205 para 0.145. Cada `--x` vira `--color-x` em `@theme inline` (globals.css:232-260), o que gera `bg-x`, `text-x`, `border-x`, `ring-x`, `shadow-x`.

Uso na prática: `muted-foreground` é o token mais usado (591 ocorrências no Foglamp), quase sempre com opacidade (`text-muted-foreground/50` para placeholder e meta, `/60`, `/70`); `bg-muted/50` é o fundo de hover e de chip; `border-border/40` e `/50` as divisórias; `ring-ring/50` o foco; `destructive` entra quase sempre a 10% ou 20% de fundo. `chart-1..5` nunca aparecem como classe, só em JS (`var(--chart-2)`). Pareamento light/dark da paleta crua: fundo `-100` / `-950` com texto `-500` (tiles), texto `-600` / `-400` (`text-red-600 dark:text-red-400`), badges `bg-{c}-500/10 text-{c}-700 dark:bg-{c}-500/15 dark:text-{c}-300`.

## Raios e squircle

`--radius: 0.625rem` (globals.css:46) e os derivados em `@theme inline` (globals.css:261-267). `rounded` sozinho (4px) e `rounded-xs` (2px) não vêm do `--radius`: são valores do próprio Tailwind.

<!-- skill:start -->
| Utility | Definição | px | Tailwind default |
|---|---|---|---|
| `rounded-xs` | não redefinido | 2 | 2 |
| `rounded` | não redefinido (literal) | 4 | 4 |
| `rounded-sm` | `calc(var(--radius) - 4px)` | 6 | 4 |
| `rounded-md` | `calc(var(--radius) - 2px)` | 8 | 6 |
| `rounded-lg` | `var(--radius)` | 10 | 8 |
| `rounded-xl` | `calc(var(--radius) + 4px)` | 14 | 12 |
| `rounded-2xl` | `calc(var(--radius) + 8px)` | 18 | 16 |
| `rounded-3xl` | `calc(var(--radius) + 12px)` | 22 | 24 |
| `rounded-4xl` | `calc(var(--radius) + 16px)` | 26 | 32 |
| `rounded-full` | `calc(infinity * 1px)` | pílula | |

Squircle: `@custom-variant squircle (@supports (corner-shape: squircle))` (globals.css:18) mais `@plugin "@toolwind/corner-shape"` (globals.css:11). No mesmo raio um squircle lê menos redondo que o arco circular, então o raio sobe dois ou três degraus só onde `corner-shape` existe (Chromium); Safari e Firefox ficam com o raio circular menor. `corner-squircle` acompanha sempre, porque `corner-shape` não é herdado. Pares canônicos:

| Par | Fallback | Squircle | Onde |
|---|---|---|---|
| `rounded-md squircle:rounded-2xl corner-squircle` | 8px | 18px | Input, Select (trigger e content), Skeleton, Toggle, Tooltip, DropdownMenu, HoverCard, lista de Tabs |
| `rounded-md squircle:rounded-xl corner-squircle` | 8px | 14px | Textarea, InputGroup, gatilho de Tabs, `SidebarMenuButton` |
| `rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle` | 5px | 14px | tiles de ícone da navegação e dos chips de tipo |
| `rounded-lg squircle:rounded-3xl corner-squircle` | 10px | 22px | Card, Popover, Alert, `SidebarInset` |
| `rounded-xl squircle:rounded-4xl corner-squircle` | 14px | 26px | Empty |
| `rounded-2xl squircle:rounded-[40px] corner-squircle` | 18px | 40px | Dialog, AlertDialog, Sheet `floating` |
| `rounded-sm squircle:rounded-[14px] corner-squircle` | 6px | 14px | Kbd |
| `rounded-full squircle:rounded-full` | pílula | pílula | pílula que precisa anular um `squircle:rounded-*` herdado (Skeleton redondo) |
| `rounded-[calc(var(--radius)-5px)]` | 5px | 5px | addons e botões dentro do InputGroup: raio interno = raio externo menos o inset (nested border radius) |

Escape `corner-round!` só em dois casos: dentro de um BorderBeam (que recorta com `clip-path: inset(round)`, arco circular) e nas pontas de uma pílula `rounded-full` onde o squircle achata (busca da DataTable). Dentro do Card a imagem de capa repete raio e shape (`*:[img:first-child]:rounded-t-3xl *:[img:first-child]:corner-squircle`, `registry/base-vega/ui/card.tsx:17`).
<!-- skill:end -->

## Sombras no lugar de borda

A ideia (craft, "Shadows, Not Borders"): um anel de meio pixel a 6% faz o papel da borda sem ocupar espaço, uma camada de contato escurece logo abaixo e uma camada ambiente sugere luz de cima; nenhuma camada passa de 6% no light. No dark "a aresta vem de luz, não de sombra": anel inset branco por dentro e um bevel claro no topo. São 17 tokens por tema (globals.css:53-130 light, 162-224 dark); o Foglamp tinha 18, o `-slate` saiu.

<!-- skill:start -->
| Token | Light | Dark | Quem usa |
|---|---|---|---|
| `--custom-shadow` | `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)` | `inset 0 .75px 0 0 rgba(255,255,255,.03), inset 0 0 0 .75px rgba(255,255,255,.03), 0 0 0 .75px rgba(0,0,0,.1), 0 2px 2px 0 rgba(0,0,0,.1), 0 4px 4px 0 rgba(0,0,0,.1), 0 8px 8px 0 rgba(0,0,0,.1)` | Card, Popover, Tooltip, Dropdown, Dialog, Alert, Input, Kbd, Avatar, `SidebarInset`, Tabs ativo |
| `--custom-shadow-chrome` | hairline 9%, cast para cima `0 -1px 4px` 4%, cast 6%, drop `4px 8px -2px` 6%, drop `12px 24px -6px` 8% | igual ao base com inner ring a 6% | moldura da demo na landing |
| `--custom-shadow-lifted` | hairline 8%, cast 6%, drop `6px 12px -4px` 10%, drop `16px 32px -8px` 16% | bevel 6%, inner 5%, outer 30%, drops `4px 8px` 25%, `12px 24px` 35%, `24px 48px -8px` 40% | card flutuando sobre outros (figuras de marketing) |
| `--custom-shadow-primary` | `0 0 0 0.5px rgba(0,0,0,.6), 0 .5px 2px -.5px rgba(0,0,0,.4), 0 2px 4px 0 rgba(0,0,0,.18)` | `inset 0 .5px 0 0 rgba(255,255,255,.45), 0 0 0 .5px rgba(255,255,255,.55), 0 .5px 2px 0 rgba(0,0,0,.5)` | Button e Badge `default` |
| `--custom-shadow-secondary` | `0 0 0 0.5px rgba(0,0,0,.08), 0 .5px 2px -.5px rgba(0,0,0,.08), 0 2px 4px 0 rgba(0,0,0,.05)` | `inset 0 .5px 0 0 rgba(255,255,255,.04), 0 0 0 .5px rgba(255,255,255,.08), 0 .5px 2px 0 rgba(0,0,0,.25)` | Button e Badge `secondary` |
| `--custom-outline-shadow` | `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 2px 4px 0 rgba(0,0,0,.04)` | `inset 0 .5px 0 0 rgba(255,255,255,.05), inset 0 0 0 .5px rgba(255,255,255,.045), 0 0 0 .5px rgba(0,0,0,.14), 0 .5px 2px -.5px rgba(0,0,0,.14), 0 2px 4px 0 rgba(0,0,0,.08)` | Button `outline`, chips de toolbar |
| `--custom-shadow-destructive` | fórmula colorida com `244,63,94` | fórmula colorida dark | Button e Badge `destructive` |
| `--custom-shadow-{green,blue,amber,orange,emerald,rose,red,violet,fuchsia,sky}` | fórmula colorida | fórmula colorida dark | Badge da cor correspondente |

Fórmula dos coloridos (troque o rgb para criar um matiz novo): light `0 0 0 0.5px rgba(c,0.25), 0 0.5px 2px -0.5px rgba(c,0.18), 0 2px 4px 0 rgba(c,0.12)`; dark `inset 0 0.5px 0 0 rgba(c,0.03), 0 0 0 0.5px rgba(c,0.18), 0 0.5px 2px 0 rgba(c,0.1)`. Os rgb são os `*-500` da paleta Tailwind v3: green `34,197,94`, blue `59,130,246`, amber `245,158,11`, orange `249,115,22`, emerald `16,185,129`, rose `244,63,94`, red `239,68,68`, violet `139,92,246`, fuchsia `217,70,239`, sky `14,165,233`. O `--custom-shadow-destructive` é calculado sobre rose-500, não sobre `--destructive`: mudar o token de cor não muda a sombra.

Sintaxes equivalentes: `shadow-(--custom-shadow)` e `shadow-[var(--custom-shadow-green)]` compilam para o mesmo CSS. Hairline colorida inline dos tiles (ainda sem token): `shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`.
<!-- skill:end -->

Dark mode nos controles de formulário: o token é desligado e substituído por uma linha translúcida. Padrão literal de `registry/base-vega/ui/input.tsx:14`: `shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50` + `hover:dark:border-border/70` + `dark:bg-input/30`. A borda de 0.5px só está em Input, Select trigger e InputGroup; Textarea, Toggle, Kbd, NativeSelect e Empty usam `dark:border` (1px) com o mesmo `/50`. Botões seguem outro caminho: continuam em sombra no dark, com `--custom-outline-shadow` e `--custom-shadow-secondary` redefinidos para a versão com bevel claro (globals.css:180-193).

## Onde a borda vale

A regra escrita é absoluta, a prática não. O próprio craft abre a exceção: "inputs, table rows and dividers want a plain line, because they are not surfaces". `* { border-color: var(--border) }` do `@layer base` é o que faz `border` sozinho sair na cor certa.

<!-- skill:start -->
| Aceito | Classe | Onde |
|---|---|---|
| Linha de tabela | `border-b border-border/50 dark:border-border/40` | `registry/base-vega/ui/table.tsx:169`; footer e caption idem (lume trocou os hex) |
| Divisor interno de painel | `border-b border-border/40`, nunca na última seção | telas de detalhe ([05-telas-de-detalhe](./05-telas-de-detalhe.md)) |
| Lista | `divide-y divide-border/40` | listas densas, HoverCard de versões |
| Separador | `Separator` = `bg-border/70`, com `dark:bg-border/40` em dialogs | `registry/base-vega/ui/separator.tsx:19` |
| Estado vazio | `border-dashed border dark:border-border/50` | `registry/base-vega/ui/empty.tsx:12` |
| Input no dark | `dark:shadow-none dark:border-[0.5px] dark:border-border/50` | campos, ver acima |
| Hairline de marketing | `border-b border-border/50` a `/70` | navbar, footer, FAQ ([12-marketing](./12-marketing.md)) |
| Header mobile do shell | `border-b border-border/50` | `app-shell` (adição do lume) |

**Never** `border` a 100% fechando uma caixa dentro do app; **Never** `ring-1 ring-foreground/10` como aresta de superfície (é o resto do shadcn que o Foglamp não retocou em Select, HoverCard e Combobox).
<!-- skill:end -->

## Fontes

| Fonte | Como entra | Variável | Utility | Uso |
|---|---|---|---|---|
| Inter Variable (com eixo `opsz`) | `@import "@fontsource-variable/inter/opsz.css"` (globals.css:9), dependência do `base` | `--font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif` (globals.css:227) | `font-sans`, aplicado em `html` e `body` | tudo no app |
| Geist Mono Variable | `@import "@fontsource-variable/geist-mono"` (globals.css:10) | `--font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` (globals.css:228) (adição do lume) | `font-mono` | ids, payloads, código; nunca número de tabela |
| Inter como heading | `--font-heading: "Inter Variable", ...` (globals.css:231) | | `font-heading` nos títulos de Card, Dialog, Sheet, Empty (`font-medium`) | igual a `font-sans`; hook do style base-vega |
| Host Grotesk Variable | item `font-display`: `@fontsource-variable/host-grotesk` + `--font-display` em `@theme inline` | `--font-display` | `font-display` | só marketing e títulos do site: `font-display text-3xl font-[450] tracking-tight text-balance sm:text-4xl` |

Por que Fontsource: `registry:font` do shadcn só aceita Google e woff2 não passa pela registry; Fontsource é self-hosted, funciona em Next e Vite e mantém o `opsz` (o build do Google Fonts da Inter é antigo e sem features, motivo pelo qual o Foglamp usa `next/font/local`). A alternativa com `next/font/local` e os woff2 de rsms/inter está em `docs/adocao/next-novo.md`. No Foglamp o `--font-mono` nunca é mapeado e `font-mono` computa `ui-monospace`; o lume corrige.

Regras tipográficas praticadas: `antialiased` no `body` (no `layout.tsx`, não no CSS); `text-sm` e `text-xs` dominam o app; `font-medium` é o peso máximo; `tabular-nums` em todo número (162 ocorrências; `TableCell align="right"` injeta `text-right tabular-nums`); `font-sans` explícito para voltar à sans dentro de contexto mono. Opt-in fora do `base` (adição do lume, vem do painel do lyx-pr-agent): `body { font-feature-settings: "cv11", "ss01"; }` muda a cara em relação ao foglamp.dev, por isso não vem por padrão.

## `@layer base`

| Regra (globals.css:281-328) | Valor | Por quê |
|---|---|---|
| `* { @apply border-border outline-ring/50; }` | toda borda nasce em `--border`, todo outline em `--ring` a 50% | padrão shadcn v4 |
| `html { @apply font-sans bg-background; }` | (adição do lume) | conceito HTML Background do craft: overscroll e área fora do `body` ficam da cor da página |
| `body { @apply font-sans bg-background text-foreground selection:bg-primary/10; }` | seleção em `--primary` a 10% | cinza no light, branco translúcido no dark |
| `* { scrollbar-width: thin; scrollbar-color: color-mix(in oklab, var(--muted-foreground) 35%, transparent) transparent; }` | barra fina sem trilho | a barra padrão "come" layouts de tabela e painel |
| autofill (`input:-webkit-autofill` e irmãos) | `-webkit-text-fill-color: var(--foreground); caret-color: var(--foreground); transition: background-color 999999s ease-in-out 0s !important;` | WebKit pinta um fundo azul que não dá para sobrescrever; o `!important` é porque o `transition-[color,box-shadow]` do Input (camada utilities) venceria o `@layer base` |
| `--animate-shimmer: shimmer 4s linear infinite` + `@keyframes shimmer` (globals.css:269-279) | `background-position` de `200% center` a `-200% center` | usado pelo `loader` (TextShimmerLoader) |

Fora do `base`, no `globals.css` do site: `.shiki` dual theme (instalado junto com `code-block`), `page-fade-in` (instalado por `use-entrance-once`) e `--font-display` (item `font-display`).

## Dark mode

`@custom-variant dark (&:is(.dark *))` (globals.css:20): a classe `.dark` vai no `<html>`, daí o `suppressHydrationWarning`. Provider: `theme-provider` (next-themes, `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>`), ou `theme-provider-csp` (mesma API `useTheme()`, sem script inline, com `public/theme.js`) para CSP estrita. Quem visita pela primeira vez vê o app escuro; "System" continua selecionável. Controles: `theme-switcher` (pílula segmentada com `motion.span layoutId` e spring `{ stiffness: 400, damping: 38 }`, rastreia `theme` e não `resolvedTheme`) e o submenu de tema no menu do usuário do `app-shell`. Padrões `dark:` mais comuns no Foglamp: `dark:shadow-(--custom-shadow)` (trocando a hairline inline colorida pelo token), `dark:hover:bg-muted`, `dark:shadow-none`, `dark:border-border/50`, `dark:bg-input/30`, `dark:text-{cor}-400`.

## O que não copiar

`--sidebar-primary` e `--sidebar-primary-foreground` (azul no dark, zero usos), `--custom-shadow-slate` (zero usos e paleta proibida), `@source` apontando para `apps/**` (o `init` do shadcn cuida dos paths), `@import "tailwindcss"` e `@custom-variant dark` dentro do item `base` (o `init` já escreve os dois; o arquivo do repo os tem porque o site do lume o importa direto), `.border-overlay` e `light:border-overlay` (variante inexistente), keyframes `poster-*` (CSS morto), o comentário "same as --custom-shadow in light" do outline (a terceira camada difere: `2px 4px` contra `1px 4px`), e a Inter por `next/font/google`.
