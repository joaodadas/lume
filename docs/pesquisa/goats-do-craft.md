# Os sete do craft: o que cada um publica e onde encaixa no lume

Levantamento de 17/10/2026 dos sete design engineers que o Gustavo cita na página GOATs do craft (craft.gustavofior.com/goats). Para cada um, abrimos o site, os repos e os cursos; conferimos licença, manutenção e o que o lume já usa. O detalhe por autor (tabelas de posts, repos com stars e datas, regras uma a uma) está em `~/Developer/horizonte-social/foglamp-design-system-anexos/goats-levantamento-2026-10-17.md`. Este arquivo é a leitura consolidada para decidir o que entra.

Status: incorporado na v0.2.0 (ver CHANGELOG). Correção após implementação: `nstr` não entrou, porque os `toFixed` da registry são coordenadas de SVG e offsets de gradiente, não números de interface.

## 1. Resumo por pessoa

| Pessoa | Onde | O que ele dá ao lume | Código aproveitável |
|---|---|---|---|
| Rauno Freiberg | Staff Design Engineer, Vercel | Regras de interação para app: hit areas, focus ring, teclado em listas, menu abre no mousedown, loading sem mudar tamanho, novelty 90/10, field notes de dashboard da Vercel | Nenhum. Demos do craft dele não têm código; o Devouring Details (US$ 249) não declara licença; ui-playbook e inspx parados desde 2023 |
| Emil Kowalski | Design Engineer, Linear | Tabela de frequência (quando não animar), durações por componente, fluxograma de easing, tooltip vizinho sem delay, nunca partir de scale zero, origem do popover | Já usamos sonner e vaul. Vaul está sem manutenção e puxa Radix Dialog |
| Jakub Krehel | Founding Design Engineer, Interfere | Valores de sombra em 3 camadas e como ela colapsa no dark, exceções da borda, raio concêntrico com corte, outline de imagem em preto ou branco puro, tipografia com mínimos, review com severidade | Skills (MIT). A lib loading-dev é 0.x e exige React 19; não agora |
| Paco Coursey | Webmaster, Linear (site); sócio da Dip | Transições desligadas no toggle de tema (origem do que já usamos), texto em rem, tabs por exclusão, tooltip que desliza para o vizinho | Já usamos cmdk e next-themes. cmdk agora é da org Dip e traz 4 pacotes Radix |
| Shu Ding | Engineer, Vercel (Next.js, v0, SWR, Satori) | Menu abre instantâneo e só faz fade ao fechar, tokens de animação centralizados, checklist de componente robusto em React 19, suavização de curva para gráficos, fade com stops em curva de easing | nstr (MIT, zero deps) para números sem artefato de ponto flutuante; satori via next/og para OG images do site |
| Benji Taylor | Head of Design, X e SpaceXSI; fundou a Family | Continuidade: componente persiste em vez de duplicar, só a parte que muda anima, direção espacial, Delight-Impact Curve, regras de gráfico ao vivo | Liveline (MIT) para o FCS, não para a registry. Agentation (PolyForm Shield) como ferramenta interna de revisão visual com agentes |
| Raphael Salaja | Design Engineer, Warp (gestão, não o terminal) | userinterface.wiki: spring ou easing, faixas de duração, AnimatePresence sem armadilha, animar largura e altura com ResizeObserver, hit area por pseudo-elemento, Leis de UX com números | Skill userinterface-wiki (MIT, 150 regras). Cambio, Toldo e Calligraph: só leitura |

## 2. Correções de fato que o lume precisa fazer

- As Web Interface Guidelines que a skill `web-design-guidelines` baixa são do repo vercel-labs/web-interface-guidelines, autor principal John Pham, MIT. A lista de 2023 do Rauno (interfaces.rauno.me) é outra coisa, sem licença declarada. Hoje o lume atribui tudo ao mesmo nome.
- invisibledetails.com não é do Rauno. É um curso pago de outro autor. O "Invisible Details" do Rauno é o ensaio em rauno.me/craft/interaction-design.
- cmdk é do Paco Coursey (hoje sob a org Dip, da qual Benji Taylor é sócio). Não atribuir ao Benji.
- vaul está marcado pelo próprio Emil como não mantido e depende de Radix Dialog. cmdk depende de 4 pacotes Radix. São as duas únicas entradas de Radix num DS que é Base UI.
- react-wrap-balancer não declara React 19 no peer range. O caminho é o nativo (text-wrap balance e pretty), que o Tailwind já expõe.

## 3. Onde os sete convergem (sinal forte, vira regra)

- **Frequência decide se anima.** Emil (tabela de 4 faixas), Jakub (200 aberturas por dia vezes 300 ms dá 6 horas por ano), Rauno (frequência contra novidade), Benji (Delight-Impact Curve), Raphael (nenhuma animação em digitação e navegação por teclado). O lume tem a ideia em prosa; falta a tabela.
- **Durações por componente.** Emil e Raphael batem quase nos mesmos números: press entre 100 e 180 ms, tooltip entre 125 e 200, dropdown e select entre 150 e 260, modal e drawer entre 200 e 300 (até 500 com arraste). Saída mais rápida que entrada. O lume diz só "entre 0.12 e 0.25 s".
- **Menu e popover abrem instantâneo e só fazem fade ao fechar.** Shu (macOS), Raphael (regra da skill), Emil (dropdown de 180 ms vence 400). O lume não escreve isso.
- **Nunca partir de scale zero.** Emil (0.95), Rauno (dialog de 0.8, press 0.96), Jakub (press 0.96 em 150 ms). O lume pratica 0.97 no press e 96 por cento no dialog, sem a regra escrita. Divergência aberta: 0.96 ou 0.97.
- **Hit area maior que o ícone.** Rauno (padding em lista, botões sempre irmãos), Raphael (pseudo-elemento), Jakub (24 px mínimo AA, 40 desktop, 44 touch). O lume só expande em checkbox, radio e switch.
- **Hover só em dispositivo com hover.** Emil, Jakub e Rauno pedem a media query de hover e pointer fine. O lume não tem.
- **Sombra no lugar de borda tem exceções.** Jakub lista divisor, célula de tabela, input e estado selecionado; Rauno chama página com muita borda de "border-heavy" e manda remover o container externo. O lume trata a regra como absoluta.
- **Ferramenta, não lembrete.** Shu (regra de performance vira check), Emil e Jakub (gosto vira skill), Benji (anotação em vez de descrição). É a tese do `scripts/check.ts` e da skill do lume.

## 4. O que cada um acrescenta que ninguém mais cobre

- **Jakub:** sombra no dark colapsa para um anel branco (o Foglamp mantém profundidade com seis camadas, vale registrar a diferença); borda transparente de 1 px sob o anel para forced-colors; outline de imagem em preto ou branco puro, nunca cinza da paleta; corte de 24 px de padding no raio concêntrico; mínimos de tipografia (14 px em input e menu, 13 em legenda, peso 400 abaixo de 18 px).
- **Rauno:** focus ring como receita (box-shadow e não outline, sem transição, respiro entre inputs); menu abre no mousedown; setas e cmd-backspace em listas; loading mantém cor e dimensão; botão disabled sem tooltip; não pré-desabilitar o submit (diverge do `login-form`); toast com role status por padrão e alert só em erro de rede; novelty 90/10.
- **Shu:** checklist de componente robusto (useId, listeners no ownerDocument, estado inicial por script inline, media not all dentro de Activity); regressão polinomial adaptativa para suavizar sparklines e calcular delta sobre a tendência; fade de scroll com stops seguindo uma curva, não linear.
- **Benji:** persistir em vez de duplicar; só a parte que muda anima; alturas distintas em sequência de painéis; uma ação primária por painel; direção do movimento segue a posição; um só sistema de movimento por widget.
- **Raphael:** padrão de dois elementos com ResizeObserver para animar largura e altura; AnimatePresence com propagate em saídas aninhadas e wait dobrando a duração; Doherty 400 ms como teto para feedback; linear só quando o movimento representa tempo.
- **Paco:** tabs por exclusão com cópia aria-hidden; tooltip desliza para o vizinho em vez de fechar e abrir; preferir filtro SVG a backdrop-filter quando há raio ou animação.
- **Emil:** tooltip subsequente sem delay e sem animação via data-instant do Base UI; popover ancorado usa a origem do gatilho, modal fica centrado; blur de 2 px para mascarar crossfade; reduced motion é menos e mais suave, não zero.

## 5. Proposta de encaixe

### 5.1 `docs/referencias.md`

- Nova seção **Pessoas** com os sete: site, onde trabalha, o que ensina em uma linha, o que o lume pegou de cada um.
- Leituras a acrescentar: 7 Practical Animation Tips e Agents with Taste (Emil); Less is more, more or less e What are OKLCH colors (Jakub); Family Values (Benji); On UI Animations, Good Design e Building Bulletproof React Components (Shu); To Spring or Not To Spring, Animating Container Bounds e Mastering Animate Presence (Raphael); interfaces.rauno.me, Novelty e Field Notes 2, 4 e 5 (Rauno); disable-theme-transitions e craft/tabs (Paco).
- Skills: subir jakubkrehel/skills para recomendada nomeando better-ui e interface-review; acrescentar raphaelsalaja/userinterface-wiki como recomendada (com a nota de que slashed zero e som ficam desligados no lume); nomear as sub-skills do Emil que valem (review-animations, find-animation-opportunities, ask-sonner, break-ui); react-best-practices da Vercel Labs e oklch-skill como opcionais.
- Corrigir a atribuição das Web Interface Guidelines e remover qualquer menção a invisibledetails.com.

### 5.2 `docs/conceitos/` (novos, marcados como adição do lume, com fonte)

| Conceito | Fontes | Por quê |
|---|---|---|
| frequência decide | Emil, Jakub, Rauno, Benji, Raphael | É a regra mais repetida pelos sete e o lume só a tem em prosa |
| duração por componente | Emil, Raphael | Fecha os números do `lib/motion.ts` |
| sombra no dark | Jakub, comparado com o Foglamp | O lume mantém profundidade no dark; vale dizer por quê |
| exceções da borda | Jakub, Rauno | Torna "sombra no lugar de borda" aplicável sem dogma |
| hit areas | Rauno, Raphael, Jakub | Unifica o que o Foglamp já faz em três primitivos |
| focus ring | Rauno | Receita completa, hoje o lume só fixa a espessura |
| continuidade | Benji, Raphael (Calligraph) | Persistir em vez de duplicar, animar só o que muda |
| novelty budget | Rauno | O craft tem só rascunho; a fonte publicada é o Rauno |
| curve smoothing | Shu | Mesmo caso: o craft não publicou e o lume tem sparklines |

Estender os existentes: `hover-restraint` com as três fontes de delay de tooltip (Rauno 100 ms, craft 400 a 700, Foglamp 150) e a regra de abrir instantâneo; `button-press` com a proporção ao gatilho e a divergência 0.96 contra 0.97; `image-outlines` com preto ou branco puro; `nested-border-radius` com o corte de 24 px; `scroll-fades` com stops em curva.

### 5.3 `FRONTEND.md` (regras novas, uma linha cada)

Menu abre no mousedown. Setas e cmd-backspace em listas sequenciais. Loading mantém cor e dimensão. Hover só com media query de hover. Overscroll contain em dialog, drawer e menu. Toast com role status, alert só em erro. Peso mínimo 400 e tamanho mínimo 13 px em texto de app. Texto em rem. Nunca partir de scale zero. Saída mais rápida que entrada. Popover ancorado usa a origem do gatilho. Botão disabled sem tooltip. Decorativo com pointer-events none.

### 5.4 Código (pequeno, cabe na v0.2)

- `ui/tooltip.tsx`: tooltip subsequente sem delay e sem animação pelo atributo data-instant do Base UI.
- Popups: overscroll-behavior contain.
- `sonner.tsx`: role status por padrão.
- Botão de ícone no menor tamanho: hit area expandida, como já existe em checkbox.
- Site: tema vesper do shiki (MIT, já no bundle) para blocos de código no dark, só avaliar.

### 5.5 Decisões para abrir (não copiar, decidir)

- **vaul**: sem manutenção e com Radix Dialog. Portar um drawer sobre Base UI Dialog com a curva do Emil (0.32, 0.72, 0, 1 em 500 ms) ou manter enquanto o shadcn mantiver.
- **cmdk**: 4 pacotes Radix; existe cmdk-base de terceiro com um mantenedor. Manter enquanto o shadcn mantiver; revisitar se a Dip lançar v2.
- **Submit pré-desabilitado**: o `login-form` desabilita sem campos válidos; Rauno e as WIG dizem para deixar submeter e mostrar a validação.
- **Press 0.96 ou 0.97**: craft e Emil usam 0.97; Jakub e Rauno 0.96. Fechar um número.
- **Som**: continua não. Se reabrir, a referência é @web-kits/audio (Raphael, MIT, mantido).

### 5.6 O que fica de fora, e por quê

Devouring Details (pago, sem licença no código baixado), demos do craft do Rauno (sem código), Interfaces como leitura obrigatória (paga; as três issues grátis já estão cobertas), loading-dev (0.x, React 19 obrigatório, o Foglamp tem spinner), Cambio e Toldo (dialog próprio colide com o do sistema), Calligraph e morphing icons (landing, não dashboard), Drawesome, Honkish, cobe, liquid-glass, svg-shaders, nextra, react-wrap-balancer, next-view-transitions, use-delayed-render (sem licença), clip-path tabs e gradients (marketing), drag gestures (mobile).
