# 03. Shell, navegação e páginas de lista

Origem: mapa cap. 8. Cobre o shell inset e os seus formatos (os dois layouts do `AppShell`, `layout="sidebar"` e `layout="topbar"`, e a página solta como receita), o modelo de navegação `Nav` com o tile colorido, as peças do shell, a persistência do recolhido, os providers, o trio header/loading/page do Next, a gramática de `page-parts`, o range picker, a toolbar de filtros, ritmo, loading, erro, navegação por linha e breakpoints. Itens: `kit-shell` (`sidebar`, `app-shell`, `page-header`, `stat-card`, `stat-grid`, `empty-state`, `theme-provider`, `theme-switcher`, `link`), `kit-tabela` (`table`, `data-table`, `table-skeletons`, `scroll-fade`, `format`, hooks) e `range-picker`. O `app-shell` instala cinco arquivos em `components/app-shell/`: `app-shell.tsx` (a casca), `nav.ts` (o modelo, sem `"use client"`, importável no servidor), `nav-icon.tsx`, `nav-list.tsx` (os renderizadores de item) e `shell-parts.tsx` (`ShellTrigger`, `ContextSwitcher`, `SearchTrigger`, `useShortcut`). Instale com `npx shadcn@latest add joaodadas/lume/kit-shell#v0.3.0` e `npx shadcn@latest add joaodadas/lume/kit-tabela#v0.3.0`; em Next, troque `link` por `link-next`. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/components/app/...`).

## Camadas do shell

As classes são as constantes de `registry/base-vega/blocks/app-shell/app-shell.tsx` (`CANVAS`, `WRAPPER`, `CARD_HEADER` e as vizinhas). Os dois layouts desenham o mesmo canvas, o mesmo cartão e o mesmo celular; o que muda é onde a navegação mora.

<!-- skill:start -->
| Camada | Elemento | Classes exatas | Fonte |
|---|---|---|---|
| Canvas | `SidebarProvider` | `group/shell relative h-svh min-h-0 overflow-hidden [&_[data-slot=sidebar-gap]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-slot=sidebar-container]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-sidebar=group-label]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&[data-instant]_*]:transition-none motion-reduce:[&_[data-slot=sidebar-gap]]:transition-none motion-reduce:[&_[data-slot=sidebar-container]]:transition-none motion-reduce:[&_[data-sidebar=group-label]]:transition-none motion-reduce:[&_[data-sidebar=menu-button]]:transition-none`; no `topbar`, mais `md:bg-sidebar`, porque sem `Sidebar` no desktop o `has-data-[variant=inset]:bg-sidebar` do primitivo não acende | `CANVAS`; o começo, `group/shell relative h-svh min-h-0 overflow-hidden`, é o do Foglamp (app-shell.tsx:306) |
| Skip link | `a data-slot="shell-skip-link"`, o primeiro foco | `sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-popover focus:px-3 focus:py-1.5 focus:text-sm focus:shadow-(--custom-shadow)` | `SKIP_LINK` |
| Sidebar | `Sidebar variant="inset"` (a única variante) com `collapsible="icon"` (padrão) ou `"offcanvas"` | container `fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear ... md:flex` + `p-2`; `--sidebar-width: 14rem`, `--sidebar-width-icon: 3rem`; no trilho, o gap vai a `calc(var(--sidebar-width-icon)+(--spacing(4)))` e o container fica `2px` maior; abaixo de 768 px vira a gaveta | registry/base-vega/ui/sidebar.tsx:32-34,184-207,220-242 |
| Linha do topo | `div` no `SidebarHeader`, com `ShellTrigger` e marca (ou `top`) | `flex min-w-0 items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-start`; abaixo dela, `tools` numa `SidebarMenu className="gap-0"`, e sem `tools` nada é renderizado | `TOP_LINE` |
| Marca | `div` em volta de `brand` | `flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:*:not-first:hidden`: no trilho sobra o primeiro filho, centrado em 32 px, por isso a marca e o nome vão como irmãos; na barra, `w-auto shrink-0` no lugar de `w-full min-w-0` e sem os `group-data-*` | `BRAND`, `BRAND_BAR` |
| Conteúdo | `SidebarContent` com a nav | `group-data-[collapsible=icon]:overflow-y-auto`: o primitivo trava em `overflow-hidden` no trilho (registry/base-vega/ui/sidebar.tsx:376) e cortaria lista longa | |
| Barra (`topbar`) | `header data-slot="shell-bar"`, montado só fora do celular | `@container/shell-bar hidden h-12 shrink-0 items-center gap-3 px-2 md:flex` | |
| Wrapper | `div data-slot="shell-wrapper"` | sidebar: `flex min-h-0 min-w-0 flex-1 flex-col gap-2 transition-[margin] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[collapsible=offcanvas]:ml-2 md:peer-data-[variant=inset]:peer-data-[collapsible=icon]:ml-0.5`; topbar: `flex min-h-0 min-w-0 flex-1 flex-col md:mx-2 md:mb-2` | `WRAPPER`, `WRAPPER_BAR` |
| Inset (o cartão) | `SidebarInset`, o único `<main>` | base `relative shadow-(--custom-shadow) dark:shadow-(--custom-shadow) flex w-full flex-1 flex-col bg-background ...` + `min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl` | registry/base-vega/ui/sidebar.tsx:307-312 |
| Cabeçalho do cartão | `header data-slot="shell-card-header"`, com `ShellTrigger`, marca (ou `top`) e a página atual | `flex h-12 shrink-0 box-content items-center gap-2 border-b border-border/40 px-3 pt-[env(safe-area-inset-top)] md:hidden`; com a sidebar recolhida em offcanvas no desktop, mais `md:flex md:px-2`; marca em `flex min-w-0 flex-1 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0`; página atual (de `findActive`) em `ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground`, com o `NavIcon` | `CARD_HEADER`, `CARD_BRAND` |
| Faixa | `div data-slot="shell-banner"`, só com `banner` | `shrink-0`, entre o cabeçalho e o viewport, fora do scroll | |
| Viewport de scroll | `div data-slot="shell-viewport"` com `tabIndex={-1}`, alvo do skip link | `min-h-0 flex-1 overflow-y-auto outline-none`; com `fill`, `flex min-h-0 flex-1 flex-col overflow-hidden outline-none` | `VIEWPORT`, `VIEWPORT_FILL`; no Foglamp era um `<main>` (app-shell.tsx:388) |
| Coluna da página | `div data-slot="shell-column"` | `flex flex-col gap-4 py-6 px-0 pb-16`; com `fill`, `flex min-h-0 flex-1 flex-col` | `COLUMN`, `COLUMN_FILL`; Foglamp app-shell.tsx:389 |

A árvore é a mesma nos dois layouts, com `null` no lugar do que falta:

```text
HeaderActionsSlotProvider > LayoutReserveProvider > ShellLayoutProvider (layout)
  SidebarProvider                          canvas; ref para o data-instant do atalho
    a data-slot="shell-skip-link"          "Pular para o conteúdo"
    CloseOnNavigate, ShellKeys             sem DOM
    SidebarMenu hidden com tools ou null   só no celular com a gaveta fechada: mantém o Cmd/Ctrl+K
    TooltipProvider delay={150}            sem DOM: o peer da Sidebar continua irmão do wrapper
      Sidebar ou null                      no topbar, só no celular (a gaveta)
    div data-slot="shell-wrapper"
      header data-slot="shell-bar" ou null só no topbar, fora do celular
      SidebarInset                         o cartão e o único main
        header data-slot="shell-card-header"
        div data-slot="shell-banner" ou null
        div data-slot="shell-viewport"     id do skip link, tabIndex -1
          div data-slot="shell-column"
            children
    panel ou null                          irmão do wrapper, no canvas
```
<!-- skill:end -->

- O canvas é sempre um pouco mais escuro que o inset: `--sidebar` `oklch(0.975 0 0)` contra `--background` `oklch(0.99 0 0)` no light, `oklch(0.145 0 0)` contra `oklch(0.17 0 0)` no dark (registry/base-vega/styles/globals.css:23,47,133,156). O inset flutua sobre ele com `--custom-shadow`, sem borda.
- Scroll em três camadas: `overflow-hidden` no inset, `overflow-y-auto` no viewport e a coluna flex num filho ("o container de scroll nunca tenta encaixar o conteúdo por flex", app-shell.tsx:385-387). O viewport é `div`, porque o `SidebarInset` já é `<main>` e a tela tem um `main` só. A sidebar não contém scroll; `SidebarContent` é `no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto`. Com `fill`, a página é dona da altura e do scroll (chat, mural, editor) e viewport e coluna viram flex sem `overflow-y-auto`.
- O wrapper extra é quem aplica a margem de 8px do canvas; por isso o `md:peer-data-[variant=inset]:rounded-lg` do primitivo fica inerte e o shell repõe `md:rounded-lg squircle:md:rounded-3xl` no inset. No lume ele também troca o `peer-data-[state=collapsed]:ml-2` do primitivo por `ml-0.5` no trilho, para o cartão ficar a 8 px do miolo da sidebar como na aberta, e por `ml-2` no offcanvas recolhido, e anima a margem junto com a sidebar.
- Celular, o mesmo nos dois layouts: o Foglamp não renderiza gatilho (só Cmd/Ctrl+B abre o `Sheet`). No lume, abaixo de 768 px o cabeçalho do cartão traz o `ShellTrigger` ("Abrir menu"), a marca (ou `top`) e a página atual, e a gaveta traz a linha do topo, `tools`, a nav e a conta (adição do lume). Com `box-content`, o `h-12` é a linha do gatilho, e a borda e a área segura somam por fora: o cabeçalho mede 49 px com a borda, e o gatilho fica em (12, 8) no celular e em (16, 16) no offcanvas recolhido.
- Árvore estável: trocar de `layout` ou de `fill` no mesmo `pathname` não remonta a página, porque cada peça fica na mesma posição. Medido na bancada: o estado local e o valor de um input sobrevivem à troca. O id do skip link vem de `useId`, porque a vitrine monta mais de um shell por página.
- `ShellKeys` é um listener de `keydown` no `ownerDocument` do canvas, na bolha, que roda antes do listener que o primitivo põe em `window` (registry/base-vega/ui/sidebar.tsx:99-112). Com `b` e Meta ou Ctrl, ele para o evento com `stopPropagation`, sem `preventDefault`, em três casos: alvo `contenteditable` (o negrito do editor segue), `topbar` no desktop (nada alterna e o cookie não muda) e evento já tratado (`defaultPrevented`). No resto, marca `data-instant` no canvas por dois frames e deixa o primitivo alternar sem transição. Em `input` e `textarea` o atalho vale, porque não há negrito a roubar; isso inclui o composer de um chat.
- O skip link "Pular para o conteúdo" tem `href="#id"` para funcionar sem JS e, no clique, faz `preventDefault` e `focus()` no viewport, para o hash não ir para a URL nem para o histórico (a rota pode usar o hash).

## Formatos

Três formatos e uma receita, todos com o mesmo canvas, o mesmo cartão, o mesmo item de navegação, o mesmo menu de conta e o mesmo celular (adição do lume). A família vive num item só, o `app-shell`, e nenhum primitivo verbatim muda para isso.

<!-- skill:start -->
| Formato | Como se monta |
|---|---|
| Lateral | `layout="sidebar"`, o padrão |
| Agente | a Lateral em trilho, com `fill` e `panel` |
| Barra de zonas | `layout="topbar"` |
| Página solta | receita sem `AppShell` (seção Página solta, neste capítulo) |

**Regra de escolha.**

1. Não navega entre telas (login, link por token, convite, sem acesso, indisponível, onboarding, embed): página solta.
2. Um nível com até 7 zonas, produto de leitura que quer a largura toda, ou mural de TV: `layout="topbar"`. Hoje vale só para a Horizonte (Plataforma, Início, Carteira e Conta) e para o mural do BI. Front da Lyx que navega nunca usa a barra.
3. Todo o resto: `layout="sidebar"`, o padrão. A barra que passar de 7 zonas ou pedir segundo nível vira Lateral.
4. Recolher: `collapsible="icon"` (padrão) quando todo item de primeiro nível tem ícone e o app é de uso diário; `"offcanvas"` quando a nav é texto ou a tela às vezes pede a largura toda; `defaultOpen={false}` quando a lista é longa e o conteúdo manda (BI). O trilho é sempre estado recolhido, nunca o único estado: a primeira visita abre a sidebar.
5. Agrupar: até 7 itens sem rótulo; acima disso, seções com rótulo de 5 a 9. Um nível de filho, nunca dois. O excedente vai para a paleta ou para um item com filhos. Seção vazia não aparece, e o filtro por papel roda antes do shell.
6. Altura e paralelo: `fill` quando a página é dona do scroll (chat, mural, editor); `panel` quando um assistente ou a carteira trabalha ao lado; o que é passageiro abre em Sheet, e o que é destino vira rota.
7. Contexto: `top` recebe o `ContextSwitcher` só quando há mais de um contexto (sistemas irmãos, obra, setor, praça, conta). O Hub não leva. Trocar de contexto é link.
8. Dados: busca, contagem e sino só com fonte real; contagem zero não aparece. Na Lateral, notificação é item com badge (Inbox). Na barra, é um botão de ícone em `tools`.
9. Filtro global (obra, período) mora num provider do shell, e o controle vai nas ações do `PageHeader`, como o `RangePicker`. Não existe barra de filtros no chrome.
10. Conta na Lyx: "Voltar ao Hub" (mantém o SSO) e "Sair de todos os sistemas" (signOut) são dois itens do `userMenu`, montados pela camada Lyx. A pesquisa achou 20 arquivos em 12 repos misturando as duas semânticas.
<!-- skill:end -->

### Lateral: `layout="sidebar"` (padrão)

```text
aberta                              trilho                         recolhida (offcanvas)
+-canvas bg-sidebar-------------+   +-canvas-----------------+    +-canvas------------------+
|[=][# Sistema v] +-cartao-----+|   |[=]+-cartao-----------+ |    |+-cartao----------------+|
| Buscar   Cmd K  | PageHeader ||   |[#]| PageHeader       | |    ||[=] # Marca   Pedidos  ||
| Inicio          | o scroll   ||   |[o]|                  | |    ||-----------------------||
| OPERACIONAL     | mora aqui  ||   |[*]|                  | |    || PageHeader            ||
| (*) Pedidos 12  |            ||   |[ ]|                  | |    ||                       ||
| Contratos   >   |            ||   |(J)+------------------+ |    |+-----------------------+|
| (J) Joao    >   +------------+|   +------------------------+    +-------------------------+
+-------------------------------+
[=] fica em (16, 16) nos tres estados. (*) ativo: fundo, icone filled e aria-current.
```

Quando usar: é o padrão de todo app que navega entre telas, com seções, filhos, mais de 7 destinos, lista dinâmica (conversas, favoritos) ou troca de contexto. `collapsible="icon"` (padrão) para app de uso diário com ícone em todo item de primeiro nível; `"offcanvas"` para nav de texto ou tela que às vezes pede a largura toda; `defaultOpen={false}` para lista longa, em que o conteúdo manda.

| Front | Como monta |
|---|---|
| Hub de sistemas (Lyx) | Seções Início, Sistemas e Administração, com os sistemas em `external: "tab"`; `tools` com `SearchTrigger` para a paleta do Hub; sem `top`, porque a lista já é o seletor; `userMenu` com o Sair real. Com 16 sistemas, divida por grupo do catálogo ou deixe o excedente na paleta |
| Módulo CRUD | 2 a 18 itens em 1 a 4 seções, já filtradas por papel; `top` com `ContextSwitcher` dos sistemas irmãos do grupo, quando houver; `userMenu` com "Voltar ao Hub" e "Sair de todos os sistemas" |
| Operacional grande | Cada seção com ícone vira item com filhos, que no trilho abre um menu ao lado; setor, praça ou conta no `top`; impersonação e só leitura no `banner`; notificação como item com badge |
| BI | Categorias como itens com filhos, `defaultOpen={false}` (abre em trilho) e paleta em `tools`. Tela cheia: `collapsible="offcanvas"` com `open={false}`. Mural de TV: a Barra de zonas |
| Parceiro logado | O mesmo formato, com a lista recortada por papel antes do shell e `user.detail` com o papel legível |
| Web de campo no celular | A gaveta com itens de 44 px |
| Agente da Horizonte | A receita Agente, abaixo |

<!-- skill:start -->
**Lateral: recolher.**

| Estado | Desktop | Gatilho |
|---|---|---|
| Aberta | 14rem; o cartão fica a 8 px do miolo da sidebar | `ShellTrigger` no topo da sidebar, em (16, 16) |
| Trilho (`collapsible="icon"`, padrão) | gap de `3rem` mais `1rem` e container `2px` maior (registry/base-vega/ui/sidebar.tsx:226-238); o wrapper vai a `ml-0.5` e o cartão continua a 8 px. A linha do topo vira coluna: a marca desce para (16, 52), centrada na mesma coluna dos ícones; seção sem item com ícone, item sem ícone e item desabilitado somem; os rótulos continuam no DOM, cortados por overflow | o mesmo `ShellTrigger`, na mesma posição |
| Recolhida (`collapsible="offcanvas"`) | sidebar fora da tela e fora da ordem do Tab (`inert` no container), wrapper com `ml-2` | `ShellTrigger` no cabeçalho do cartão, em (16, 16): 8 do wrapper mais 8 do `md:px-2` |

Recolher ou expandir não perde o foco. Quando o elemento focado some (no trilho, o rótulo do pai, um filho, o item sem ícone, o ⋯ ou o seletor sem ícone; ao expandir, o cabeçalho do cartão) ou fica `inert` (a sidebar em offcanvas), o `AppShell` leva o foco, logo depois do commit, ao `ShellTrigger` à vista: o do cabeçalho do cartão com a sidebar fora, o do topo da sidebar nos outros estados. Sem isso o navegador o largaria no `body` (WCAG 2.4.3). Foco num campo da página fica onde está.

**Lateral: celular**, abaixo de 768 px (registry/base-vega/hooks/use-mobile.ts:5).

- A sidebar vira o `Sheet` do primitivo (registry/base-vega/ui/sidebar.tsx:184-207). O `SIDEBAR_WIDTH_MOBILE` pede `18rem`, mas o `data-[side=left]:w-3/4` do `SheetContent` vence o `w-(--sidebar-width)` por especificidade: a gaveta sai com 3/4 da tela (292,5 px em 390) e para em `sm:max-w-sm`. É do primitivo e só muda com um `Patch`.
- A gaveta abre pelo `ShellTrigger` do cabeçalho `h-12` do cartão. O cartão encosta nas bordas: margem e raio só valem a partir de `md`.
- Na gaveta ficam a linha do topo (`ShellTrigger` como "Fechar menu" e a marca), `tools`, as seções e a conta.
- Itens de 44 px por `in-data-[mobile=true]:h-12` (a pílula de 44 entre as bordas transparentes de 2 px), sobre o `data-mobile="true"` de registry/base-vega/ui/sidebar.tsx:191; a contagem e o ⋯ descem para `top-3.5`. O `ShellTrigger` ("Abrir menu" e "Fechar menu") e o `ContextSwitcher` também chegam a 44 px de alvo, no cabeçalho do cartão e na gaveta.
- Os `tools` moram na gaveta, e o `Sheet` desmonta o conteúdo fechado. Para o Cmd/Ctrl+K do `SearchTrigger` valer com a gaveta fechada, o `AppShell` monta uma cópia escondida dos `tools` (`SidebarMenu hidden`, fora do Tab e do leitor de tela) enquanto ela está fechada e a tira quando ela abre. Na saída animada da gaveta as duas coexistem, e o `defaultPrevented` do `useShortcut` deixa só uma abrir a paleta.
- O ⋯ fica sempre visível, porque o `showOnHover` só esconde a partir de `md` (registry/base-vega/ui/sidebar.tsx:572); com contagem e ⋯ no mesmo item, a contagem anda para a esquerda dele.
- Item com filhos abre no lugar, e não há tooltip. O menu de conta abre com `side="top"`.
- A gaveta fecha ao navegar (`CloseOnNavigate`).
- Área segura: o cabeçalho do cartão já soma `pt-[env(safe-area-inset-top)]`, que vale 0 sem `viewport-fit=cover`.
- O "Sidebar" e o "Displays the mobile sidebar." em inglês da gaveta e o `shadow-lg` do Sheet vêm do primitivo (registry/base-vega/ui/sidebar.tsx:200-203; registry/base-vega/ui/sheet.tsx:61): também só mudam com um `Patch`.
<!-- skill:end -->

Referências: Warp (Raphael Salaja), sidebar de 244 px com núcleo sem rótulo e seções Products e Company, e a página num frame `rounded-lg shadow-2` com `p-2` (https://www.warp.co/agent); Interfere (Jakub Krehel), seletor de workspace e Quick actions com Cmd K no topo, e a página num painel arredondado sobre canvas escuro (https://interfere.com/docs/product/inbox.md); Linear, núcleo curto, seções rotuladas e menu do workspace no canto (https://linear.app/changelog/2024-12-18-personalized-sidebar); Vercel Dashboard, sidebar com seletor de escopo e Find no topo desde 26/02/2026 (https://vercel.com/changelog/dashboard-navigation-redesign-rollout); Hick e Miller, poucas escolhas no primeiro nível e grupos de 5 a 9 (https://www.userinterface.wiki/laws-of-ux); Rauno Freiberg, seção por espaço e cabeçalho, nunca por caixa de borda (https://rauno.me/notes/4), e o gatilho que não sai de baixo do ponteiro (https://rauno.me/notes/5); Paco Coursey, o filho abre no próprio lugar (https://paco.me/craft/ios-menu). O trilho de ícones é adição do lume: nenhum produto de referência recolhe a navegação principal para ícones em 2025 e 2026 (Vercel e Linear escondem a sidebar inteira). Ele vem dos fronts da Lyx, que a pessoa já conhece (lei de Jakob, https://lawsofux.com/jakobs-law/); o Agente da Horizonte recolhe hoje para uma faixa de 52 px só com o botão de alternar e, no lume, ganha os ícones.

### Agente: a Lateral em trilho, com `fill` e `panel`

```text
+-canvas bg-sidebar------------------------------------------+
|[=] +-cartao, fill----------------------------+ +-panel----+|
|[#] | Agente / Carteira de outubro      [...] | | Seu      ||
|[+] |                                         | | portfolio||
|[o] |   mensagens: so esta area rola          | | Visao    ||
|[$] |                                         | | Alocacao ||
|    |   +---------------------------------+   | | empurra  ||
|    |   | Pergunte ao agente...       [^] |   | | o cartao ||
|(J) |   +---------------------------------+   | |          ||
|    +-----------------------------------------+ +----------+|
+------------------------------------------------------------+
Aberta: Fixadas, Pastas, Hoje, Ontem, Arquivadas. No trilho os itens sem icone somem.
```

Quando usar: a conversa é a página e a pessoa vive no app. O histórico mora na sidebar e some no trilho; o painel acompanha sem bloquear. O BI usa o mesmo trilho (`defaultOpen={false}`), sem `fill`.

```tsx
<AppShell
  pathname={pathname}
  brand={<MarcaHorizonte />}             // marca e nome como irmãos (fragmento)
  defaultOpen={aberto}                  // cookie lido no layout (Persistência do recolhido)
  fill={pathname.startsWith("/agente")}
  panel={<PainelPortfolio />}           // receita do guia 08
  tools={<SearchTrigger label="Buscar conversas" onOpen={abrirBusca} />}
  nav={[
    { items: [novaConversa, inicio /* external: "page" */, carteira] },
    { label: "Fixadas", items: fixadas },  // itens sem icon: somem no trilho
    { label: "Pastas", items: pastas },    // NavParentItem com children e menu
    { label: "Hoje", items: hoje },
    { label: "Ontem", items: ontem },
    { items: [arquivadas] },               // NavParentItem sem ícone, fechado
  ]}
  user={usuario}
  userMenu={itensDeConta}
>
  {children}
</AppShell>
```

- A conversa que está respondendo leva `badge: { status: "working", label: "Respondendo" }`, no item onde o resultado vai morar (Benji Taylor, https://benji.org/family-values).
- Pasta com ícone aparece no trilho com o menu ao lado; sem ícone, some. A escolha é do app.
- A página em `fill` (topo, lista em `ScrollFade` e composer no fluxo da coluna) e o painel seguem [08-assistente-de-ai](./08-assistente-de-ai.md). A largura do painel é do app (o Foggy usa 354 px, de 320 a 640; a Horizonte, 560 px, de 460 a 820), e o cartão nunca fica abaixo de 420 px. Abaixo de 768 px, o app monta um `Sheet side="right"` no lugar do painel.

Referências: Linear Agent, página própria, Cmd J e indicador de "trabalhando" por conversa (https://linear.app/docs/linear-agent.md); Warp, o Agent no núcleo da nav e o chat dentro do cartão (https://www.warp.co/agent); Vercel Agent, página própria e painel de 420 px que encolhe o conteúdo (https://vercel.com/blog/vercel-agent); o Foggy do Foglamp ([08-assistente-de-ai](./08-assistente-de-ai.md)); Raycast AI Chat, o histórico em Pinned, Recent e Archived (https://manual.raycast.com/ai/ai-chat.md).

### Barra de zonas: `layout="topbar"`

```text
+-canvas bg-sidebar: barra h-12 opaca, sem borda----------------------+
| # horizonte  Inicio  Mercado  Ativos v  Ferramentas  Agente  [B][J] |
| +-cartao bg-background, sombra, squircle--------------------------+ |
| | PageHeader                                                      | |
| | o scroll mora so no cartao                                      | |
| +-----------------------------------------------------------------+ |
+---------------------------------------------------------------------+
Mural de TV: a mesma barra so com marca, contexto e "Sair do modo TV", e fill.
Com panel: o painel e irmao do wrapper e tem a altura toda; a barra termina antes dele.
```

Quando usar: só quando a navegação principal cabe num nível de até 7 zonas (ou nenhuma) e o produto quer a largura toda. Zona com filhos abre um menu, nunca uma segunda barra. Se passar de 7 zonas ou pedir segundo nível, vira Lateral. Nunca é navegação principal de front da Lyx.

| Produto | Como monta |
|---|---|
| Horizonte Plataforma | Zonas em três seções separadas por espaço: Início; Mercado, Ativos e Ferramentas; Agente. Ativos é item com filhos: Ações, e FIIs, ETFs e Exterior com `disabled: "Em breve"` para visitante, cada filho com `hint` na descrição. Início e Agente levam `external: "page"`. `tools`: busca de ativo (a paleta é do app), "Minha carteira" em `Button variant="secondary"` (abre o `panel`) e alertas com contagem real. `banner`: a faixa do trial. Visitante: sem `user`, com "Entrar" e "Criar conta" em `tools` |
| Horizonte Início, Carteira e Conta | Os produtos entram como zonas `external: "page"`; o Início usa `fill` e monta as portas como conteúdo da página |
| Mural de TV do BI (Lyx) | `nav={[]}` e `fill`, sem `user`; `tools` com obra e período em `text-sm text-muted-foreground tabular-nums` e "Sair do modo TV" (`Button variant="ghost" size="sm"` com `IconX` e texto) |

<!-- skill:start -->
**Barra de zonas: camadas.**

| Camada | Classes |
|---|---|
| Canvas | o `CANVAS` da Lateral mais `md:bg-sidebar`: sem `Sidebar` no desktop, o `has-data-[variant=inset]:bg-sidebar` do primitivo (registry/base-vega/ui/sidebar.tsx:143) não acende |
| Wrapper | `flex min-h-0 min-w-0 flex-1 flex-col md:mx-2 md:mb-2` |
| Barra | `header data-slot="shell-bar"` em `@container/shell-bar hidden h-12 shrink-0 items-center gap-3 px-2 md:flex`: opaca, sem `border-b`, sem blur, fora do viewport de scroll e nunca `sticky` (o documento não rola, então nada precisa de `scroll-padding`). Ela só é montada fora do celular: escondida por CSS, o `SearchTrigger` dela registraria o Cmd+K de novo com a gaveta aberta. É o container `shell-bar` da barra estreita (linha Direita) |
| Marca ou `top` | `flex h-8 w-auto shrink-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0`, aberta em x = 16 (8 do wrapper mais 8 da barra), a coluna do `ShellTrigger` da Lateral; a marca não encolhe |
| Zonas | `nav aria-label="Principal" className="flex min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain no-scrollbar"`, com uma `SidebarMenu className="w-auto shrink-0 flex-row items-center gap-1"` por seção: o espaço separa, sem divisor. A zona não encolhe (o rótulo inteiro entra no min-content do item, com ou sem `truncate`), e o `shrink-0` da seção vence o `min-w-0` da `SidebarMenu`, que deixaria uma seção passar por cima da outra. O que não cabe rola dentro da nav, sem barra visível; o Tab traz a zona focada para a vista, e o `overscroll-x-contain` impede que o gesto vire o voltar do navegador |
| Zona | o mesmo `NavLink` da Lateral em modo barra (`w-auto`, sem tooltip, que só existe no trilho): pílula `rounded-md squircle:rounded-xl`, ativo com fundo e `aria-current`, ícone filled quando há ícone |
| Zona com filhos | `DropdownMenuTrigger render={<SidebarMenuButton className={cn(NAV_BUTTON, "w-auto")} isActive={filhoAtivo} />}` com `IconChevronDown className="size-3.5! text-muted-foreground/50"`; conteúdo `side="bottom" align="start" sideOffset={8} className="w-auto min-w-56 data-open:duration-0"`, com cada filho num `NavMenuItem` (`DropdownMenuItem render={<Link href />}` com rótulo e `hint`) e o filho desabilitado em `DropdownMenuItem disabled` com o selo. Abre no mousedown, o padrão do Base UI, nunca no hover |
| Direita | `ml-auto flex shrink-0 items-center gap-1`: `tools` e, depois, a conta, que é o `AccountMenu` compacto com `user` ou, sem `user`, os itens de `account` como links em `nav aria-label="Conta"`. Não encolhe, e nada passa por baixo dela |
| Barra estreita | abaixo de 64rem de barra (`@max-5xl/shell-bar`: o painel aberto, uma janela de tablet), o chip do `SearchTrigger` vira só a lupa, com o rótulo para o leitor de tela, e um tool do app pode se compactar com a mesma variante (na vitrine, "Minha carteira"). Medido na vitrine, em janelas de 768 a 1440: a barra de 5 zonas com chip, carteira, alertas e conta pede 1000 px; compacta, ela cabe sem painel a partir de 768 e com o painel de 320 px a partir de 1152, e abaixo disso, com o painel, as zonas rolam |
| Cartão, faixa, viewport e coluna | os mesmos da Lateral |

**Barra de zonas: celular.** Abaixo de `md` a barra some e o celular é o mesmo da Lateral: o cabeçalho `h-12` no cartão com `ShellTrigger`, marca e zona atual, e a gaveta (a `Sidebar` com `collapsible="offcanvas"`, que no `topbar` só existe no celular) com `tools`, as zonas como seções (zona com filhos abre no lugar) e a conta. Não há segunda linha de zonas nem barra inferior. No desktop, `Cmd/Ctrl+B` não faz nada.
<!-- skill:end -->

Referências: Vercel Dashboard 2026, barra de 56 px no canvas com escopo, breadcrumb e ações (HTML de https://vercel.com/vercel/admin-dash-template/agent, 23/10/2026); Warp, o cartão com `p-2` abaixo do chrome; Emil Kowalski (skill apple-design), o material mais escuro marca a região estrutural, por isso a barra é opaca no canvas, e o vidro quebraria o princípio do canvas mais escuro; Web Interface Guidelines, a zona é estado de URL e navegação é link (https://github.com/vercel-labs/web-interface-guidelines); Hick, um nível e poucas zonas. Contra, registrado: a Vercel trocou as abas horizontais por sidebar (https://vercel.com/changelog/new-dashboard-navigation-available, 22/01/2026), e nenhum dos 28 fronts da Lyx usa barra. É escolha do lume para a Horizonte.

## Nav e tile de ícone

No Foglamp, o item é `{ href, label, icon, activeIcon, iconClassName? }` (nav.ts:25-36), `navItem(href)` procura em `[...nav, ...account]` (nav.ts:115-117) e `/settings` só casa exato (app-shell.tsx:208-211). No lume, o modelo mora em `registry/base-vega/blocks/app-shell/nav.ts`, sem `"use client"`, para o layout do servidor importar os tipos, `SIDEBAR_COOKIE` e `readSidebarOpen`. Os renderizadores são os de `registry/base-vega/blocks/app-shell/nav-list.tsx`, os únicos do shell: `NavSections` (sidebar, trilho e gaveta, um `SidebarGroup` por seção dentro de `nav aria-label="Principal"`), `NavZones` (barra), `NavLink`, `NavParent` e `NavMenuItem` (o link dentro de menu).

<!-- skill:start -->
```ts
type NavBadge =
  | { count: number; label: string }                // "3 não lidas"; some com 0; "99+" acima de 99
  | { status: "working" | "unread"; label: string } // ponto; working em amber (agente)
  | { text: string };                               // selo: "Em breve", "fase 2"

type NavBase = {
  label: string;
  icon?: Icon;            // outline, inativo; item sem ícone (conversa, favorito) não aparece no trilho
  activeIcon?: Icon;      // filled, ativo; sem ele, o glifo de icon fica nos dois estados
  iconClassName?: string; // navTile(cor), ou "text-muted-foreground/70" em item de conta
  badge?: NavBadge;
  menu?: React.ReactNode; // DropdownMenuItem do botão ⋯: atalho de uma ação que também existe na página
};

type NavLinkItem = NavBase & {
  href: string;              // rota como string, nunca o tipo Route
  exact?: boolean;           // quando um href é prefixo de outro ("/configuracoes" e "/configuracoes/equipe")
  external?: "tab" | "page"; // nova aba com seta, ou navegação inteira até outra zona do domínio; nunca ativo
  disabled?: string;         // motivo visível ("Em breve"): sem link, sem tooltip, fora do trilho, nunca ativo
  hint?: string;             // linha de apoio quando o item aparece num menu
  children?: never;
};
type NavParentItem = NavBase & { children: NavLinkItem[]; defaultOpen?: boolean; href?: never };
type NavItem = NavLinkItem | NavParentItem;
type NavSection = { label?: string; items: NavItem[] }; // sem rótulo no núcleo; o rótulo some no trilho
type Nav = NavItem[] | NavSection[];                     // lista plana (o contrato da v0.2.0) ou seções
```

Funções de `nav.ts`: `toSections(nav)` (a lista plana vira uma seção sem rótulo; o primeiro elemento decide a forma, porque seção tem `items` e item nunca tem); `flattenNav(nav)` (todos os links, filhos inclusive, na ordem da tela); `findActive(nav, pathname)` (o link da página atual e o pai, quando ele é filho; externo e desabilitado nunca; se mais de um casa, vence o href mais longo e, no empate, o primeiro da tela); `isActive(pathname, href, exact?)` (igualdade ou prefixo de segmento, e `/` só exata); `navItem(nav, href)` (para o `back` do `PageHeader`, aceita seções e procura nos filhos); `navTile(cor)`; `SIDEBAR_COOKIE` e `readSidebarOpen` (seção Persistência do recolhido). A seção vazia continua na lista, para a key por índice não mudar quando o filtro por papel a esvazia, e quem renderiza a pula.

| Caso | Como fica |
|---|---|
| Item | `SidebarMenuButton isActive tooltip={label} render={<Link href={href} aria-current="page" />}` com `NAV_BUTTON`; rótulo em `min-w-0 flex-1 truncate`, `NavIcon` com `shrink-0`. O tooltip só aparece no trilho (registry/base-vega/ui/sidebar.tsx:549), e o tooltip do trilho mostra o rótulo e o texto do badge |
| Sem área morta | a `SidebarMenu` vai com `gap-0` e o botão com `relative h-9 border-y-2 border-transparent bg-clip-padding focus-visible:ring-inset group-has-data-[sidebar=menu-badge]/menu-item:pr-8 group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:p-1.75! in-data-[mobile=true]:h-12` (`NAV_BUTTON`): os 2 px de borda transparente em cima e embaixo ficam fora do fundo e dentro do alvo, com passo de 36 px e pílula de 32 (32 por 36 no trilho), 44 px na gaveta, e o anel de foco entra para contornar a pílula. Um `after` com inset negativo não serve, porque o `overflow-hidden` do botão o corta. Um tool do app usa a mesma classe |
| Contagem | `SidebarMenuBadge className="rounded-full"` com `aria-hidden`, `99+` acima de 99 e o `label` em `sr-only` dentro do botão; com zero, não renderiza. Quando o item tem `menu`, a contagem some no hover e no foco para o ⋯ aparecer; na gaveta, onde o ⋯ fica sempre visível, ela anda para a esquerda dele |
| Status | ponto `ml-auto size-1.5 shrink-0 rounded-full` com o `label` em `sr-only`: `bg-amber-500 motion-safe:animate-pulse` em `working` (amber é agente) e `bg-sidebar-foreground/70` em `unread` |
| Selo | `ml-auto shrink-0 text-xs text-muted-foreground/70` |
| No trilho | contagem, status e selo viram um ponto `absolute top-1.5 right-1.5 hidden size-1.5 rounded-full group-data-[collapsible=icon]:block` dentro do botão, e o texto vai para o tooltip ("Inbox, 3 não lidas") |
| Externo | `"tab"`: `<a href target="_blank" rel="noreferrer">` com `IconArrowUpRight className="ml-auto size-3.5! text-muted-foreground/50!"` e "(abre em nova aba)" em `sr-only`. `"page"`: `<a href>` puro, com navegação inteira e sem seta, porque o `link-next` trataria o caminho como rota do app. Nunca fica ativo |
| Desabilitado | `render={<span aria-disabled="true" />}`, o motivo como selo e sem tooltip (FRONTEND.md, Botões); o `li` some no trilho |
| Menu ⋯ | `DropdownMenuTrigger render={<SidebarMenuAction showOnHover aria-label="Mais ações: rótulo" />}` com `IconDotsFilled`; conteúdo `side="right" align="start" sideOffset={8} className="w-auto min-w-48 data-open:duration-0"` (abaixo, na barra) com os itens de `menu`. A mesma ação existe na página |

**Item com filhos**, um nível só:

- Na sidebar aberta e na gaveta, é um `Collapsible` dentro do `SidebarMenuItem`. Gatilho `CollapsibleTrigger render={<SidebarMenuButton isActive={filhoAtivo && !aberto} />}` com `NavIcon`, rótulo e `IconChevronRight className="ml-auto size-3.5! text-muted-foreground/50 transition-transform duration-150 group-data-[panel-open]/menu-button:rotate-90"`; painel `CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none group-data-[collapsible=icon]:hidden"` (o Base UI mede a altura); lista `SidebarMenuSub className="mx-0 gap-0 border-l-0 px-0 py-0"`.
- O filho é `SidebarMenuSubButton isActive render={<Link href={href} aria-current="page" />}` com `h-9 border-y-2 border-transparent bg-clip-padding pl-8.5 rounded-md squircle:rounded-xl corner-squircle hover:bg-sidebar-accent/70 active:bg-sidebar-accent/70 data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50 focus-visible:ring-inset group-has-data-[sidebar=menu-action]/menu-sub-item:pr-8 in-data-[mobile=true]:h-12`: com 8 px de padding, 18 de ícone e 8 de gap, o texto do filho cai na coluna do rótulo do pai.
- Abre sozinho quando um filho fica ativo (um efeito no `pathname`), e a pessoa pode fechar; `defaultOpen` vale na montagem. Fechado com um filho ativo, o pai acende.
- No trilho, o mesmo `li` mostra outro gatilho: `DropdownMenuTrigger render={<SidebarMenuButton isActive={filhoAtivo} aria-label={label} />}`, sem tooltip (tooltip e menu no mesmo gatilho ficam de fora), com conteúdo `side="right" align="start" sideOffset={8} className="w-auto min-w-48 data-open:duration-0"`: o `DropdownMenuLabel` do pai e um `NavMenuItem` por filho, com o `hint` em `text-xs text-muted-foreground`. Os dois gatilhos ficam montados e o CSS mostra um, então recolher e expandir não perde o aberto. Pai sem ícone some do trilho.
- Na barra, a zona com filhos é um menu abaixo (seção Formatos, Barra de zonas).

Gotcha: todo svg dentro do `SidebarMenuButton` sai com 18 px, porque o `[&_svg]:size-4.5` do primitivo (registry/base-vega/ui/sidebar.tsx:480) vence o `size-3.5` do próprio ícone por especificidade. Para outro tamanho, use `size-3.5!`, como no chevron do item com filhos, na seta do externo e no chevron do menu de conta. Do mesmo jeito, a cor de um svg dentro do `SidebarMenuSubButton` leva `!`, porque o sub-botão pinta todo svg filho direto (registry/base-vega/ui/sidebar.tsx:685).
<!-- skill:end -->

`NavIcon` (`registry/base-vega/blocks/app-shell/nav-icon.tsx`; no Foglamp, app-shell.tsx:213-255) empilha outline e filled na mesma célula de grid: wrapper `grid size-4.5 shrink-0 place-items-center [&_svg]:size-full!` + o tile via `className`; cada SVG `[grid-area:1/1] transition-opacity duration-100 ease-in-out` com `opacity-0`/`opacity-100`. O `!` vence o `[&_svg]:size-4.5` que o `SidebarMenuButton` força; o tile fica no wrapper para não apagar e acender na troca. Sem `activeIcon`, ou com o mesmo componente nos dois campos, fica um glifo só; sem `icon`, nada é renderizado nem reservado, e o rótulo começa no padding do botão.

<!-- skill:start -->
Receita do tile (nav.ts:38-45; no lume `navTile(color)` dentro de `app-shell`): `bg-{cor}-100 dark:bg-{cor}-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-{cor}-500 shadow-[inset_0_0_0_1px_rgba(R,G,B,0.14),0_2px_6px_-2px_rgba(R,G,B,0.25)] dark:shadow-(--custom-shadow)`: anel interno de 1px a 14% da cor mais sombra curta a 25% no light; no dark só a sombra neutra. Cores usadas: rose `244,63,94`, emerald `16,185,129`, orange `249,115,22`, sky `14,165,233`, fuchsia `217,70,239`, yellow `234,179,8`. Itens de conta sem tile: `text-muted-foreground/70`. A mesma receita tinge `span-type` e os chips de score (ver [04-dados](./04-dados.md)).
<!-- skill:end -->

## Peças do shell

`registry/base-vega/blocks/app-shell/shell-parts.tsx` traz o que o shell usa e o app pode reusar dentro dele.

<!-- skill:start -->
| Peça | Contrato | Classes e comportamento |
|---|---|---|
| `ShellTrigger({ className? })` | abre e fecha a sidebar: recolhe e expande no desktop, abre e fecha a gaveta no celular | `Button variant="ghost" size="icon-sm"` com `aria-expanded:bg-transparent aria-expanded:hover:bg-muted`, porque o ghost pintaria o estado da sidebar como popup aberto; rótulo "Recolher barra lateral" e "Expandir barra lateral" no desktop, "Fechar menu" e "Abrir menu" no celular; `aria-expanded` e `aria-keyshortcuts="Meta+B Control+B"`; `IconLayoutSidebarLeftCollapseFilled` aberta e `IconLayoutSidebarLeftExpandFilled` fechada; `relative after:absolute after:-inset-1.5 md:after:hidden`, 44 px de alvo no celular sem mudar o desenho de 32; `data-shell-trigger`, por onde o `AppShell` acha o gatilho à vista para devolver o foco. No lugar do `SidebarTrigger` do primitivo, que diz "Toggle Sidebar" |
| `ContextSwitcher({ label, value, options, onSelect?, footer? })` | troca de contexto no `top` (sistema, obra, setor, praça, conta), só quando há mais de um; `ContextOption = { id, label, href?, external?, icon?, detail? }` | gatilho na geometria do ProjectSwitcher do Foglamp, `SidebarMenuButton aria-label="Sistema: Jurídico"` com `w-auto min-w-0 gap-2 pr-2 pl-1.75 in-data-[slot=sidebar]:flex-1 max-md:h-11 [&_svg]:size-3.5 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.75!` (o `max-md:h-11` dá 44 px de alvo na gaveta e no cabeçalho do cartão), ícone, rótulo `min-w-0 flex-1 truncate` e chevron `ml-auto opacity-15`; no trilho sobra o ícone, e opção sem ícone deixa o seletor de fora. Conteúdo `align="start" sideOffset={8} className="w-auto min-w-56 data-open:duration-0"`, ao lado (`side="right"`) dentro da sidebar do desktop e abaixo na barra, na gaveta e no cabeçalho do cartão: `DropdownMenuLabel` com o `label`, uma opção por contexto em `DropdownMenuItem render={<Link href />}` (`<a>` quando `external`), `detail` em `ml-auto text-xs text-muted-foreground tabular-nums`, `IconCheck` na atual e o `footer` depois de um separador. Trocar de contexto é link: a URL guarda o contexto e Cmd+clique abre outra aba |
| `SearchTrigger({ onOpen, label?, shortcut? })` | abre a paleta do app pelo clique e por Cmd/Ctrl mais a tecla (`"k"` por padrão; `null` desliga; um por tela) | na sidebar e na gaveta, `SidebarMenuItem` com `SidebarMenuButton tooltip={label}` e `NAV_BUTTON`, `IconSearch`, rótulo e `Kbd className="ml-auto pointer-coarse:hidden @max-5xl/shell-bar:hidden"`; na barra, `Button variant="outline"` com `w-56 justify-start gap-2 bg-card font-normal text-muted-foreground transition-[color,box-shadow] hover:bg-muted/50 active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`, a superfície de chip, que na barra estreita ganha `@max-5xl/shell-bar:w-8 @max-5xl/shell-bar:justify-center @max-5xl/shell-bar:p-0!`, com o rótulo em `@max-5xl/shell-bar:sr-only` e sem o Kbd. Abaixo de 768 px o atalho vale com a gaveta fechada (a cópia escondida dos `tools`, seção Lateral: celular). O Kbd mostra ⌘K no Mac e Ctrl K no resto, decidido depois do mount; `aria-keyshortcuts="Meta+K Control+K"`. A paleta é do app, sobre o item `command`, com `title` e `description` em pt-BR (o padrão é "Command Palette") e `className="data-open:duration-0"` |
| `useShortcut(key, onPress, { mod?, enabled? })` | atalho com listener no `ownerDocument` do shell, na bolha | com `mod` (Cmd ou Ctrl, sem Alt e sem Shift), ignora `contenteditable` e vale em `input` e `textarea`; sem `mod`, é a tecla sozinha, fora de qualquer campo; evento já tratado (`defaultPrevented`), em composição de IME ou sem `key` (o autofill do Chrome) passa; o que casa leva `preventDefault` |
| `isEditableTarget(target, { richTextOnly? })` | `INPUT`, `TEXTAREA`, `SELECT` ou `contenteditable`; com `richTextOnly`, só `contenteditable` | testa pela forma, sem `instanceof`, porque o alvo pode vir de outra janela |
| `useShellLayout()` | `"sidebar"` ou `"topbar"` (`"sidebar"` fora do shell) | um tool do app lê isto e `useSidebar().isMobile` para saber se está na barra ou na gaveta, como o `SearchTrigger` |
| Menu de conta (interno ao `app-shell.tsx`) | `user` e `userMenu` | na sidebar e na gaveta, `SidebarMenuButton aria-label="Conta: nome"` com `NAV_BUTTON` e `pr-1.5`, `Avatar size="xs"` (18 px, cabe no trilho), o nome e o chevron `ml-auto size-3.5! opacity-15`, abrindo `side="right"` (`"top"` no celular) e `align="end"` em `min-w-(--anchor-width) w-fit`. Na barra, compacto: `Button variant="ghost" size="icon-sm"` com `Avatar size="sm"` e o mesmo `aria-label`, abrindo `side="bottom" align="end" sideOffset={8}` em `w-auto min-w-56`. Dentro: a identidade (avatar, nome, `detail` e email), um separador, os itens de `account` no compacto, o `ThemeSubmenu` e o `userMenu`. Os avatares levam `alt=""`, porque o nome já está no rótulo |
<!-- skill:end -->

## Persistência do recolhido

O primitivo grava o cookie `sidebar_state` a cada troca (registry/base-vega/ui/sidebar.tsx:87-88) e nunca o lê. O `app-shell` também não lê: o app lê e passa `defaultOpen`, porque só ele sabe se pode ler no servidor.

<!-- skill:start -->
```tsx
// Next: no layout do grupo que já lê a sessão (rota dinâmica). cookies vem de next/headers;
// readSidebarOpen e SIDEBAR_COOKIE, de components/app-shell/nav. Com cacheComponents, cookies()
// (e o usePathname do Shell, em rota com param dinâmico) fica dentro de Suspense: o layout
// devolve <Suspense><ShellComEstado>{children}</ShellComEstado></Suspense>.
async function ShellComEstado({ children }: { children: React.ReactNode }) {
  const aberto = readSidebarOpen((await cookies()).get(SIDEBAR_COOKIE)?.value, true);
  return <Shell defaultOpen={aberto}>{children}</Shell>; // o wrapper client que monta o AppShell
}
```

```tsx
// Vite: sem SSR, o estado inicial sai do document.cookie antes da primeira pintura
// (useState de react; readSidebarOpen e SIDEBAR_COOKIE de components/app-shell/nav).
function lerCookie(nome: string) {
  return document.cookie.split("; ").find((par) => par.startsWith(`${nome}=`))?.slice(nome.length + 1);
}

// dentro do componente que monta o AppShell:
const [aberto] = useState(() => readSidebarOpen(lerCookie(SIDEBAR_COOKIE), true));
// <AppShell defaultOpen={aberto} ... />
```

O layout do Next inteiro, com os imports e a sessão, está no passo 5 de `docs/adocao/next-novo.md`.

- `readSidebarOpen` aceita os dois valores que o primitivo grava, `"true"` e `"false"`; ausente ou qualquer outro valor cai no fallback, aberto por padrão. A primeira visita abre a sidebar.
- O cookie vale por host: cada subdomínio da Lyx guarda o seu estado, e as zonas da Horizonte no mesmo domínio dividem um só.
- Com Cache Components, ler `cookies()` tira o layout do prerender: um app de shell estático, sem sessão no layout, fica sem o recolhido sem piscar.
- Com `open` controlado, o primitivo grava o cookie com o valor pedido mesmo quando o app recusa a troca (registry/base-vega/ui/sidebar.tsx:78-89). Medido na bancada: `onOpenChange` recebe `true`, a sidebar continua recolhida e o cookie fica `true`. Num modo controlado, como a tela cheia do BI, não confie no cookie.
- O `layout="topbar"` não lê nem grava: `defaultOpen` e `open` não existem nele, e no desktop o atalho não alterna.
<!-- skill:end -->

## Providers

| Provider | Item do lume | Regra praticada |
|---|---|---|
| `ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange` | `theme-provider` (registry/base-vega/components/theme-provider.tsx) ou `theme-provider-csp` | Dark por padrão (providers.tsx:15); o FRONTEND.md original dizia `system` |
| `HeaderActionsSlotProvider` | `header-slot` | Guarda `{ el, setEl }`: o `PageHeader` registra a div de ações e a `Toolbar` portala os controles para lá quando não cabem (header-slot.tsx:13-41). O `AppShell` já monta um; um de fora fica redundante, porque o de dentro vence |
| `LayoutReserveProvider` | `header-slot` | A largura que um painel vai ocupar, publicada com `useReportLayoutReserve` antes de animar e lida pela `Toolbar` em `usePendingShrink` (registry/base-vega/components/header-slot.tsx:63-92). Montado pelo `AppShell`, e o painel do slot `panel` fica dentro dele |
| `RangeProvider` | `range-picker` (`range-context`) | `localStorage` com `storageKey` configurável no formato `{ key, from, to }`; default `24h`; presets re-resolvidos para "agora" no load, `custom` restaura datas exatas (range-context.tsx:19-56) |
| `QueryClientProvider` + um único `<Toaster />` | `sonner` | `QueryCache.onError` dispara `toast.error(error.message, { action: { label: "retry", onClick: query.invalidate } })` (utils/trpc.ts:20-31, não em providers.tsx) |

Contextos usam `<Ctx value={...}>` e `use(Ctx)` (React 19). `ProjectProvider`, `PostHogProvider`, `DevBar` e HUD ficam fora do lume. O `AppShell` monta, de fora para dentro, `HeaderActionsSlotProvider`, `LayoutReserveProvider` e o contexto do layout (`useShellLayout`); `ThemeProvider`, `RangeProvider` e `QueryClientProvider` ficam acima dele, no app.

## Header de rota: o trio do Next

Cada rota de lista é um trio: `header.tsx` (um `RouteHeader` configurado), `loading.tsx` (só o header) e `page.tsx` (`Suspense fallback={<XHeader />}` quando o client lê `useSearchParams`, senão o client direto). O header é renderizado "por AMBOS o loading.tsx e o client" para a troca fallback para página ser pixel-idêntica (route-header.tsx:21-26). `RouteHeader({ href, title, back?, noIcon?, withRange?, actions? })` resolve `navItem(href)`; `withRange` prepende `LiveRangePicker`, vivo durante o suspense porque o contexto está acima do boundary (route-header.tsx:10-19). Fica fora da v0.1 como item (`nextOnly`): copie route-header.tsx. Detalhes não têm header.tsx: o `loading.tsx` chama `RouteHeader href="/traces" back title="Trace"` direto, porque o título real é parâmetro de rota.

<!-- skill:start -->
`page-header` (page-parts.tsx:58-133):

| Parte | Classes exatas |
|---|---|
| Raiz | `flex flex-wrap items-end justify-between gap-4 px-8 h-8` (`h-8` porque o `RangePicker` é `h-8`; com `h-7` empurrava o conteúdo ~4px) |
| `h1` normal / com `back` | `flex items-center gap-2 text-base font-medium tracking-tight` / `gap-1.5` no lugar de `gap-2` |
| Ícone de seção | `size-4.5 shrink-0` + `iconClassName` (o tile do nav); 18px, um degrau acima do `size-4` do FRONTEND.md original |
| Link do crumb | `flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground`; separador `IconChevronRight` `size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]` |
| Título / descrição | `<span className="truncate">` / `<p className="text-sm text-muted-foreground">` |
| Slot de ações | `flex items-center gap-2 translate-y-1 empty:hidden`, sempre renderizado, `ref={slot?.setEl}` |

Ações fora do range picker: `Button variant="secondary"` com ícone e `strokeWidth={2.4}` ("Create key"); em listas com criação o botão vai para o `trailing` da `Toolbar` e só sobe ao header quando ela levanta. O `page-header` do lume exporta `PX = "px-4 md:px-8"` e recebe `back` pelo `link` (adição do lume). `back.icon` é opcional, como no `Nav`: `back={navItem(nav, href)}` serve com item sem ícone, e o crumb sai só com o rótulo (`Rótulo › Título`); a prop `icon` da página continua ignorada quando há `back`. O slot de ações funciona dentro do `AppShell` sem provider extra, porque o shell monta o `HeaderActionsSlotProvider`.
<!-- skill:end -->

## page-parts: a gramática das páginas

| Bloco | Item | Valores exatos |
|---|---|---|
| `StatCard` | `stat-card` | `Card size={size}` (+ `h-full cursor-pointer` com `href`, link externo `group/stat block min-w-0`); `CardHeader className="gap-1.5"` > `flex items-center justify-between gap-2`; esquerda `flex min-w-0 items-center gap-1.75` com ícone `size-3.5 shrink-0 text-muted-foreground` e label `truncate text-sm text-foreground` (span, não `CardDescription`); direita `flex shrink-0 items-center gap-1.5` com `DeltaBadge` + `CardTitle className="tracking-tight tabular-nums"`; chevron `mt-px size-3.5 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 group-hover/stat:translate-x-0 group-hover/stat:opacity-100`; slot do chart `mt-auto pt-1.5 -mb-6 group-data-[size=sm]/card:-mb-5`; ordem canônica Volume, Health, Performance, Cost (page-parts.tsx:183-325) |
| `DeltaBadge` | dentro de `stat-card` | `inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px`, bom `text-emerald-600 dark:text-emerald-500`, ruim `text-red-500 dark:text-red-500` (`deltaInverted` para custo, erro, latência); seta `IconArrowUpRight`/`IconArrowDownRight` `size-3.75 stroke-[1.6]`; flat `~0%` em `text-xs font-medium tabular-nums text-muted-foreground mt-px` (page-parts.tsx:327-352) |
| `CardSparkline` | `card-sparkline` | SVG `viewBox 0 0 100 32`, `block h-8 w-full overflow-visible`, `PAD = 3`, gradiente `currentColor` 0.4 a 0.1, linha `strokeWidth 1.2` `strokeOpacity 0.5`; `dashedLast` vira `strokeDasharray="2.5 2"`; abaixo de 2 pontos cai no placeholder (curva fixa, traço 0.1) |
| `PillMeter` | `pill-meter` | wrapper `px-6 pt-1.5 pb-5 group-data-[size=sm]/card:px-5`; linha `flex h-3.5 items-stretch gap-0.75`; 32 cápsulas `flex-1 rounded-full` em `bg-current` ou `bg-muted-foreground/10`; fração positiva acende ao menos 1 (page-parts.tsx:501-533) |
| `ScrollFade` | `scroll-fade` | viewport `overflow-y-auto no-scrollbar`; fades `pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b to-transparent transition-opacity duration-150` (+ `from-card`, ou `from-popover` em dialog) e `bottom-0 bg-linear-to-t` a `opacity-75` (page-parts.tsx:542-604) |
| `EmptyState` | `empty-state` | `Empty className="border border-dashed"` + `EmptyMedia variant="icon"` com ícone `opacity-40`; bases em registry/base-vega/ui/empty.tsx:12,36,65,78 (page-parts.tsx:687-716) |
| `TableRowsSkeleton` | `table-skeletons` | uma `TableRow` por linha, célula `rowHeight` (`h-12`, `h-16` para duas linhas), blobs `h-4 {w}`, ícone `size-4 shrink-0 rounded-md`, `sub` reproduz a linha meta (`h-5` + `gap-1` + `mt-0.5` + `h-4`); exige `table-fixed` (page-parts.tsx:738-788) |
| `StatGrid` | `stat-grid` (adição do lume) | `section` `@container px-4 md:px-8` > `grid gap-4` com `@lg:grid-cols-2 @min-[62rem]:grid-cols-4` (ou `@2xl:grid-cols-3`); cada `StatCard` em `row-span-3 grid grid-cols-1 grid-rows-subgrid gap-y-1.5` para rótulo, número e rodapé alinharem entre vizinhos (lyx-pr-agent/painel/src/app/partes.tsx:88-130) |

## Range picker (`range-picker`)

Presets (range.ts:26-75; no lume os labels vêm em pt-BR com `date-fns/locale/ptBR`): `1h`, `24h` (default e fallback de key desconhecida), `3d`, `7d`, `30d`, `90d`, `today`, `month`, `lastMonth`. `QUICK_PRESETS = ["24h", "3d", "7d"]` viram chips ao lado do picker; com um chip ativo o picker colapsa para o ícone (`compact`), "o rótulo só repetiria o chip".

<!-- skill:start -->
| Peça | Classes exatas (range-picker.tsx) |
|---|---|
| `RangePresetButton` | `Button variant={active ? "secondary" : "outline"} aria-pressed` + `font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50` (:37-65) |
| Trigger | `Button variant={compact ? "outline" : "secondary"}` + `w-fit justify-start transition-[color,box-shadow] bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted active:scale-100 font-normal gap-1.5`; `IconCalendarFilled` `ml-0.5 mb-px` em `text-foreground/95` ou `text-muted-foreground/50`; rótulo `grid overflow-hidden transition-[width,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` com `width` em px medido por `ResizeObserver` (`-ml-1.5` compacto); chevron `ml-auto size-3.5 text-muted-foreground/50 mt-px` (:145-176) |
| Popover | `PopoverContent align="end" sideOffset={10} className="flex-row w-auto gap-0 overflow-hidden p-0"`; coluna de presets `flex w-40 flex-col gap-1 p-3` com hairline `border-r-[0.5px] border-solid` (hex `#EFEFEF`/`#252525` no Foglamp; `border-border/50` no lume); cada preset `Button size="sm"` `secondary` ou `ghost` + `justify-start font-normal transition-transform rounded-sm squircle:rounded-xl corner-squircle active:scale-100` (raio concêntrico: 8px do popover menos 12px de padding) (:178-200) |
| Calendário | `p-1 pl-2 pt-2` > `Calendar mode="range" numberOfMonths={2} disabled={{ after: new Date() }} className="**:data-day:transition-none"`; dois cliques: o primeiro sempre começa um range novo, o segundo aplica `customRange` e fecha (:202-225) |
<!-- skill:end -->

`transition-[color,box-shadow]` tira `background-color` do `transition-all` do Button: o hover estala na hora, de propósito; `active:scale-100` cancela o `active:scale-[0.97]`. A largura do rótulo é tweenada em px porque o trigger fecha um grupo alinhado à direita e `width` não anima a partir de `auto`.

## Toolbar e filtros (`data-table`)

<!-- skill:start -->
| Controle | Classes exatas e comportamento (data-table.tsx) |
|---|---|
| `Toolbar({ children, trailing?, className? })` | `flex flex-wrap items-center gap-2 pl-6 pr-6`; `trailing` em `motion.div` `ml-auto flex items-center gap-2` com `layoutId` e `transition={{ type: "spring", stiffness: 520, damping: 44 }}` (`TOOLBAR_SPRING` em `motion`); mede filhos + gaps contra a largura disponível e, se `need + 2 > avail`, portala o trailing para o slot do `PageHeader` (:285-381) |
| `SearchInput` | `InputGroup` em `h-8 w-56 rounded-full squircle:rounded-full corner-round! shadow-(--custom-outline-shadow) dark:shadow-(--custom-outline-shadow) dark:border-0 bg-card dark:bg-card hover:bg-muted/50 dark:hover:bg-muted`; `IconSearch size-3.5`; limpar `InputGroupButton size="icon-xs"` `rounded-full text-muted-foreground/60 hover:text-foreground` (:404-452). `corner-round!` porque a superelipse achataria a pílula; `dark:bg-card` porque a base do `InputGroup` tem `dark:bg-input/30` |
| `ToggleChip` | `Button variant={active ? "destructive" : "outline"} aria-pressed` + `font-normal transition-[color,box-shadow] active:scale-100`; inativo `text-muted-foreground/50 hover:text-muted-foreground/50 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted [&_svg:not([class*='text-'])]:text-muted-foreground/50` (:456-484) |
| `FilterSelect` | trigger `SelectTrigger size="sm"` com `buttonVariants({ variant: "outline" })` + `min-w-36 justify-between font-normal corner-round! bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)`; conteúdo `w-auto min-w-44 max-w-80` `align="start" sideOffset={8}`; busca inline acima de `FILTER_SEARCH_THRESHOLD = 8` opções; `modal={false}` e hover troca o dropdown aberto (:486-697) |
| `ClearFiltersButton` | `AnimatePresence`, `initial={{ opacity: 0, scale: 0.98, x: -4 }}`, `transition={{ duration: 0.13, ease: "easeOut" }}`; `Button variant="outline"` `text-muted-foreground gap-1 bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted` com `IconX` (:703-731) |
| `PaginationFooter` | `flex items-center justify-end gap-1 border-t border-border/50 px-6 pt-4 dark:border-border/40`; contagem `text-xs text-muted-foreground/50 tabular-nums`; barra `text-xs text-muted-foreground/20 mx-3`; "1 to 25" é um `SelectTrigger` despido (`h-auto data-[size=default]:h-auto gap-1.5 rounded-md squircle:rounded-md border-0 bg-transparent p-0 text-xs text-muted-foreground/50 tabular-nums shadow-none transition-[color,box-shadow] hover:text-foreground dark:border-0 dark:bg-transparent dark:shadow-none dark:hover:bg-transparent`) com `pageSizes = [25, 50, 100]`; chevrons `Button size="icon-sm"` `outline` ativo, `ghost` desabilitado; sem números de página; só renderiza com linhas (:737-820) |
<!-- skill:end -->

Ícones dos triggers: o Foglamp usa `text-[#B8B8B8] dark:text-[#5B5B5B]` ("opacidade em ícone lê mais suja que em texto"); o lume troca por `text-muted-foreground/50`. `useUrlFilters(defaults)` guarda filtro, busca, ordenação e página na URL, apaga chaves no default e remove `page` em todo patch que não a define (:66-116); no lume roda sobre `window.location` + `history.replaceState` + `useSyncExternalStore`, sem `next/navigation`.

## Ritmo vertical e gutters

<!-- skill:start -->
| Onde | Valor |
|---|---|
| Coluna da página | `gap-4` entre blocos de primeiro nível, `py-6` em cima, `pb-16` embaixo, `px-0` |
| Header, grids de cards e empty states | `px-8` (32px): alinhamento "de texto" |
| Toolbar e footer de paginação | `pl-6 pr-6` / `px-6` (24px): alinhamento "de controle", que por ter superfície própria parece 32px |
| Células da tabela | `px-8.25` (33px) para o texto cair na coluna do título, última coluna `pr-9`, header `h-13`, célula `py-2` (registry/base-vega/ui/table.tsx:82,100,193,214) |
| Header para Toolbar | bloco `flex flex-col gap-4 mt-1` (20px até a Toolbar); Toolbar para tabela `flex flex-col -mt-2` (8px, para o footer encostar na última linha) |
| Empty state de lista / grids | `mt-2 px-8`; `grid gap-4 md:grid-cols-2 xl:grid-cols-4 px-8 mt-1` (stats), `grid gap-4 lg:grid-cols-2 px-8` (charts) |
| Cards | `py-6`, `size="sm"` `py-5` e `gap-2`; header e conteúdo `px-6`, `sm` `px-5` (registry/base-vega/ui/card.tsx:17,30,78) |
<!-- skill:end -->

## Loading e erro

<!-- skill:start -->
- `useDelayedLoading(loading, 700)` (`use-delayed-loading`): skeleton só após 700 ms contínuos; antes disso renderize `null`, nunca o empty state (hooks.ts:13-24). Só o `TableBody` espera; toolbar e cabeçalhos pintam na hora, mesmo com resultado vazio ("um range vazio precisa do range picker para escapar").
- `useEntranceOnce()` (`use-entrance-once`): flag de módulo; só a primeira página após hard load ganha `.page-fade-in { animation: page-fade-in 75ms ease-out }`, só opacidade, `none` em `prefers-reduced-motion` (index.css:66-81). O `PageHeader` fica num `div` próprio com `cn(entrance && "page-fade-in")`, fora do header que o loading.tsx repete.
- `useSkeletonShown(showing)`: latch; quem pinta primeiro ganha o fade, a troca skeleton para dado é instantânea (`entrance && !skeletonShown && "page-fade-in"`).
- `useQuery` com `placeholderData: (prev) => prev` em toda lista: a página atual fica visível enquanto a próxima carrega; mudar range não regride para skeleton.
- Erro de dados é toast com retry (`QueryCache.onError`); "não existe" é `EmptyState` tracejado ("Trace not found", "No turns in this session"); nenhum client lê `isError`. O Foglamp não tem `error.tsx`; o lume adiciona um `error.tsx` mínimo com `EmptyState` + `Button variant="outline"` "Tentar de novo" (adição do lume).
<!-- skill:end -->

## Navegação entre linhas e teclado

`rowNav(router, href)` devolve `{ onClick: router.push, onMouseEnter: router.prefetch, onFocus: router.prefetch }`: uma linha não é `<Link>` e sem prefetch o clique pagava o round trip inteiro (row-nav.ts:6-18; no Vite o prefetch é no-op). `TableRow interactive` tem `tabIndex 0`, Enter e Espaço disparam `click()`, e no hover apaga a própria `border-b` e a da linha anterior (`data-interactive:hover:border-transparent has-[+tr[data-interactive]:not([aria-expanded=true]):hover]:border-transparent`, registry/base-vega/ui/table.tsx:169-176) para o destaque ler como bloco. Links dentro da linha chamam `e.stopPropagation()`. Tooltips das células ficam sob `<TooltipProvider delay={150}>` em volta da tabela.

## Página canônica: lista de cima a baixo

1. `header.tsx` + `loading.tsx` + `page.tsx` com `Suspense fallback={<Header />}`.
2. Client: `useEntranceOnce()`, `useRange()`, `useUrlFilters({ agent, model, errors, sort, page: "1", size: "25" })`; um `useEffect` em `[range]` reseta `page` pulando o mount, para não apagar a página de uma URL compartilhada.
3. `<div className={cn("flex flex-col gap-4 mt-1", entrance && "page-fade-in")}>` com `Toolbar trailing={<RangeControl value={range} onChange={setRange} />}`: `FilterSelect` (opções com ícone `size-4 shrink-0 text-neutral-500 mt-0.5`), `ToggleChip` "Errors only", `ClearFiltersButton`.
4. Vazio (`!isLoading && rows.length === 0 && page === 0`): `<div className="mt-2 px-8">` com `EmptyState` ("No matching traces" com filtros, "No traces yet" sem).
5. Senão `<div className="flex flex-col -mt-2">` > `TooltipProvider delay={150}` > `Table className="table-fixed min-w-5xl" stickyHeader`: `SortableHead align="right"` com largura por coluna (`w-28`, `w-30`, `w-32`, `w-38`, `w-36`); body com `TableRowsSkeleton rowHeight="h-16"` e um `SKELETON_COLS` por página (`[{ w: "w-40", sub: "w-56" }, { align: "right", w: "w-10" }, ...]`), senão `TableRow interactive {...rowNav(router, href)}`; célula principal `h-16` com título `truncate text-[14px]` e meta `mt-0.5 flex items-center gap-3 text-xs text-muted-foreground`; numéricas `text-right tabular-nums`, `HeatCell` em custo e duração.
6. `PaginationFooter` só com linhas, `isFetching` desabilitando os chevrons durante refetch.

## Breakpoints

Sem `tailwind.config` nem `--breakpoint-*`: valem os padrões (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) e as container queries `@md` 448px e `@lg` 512px. Desktop-first com três degraus: `md` liga a sidebar fixa (`md:flex`) ou a barra do `topbar`, a margem e o raio do inset e `md:grid-cols-2`/`md:grid-cols-4` nos stats; `lg` pares de cards (`lg:grid-cols-2`, a classe de grid mais repetida do repo); `xl` quatro colunas (`xl:grid-cols-4`); `sm` só em dialogs (`sm:max-w-md`). Nenhum `2xl:`. Abaixo de 768: tabela `min-w-5xl` rola dentro do wrapper e perde o sticky; a Toolbar quebra (`flex-wrap`) e sobe o trailing; stats em uma coluna; gutters continuam `px-8` e `px-6`. Adaptação por medida, não por media query: a Toolbar mede com `ResizeObserver`; o `stat-grid` do lume usa container query. Abaixo de 768 px, o `layout="topbar"` se comporta como a Lateral: a barra some, o cabeçalho do cartão traz o gatilho e a gaveta traz as zonas.

## Página solta

```text
+-canvas bg-sidebar---------------------------+
|                 [# marca]                   |
|        +-Card w-full max-w-lg-------+       |
|        | titulo                     |       |
|        | conteudo ou formulario     |       |
|        | [ Acao principal ]         |       |
|        +----------------------------+       |
|    sem acesso ou link vencido: proximo passo|
+---------------------------------------------+
```

A tela sem navegação entre telas: login, link público por token, convite, sem acesso e indisponível, onboarding em etapas e embed. Não monta o `AppShell`: é uma receita, sem item (adição do lume).

<!-- skill:start -->
| Parte | Classes e regra |
|---|---|
| Raiz | `<main className="flex min-h-svh flex-col items-center bg-sidebar px-4 py-12 md:py-24 [html:has(&)]:bg-sidebar">`: um `main` só, sobre o canvas. O `[html:has(&)]:bg-sidebar` pinta o `html` com o mesmo tom enquanto a página está montada (o seletor gerado é `html:has(...)`), e o overscroll do Safari mostra o canvas acima e abaixo dela, não o `--background` (docs/conceitos/html-background.md) |
| Marca | `flex h-8 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0` |
| Cartão | `Card className="mt-6 w-full max-w-lg"`, a receita de `registry/base-vega/ui/card.tsx:17`, com um `Button` default por tela |
| Sem acesso e link vencido | `EmptyState` dentro do Card, com a ação do próximo passo ("Voltar ao Hub", "Pedir novo link"): nunca um beco sem saída |
| Login | o item `login-form` |
| Onboarding | "Etapa X de 5" é conteúdo da coluna, não chrome |
| Embed | o conteúdo direto em `h-dvh`, sem canvas: quem emoldura é a outra app |
| Celular | `px-4` e o Card na largura toda; nada `fixed` no rodapé, por causa do teclado virtual; a ação principal ganha alvo de 44 px por pseudo-elemento (`relative after:absolute after:-inset-1.5` sobre os 32 px do `Button`) |
<!-- skill:end -->

Referências: craft.gustavofior.com, coluna centrada em `mx-auto w-full max-w-160`, sem chrome de app; o `login-form` do Foglamp; Benji Taylor, tela cheia para o que fica (https://benji.org/family-values); e as Web Interface Guidelines, que pedem o próximo passo em toda tela de erro (https://github.com/vercel-labs/web-interface-guidelines).

## O que não copiar

- `prefetch.ts` (código morto desde d92029e), `components/user-menu.tsx`, `CardsSkeleton`, `StatCard.hint` (aceito e nunca renderizado), `ProjectGate`, `NoProject`, `SunsetCard`, `QuotaCard`, Foggy, DevBar, HUD, PostHog.
- Hex em `className`: tile marrom de traces (`bg-[#ede0d4]`), ícones de filtro `#B8B8B8`/`#5B5B5B`, hairline do popover `#EFEFEF`/`#252525`, `IconPacmanFilled text-[#0090FD]`.
- Dois `<main>` aninhados: o viewport de scroll do Foglamp é um `<main>` dentro do `SidebarInset`, que já é `<main>`. O `app-shell` do lume repetiu isso até a v0.2.0; hoje o viewport é `div` (`data-slot="shell-viewport"`) e o `SidebarInset` é o único `main`.
- `SidebarTrigger` com "Toggle Sidebar" e o gatilho só no celular: o `ShellTrigger` tem rótulo em pt-BR e fica visível no desktop nos três estados.
- Strings "Loading…" cruas (platform, invitation, notifications) e `<table>` cru da página Platform.
- `defaultTheme="system"` do FRONTEND.md original: a regra praticada é `dark` + `enableSystem`.
