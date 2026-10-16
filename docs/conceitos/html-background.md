# HTML Background

Original: https://craft.gustavofior.com/html-background (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/layout/html-background.mdx. Seção: Layout.
Status no Foglamp: não aparece (mapa 3.4); o lume adota.

## Regra

O browser pinta uma tela (o canvas) atrás da página. Quando só o `body` ou um wrapper tem cor de
fundo, o overscroll do Safari e qualquer área fora do conteúdo mostram o canvas branco: num app
dark, uma faixa branca aparece ao puxar além do topo. O browser até usa o fundo do `body` quando o
`html` é transparente, mas isso é comportamento de fallback; pintar o root
(`html { background-color: var(--background) }`) deixa a intenção explícita e não depende dele. O
token precisa seguir o tema ativo, senão o flash volta num dos modos.

## Valores

<!-- skill:start -->
| O quê | Valor | Onde |
|---|---|---|
| Root pintado (adição do lume) | `html { @apply font-sans bg-background; }` dentro de `@layer base` | registry/base-vega/styles/globals.css:285-289 |
| Body | `body { @apply font-sans bg-background text-foreground selection:bg-primary/10; }` | registry/base-vega/styles/globals.css:290-292 |
| Token por tema | `--background: oklch(0.99 0 0)` no `:root`, `oklch(0.17 0 0)` no `.dark` | registry/base-vega/styles/globals.css:23,133 |
| Tema no root antes da primeira pintura | `theme-provider` (next-themes; o app passa `attribute="class" defaultTheme="dark" enableSystem`, como em app/layout.tsx:24-26) ou `theme-provider-csp` com `public/theme.js` (sem script inline, `defaultTheme = "dark"`) | registry/base-vega/components/theme-provider.tsx; theme-provider-csp.tsx:59; registry/base-vega/public/theme.js |
| `theme-color` | não usado no Foglamp nem no lume; se adicionar, manter em sincronia com o tema | craft html-background.mdx |
| `overscroll-behavior: none` | não usar por padrão: o bounce é parte da plataforma | craft html-background.mdx |

**Always**: o mesmo token de fundo no `html`, no `body` e no app; classe `.dark` aplicada no `html`
antes de o React montar. **Never**: `bg-background` só num wrapper `min-h-screen`; cor literal no
`html` (`#0a0a0a`) que não segue o tema; `overscroll-behavior: none` em página de conteúdo; dois
`@custom-variant dark` no mesmo CSS (o `init` da CLI pode duplicar, confira depois de instalar).
<!-- skill:end -->

## Onde aparece no Foglamp

Não aparece. `packages/ui/src/styles/globals.css:305-307` dá ao `html` apenas `font-sans`; o
`bg-background` fica no `body` (`:291-293`) e o `apps/web/src/app/layout.tsx:65-69` põe no `<html>`
só `font-sans` e a variável da Inter. Sem `theme-color`. O site antigo do autor (2023) já pintava
`html` e `body` em `#fafafa` (mapa 3.8); o Foglamp perdeu o detalhe, e no tema dark padrão o
overscroll do Safari mostra branco.

## No lume

- O `base` adota o conceito: `html { @apply font-sans bg-background }` em `@layer base` (adição do lume, comentada no globals.css:285-286). É a única diferença de `@layer base` em relação ao Foglamp além das fontes via Fontsource.
- Itens: `base`, `theme-provider`, `theme-provider-csp`, `app-shell` (o canvas do shell usa `--sidebar`, um passo mais escuro que `--background`; ver `docs/guia/03-shell-e-paginas.md`. O `html` continua com `--background`, que é a cor do inset e das páginas sem shell, como o login).
- FRONTEND.md: seção 3 (Tokens e cor), seção 22 (Dark mode) e seção 29 (Next.js e Vite: no Vite a classe do tema entra no `index.html` pelo `public/assets/tema.js`, ver `docs/adocao/vite.md`).
- Teste: abra o app no Safari (macOS ou iOS) no dark, puxe além do topo e além do fim; nada branco pode aparecer.
