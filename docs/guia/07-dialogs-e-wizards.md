# 07. Dialogs e wizards

Origem: mapa cap. 13. Cobre a configuração que vira UI (metadados em `.ts` sem JSX), o dialog pequeno de criação, o dialog grande com faixa de status e histórico, o wizard de 3 passos com `AutoHeight` e grade de presets, o `Segmented`, as listas com badge de status e a confirmação de delete. Itens: `dialog`, `alert-dialog`, `field`, `select`, `combobox`, `separator`, `scroll-area`, `scroll-fade`, `switch`, `badge`, `alert`, `spinner`, `empty`, `motion`, agrupados em `kit-formulario` e `kit-feedback`; `Segmented` e `AutoHeight` não são itens na v0.1 (copie de eval-settings-fields.tsx:156-212 e evals-client.tsx:190-229). Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/app/(app)/alerts/` e `evals/`).

## Configuração que vira UI

<!-- skill:start -->
Ícone, cor, unidade, placeholder e ordem de cada opção vivem num `.ts` sem JSX (`alert-config.ts`, `preset-meta.ts`), importado pela lista, pelo dialog de criação, pelo de edição e pelo detalhe: o badge de um item tem a mesma cor em todo lugar. Forma: `META: Record<Kind, { label, icon, badgeVariant, unit, placeholder }>` + opções `{ value, symbol, label }` (o `symbol` vai no trigger fechado, o `label` só na lista) + conversões puras (`thresholdToInput` multiplica por 100 em métrica de taxa, `thresholdFromInput` divide). Opções aposentadas continuam renderizáveis e editáveis com `<Badge variant="secondary">Legacy</Badge>` ao lado do rótulo no select de edição. Famílias de check (preset-meta.ts:51-78), chip no molde do tile da nav:

| Família | Chip (`FAMILY_CHIP`) | Badge |
|---|---|---|
| custom | `bg-orange-100 dark:bg-orange-950 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.14),0_2px_6px_-2px_rgba(249,115,22,0.25)] dark:shadow-(--custom-shadow)` | `orange` (Foglamp, apps/web/src/app/(app)/evals/preset-meta.ts) |
| safety / format / match | mesma receita em rose `244,63,94` / sky `14,165,233` / violet `139,92,246` | `rose` / `blue` / `violet` |
| quality / grounding / tool | fuchsia `217,70,239` / emerald `16,185,129` / amber `245,158,11` | `fuchsia` / `emerald` / `amber` |
<!-- skill:end -->

## Dialog pequeno de criação

<!-- skill:start -->
| Zona | Classes / props exatas | Fonte |
|---|---|---|
| `DialogContent` | base `fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm text-popover-foreground shadow-(--custom-shadow) duration-100 outline-none sm:max-w-md` + `className="sm:max-w-lg"` só para alargar | registry/base-vega/ui/dialog.tsx:58; alerts-client.tsx:282 |
| Header | `DialogTitle` (`font-heading leading-none font-medium text-base`) + `DialogDescription` (`text-sm text-muted-foreground ... text-balance`) | dialog.tsx:126, 142 |
| Form | `<form onSubmit className="flex flex-col gap-6">` real, para Enter em qualquer campo submeter; `FieldGroup className="gap-4"` (default `gap-7`) | alerts-client.tsx:290-298 |
| Linhas | `div.flex.items-end.gap-3` com `Field className="w-1/2"`, `w-fit`, `w-1/2`; depois `div.flex.items-start.gap-3` com `Field className="w-40"` + `Field className="flex-1"` | alerts-client.tsx:299-468 |
| Select com ícone no valor | `SelectValue` com render function `{(value) => <span className="flex items-center gap-1.5"><Icon className="text-muted-foreground" />{label}</span>}` e `SelectItem label={...}` explícito (senão o ícone entra no texto do trigger); compacto: label `sr-only`, `SelectTrigger className="h-9"`, valor em `span.tabular-nums`, `SelectContent className="w-56"` com `<span className="w-4 tabular-nums">{symbol}</span>{label}` | alerts-client.tsx:309-379 |
| Unidade no label | `Threshold <span className="text-muted-foreground/50">{unit}</span>`; `Input type="number" min={0} step="any" autoComplete="off"` | alerts-client.tsx:383-400 |
| Erros | `Field data-invalid={!!errors.x}` + `Input aria-invalid` + `<FieldError>{errors.x}</FieldError>`; `validate()` só no submit, `setField` apaga o erro do campo ao editar | alerts-client.tsx:224-253 |
| Footer | `DialogFooter` > `Button type="submit" disabled={create.isPending}`; sem Cancel, o X (`Button variant="ghost" size="icon-sm" className="absolute top-4 right-4"`) fecha; sucesso invalida a lista, fecha, reseta o `DEFAULT_FORM`, `toast.success("Alerta criado")` | dialog.tsx:64-71 |
<!-- skill:end -->

## Dialog grande: seções, faixa de status e histórico

```tsx
<DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
  <DialogHeader className="p-6">…</DialogHeader>
  <Separator className="dark:bg-border/40" />
  <ScrollArea className="h-[min(40rem,calc(100vh-16rem))]">
    <dl className="flex items-center gap-6 px-6">…faixa de status…</dl>
    <form id="alert-details-form" className="flex flex-col gap-6 py-6">…</form>
    <Separator className="dark:bg-border/40" />
    <section className="flex flex-col gap-4 p-6">…histórico…</section>
  </ScrollArea>
  <Separator />
  <DialogFooter className="p-6">…</DialogFooter>
</DialogContent>
```

<!-- skill:start -->
- `gap-0 overflow-hidden p-0` anula o `gap-6 p-6` do popup; cada zona repõe o próprio padding (`p-6` no header e footer, `py-6` + `px-6` nos filhos do form). Os `Separator` (`bg-border/70`, `dark:bg-border/40` para discrição no escuro, registry/base-vega/ui/separator.tsx:19) vão de borda a borda e o scroll não vaza pelos cantos. Corpo em `h-[min(40rem,calc(100vh-16rem))]`: 640px no máximo ou a viewport menos 16rem; header e footer fixos.
- Salvar fora do `<form>`, no footer, ligado por `form="alert-details-form"`: `Button variant="ghost"` "Cancelar" + `type="submit"` "Salvar" `disabled={update.isPending}`.
- Faixa de status: `<dl className="flex items-center gap-6 px-6">` com colunas `flex flex-1 flex-col gap-1` separadas por `<Separator orientation="vertical" className="dark:bg-border/40" />`; `dt` `text-sm font-medium`, `dd` `tabular-nums text-muted-foreground` com `title={formatDateTime(...)}` e `formatRelative`; a coluna do `Switch id size="sm"` (`h-3.5 w-6`, thumb `size-2.5`, registry/base-vega/ui/switch.tsx:21,28) usa `gap-2.5` e o `dt` é `<label htmlFor>`.
- Formulário `FieldGroup className="gap-5 px-6"`; linha de três em `grid grid-cols-[1fr_auto_16.5rem] items-end gap-3`; nome gerado pelo servidor com `Button type="button" variant="secondary" size="xs" className="w-fit"` "Usar nome automático" quando editado à mão.
- Histórico: query com `enabled: open` e `refetchInterval: open ? 60_000 : false`; carregando `<div className="flex justify-center py-8"><Spinner /></div>`; vazio `<Empty className="p-8 py-10">` + `EmptyMedia variant="icon"`; lista `ul.flex.flex-col.gap-3.text-sm` > `li.flex.flex-col.gap-1.5` com `Badge variant="rose" | "emerald"` + `span.truncate.text-muted-foreground` + hora `shrink-0 text-xs text-muted-foreground` à direita e diagnóstico em `rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground`.
- Montagem: só existe com `selectedAlert`, `key={id}` reinicia o draft; `onOpenChange` fecha e `onOpenChangeComplete={(next) => { if (!next) setSelectedId(null); }}` desmonta depois da saída.
<!-- skill:end -->

## Wizard de 3 passos

```tsx
<DialogContent className="block w-auto max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0 sm:max-w-none">
  <motion.div initial={false} animate={{ width: step === 2 ? 800 : step === 3 ? 600 : 460 }} transition={MORPH} className="overflow-hidden">
    <form className="flex flex-col gap-6 py-6">
      <DialogHeader className="px-6">…uma pergunta por passo na DialogDescription…</DialogHeader>
      <AutoHeight>
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>…</motion.div>
      </AutoHeight>
      <DialogFooter className="px-6">…Voltar (ghost, a partir do passo 2) + Próximo / Criar (submit)…</DialogFooter>
    </form>
  </motion.div>
</DialogContent>
```

<!-- skill:start -->
- `block w-auto … sm:max-w-none` tira o `grid w-full sm:max-w-md` do primitivo; a largura é do `motion.div`: 460 (passo 1), 800 (grade de cards), 600 (passo 3), spring `MORPH = { type: "spring", stiffness: 400, damping: 38 }` (registry/base-vega/lib/motion.ts). Troca de passo é fade de 180ms, sem slide; `Enter` avança respeitando `nextDisabled`.
- `AutoHeight` (evals-client.tsx:190-229) mede o filho com `ResizeObserver` e anima `height` com `MORPH`; primeira medição "snapped" (não anima na abertura); mede `offsetHeight`, não `getBoundingClientRect` (o dialog abre com `zoom-in` e o rect sairia escalado); o padding `px-6 py-1.5` fica no filho medido para o `overflow-hidden` ter folga para o focus ring.
- Passo 1: `Select` cujo valor fechado é `<Icon className="size-4 text-muted-foreground" />{label} <span className="text-muted-foreground">· {description}</span>` e cujo item aberto tem duas linhas (`span.flex.flex-col` com `text-xs text-muted-foreground`); `Combobox` de digitação livre com `ComboboxInput className="w-full"`, ícone do item escolhido em `InputGroupAddon align="inline-start"`, `ComboboxEmpty`.
- Passo 2: `ScrollFade className="max-h-[55vh]" fromClassName="from-popover"` (dentro de dialog o fade é cor de popover, registry/base-vega/components/scroll-fade.tsx:23) > grupos `flex flex-col gap-2` com `p.text-sm.font-medium.text-muted-foreground` e `grid grid-cols-2 gap-2`. Card de preset (Foglamp, apps/web/src/app/(app)/evals/evals-client.tsx): `button type="button" data-selected` com `group flex cursor-pointer items-start gap-3 rounded-lg squircle:rounded-3xl corner-squircle border border-border/60 p-3 text-left transition-colors hover:bg-muted/50 data-[selected=true]:border-primary/5 data-[selected=true]:bg-primary/5 dark:data-[selected=true]:bg-primary/10`; ícone `size-6 shrink-0 rounded-md squircle:rounded-xl corner-squircle p-1` + `FAMILY_CHIP`; nome `text-sm font-medium leading-none`, descrição `truncate text-xs leading-snug text-muted-foreground`.
- Passo 3: preflight em duas intensidades: bloqueio `<Alert variant="destructive" className="-mt-2 mb-4">` (`bg-card`, só texto e ícone tingidos, registry/base-vega/ui/alert.tsx:9-15); aviso `p.-mt-2.mb-4.flex.items-center.gap-1.5.text-xs.text-amber-600.dark:text-amber-400` + `IconAlertTriangle className="size-3.5 shrink-0"` ("advisory: uma linha discreta, não um banner"). Depois o bloco de campos compartilhado com o dialog de edição (`sm:max-w-xl`), controlado por props e devolvendo patches por `onChange`; validadores puros travam o botão nos dois lugares com a mesma regra, sem mensagem de submit.
<!-- skill:end -->

## Segmented

<!-- skill:start -->
```tsx
<div className="inline-flex w-full rounded-md squircle:rounded-2xl corner-squircle bg-muted p-0.75 dark:bg-muted/50">
  <button type="button" className={cn("relative flex-1 cursor-pointer rounded-md squircle:rounded-xl corner-squircle px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors",
      active ? "text-foreground" : "text-foreground/60 hover:text-foreground")}>
    {active && <motion.span layoutId={layoutId} transition={MORPH}
      className="absolute inset-0 rounded-md squircle:rounded-xl corner-squircle bg-background shadow-(--custom-shadow) dark:bg-input/50" />}
    <span className="relative z-10">{opt.label}</span>
  </button>
</div>
```
Trilho `bg-muted` com `p-0.75` (3px), pílula `bg-background` + sombra (no escuro `bg-input/50`), inativo a 60%, spring `MORPH`. `layoutId` único por instância montada (`${id}-threshold`, `${id}-sample`), senão dois controles disputam a mesma pílula. Variante redonda (`SdkToggle`, mapa 12.10; Foglamp, apps/web/src/components/app/instrument-empty-state.tsx): trilho `inline-flex h-8 items-center rounded-full px-1 p-0.5 dark:bg-input/20 bg-card shadow-(--custom-shadow)`, opção `h-6 rounded-full px-2.5 text-xs`, pílula `bg-input dark:bg-input/50`, `layoutId={useId()}`. Dois lado a lado: `grid gap-4 sm:grid-cols-[2fr_3fr]`.
<!-- skill:end -->

## Listas com badge de status

<!-- skill:start -->
| Peça | Valor |
|---|---|
| Tabela | `<Table className="table-fixed min-w-5xl" stickyHeader>` em `div.flex.flex-col.-mt-2`, dentro de `TooltipProvider delay={150}`; linha pausada `TableRow className={cn(!r.enabled && "opacity-60")}` |
| Condição | `<Badge variant={META.badgeVariant} className="min-w-0 max-w-full"><Icon /><span className="min-w-0 truncate">{label}</span></Badge>` + `<span className="shrink-0 tabular-nums"><span className="text-muted-foreground mr-1.5 ml-1">{símbolo}</span>{valor}</span>` |
| Nome em duas linhas | `h-16`: `span.truncate.text-[14px]` + `div.flex.min-w-0.items-center.gap-1.text-xs` tingido com `FAMILY_ICON` e `Icon className="size-3 shrink-0 mb-px"`; alerta na linha é ícone outline + `fill-current/20` em `text-destructive`, `size-3.5`, com `title` e `aria-label` (ou `Tooltip side="bottom"`) |
| Taxa colorida | `>= 0.9` `text-emerald-600 dark:text-emerald-400`, `< 0.5` `text-rose-600 dark:text-rose-400`, entre os dois sem cor; nulo `sem dado` em `text-muted-foreground/50` (regra do lume; o Foglamp usa `/40` com travessão) |
| Ações | `TableCell align="center"` > `div.flex.items-center.justify-center.gap-1` com `Button size="icon-sm" className="size-7"` `variant="ghost"` + `IconPencilFilled` e `variant="ghost-destructive"` + `IconTrashFilled`, ambos com `aria-label`; `Switch size="sm"` por linha com `onClick={(e) => e.stopPropagation()}` e `disabled` só na linha cuja mutation está em voo (`update.variables?.id === r.id`) |
| Status em histórico | `Badge variant="rose"` fired / `"emerald"` resolved (`h-5 px-2 text-xs`, sombra `--custom-shadow-rose` / `-emerald`, registry/base-vega/ui/badge.tsx:28-30,42) |
<!-- skill:end -->

## Confirmação de delete

<!-- skill:start -->
`AlertDialog open={deleteTarget !== null}`, título `Apagar {name}?`, descrição dizendo que não dá para desfazer, `AlertDialogCancel` (ghost) + `AlertDialogAction variant="destructive" disabled={isPending}` "Apagar". Um `useRef` `lastDeleteTarget` guarda o último alvo para o nome não sumir do título enquanto o dialog anima fechando (`deleteTarget` é zerado na hora). Conteúdo `max-w-xs` no mobile, `sm:max-w-lg` (registry/base-vega/ui/alert-dialog.tsx:58). Botão de criar: `<IconPlus strokeWidth={2.4} />` + texto no `trailing` da Toolbar; sem nenhum item vai para dentro do `EmptyState` com `className="mt-2"`, porque é mais descobrível ali.
<!-- skill:end -->

## O que não copiar

- `DialogTrigger render={<Button size="sm" />}` no header (pricing): dialog com estado de formulário abre por `open` + `useState`.
- Mensagens de validação em inglês e strings com meia-risca ou travessão (`unit` de `eval_avg_score`, placeholder de nulo nas células): o lume usa `sem dado` em `text-muted-foreground/50`.
- `text-[#B8B8B8]`/`dark:text-[#5B5B5B]` nos ícones de filtro e `rgba` literal fora da receita do chip (`FAMILY_CHIP` é a exceção consciente: o `dark:shadow-(--custom-shadow)` ao lado mostra que o token existe); `Cancel` em `variant="outline"` no "Edit eval": o Cancel de dialog é `ghost`.
- Passo 2 sem estado vazio quando a query de presets falha; `refetchInterval: 60_000` amarrado ao sweep do servidor do Foglamp.
