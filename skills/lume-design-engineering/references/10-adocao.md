# Adoção

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/11-receita.md`, `docs/adocao/*.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

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

## Do guia: 11. Receita: do zero a um app com a cara do Foglamp

### Passo 0: decisões já tomadas (não reabra sem issue)

| Decisão | Escolha no lume | Confira |
|---|---|---|
| Primitivos | Base UI (`@base-ui/react`): composição por `render`, estados `data-open`/`data-closed`, nunca `asChild` | `grep -r asChild src` devolve zero |
| Style e ícones | shadcn `base-vega`, `baseColor: neutral`, `iconLibrary: tabler`, `menuAccent: subtle`, Tailwind v4 sem `tailwind.config` | `components.json` depois do init |
| Fontes | Inter Variable e Geist Mono via Fontsource (item `base`); Host Grotesk só com `font-display`; `cv11`/`ss01` opt-in | `document.fonts` lista Inter Variable e Geist Mono Variable; `font-mono` computa Geist Mono |
| Tema | dark como inicial com `enableSystem`; `theme-provider` (next-themes) ou `theme-provider-csp` | `<html class="dark">` no primeiro load sem preferência salva |
| Movimento | `motion/react` permitido com o vocabulário de `lib/motion.ts`; CSS nos primitivos | nenhuma curva literal fora de `lib/motion.ts` e dos charts |
| Formulários | TanStack Form ou React Hook Form, desde que o campo seja o `Input`/`Field` do DS | `login-form` é presentacional |

### Passo 11: regras para agentes (mapa 21.12)

- **Always** escreva as regras no formato Always / Never e com a regra praticada: `motion/react` com o vocabulário do passo 7; borda aceita como linha de tabela, divisor atenuado e hairline de marketing; `defaultTheme="dark"`; Inter via Fontsource (o Foglamp usa `next/font/local`); `IconLoader`; hex permitido quando a cor é dado (marca, hash, categoria), com comentário; `Intl` para números e datas curtas; comentário de uma linha em todo valor arbitrário.
- **Always** vendorize skills com `npx skills add` e mantenha `skills-lock.json` commitado (o Foglamp vendoriza `next-best-practices`, `shadcn`, `turborepo`, `hono`, `better-auth-best-practices`, `codebase-scan` e `next-cache-components` em `.agents/skills`).
- **Always** afine botão, badge e chip no playground `/botoes` (`app/botoes/page.tsx`, tecla `T` alterna o tema; no Foglamp é `/buttons`) antes de abrir PR, fora do grupo autenticado, e reporte revisão em tabela Before / After / Regra citando `arquivo:linha`.
- **Never** instale biblioteca de componentes, ícones, tabela (TanStack Table), estado global (Zustand, Redux, Jotai) ou CSS file por componente; estado compartilhado é React context, estado de lista é a URL, o resto é `useState`.
- Fora do escopo visual (vão para o `AGENTS.md` do projeto, não para o `FRONTEND.md`): env com `@t3-oss/env-nextjs` declarada em três lugares, tRPC com `queryOptions`/`mutationOptions` e invalidação por `queryKey()`, `params`/`searchParams` como Promise resolvidos no server.

## Guias de adoção: comandos e tabela Lucide para Tabler

### Camada Lyx: `Lyx-Engenharia/lyx-ds` sobre a base pública

Fonte: [docs/adocao/camada-lyx.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/camada-lyx.md).

#### Teal `#025864`: `--brand`, não `--primary`

Recomendação da base (a decisão final é da camada Lyx, registrada num ADR curto do `lyx-ds` para o Jefferson poder discordar com argumento): o teal entra como token `--brand`, e `--primary` fica cinza como no Foglamp.

| Onde o teal entra | Como |
|---|---|
| Logo e tile de marca na sidebar | `LyxLogo className="text-brand"`; tile pela receita do `navTile` com os rgba do teal |
| Login | fundo do painel de marca e o CTA |
| `Badge variant="brand"` | status de marca, nunca estado (estado continua emerald, rose, amber) |
| `Button variant="brand"` | no máximo um por tela, o CTA principal; o resto `default`, `secondary`, `ghost` |

| Token | Light | Dark |
|---|---|---|
| `--brand` | `#025864` | `#03A698` (o teal claro que a 52W já usa no dark) |
| `--brand-foreground` | `#ffffff` | `oklch(0.145 0 0)` |
| `--custom-shadow-brand` | `0 0 0 .5px rgba(2,88,100,.25), 0 .5px 2px -.5px rgba(2,88,100,.18), 0 2px 4px 0 rgba(2,88,100,.12)` | `0 0 0 .5px rgba(3,166,152,.25), 0 .5px 2px -.5px rgba(3,166,152,.18), 0 2px 4px 0 rgba(3,166,152,.12)` |
| `--color-brand` (`@theme inline`) | `var(--brand)` | |

A fórmula da sombra colorida é a mesma dos badges da base (`--custom-shadow-emerald`, `--custom-shadow-sky`...): anel de meio pixel a 25%, uma sombra curta a 18% e uma de 4px a 12%, todas na cor.

#### Comandos

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y          # nunca -d; fallback: init https://lume-ashmont.vercel.app/r/base.json -y
npx shadcn@latest add Lyx-Engenharia/lyx-ds/theme-lyx#v0.1.0   # sozinho, depois do init, para o tema vencer o base
npx shadcn@latest add Lyx-Engenharia/lyx-ds/lyx-shell#v0.1.0 Lyx-Engenharia/lyx-ds/lyx-login#v0.1.0 Lyx-Engenharia/lyx-ds/lyx-guide#v0.1.0
npx shadcn@latest add joaodadas/lume/link-next#v0.1.0 --overwrite
npx skills add joaodadas/lume --skill lume-design-engineering
```

### Migrar um front 52W (Lyx) para o lume

Fonte: [docs/adocao/migracao-52w.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/migracao-52w.md).

#### Inventário de hoje (16/10/2026)

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

#### Passo 1: `components.json` e dependências

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

#### Passo 3: camada de aliases temporária

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

#### Passo 4: dark mode de `data-theme` para `.dark`

```bash
npx shadcn@latest add joaodadas/lume/theme-provider#v0.1.0 joaodadas/lume/theme-switcher#v0.1.0
```

#### Passo 6: primitivos Radix para Base UI

```bash
npx shadcn@latest add joaodadas/lume/kit-formulario#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/card#v0.1.0 joaodadas/lume/table#v0.1.0 joaodadas/lume/sidebar#v0.1.0 joaodadas/lume/scroll-area#v0.1.0 joaodadas/lume/separator#v0.1.0 joaodadas/lume/badge#v0.1.0 joaodadas/lume/button#v0.1.0 --overwrite
```

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

#### Passo 7: ícones, por arquivo, e as telas uma rota por PR

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

#### Passo 8: remoção final

```bash
grep -rn "lyx-card\|btn-primary\|btn-ghost\|hub-card\|page-header\|stat-card\|form-input\|app-shell\|main-content" src --include=*.tsx | wc -l   # tem que dar 0 antes de seguir
npm uninstall lucide-react radix-ui @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs
```

### Projeto Next novo com o lume

Fonte: [docs/adocao/next-novo.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/next-novo.md).

#### 1. Criar o app

```bash
bunx create-next-app@latest meu-app --ts --tailwind --app --no-src-dir --import-alias "@/*" --use-bun
cd meu-app
```

#### 2. Instalar a base

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

Conferir o `app/globals.css` e o `app/layout.tsx` depois do `init`:

| O quê | Comando | Esperado |
|---|---|---|
| Sombras | `grep -cE "^\s*--custom-(outline-)?shadow" app/globals.css` | 34 (17 em `:root`, 17 em `.dark`) |
| Fontes | `grep -n "fontsource\|font-mono" app/globals.css` | `@import "@fontsource-variable/inter/opsz.css"`, `@import "@fontsource-variable/geist-mono"` e `--font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` dentro do `@theme inline` |
| Squircle | `grep -n "corner-shape\|squircle" app/globals.css` | `@plugin "@toolwind/corner-shape"` e `@custom-variant squircle (@supports (corner-shape: squircle))` |
| Dark | `grep -c "@custom-variant dark" app/globals.css` | 1 |
| Sobras do create-next-app | `grep -n "geist\|prefers-color-scheme" app/globals.css` | nada; apague o `@theme inline` com `--font-sans: var(--font-geist-sans)` e o bloco `@media (prefers-color-scheme: dark)` que o template deixa (conferir) |
| `@theme inline` | `grep -c "color-custom-shadow" app/globals.css` | 0: sombra nunca vira `--color-*` |
| `layout.tsx` | `grep -n "next/font" app/layout.tsx` | nada |

O `create-next-app` deixa `Geist` e `Geist_Mono` de `next/font/google` no `app/layout.tsx`. Apague o import, as duas constantes e as classes `${geistSans.variable} ${geistMono.variable}` do `<body>`: a Inter (com o eixo `opsz`) e a Geist Mono já chegam pelo CSS, via Fontsource, e `--font-sans` e `--font-mono` já apontam para elas. Se o `init` reaparecer com uma Inter do `next/font/google` (o style `base-vega` oficial puxa `font-inter`), apague essa linha também.

#### 3. Instalar os itens e a skill

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0 joaodadas/lume/kit-tabela#v0.1.0 joaodadas/lume/kit-formulario#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/kit-dados#v0.1.0 joaodadas/lume/kit-graficos#v0.1.0 joaodadas/lume/login-form#v0.1.0
npx shadcn@latest add joaodadas/lume/link-next#v0.1.0 --overwrite
npx shadcn@latest add joaodadas/lume/guia#v0.1.0
npx skills add joaodadas/lume --skill lume-design-engineering
```

### Vite (SPA) com o lume

Fonte: [docs/adocao/vite.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/vite.md).

#### 1. Projeto e `components.json`

```bash
bunx create-vite@latest meu-painel --template react-ts
cd meu-painel && bun add -d @tailwindcss/vite
```

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

#### 2. Itens

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0 joaodadas/lume/kit-tabela#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/kit-dados#v0.1.0 joaodadas/lume/kit-graficos#v0.1.0
npx shadcn@latest add joaodadas/lume/theme-provider-csp#v0.1.0 --overwrite
npx skills add joaodadas/lume --skill lume-design-engineering
```

#### 3. Bloco a bloco: o que usava Next e a variante pura

| Item | No Foglamp dependia de | No lume (puro) | No Vite você faz |
|---|---|---|---|
| `link` / `link-next` | `next/link` em todo bloco | `components/link.tsx` é um `<a href>` com `href: string` (`registry/base-vega/components/link.tsx`); `link-next` troca o arquivo por `next/link` no mesmo caminho | Instale só `link`. Para SPA, troque o corpo de `components/link.tsx` pelo `Link` do roteador: o `rota.tsx` do painel (`pushState` + `useRota`) ou `<RouterLink to={href} {...props} />` do react-router. Mesmo contrato, os blocos não mudam |
| `app-shell` | `usePathname()` e `authClient` | `pathname` e `user` são props (`registry/base-vega/blocks/app-shell/app-shell.tsx:149-168`) | `pathname={useRota().caminho}` (painel) ou `useLocation().pathname`. A gaveta mobile fecha sozinha quando `pathname` muda (`CloseOnNavigate`) |
| `page-header`, `stat-card`, `context-chip`, `markdown-components` | `next/link` e o tipo `Route` | `href: string` pelo `Link` da indireção; `PX = "px-4 md:px-8"` exportado (`registry/base-vega/components/page-header.tsx:14`) | Nada |
| `data-table` | `useSearchParams` + `useRouter().replace` do `next/navigation` | `useUrlFilters` em `registry/base-vega/blocks/data-table/url-filters.ts`: lê `window.location.search` por `useSyncExternalStore` (ouve `popstate` e o evento `lume:urlfilters`) e escreve com `history.replaceState`; mesma assinatura `[values, patch]`, default some da URL, `page` cai em todo patch que não o define | Nada. Se o roteador também lê a query, ele não vê o `replaceState`; o painel não precisa porque só a tabela lê a URL |
| `header-slot` (toolbar portalando para o header) | nada de Next | `HeaderActionsSlotProvider` + `createPortal` | Monte o provider dentro do shell, como no Next |
| `range-picker` | nada de Next | `RangeProvider` com `localStorage` e `storageKey` | Nada |
| `theme-provider` | next-themes com `<script>` inline | `theme-provider-csp` (`registry/base-vega/components/theme-provider-csp.tsx`) sem script inline, `useTheme()` com a forma do next-themes, mais `public/theme.js` (`registry/base-vega/public/theme.js`) | `<script src="/theme.js" data-storage-key="lume-theme" data-default-theme="dark"></script>` no `<head>` do `index.html`, antes do `<script type="module">`. Com `base: '/dashboard/'` o caminho vira `/dashboard/theme.js`. No `theme-switcher.tsx`, troque o import de `useTheme` de `"next-themes"` por `@/components/theme-provider` |
| `route-header` (trio header/loading/page) | `loading.tsx` do App Router | fora da v0.1 (`nextOnly`) | Um `PageHeader` no topo de cada página e `Suspense fallback` com skeleton na troca de rota (`Carregando` em `painel/src/app/app.tsx:23-31`), páginas pesadas por `lazy()` |
| `use-entrance-once`, `use-delayed-loading`, `sonner`, charts, `login-form`, `copy-button`, `code-block` | nada de Next | puros | Nada; `code-block` (shiki) por `lazy()` para não entrar no bundle inicial |
