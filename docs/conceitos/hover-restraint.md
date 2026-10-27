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
| Sidebar por atalho (Cmd/Ctrl+B) | `transition-[left,right,width] duration-200 ease-linear` (anima mesmo por teclado: contra o artigo); o `AppShell` corta a transição no atalho com `data-instant` no canvas por dois frames e `[&[data-instant]_*]:transition-none` | registry/base-vega/ui/sidebar.tsx:235; registry/base-vega/blocks/app-shell/app-shell.tsx |
| Tooltip do trilho | `TooltipProvider delay={150}` em volta da sidebar, montado pelo `AppShell`: o primeiro espera 150 ms e os vizinhos abrem na hora | registry/base-vega/blocks/app-shell/app-shell.tsx |
| Craft | tooltip: o primeiro espera 400 a 700ms, os vizinhos abrem na hora; hover sem transição | craft hover-restraint.mdx |
| Delay do tooltip: três fontes | Rauno (UI Playbook): cerca de 100 ms no primeiro, zero nos vizinhos; craft: 400 a 700 ms; Foglamp: `delay={150}` em tabela e timeline. O lume fica em 150 | https://uiplaybook.dev; craft hover-restraint.mdx; Foglamp `traces-client.tsx:642` |
| Menu e popover | abrem instantâneo e só fazem fade ao fechar; sem fade entre itens do menu; o context menu anima só na saída | Shu Ding, On UI Animations, https://shud.in/thoughts/on-ui-animations; Raphael Salaja, 12 Principles of Animation, https://www.userinterface.wiki/12-principles-of-animation |
| Tooltip vizinho | `data-instant:duration-0` no Popup: o Base UI marca `data-instant` quando um tooltip abre a partir de outro já aberto, e a animação cai para zero junto com o delay | registry/base-vega/ui/tooltip.tsx (v0.2.0); Emil Kowalski, 7 Practical Animation Tips (tip 3), https://emilkowal.ski/ui/7-practical-animation-tips |
| Hover só com hover | estado hover dentro de `@media (hover: hover) and (pointer: fine)`; recomendação para componente novo, a registry não tem | Emil (skill emil-design-eng); Jakub (better-ui); Rauno (interfaces.rauno.me) |

**Always**: hover de cor e fundo sem transição ou com no máximo 150ms (o `Button` é o teto);
`TooltipProvider delay={150}` em volta de tabela, timeline ou grade com muitos gatilhos; tooltips de
um grupo de botões de ícone dentro de um único `TooltipProvider`, para só o primeiro esperar.
**Never**: hover que escala, levanta sombra ou desliza (`hover:scale-*`, `hover:shadow-lg`,
`hover:-translate-y-*`); `transition-all` em item de lista ou de nav; `delay` acima de 200ms em
tooltip de dashboard; atraso artificial em hover.
<!-- skill:end -->

Fontes além do craft (adição do lume, levantamento de 17/10/2026). O delay do tooltip tem três
números publicados e cada um resolve um contexto: os 100 ms do Rauno são para barra de ícones, onde o
tooltip é o rótulo e precisa aparecer quase junto com o hover; os 400 a 700 do craft são para prosa e
superfície grande, onde o cursor passa por cima sem querer; os 150 do Foglamp são o meio-termo de uma
tabela com dezenas de gatilhos pequenos, rápido o bastante para ler o rótulo e lento o bastante para
não abrir de passagem. O lume fica em 150 por isso, e mantém `delay = 0` no provider por fidelidade.
Sobre abrir instantâneo: o Foglamp anima a entrada dos popups em 100 ms com `zoom-in-95`, contra a
regra do Shu e do Raphael de só animar a saída; 100 ms fica abaixo do que lê como atraso, e o lume
mantém a string canônica. O que entra na v0.2.0 é o `data-instant:duration-0` no tooltip (Emil, tip
3), que faz o vizinho abrir sem delay e sem animação. A media query de hover é recomendação para
componente novo: os primitivos do Foglamp não a usam e o lume não os altera.

## Onde aparece no Foglamp

Parcial. A favor: `org-settings-client.tsx:158-166` (comentário explicando que o texto da tab vira
sem fade porque o fade atrasado leria como tremor), `range-picker.tsx:205`, `checkbox.tsx:20`,
`navigation-menu.tsx:132`, `sidebar.tsx:478`. Contra: `transition-colors` em 63 lugares, o `Button`
com `transition-all hover:duration-150`, `tooltip.tsx:8` com `delay = 0` (o artigo pede 400 a 700ms;
o Foglamp prefere 150ms nas tabelas e aceita o tooltip abrir de passagem), e a sidebar deslizando
200ms mesmo por atalho.

## No lume

- Itens: `button`, `sidebar`, `checkbox`, `tooltip`, `navigation-menu`, `range-picker`, `app-shell` (`nav-icon.tsx:47,54` faz o crossfade outline/filled em `transition-opacity duration-100 ease-in-out` só na troca de item ativo, não no hover).
- FRONTEND.md: seção 19 (Overlays e menus: `TooltipProvider delay={150}` em tabelas) e seção 21 (Movimento). Guia: `docs/guia/09-movimento.md`.
- O lume mantém `delay = 0` no `tooltip` por fidelidade; a regra praticada é `delay={150}` em tabela, e quem coloca o provider é a página, como nas seis páginas de lista do Foglamp. O `data-table` não envolve a tabela num provider. A exceção é o `app-shell`, que monta `TooltipProvider delay={150}` em volta da sidebar para o tooltip do trilho, e que recolhe pelo atalho sem transição.
