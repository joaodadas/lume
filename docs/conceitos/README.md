# Conceitos do craft

Os artigos de https://craft.gustavofior.com (Gustavo Fior, MIT, repo
https://github.com/gustavo-fior/craft) são a teoria por trás do Foglamp: o autor é o mesmo, e o
Foglamp é onde ele pratica. Esta pasta reescreve em pt-BR os 11 conceitos publicados, cada um com a
regra, os valores exatos, onde o Foglamp pratica (arquivo:linha, da tabela 3.4 do mapa
`foglamp-design-system.md`) e o que o lume instala. Nada aqui é cópia de parágrafo: é reescrita com
atribuição, e cada arquivo abre com o link do original e do MDX fonte.

Molde de cada arquivo: `Regra` (o quê e por quê), `Valores` (tabela com strings de classe e números,
entre os marcadores `skill:start` e `skill:end`, que o `scripts/build-skill.ts` copia para
`skills/lume-design-engineering/references/09-conceitos-craft.md`), `Onde aparece no Foglamp` e
`No lume` (itens da registry, seções do `FRONTEND.md` e capítulos de `docs/guia/`).

Regra de leitura: o artigo descreve a intenção; o código do Foglamp (commit `2bc3bb5`) descreve a
prática. Quando divergem, o código vence, e o arquivo diz onde diverge. Adição própria do lume vem
marcada como "(adição do lume)".

## Índice por seção

### Typography

- [Tabular Numbers](tabular-numbers.md): dígitos de largura fixa para valores que mudam e colunas numéricas à direita. Integral no Foglamp.
- [Optical Alignment](optical-alignment.md): nudge de 1px por ícone, padding menor do lado do ícone, eixo `opsz` da Inter. Integral.
- [Font Smoothing](font-smoothing.md): `antialiased` no body; só macOS; sem peso leve no dark. Integral.
- Não publicados: Letter Spacing, Text Wrapping, Icons.

### Color

- [Noise](noise.md): grão por `feTurbulence`, só no marketing. Integral, só no marketing.
- [Image Outlines](image-outlines.md): linha de 1px a 10% por dentro da imagem e do avatar. Integral.
- Não publicados: OKLCH, Shadows Not Borders.

### Layout

- [Nested Border Radius](nested-border-radius.md): raio interno = raio externo menos o inset, nas duas variantes do squircle. Integral.
- [HTML Background](html-background.md): `html` pintado com `--background`. Não aparece no Foglamp; o lume adota no `base`.
- [Scroll Fades](scroll-fades.md): desvanecer só a borda que ainda rola; overlay (`ScrollFade`) ou máscara (`scroll-fade`). Parcial.
- Não publicados: Hit Areas, Clip-Path, Squircles.

### Motion

- [Button Press](button-press.md): `active:scale-[0.97]` no botão, `active:scale-100` em gatilho de popup. Integral.
- [Interruptibility](interruptibility.md): transição e spring para o que alterna, keyframe só one-shot, nunca trancar input. Parcial.
- [Hover Restraint](hover-restraint.md): hover instantâneo, tooltip com `delay={150}` em tabela. Parcial.
- Não publicados: Icon Morph, Easings, Stagger, Shared Layout, Exit Animations, Scale Entrances.

### Sound

- Não publicados: Interface SFX, Layering Sounds. O Foglamp e o lume não têm som.

### Data

- Não publicados: Living Charts, Curve Smoothing.

### Craft

- Não publicados: Performance Is Design, How to Get References, Novelty Budget, Taste Is Trained, Timelessness.

## Os 23 não publicados

Os 23 conceitos listados só por nome existem como MDX em `content/` do repo do craft, mas o site só
publica os 11 que estão em `LAUNCH_CONCEPT_SLUGS` (`src/lib/concepts.ts`); os outros aparecem apenas
em desenvolvimento, com a marca "not published". São rascunhos do autor, ainda sem revisão, e por
isso não ganham arquivo aqui. Muitos têm regra praticada no Foglamp (o mapa 3.3 resume cada um com
os valores, e a tabela 3.4 aponta a evidência: Squircles com 124 `corner-squircle`, Hit Areas com
`after:absolute after:-inset-2`, Scale Entrances com `zoom-in-95`, Icon Morph no `copy-icon`), e
essa prática está documentada no guia (`docs/guia/01-fundacoes.md`, `02-primitivos.md`,
`09-movimento.md`) a partir do código, não do rascunho. Quando um rascunho e o código do Foglamp
divergem, o código vence. Quando o autor publicar um deles, ele entra aqui no mesmo molde.

## Como usar junto com a skill do craft

`npx skills add gustavo-fior/craft` instala a skill `craft-design-engineering` com os 34 conceitos
em inglês, publicados e rascunhos. O lume não a substitui: a skill `lume-design-engineering`
(`npx skills add joaodadas/lume --skill lume-design-engineering`) cita estes 11 com os valores do
Foglamp e manda instalar a do craft junto (ver `docs/referencias.md`). Para revisar UI, o fluxo é o
mesmo do craft: reportar cada mudança numa tabela Before, After, Regra, com link para o conceito.
