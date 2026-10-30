# Identidade visual por produto

Origem: decisão de 26/10/2026 (ver [DECISOES](../DECISOES.md)), o levantamento das cores fixas da registry no mesmo dia e o tema da Lyx de [camada-lyx](./camada-lyx.md). Para o produto que um dia quiser mudar ou reconstruir a identidade visual sobre o lume: o que pode mudar, o que fica travado e como trocar.

## A regra

<!-- skill:start -->
- Por produto, só a cor muda. Fonte, tamanhos de texto, espaçamento, raio, sombra, movimento, ícones e componentes são os da base e iguais em todo produto.
- Hoje todo produto (Lyx, Horizonte e os próximos) usa as cores do Foglamp, como vêm no `base`. Para ter a cara do sistema, não há nada a fazer.
- Cor própria entra por um tema do produto, instalado depois do `base`; nunca editando à mão o `globals.css` nem `components/ui/*`.
- Hoje um tema só alcança os neutros, o `--destructive` e os gráficos. Botão principal, etiquetas, avisos e a cor de alta e queda têm cor fixa nos componentes e esperam as cores por significado, que a base só faz quando um produto pedir.
<!-- skill:end -->

## O que pode mudar

| Grupo | O que é | Tokens |
|---|---|---|
| Neutros | fundo de trás (canvas), página e cartão, texto, texto secundário, linhas e foco | `--sidebar`, `--background`, `--card`, `--popover`, `--foreground`, `--muted`, `--muted-foreground`, `--accent`, `--border`, `--input`, `--ring` e os pares `-foreground` |
| Significados | sucesso e alta, erro e queda, aviso, informação e marca | `--destructive` hoje; `--success`, `--warning`, `--info` e `--brand` com as cores por significado |
| Botão principal | o `Button` default | `--primary` e `--primary-foreground`, com as cores por significado |
| Etiquetas | as 10 cores do `Badge` | pelo nome: emerald continua emerald, e o produto só ajusta o tom |
| Gráficos | as 5 séries | `--chart-1` a `--chart-5` |

Cada token trocado vem com dois valores, claro e escuro. A sombra colorida acompanha a cor pela mesma fórmula dos badges (anel de meio pixel a 25%, sombra curta a 18% e uma de 4px a 12%, todas na cor); a forma dela não muda.

## O que fica travado

| O quê | Valor da base |
|---|---|
| Fonte | Inter Variable no texto e nos títulos, Geist Mono no código (`--font-sans`, `--font-heading`, `--font-mono`) |
| Tamanhos e pesos | a escala da seção Tipografia do `FRONTEND.md`, com `font-medium` como peso máximo |
| Espaçamento | a escala de `gap-*` e os gutters da seção Espaçamento e ritmo do `FRONTEND.md` |
| Raio | `--radius: 0.625rem`, os pares de raio e o squircle |
| Sombra | sombra no lugar de borda, com as receitas `--custom-shadow` |
| Movimento | durações e curvas de `lib/motion.ts` |
| Ícones e componentes | Tabler (filled quando existe) e os itens da registry como vêm |

Quer mudar algo desta tabela? É mudança da base, para todo produto: PR em `joaodadas/lume` com o checklist do [CONTRIBUTING](../../CONTRIBUTING.md), nunca no tema de um produto.

## Como trocar

### Hoje: um tema do produto

O tema é um item `registry:theme` só com `cssVars` (claro e escuro), no repo do produto, como o `theme-lyx` de [camada-lyx](./camada-lyx.md). Ele entra depois do `base` e em comando separado: quando os dois entram juntos, o `base` vence.

```bash
npx shadcn@latest init joaodadas/lume/base#v0.3.1 -y
npx shadcn@latest add <org>/<repo>/theme-<produto>#vX.Y.Z   # sozinho, depois do init
```

Antes de publicar o tema, confira:

- Só tokens de cor: nada de `--font-*`, `--radius`, `--spacing`, tamanho de texto ou forma de sombra.
- Claro e escuro para cada token trocado.
- Contraste de pelo menos 4,5:1 do texto (`--foreground` e `--muted-foreground`) sobre canvas, página e cartão.
- A ordem das superfícies (princípio 8 da skill): nos dois temas, a luminância sobe do canvas para a página e da página para o cartão (`--sidebar` abaixo de `--background`, que não passa de `--card`).

O que um tema não alcança hoje, em `registry/base-vega/` (levantamento de 26/10/2026):

| Arquivo | Cor fixa |
|---|---|
| `ui/button.tsx` | `Button` default em `bg-neutral-800 dark:bg-neutral-100` e ícones em `neutral` |
| `ui/badge.tsx` | as 10 cores, cada uma com fundo, texto, sombra, anel e hover |
| `components/notice.tsx` | aviso em amber, erro em rose e informação em blue |
| `components/stat-card.tsx` | alta em emerald e queda em red |
| `components/span-type.tsx` | llm em violet, tool em blue, agent em amber e embedding em emerald |
| `components/context-chip.tsx` | falha em rose e cancelado em amber |
| `ui/sonner.tsx` | ícone de sucesso em green e de erro em red |
| `components/copy-icon.tsx` | o check de copiado em green |
| `blocks/app-shell/nav.ts` | os tiles coloridos da nav (`navTile`), com sombra em rgba |
| `blocks/app-shell/nav-list.tsx` | o ponto de trabalhando em amber |
| `blocks/data-table/data-table.tsx` | os ícones dos filtros em `neutral-500` |

### Quando um produto pedir: as cores por significado

A base troca essas cores fixas por significados: `--success`, `--warning`, `--info`, `--brand`, o `--primary` no `Button` default e as 10 cores de etiqueta pelo nome, todos com os valores do Foglamp como padrão. Quem fica no Foglamp não vê diferença, e o tema do produto passa a alcançar tudo. Pontos da proposta, para decidir nesse dia:

- Alta usa sucesso, e queda usa erro.
- Erro é o `--destructive` que já existe: um vermelho só, no lugar de rose e red.
- Sem `--brand` no tema, a marca cai no cinza do botão principal.
- `button.tsx` e `badge.tsx` são cópias verbatim do Foglamp: a troca vira patch em `scripts/sync-upstream.ts`, senão o sync desfaz.

## As travas

- Hoje: a regra está no `FRONTEND.md` (Tokens e cor) e na skill, e a revisão do PR confere o tema.
- Com as cores por significado: uma checagem no CI do app reprova o tema que tiver token que não é cor, contraste abaixo de 4,5:1 ou a ordem das superfícies invertida.

## Exemplo: o teal da Lyx

Fora de uso: por enquanto a Lyx usa as cores do Foglamp. Fica aqui como exemplo de identidade própria, com a recomendação que a base fez em 15/10/2026: o teal entra como `--brand`, e `--primary` fica cinza como no Foglamp.

| Onde o teal entra | Como |
|---|---|
| Logo e tile de marca na sidebar | `LyxLogo className="text-brand"`; tile pela receita do `navTile` com os rgba do teal |
| Login | fundo do painel de marca e o CTA |
| `Badge variant="brand"` | status de marca, nunca estado (estado continua emerald, rose e amber) |
| `Button variant="brand"` | no máximo um por tela, o CTA principal; o resto `default`, `secondary` e `ghost` |

| Token | Claro | Escuro |
|---|---|---|
| `--brand` | `#025864` | `#03A698` (o teal claro que a 52W já usa no dark) |
| `--brand-foreground` | `#ffffff` | `oklch(0.145 0 0)` |
| `--custom-shadow-brand` | `0 0 0 .5px rgba(2,88,100,.25), 0 .5px 2px -.5px rgba(2,88,100,.18), 0 2px 4px 0 rgba(2,88,100,.12)` | `0 0 0 .5px rgba(3,166,152,.25), 0 .5px 2px -.5px rgba(3,166,152,.18), 0 2px 4px 0 rgba(3,166,152,.12)` |
| `--color-brand` (`@theme inline`) | `var(--brand)` | |

Porquê `--brand`: o look é cinza estrutural com cor só por significado; o `Button default` da base nem usa `--primary` (é `bg-neutral-800 dark:bg-neutral-100`, `registry/base-vega/ui/button.tsx`), então pintar `--primary` de teal mudaria pouco e ainda tingiria `ring`, `selection:bg-primary/10` e todo `text-primary` do app. O guia de design do João no `lyx-qualidade-front` já fixou "cor em quatro lugares" (logo de terceiro, glifo de status, ícone destrutivo, quadrado de marca), e o tile da marca é o quarto lugar.

As variantes `brand` do `Badge` e do `Button` pedem as cores por significado na base. Sem elas, a Lyx teria que copiar `badge.tsx` e `button.tsx` para a camada e conferir as cópias a cada versão da base, que é o caminho que o lume evita.
