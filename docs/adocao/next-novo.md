# Projeto Next novo com o lume

Origem: plano do lume (seção `docs/adocao`) e `FRONTEND.md` seções Layout do projeto, Shell e sidebar, Loading, Dark mode, Fontes e "Next.js e Vite: o que muda". Roteiro para um app Next 16 (App Router) que nasce com a cara do Foglamp. Os comandos de instalação foram executados em 16/10/2026 num app descartável com shadcn 4.21.5; o que depende da versão da CLI está marcado "(conferir)".

## 1. Criar o app

```bash
bunx create-next-app@latest meu-app --ts --tailwind --app --no-src-dir --import-alias "@/*" --use-bun
cd meu-app
```

Com npm, troque `bunx` por `npx` e `--use-bun` por `--use-npm`. Com `--src-dir` tudo funciona igual: a CLI lê o alias e o `tailwind.css` do `components.json`, e os alvos `~/` (`public/theme.js`, `docs/lume/`) continuam na raiz do projeto.

## 2. Instalar a base

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

Sempre com `-y` e nunca com `-d`. Verificado hoje: com `-d` a CLI ignora o item `base` (`extends: "none"` e o bloco `config`) e instala o style padrão por cima, com os tokens `sidebar-primary`, o `button` e o pacote `cn` do registry oficial. Com `-y` ela aceita o `config` do `base` sem perguntar. Fallback se o modo GitHub falhar: `npx shadcn@latest init https://lume-ashmont.vercel.app/r/base.json -y`.

O `base` cria só isto: `components.json` (style `base-vega`, `iconLibrary: "tabler"`, `baseColor: "neutral"`, alias `@lume`), `lib/utils.ts` (`cn` com `clsx` + `tailwind-merge`, item `utils`) e o `app/globals.css` com os tokens. Nenhum componente entra aqui.

<!-- skill:start -->
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
<!-- skill:end -->

## 3. Instalar os itens e a skill

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0 joaodadas/lume/kit-tabela#v0.1.0 joaodadas/lume/kit-formulario#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/kit-dados#v0.1.0 joaodadas/lume/kit-graficos#v0.1.0 joaodadas/lume/login-form#v0.1.0
npx shadcn@latest add joaodadas/lume/link-next#v0.1.0 --overwrite
npx shadcn@latest add joaodadas/lume/guia#v0.1.0
npx skills add joaodadas/lume --skill lume-design-engineering
```

- Vários itens num comando só funciona (verificado). Os kits são `registry:block` sem arquivo: só puxam `registryDependencies`. Quem quer menos instala item a item (`npx shadcn@latest add joaodadas/lume/button#v0.1.0`) ou pelo alias que o `base` já escreveu no `components.json` (`npx shadcn@latest add @lume/button`).
- `link-next` grava no mesmo caminho do `link` (`components/link.tsx`, `registry/base-vega/components/link-next.tsx`), por isso precisa de `--overwrite`: sem ele a CLI pula o arquivo que já existe. Rode sempre depois dos kits, porque o `kit-shell` traz o `link` puro (`<a>`), e os blocos importam de `components/link`, nunca de `next/link`.
- `guia` instala `docs/lume/FRONTEND.md`, `docs/lume/guia/*` e `docs/lume/CONCEITOS.md` na raiz do projeto (alvos `~/`).
- A skill entra em `.agents/skills/lume-design-engineering`, com link em `.claude/skills` e um `skills-lock.json`; atualize com `npx skills update`. Instale junto `npx skills add gustavo-fior/craft` e a `web-design-guidelines` de `vercel-labs/agent-skills` (ordem de leitura em `docs/referencias.md`).

Conferir: `grep -rl "@/registry/" components lib hooks` não devolve nada (a CLI reescreveu os imports para `@/components/ui`, `@/lib/utils`, `@/hooks`) e `bun run build` passa.

## 4. `layout.tsx` e providers

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="font-sans">
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- `defaultTheme="dark" enableSystem` é a regra praticada do Foglamp (`apps/web/src/components/providers.tsx:13-18`), não o `system` do FRONTEND.md original. `suppressHydrationWarning` no `<html>` por causa da classe que o next-themes injeta. Um único `<Toaster />` na árvore.
- CSP estrita (sem script inline): no lugar do `theme-provider`, `npx shadcn@latest add joaodadas/lume/theme-provider-csp#v0.1.0 --overwrite` (mesmo alvo `components/theme-provider.tsx`, mais `public/theme.js`), `<script src="/theme.js" data-storage-key="lume-theme" data-default-theme="dark" />` no `<head>` antes do bundle, e no `theme-switcher.tsx` troque o `import { useTheme } from "next-themes"` por `@/components/theme-provider` (mesma forma: `theme`, `setTheme`, `resolvedTheme`).
- Dados: `QueryClientProvider` com o `QueryCache.onError` ao lado do `QueryClient`, como em `apps/web/src/utils/trpc.ts:20-31` do Foglamp, mais `MutationCache.onError` (adição do lume):

```tsx
// lib/query-client.ts
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      toast.error(error.message, { action: { label: "Tentar de novo", onClick: query.invalidate } }),
  }),
  mutationCache: new MutationCache({ onError: (error) => toast.error(error.message) }),
});
```

## 5. Primeira rota: shell e o trio header/loading/page

O `app-shell` (`registry/base-vega/blocks/app-shell/app-shell.tsx`) recebe `{ nav, account?, brand, user?, userMenu?, pathname, children }`; no Next o `pathname` vem de `usePathname()` num wrapper client, e o `layout.tsx` do grupo continua server (sessão e `redirect("/login")`, como em `apps/web/src/app/(app)/layout.tsx` do Foglamp):

```tsx
// components/app/shell.tsx
"use client";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconLayoutDashboardFilled } from "@tabler/icons-react";
import { AppShell } from "@/components/app-shell/app-shell"; // caminho que o item app-shell instala
import { navTile } from "@/components/app-shell/nav";

const NAV = [
  { href: "/dashboard", label: "Visão geral", icon: IconLayoutDashboard, activeIcon: IconLayoutDashboardFilled, iconClassName: navTile("sky") },
];

export function Shell({ children, user }: { children: React.ReactNode; user: { name: string; email?: string } }) {
  return <AppShell nav={NAV} brand={<span className="truncate font-medium">Meu app</span>} user={user} pathname={usePathname()}>{children}</AppShell>;
}
```

Cada rota de lista é um trio (`apps/web/src/app/(app)/settings/{header,loading,page}.tsx` do Foglamp): `header.tsx` exporta um componente com o `PageHeader` configurado, `loading.tsx` renderiza só ele, e `page.tsx` renderiza o client (com `Suspense fallback={<XHeader />}` quando o client lê `useSearchParams`). O header pintado duas vezes é o que deixa a troca fallback para página pixel-idêntica. O `route-header` do Foglamp é `nextOnly` e sai como item só na v0.2; até lá copie `apps/web/src/components/app/route-header.tsx` ou escreva o `header.tsx` direto sobre o `page-header`:

```tsx
// app/(app)/pedidos/header.tsx
"use client";
import { PageHeader } from "@/components/page-header";
import { IconPackage } from "@tabler/icons-react";
export function PedidosHeader({ actions }: { actions?: React.ReactNode }) {
  return <PageHeader title="Pedidos" icon={IconPackage} iconClassName={navTile("sky")} actions={actions} />;
}
// loading.tsx: export default function Loading() { return <PedidosHeader />; }
```

Dentro da página: coluna `flex flex-col gap-4` já vem do shell; `StatGrid` + `StatCard`, `DataTable` com `useUrlFilters` (filtros na URL por `history.replaceState`, `registry/base-vega/blocks/data-table/url-filters.ts`), `useDelayedLoading(loading, 700)` antes de qualquer skeleton, `EmptyState` quando não há dado. Um `error.tsx` mínimo por grupo de rotas (adição do lume; o Foglamp não tem): cartão centrado com `h1 text-lg font-medium`, `p text-sm text-muted-foreground` e `Button variant="secondary"` "Tentar de novo" chamando `reset()`.

## 6. `AGENTS.md` do projeto

Aponte o agente para o guia instalado e para a skill, sem copiar as regras:

```md
## Design system
- Regras: `docs/lume/FRONTEND.md` (Always/Never) e `docs/lume/guia/`. Skill: `lume-design-engineering` (instalada em `.agents/skills`).
- `components/ui/*` e os blocos são itens da registry `joaodadas/lume`: nunca editar à mão; atualizar com `npx shadcn@latest add joaodadas/lume/<item>#vX.Y.Z --overwrite`.
- Ícones só `@tabler/icons-react`; primitivos só Base UI (`render`, nunca `asChild`); sem `lucide-react`, sem Radix.
```

## 7. Atualizar depois

`npx shadcn@latest add joaodadas/lume/<item>#v0.2.0 --diff` mostra o que mudou; `--overwrite` aplica. Tokens novos entram com `npx shadcn@latest add joaodadas/lume/base#v0.2.0` (o `add` do `base` escreve `cssVars` e `css`, ignora o `config`). O `CHANGELOG.md` do lume tem a seção "Como migrar" quando um item muda de API.

## O que não copiar

O `components.json` do Foglamp (aponta para `@foglamp/ui` e `@evilcharts`), o `layout.tsx` dele (Inter por `next/font/local` e Host Grotesk por `next/font/google`: aqui as fontes vêm do Fontsource e o `font-display` é o item `font-display`), o `providers.tsx` com PostHog e `DevBar`, e o `utils/trpc.ts` inteiro (só a ideia do `QueryCache.onError` entra).
