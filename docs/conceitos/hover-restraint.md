# Hover Restraint

Original: https://craft.gustavofior.com/hover-restraint (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/hover-restraint.mdx. Seção: Motion.
Status no Foglamp: parcial (mapa 3.4).

## Regra

Hover é a interação mais frequente que existe: ao varrer o cursor por uma nav você cruza dez itens
num segundo. Se cada um faz fade, a interface fica sempre alguns frames atrás do ponteiro e parece
lenta mesmo sem estar. Quanto mais frequente a interação, menos animação ela aguenta: hover é
instantâneo por padrão. A exceção é o tooltip, que precisa de um atraso para não abrir de passagem;
depois que o primeiro abriu, os vizinhos abrem na hora. A mesma lógica vale para ação por atalho de
teclado: quem aperta Cmd+B quarenta vezes por dia não quer ver o painel chegar deslizando. A linha é
frequência e intenção, não dispositivo: um modal que abre uma vez por sessão pode animar; um painel
que você vira quarenta vezes por dia, não.

## Valores

<!-- skill:start -->
| Caso | String ou valor exato | Arquivo |
|---|---|---|
| Hover instantâneo em item de nav | `transition-[width,height,padding]` no botão da sidebar: `hover:bg-sidebar-accent` não transiciona | registry/base-vega/ui/sidebar.tsx:480 |
| Checkbox | `grid place-content-center text-current transition-none [&>svg]:size-2.5` no indicador | registry/base-vega/ui/checkbox.tsx:22 |
| Link do navigation menu | `flex items-center gap-1.5 rounded-lg p-2 text-sm transition-none outline-none hover:bg-muted ...` | registry/base-vega/ui/navigation-menu.tsx:134 |
| Dias do calendário no range picker | `**:data-day:transition-none` | registry/base-vega/blocks/range-picker/range-picker.tsx:208 |
| Botão (teto do hover animado) | `transition-all hover:duration-150` | registry/base-vega/ui/button.tsx:10 |
| Tooltip: padrão | `TooltipProvider` com `delay = 0` | registry/base-vega/ui/tooltip.tsx:9-11 |
| Tooltip em tabela e timeline | `<TooltipProvider delay={150}>` envolvendo a página | Foglamp `app/(app)/traces/traces-client.tsx:642`, `sessions/sessions-client.tsx:288`, `agents/agents-client.tsx:227`, `workflows/workflows-client.tsx:229`, `evals/evals-client.tsx:841`, `traces/[traceId]/trace-detail-client.tsx:1078`, `components/app/trace-timeline.tsx:503` |
| Tooltip em prosa | `delay={200}` | Foglamp `apps/web/src/components/app/prompt-prose.tsx:197` |
| Tab segmentada | sem `transition-colors` no texto; `hover:transition-colors` só no estado inativo, para o hover suavizar e a troca de aba ser seca | Foglamp `app/(app)/settings/org/org-settings-client.tsx:158-166` |
| Sidebar por atalho (Cmd/Ctrl+B) | `transition-[left,right,width] duration-200 ease-linear` (anima mesmo por teclado: contra o artigo) | registry/base-vega/ui/sidebar.tsx:235 |
| Craft | tooltip: o primeiro espera 400 a 700ms, os vizinhos abrem na hora; hover sem transição | craft hover-restraint.mdx |

**Always**: hover de cor e fundo sem transição ou com no máximo 150ms (o `Button` é o teto);
`TooltipProvider delay={150}` em volta de tabela, timeline ou grade com muitos gatilhos; tooltips de
um grupo de botões de ícone dentro de um único `TooltipProvider`, para só o primeiro esperar.
**Never**: hover que escala, levanta sombra ou desliza (`hover:scale-*`, `hover:shadow-lg`,
`hover:-translate-y-*`); `transition-all` em item de lista ou de nav; `delay` acima de 200ms em
tooltip de dashboard; atraso artificial em hover.
<!-- skill:end -->

## Onde aparece no Foglamp

Parcial. A favor: `org-settings-client.tsx:158-166` (comentário explicando que o texto da tab vira
sem fade porque o fade atrasado leria como tremor), `range-picker.tsx:205`, `checkbox.tsx:20`,
`navigation-menu.tsx:132`, `sidebar.tsx:478`. Contra: `transition-colors` em 63 lugares, o `Button`
com `transition-all hover:duration-150`, `tooltip.tsx:8` com `delay = 0` (o artigo pede 400 a 700ms;
o Foglamp prefere 150ms nas tabelas e aceita o tooltip abrir de passagem), e a sidebar deslizando
200ms mesmo por atalho.

## No lume

- Itens: `button`, `sidebar`, `checkbox`, `tooltip`, `navigation-menu`, `range-picker`, `app-shell` (`nav-icon.tsx:41,48` faz o crossfade outline/filled em `transition-opacity duration-100 ease-in-out` só na troca de item ativo, não no hover).
- FRONTEND.md: seção 19 (Overlays e menus: `TooltipProvider delay={150}` em tabelas) e seção 21 (Movimento). Guia: `docs/guia/09-movimento.md`.
- O lume mantém `delay = 0` no `tooltip` por fidelidade; a regra praticada é `delay={150}` em tabela, e quem coloca o provider é a página, como nas seis páginas de lista do Foglamp. O `data-table` não envolve a tabela num provider.
