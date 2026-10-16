# 00. Como ler este guia

Origem: mapa cap. 1, 20.10, 21.12 e 21.13. O guia condensa o mapa do design system do Foglamp (`foglamp-design-system.md`, 7958 linhas, 23 capítulos, autor do mapa: João Vitor Dadas) a cerca de um quinto, preservando valores exatos, strings de classe completas e tabelas. Ele descreve o código que está em `registry/base-vega/` do lume: uma cópia do Foglamp HEAD (`2bc3bb5`, 2026-10-12) com as correções listadas em [11-receita](./11-receita.md). O `FRONTEND.md` da raiz é a versão curta (regras Always/Never); este guia é a versão longa, com os porquês e os números.

## Instalação

| Passo | Comando | O que entra |
|---|---|---|
| 1. Base | `npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y` | `components.json` (style `base-vega`, ícones `tabler`, alias `@lume`), `globals.css` com os tokens, `lib/utils.ts`. Nunca com `-d`: o `-d` ignora o `base` e instala o style padrão por cima |
| 2. Itens | `npx shadcn@latest add joaodadas/lume/<item>#v0.1.0` ou um kit (`kit-shell`, `kit-tabela`, `kit-formulario`, `kit-feedback`, `kit-dados`, `kit-graficos`) | primitivos em `components/ui`, blocos em `components`, lib e hooks |
| 3. Skill | `npx skills add joaodadas/lume --skill lume-design-engineering` | a skill para Claude Code e Codex, gerada deste guia e do `FRONTEND.md` |
| Guia no projeto | `npx shadcn@latest add joaodadas/lume/guia#v0.1.0` | `docs/lume/FRONTEND.md`, `docs/lume/guia/*`, `docs/lume/CONCEITOS.md` |

Alias opcional em `components.json`: `"registries": { "@lume": "https://lume-ashmont.vercel.app/r/{name}.json" }`, e então `npx shadcn@latest add @lume/button`.

## Convenções do texto

- Português do Brasil, direto. Marcadores `**Always**` e `**Never**` ficam em inglês porque é o que agente e dev reconhecem como regra dura. Identificadores, classes, props e nomes de arquivo em inglês. "AI", nunca a sigla em português. Sem travessão.
- Caminho sem prefixo é relativo à raiz do lume: `registry/base-vega/ui/button.tsx:10` é a linha 10 do arquivo instalado como `components/ui/button.tsx`. Caminho de arquivo que não existe no lume aponta para o Foglamp (`apps/web/src/components/app/page-parts.tsx:58`), sempre no commit `2bc3bb5`.
- Tabelas trazem a string de classe inteira, não um resumo. Quando a string é longa demais para uma célula, o texto cita o arquivo e a linha e mostra só o trecho que define o "jeito".
- Cada capítulo abre com "Origem: mapa cap. X" e fecha com "O que não copiar". Receitas que a skill reaproveita ficam entre os comentários HTML `skill:start` e `skill:end` (o gerador `scripts/build-skill.ts` extrai só esses blocos); exemplos vivos ficam em `src/examples/<capitulo>/<slug>.tsx` e são referenciados por `<!-- example: capitulo/slug -->`.
- `(adição do lume)` marca o que não existe no Foglamp e foi acrescentado aqui (por exemplo `--font-mono` mapeada, `SidebarTrigger` no mobile, `html { background-color }`). `(inferência)` marca leitura que não está escrita no código do Foglamp nem foi medida no browser.

## Regra escrita x regra praticada

O Foglamp tem um `FRONTEND.md` e um código que o contradiz em pontos conhecidos. O lume segue o código, não o arquivo de regras. Tabela do mapa 20.10 com a decisão do lume:

| Tema | FRONTEND.md original | Código do Foglamp | O lume adota |
|---|---|---|---|
| Tema padrão | `defaultTheme="system"` | `defaultTheme="dark" enableSystem` (providers.tsx:15) | dark, com system habilitado (item `theme-provider`) |
| Fontes | Inter por `next/font/google`, `--font-mono` para Geist Mono | InterVariable local por `next/font/local`; Geist Mono carregada em `--font-geist-mono` e nunca mapeada: `font-mono` computa `ui-monospace` | Inter com eixo `opsz` e Geist Mono via Fontsource, `--font-mono` mapeada de verdade (adição do lume) |
| Bordas | "Never use border for visual separation" | linhas de tabela, divisores de painel, `Empty` tracejado, inputs no dark, hairlines de marketing | a lista fechada de [01-fundacoes](./01-fundacoes.md#onde-a-borda-vale) |
| Hex em classe | "Never hardcode a hex" | cerca de 58 classes `*-[#hex]` (marca `#0090FD`/`#FF5513`, marrom de traces, `table.tsx` footer e caption) | só quando a cor é dado (série de gráfico, cor de marca de terceiro), com comentário; os hex de `table.tsx` viraram `border-border/50 dark:border-border/40` |
| motion/react | "Never add motion/react unless the user explicitly asks" | 29 arquivos importam `motion/react` | permitido com vocabulário fechado em `lib/motion.ts` ([09-movimento](./09-movimento.md)) |
| Paletas cinza | "Never use slate, gray, zinc, or stone" | `--custom-shadow-slate` definido sem uso, 7 `slate` e 2 `zinc` em três arquivos | só `neutral`; o token slate foi removido e `span-type` usa `neutral` |
| Ícones | Tabler, filled por padrão | consistente; `IconLoader` em vez do `IconLoader2` da regra | Tabler filled; `Spinner` com `IconLoader` |
| Overlays e campos | nunca portal próprio, nunca `Input` cru com ícone absoluto | um popover à mão no Scan e uma busca inline com `IconSearch` absoluto no `FilterSelect` | regra escrita (os dois desvios ficaram fora da v0.1) |
| Erros de query | não cobre | `QueryCache.onError` com toast e retry em `utils/trpc.ts:20-31`, não em `providers.tsx`; não existe `error.tsx` | `QueryCache.onError` ao lado do `QueryClient`, `MutationCache.onError` global e um `error.tsx` mínimo (adição do lume, [03-shell-e-paginas](./03-shell-e-paginas.md)) |

## As 23 regras do sistema, uma linha cada

1. Um arquivo de tokens, tudo em `oklch(L 0 0)` nos degraus da paleta `neutral`; dark nunca é preto (`--background 0.17`, `--sidebar 0.145`, `--card 0.205`). [01-fundacoes](./01-fundacoes.md)
2. Sombra no lugar de borda: `shadow-(--custom-shadow)` é "a borda do projeto"; 17 tokens de sombra por tema. [01-fundacoes](./01-fundacoes.md)
3. Hairline de meio pixel: anel de 0.5px no light e 0.75px no dark (commit `c9c0e91`). [01-fundacoes](./01-fundacoes.md)
4. Onde a borda é aceita: linha de tabela, divisor de painel, lista `divide-y`, `Empty` tracejado, input no dark; nunca `border` a 100% fechando uma caixa no app. [01-fundacoes](./01-fundacoes.md)
5. Squircle com raio dobrado só onde `corner-shape` existe: `rounded-lg squircle:rounded-3xl corner-squircle`; `corner-round!` só sob BorderBeam ou em pílula. [01-fundacoes](./01-fundacoes.md)
6. O botão é uma pílula: `rounded-full`, `active:scale-[0.97]`, ring `1.5px`, ícone `size-3.5`, `h-8` default; `ghost-destructive` para apagar. [02-primitivos](./02-primitivos.md)
7. Base UI, `render` prop, `cn` e `data-slot`: zero `asChild`, nenhuma segunda lib de primitivos. [02-primitivos](./02-primitivos.md)
8. Cor é significado, cinza é estrutura: tabela semântica fixa (emerald ok, rose erro, amber aviso...), `--chart-1..5` cinzas. [04-dados](./04-dados.md)
9. Tile de ícone colorido: `bg-{c}-100 dark:bg-{c}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{c}-500` com anel inset a 14%. [03-shell-e-paginas](./03-shell-e-paginas.md)
10. Ícones Tabler, filled quando existe; par outline/filled na navegação com crossfade de 100ms. [03-shell-e-paginas](./03-shell-e-paginas.md)
11. Inter self-hosted, `tabular-nums` em número, mono só para código; Host Grotesk só no marketing. [01-fundacoes](./01-fundacoes.md)
12. Uma receita de superfície: `bg-card`/`bg-popover` + `shadow-(--custom-shadow)` + par de raio + padding; `Card size="sm"` é o card do dashboard; tooltip não invertido. [02-primitivos](./02-primitivos.md)
13. Shell inset: `Sidebar variant="inset"`, `14rem`, scroll em três camadas, coluna `flex flex-col gap-4 py-6 px-0 pb-16`, gutters `px-8` texto e `px-6` controles. [03-shell-e-paginas](./03-shell-e-paginas.md)
14. Header definido uma vez por rota (trio header/loading/page), `PageHeader` em `h-8 px-8` com `h1 text-base font-medium tracking-tight`. [03-shell-e-paginas](./03-shell-e-paginas.md)
15. Loading que não mexe no layout: skeleton após 700ms só no corpo, `table-fixed`, `page-fade-in` de 75ms uma vez por hard load, `placeholderData`. [03-shell-e-paginas](./03-shell-e-paginas.md)
16. Tabela densa e navegável: header `h-13`, linhas `h-12`/`h-16`, hover só em `TableRow interactive`, filtros na URL, sem lib de tabela. [04-dados](./04-dados.md)
17. Hover restraint: hover troca cor ou fundo, nunca transform; chips com `transition-[color,box-shadow] active:scale-100`. [09-movimento](./09-movimento.md)
18. Dois sistemas de movimento: CSS (`tw-animate-css`) nos primitivos, `motion/react` no app com `EASE`, `ENTRANCE_EASE`, `MORPH`, `REVEAL_EASE` de `lib/motion.ts`. [09-movimento](./09-movimento.md)
19. Reduced motion é estado final: nada fica escondido esperando animação. [09-movimento](./09-movimento.md)
20. Dark por padrão: `defaultTheme="dark" enableSystem`; botão mantém sombra no dark, campo troca sombra por hairline. [01-fundacoes](./01-fundacoes.md)
21. Marketing feito com a matéria do produto: cards reais com dados fake, container `max-w-7xl px-5 sm:px-8`, `font-display`. [12-marketing](./12-marketing.md)
22. Regra escrita e regra praticada divergem em pontos conhecidos; o código vence. Esta página, tabela acima.
23. O craft é a teoria: 34 conceitos, 22 integrais no Foglamp, 7 parciais, 5 ausentes. [docs/conceitos](../conceitos/README.md)

## Licenças

- Foglamp: Apache 2.0, Copyright foglamp-labs / Gustavo Fior. Todo arquivo derivado começa com `// Derivado do Foglamp (<url>, <caminho upstream> @ 2bc3bb5), Apache-2.0. Modificado por joaodadas/lume: <resumo>.` (exigência do §4b da licença), garantido por `scripts/sync-upstream.ts` e `scripts/check.ts`. O `NOTICE` da raiz repete a atribuição.
- Craft (conceitos em `docs/conceitos/`): MIT, Gustavo Fior; fontes Inter e Redaction sob OFL. Evil Charts (`evilcharts`): MIT, Gurbinder, vendorizado via Foglamp com cabeçalho. `loader` (TextShimmerLoader): prompt-kit, MIT. shadcn, Base UI, Tabler: MIT. Inter, Geist Mono, Host Grotesk: OFL via Fontsource. NumberFlow, slot-text, border-beam, tw-animate-css, corner-shape: MIT como dependências npm. Lista completa em `THIRD_PARTY_NOTICES.md`.
- O lume (trabalho próprio: blocos, guia, skill, scripts): Apache 2.0, Copyright João Vitor Dadas. A camada da Lyx (`Lyx-Engenharia/lyx-ds`) é privada e depende desta base.

## O que não copiar

Do Foglamp, nada deste capítulo precisa ser copiado à mão: a registry já traz os arquivos. O que não deve ir para um projeto novo: o `FRONTEND.md` original como regra (use o do lume), o `components.json` do Foglamp (aponta para `@foglamp/ui`), o pacote `cn` (o lume usa `clsx` + `tailwind-merge`), e qualquer regra que esteja só na coluna "FRONTEND.md original" da tabela acima.
