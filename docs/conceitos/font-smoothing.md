# Font Smoothing

Original: https://craft.gustavofior.com/font-smoothing (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/font-smoothing.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

## Regra

O macOS engrossa a borda de todo glifo ao renderizar texto no browser, herança do subpixel rendering
em tela de baixa resolução. Em fundo claro quase não se nota; em fundo escuro vira um brilho, e cada
título parece meio peso mais pesado do que o design. `-webkit-font-smoothing: antialiased` (classe
`antialiased` do Tailwind) desliga o engrossamento e renderiza o glifo no peso real. Só faz efeito
no macOS: Windows (ClearType), Linux, iOS e Android ignoram a propriedade, e tudo bem, porque o
problema é do macOS. Pesos 400 para cima ficam mais limpos; 300 e abaixo afinam demais em tela 1x,
então não use peso leve em fundo escuro.

## Valores

<!-- skill:start -->
| O quê | Valor | Onde |
|---|---|---|
| Classe no `body` | `antialiased` (`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`) | Foglamp `apps/web/src/app/layout.tsx:78` |
| Opt-out de uma região | `subpixel-antialiased` (devolve o padrão do browser) | craft font-smoothing.mdx; nenhum uso no Foglamp |
| Pesos usados no app | `font-medium` (500) é o teto em UI; `font-[470]` no delta do stat card; nunca `font-light` | registry/base-vega/components/stat-card.tsx:204 |
| Tema padrão | `defaultTheme="dark"`: a maioria dos usuários vê o caso em que o brilho aparece | registry/base-vega/components/theme-provider-csp.tsx:59; docs/DECISOES.md |
| Fundo escuro | `--background: oklch(0.17 0 0)`, `--foreground: oklch(0.985 0 0)` | registry/base-vega/styles/globals.css:133-134 |

**Always**: `antialiased` no `<body>` do app, uma vez (Next: `app/layout.tsx`; Vite: `index.html`).
**Never**: `font-light` ou `font-thin` em superfície escura; `antialiased` espalhado por componente
(a regra é global; a exceção é `subpixel-antialiased` numa região que precise do padrão).
<!-- skill:end -->

Os quatro valores da propriedade: `auto` (padrão, engrossa), `antialiased` (grayscale, o que você
quer), `subpixel-antialiased` (força o padrão de volta numa região) e `none` (serrilhado, sem uso em
produto). Desde o Firefox 128 o Firefox no macOS honra a propriedade WebKit; a linha
`-moz-osx-font-smoothing: grayscale` que o Tailwind emite junto só serve a versões antigas.

## Onde aparece no Foglamp

`apps/web/src/app/layout.tsx:78`: `"antialiased"` no `className` do `<body>`, junto das variáveis
das três fontes (`inter.variable`, `geistMono.variable`, `hostGrotesk.variable`). O CSS module do
guia de observabilidade repete a propriedade
(`apps/web/src/components/marketing/how-it-works/observability-guide.module.css:11`). O
`globals.css` do pacote `ui` não declara smoothing: a regra vive no app, não no design system, e o
craft faz igual (`layout.tsx:101` do craft, mapa 3.4).

## No lume

- O `base` (registry/base-vega/styles/globals.css) segue o Foglamp e não declara `antialiased`: a classe vai no `<body>` do app, como manda `docs/adocao/next-novo.md` e `docs/adocao/vite.md`. Se o texto parece gordo no dark num Mac, é isso que está faltando.
- Itens: `base`, `theme-provider` e `theme-provider-csp` (o dark é o padrão, então este conceito deixa de ser detalhe e vira pré-requisito).
- FRONTEND.md: seção 7 (Tipografia: `font-medium` é o peso máximo no app) e seção 22 (Dark mode). Guia: `docs/guia/01-fundacoes.md`.
- Só macOS: teste o dark num Mac antes de aprovar peso de fonte; no Windows o engrossamento não existe e a comparação engana nos dois sentidos.
