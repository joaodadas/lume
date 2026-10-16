# Optical Alignment

Original: https://craft.gustavofior.com/optical-alignment (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/typography/optical-alignment.mdx. Seção:
Typography. Status no Foglamp: integral (mapa 3.4).

## Regra

Centralizar pela caixa do ícone nem sempre parece centralizado: o peso visual de um triângulo, de
uma estrela ou de uma seta não fica no meio do bounding box. Alinhamento óptico é empurrar 1 ou 2px
até parecer certo e deixar o empurrão no código, com comentário dizendo o porquê. O teste é o do
blur: aplique `filter: blur(8px)` no inspector (ou aperte os olhos); a mancha mostra onde o peso
está, e a distância até o centro é o nudge. Vale para padding também: ícone tem ar dentro da caixa,
então o lado do botão que segura o ícone perde alguns px de padding. Vale para tipografia: a Inter
tem eixo `opsz`, e o browser escolhe o desenho certo por tamanho com `font-optical-sizing: auto`,
desde que a fonte carregada traga o eixo.

## Valores

<!-- skill:start -->
| Caso | String exata | Arquivo |
|---|---|---|
| Padding do lado do ícone, `Button` default | `h-8 gap-[5.5px] px-3 ... has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5` | registry/base-vega/ui/button.tsx:37 |
| Idem, `xs` / `sm` / `lg` | `pl-2` e `pr-2`; `pl-[9px]` e `pr-[9px]`; `pl-3` e `pr-3` | registry/base-vega/ui/button.tsx:34,35,38 |
| Ícone ao lado de texto `text-sm` ou `text-xs` | `mt-px` (desce 1px) ou `mb-px` (sobe 1px), decidido por ícone | registry/base-vega/components/stat-card.tsx:121,193,204; blocks/range-picker/range-picker.tsx:175 |
| Seta de link externo em chip | `size-3.5 shrink-0 -ml-0.5 mt-px text-muted-foreground` | registry/base-vega/components/context-chip.tsx:122 |
| Ícone do `Alert` ao lado do título | `*:[svg]:row-span-2 *:[svg]:translate-y-0.5` | registry/base-vega/ui/alert.tsx:9 |
| Checkbox ou radio dentro de `Field` horizontal | `[&>[role=checkbox],[role=radio]]:mt-px` | registry/base-vega/ui/field.tsx:63,65 |
| Slot de ações do `PageHeader` | `flex items-center gap-2 translate-y-1 empty:hidden` (comentário: desce para o picker alinhar com o texto do título) | registry/base-vega/components/page-header.tsx:99-102 |
| Submenu da sidebar e seu item | `translate-x-px` na lista, `-translate-x-px` no item, para a borda esquerda casar com a linha | registry/base-vega/ui/sidebar.tsx:647,685 |
| Seta do tooltip | `translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]` | registry/base-vega/ui/tooltip.tsx:64 |
| Eixo `opsz` da Inter | `@import "@fontsource-variable/inter/opsz.css"` | registry/base-vega/styles/globals.css:9 |

**Always**: nudge de 1px com `mt-px`, `mb-px`, `ml-px`, `mr-px`, `translate-x-px`; comentário de uma
linha dizendo o motivo. **Never**: nudge global em todo `svg`; `translate` maior que 2px para
"centralizar" (é bug de layout, não óptica); Inter sem o eixo `opsz` (a versão do `next/font/google`
perde o eixo, por isso o Foglamp self-hosta).
<!-- skill:end -->

Aspas penduradas (`hanging-punctuation: first`, fallback `text-indent: -0.42em`) são do artigo; o
Foglamp não tem prosa com citação e o lume não traz utilitário para isso. Círculo e triângulo
parecem menores que um quadrado na mesma caixa; ao dimensionar ícones lado a lado, compense no olho.

## Onde aparece no Foglamp

Contagem por grep nos `.tsx`: `mb-px` 32, `mt-px` 26, `ml-px` 5, `mr-px` 5, `translate-x-px` e
`-translate-x-px` 1 cada. Exemplos: `apps/web/src/app/(app)/settings/settings-client.tsx:299,304`
(`IconXFilled` e `IconCheckFilled` com `mb-px size-3.25`),
`traces/[traceId]/trace-detail-client.tsx:1042` (`-ml-0.5 mt-px size-3.5`),
`agents/[name]/agent-detail-client.tsx:901`
(`IconSitemapFilled className="size-3.5 shrink-0 text-emerald-500 mt-px"`). Comentários que
registram o nudge: `apps/web/src/components/app/page-parts.tsx:124` e
`marketing/demo/demo-chrome.tsx:142`. `apps/web/src/app/layout.tsx:11-15` explica por que a Inter é
self-hosted: manter o eixo `opsz`.

## No lume

- Itens: `button`, `alert`, `field`, `page-header`, `stat-card`, `context-chip`, `sidebar`, `tooltip` e `base` (fontes via Fontsource com `opsz`, docs/DECISOES.md).
- FRONTEND.md: seção 9 (Botões), seção 12 (Ícones) e seção 23 (Fontes). Guia: `docs/guia/01-fundacoes.md` e `docs/guia/02-primitivos.md`.
- Os botões do lume já descontam o padding do lado do ícone; não some `pl-*` ou `pr-*` por cima. Ícone sem classe de tamanho dentro de `Button` vira `size-3.5` (button.tsx:10), e esse tamanho é o que os nudges da tabela assumem.
