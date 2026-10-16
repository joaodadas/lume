# Vite (SPA) com o lume

Origem: plano do lume (seção `docs/adocao`), `FRONTEND.md` "Next.js e Vite: o que muda" e o painel do `lyx-pr-agent` (`painel/`, Vite 8 + React 19 + Tailwind 4.3), que é o port validado do Foglamp sem Next: `src/app/shell.tsx` é o exemplo canônico de shell, `src/app/rota.tsx` o de navegação e `src/app/tema.tsx` + `public/assets/tema.js` o de tema sob CSP. Os blocos do lume já nasceram puros por causa dele; o que este guia faz é mostrar o que muda bloco a bloco.

## 1. Projeto e `components.json`

```bash
bunx create-vite@latest meu-painel --template react-ts
cd meu-painel && bun add -d @tailwindcss/vite
```

`tsconfig.json` com `"paths": { "@/*": ["./src/*"] }` e `vite.config.ts` com `resolve.alias` `@` para `./src` (o painel: `fileURLToPath(new URL('./src', import.meta.url))`) e `plugins: [react(), tailwindcss()]`. A CLI do shadcn exige o alias no tsconfig para reescrever os imports.

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y
```

Mesma regra do Next: `-y`, nunca `-d`. O `init` do shadcn reconhece Vite pelo `vite.config.ts` e escreve o `components.json` com `rsc: false` (conferir: validado hoje só em Next; se o `init` recusar o projeto, escreva o `components.json` abaixo à mão e rode `npx shadcn@latest add joaodadas/lume/base#v0.1.0`, que grava `cssVars` e `css` no arquivo de CSS e ignora o `config`).

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/styles/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "tabler",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }
}
```

`rsc: false` faz a CLI remover as diretivas `"use client"` ao instalar. O `src/styles/globals.css` importado em `src/main.tsx` (`import './styles/globals.css'`, como no painel) fica com `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"` (o pacote `shadcn` é dependência do `base`; o painel copiou esse arquivo para `src/styles/shadcn-tailwind.css` quando ainda não dependia dele), os `@import` do Fontsource, `@plugin "@toolwind/corner-shape"`, as duas `@custom-variant` e os tokens. Com `@tailwindcss/vite` não precisa de `@source`; o painel declara `@source "../**/*.{ts,tsx}"` por garantia.

## 2. Itens

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.1.0 joaodadas/lume/kit-tabela#v0.1.0 joaodadas/lume/kit-feedback#v0.1.0 joaodadas/lume/kit-dados#v0.1.0 joaodadas/lume/kit-graficos#v0.1.0
npx shadcn@latest add joaodadas/lume/theme-provider-csp#v0.1.0 --overwrite
npx skills add joaodadas/lume --skill lume-design-engineering
```

Nunca instale `link-next`, `theme-provider` (next-themes funciona em Vite, mas injeta `<script>` inline; use-o só sem CSP) nem qualquer item `nextOnly`. Conferir: `grep -rl "next/" src` não devolve nada e `grep -rl "@/registry/" src` também não.

## 3. Bloco a bloco: o que usava Next e a variante pura

<!-- skill:start -->
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
<!-- skill:end -->

### Navegação: o adaptador do painel

`painel/src/app/rota.tsx` (38 linhas) é o roteador inteiro: `ProvedorDeRota` guarda `caminho` (de `window.location.pathname`, normalizado sem barra final) e ouve `popstate`; `ir(href)` faz `window.history.pushState(null, '', href)`, atualiza o estado e rola `main` para o topo; `Link` é um `<a>` que, no clique primário sem modificador, faz `preventDefault()` e chama `ir` (ctrl/cmd-clique abre em outra aba como sempre). No lume isso vira o corpo de `components/link.tsx` mais um `lib/navigation.tsx` com o provider e o hook:

```tsx
// components/link.tsx (substitui o <a> puro do item link)
import { useRota } from "@/lib/navigation";
export function Link({ href, onClick, ...props }: React.ComponentProps<"a"> & { href: string }) {
  const { ir } = useRota();
  return (
    <a href={href} {...props} onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      ir(href);
    }} />
  );
}
```

Com react-router o mesmo arquivo vira `return <RouterLink to={href} {...props} />`. O `prefetch` que o `link-next` ganha de graça não existe aqui; `row-nav` (navegação por linha de tabela) chama `ir()` e o prefetch é no-op.

### Shell: o exemplo canônico

`painel/src/app/shell.tsx` é o `app-shell` antes de virar item: `SidebarProvider className="group/shell relative h-svh min-h-0 overflow-hidden"`, `Sidebar variant="inset"`, wrapper `flex min-h-0 min-w-0 flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2`, `SidebarInset className="min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl"` (o `transition-shadow duration-200` entrou no item do lume), header mobile `flex h-12 shrink-0 items-center gap-2 border-b border-border/50 px-3 md:hidden` com `SidebarTrigger`, viewport `min-h-0 flex-1 overflow-y-auto` e coluna `flex flex-col gap-6 py-6 pb-16`. O `NavIcon` dele (`shell.tsx:56-63`) é o mesmo do item, com o glifo único quando não há variante filled. A composição em `app.tsx:74-84`: `ProvedorDeTema` > `ProvedorDeRota` > `TooltipProvider delay={150}` > sessão > `Shell`. Com os itens do lume: `ThemeProvider` (csp) > `RotaProvider` > `TooltipProvider` > `AppShell`.

## 4. Fontes

O `base` já importa `@fontsource-variable/inter/opsz.css` e `@fontsource-variable/geist-mono`; o Vite resolve esses `@import` do CSS e emite os woff2 em `assets/`. Nada a fazer. O painel, anterior ao Fontsource, serve `@font-face` com `src/fonts/InterVariable.woff2` e `geist-mono-variable.woff2` e `build.assetsInlineLimit: 0` (para o teste de fumaça garantir que tudo sai de `/dashboard/assets`, sem CDN); é a alternativa quando a fonte precisa ser um arquivo do repo. `font-feature-settings: "cv11", "ss01"` no `:root` (painel) é opt-in: muda a cara em relação ao foglamp.dev.

## 5. Build, CSP e teste de fumaça

- `"build": "tsc -b && vite build && bun scripts/fumaca.ts"` (painel). O `scripts/fumaca.ts` confere que o `index.html` só carrega de `/dashboard/assets/`, que nada vem de CDN ou do Google Fonts, que não há `<script>` inline (a CSP do painel não aceita) e que o bundle não contém cara de segredo. Copie e adapte o prefixo.
- `base: '/dashboard/'` quando o app é servido sob um caminho; o `theme.js` e o favicon seguem o prefixo.
- `server.proxy` em dev para as rotas JSON do backend (`painel/vite.config.ts`).
- `index.html` com `<html lang="pt-BR">`, `<meta name="robots" content="noindex">` em painel interno, e o `theme.js` no `<head>`.

## O que não copiar

Do painel: `src/app/tipos.ts`, `sessao.tsx` e `api.ts` (regras do agente de PRs), os nomes em português dos componentes (`ProvedorDeTema`, `GradeDeNumeros`: no lume são `ThemeProvider`, `StatGrid`), a cópia de `shadcn-tailwind.css` (o `base` já importa do pacote), e `src/components/ui/*` (instale da registry, que tem as correções de `sidebar.tsx:485` e `table.tsx`).
