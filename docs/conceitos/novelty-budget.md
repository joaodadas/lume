# Novelty budget

Adição do lume. Fontes: Rauno Freiberg, Novelty, https://rauno.me/craft/novelty, e Invisible Details
of Interaction Design, https://rauno.me/craft/interaction-design; Benji Taylor, Family Values
(Delight-Impact Curve), https://benji.org/family-values. O craft tem o rascunho não publicado "Novelty
Budget" (`content/craft/novelty-budget.mdx`), sem revisão do autor; a fonte primária aqui é o Rauno.
Status no Foglamp: integral (entrada de página de 75 ms uma vez por carga; entrada 3D só na landing;
grão só no marketing; o app não repete nenhum flourish em navegação interna).

## Regra

Novidade é ponto de exclamação: um por frase funciona, três por linha é grito. O Rauno escreve a
proporção como 90 por cento familiar e 10 por cento novo, e conta a "novelty tax" do Arc, um browser
inteiro novo que cobrava do usuário a cada gesto. O orçamento é pequeno e se gasta uma vez: o flourish
cabe no onboarding, na primeira visita, na revelação de algo criado agora; nunca em navegação interna,
que é a parte da interface feita centenas de vezes por dia (a outra ponta da balança frequência contra
novidade do mesmo autor). O Benji desenha a mesma ideia como Delight-Impact Curve: quanto menos
frequente a função, mais delight ela aguenta. Para um dashboard isso quer dizer que a página é
familiar por obrigação (tabela, filtro, card, drawer, todos como em qualquer outro lugar) e a novidade
mora em dois ou três momentos escolhidos. O Foglamp gasta o orçamento assim: a página aparece em 75 ms
uma vez por carga e nunca mais; o demo da landing entra em 3D durante 1.7 s porque é marketing e é a
primeira vez; o grão fica no site; a chave recém-criada rola como caça-níquel porque é criada uma vez.

## Valores

<!-- skill:start -->
| Caso | Valor | Fonte |
|---|---|---|
| Proporção | 90 por cento familiar, 10 por cento novo | Rauno, Novelty |
| Onde o flourish cabe | onboarding, primeira visita, revelação única | Rauno, Novelty |
| Onde nunca | navegação interna e qualquer ação repetida (lista, filtro, menu, troca de aba) | Rauno, Novelty e Invisible Details |
| Curva | quanto menos frequente a função, mais delight ela aguenta | Benji, Delight-Impact Curve |
| Entrada de página | `useEntranceOnce()` devolve true só no primeiro mount depois de um hard load; `cn(entrance && "page-fade-in")` roda `page-fade-in` por 75 ms só em opacidade, e `animation: none` sob reduced motion | registry/base-vega/hooks/use-entrance-once.ts |
| Entrada 3D | só na landing do Foglamp (`marketing/demo/entrance.ts`, `ENTRANCE_EASE`, 1.7 s e 1.1 s); nenhuma página do app usa | registry/base-vega/lib/motion.ts:20-22; Foglamp apps/web/src/components/marketing/demo/entrance.ts |
| Grão | `feTurbulence` só no marketing | [Noise](noise.md) |
| Revelação única | `rolling-text` para chave, ID ou token recém-criado; não para número que muda sempre (isso é `number-ticker`) | registry/base-vega/components/rolling-text.tsx |
| Primeiro render | `initial={false}` no `copy-icon`; o `number-ticker` pinta estático e só anima mudanças depois do mount | registry/base-vega/components/copy-icon.tsx:29; number-ticker.tsx:30-41 |
| Borda viajante | `border-beam-card` é flourish de destaque único, não de lista | registry/base-vega/components/border-beam-card.tsx |

**Always**: gaste o orçamento em até três momentos por produto e escreva quais são; cada flourish
roda uma vez por sessão ou por criação; familiar por padrão em tudo que se repete. **Never**: entrada
animada em toda troca de rota; stagger em lista que filtra; flourish em menu, tab ou sidebar; um
efeito novo "porque ficou bonito" em componente que já tem equivalente no sistema.
<!-- skill:end -->

## Onde aparece no Foglamp

`apps/web/src/components/app/hooks.ts` (`useEntranceOnce`, origem do item), `apps/web/src/index.css`
(`.page-fade-in`), `marketing/landing/hero.tsx` e `marketing/demo/entrance.ts` (entrada 3D, só
landing), `animated-api-key.tsx` (rolagem única). Nenhuma página de `app/(app)/` anima a troca de rota
depois da primeira.

## No lume

- Itens: `use-entrance-once`, `rolling-text`, `number-ticker`, `copy-icon`, `border-beam-card`, `motion`.
- FRONTEND.md: seções Movimento (entrada de página de 75 ms uma vez por hard load; nunca animar na primeira pintura o que já está no lugar) e Marketing (opcional). Guia: `docs/guia/09-movimento.md` e `docs/guia/12-marketing.md`.
- Conceitos vizinhos: [Frequência decide](frequencia-decide.md) (a outra ponta da balança) e [Continuidade](continuidade.md) (o familiar que persiste).
