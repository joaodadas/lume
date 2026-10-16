# Glossário

Origem: mapa cap. 22. Termos na ordem em que aparecem no guia, do mais básico ao mais específico; cada um aponta para o capítulo que o detalha. Nomes de item da registry em `código` são os que você passa para `npx shadcn@latest add joaodadas/lume/<item>#v0.1.0`.

- **base-vega**: o style do shadcn 4.x declarado em `components.json`; primitivos sobre Base UI com `data-slot`, `cva` e `cn`. O lume parte dele e retoca cerca de metade dos arquivos, como o Foglamp. [02-primitivos](./02-primitivos.md)
- **Base UI e `render` prop**: `@base-ui/react`, headless no lugar do Radix; um componente vira outro elemento com `render={<Link href="/x" />}` em vez de `asChild`, e expõe estado por `data-open`, `data-closed`, `data-starting-style`, `data-ending-style` e variáveis como `--transform-origin` e `--anchor-width`. [02-primitivos](./02-primitivos.md)
- **Token**: variável CSS do `globals.css` (`--background`, `--custom-shadow`, `--radius`) exposta como utility por `@theme inline` (`bg-background`, `shadow-(--custom-shadow)`). "Token semântico" muda entre light e dark; "paleta crua" é `emerald-500`, `neutral-800`. [01-fundacoes](./01-fundacoes.md)
- **oklch**: espaço de cor de todos os tokens; cinzas são `oklch(L 0 0)` e L é a única variável. O browser devolve `lab()`/`oklab()` no computed style. [01-fundacoes](./01-fundacoes.md)
- **Primitivo**: componente de `registry/base-vega/ui/` (instalado em `components/ui`), pré-tokenizado, nunca editado à mão no projeto. **Bloco**: o que vive em `registry/base-vega/components/` ou `blocks/` e junta primitivos com comportamento (`page-header`, `data-table`, `app-shell`). [02-primitivos](./02-primitivos.md)
- **`cn()`**: merge de classes em `lib/utils.ts`, `clsx` + `tailwind-merge` (o Foglamp usa o pacote `cn`; o lume não, porque todo item do `@shadcn` espera esta assinatura). [00-como-ler](./00-como-ler.md)
- **`cva`**: `class-variance-authority`, declara `variants` e `sizes` como strings de classe em 12 primitivos; no app o equivalente são constantes exportadas (`CHIP_SURFACE`). [02-primitivos](./02-primitivos.md)
- **`data-slot`**: atributo de todo subcomponente (`data-slot="input-group-control"`); os primitivos se coordenam por ele com `has-[[data-slot=...]:focus-visible]` e `in-data-[slot=tooltip-content]`. [02-primitivos](./02-primitivos.md)
- **Sombra no lugar de borda**: a regra central: anel de meio pixel a 6% mais contato e ambiente no light, insets brancos no dark. Vale para superfícies; linhas, inputs no dark e divisores usam hairline. [01-fundacoes](./01-fundacoes.md)
- **`--custom-shadow`**: o token base dessa regra, com 16 irmãos (`-chrome`, `-lifted`, `-primary`, `-secondary`, `-destructive`, `--custom-outline-shadow` e 10 coloridos). [01-fundacoes](./01-fundacoes.md)
- **Hairline**: linha de 0.5px ou 0.75px, seja o anel de uma sombra, seja `border-[0.5px]`; cobre também `border-border/40` a `/70` como divisor. [01-fundacoes](./01-fundacoes.md)
- **Tile de ícone**: o quadrado colorido de 18px atrás dos ícones da nav e dos chips de tipo: `bg-{c}-100 dark:bg-{c}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{c}-500` com a sombra inline a 14% e 25%. [03-shell-e-paginas](./03-shell-e-paginas.md)
- **Squircle e `corner-shape`**: canto em superelipse, aplicado por `corner-squircle` do plugin `@toolwind/corner-shape`; a variante `squircle:` (`@supports (corner-shape: squircle)`) sobe o raio dois ou três degraus só onde existe. [01-fundacoes](./01-fundacoes.md)
- **`corner-round!`**: escape que força arco circular: sob um BorderBeam (recorta com `clip-path: inset(round)`) e nas pontas de uma pílula. [01-fundacoes](./01-fundacoes.md)
- **Raio concêntrico (nested border radius)**: raio interno = raio externo menos o inset; `rounded-[calc(var(--radius)-5px)]` nos addons do InputGroup, presets do `range-picker`. [01-fundacoes](./01-fundacoes.md)
- **Hover restraint**: hover é instantâneo ou troca só cor; no código, `transition-[color,box-shadow] active:scale-100` nos chips e zero `hover:scale-*`. [09-movimento](./09-movimento.md)
- **Novelty budget**: o "delight" vai para momentos raros (entrada 3D da landing); navegar no app é instantâneo. [09-movimento](./09-movimento.md)
- **Inset sidebar, canvas e inset**: a única variante de `Sidebar` usada; "canvas" é o fundo `bg-sidebar` do `SidebarProvider`, "inset" é o `SidebarInset`, cartão `bg-background` com `--custom-shadow` e raio onde a página vive, com 8px de margem. [03-shell-e-paginas](./03-shell-e-paginas.md)
- **Trio header/loading/page**: cada rota do Next define o header uma vez em `header.tsx` e o renderiza no `loading.tsx` e no client, para a troca de fallback ser pixel-idêntica. [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`PageHeader` e `RouteHeader`**: o título de página (`px-8 h-8`, `text-base font-medium tracking-tight`) do item `page-header`, e a versão configurada por rota que resolve ícone e chip pelo `navItem(href)`; o modo `back` é a migalha praticada. [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`page-fade-in` e `useEntranceOnce`**: fade de 75ms só de opacidade, uma vez por hard load (hook `use-entrance-once`). [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`useDelayedLoading`**: libera o skeleton só depois de 700ms contínuos de loading (hook `use-delayed-loading`). [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`Toolbar` e "lift"**: a linha de filtros acima da tabela do `data-table`; quando o `trailing` não cabe, um `motion.div` com `layoutId` o portala para o slot de ações do header (`header-slot`). [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`rowNav`**: dá a uma linha de tabela `onClick: push` e `onMouseEnter`/`onFocus: prefetch`, porque linha não é `Link`. [04-dados](./04-dados.md)
- **`HeatCell`**: célula numérica tingida por quintil (verde a vermelho, 600 no light e 400 no dark). [04-dados](./04-dados.md)
- **`CHIP_SURFACE`, `ContextChip`**: a superfície de chip sobre `Button variant="outline"` (`bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted font-normal transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`), item `context-chip`. [04-dados](./04-dados.md)
- **`StatCard`**: tile de métrica (`Card size="sm"`) com ícone, label, delta, valor animado (`number-ticker`) e gráfico que sangra até a borda; item `stat-card`. [03-shell-e-paginas](./03-shell-e-paginas.md)
- **`Field`, `FieldLabel`, `FieldError`**: a família de formulário (`gap-3`, `data-invalid`) usada em dialogs e settings; os forms de auth usam `Label` + `div gap-2.5`. [06-formularios-auth-settings](./06-formularios-auth-settings.md)
- **`InputGroup`**: o container que vira a superfície de um campo com addons (`InputGroupAddon align="inline-end"`), propagando foco e `aria-invalid` por `:has()`. [02-primitivos](./02-primitivos.md)
- **Segmented e `MORPH`**: controle segmentado com pílula deslizante (`motion.span layoutId`) e o spring `{ type: "spring", stiffness: 400, damping: 38 }` de `lib/motion.ts`. [09-movimento](./09-movimento.md)
- **`CopyIcon` e `useCopied`**: o morph copy/check com `scale 0.25` + `blur(4px)` em spring de 0.25s (`copy-icon`, hook `use-copied`). [04-dados](./04-dados.md)
- **evilcharts**: o fork vendorizado do registry Evil Charts (recharts + motion) com `ChartConfig.colors { light, dark }`, `niceDomain` e `isUpdating`; é o que se usa no lugar do `chart.tsx` do shadcn (item `evilcharts`). [04-dados](./04-dados.md)
- **tw-animate-css**: fornece `animate-in`/`animate-out`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`; único motor de animação dos primitivos. [09-movimento](./09-movimento.md)
- **Shiki dual theme**: highlight que emite `--shiki-light` e `--shiki-dark` por token e deixa o `.dark` escolher (item `code-block`). [05-telas-de-detalhe](./05-telas-de-detalhe.md)
- **Craft e skill `craft-design-engineering`**: o repo de ensaios do autor e a skill gerada dos conceitos publicados; o lume cita o craft, não o substitui. [docs/conceitos](../conceitos/README.md)
- **Regra escrita e regra praticada**: o `FRONTEND.md` original e o que o código faz; o lume assume o código como verdade e marca o que é próprio com "(adição do lume)". [00-como-ler](./00-como-ler.md)

## O que não copiar

Os termos do mapa que ficaram fora da v0.1 (Foggy, HUD, Scan e FlowMap, Setup, OG dinâmica, BorderBeam como textura, FogBank, FilmGrain, cutting mat, `DARK_LIFT`, `Piece` e `entrance.ts`, Waterfall, Inspector, drawer de run) descrevem telas do produto Foglamp, não itens da registry; quando um deles virar bloco, entra aqui com o nome do item.
