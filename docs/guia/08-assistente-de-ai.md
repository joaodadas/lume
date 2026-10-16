# 08. Assistente de AI (chat no shell)

Origem: mapa cap. 14, sem o HUD (overlay em Shadow DOM do SDK, fora do lume). Cobre como o painel de chat se encaixa no shell, a física de abrir e redimensionar, a anatomia do painel, as bolhas, o streaming e o markdown: é a receita para os agentes da Lyx colocarem um assistente dentro de um app com a cara do DS. Itens hoje: `header-slot` (`useReportLayoutReserve`, `usePendingShrink`), `loader` (`TextShimmerLoader`), `markdown-components`, `motion`, `empty`, `button`, `kbd`, `dropdown-menu`; o bloco `ai-chat` (do Foggy) fica para a v0.2, até lá o painel é composição sua a partir daqui. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/components/app/foggy/`).

## Encaixe no shell

<!-- skill:start -->
- O painel é um **irmão flex do inset**, no mesmo canvas `bg-sidebar`, nunca um overlay: `motion.aside` com `animate={{ width: open ? displayWidth : 0 }}`, `initial={false}`, `relative h-svh shrink-0`, `aria-hidden={!open}`, sem `overflow-hidden` (o provider já clipa e o handle precisa pender além da borda). Dentro, `motion.div className="flex h-full flex-col py-2 pr-2"` com `animate={{ width: displayWidth }}`: largura fixa para o conteúdo não refluir enquanto abre e fecha (foggy-widget.tsx:462-505).
- O estado `open` vive no shell (app-shell.tsx:288), porque gatilho (dentro do inset) e painel (irmão) o compartilham; `key={projectId}` no widget reinicia a conversa ao trocar de contexto; o inset tem `transition-shadow duration-200` para a sombra animar junto da abertura.
- Antes de animar, `useReportLayoutReserve(open ? panelWidth : 0)` (registry/base-vega/components/header-slot.tsx:79) publica a largura alvo; a `Toolbar` lê `usePendingShrink()` (header-slot.tsx:92) e sobe os controles para o header no primeiro frame, não um frame depois do overflow. Só encolhimento é antecipado.
- Afordância de resize fica no inset, não no handle: handle invisível `role="separator" aria-orientation="vertical" aria-label="Redimensionar painel"` com `data-foggy-resize=""` e `data-resizing` enquanto arrasta, classes `absolute inset-y-0 -left-2 z-20 w-4 cursor-col-resize`; o inset recebe `pointer-events-none absolute inset-0 z-10 rounded-lg squircle:rounded-3xl corner-squircle border-r border-border/80 opacity-0 transition-opacity duration-200 group-has-[[data-foggy-resize]:hover]/shell:opacity-100 group-has-[[data-foggy-resize][data-resizing]]/shell:opacity-100` (Foglamp, apps/web/src/components/app/app-shell.tsx:396-399; renomeie o atributo nos dois lugares). A borda direita do inset "acende" como se fosse a alça.
- Gatilho: no Foglamp é um entalhe SVG no canto do inset. No lume é `Button variant="ghost" size="sm"` com `rounded-sm h-8 pl-2 active:scale-100` + ícone `size-4` + `Kbd` com a letra, no header ou no rodapé da sidebar (adição do lume); a letra abre fora de campo editável (ignora `metaKey`, `ctrlKey`, `altKey`, `INPUT`, `TEXTAREA`, `SELECT`, `isContentEditable`) e o listener vive no gatilho, montado só com o painel fechado.
<!-- skill:end -->

## Física de abrir e redimensionar

<!-- skill:start -->
| Constante / parâmetro | Valor | Fonte |
|---|---|---|
| `PANEL_WIDTH` / `MIN_PANEL_WIDTH` / `MAX_PANEL_WIDTH` | 354 / 320 / 640 px (o inset `flex-1` cede exatamente a largura) | foggy-widget.tsx:64-66 |
| `MAX_PANEL_STRETCH` | 28 px (teto do rubber band) | :70 |
| Tween de largura | `{ duration: 0.25, ease: ENTRANCE_EASE }` (`[0.32, 0.72, 0, 1]`, registry/base-vega/lib/motion.ts); `{ duration: 0 }` durante o arrasto | :468-472, 500-504 |
| Foco no composer | `setTimeout(..., 260)` depois de abrir: amarrado ao tween de 0.25s, mudar um exige mudar o outro | :437 |
| Fechar / cursor | `Escape` em listener de `window`, `blur()` no textarea ao fechar; no drag `document.body.style.cursor = "col-resize"` e `userSelect = "none"` até o `pointerup` | :428-452, 261-282 |
| Largura | não persiste entre sessões (o painel de trace persiste em `localStorage`): escolha uma das duas e comente | |

```ts
function rubberBand(excess: number) {
  const sign = Math.sign(excess), distance = Math.abs(excess);
  return sign * MAX_PANEL_STRETCH * (1 - Math.exp(-distance / (MAX_PANEL_STRETCH * 2)));
}
// onMove: width = clamp(min, max, raw); stretch = rubberBand(raw - clamped); displayWidth = width + stretch
// pointerup: setStretch(0) e setResizing(false) reativam o tween de 0.25s e o painel "mola" de volta ao limite
```
Começa com metade da velocidade do ponteiro e tende a 28px: o limite lê como resistência, não parede.
<!-- skill:end -->

## Anatomia do painel

<!-- skill:start -->
| Zona | Classes / comportamento | Fonte |
|---|---|---|
| Header | `flex items-center justify-end gap-2 px-2 pb-2 pt-1`, três `Button size="icon-sm" variant="ghost"` (`size-8 rounded-full`) com ícones `size-4`: histórico (`DropdownMenu` que carrega threads em `onOpenChange`, trigger por `render={<Button />}`, `DropdownMenuContent align="end" className="w-64"`, thread atual `bg-accent/80 dark:bg-accent/50`), novo chat (`IconPlus`, só com mensagens, `AnimatePresence` fade 0.15s) e fechar (`IconX`, botão sempre montado, só o ícone some para o header não refluir) | :506-584 |
| Lista | `relative min-h-0 flex-1` > scroller `h-full overflow-y-auto px-2 py-4` com `onScroll` setando `scrolled = scrollTop > 8`; lista `flex flex-col gap-6 pb-8`; `scrollTo({ top: scrollHeight, behavior: "smooth" })` a cada mudança de `messages` ou `busy`; troca vazio/lista com `AnimatePresence mode="wait" initial={false}` | :586-680 |
| Fades de borda | topo `pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-sidebar via-sidebar/50 to-transparent transition-opacity duration-200` (só quando `scrolled`); base `... bottom-0 h-12 bg-linear-to-t from-sidebar via-sidebar/50 to-transparent` sempre; ambos `aria-hidden` com `maskImage: linear-gradient(to bottom|top, black 35%, transparent)` | :592, 673 |
| Estado vazio | `Empty className="h-full border-0 p-0"` (tira o tracejado e o `p-12 py-16`, registry/base-vega/ui/empty.tsx:12); `EmptyMedia variant="icon"` como tile de 36px na cor da marca: `size-9 [&_svg:not([class*='size-'])]:size-5 corner-squircle bg-[#0090FD]/10 text-[#0090FD] shadow-[inset_0_0_0_1px_rgba(0,144,253,0.14),0_2px_6px_-2px_rgba(0,144,253,0.25)] dark:bg-[#0090FD]/15 dark:shadow-(--custom-shadow) rounded-md squircle:rounded-2xl` (troque o hex pelo da sua marca, com o comentário de uma linha que o FRONTEND.md pede) | :616-620 |
| Sugestões | dentro do `form`, acima do textarea, só sem mensagens; cada uma `button` com `w-fit rounded-md squircle:rounded-xl corner-squircle px-2 py-1.5 cursor-pointer text-left text-sm dark:hover:bg-accent/40 hover:bg-accent/70 text-muted-foreground/50 flex justify-center items-center gap-2` (apagadas até o hover) | foggy-widget.tsx:704 (Foglamp) |
| Pensando | `busy = status === "submitted" \|\| status === "streaming"`; `thinking = busy && !replyStarted` (última mensagem do assistente ainda sem `text`): `TextShimmerLoader text="Pensando…" size="sm" className="pl-4"` até o primeiro token, inclusive durante tool calls (`sm` = `text-xs`, gradiente `muted-foreground 40% / foreground 60% / muted-foreground 80%` em `bg-clip-text`, `animate-shimmer` 4s, registry/base-vega/ui/loader.tsx:17-34, keyframes em styles/globals.css:269-272) | :355, 411-415, 641-645 |
| Erro | bolha `rounded-lg squircle:rounded-3xl corner-squircle bg-destructive/10 px-3 py-2 text-sm text-destructive w-fit flex gap-2 items-center` + `IconAlertHexagonFilled size-3.5`; mensagem de `JSON.parse(error.message).error` ou fallback; `Button size="sm" variant="outline" className="w-fit"` "Tentar de novo" + `IconRefresh size-3.5` chama `regenerate()` (a pergunta continua na thread, reenvia em vez de redigitar) | foggy-widget.tsx:647-666 (Foglamp) |
| Composer | `form.relative.flex.flex-col.gap-2.p-1.pt-0`; `<textarea rows={2}>` cru estilizado como card: `max-h-32 min-h-20 flex-1 resize-none rounded-xl squircle:rounded-4xl corner-squircle shadow-(--custom-shadow) dark:bg-muted/30 bg-white p-4 text-sm outline-none transition-colors focus-visible:border-ring` (no lume `bg-card` no lugar de `bg-white`); `Enter` envia, `Shift+Enter` quebra linha; enviar `Button type="submit" size="icon-xs"` (`size-6`, svg `size-3`) `disabled={!input.trim()}` em `absolute right-4 bottom-4` + `IconArrowUp size-4`; parar `size="icon-xs" variant="secondary"` no mesmo lugar com `span.size-2.5.rounded-[2px].bg-current` | foggy-widget.tsx:682-748 (Foglamp) |
<!-- skill:end -->
`send()` faz trim, ignora vazio ou `busy`, chama `sendMessage({ text })` e limpa o input. O textarea não é o primitivo `Textarea`: é a mesma linguagem visual da bolha do usuário (sombra no lugar de borda, squircle grande). `newChat()` e `openThread()` zeram `scrolled` explicitamente.

## Bolhas: usuário é card, assistente é página

<!-- skill:start -->
| Papel | Classes exatas | Leitura |
|---|---|---|
| Container | `flex flex-col gap-1.5` + `items-end` (usuário) ou `items-start` (assistente), iterando `message.parts` | foggy-message.tsx:40-45 |
| Usuário | `max-w-[85%] whitespace-pre-wrap rounded-lg squircle:rounded-3xl corner-squircle bg-card shadow-(--custom-shadow) px-3 py-2 text-sm text-primary` | um card: sombra no lugar de borda, texto em `text-primary` (Foglamp, apps/web/src/components/app/foggy/foggy-message.tsx:54) |
| Assistente | `max-w-[90%] px-3 py-0 text-sm leading-relaxed` + prosa `[&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_pre]:my-2 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 *:first:mt-0 *:last:mb-0` | sem bolha: a resposta é "a página", a pergunta é um objeto sobre ela |
| Tool call | `ToolChip`: `flex w-fit items-center gap-1.5 ml-3 py-1 text-xs text-muted-foreground` + `IconTool className="size-3 shrink-0 fill-current stroke-0"` com `animate-pulse` até `state` ser `output-available` ou `output-error`; texto "Consultando X" / "Consultou X" com o nome da tool sem o prefixo `tool-` e camelCase virando palavras | pílula de texto, não card |
<!-- skill:end -->
A receita de prosa é copiada em 5 arquivos do Foglamp, não `@utility`: repita-a no wrapper de quem renderiza markdown.

## Streaming e markdown

<!-- skill:start -->
- Transporte: `@ai-sdk/react` + `DefaultChatTransport` para o endpoint do chat com `credentials: "include"` e `body: { projectId, threadId }`; `pathname` e filtros atuais em `useRef` lidos em `prepareSendMessagesRequest`, para não recriar o transport a cada navegação (foggy-widget.tsx:303-344). Cada mensagem leva a página atual e o período.
- `useChat({ id: threadId, messages: seedMessages, transport })`: o `id` é o que reconstrói o chat interno; sem ele "novo chat" e "retomar" continuam postando sob o `threadId` antigo. `newChat()` gera `crypto.randomUUID()`; `openThread()` troca `seedMessages` e `threadId` juntos.
- Render com `streamdown` + `components={markdownComponents}` (registry/base-vega/components/markdown-components.tsx) e `controls={{ table: false }}`: links internos pelo `Link` da registry e externos com `target="_blank"`, tabela plana `w-full border-collapse text-xs tabular-nums` em wrapper `my-3 w-full overflow-x-auto rounded-md squircle:rounded-xl corner-squircle border border-border/60`, `img` cru (hidratação e URLs remotas), `hr my-3 border-border/60`.
- CSS: `@source "../../../node_modules/streamdown/dist/*.js"` no CSS do app (o Streamdown traz classes Tailwind no bundle); Shiki em tema duplo `github-light` / `vesper` com `defaultColor: false` e `.dark .shiki` trocando para `--shiki-dark`.
- Toda espera é `TextShimmerLoader`, nunca spinner; todo erro é bolha com retry, nunca toast (toast é feedback de query, não de conversa).
<!-- skill:end -->

## O que não copiar

- O HUD (`packages/sdk/src/hud`): Shadow DOM, `HUD_CSS` em string, spring próprio, tokens `--fl-*` copiados à mão. Dentro do app o chat usa os tokens e primitivos do lume.
- O entalhe `FoggyLauncher` (SVG `right-[7.75px]`, `stroke-[#E3E3E3] dark:stroke-[#1E1E1E]`, `fill-sidebar`), o `.dark .foggy-inset-closed { box-shadow: ... }` que o acompanha e o `style={{ borderBottomRightRadius: 0 }}` no inset.
- `bg-white` sólido no launcher, no Kbd e no textarea, e `IconPacmanFilled text-[#0090FD]` como ícone de produto: no lume é `bg-card` e um ícone Tabler filled; hex só na cor de marca, com comentário.
- `agent-prompt.ts` (apesar do nome, é o prompt de onboarding para coding agents) e `AskFoggy` da landing (input cru numa linha de FAQ, `text-[15px]`).
