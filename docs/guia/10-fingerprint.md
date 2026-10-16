# 10. Fingerprint quantitativo

Origem: mapa cap. 19.3. Só tabelas: contagens por `grep` em `apps/web/src` + `packages/ui/src` do Foglamp (`2bc3bb5`), sem prefixo de variante salvo indicação. Servem para responder "qual é o valor normal" antes de inventar um. Detalhe por tema em [01-fundacoes](./01-fundacoes.md), [02-primitivos](./02-primitivos.md) e [09-movimento](./09-movimento.md).
<!-- skill:start -->
## Tipografia
| Tamanho | n | Peso | n | Tracking / leading / quebra | n |
|---|---|---|---|---|---|
| `text-sm` / `text-xs` (501 de 594) | 285 / 216 | `font-medium` | 195 | `tracking-tight` (PageHeader h1, valor do StatCard) / `tracking-widest` (mono) | 28 / 7 |
| `text-base` / `text-lg` / `text-xl` | 27 / 21 / 13 | `font-normal` (desfaz o `font-medium` do Button em chips) | 42 | `tracking-[0.16em]`, `[0.18em]` (eyebrows) | 2, 1 |
| `text-3xl` / `text-4xl` / `text-2xl` | 12 / 12 / 1 | `font-semibold` / `font-black` / `font-bold` | 35 / 2 / 1 | `leading-relaxed` / `leading-none` / `leading-tight` / `leading-normal` (CardTitle) | 36 / 11 / 5 / 3 |
| `text-[11px]` / `[13px]` / `[10px]` / `[14px]` / `[15px]` (degrau entre xs e sm para dados densos) | 43 / 30 / 28 / 6 / 5 | `font-[450]` (só marketing, `font-display`) | 9 | `truncate` / `text-balance` / `text-pretty` / `whitespace-nowrap` | 129 / 43 / 14 / 22 |
| `font-mono` / `font-sans` / `font-display` / `font-heading` | 50 / 28 / 24 / 6 | `tabular-nums` (só 4 strings o combinam com `font-mono`: números ficam em Inter) | 162 | `uppercase` / `capitalize` (o Badge é `capitalize`) / `line-clamp-*` | 12 / 7 / 7 |

Eyebrow: `font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground`; micro-rótulo: `text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60`.

## Espaçamento
| `gap-*` | n | `px-*` | n | `py-*` | n | `p-*` | n | Margens | n |
|---|---|---|---|---|---|---|---|---|---|
| `gap-2` / `gap-4` | 239 / 144 | `px-5` / `px-8` | 68 / 55 | `py-1.5` / `py-5` | 41 / 36 | `p-0` / `p-1` | 22 / 19 | `mt-2` / `mt-1` | 54 / 52 |
| `gap-1.5` / `gap-1` / `gap-3` | 126 / 126 / 114 | `px-2` / `px-1` / `px-3` | 46 / 36 / 32 | `py-1` / `py-3` / `py-2` | 34 / 28 / 23 | `p-6` / `p-0.5` / `p-2` | 16 / 16 / 15 | `mt-3` / `mt-5` / `-mt-2` | 32 / 22 / 15 |
| `gap-6` / `gap-2.5` / `gap-0.5` / `gap-5` / `gap-8` | 36 / 36 / 26 / 16 / 9 | `px-6` / `px-2.5` / `px-4` | 27 / 21 / 15 | `py-2.5` / `py-0` / `py-0.5` | 20 / 19 / 12 | `p-3` / `p-4` / `p-5` | 13 / 4 / 4 | `mb-4`; `space-y-*` + `space-x-*` | 13; 11 no total |

Fora da escala de 0.5: `size-3.25` 34, `p-0.75` 11, `gap-0.75` 10, `gap-1.75` 7, `mt-0.75` 6, `gap-1.25` 5, `px-8.25` 2 (células). Button: `gap-[4.5px]` (xs), `gap-[5px]` (sm), `gap-[5.5px]` (default), `gap-1.5` (lg). Layout: `flex-col` 417, `items-center` 603, `justify-between` 94, `grid` 126. Breakpoints padrão (`sm` 640, `md` 768, `lg` 1024, `xl` 1280; `@md` 448, `@lg` 512): `sm:` 338 (quase tudo marketing), `lg:` 54, `md:` 46, `xl:` 6, `2xl:` 0, `@container` 3.

## Raio e squircle
| Classe | n | Par squircle (raio sobe dois degraus) | n | Onde |
|---|---|---|---|---|
| `rounded-full` / `rounded-md` / `rounded-lg` | 145 / 93 / 50 | `rounded-md squircle:rounded-2xl` | 24 | inputs, popovers, Skeleton, Segmented |
| `rounded-sm` / `rounded` / `rounded-xl` / `rounded-xs` | 20 / 18 / 14 / 9 | `rounded-md squircle:rounded-xl` | 19 | itens de menu, botões de sidebar, pílulas internas |
| `rounded-2xl` / `rounded-3xl` / `rounded-none` | 8 / 5 / 4 | `rounded-[5px] squircle:rounded-xl` | 14 | tiles de ícone 18 px |
| `rounded-[5px]` / `[2px]` / `[36px]` | 14 / 8 / 4 | `rounded-lg squircle:rounded-3xl` / `rounded-lg squircle:rounded-2xl` | 12 / 8 | `Card`, inset do app (contagem no Foglamp) |
| `corner-squircle` / `squircle:` | 124 / 114 | `rounded-2xl squircle:rounded-[40px]` / `rounded-xl squircle:rounded-4xl` / `rounded-sm squircle:rounded-[14px]` | 2 / 2 / 1 | Dialog e AlertDialog / `Empty` / `Kbd` |
| `corner-round!` | 6 | `rounded-full squircle:rounded-full` | 4 | pílulas que o squircle achataria (BorderBeam, SearchInput, FilterSelect) |

Escala: `--radius: 0.625rem` (10 px); `sm` 6, `md` 8, `lg` 10, `xl` 14, `2xl` 18, `3xl` 22, `4xl` 26 (`registry/base-vega/styles/globals.css:46,261-267`).

## Sombras
| Token / classe | n | Papel |
|---|---|---|
| `shadow-(--custom-shadow)` | 64 (+39 `dark:`) | a "borda" do sistema: cards, inputs, kbd, popovers, pílula ativa |
| `shadow-(--custom-outline-shadow)` / `-lifted` / `-chrome` | 4 (+4 dark) / 3 / 1 | botão outline, chips e filtros / cenas sobre cenas / frame do demo |
| `shadow-[var(--custom-shadow-{primary,secondary,destructive})]`; `shadow-[var(--custom-shadow-{green,blue,amber,orange,emerald,rose,red,violet,fuchsia,sky})]` | 2, 2, 1; 1 cada | variants de Button e Badge; badges coloridos |
| `shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)]` + `dark:shadow-(--custom-shadow)` | 35 | tiles de ícone coloridos no light ("`--custom-shadow` lava no claro") |
| `shadow-md ring-1 ring-foreground/10` / `ring-foreground/5` / `ring-[0.5px] ring-foreground/10` | 5 / 1 / 1 | popups (context-menu, menubar, hover-card, combobox; select); dropdown e popover usam só `shadow-(--custom-shadow)` |
| `shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50` | 10 primitivos | campo no dark: sombra vira hairline (input, textarea, input-group, input-otp, select, native-select, combobox, kbd, toggle, toggle-group) |
| `shadow-[inset_0_-1px_0_0] shadow-border/50`; `shadow-md` / `-lg` / `-xs` / `-sm` / `-xl` / `-2xl`; `shadow-none` / `dark:shadow-none` | 3; 6 / 3 / 4 / 3 / 2 / 1; 9 / 12 | régua do thead sticky; escala Tailwind (popups, sheet, tooltip de gráfico); desligar no escuro ou dentro de grupo |

## z-index e isolate
| Camada | Valor | Onde (totais: `z-10` 31, `z-50` 25, `z-20` 9, `z-0` 5, `-z-10` 4, `z-30` 3, `isolate` 21; sem token `--z-*`) |
|---|---|---|
| Portal e `fixed` | `z-50` | `isolate z-50` no `Positioner` de todo popup Base UI + `z-50` no `Popup`; `fixed inset-0 isolate z-50` no backdrop e `fixed ... z-50` no conteúdo de Dialog e AlertDialog; Sheet e Drawer; 23 de 25 em `packages/ui` |
| Cromo de página / controles flutuantes | `z-30` / `z-20` | entalhe do chat, popover do nó do FlowMap, texto do CTA sobre a névoa / handles de resize, `LoadingIndicator` dos charts, `SidebarRail` |
| Conteúdo sobre fundo ou irmão | `z-10` | barras da timeline, thead sticky (`sticky top-0 z-10 bg-background`), busca sticky do FilterSelect, container da sidebar desktop (`fixed inset-y-0 z-10`), rótulo sobre a pílula em voo (`relative z-10`) |
| Base / atrás | `z-0` / `-z-10` | gridlines, pílula das abas (`absolute inset-0 z-0`) / fundos decorativos dentro de um pai `relative isolate`; três degraus (10, 20, 30) dentro da página, nada empilhado "contra" outra página |

## `border*` e `divide*`: as exceções (`border` nua 64, `border-b` 45, `border-t` 26, `border-l-2` 5, `divide-y` 18)
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

## Valores arbitrários `[...]` (cerca de 700)
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

## Paletas cromáticas
| Paleta | n | Significado fixo | Paleta | n | Significado fixo |
|---|---|---|---|---|---|
| emerald / amber | 99 / 98 | sucesso, pass, embedding / aviso, abortado, agent | fuchsia / yellow / green | 45 / 32 / 32 | evals / alerts / check de cópia, heat baixo |
| rose / red | 82 / 68 | erro, falha (`--custom-shadow-destructive` é rose-500) / `--destructive` (`oklch(0.577 0.245 27.325)`), delta ruim, heat alto | neutral / lime | 31 / 19 | botão default, `other` (no lume no lugar de slate) / highlight em prosa |
| sky / orange | 65 / 58 | sessions / agents, custo de input | slate / zinc / gray / stone | 9 / 2 / 0 / 0 | proibidos: o lume trocou slate por neutral em `span-type` |
| violet / blue | 50 / 48 | llm / tool, custo de output | white / black / teal / cyan / pink | 14 / 5 / 3 / 5 / 7 | sem papel |

Tons: `-500` 216, `-400` 140, `-600` 107, `-500/10` 31, `-700` 29, `-100` 28, `-300` 25, `-500/20` 24, `-950` 22, `-500/15` 20. Molde: tile `bg-{c}-100 text-{c}-500 dark:bg-{c}-950`; badge `bg-{c}-500/10 text-{c}-700 dark:bg-{c}-500/15 dark:text-{c}-300`.

## Ícones (`@tabler/icons-react`, 241 distintos, 101 `*Filled`, nenhuma outra lib)
| Top 20 por ocorrência | Tamanhos (classe nua) |
|---|---|
| IconAlertTriangle 73, IconChevronRight 43, IconSitemapFilled 38, IconArrowUpRight 38, IconAlertTriangleFilled 38, IconTool 37, IconGhostFilled 36, IconCircleCheckFilled 33, IconUserFilled 32, IconBoltFilled 28, IconCheck 26, IconGaugeFilled 25, IconCoinFilled 25, IconAffiliateFilled 25, IconChevronDown 23, IconTrashFilled 20, IconPlus 20, IconMessage2Filled 19, IconGhost 16, IconClockFilled 16 | `size-3.5` 154, `size-4` 130, `size-3` 99, `size-3.25` 34, `size-4.5` 25, `size-6` 24, `size-5` 14, `size-7` 13; defaults por seletor `[&_svg:not([class*='size-'])]:size-4` 26 (primitivos shadcn), `:size-3.5` no Button, `:size-3!` no Badge, `:size-[11px]` no Button xs; `strokeWidth={2.4}` no `IconPlus` de "Create" |
| Nav: `icon` outline inativo e `activeIcon` Filled ativo, crossfade `transition-opacity duration-100 ease-in-out` (`registry/base-vega/blocks/app-shell/nav-icon.tsx:41,48`) | `IconLoader` (não `IconLoader2`) no Spinner e no toast de loading |

## Acessibilidade
| Atributo | n | Uso |
|---|---|---|
| `aria-label` / `aria-hidden` / `sr-only` | 57 / 51 / 14 | botão só de ícone; decorativos (névoa, glow, ícones); sidebar, field, sheet, dialog, breadcrumb |
| `role` | 28 | `status` (Spinner, TextShimmerLoader), `alert` (Alert, FieldError), `separator` com `aria-orientation="vertical"` nos handles, `tab`/`tablist`, `user`/`assistant` nas bolhas |
| `aria-pressed` / `aria-expanded` / `aria-invalid` / `aria-current` / `aria-live` | 12 / 10 / 9 / 4 / 1 | pílulas e filtros; gatilhos; campos; nav; `polite` |
| `tabIndex`; teclado | 5 | linhas interativas (`tabIndex 0` + Enter e Espaço, `table.tsx:147-163`); `Cmd/Ctrl+B` na sidebar, `Kbd` dentro de botões espelha o atalho, foco de menu é o próprio hover (`focus:bg-accent`) |
<!-- skill:end -->

## O que não copiar

- As contagens são do Foglamp, não metas: `text-[11px]` com 43 usos continua valor arbitrário e pede comentário de uma linha.
- `slate` e `zinc` (11 usos), hex de ícone e de hairline, `focus-visible:ring-[3px]` em componente novo, `space-y-*`.
