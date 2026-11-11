# Adoção

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/11-receita.md`, `docs/adocao/*.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Cabeçalho, origem, como ler

<!-- mapa: 1, 20.10, 21.12 | regras 22, 23 -->

Regras para construir qualquer interface com o lume. Toda regra é dura salvo indicação em contrário: se um padrão não cabe, levante antes de contornar. O texto segue a regra praticada no código do Foglamp (github.com/foglamp-labs/foglamp, commit `2bc3bb5`, Apache 2.0), não o `FRONTEND.md` original dele; onde os dois divergem (tema padrão `dark`, `motion/react` em uso, borda aceita em linha de tabela, divisor e campo no dark, `QueryCache.onError` em `utils/trpc.ts`, nenhum `error.tsx`), vale o código. Adições próprias estão marcadas com "(adição do lume)". A leitura longa, com tabelas e valores, fica em `docs/guia`; os conceitos do craft (Gustavo Fior, MIT) em `docs/conceitos`; as decisões do repo em `docs/DECISOES.md`.

- **Always** leia caminhos sem prefixo como relativos à raiz deste repo (`registry/base-vega/ui/button.tsx:10`); caminhos que começam em `apps/web/` ou `packages/ui/` são do Foglamp, citados para o que ainda não virou item da registry.
- **Always** instale pela registry: `npx shadcn@latest init joaodadas/lume/base#v0.4.2 -y` (sem `-d`: o `-d` ignora o `base` e instala o style padrão por cima) e `npx shadcn@latest add joaodadas/lume/<item>#v0.2.0`; a skill vem com `npx skills add joaodadas/lume --skill lume-design-engineering`.
Porquê: o lume é uma cópia fiel de um sistema que está no ar; a autoridade é o código, e este arquivo é o que dev e agente leem antes de escrever qualquer tela.

## Layout do projeto

<!-- mapa: 2.2, 21.2 | regras 1, 7 -->

- **Always** trate `components/ui/*` como item da registry: é instalado pela CLI e atualizado com `add --overwrite`, nunca editado à mão. Uma variant nova entra por `className` com `cn()`; se for reusada, abre PR na base.
- **Always** ponha composições do app (shell, páginas, tabelas, chips) em `components/app/*` e helpers em `lib/{utils,format,motion,range}.ts` (itens `utils`, `format`, `motion`, `range`) e `hooks/*` (`use-mobile`, `use-delayed-loading`, `use-entrance-once`, `use-debounced-value`, `use-copied`).
- **Always** mantenha um único arquivo de tokens: `registry/base-vega/styles/globals.css` (o `base` o instala em `app/globals.css`); nenhum token mora em componente.
- **Never** crie um segundo primitivo com o mesmo papel em `components/app`; componha o da registry (`Button`, `Card`, `Table`...) ou proponha a mudança na base.

Porquê: o Foglamp tem um pacote de UI como fonte única (`packages/ui`) e um app que só compõe; separar os dois é o que deixa a sincronização com o upstream (`scripts/sync-upstream.ts`) e a camada da Lyx possíveis.

## Next.js e Vite: o que muda

<!-- mapa: 8.4, 21.7, painel | regras 14, 15 -->

- **Always** no Next: trio por rota (`header.tsx` com um `RouteHeader`, `loading.tsx` só com ele, `page.tsx` com o client ou `Suspense fallback={<XHeader />}` quando lê `useSearchParams`); `params` e `searchParams` são `Promise` e o server resolve e passa como prop; instale `link-next` (mesmo caminho `components/link.tsx`, sobre `next/link` com `prefetch`); imagens por `next/image` com `alt` obrigatório.
- **Always** no Vite (como o painel do lyx-pr-agent): instale `link` no lugar de `link-next` (os dois gravam o mesmo `components/link.tsx`; o `link` é um `<a>` puro com `href` string, sem adaptador de rota); `useUrlFilters` (`registry/base-vega/blocks/data-table/url-filters.ts`) funciona sem roteador porque lê `window.location.search` por `useSyncExternalStore` e grava com `history.replaceState`; `theme-provider-csp` + `public/theme.js` no `<head>` quando não há script inline.
- **Always** importe os blocos de `components/link`, nunca de `next/link` ou de `react-router` diretamente, para o mesmo bloco instalar nos dois.
- **Never** use o Pages Router, `<a href>` para rota interna no Next (reload completo; `<a>` só para `mailto:`, `tel:`, externo e item com `external: "page"`, que leva a outra zona do mesmo domínio), ou `<img>` cru fora de URL de terceiro com `referrerPolicy="no-referrer"`.

Porquê: a indireção de `link` e o estado de URL sem roteador são o que deixa os blocos puros; `route-header` é a única peça `nextOnly` e por isso sai só na v0.2.

## Regras para agentes

<!-- mapa: 3.7, 21.12 | regras 22, 23 -->

- **Always** instale e use junto: `npx skills add joaodadas/lume --skill lume-design-engineering` (este arquivo gerado em `SKILL.md` + `references/`), `npx skills add gustavo-fior/craft` (a teoria; o lume cita o craft, não o substitui), `web-design-guidelines` de `vercel-labs/agent-skills` (reviewer que reporta `arquivo:linha`), `emilkowalski/skills` (animação; as sub-skills que valem são `review-animations`, `find-animation-opportunities`, `ask-sonner` e `break-ui`), `jakubkrehel/skills` (`better-ui` para superfícies e tipografia, `interface-review` para revisão com severidade) e `raphaelsalaja/userinterface-wiki` (150 regras de movimento e a11y; zero cortado e som ficam desligados no lume); a ordem de leitura está em `docs/referencias.md`.
- **Always** afine botão, badge e chip no playground `/botoes` (`app/botoes/page.tsx`, tecla `T` alterna o tema) antes de abrir PR, e reporte revisão em tabela Before / After / Regra.
- **Always** comente em uma linha todo valor arbitrário (`[...]`), todo hex e toda exceção a este arquivo, e marque o que é adição própria.
- **Never** instale biblioteca de componentes, ícones, tabela, estado global (Zustand, Redux, Jotai) ou CSS file por componente; se parecer necessário, levante antes.

Porquê: o Foglamp codifica com agentes em camadas (skills genéricas, regras do repo, comentários no código); o lume mantém a mesma pilha e o `check` do repo garante que este arquivo e o código não divirjam.

## Do guia: 11. Receita: do zero a um app com a cara do Foglamp

### Passo 0: decisões já tomadas (não reabra sem issue)

| Decisão | Escolha no lume | Confira |
|---|---|---|
| Primitivos | Base UI (`@base-ui/react`): composição por `render`, estados `data-open`/`data-closed`, nunca `asChild` | `grep -r asChild src` devolve zero |
| Style e ícones | shadcn `base-vega`, `baseColor: neutral`, `iconLibrary: tabler`, `menuAccent: subtle`, Tailwind v4 sem `tailwind.config` | `components.json` depois do init |
| Fontes | Inter Variable e Geist Mono via Fontsource (item `base`); Host Grotesk só com `font-display`; sem `cv11`/`ss01` | `document.fonts` lista Inter Variable e Geist Mono Variable; `font-mono` computa Geist Mono |
| Tema | dark como inicial com `enableSystem`; `theme-provider` (next-themes) ou `theme-provider-csp` | `<html class="dark">` no primeiro load sem preferência salva |
| Movimento | `motion/react` permitido com o vocabulário de `lib/motion.ts`; CSS nos primitivos | nenhuma curva literal fora de `lib/motion.ts` e dos charts |
| Formulários | TanStack Form ou React Hook Form, desde que o campo seja o `Input`/`Field` do DS | `login-form` é presentacional |

### Passo 11: regras para agentes (mapa 21.12)

- **Always** escreva as regras no formato Always / Never e com a regra praticada: `motion/react` com o vocabulário do passo 7; borda aceita como linha de tabela, divisor atenuado e hairline de marketing; `defaultTheme="dark"`; Inter via Fontsource (o Foglamp usa `next/font/local`); `IconLoader`; hex permitido quando a cor é dado (marca, hash, categoria), com comentário; `Intl` para números e datas curtas; comentário de uma linha em todo valor arbitrário.
- **Always** vendorize skills com `npx skills add` e mantenha `skills-lock.json` commitado (o Foglamp vendoriza `next-best-practices`, `shadcn`, `turborepo`, `hono`, `better-auth-best-practices`, `codebase-scan` e `next-cache-components` em `.agents/skills`).
- **Always** afine botão, badge e chip no playground `/botoes` (`app/botoes/page.tsx`, tecla `T` alterna o tema; no Foglamp é `/buttons`) antes de abrir PR, fora do grupo autenticado, e reporte revisão em tabela Before / After / Regra citando `arquivo:linha`.
- **Never** instale biblioteca de componentes, ícones, tabela (TanStack Table), estado global (Zustand, Redux, Jotai) ou CSS file por componente; estado compartilhado é React context, estado de lista é a URL, o resto é `useState`.
- Fora do escopo visual (vão para o `AGENTS.md` do projeto, não para o `FRONTEND.md`): env com `@t3-oss/env-nextjs` declarada em três lugares, tRPC com `queryOptions`/`mutationOptions` e invalidação por `queryKey()`, `params`/`searchParams` como Promise resolvidos no server.

## Guias de adoção: comandos e tabela Lucide para Tabler

### A Lyx sobre o lume

Fonte: [docs/adocao/camada-lyx.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/camada-lyx.md).

- A Lyx usa o lume como ele vem: o `base` com o tema clássico (as cores do Foglamp), sem tema próprio e sem camada privada de registry. Não existe `theme-lyx`, e o teal da 52W não volta.
- O layout do shell é escolha de cada front: `layout="sidebar"` (trilho de ícones ou `collapsible="offcanvas"`) ou `layout="topbar"`.
- Front novo ou existente adota pelo comando único de [comando-unico](https://github.com/joaodadas/lume/blob/main/docs/adocao/comando-unico.md). Projeto existente substitui a interface antiga de uma vez ([projeto-existente](https://github.com/joaodadas/lume/blob/main/docs/adocao/projeto-existente.md)).
- O que é só da Lyx (logo, login com Better Auth, link para o Hub, seletor de sistema) fica no próprio front, em `components/app`, composto sobre os blocos do lume (`AppShell`, `login-form`, `ContextSwitcher`). Vira item compartilhado só quando estiver repetido em vários fronts.
- No Hub (o portal e todo sistema do Hub), a marca é sempre a do HUB Tecnologia, nunca a da Lyx: o símbolo em cores fixas (marinho `#01194E`, azul `#005CFB`, ciano `#00C3D4`, centro vazado), nunca em `currentColor`, recolorido, com sombra ou em tile colorido, e o nome em Inter: `HUB` em `font-semibold` e o nome do sistema em `font-normal` ("HUB Tecnologia" no portal, "HUB CRM" no CRM). No slot `brand` do `AppShell` vai o símbolo seguido do nome, e no login o símbolo entra no tile da marca (guia 06). Os arquivos oficiais são o pacote HUB Tecnologia v2; no portal, o componente é o `hub-logo.tsx` do `lyx-hub-front`.
- O `LyxLogo` fica para o que não é do Hub e entra em `currentColor`, na cor do texto, sem tile colorido nem sombra teal.
- Conta: "Voltar ao Hub" (mantém o SSO) e "Sair de todos os sistemas" (signOut) são dois itens separados do `userMenu`.
- O CI dos fronts da Lyx (o reusable `lyx-audit.yml`) roda o `lume check` em todo repo que adotou o lume.

### O comando único: adoção por agente

Fonte: [docs/adocao/comando-unico.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/comando-unico.md).

#### O prompt

##### Como o `init` conduz

- Cada chamada lê o projeto e responde um JSON: `etapa`, `next`, `say` (o que o agente diz ao usuário), `instruction` (o que o agente faz), `run` (os comandos, em ordem), `rules` (as regras da adoção, repetidas em toda resposta) e `details`.
- O estado vem do próprio projeto. Chamar de novo depois de cada passo devolve o passo seguinte, e chamar duas vezes não estraga nada: o init grava o `lume.json` (layout, tema e, quando o usuário aceita subir, a versão nova) e o CSS global da etapa `base`, e o resto ele manda o agente rodar.
- A versão que vale é a do `lume.json`, no init e no check. Os comandos que o init devolve fixam essa versão (`npx -y @joao.dadas/lume@<versao do lume.json> init`), então o projeto não sobe de versão sem querer.
- As etapas, em ordem:
  1. `ler`: confere Next ou Vite com Tailwind 4 e faz as perguntas de produto que faltam: o layout (`--layout=sidebar|offcanvas|topbar`), o tema padrão (`--tema=claro|escuro`) e, num projeto com interface própria, se pode substituir de uma vez (`--substituir=sim|nao`). Com `nao`, o init para (`next: bloqueado`) e explica que o lume não entra pela metade. O resto é da base.
  2. `atualizar` (só quando o pacote é mais novo que o `lume.json`): pergunta ao usuário se quer subir. Com `--atualizar=sim`, regrava o `lume.json` com a versão nova e manda reinstalar tudo do lume com `--overwrite` nela; sem isso, segue na versão do `lume.json`.
  3. `base`: o próprio init escreve o CSS global só com o que o item `base` da versão traz, na ordem em que o `shadcn init` escreve num projeto novo, e guarda o antigo em `<css>.antes-do-lume`. Em `details.cssGlobal` vêm os tokens e as classes próprias que saíram, com quantos usos e arquivos cada um tem no código: as telas não migradas perdem essas cores até serem reescritas. Depois o agente roda o `shadcn init` do item `base` (o `components.json` que não é do lume é apagado antes), que mantém esse CSS.
  4. `componentes`: todos os primitivos, os kits, o `login-form` e o `guia`, com `--overwrite`; no Next, o `link-next` por último. Quando o `components/ui` já tem componentes com nome do lume e outro conteúdo, o init pergunta antes (`next: perguntar`), com os números: quantos arquivos o `--overwrite` troca, quantos componentes antigos ficam e dependem deles, quantos arquivos do app importam um ou outro, e que o app não compila até a migração terminar. Pede um commit antes e segue com `--confirmar-troca=sim`.
  5. `skill`: a skill `lume-design-engineering`, que o agente lê antes de escrever qualquer tela.
  6. `migrar`: o agente reescreve o projeto pelo plano de `details.plano`, um grupo por vez: a configuração, o que o layout raiz e os layouts de rota importam (direta ou indiretamente) e tem violação, para o app voltar a abrir, depois tela por tela (uma pasta de rota de `app/` por grupo, com os componentes que só ela usa), o resto e, por último, a limpeza (componentes antigos de `components/ui` e dependências barradas). Cada grupo traz a contagem e o seu `lume check --path=...`; a cada grupo o agente roda esse check e o typecheck do projeto.
  7. `pronto`: o agente apaga o `<css>.antes-do-lume`, roda typecheck, lint, testes e build, e mostra ao usuário. Commit e push só quando o usuário pedir.
- O `init` grava o `lume.json` na raiz: `{ "versao": "0.4.1", "layout": "sidebar", "tema": "claro" }`. Ele fixa a versão contra a qual o projeto é conferido e é o sinal de que o projeto adotou o lume; o tema é o `defaultTheme` do `ThemeProvider`. Item da registry instalado à parte, fora dos kits do init, entra em `itens` (`"itens": ["theme-switcher"]`) para a atualização reinstalar e o check conferir.

#### O `lume check`

| Regra | O que barra |
|---|---|
| `config/lume-json` | falta o `lume.json`, ou versão e layout inválidos |
| `config/components-json` | `components.json` que não é o do lume (style, ícones, tsx) |
| `config/alias` | alias desviado: o lume mora em `components/ui`, `components` e `lib/utils` |
| `css/base` | CSS global sem a base do lume |
| `css/fonte` | `font-feature-settings`, outro pacote de fonte ou `--font-sans` redefinida |
| `deps/proibida` | `lucide-react`, Radix, outra biblioteca de componentes ou de fonte no `package.json` |
| `ui/editado` | arquivo da registry diferente da versão do `lume.json`: todo `components/ui` e, dos blocos, hooks e `lib/{format,motion,range}.ts`, só os que o lume instalou (os kits do init, `login-form`, `guia`, `link-next` e os `itens` do `lume.json`) |
| `ui/fora-da-registry` | componente que não é do lume dentro de `components/ui` |
| `ui/paralelo` | pasta com cópias de primitivos fora de `components/ui` |
| `codigo/*` | no código do app (a pasta do `@/*` do tsconfig): import das mesmas bibliotecas barradas no `package.json` ou de `next/font`; `asChild`; `data-[state=...]`; `font-bold` e `font-semibold`; `text-2xl` ou maior; cinza `slate`, `gray`, `zinc` ou `stone`; `shadow` e `shadow-xs` a `shadow-2xl`; `space-x` e `space-y` |
| `codigo/import-antigo` | import de `@/components/ui/<x>` (ou relativo até lá) em que `x` não é item do lume nem está em `extras`, um por linha de import: é o que para de compilar quando o componente antigo sai |
| `codigo/dialogo-do-navegador` | `confirm(`, `alert(` e `prompt(` do navegador, chamados direto ou por `window.`; função de mesmo nome declarada no arquivo não conta |
| `codigo/token-orfao` | classe `bg-`, `text-`, `border-`, `ring-`, `fill-` ou `stroke-` com uma cor que não é da paleta do Tailwind nem um `--color-*` do CSS global (ou de um CSS que ele importa), como `bg-success` depois que o token saiu: sem o token a classe não gera CSS e a cor some sem erro. Com `@config` no CSS a regra não roda |

A comparação de `ui/editado` ignora comentários, a diretiva `"use client"`, o caminho dos imports locais (a CLI do shadcn reescreve pelos aliases, inclusive `#/` e `@app/`) e o que o formatador muda (aspas, `;` no fim, vírgula final e espaços), então só pega mudança de código. `lib/utils.ts` fica fora, porque recebe helpers do produto. Exceção de verdade: `lume:excecao motivo=<o porquê>` na linha (ou na de cima) para as regras de código, e `extras` no `lume.json` (`{ "extras": { "kanban": "bloco do produto sem par no lume" } }`) para componente do produto em `components/ui`.

### Identidade visual por produto

Fonte: [docs/adocao/identidade-visual.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/identidade-visual.md).

#### A regra

- Por produto, só a cor muda. Fonte, tamanhos de texto, espaçamento, raio, sombra, movimento, ícones e componentes são os da base e iguais em todo produto.
- Hoje todo produto (Lyx, Horizonte e os próximos) usa as cores do Foglamp, como vêm no `base`. Para ter a cara do sistema, não há nada a fazer.
- Cor própria entra por um tema do produto, instalado depois do `base`; nunca editando à mão o `globals.css` nem `components/ui/*`.
- Hoje um tema só alcança os neutros, o `--destructive` e os gráficos. Botão principal, etiquetas, avisos e a cor de alta e queda têm cor fixa nos componentes e esperam as cores por significado, que a base só faz quando um produto pedir.

#### Como trocar

```bash
npx shadcn@latest init joaodadas/lume/base#v0.4.2 -y
npx shadcn@latest add <org>/<repo>/theme-<produto>#vX.Y.Z   # sozinho, depois do init
```

### Projeto Next novo com o lume

Fonte: [docs/adocao/next-novo.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/next-novo.md).

#### 1. Criar o app

```bash
bunx create-next-app@latest meu-app --ts --tailwind --app --no-src-dir --import-alias "@/*" --use-bun
cd meu-app
```

#### 2. Instalar a base

```bash
npx shadcn@latest init joaodadas/lume/base#v0.4.2 -y
```

Conferir o `app/globals.css` e o `app/layout.tsx` depois do `init`:

| O quê | Comando | Esperado |
|---|---|---|
| Sombras | `grep -cE "^\s*--custom-(outline-)?shadow" app/globals.css` | 34 (17 em `:root`, 17 em `.dark`) |
| Fontes | `grep -n "fontsource\|font-mono" app/globals.css` | `@import "@fontsource-variable/inter/opsz.css"`, `@import "@fontsource-variable/geist-mono"` e `--font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` dentro do `@theme inline` |
| Squircle | `grep -n "corner-shape\|squircle" app/globals.css` | `@plugin "@toolwind/corner-shape"` e `@custom-variant squircle (@supports (corner-shape: squircle))` |
| Dark | `grep -c "@custom-variant dark" app/globals.css` | 1 |
| Sobras do create-next-app | `grep -n "geist\|prefers-color-scheme" app/globals.css` | nada; apague o `@theme inline` com `--font-sans: var(--font-geist-sans)` e o bloco `@media (prefers-color-scheme: dark)` que o template deixa (conferir) |
| `@theme inline` | `grep -c "color-custom-shadow" app/globals.css` | 0: sombra nunca vira `--color-*` |
| `layout.tsx` | `grep -n "next/font" app/layout.tsx` | nada |

O `create-next-app` deixa `Geist` e `Geist_Mono` de `next/font/google` no `app/layout.tsx`. Apague o import, as duas constantes e as classes `${geistSans.variable} ${geistMono.variable}` do `<body>`: a Inter (com o eixo `opsz`) e a Geist Mono já chegam pelo CSS, via Fontsource, e `--font-sans` e `--font-mono` já apontam para elas. Se o `init` reaparecer com uma Inter do `next/font/google` (o style `base-vega` oficial puxa `font-inter`), apague essa linha também.

#### 3. Instalar os itens e a skill

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.4.2 joaodadas/lume/kit-tabela#v0.4.2 joaodadas/lume/kit-formulario#v0.4.2 joaodadas/lume/kit-feedback#v0.4.2 joaodadas/lume/kit-dados#v0.4.2 joaodadas/lume/kit-graficos#v0.4.2 joaodadas/lume/login-form#v0.4.2
npx shadcn@latest add joaodadas/lume/link-next#v0.4.2 --overwrite
npx shadcn@latest add joaodadas/lume/guia#v0.4.2
npx skills add joaodadas/lume --skill lume-design-engineering
```

### Adotar o lume num projeto que já existe

Fonte: [docs/adocao/projeto-existente.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/projeto-existente.md).

- Projeto que já existe adota o lume **de uma vez**. O lume substitui a interface antiga, não convive com ela: nada de pasta paralela (`components/lume/ui`, `components/ds`), nada de alias desviado no `components.json`, nada de componente antigo com a API antiga e "a receita do lume por dentro".
- O caminho é o comando único de [comando-unico](https://github.com/joaodadas/lume/blob/main/docs/adocao/comando-unico.md): `npx -y @joao.dadas/lume@latest init`, seguido pelo agente até o fim. Ele instala a base, todos os componentes e a skill, com `--overwrite`, lista o que sobrou do sistema antigo e só termina quando o `lume check` passa.
- A API muda, e as telas são reescritas para a API do lume na mesma mudança: `variant="primary"` vira o `default`, `Modal` vira `Dialog`, `icon={X}` vira o ícone como filho, `asChild` vira `render`. A mudança fica grande, e é isso: metade migrada é o que dá a cara errada.
- O que é do produto e não existe no lume (um kanban, um editor, um bloco de domínio) mora em `components/app`, composto com os primitivos do lume. `components/ui` só tem item da registry.
- Sai junto, na mesma mudança: tokens e cores próprios do CSS global, outro `@theme inline` e outro `@layer base`, classes utilitárias próprias (`.btn`, `.card`, `.page-header`...), `lucide-react`, `radix-ui` e `@radix-ui/*`, fonte por `next/font/google` ou por outro pacote (`inter-ui`), e o `data-theme` setado à mão (vira `next-themes` com `attribute="class"`). Não existe camada de aliases temporária.
- O CSS global quem escreve é o `init`, na etapa `base`: só o que a base traz, e o antigo fica em `<css>.antes-do-lume` até o fim. A resposta lista os tokens e as classes que saíram com o uso de cada um no código (no CRM da Lyx, `success`, `warning` e `danger` em uns 90 arquivos cada). Cada uso que sobrou aparece no `lume check` como `codigo/token-orfao`: troque por token do lume ou cor da paleta com significado, num mapa por conceito.
- O `--overwrite` dos componentes troca os arquivos de `components/ui` de mesmo nome, e o app deixa de compilar até a migração terminar: os componentes antigos que ficam dependem dos trocados. O `init` pergunta antes, com os números, e pede um commit. Depois, siga o plano da etapa `migrar`: primeiro o que os layouts usam (o app volta a abrir), depois uma tela por vez, com `lume check --path=<pasta>` e o typecheck a cada uma.
- O layout é escolha do produto: `layout="sidebar"` (trilho de ícones ou `collapsible="offcanvas"`) ou `layout="topbar"`. O `init` pergunta e grava no `lume.json`.

#### O que o agente troca no código

| Radix (new-york) | Base UI (lume) | Onde confere |
|---|---|---|
| `<Button asChild><Link href="/x">...</Link></Button>` | `<Button render={<Link href="/x" />}>...</Button>` | `registry/base-vega/ui/button.tsx:66-69` (`nativeButton` cai para `false` quando há `render`) |
| `<Badge asChild>` | `<Badge render={<a href />}>` (`useRender`) | `registry/base-vega/ui/badge.tsx:57-78` |
| `data-[state=open]:` / `data-[state=closed]:` | `data-open:` / `data-closed:` | `registry/base-vega/ui/dialog.tsx`, `dropdown-menu.tsx`, `select.tsx` |
| `data-[state=active]:` (tabs) | `data-active:` | `registry/base-vega/ui/tabs.tsx` |
| `data-[disabled]:` | `data-disabled:` | `registry/base-vega/ui/dropdown-menu.tsx` |
| `origin-(--radix-popover-content-transform-origin)` | `origin-(--transform-origin)` | `registry/base-vega/ui/select.tsx` |
| `max-h-(--radix-select-content-available-height)` | `max-h-(--available-height)` | `registry/base-vega/ui/select.tsx` |
| `data-[state=selected]:bg-muted` (linha de tabela) | igual, continua | `registry/base-vega/ui/table.tsx:169` |
| Linha clicável com `hover:bg-muted/50` sempre | `<TableRow interactive>` (`data-interactive:hover`, `data-interactive:focus-visible`, `tabIndex 0`) | `registry/base-vega/ui/table.tsx` |
| `size="sm"` do botão `h-8` / `default` `h-9` | `default` já é `h-8`; `sm` é `h-7`; `xs` é `h-6` | `registry/base-vega/ui/button.tsx` |
| `variant="destructive"` para apagar em menu | `variant="ghost-destructive"` | `registry/base-vega/ui/button.tsx` |
| `rounded-md` nos botões | pílula `rounded-full` já no primitivo; não acrescente raio por `className` | `registry/base-vega/ui/button.tsx` |

#### Ícones: Lucide para Tabler

| Lucide | Tabler | Lucide | Tabler |
|---|---|---|---|
| `X`, `XIcon` | `IconX` | `Pencil` | `IconPencil` |
| `ChevronRight` | `IconChevronRight` | `Info` | `IconInfoCircleFilled` |
| `TriangleAlert`, `AlertTriangle` | `IconAlertTriangleFilled` | `ChevronDown`, `ChevronDownIcon` | `IconChevronDown` |
| `Search` | `IconSearch` | `Bell` | `IconBellFilled` |
| `ShieldCheck` | `IconShieldCheckFilled` | `ArrowRight` | `IconArrowRight` |
| `Plus` | `IconPlus` | `Upload` | `IconUpload` |
| `Lock` | `IconLockFilled` | `Layers` | `IconStack2Filled` |
| `CheckCircle2`, `CheckCircle`, `CircleCheck` | `IconCircleCheckFilled` | `Ban` | `IconBan` |
| `Sun` | `IconSun` | `Settings` | `IconSettingsFilled` |
| `Moon` | `IconMoon` | `Save` | `IconDeviceFloppy` |
| `FileText` | `IconFileTextFilled` | `Loader2` | `IconLoader` (o `Spinner` da registry já usa) |
| `CheckIcon`, `Check` | `IconCheck` | `FlaskConical` | `IconFlaskFilled` |
| `XCircle` | `IconCircleXFilled` | `EyeOff` / `Eye` | `IconEyeOff` / `IconEye` |
| `Trash2` | `IconTrashFilled` | `Clock` | `IconClockFilled` |
| `type LucideIcon` | `type Icon` (`import type { Icon } from "@tabler/icons-react"`) | `Building2` | `IconBuilding` |
| `Users` | `IconUsers` (nav: `IconUsers` / `IconUsersGroup`) | `UserPlus` | `IconUserPlus` |
| `LogOut` | `IconLogout` | `Truck` | `IconTruckFilled` |
| `LayoutDashboard` | `IconLayoutDashboard` / `IconLayoutDashboardFilled` | `ShieldAlert` | `IconShieldExclamation` |
| `ChevronUpIcon` | `IconChevronUp` | `Settings2` | `IconAdjustments` |
| `ChevronLeft` | `IconChevronLeft` | `Send` | `IconSend` |
| `ArrowLeft` | `IconArrowLeft` | `RotateCcw` / `RefreshCw` | `IconArrowBackUp` / `IconRefresh` |
| `MoreHorizontal` | `IconDots` | `Mail` | `IconMailFilled` |
| `Cpu` / `Brain` | `IconCpu` / `IconBrain` | `BarChart3` | `IconChartBar` |
| `ArrowUpRight` | `IconArrowUpRight` | `ChevronsUpDown` | `IconSelector` (o `SelectTrigger` da registry já usa) |
| `Paperclip` | `IconPaperclip` | `Package2` | `IconPackage` |

### Vite (SPA) com o lume

Fonte: [docs/adocao/vite.md](https://github.com/joaodadas/lume/blob/main/docs/adocao/vite.md).

#### 1. Projeto e `components.json`

```bash
bunx create-vite@latest meu-painel --template react-ts
cd meu-painel && bun add -d @tailwindcss/vite
```

```bash
npx shadcn@latest init joaodadas/lume/base#v0.4.2 -y
```

#### 2. Itens

```bash
npx shadcn@latest add joaodadas/lume/kit-shell#v0.4.2 joaodadas/lume/kit-tabela#v0.4.2 joaodadas/lume/kit-feedback#v0.4.2 joaodadas/lume/kit-dados#v0.4.2 joaodadas/lume/kit-graficos#v0.4.2
npx shadcn@latest add joaodadas/lume/theme-provider-csp#v0.4.2 --overwrite
npx skills add joaodadas/lume --skill lume-design-engineering
```

#### 3. Bloco a bloco: o que usava Next e a variante pura

| Item | No Foglamp dependia de | No lume (puro) | No Vite você faz |
|---|---|---|---|
| `link` / `link-next` | `next/link` em todo bloco | `components/link.tsx` é um `<a href>` com `href: string` (`registry/base-vega/components/link.tsx`); `link-next` troca o arquivo por `next/link` no mesmo caminho | Instale só `link`. Para SPA, troque o corpo de `components/link.tsx` pelo `Link` do roteador: o `rota.tsx` do painel (`pushState` + `useRota`) ou `<RouterLink to={href} {...props} />` do react-router. Mesmo contrato, os blocos não mudam |
| `app-shell` | `usePathname()` e `authClient` | `pathname`, `user` e `defaultOpen` são props (`AppShellProps` em `registry/base-vega/blocks/app-shell/app-shell.tsx`) | `pathname={useRota().caminho}` (painel) ou `useLocation().pathname`. A gaveta mobile fecha sozinha quando `pathname` muda (`CloseOnNavigate`). O recolhido sai do `document.cookie` antes da primeira pintura: `useState(() => readSidebarOpen(lerCookie(SIDEBAR_COOKIE), true))` e `defaultOpen={aberto}` (receita em `docs/guia/03-shell-e-paginas.md`, Persistência do recolhido) |
| `page-header`, `stat-card`, `context-chip`, `markdown-components` | `next/link` e o tipo `Route` | `href: string` pelo `Link` da indireção; `PX = "px-4 md:px-8"` exportado (`registry/base-vega/components/page-header.tsx:14`) | Nada |
| `data-table` | `useSearchParams` + `useRouter().replace` do `next/navigation` | `useUrlFilters` em `registry/base-vega/blocks/data-table/url-filters.ts`: lê `window.location.search` por `useSyncExternalStore` (ouve `popstate` e o evento `lume:urlfilters`) e escreve com `history.replaceState`; mesma assinatura `[values, patch]`, default some da URL, `page` cai em todo patch que não o define | Nada. Se o roteador também lê a query, ele não vê o `replaceState`; o painel não precisa porque só a tabela lê a URL |
| `header-slot` (toolbar portalando para o header) | nada de Next | `HeaderActionsSlotProvider` + `createPortal` | Nada: o `AppShell` já monta o `HeaderActionsSlotProvider` e o `LayoutReserveProvider`, como no Next |
| `range-picker` | nada de Next | `RangeProvider` com `localStorage` e `storageKey` | Nada |
| `theme-provider` | next-themes com `<script>` inline | `theme-provider-csp` (`registry/base-vega/components/theme-provider-csp.tsx`) sem script inline, `useTheme()` com a forma do next-themes, mais `public/theme.js` (`registry/base-vega/public/theme.js`) | `<script src="/theme.js" data-storage-key="lume-theme" data-default-theme="dark"></script>` no `<head>` do `index.html`, antes do `<script type="module">`. Com `base: '/dashboard/'` o caminho vira `/dashboard/theme.js`. No `theme-switcher.tsx`, troque o import de `useTheme` de `"next-themes"` por `@/components/theme-provider` |
| `route-header` (trio header/loading/page) | `loading.tsx` do App Router | fora da v0.1 (`nextOnly`) | Um `PageHeader` no topo de cada página e `Suspense fallback` com skeleton na troca de rota (`Carregando` em `painel/src/app/app.tsx:23-31`), páginas pesadas por `lazy()` |
| `use-entrance-once`, `use-delayed-loading`, `sonner`, charts, `login-form`, `copy-button`, `code-block` | nada de Next | puros | Nada; `code-block` (shiki) por `lazy()` para não entrar no bundle inicial |
