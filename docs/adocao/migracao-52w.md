# Migrar um front 52W (Lyx) para o lume

Origem: plano do lume (seções `docs/adocao` e Camada Lyx), `FRONTEND.md` e os repos `lyx-front-template` (origem dos clones) e `lyx-hub-front`. Os fronts da Lyx hoje: Next 16 App Router com `src/`, Tailwind 4, shadcn new-york sobre Radix (`radix-ui` + `@radix-ui/react-*`), Lucide, tokens próprios da paleta 52W em `src/app/globals.css` (`--bg-primary`, `--text-primary`, `--accent: #025864`, `--shadow-sm`...) mapeados para os nomes do shadcn num `@theme inline`, classes utilitárias próprias (`.lyx-card`, `.btn`, `.btn-primary`, `.hub-card`, `.page-header`, `.sidebar`...), dark mode por `[data-theme='dark']` setado à mão em `src/app/dashboard/layout.tsx`, e Inter + Geist Mono por `next/font/google`. React Hook Form + Zod continuam: o lume não troca a lib de formulário, só o campo.

Oito passos, cada um com o comando que prova que acabou. Uma rota por PR a partir do passo 7. Faça primeiro no `lyx-front-template`: os outros fronts são clones dele e herdam o caminho.

## Inventário de hoje (16/10/2026)

<!-- skill:start -->
| Front | `.tsx` | arquivos com `lucide-react` | `asChild` | `style={{` | linhas de CSS | `data-theme` | `components.json` | Esforço |
|---|---|---|---|---|---|---|---|---|
| `lyx-front-template` | 23 | 8 | 7 | 77 | 581 | 3 | não | médio-baixo, 1 a 2 dias |
| `lyx-hub-front` | 78 | 27 | 9 | 236 | 910 (7 classes `.hub-*`) | 3 | não | alto, 2 a 3 semanas |
| `lyx-contratos-front` | 80 | 23 | 33 | 11 | 268 | 0 | sim (new-york, lucide, sem 52W) | médio |
| `lyx-analise-credito-front` | 44 | 12 | 7 | 192 | 687 | 14 (11 em spec) | não | médio-baixo |
| `lyx-planejamento-front` | 35 | 10 | 7 | 79 | 581 | 3 | não | médio-baixo |
| `lyx-qualidade-front` | 105 | 58 | 23 | 6 | 946 (DS próprio, tokens em português) | 3 | não | alto |
| `lyx-bi-principal` | 497 | 146 | 16 | 558 | 981 | 1 | não | fora deste plano |

Comandos do inventário (rode no seu front antes de começar e guarde os números no PR): `find src -name '*.tsx' | wc -l`, `grep -rl lucide-react src | wc -l`, `grep -rn asChild src | wc -l`, `grep -rn 'style={{' src | wc -l`, `cat src/app/globals.css | wc -l`, `grep -rn data-theme src | wc -l`.
<!-- skill:end -->

Ordem recomendada: `lyx-front-template`, depois `lyx-analise-credito-front` e `lyx-planejamento-front` (quase iguais ao template), depois `lyx-contratos-front`, depois `lyx-hub-front` (236 `style={{` e os blocos `.hub-*`, que viram `lyx-shell` na camada Lyx). `lyx-qualidade-front` tem um DS próprio com regras que o lume compartilha (peso máximo, cor em quatro lugares) e merece um plano à parte. `lyx-bi-principal` fica fora.

## Passo 1: `components.json` e dependências

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

Num front que já tem `src/app/globals.css` o `init` escreve o `components.json` (style `base-vega`, `iconLibrary tabler`, `tailwind.css "src/app/globals.css"`, aliases `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`), reescreve `src/lib/utils.ts` (mesma assinatura de `cn`, nada quebra) e injeta tokens, `@import`, `@plugin` e `@custom-variant` no CSS existente. Sempre `-y`, nunca `-d` (o `-d` instala o style padrão por cima). O `lyx-contratos-front` já tem um `components.json` new-york: apague antes, senão o `init` pergunta se sobrescreve.

Depois, em comando separado (para o tema vencer o `base`), o tema da Lyx e o alias privado: ver [camada-lyx](./camada-lyx.md). Dependências novas chegam sozinhas (`@base-ui/react`, `@tabler/icons-react`, `@toolwind/corner-shape`, `@fontsource-variable/*`, `tw-animate-css` já existe). As antigas saem só no passo 8.

Conferir: `cat components.json | grep -c '"style": "base-vega"'` dá 1; `grep -c "@plugin \"@toolwind/corner-shape\"" src/app/globals.css` dá 1; `npm run typecheck` passa.

## Passo 2: `globals.css`, o que fica e o que sai

O `init` acrescenta; não apaga. O arquivo agora tem dois sistemas de tokens e o segundo (lume) precisa vencer:

- Apague o `@theme inline` da 52W (linhas 79 a 110 do template): ele mapeia `--color-primary: var(--accent)`, `--color-ring: var(--accent)`, `--color-chart-1: var(--accent)`, `--font-sans: var(--font-inter)`, `--font-mono: ui-monospace` e `--radius-*` próprios, tudo por cima do lume. Os componentes da registry leem `bg-primary`, `ring-ring`, `font-mono` e esperam os valores do Foglamp.
- Apague o `@layer base` da 52W (linhas 115 a 128: `border-color: var(--border)`, `body { font-family; background; color; line-height: 1.5 }`) e a scrollbar `::-webkit-scrollbar` (133 a 136): o `base` já traz `@layer base` com `border-border outline-ring/50`, `html, body` em `font-sans bg-background` e scrollbar fina por `scrollbar-width: thin`.
- Mantenha, por enquanto, o `:root` e o `[data-theme='dark']` da 52W (linhas 6 a 74) e todas as classes utilitárias (`.app-shell`, `.sidebar`, `.page-header`, `.btn*`, `.lyx-card`, `.lyx-table`, `.form-*`, `.stat-card`, `.hub-*`...). Elas continuam renderizando as telas que ainda não migraram.

Conferir: `grep -c "@theme inline" src/app/globals.css` dá 1 (o do lume), `grep -c "@layer base" src/app/globals.css` dá 1, `grep -c "::-webkit-scrollbar" src/app/globals.css` dá 0, e `npm run dev`: a tela de login antiga abre igual.

## Passo 3: camada de aliases temporária

Em vez de reescrever 581 linhas de CSS legado agora, redirecione os tokens da 52W para os do lume. Troque os valores dentro do `:root` e do `[data-theme='dark']` da 52W por aliases (ou substitua os dois blocos por um só, sem a cópia dark), e apague a cópia dark da 52W: o lume já flipa os valores por `.dark`.

<!-- skill:start -->
```css
/* Aliases 52W -> lume. Temporário: sai no passo 8, junto com as classes .btn/.lyx-card/.hub-*. */
:root {
  --bg-primary: var(--background);
  --bg-secondary: var(--sidebar);
  --bg-card: var(--card);
  --bg-card-hover: var(--accent);
  --bg-input: var(--input);
  --border-focus: var(--ring);
  --accent-hover: var(--brand);
  --accent-light: color-mix(in oklab, var(--brand) 8%, transparent);
  --accent-glow: color-mix(in oklab, var(--brand) 15%, transparent);
  --text-primary: var(--foreground);
  --text-secondary: color-mix(in oklab, var(--foreground) 60%, var(--muted-foreground));
  --text-muted: var(--muted-foreground);
  --success: var(--color-emerald-500);
  --warning: var(--color-amber-500);
  --danger: var(--destructive);
  --shadow-sm: var(--custom-shadow);
  --shadow-md: var(--custom-shadow);
  --shadow-lg: var(--custom-shadow-lifted);
  --shadow-accent: var(--custom-shadow-brand);
  --glass-bg: color-mix(in oklab, var(--background) 85%, transparent);
  --glass-border: var(--border);
  --sidebar-width: 260px; /* só o .sidebar legado lê isto; o Sidebar do lume fixa 14rem inline */
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

Dois nomes colidem e não podem virar alias:

- `--accent`: na 52W é o teal (`#025864`); no lume é a superfície de hover (`oklch(0.97 0 0)`, `bg-accent`). Não redefina. Troque nas classes legadas com `sed -i '' 's/var(--accent)/var(--brand)/g' src/app/globals.css` (o `--brand` vem do `theme-lyx`) e confira que nenhum `var(--accent)` sobrou fora do `@theme inline` do lume.
- `--border` e `--radius`: têm o mesmo nome nos dois sistemas e o valor do lume (`oklch(0.922 0 0)`, `0.625rem`) vale para os dois. Apague as linhas da 52W.
<!-- skill:end -->

Conferir: `grep -c "var(--accent)" src/app/globals.css` dá 1 (só `--color-accent: var(--accent)` do lume); `grep -n "#025864\|#03A698\|#141414" src/app/globals.css` não devolve nada (as cores vivem no `theme-lyx`); as telas antigas abrem nos dois temas sem fundo branco puro no dark (`--background` dark é `oklch(0.17 0 0)`).

## Passo 4: dark mode de `data-theme` para `.dark`

O template seta `document.documentElement.setAttribute("data-theme", ...)` em `src/app/dashboard/layout.tsx:48-61` e lê `localStorage.theme`; o `theme-toggle.tsx` faz `classList.toggle("dark")` por conta própria. Vira um provider só:

```bash
npx shadcn@latest add joaodadas/lume/theme-provider#v0.1.0 joaodadas/lume/theme-switcher#v0.1.0
```

- `src/components/providers.tsx`: envolva o `QueryClientProvider` com `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>`; o `<html>` já tem `suppressHydrationWarning`.
- `src/app/dashboard/layout.tsx`: apague o `useState` de `theme`, os dois `useEffect`/`toggleTheme` com `setAttribute`, e troque o botão Sol/Lua por `const { resolvedTheme, setTheme } = useTheme()` de `next-themes` (ou pelo `ThemeSubmenu` do `theme-switcher` quando o shell virar `lyx-shell`).
- `src/components/theme-toggle.tsx`: apague; o `ThemeSwitcher` substitui.
- `src/app/globals.css`: `sed -i '' "s/\[data-theme='dark'\]/.dark/g" src/app/globals.css` nas classes legadas que ainda tiverem seletor próprio.
- Specs que fazem `document.documentElement.getAttribute('data-theme')` (14 ocorrências no `lyx-analise-credito-front`) passam a conferir `classList.contains('dark')`.

Conferir: `grep -rn "data-theme" src | wc -l` dá 0; `grep -rn "localStorage.getItem(\"theme\")" src | wc -l` dá 0; no browser, primeira visita abre escura e o toggle persiste em `localStorage.theme` (chave do next-themes).

## Passo 5: fontes

O `base` já importa `@fontsource-variable/inter/opsz.css` e `@fontsource-variable/geist-mono` e mapeia `--font-sans` e `--font-mono`. Em `src/app/layout.tsx:2-14` apague `Inter` e `Geist_Mono` de `next/font/google`, as constantes `inter`/`geistMono` e as classes `${inter.variable} ${geistMono.variable}` do `<body>`; ponha `className="font-sans"` no `<html>` e deixe `antialiased` no `<body>`. Em `globals.css`, `var(--font-inter)` já saiu com o `@theme inline` do passo 2.

Conferir: `grep -rn "next/font\|--font-inter\|--font-geist" src | wc -l` dá 0; no DevTools, `document.fonts` lista "Inter Variable" e "Geist Mono Variable", e um `font-mono` computa Geist Mono (o Foglamp original nem isso fazia).

## Passo 6: primitivos Radix para Base UI

Não porte os arquivos: substitua. Os 15 de `src/components/ui/` (`badge`, `button`, `card`, `dialog`, `input`, `label`, `popover`, `scroll-area`, `select`, `separator`, `sidebar`, `skeleton`, `table`, `textarea`; `lyx-logo.tsx` vai para a camada Lyx):

```bash
npx shadcn@latest add joaodadas/lume/kit-formulario#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/card#v0.1.0 joaodadas/lume/table#v0.1.0 joaodadas/lume/sidebar#v0.1.0 joaodadas/lume/scroll-area#v0.1.0 joaodadas/lume/separator#v0.1.0 joaodadas/lume/badge#v0.1.0 joaodadas/lume/button#v0.1.0 --overwrite
```

`--overwrite` é obrigatório: os arquivos existem. Depois corrija o código do app que tocava na API do Radix:

<!-- skill:start -->
| Radix (new-york) | Base UI (lume) | Onde confere |
|---|---|---|
| `<Button asChild><Link href="/x">...</Link></Button>` | `<Button render={<Link href="/x" />}>...</Button>` | `registry/base-vega/ui/button.tsx:66-69` (`nativeButton` cai para `false` quando há `render`) |
| `<Badge asChild>` | `<Badge render={<a href />}>` (`useRender`) | `registry/base-vega/ui/badge.tsx:57-78` |
| `data-[state=open]:` / `data-[state=closed]:` | `data-open:` / `data-closed:` | `registry/base-vega/ui/dialog.tsx`, `dropdown-menu.tsx`, `select.tsx` |
| `data-[state=active]:` (tabs) | `data-active:` | `registry/base-vega/ui/tabs.tsx` |
| `data-[disabled]:` | `data-disabled:` | `registry/base-vega/ui/dropdown-menu.tsx` |
| `origin-(--radix-popover-content-transform-origin)` | `origin-(--transform-origin)` | `registry/base-vega/ui/select.tsx` |
| `max-h-(--radix-select-content-available-height)` | `max-h-(--available-height)` | `registry/base-vega/ui/select.tsx` |
| `data-[state=selected]:bg-muted` (linha de tabela) | igual, continua | `registry/base-vega/ui/table.tsx:169` |
| Linha clicável com `hover:bg-muted/50` sempre | `<TableRow interactive>` (`data-interactive:hover`, `data-interactive:focus-visible`, `tabIndex 0`) | `registry/base-vega/ui/table.tsx` |
| `size="sm"` do botão `h-8` / `default` `h-9` | `default` já é `h-8`; `sm` é `h-7`; `xs` é `h-6` | `registry/base-vega/ui/button.tsx` |
| `variant="destructive"` para apagar em menu | `variant="ghost-destructive"` | `registry/base-vega/ui/button.tsx` |
| `rounded-md` nos botões | pílula `rounded-full` já no primitivo; não acrescente raio por `className` | `registry/base-vega/ui/button.tsx` |
<!-- skill:end -->

Conferir: `grep -rn "asChild" src | wc -l` dá 0; `grep -rn "data-\[state=" src --include=*.tsx | grep -v "data-\[state=selected\]" | wc -l` dá 0; `grep -rn "radix" src | wc -l` dá 0; `npm run typecheck` e `npm run lint` passam (o lint da Lyx bloqueia arquivo acima de 500 linhas: `sidebar.tsx` da registry tem mais que isso, então adicione `src/components/ui/**` ao `ignores` do ESLint, como já se faz com código gerado).

## Passo 7: ícones, por arquivo, e as telas uma rota por PR

Lucide sai, Tabler entra, arquivo por arquivo (`grep -rl lucide-react src` dá a lista). Tabler usa classe para tamanho (`className="size-4"`, nunca `size={16} strokeWidth={1.75}`) e tem variante `Filled` para a maioria; a regra do lume é filled quando existe, par outline/filled na nav. Os 40 mais usados nos seis fronts da Lyx hoje (contagem de imports):

<!-- skill:start -->
| Lucide | Tabler | Lucide | Tabler |
|---|---|---|---|
| `X`, `XIcon` | `IconX` | `Pencil` | `IconPencil` |
| `ChevronRight` | `IconChevronRight` | `Info` | `IconInfoCircleFilled` |
| `TriangleAlert`, `AlertTriangle` | `IconAlertTriangleFilled` | `ChevronDown`, `ChevronDownIcon` | `IconChevronDown` |
| `Search` | `IconSearch` | `Bell` | `IconBellFilled` |
| `ShieldCheck` | `IconShieldCheckFilled` | `ArrowRight` | `IconArrowRight` |
| `Plus` | `IconPlus` | `Upload` | `IconUpload` |
| `Lock` | `IconLockFilled` | `Layers` | `IconStack2Filled` |
| `CheckCircle2`, `CheckCircle`, `CircleCheck` | `IconCircleCheckFilled` | `Ban` | `IconBan` |
| `Sun` | `IconSun` | `Settings` | `IconSettingsFilled` |
| `Moon` | `IconMoon` | `Save` | `IconDeviceFloppy` |
| `FileText` | `IconFileTextFilled` | `Loader2` | `IconLoader` (o `Spinner` da registry já usa) |
| `CheckIcon`, `Check` | `IconCheck` | `FlaskConical` | `IconFlaskFilled` |
| `XCircle` | `IconCircleXFilled` | `EyeOff` / `Eye` | `IconEyeOff` / `IconEye` |
| `Trash2` | `IconTrashFilled` | `Clock` | `IconClockFilled` |
| `type LucideIcon` | `type Icon` (`import type { Icon } from "@tabler/icons-react"`) | `Building2` | `IconBuilding` |
| `Users` | `IconUsers` (nav: `IconUsers` / `IconUsersGroup`) | `UserPlus` | `IconUserPlus` |
| `LogOut` | `IconLogout` | `Truck` | `IconTruckFilled` |
| `LayoutDashboard` | `IconLayoutDashboard` / `IconLayoutDashboardFilled` | `ShieldAlert` | `IconShieldExclamation` |
| `ChevronUpIcon` | `IconChevronUp` | `Settings2` | `IconAdjustments` |
| `ChevronLeft` | `IconChevronLeft` | `Send` | `IconSend` |
| `ArrowLeft` | `IconArrowLeft` | `RotateCcw` / `RefreshCw` | `IconArrowBackUp` / `IconRefresh` |
| `MoreHorizontal` | `IconDots` | `Mail` | `IconMailFilled` |
| `Cpu` / `Brain` | `IconCpu` / `IconBrain` | `BarChart3` | `IconChartBar` |
| `ArrowUpRight` | `IconArrowUpRight` | `ChevronsUpDown` | `IconSelector` (o `SelectTrigger` da registry já usa) |
| `Paperclip` | `IconPaperclip` | `Package2` | `IconPackage` |
<!-- skill:end -->

Todos os nomes acima existem em `@tabler/icons-react` 3.49.0 (conferido). Nome fora da tabela: procure em tabler.io/icons; se não houver `Filled`, use o outline nos dois campos do `NavItem` (o `NavIcon` renderiza um glifo só).

Telas: uma rota por PR, na ordem login, layout do dashboard, páginas. O layout do dashboard (`src/app/dashboard/layout.tsx`, 259 linhas com `.app-shell`, `.sidebar` e 29 `style={{`) vira o `lyx-shell` da camada Lyx (ou o `app-shell` do lume com `brand={<LyxLogo />}`), com `pathname={usePathname()}` e `user` da sessão do Better Auth; o login vira `lyx-login`. Em cada página: `PageHeader` no lugar de `.page-header`, `StatGrid` + `StatCard` no lugar de `.stat-card`, `Card size="sm"` no lugar de `.lyx-card`, `Button` no lugar de `.btn*`, `DataTable` ou `Table` no lugar de `.lyx-table`, `Field` + `Input` no lugar de `.form-group/.form-input` (React Hook Form continua, só o campo muda), `EmptyState`, `useDelayedLoading(loading, 700)` antes de qualquer skeleton, e zero `style={{`.

Conferir por PR: `grep -c "lucide-react" <arquivos da rota>` dá 0; `grep -c 'style={{' <arquivos da rota>` dá 0; `grep -c '"lyx-card\|"btn\|"hub-\|"page-header\|"stat-card' <arquivos da rota>` dá 0; capturas light e dark em 1440 e 390 no PR (checklist do `CONTRIBUTING.md` do lume). Conferir no fim: `grep -rl lucide-react src | wc -l` dá 0 e `grep -rn 'style={{' src | wc -l` dá 0.

## Passo 8: remoção final

Quando nenhuma tela usa classe legada:

```bash
grep -rn "lyx-card\|btn-primary\|btn-ghost\|hub-card\|page-header\|stat-card\|form-input\|app-shell\|main-content" src --include=*.tsx | wc -l   # tem que dar 0 antes de seguir
npm uninstall lucide-react radix-ui @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs
```

Apague do `globals.css` a camada de aliases do passo 3 e todas as classes da 52W; o arquivo fica só com o que o `base` e o `theme-lyx` escreveram (cerca de 330 linhas). Atualize o `AGENTS.md` do front (linhas 13, 27 e 68 do template e do hub: "Lyx Design System v2" vira "lume + theme-lyx"; "Radix UI primitives + Lucide" vira "base-vega sobre Base UI + Tabler"; "re-gerar via `npx shadcn add`" vira "`npx shadcn@latest add joaodadas/lume/<item>#vX.Y.Z --overwrite`") e rode `npm run sync-agents`. Instale a skill: `npx skills add joaodadas/lume --skill lume-design-engineering`.

Conferir: `grep -c "" src/app/globals.css` abaixo de 400; `grep -rn "lucide\|radix" package.json src | wc -l` dá 0; `npm run audit:all` passa (lint, typecheck, deps:check, cobertura, relatório).

## O que não copiar

Do template 52W para o lume: a `.page-header` com `border-bottom` e `backdrop-filter` (o `PageHeader` do lume não tem borda nem glass), a `.sidebar` com `border-right` (o `Sidebar variant="inset"` não tem borda, o inset tem sombra), `--shadow-md`/`--shadow-lg` como profundidade (uma sombra só, `--custom-shadow`), `--color-primary: var(--accent)` (o teal vira `--brand`, ver [camada-lyx](./camada-lyx.md)), `font-weight: 700` nos títulos (`font-medium` é o peso máximo no app), `.btn` com `border-radius: var(--radius)` (botão é pílula) e `--color-chart-1: var(--accent)` (`--chart-1..5` são cinzas; cor em gráfico é dado).
