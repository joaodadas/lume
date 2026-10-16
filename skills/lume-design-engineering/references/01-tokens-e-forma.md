# Tokens e forma

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/01-fundacoes.md`, `docs/guia/10-fingerprint.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Tokens e cor

<!-- mapa: 4.3, 4.10, 9.6.2 | regras 1, 8 -->

- **Always** use os tokens semânticos: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-destructive`, `border-border`, `ring-ring`, `bg-sidebar`. Todos são `oklch(L 0 0)` em degraus da paleta `neutral` (`registry/base-vega/styles/globals.css:23-52,133-161`); a hierarquia vem da luminância: light `--background 0.99`, `--card 1`, `--sidebar 0.975`; dark `--sidebar 0.145`, `--background 0.17`, `--card 0.205`.
- **Always** prefira o token com opacidade para estado e texto secundário: `text-muted-foreground/50`, `/60`, `/70`; `bg-muted/50`; `bg-muted-foreground/15` e `/10` para chips e skeletons; `border-border/40` e `/50` para divisórias.
- **Always** use `neutral` quando precisar de cinza cru (`bg-neutral-800 dark:bg-neutral-100` é o botão default); cor cromática só com significado (seção "Cor com significado").
- **Never** use `slate`, `gray`, `zinc` ou `stone` (nem `--sidebar-primary` e `--custom-shadow-slate`, removidos do lume), nem hex, `rgb()` ou `oklch()` em `className` ou `style`, exceto quando a cor é dado (série de gráfico, cor de marca, hash de entidade) e com comentário de uma linha dizendo isso.

Porquê: cinza é estrutura e cor é significado; com chroma zero em tudo, L é a única variável e as superfícies se separam sem borda.

## Sombra no lugar de borda

<!-- mapa: 4.5, 19.3 | regras 2, 3, 4 -->

- **Always** dê borda a uma superfície com `shadow-(--custom-shadow)`: light `0 0 0 0.5px rgba(0,0,0,.06), 0 .5px 2px -.5px rgba(0,0,0,.06), 0 1px 4px 0 rgba(0,0,0,.04)` (`globals.css:53-56`); dark dois insets brancos de 0.75px a 3% mais anel e três drops pretos a 10% (`globals.css:162-166`). Card, Popover, Dropdown, Tooltip, Dialog, Alert, Kbd, Avatar e o inset do shell usam o mesmo token.
- **Always** use o token da família quando houver: `--custom-outline-shadow` (botão outline e chips), `--custom-shadow-primary`, `-secondary`, `-destructive`, os 10 coloridos (`-green`, `-blue`, `-amber`, `-orange`, `-emerald`, `-rose`, `-red`, `-violet`, `-fuchsia`, `-sky`, fórmula light `0 0 0 .5px rgba(c,.25), 0 .5px 2px -.5px rgba(c,.18), 0 2px 4px 0 rgba(c,.12)`), `-lifted` (card sobre card) e `-chrome` (moldura de demo).
- **Always** aceite linha fina só nestes lugares, sempre atenuada: linha de tabela `border-b border-border/50 dark:border-border/40` (`registry/base-vega/ui/table.tsx:169`), divisor de seção `border-b border-border/40`, lista `divide-y divide-border/40`, rodapé de paginação `border-t border-border/50`, o `Empty` tracejado (`border-dashed border`), campos no dark (`dark:shadow-none dark:border-[0.5px] dark:border-border/50`) e hairline de marketing a `/50` até `/70`.
- **Never** feche uma caixa com `border` a 100% dentro do app, nem use `border`/`divide-*` para separar superfícies; nunca `shadow-md`, `shadow-lg` ou `ring-1 ring-foreground/10` em superfície nova.

Porquê: o anel de meio pixel a 6% separa sem ocupar espaço e some no dark, onde a aresta vem da luz (inset branco); o craft reserva a linha para "inputs, table rows and dividers", que não são superfícies e não devem parecer elevados.

## Raio e squircle

<!-- mapa: 4.4 | regras 5 -->

- **Always** escreva o par `rounded-<menor> squircle:rounded-<maior> corner-squircle`: o raio grande só vale onde `corner-shape` existe (`@custom-variant squircle`, `globals.css:18`). Pares canônicos: `rounded-md squircle:rounded-2xl` (campos, popovers, skeleton), `rounded-md squircle:rounded-xl` (menus, botão da sidebar, tabs), `rounded-[5px] squircle:rounded-xl` (tile de ícone), `rounded-lg squircle:rounded-3xl` (Card, Popover, Alert, inset), `rounded-2xl squircle:rounded-[40px]` (Dialog), `rounded-xl squircle:rounded-4xl` (Empty), `rounded-sm squircle:rounded-[14px]` (Kbd).
- **Always** derive de `--radius: 0.625rem`: `sm` 6px, `md` 8px, `lg` 10px, `xl` 14px, `2xl` 18px, `3xl` 22px, `4xl` 26px (`globals.css:261-267`); `rounded` nu (4px) e `rounded-xs` (2px) ficam fora da escala, evite.
- **Always** aninhe com raio concêntrico (interno = externo menos o recuo): `rounded-[calc(var(--radius)-5px)]` nos botões do InputGroup (`registry/base-vega/ui/input-group.tsx:78`), presets do range picker em `rounded-sm squircle:rounded-xl`.
- **Never** use `corner-round!` fora de dois casos: pílula `rounded-full` que o squircle achataria (busca da toolbar) e card envolvido por `BorderBeam`, que só desenha arco circular.

Porquê: no mesmo raio o squircle parece menor que o arco, então o raio sobe dois a três degraus só onde o browser sabe desenhá-lo; `corner-shape` não é herdado, por isso `corner-squircle` acompanha sempre.

## Superfícies

<!-- mapa: 6.2, 6.3 | regras 12 -->

- **Always** monte superfície com a mesma receita: `bg-card` ou `bg-popover` (mesmo valor) + `shadow-(--custom-shadow)` + par de raio + padding + `text-sm`. Card: `group/card flex shadow-(--custom-shadow) flex-col gap-4 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-card py-6 text-sm text-card-foreground` (`registry/base-vega/ui/card.tsx:17`).
- **Always** use `Card size="sm"` no dashboard (`py-5 gap-2`, filhos `px-5`, título `text-sm`): é o card de 36 dos 62 usos do Foglamp. Título à esquerda e controle à direita é `<CardHeader className="flex flex-row items-center justify-between gap-4">`; distância header e conteúdo se ajusta com `CardContent className="mt-2"` ou `mt-3`.
- **Always** use `shadow-(--custom-shadow)` também no Tooltip, com `bg-popover` e `text-xs` (`registry/base-vega/ui/tooltip.tsx:58`), nunca o tooltip invertido do shadcn.
- **Never** use `--custom-shadow-lifted` para "flutuar" um overlay: o que separa modal de página é o backdrop (`bg-black/20`) e a animação, não uma sombra maior.

Porquê: card e popover são o mesmo material, e um tooltip invertido lê como painel claro no dark e escuro no light (comentário em `tooltip.tsx`).

## Tipografia

<!-- mapa: 4.6, 15.2.1, 19.3, 20.5 | regras 11 -->

- **Always** viva em `text-sm` (14px) e `text-xs` (12px); `text-base` é o título de página e de card default. Degraus intermediários para dado denso e mono: `text-[13px]`, `text-[11px]`, `text-[10px]`.
- **Always** limite o peso a `font-medium` no app (títulos, rótulos, botão, badge) com `tracking-tight` em título e valor de StatCard, e `font-normal` para desfazer o `font-medium` do Button em chips; `font-semibold` e `font-[450]` só em display de marketing com `font-display`; `text-balance` em título, `text-pretty` em parágrafo de apoio, `truncate` em célula e chip com texto livre.
- **Always** use `tabular-nums` em todo número (`TableCell align="right"` já injeta `text-right tabular-nums`, `table.tsx:17-21`) e `font-mono` só para ids, chaves, código e eyebrows (`font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground`); `font-mono` resolve na Geist Mono Variable (`globals.css:228-230`).
- **Never** use `text-2xl` no app, `font-bold`, ou mono para alinhar números: dígitos tabulares em Inter resolvem.

Porquê: 501 das 594 ocorrências de tamanho no Foglamp são `text-sm` e `text-xs`; a hierarquia vem de peso 500, tracking e cor muda, não de tamanho.

## Dark mode

<!-- mapa: 4.8, 20.9 | regras 20 -->

- **Always** monte `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` (item `theme-provider`, `app/layout.tsx:23-28`) ou `theme-provider-csp` com `public/theme.js` quando a CSP não aceita script inline; `suppressHydrationWarning` no `<html>`.
- **Always** desenhe e confira os dois temas: botões mantêm sombra no dark (bevel branco inset, `--custom-shadow-primary` e `--custom-outline-shadow` redefinidos em `globals.css:180-187`); campos trocam sombra por hairline (`dark:shadow-none dark:border-[0.5px] dark:border-border/50 dark:bg-input/30`); tile colorido volta ao `dark:shadow-(--custom-shadow)` neutro; texto colorido vai de `-600` para `dark:-400`.
- **Always** use `useTheme()` só para o que o CSS não resolve (cor de série de gráfico em JS, ícone do switcher) e espere `mounted` antes de ler `resolvedTheme`.
- **Never** escreva `dark:` manual para o que um token já flipa, toque `document.documentElement.classList` à mão, ou use preto puro (`--background` dark é `oklch(0.17 0 0)`).

Porquê: medido no ar, a primeira visita abre escura mesmo com `prefers-color-scheme: light`; no dark a hierarquia inverte (sidebar mais escura que a página, card mais claro) e a aresta vem da luz, não da sombra.

## Fontes

<!-- mapa: 4.6, 21.4 | regras 11, 22 -->

- **Always** carregue pelo `base`: `@import "@fontsource-variable/inter/opsz.css"` e `@import "@fontsource-variable/geist-mono"` (`globals.css:9-10`), com `--font-sans: "Inter Variable"`, `--font-mono: "Geist Mono Variable"` e `--font-heading` igual à sans no `@theme inline` (`globals.css:227-231`); `html` e `body` em `font-sans`, `body` com `antialiased`.
- **Always** instale o item `font-display` (Host Grotesk Variable, `--font-display`) só para marketing e títulos do próprio site; o app fica inteiro em Inter.
- **Always** mantenha `--font-mono` mapeada: o Foglamp carrega Geist Mono e nunca a mapeia (o lume corrige); em projeto Next sem Fontsource, `next/font/local` com os woff2 do rsms/inter e `variable: "--font-sans"` é a alternativa documentada.
- **Never** carregue fonte por `<link>` do Google Fonts nem `next/font/google` para a Inter (build antigo, sem o eixo `opsz` e sem as variantes OpenType); `font-feature-settings: "cv11", "ss01"` é opt-in no guia, fora do `base`.

Porquê: a InterVariable completa com `opsz` é parte da cara do sistema, e o Fontsource self-hosta em Next e em Vite sem passar woff2 pela registry.

## Marketing (opcional)

<!-- mapa: 15 a 17 | regras 21 -->

- **Always** use o container `mx-auto w-full max-w-7xl px-5 sm:px-8` e títulos em `font-display text-3xl font-[450] tracking-tight text-balance sm:text-4xl` (450 é o peso mais recente; 600 nas páginas antigas), corpo `text-lg text-muted-foreground text-pretty`.
- **Always** faça CTA por cima do Button: `size="lg"` + `text-base h-10 px-4` no hero e `text-base h-11 px-5` no fechamento; o resto fica em 32 a 34px.
- **Always** construa figuras com os componentes reais e dados fake, animadas uma vez com `useInView({ once: true, amount: 0.35 })`, copy em "rise" (`opacity 0, y 12, blur(6px)` em 0.7s `EASE`), hairlines `border-border/50` a `/70` em navbar, footer e FAQ; cards continuam só com sombra; `BorderBeam` só com `corner-round!`.
- **Never** leve hex de marca, `font-display`, texturas (névoa, cutting mat) ou durações acima de 1s para dentro do app.

Porquê: o marketing é feito da matéria do produto (os mesmos cards, tabelas e gráficos) e é o único terreno onde o autor quebra as regras com intenção.

## Do guia: 01. Fundações: tokens, raios, sombras, fontes e dark mode

### Tokens de cor

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

### Raios e squircle

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

### Sombras no lugar de borda

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

### Onde a borda vale

| Aceito | Classe | Onde |
|---|---|---|
| Linha de tabela | `border-b border-border/50 dark:border-border/40` | `registry/base-vega/ui/table.tsx:169`; footer e caption idem (lume trocou os hex) |
| Divisor interno de painel | `border-b border-border/40`, nunca na última seção | telas de detalhe ([05-telas-de-detalhe](03-shell-paginas-tabelas.md)) |
| Lista | `divide-y divide-border/40` | listas densas, HoverCard de versões |
| Separador | `Separator` = `bg-border/70`, com `dark:bg-border/40` em dialogs | `registry/base-vega/ui/separator.tsx:19` |
| Estado vazio | `border-dashed border dark:border-border/50` | `registry/base-vega/ui/empty.tsx:12` |
| Input no dark | `dark:shadow-none dark:border-[0.5px] dark:border-border/50` | campos, ver acima |
| Hairline de marketing | `border-b border-border/50` a `/70` | navbar, footer, FAQ ([12-marketing](https://github.com/joaodadas/lume/blob/main/docs/guia/12-marketing.md)) |
| Header mobile do shell | `border-b border-border/50` | `app-shell` (adição do lume) |

**Never** `border` a 100% fechando uma caixa dentro do app; **Never** `ring-1 ring-foreground/10` como aresta de superfície (é o resto do shadcn que o Foglamp não retocou em Select, HoverCard e Combobox).

## Do guia: 10. Fingerprint quantitativo

### Tipografia
| Tamanho | n | Peso | n | Tracking / leading / quebra | n |
|---|---|---|---|---|---|
| `text-sm` / `text-xs` (501 de 594) | 285 / 216 | `font-medium` | 195 | `tracking-tight` (PageHeader h1, valor do StatCard) / `tracking-widest` (mono) | 28 / 7 |
| `text-base` / `text-lg` / `text-xl` | 27 / 21 / 13 | `font-normal` (desfaz o `font-medium` do Button em chips) | 42 | `tracking-[0.16em]`, `[0.18em]` (eyebrows) | 2, 1 |
| `text-3xl` / `text-4xl` / `text-2xl` | 12 / 12 / 1 | `font-semibold` / `font-black` / `font-bold` | 35 / 2 / 1 | `leading-relaxed` / `leading-none` / `leading-tight` / `leading-normal` (CardTitle) | 36 / 11 / 5 / 3 |
| `text-[11px]` / `[13px]` / `[10px]` / `[14px]` / `[15px]` (degrau entre xs e sm para dados densos) | 43 / 30 / 28 / 6 / 5 | `font-[450]` (só marketing, `font-display`) | 9 | `truncate` / `text-balance` / `text-pretty` / `whitespace-nowrap` | 129 / 43 / 14 / 22 |
| `font-mono` / `font-sans` / `font-display` / `font-heading` | 50 / 28 / 24 / 6 | `tabular-nums` (só 4 strings o combinam com `font-mono`: números ficam em Inter) | 162 | `uppercase` / `capitalize` (o Badge é `capitalize`) / `line-clamp-*` | 12 / 7 / 7 |

Eyebrow: `font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground`; micro-rótulo: `text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60`.

### Espaçamento
| `gap-*` | n | `px-*` | n | `py-*` | n | `p-*` | n | Margens | n |
|---|---|---|---|---|---|---|---|---|---|
| `gap-2` / `gap-4` | 239 / 144 | `px-5` / `px-8` | 68 / 55 | `py-1.5` / `py-5` | 41 / 36 | `p-0` / `p-1` | 22 / 19 | `mt-2` / `mt-1` | 54 / 52 |
| `gap-1.5` / `gap-1` / `gap-3` | 126 / 126 / 114 | `px-2` / `px-1` / `px-3` | 46 / 36 / 32 | `py-1` / `py-3` / `py-2` | 34 / 28 / 23 | `p-6` / `p-0.5` / `p-2` | 16 / 16 / 15 | `mt-3` / `mt-5` / `-mt-2` | 32 / 22 / 15 |
| `gap-6` / `gap-2.5` / `gap-0.5` / `gap-5` / `gap-8` | 36 / 36 / 26 / 16 / 9 | `px-6` / `px-2.5` / `px-4` | 27 / 21 / 15 | `py-2.5` / `py-0` / `py-0.5` | 20 / 19 / 12 | `p-3` / `p-4` / `p-5` | 13 / 4 / 4 | `mb-4`; `space-y-*` + `space-x-*` | 13; 11 no total |

Fora da escala de 0.5: `size-3.25` 34, `p-0.75` 11, `gap-0.75` 10, `gap-1.75` 7, `mt-0.75` 6, `gap-1.25` 5, `px-8.25` 2 (células). Button: `gap-[4.5px]` (xs), `gap-[5px]` (sm), `gap-[5.5px]` (default), `gap-1.5` (lg). Layout: `flex-col` 417, `items-center` 603, `justify-between` 94, `grid` 126. Breakpoints padrão (`sm` 640, `md` 768, `lg` 1024, `xl` 1280; `@md` 448, `@lg` 512): `sm:` 338 (quase tudo marketing), `lg:` 54, `md:` 46, `xl:` 6, `2xl:` 0, `@container` 3.

### Raio e squircle
| Classe | n | Par squircle (raio sobe dois degraus) | n | Onde |
|---|---|---|---|---|
| `rounded-full` / `rounded-md` / `rounded-lg` | 145 / 93 / 50 | `rounded-md squircle:rounded-2xl` | 24 | inputs, popovers, Skeleton, Segmented |
| `rounded-sm` / `rounded` / `rounded-xl` / `rounded-xs` | 20 / 18 / 14 / 9 | `rounded-md squircle:rounded-xl` | 19 | itens de menu, botões de sidebar, pílulas internas |
| `rounded-2xl` / `rounded-3xl` / `rounded-none` | 8 / 5 / 4 | `rounded-[5px] squircle:rounded-xl` | 14 | tiles de ícone 18 px |
| `rounded-[5px]` / `[2px]` / `[36px]` | 14 / 8 / 4 | `rounded-lg squircle:rounded-3xl` / `rounded-lg squircle:rounded-2xl` | 12 / 8 | `Card`, inset do app (contagem no Foglamp) |
| `corner-squircle` / `squircle:` | 124 / 114 | `rounded-2xl squircle:rounded-[40px]` / `rounded-xl squircle:rounded-4xl` / `rounded-sm squircle:rounded-[14px]` | 2 / 2 / 1 | Dialog e AlertDialog / `Empty` / `Kbd` |
| `corner-round!` | 6 | `rounded-full squircle:rounded-full` | 4 | pílulas que o squircle achataria (BorderBeam, SearchInput, FilterSelect) |

Escala: `--radius: 0.625rem` (10 px); `sm` 6, `md` 8, `lg` 10, `xl` 14, `2xl` 18, `3xl` 22, `4xl` 26 (`registry/base-vega/styles/globals.css:46,261-267`).

### Sombras
| Token / classe | n | Papel |
|---|---|---|
| `shadow-(--custom-shadow)` | 64 (+39 `dark:`) | a "borda" do sistema: cards, inputs, kbd, popovers, pílula ativa |
| `shadow-(--custom-outline-shadow)` / `-lifted` / `-chrome` | 4 (+4 dark) / 3 / 1 | botão outline, chips e filtros / cenas sobre cenas / frame do demo |
| `shadow-[var(--custom-shadow-{primary,secondary,destructive})]`; `shadow-[var(--custom-shadow-{green,blue,amber,orange,emerald,rose,red,violet,fuchsia,sky})]` | 2, 2, 1; 1 cada | variants de Button e Badge; badges coloridos |
| `shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)]` + `dark:shadow-(--custom-shadow)` | 35 | tiles de ícone coloridos no light ("`--custom-shadow` lava no claro") |
| `shadow-md ring-1 ring-foreground/10` / `ring-foreground/5` / `ring-[0.5px] ring-foreground/10` | 5 / 1 / 1 | popups (context-menu, menubar, hover-card, combobox; select); dropdown e popover usam só `shadow-(--custom-shadow)` |
| `shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50` | 10 primitivos | campo no dark: sombra vira hairline (input, textarea, input-group, input-otp, select, native-select, combobox, kbd, toggle, toggle-group) |
| `shadow-[inset_0_-1px_0_0] shadow-border/50`; `shadow-md` / `-lg` / `-xs` / `-sm` / `-xl` / `-2xl`; `shadow-none` / `dark:shadow-none` | 3; 6 / 3 / 4 / 3 / 2 / 1; 9 / 12 | régua do thead sticky; escala Tailwind (popups, sheet, tooltip de gráfico); desligar no escuro ou dentro de grupo |

### z-index e isolate
| Camada | Valor | Onde (totais: `z-10` 31, `z-50` 25, `z-20` 9, `z-0` 5, `-z-10` 4, `z-30` 3, `isolate` 21; sem token `--z-*`) |
|---|---|---|
| Portal e `fixed` | `z-50` | `isolate z-50` no `Positioner` de todo popup Base UI + `z-50` no `Popup`; `fixed inset-0 isolate z-50` no backdrop e `fixed ... z-50` no conteúdo de Dialog e AlertDialog; Sheet e Drawer; 23 de 25 em `packages/ui` |
| Cromo de página / controles flutuantes | `z-30` / `z-20` | entalhe do chat, popover do nó do FlowMap, texto do CTA sobre a névoa / handles de resize, `LoadingIndicator` dos charts, `SidebarRail` |
| Conteúdo sobre fundo ou irmão | `z-10` | barras da timeline, thead sticky (`sticky top-0 z-10 bg-background`), busca sticky do FilterSelect, container da sidebar desktop (`fixed inset-y-0 z-10`), rótulo sobre a pílula em voo (`relative z-10`) |
| Base / atrás | `z-0` / `-z-10` | gridlines, pílula das abas (`absolute inset-0 z-0`) / fundos decorativos dentro de um pai `relative isolate`; três degraus (10, 20, 30) dentro da página, nada empilhado "contra" outra página |

### `border*` e `divide*`: as exceções (`border` nua 64, `border-b` 45, `border-t` 26, `border-l-2` 5, `divide-y` 18)
| Onde | String | Regra |
|---|---|---|
| Linha de tabela (`registry/base-vega/ui/table.tsx:167-176`); footer e caption (`:130,232`) | `border-b dark:border-border/40 border-border/50`, hover apaga a própria e a anterior; `border-t border-border/50 dark:border-border/40` (no Foglamp era hex `#EBEBEB`/`#1E1E1E`/`#2A2A2A`) | aceita; corrigido no lume |
| `Empty` (`ui/empty.tsx`) e `EmptyState` | `border-dashed border dark:border-border/50` | a única caixa fechada tracejada |
| Campos no dark (10 primitivos); `TabsTrigger` (`ui/tabs.tsx:63`) | `dark:border-[0.5px] dark:border-border/50`; `border border-transparent` (reserva espaço para `focus-visible:border-ring`) | hairline no lugar da sombra |
| Separadores de seção em painéis de detalhe; listas | `border-b border-border/40` / `border-t border-border/40`, nunca na última seção, `-mx-5 px-5` para correr de ponta a ponta; `divide-y divide-border/40` (14) + `hover:border-transparent hover:bg-muted/50` e `has-[+a:hover]:border-transparent` no anterior | aceita |
| Linhas de configuração; rodapé de paginação | `border-b border-border/50 py-3 last:border-b-0`; `border-t border-border/50 dark:border-border/40` | aceita |
| Trilhos de status; chips com estado | `border-l-2 border-rose-500` (erro), `border-amber-500` (abortado), `border-transparent` (ok); `border-rose-500/40 ... dark:shadow-[0_0_0_1px_rgba(244,63,94,0.4)]` (no dark a borda vira sombra); danger zone `border-destructive/40` | aceita |
| Marketing | `border-t border-border/50` (footer), `/60` (pricing), `/70` (FAQ); navbar `border-b transition-colors duration-200` só depois de rolar | aceita só fora do app |
| Convenção | sempre `border-border` atenuada (`/40` denso, `/50` listas, `/60` a `/70` marketing), sempre `border-b` ou `border-t` isolada | nunca `border` a 100% nem caixa fechada no app |

### Valores arbitrários `[...]` (cerca de 700)
| Valor | n | Motivo |
|---|---|---|
| `text-[11px]` / `[13px]` / `[10px]` / `[14px]` / `[15px]` / `[12px]` / `[9px]` | 43 / 30 / 28 / 6 / 5 / 5 / 2 | degraus intermediários da escala |
| `transition-[color,box-shadow]`; `focus-visible:ring-[1.5px]` / `aria-invalid:ring-[1.5px]` / `focus-visible:ring-[3px]` | 19; 15 / 10 / 5 | hover de fundo instantâneo; anel fino (o 3px é resto do base-vega) |
| `rounded-[5px]` / `rounded-[2px]`; `shadow-[inset_0_0_0_1px_rgba(...),0_2px_6px_-2px_rgba(...)]` | 14 / 8; 35 | tiles de ícone, seta do tooltip; tiles coloridos no light |
| `font-[450]` / `font-[470]`; `ease-[cubic-bezier(0.22,1,0.36,1)]` / `duration-[0.35s]` | 9 / DeltaBadge; 6 / 3 | peso intermediário (Host Grotesk; delta do stat); accordion, navigation menu, range-picker |
| `squircle:rounded-[36px]` / `[40px]` / `[28px]` / `[14px]`; `data-open:zoom-in-[96%]`, `data-closed:zoom-out-[99%]`, `supports-backdrop-filter:backdrop-blur-[2px]` | 5 / 4 / 1 / 1; 2, 2, 3 | raios squircle fora da escala (Foglamp, scan e setup); dialogs e overlays |
| `grid-cols-[9.5rem_minmax(0,1fr)_3.25rem]`, `lg:grid-cols-[15rem_minmax(0,1fr)_6.5rem]`; `max-h-[calc(100svh-14rem)]` / `[calc(100svh-6rem)]` / `[calc(100svh-4rem)]` | 4 / 4; 3 / 2 / 2 | grades do waterfall; painéis que cabem na viewport |
| `gap-[4.5px]` / `[5px]` / `[5.5px]`, `stroke-[1.5px]`, `tracking-[0.16em]`, `border-[1.5px]`, `dark:border-[0.5px]`, `rounded-[calc(var(--radius)-5px)]` | 1 a 3 cada | ajustes ópticos |
| Hex em classe: `#8b5e34`/`#c9a888` (marrom Traces), `#0090FD` (azul do chat), `#B8B8B8`/`#5B5B5B` (ícone de busca), `#EFEFEF`/`#252525` (hairlines) | cerca de 20 distintos | no lume viram `text-muted-foreground/50` e `border-border/50`; hex só quando a cor é dado, com comentário |

### Paletas cromáticas
| Paleta | n | Significado fixo | Paleta | n | Significado fixo |
|---|---|---|---|---|---|
| emerald / amber | 99 / 98 | sucesso, pass, embedding / aviso, abortado, agent | fuchsia / yellow / green | 45 / 32 / 32 | evals / alerts / check de cópia, heat baixo |
| rose / red | 82 / 68 | erro, falha (`--custom-shadow-destructive` é rose-500) / `--destructive` (`oklch(0.577 0.245 27.325)`), delta ruim, heat alto | neutral / lime | 31 / 19 | botão default, `other` (no lume no lugar de slate) / highlight em prosa |
| sky / orange | 65 / 58 | sessions / agents, custo de input | slate / zinc / gray / stone | 9 / 2 / 0 / 0 | proibidos: o lume trocou slate por neutral em `span-type` |
| violet / blue | 50 / 48 | llm / tool, custo de output | white / black / teal / cyan / pink | 14 / 5 / 3 / 5 / 7 | sem papel |

Tons: `-500` 216, `-400` 140, `-600` 107, `-500/10` 31, `-700` 29, `-100` 28, `-300` 25, `-500/20` 24, `-950` 22, `-500/15` 20. Molde: tile `bg-{c}-100 text-{c}-500 dark:bg-{c}-950`; badge `bg-{c}-500/10 text-{c}-700 dark:bg-{c}-500/15 dark:text-{c}-300`.

### Ícones (`@tabler/icons-react`, 241 distintos, 101 `*Filled`, nenhuma outra lib)
| Top 20 por ocorrência | Tamanhos (classe nua) |
|---|---|
| IconAlertTriangle 73, IconChevronRight 43, IconSitemapFilled 38, IconArrowUpRight 38, IconAlertTriangleFilled 38, IconTool 37, IconGhostFilled 36, IconCircleCheckFilled 33, IconUserFilled 32, IconBoltFilled 28, IconCheck 26, IconGaugeFilled 25, IconCoinFilled 25, IconAffiliateFilled 25, IconChevronDown 23, IconTrashFilled 20, IconPlus 20, IconMessage2Filled 19, IconGhost 16, IconClockFilled 16 | `size-3.5` 154, `size-4` 130, `size-3` 99, `size-3.25` 34, `size-4.5` 25, `size-6` 24, `size-5` 14, `size-7` 13; defaults por seletor `[&_svg:not([class*='size-'])]:size-4` 26 (primitivos shadcn), `:size-3.5` no Button, `:size-3!` no Badge, `:size-[11px]` no Button xs; `strokeWidth={2.4}` no `IconPlus` de "Create" |
| Nav: `icon` outline inativo e `activeIcon` Filled ativo, crossfade `transition-opacity duration-100 ease-in-out` (`registry/base-vega/blocks/app-shell/nav-icon.tsx:41,48`) | `IconLoader` (não `IconLoader2`) no Spinner e no toast de loading |

### Acessibilidade
| Atributo | n | Uso |
|---|---|---|
| `aria-label` / `aria-hidden` / `sr-only` | 57 / 51 / 14 | botão só de ícone; decorativos (névoa, glow, ícones); sidebar, field, sheet, dialog, breadcrumb |
| `role` | 28 | `status` (Spinner, TextShimmerLoader), `alert` (Alert, FieldError), `separator` com `aria-orientation="vertical"` nos handles, `tab`/`tablist`, `user`/`assistant` nas bolhas |
| `aria-pressed` / `aria-expanded` / `aria-invalid` / `aria-current` / `aria-live` | 12 / 10 / 9 / 4 / 1 | pílulas e filtros; gatilhos; campos; nav; `polite` |
| `tabIndex`; teclado | 5 | linhas interativas (`tabIndex 0` + Enter e Espaço, `table.tsx:147-163`); `Cmd/Ctrl+B` na sidebar, `Kbd` dentro de botões espelha o atalho, foco de menu é o próprio hover (`focus:bg-accent`) |
