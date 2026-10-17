# Referências: o que entra, o que fica de fora e o que ler

Curadoria do [desengs.com](https://desengs.com) (catálogo de ferramentas e textos de design engineering) e do levantamento dos sete design engineers citados na página [GOATs do craft](https://craft.gustavofior.com/goats) (detalhe em [pesquisa/goats-do-craft.md](./pesquisa/goats-do-craft.md)), feita com três critérios declarados:

1. **Look Foglamp.** Entra o que o Foglamp já usa ou o que produz o mesmo resultado (cinza estrutural, sombra no lugar de borda, squircle, movimento curto). Fica fora o que traz raio, easing ou paleta próprios.
2. **O que a Lyx faz.** Dashboards, tabelas, formulários e chat de AI em Next e Vite. Som, 3D e efeitos de landing não pesam.
3. **Não duplicar a registry.** Se o lume já tem o item (ticker, avatar por hash, chat), a alternativa externa não entra, por melhor que seja.

Cada entrada tem uma frase de justificativa. "Não" significa "não nesta versão"; mudar de ideia é abrir issue com o caso de uso. Licenças, versões e datas abaixo foram conferidas em 17/10/2026.

## 1. Dependências que entram

| Lib | Decisão | Por quê |
|---|---|---|
| `motion` (motion/react) | entra | O Foglamp usa em 29 arquivos; o lume fecha o vocabulário em `registry/base-vega/lib/motion.ts` |
| `sonner` | entra | É o toaster do Foglamp (`ui/sonner.tsx`, ícones Tabler filled, `--normal-bg: var(--popover)`); MIT, v2.0.8, mantido pelo Emil Kowalski |
| `cmdk` | entra (item `command`, tier extra) | Base da paleta de comandos do shadcn; sem uso no app do Foglamp, por isso extra. Hoje vive sob a org [Dip](https://github.com/dip/cmdk) (Paco Coursey, MIT, v1.1.1) e traz 4 pacotes Radix (`react-dialog`, `react-primitive`, `react-id`, `react-compose-refs`): é a única entrada de Radix num DS que é Base UI. Fica enquanto o shadcn mantiver cmdk no `base-nova`; revisitar se a Dip lançar v2. A alternativa [`cmdk-base`](https://github.com/borabaloglu/cmdk-base) (MIT, port sobre Base UI Dialog) é de terceiro, com um mantenedor, e não foi adotada |
| `vaul` | não entra mais | Era a base do `drawer`. O próprio Emil marcou o repo como não mantido (último release v1.1.2, dez/2024) e ele depende de `@radix-ui/react-dialog`. Desde a v0.2.0 o item `drawer` do lume é escrito sobre o Dialog do Base UI, com a curva e a duração que o Emil documenta em [Building a Drawer Component](https://emilkowal.ski/ui/building-a-drawer-component) |
| `tw-animate-css`, `@toolwind/corner-shape`, `class-variance-authority`, `@base-ui/react`, `@tabler/icons-react`, `next-themes`, `recharts`, `react-day-picker` | entram pelo `base` e pelos primitivos | São as dependências da tabela 2.1 do mapa, sem substitutos |
| `slot-text`, `border-beam` | entram só pelos extras `rolling-text` e `border-beam-card` | MIT, usadas verbatim pelo Foglamp; nunca vêm por padrão |
| `@number-flow/react` | não | O Foglamp declara e nunca importa; o count-up canônico é o `number-ticker` (`animate` 0.6 s `easeOut`, formatando a cada frame) |
| `react-wrap-balancer` | não | O peer range não declara React 19 (v1.1.1, mai/2024). O caminho é o nativo: `text-wrap: balance` em título e `pretty` em parágrafo, que o Tailwind 4 já expõe |
| `nstr` | não | A lib do Shu Ding (MIT, zero deps) formata número sem artefato de ponto flutuante. Foi avaliada e não entrou: os `toFixed` da registry (`card-sparkline`, evilcharts) são coordenadas de SVG e offsets de gradiente, não números de interface; os números que o usuário lê já passam por `Intl.NumberFormat` em `lib/format.ts` |
| Som (`@web-kits/audio`, Cuelume, soundcn) | não | Nenhum produto da Lyx ou do João toca som na UI; o Foglamp também não. Se a decisão reabrir, a referência é [`@web-kits/audio`](https://github.com/raphaelsalaja/audio) (Raphael Salaja, MIT, v0.2.0, mantido, único pacote do escopo no npm) |
| Liveline | investigar para o FCS (Horizonte) | Gráfico de linha ao vivo em canvas, do Benji Taylor ([repo](https://github.com/benjitaylor/liveline), MIT, npm 0.0.7). Cabe no produto, não no design system |
| Calligraph | não na v1 | Morph de texto por caractere compartilhado ([repo](https://github.com/raphaelsalaja/calligraph), MIT, 1.4.1, peer `motion` 11+). É a regra "só a parte que muda anima" em lib; efeito de landing, sem caso de uso no app |
| Agentation | opcional, só como ferramenta interna | Overlay de anotação visual para revisão com agentes ([repo](https://github.com/benjitaylor/agentation), licença PolyForm Shield 1.0.0, não é OSI). A licença permite uso interno, por isso pode ser devDependency do site para o loop de revisão; nunca entra na registry |
| Cambio e Toldo | só leitura dos presets | Dialogs do Raphael Salaja ([Cambio](https://github.com/raphaelsalaja/cambio) sobre Base UI, [Toldo](https://github.com/raphaelsalaja/toldo) sobre Radix). Um dialog próprio colide com o do sistema; os presets de timing servem de comparação |
| `loading-dev` | reavaliar após 1.0 | 29 indicadores do Jakub Krehel ([repo](https://github.com/jakubkrehel/loading), MIT, v0.3.5) com reduced motion. Exige React 19 e é 0.x; o Foglamp já tem spinner |

## 2. Itens opcionais (não vêm por padrão)

| Item do desengs | Decisão | Por quê |
|---|---|---|
| Dot Matrix | só marketing | Textura decorativa; no app conflita com a regra de superfície limpa |
| Magic UI, Fancy Components, useLayouts | inspiração, nunca instalar em bloco | Trazem raio, easing e sombras próprios; copiar um componente exige retunar para `lib/motion.ts` e para a sombra do sistema |
| AICSS, Beautiful UI | referência para a v2 do bloco `ai-chat` | O bloco nasce do Foggy do Foglamp; essas libs servem para comparar composer e bolhas, não para substituir |
| Gradient Border Plugin | não | Conflita com "sombra no lugar de borda": o sistema não tem borda para gradientar |
| Hashvatar | não | O lume já tem avatar por hash djb2 sobre 16 tons `*-500` (receita do `customer-avatar` do Foglamp) |
| Torph, morphicons, interior.dev | não na v1 | Morph de texto, tipografia animada e ícones animados são efeito de landing; nenhum caso de uso no app (Calligraph e Liveline estão na tabela 1) |
| DialKit | sim, como devDependency do site, só no `/botoes` | Afinar spring e easing com dial no playground; nunca entra na registry |

## 3. Ferramentas (links)

| Ferramenta | Para quê |
|---|---|
| [OKLCH.fyi](https://oklch.fyi) | Conferir e ajustar os tokens `oklch(...)` do `globals.css` sem sair do espaço de cor (do Jakub Krehel) |
| shadowLab | Montar sombras em camadas no molde de `--custom-shadow` (três camadas de 0.5 px a 4 px) |
| Corner Radii | Calcular raio concêntrico (filho = pai menos padding), a conta por trás de `rounded-[calc(var(--radius)-5px)]` |
| [easing.dev](https://easing.dev) | Visualizar `EASE`, `ENTRANCE_EASE` e `REVEAL_EASE` antes de propor curva nova (que precisa de issue) |
| UI Camera | Capturar componentes em light e dark para a tabela Before / After de uma revisão |
| kugiri, Shoogle | Listadas como catálogo, sem recomendação: não foram avaliadas contra o look |

## 4. Skills para instalar junto

| Skill | Status | Comando | Por quê |
|---|---|---|---|
| `lume-design-engineering` | base | `npx skills add joaodadas/lume --skill lume-design-engineering` | As regras deste design system, geradas do `FRONTEND.md` e dos capítulos do guia |
| `gustavo-fior/craft` | obrigatória | `npx skills add gustavo-fior/craft` | A teoria por trás dos valores (tabular numbers, optical alignment, button press, hover restraint); o lume cita o craft, não o substitui |
| `vercel-labs/agent-skills` (`web-design-guidelines`) | obrigatória | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | Reviewer que reporta `arquivo:linha` contra as [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) (Vercel Labs, autor principal John Pham, MIT); é a checagem de acessibilidade e UX que o lume não reescreve |
| `emilkowalski/skills` | recomendada | `npx skills add emilkowalski/skills` | Animação: quando não animar, duração e easing; coincide com as 12 receitas do [09-movimento](./guia/09-movimento.md). Das 15 sub-skills, as que valem no lume: `review-animations` e `find-animation-opportunities` em revisão, `ask-sonner` para receitas do toaster, `break-ui` para dados extremos em tabela |
| `jakubkrehel/skills` | recomendada | `npx skills add jakubkrehel/skills` | A única skill com valores exatos de sombra, raio e press em formato "Detection, Fix". Use `better-ui` (superfícies, enter e exit, ícones, performance) e `interface-review` (review com severidade e tabela Before / After) |
| `raphaelsalaja/userinterface-wiki` | recomendada | `npx skills add raphaelsalaja/userinterface-wiki` | Cerca de 150 regras em 12 seções: timing, exit e presence, pseudo-elementos, Laws of UX, tipografia e visual (MIT). No lume ficam desligadas a regra `type-slashed-zero` (regra de marca do João: sem zero cortado) e as regras de som (decisão da tabela 1) |
| `vercel-labs/agent-skills` (`react-best-practices`) | opcional | `npx skills add vercel-labs/agent-skills --skill react-best-practices` | Robustez e performance de componente React e Next (40 e poucas regras); par da leitura "Building Bulletproof React Components" do Shu Ding |
| `jakubkrehel/oklch-skill` | opcional | `npx skills add jakubkrehel/oklch-skill` | Converter, montar paleta e checar gamut em OKLCH; para quem mexe nos tokens do `globals.css`, ao lado do OKLCH.fyi |
| `rams` | opcional | `npx skills add rams` (confira o repositório na página do desengs) | Crítica de design no estilo "menos, porém melhor"; útil em revisão, não em implementação |
| Taste Skill, UI Skills, Impeccable | não | Genéricas demais ou com opiniões de estilo que divergem do look (bordas, gradientes, raio grande) |

Depois de instalar, `skills-lock.json` entra no commit e `npx skills update` mantém as versões.

## Pessoas

Os sete design engineers que o Gustavo cita na [página GOATs do craft](https://craft.gustavofior.com/goats). O levantamento completo (posts, repos, licenças, datas) está em [pesquisa/goats-do-craft.md](./pesquisa/goats-do-craft.md).

| Pessoa e site | Onde trabalha hoje | O que ensina | O que o lume pegou |
|---|---|---|---|
| Rauno Freiberg, [rauno.me](https://rauno.me) | Staff Design Engineer na Vercel (plataforma, design system, Next.js Dev Tools) | Regras de interação para app: hit area maior que o alvo, focus ring por box-shadow, menu abre no mousedown, frequência contra novidade, interruptibilidade | Os conceitos `hover-restraint` e `interruptibility` já vinham dele; a v0.2.0 acrescenta focus ring, hit areas e novelty budget, e a regra de não pré-desabilitar o submit |
| Emil Kowalski, [emilkowal.ski](https://emilkowal.ski) | Design Engineer na Linear; antes Vercel | Quando não animar, durações por componente, fluxograma de easing, nunca partir de scale zero, popover ancorado na origem do gatilho | A lib `sonner`; a curva do drawer (é o `ENTRANCE_EASE` de `lib/motion.ts`); tooltip vizinho sem delay via `data-instant` do Base UI em `ui/tooltip.tsx`; os conceitos frequência decide e duração por componente |
| Jakub Krehel, [jakub.kr](https://jakub.kr) | Founding Design Engineer na Interfere; antes OpenSea | Sombra em três camadas e como ela colapsa no dark, exceções da regra da borda, raio concêntrico com corte, outline de imagem em preto ou branco puro, mínimos de tipografia | Os conceitos sombra no dark e exceções da borda; extensões de `image-outlines` e `nested-border-radius`; as skills `better-ui` e `interface-review`; o OKLCH.fyi |
| Paco Coursey, [paco.me](https://paco.me) | Webmaster na Linear (site público); sócio da Dip | Desligar transições na troca de tema, texto em rem, tabs por exclusão com cópia `aria-hidden`, tooltip que desliza para o vizinho | As libs `cmdk` e `next-themes`; o `disableTransitionOnChange` do `theme-provider` é a receita dele |
| Shu Ding, [shud.in](https://shud.in) | Engineer na Vercel (Next.js, v0, SWR, Satori) | Menu abre instantâneo e só faz fade ao fechar, tokens de animação num lugar só, checklist de componente robusto em React 19, suavização de curva para gráficos | O conceito curve smoothing (sparklines); fade de scroll com stops em curva de easing em `scroll-fades`; o checklist de robustez para itens novos da registry |
| Benji Taylor, [benji.org](https://benji.org) | Head of Design na SpaceX (X e SpaceXSI); fundou a Family | Continuidade: componente persiste em vez de duplicar, só a parte que muda anima, direção do movimento segue a posição, Delight-Impact Curve | O conceito continuidade; Liveline como candidato para o FCS; Agentation como ferramenta interna de revisão |
| Raphael Salaja, [raphaelsalaja.com](https://raphaelsalaja.com) e [userinterface.wiki](https://www.userinterface.wiki) | Design Engineer na Warp (gestão de pessoas, não o terminal); antes OpenSea e Lens | Spring ou easing, faixas de duração, `AnimatePresence` sem armadilha, animar largura e altura com ResizeObserver, hit area por pseudo-elemento, Leis de UX com números | A skill `userinterface-wiki`; as faixas de duração que fecham os números de `lib/motion.ts`; o padrão de hit area sem nó extra no conceito hit areas |

O "craft" que o lume pratica é a síntese do que esses sete publicam, filtrada pelo Foglamp e pelo que a Lyx constrói. Quando a regra tem fonte primária (um post, uma skill, um README), o lume cita a fonte; só o que nenhum deles publicou fica atribuído ao craft do Gustavo ou ao próprio lume.

## 5. Leituras obrigatórias

Leia os Fundamentos antes de contribuir; os outros grupos entram conforme o que você vai mexer. Cada linha diz o que a leitura dá ao lume.

### Fundamentos

- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) (Vercel Labs, autor principal John Pham, MIT): a base de a11y, foco, formulários e estados que a skill `web-design-guidelines` aplica; de lá vem a regra de não pré-desabilitar o submit.
- [interfaces.rauno.me](https://interfaces.rauno.me) (Rauno Freiberg, 2023, sem licença declarada): cerca de 60 regras curtas de app (menu abre no mousedown, setas e cmd-backspace em listas, focus ring por box-shadow, hover só com media query, peso nunca abaixo de 400). É a precursora das WIG, não a mesma coisa; o lume reescreve e atribui, nunca copia.
- [Invisible details of interaction design](https://rauno.me/craft/interaction-design) (Rauno Freiberg): frequência contra novidade, interruptibilidade e Fitts; embasa `hover-restraint` e `interruptibility`.
- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better) (Jakub Krehel): sombras, bordas, raio concêntrico, tabular numbers e outline de imagem; é o post mais próximo do look Foglamp.
- [Practical Typography](https://practicaltypography.com) (Matthew Butterick): tamanhos, medida de linha e tabular numbers; explica `text-sm`, `text-xs` e os 162 `tabular-nums` da registry.
- [Laws of UX](https://lawsofux.com) e a versão com demos e números do Raphael em [userinterface.wiki/laws-of-ux](https://www.userinterface.wiki/laws-of-ux): Fitts, Hick, Miller e Doherty (400 ms como teto de feedback) para justificar densidade e hierarquia das tabelas.

### Movimento

- [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations) (Emil Kowalski): decide quando não animar; é a regra 19.4 do Foglamp em prosa.
- [7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips) (Emil Kowalski): press 0.97, nunca partir de scale zero, tooltip subsequente sem delay via `data-instant`, origem do popover; os exemplos são em Base UI, como o lume.
- [To Spring or Not To Spring](https://www.userinterface.wiki/to-spring-or-not-to-spring) (Raphael Salaja): spring quando reage ao usuário, easing quando o sistema anuncia; faixas de 120 a 180, 180 a 260 e até 300 ms; linear só para tempo.
- [Animating Container Bounds](https://www.userinterface.wiki/animating-container-bounds) (Raphael Salaja): padrão de dois elementos com ResizeObserver para animar largura e altura sem animar `auto`.
- [Mastering Animate Presence](https://www.userinterface.wiki/mastering-animate-presence) (Raphael Salaja): `mode`, `propagate` em saídas aninhadas e `wait` dobrando a duração; os gotchas do Motion que o lume usa em 29 arquivos.
- [On UI Animations](https://shud.in/thoughts/on-ui-animations) (Shu Ding): tokens de animação num lugar só, menu abre instantâneo e só faz fade ao fechar, nunca animar de 0 para `auto`.
- [Less is more, more or less](https://jakub.kr/writing/less-is-more) (Jakub Krehel): a conta do context menu (200 aberturas por dia vezes 300 ms); a versão quantificada de "frequência decide".
- [Family Values](https://benji.org/family-values) (Benji Taylor): persistir em vez de duplicar, só a parte que muda anima, Delight-Impact Curve; fonte do conceito continuidade.
- [Novelty](https://rauno.me/craft/novelty) (Rauno Freiberg): 90 por cento familiar, 10 por cento novo; flourish só em onboarding; fonte do conceito novelty budget.
- [Disable transitions on theme toggle](https://paco.me/writing/disable-theme-transitions) (Paco Coursey): a receita por trás do `disableTransitionOnChange` que o `theme-provider` já passa.
- [Exclusion Tabs](https://paco.me/craft/tabs) (Paco Coursey): indicador de tabs por cópia clipada com `aria-hidden`; a variante segmented control, se o lume quiser esse efeito.

### Superfície e cor

- [What are OKLCH colors?](https://jakub.kr/components/oklch-colors) (Jakub Krehel): neutro é chroma 0 variando só L; explica como os tokens cinza do `globals.css` funcionam.
- [Good Design](https://shud.in/thoughts/good-design) (Shu Ding): qualidade não cresce com complexidade; luz e sombra voltam como refinamento, não como skeuomorfismo. O argumento de "sombra no lugar de borda".

### Dashboard

- [Field Notes 2](https://rauno.me/notes/2), [4](https://rauno.me/notes/4) e [5](https://rauno.me/notes/5) (Rauno Freiberg): decisões de dashboard real na Vercel: cards esparsos e tersos, context menu só como atalho, página "border-heavy" vira remover o container externo, hit area invisível com padding, focus ring com respiro.
- [Adaptive Polynomial Curve Fitting](https://shud.in/thoughts/adaptive-polynomial-curve-fitting) (Shu Ding): suavizar sparklines e calcular o delta sobre a tendência; fonte do conceito curve smoothing.

### Postura

- [Design Engineering at Vercel](https://vercel.com/blog/design-engineering-at-vercel): o papel que o lume espera de quem o usa.
- [Developing taste](https://emilkowal.ski/ui/developing-taste) (Emil Kowalski): como avaliar o próprio trabalho antes de pedir revisão.
- [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste) (Emil Kowalski): gosto vira regra escrita numa skill; justifica gerar `lume-design-engineering` a partir do `FRONTEND.md`.
- [Building Bulletproof React Components](https://shud.in/thoughts/build-bulletproof-react-components) (Shu Ding): dez provas de robustez para componente em React 19 (`useId`, listeners no `ownerDocument`, estado inicial por script inline); o checklist para item novo da registry.
- [Devouring Details](https://devouringdetails.com) (Rauno Freiberg, curso pago, US$ 249): manual de referência com 23 capítulos e componentes para download; as 12 receitas do cap. 09 são exemplos dele aplicados. O código baixado não declara licença, por isso nada dele vira item da registry.

Depois, como consulta: [userinterface.wiki](https://www.userinterface.wiki) (vocabulário e demos, MIT), [animations.dev](https://animations.dev) (curso de animação do Emil), Design System Checklist (o que ainda falta documentar) e Interface Cheat Sheet (tabela rápida de padrões).

## Créditos

Foglamp (Gustavo Fior, Apache 2.0) é a fonte dos valores; craft (Gustavo Fior, MIT) é a fonte dos conceitos; evilcharts (MIT) é vendorizado com cabeçalho. Os conceitos novos de [docs/conceitos/](./conceitos/README.md) marcados "adição do lume" citam como fonte os autores da seção Pessoas (Rauno Freiberg, Emil Kowalski, Jakub Krehel, Paco Coursey, Shu Ding, Benji Taylor, Raphael Salaja), com URL do post ou da skill de onde a regra veio. A curadoria acima é do lume e não representa os autores das ferramentas citadas.
