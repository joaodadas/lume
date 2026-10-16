# Referências: o que entra, o que fica de fora e o que ler

Curadoria do [desengs.com](https://desengs.com) (catálogo de ferramentas e textos de design engineering) feita com três critérios declarados:

1. **Look Foglamp.** Entra o que o Foglamp já usa ou o que produz o mesmo resultado (cinza estrutural, sombra no lugar de borda, squircle, movimento curto). Fica fora o que traz raio, easing ou paleta próprios.
2. **O que a Lyx faz.** Dashboards, tabelas, formulários e chat de AI em Next e Vite. Som, 3D e efeitos de landing não pesam.
3. **Não duplicar a registry.** Se o lume já tem o item (ticker, avatar por hash, chat), a alternativa externa não entra, por melhor que seja.

Cada entrada tem uma frase de justificativa. "Não" significa "não na v0.1"; mudar de ideia é abrir issue com o caso de uso.

## 1. Dependências que entram

| Lib | Decisão | Por quê |
|---|---|---|
| `motion` (motion/react) | entra | O Foglamp usa em 29 arquivos; o lume fecha o vocabulário em `registry/base-vega/lib/motion.ts` |
| `sonner` | entra | É o toaster do Foglamp (`ui/sonner.tsx`, ícones Tabler filled, `--normal-bg: var(--popover)`) |
| `cmdk` | entra (item `command`, tier extra) | Base da paleta de comandos do shadcn; sem uso no app do Foglamp, por isso extra |
| `tw-animate-css`, `@toolwind/corner-shape`, `class-variance-authority`, `@base-ui/react`, `@tabler/icons-react`, `next-themes`, `recharts`, `react-day-picker` | entram pelo `base` e pelos primitivos | São as dependências da tabela 2.1 do mapa, sem substitutos |
| `slot-text`, `border-beam` | entram só pelos extras `rolling-text` e `border-beam-card` | MIT, usadas verbatim pelo Foglamp; nunca vêm por padrão |
| `@number-flow/react` | não | O Foglamp declara e nunca importa; o count-up canônico é o `number-ticker` (`animate` 0.6 s `easeOut`, formatando a cada frame) |
| Som (`@web-kits/audio`, Cuelume, soundcn) | não | Nenhum produto da Lyx ou do João toca som na UI; o Foglamp também não |

## 2. Itens opcionais (não vêm por padrão)

| Item do desengs | Decisão | Por quê |
|---|---|---|
| Dot Matrix | só marketing | Textura decorativa; no app conflita com a regra de superfície limpa |
| Magic UI, Fancy Components, useLayouts | inspiração, nunca instalar em bloco | Trazem raio, easing e sombras próprios; copiar um componente exige retunar para `lib/motion.ts` e para a sombra do sistema |
| AICSS, Beautiful UI | referência para a v2 do bloco `ai-chat` | O bloco nasce do Foggy do Foglamp; essas libs servem para comparar composer e bolhas, não para substituir |
| Gradient Border Plugin | não | Conflita com "sombra no lugar de borda": o sistema não tem borda para gradientar |
| Liveline | investigar para o FCS (Horizonte) | Linha do tempo ao vivo cabe no produto, mas fora do escopo do design system |
| Hashvatar | não | O lume já tem avatar por hash djb2 sobre 16 tons `*-500` (receita do `customer-avatar` do Foglamp) |
| Torph, Calligraph, morphicons, interior.dev | não na v1 | Morph de texto, tipografia animada e ícones animados são efeito de landing; nenhum caso de uso no app |
| DialKit | sim, como devDependency do site, só no `/botoes` | Afinar spring e easing com dial no playground; nunca entra na registry |

## 3. Ferramentas (links)

| Ferramenta | Para quê |
|---|---|
| [OKLCH.fyi](https://oklch.fyi) | Conferir e ajustar os tokens `oklch(...)` do `globals.css` sem sair do espaço de cor |
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
| `vercel-labs/agent-skills` (`web-design-guidelines`) | obrigatória | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | Reviewer que reporta `arquivo:linha` contra as Web Interface Guidelines; é a checagem de acessibilidade e UX que o lume não reescreve |
| `emilkowalski/skills` | recomendada | `npx skills add emilkowalski/skills` | Animação: quando não animar, duração e easing; coincide com as 12 receitas do [09-movimento](./guia/09-movimento.md) |
| `jakubkrehel/skills` | opcional | `npx skills add jakubkrehel/skills` | Detalhes de polish (sombras, bordas, tipografia) em formato de checklist |
| `rams` | opcional | `npx skills add rams` (confira o repositório na página do desengs) | Crítica de design no estilo "menos, porém melhor"; útil em revisão, não em implementação |
| Taste Skill, UI Skills, Impeccable | não | Genéricas demais ou com opiniões de estilo que divergem do look (bordas, gradientes, raio grande) |

Depois de instalar, `skills-lock.json` entra no commit e `npx skills update` mantém as versões.

## 5. Leituras obrigatórias (nesta ordem)

1. **Web Interface Guidelines** (Vercel Labs): a base de a11y, foco, formulários e estados que a skill `web-design-guidelines` aplica.
2. **"You don't need animations"** (Emil Kowalski): decide quando não animar; é a regra 19.4 do Foglamp em prosa.
3. **"Invisible details of interaction design"** (Rauno Freiberg): hover instantâneo, press, interruptibilidade.
4. **"Details that make interfaces feel better"** (Jakub Krehel): sombras, bordas, raio concêntrico, tabular numbers.
5. **"Design Engineering at Vercel"**: o papel que o lume espera de quem o usa.
6. **"Developing taste"** (Emil Kowalski): como avaliar o próprio trabalho antes de pedir revisão.
7. **Devouring Details** (Rauno Freiberg): o curso; as 12 receitas do cap. 09 são exemplos dele aplicados.
8. **Practical Typography** (Matthew Butterick): tamanhos, medida de linha e tabular numbers; explica `text-sm`/`text-xs` e `tabular-nums` 162 vezes.
9. **Laws of UX**: Fitts, Hick e Jakob para justificar densidade e hierarquia das tabelas.

Depois, como consulta: **userinterface.wiki** (vocabulário), **animations.dev** (curso de animação do Emil), **Design System Checklist** (o que ainda falta documentar) e **Interface Cheat Sheet** (tabela rápida de padrões).

## Créditos

Foglamp (Gustavo Fior, Apache 2.0) é a fonte dos valores; craft (Gustavo Fior, MIT) é a fonte dos conceitos; evilcharts (MIT) é vendorizado com cabeçalho. A curadoria acima é do lume e não representa os autores das ferramentas citadas.
