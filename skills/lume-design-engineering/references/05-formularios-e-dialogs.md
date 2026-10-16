# Formulários e dialogs

Gerado por `bun scripts/build-skill.ts` a partir de `FRONTEND.md`, `docs/guia/06-formularios-auth-settings.md`, `docs/guia/07-dialogs-e-wizards.md`; não edite à mão. Caminhos sem prefixo são relativos à raiz de https://github.com/joaodadas/lume; `apps/web/` e `packages/ui/` são do Foglamp (commit `2bc3bb5`).

## Campos e formulários

<!-- mapa: 5.5 a 5.8, 12.4 | regras 4, 7, 22 -->

- **Always** use `Input` (`h-9 ... rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base ... placeholder:text-muted-foreground/50 ... md:text-sm dark:bg-input/30`, `registry/base-vega/ui/input.tsx:14`), `Textarea` (`field-sizing-content min-h-16`), `SelectTrigger` (`data-[size=default]:h-9 data-[size=sm]:h-8`) e `Kbd`: a mesma superfície de campo, sombra no light e hairline no dark.
- **Always** use `InputGroup` + `InputGroupInput` + `InputGroupAddon align="inline-start | inline-end"` para ícone, prefixo, sufixo, botão ou `kbd` dentro do campo; o foco e o `aria-invalid` sobem para o container por `:has()`.
- **Always** siga a anatomia `Label` + controle + erro: wrapper `flex flex-col gap-2.5`, `Label` (`text-sm leading-none font-medium`), erro `<p className="text-xs text-destructive">` ou `Field data-invalid` + `FieldLabel` + `FieldError` (`text-sm font-normal text-destructive`, `registry/base-vega/ui/field.tsx:221`) em dialogs; campos empilhados em `flex flex-col gap-5`; `autoComplete` sempre (`email`, `current-password`, `new-password`).
- **Always** valide com Zod no submit (`validators: { onSubmit: schema }` no TanStack Form ou `zodResolver` no React Hook Form): a lib de form é livre desde que o campo seja o do lume; `login-form` é presentacional.
- **Never** embrulhe um `Input` cru em `div` com ícone `absolute` e `pl-7` na mão, nem use `border border-input` ou `shadow-xs` em campo.

Porquê: no light o anel de 0.5px já faz a linha; no dark um anel escuro some sobre `#0f0f0f`, e uma hairline branca a 5% custa menos que seis camadas de sombra; `text-base` abaixo de `md` evita o zoom do iOS.

## Overlays e menus

<!-- mapa: 6.4 a 6.6 | regras 12, 18 -->

- **Always** use os primitivos: `Dialog` (`rounded-2xl squircle:rounded-[40px] corner-squircle bg-popover p-6 text-sm ... shadow-(--custom-shadow) duration-100 ... sm:max-w-md`, entra em `zoom-in-[96%]` e sai em `zoom-out-[99%]`, backdrop `bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px]`, `registry/base-vega/ui/dialog.tsx:36,58`), `AlertDialog` para confirmar remoção (`AlertDialogAction variant="destructive"`, cancelar ghost), `Popover`, `Tooltip`, `DropdownMenu`.
- **Always** mantenha a string canônica de popup: `origin-(--transform-origin) ... duration-100 data-[side=bottom]:slide-in-from-top-2 ... data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` com `bg-popover` e `shadow-(--custom-shadow)` em `rounded-md squircle:rounded-2xl` (menu, tooltip) ou `rounded-lg squircle:rounded-3xl` (popover) (`dropdown-menu.tsx:47`, `popover.tsx:42`).
- **Always** escreva item de menu como `cursor-pointer rounded-sm px-2 py-1.5 text-sm focus:bg-accent` com ícone `size-4`, destructive em `text-destructive focus:bg-destructive/10` (20% no dark), separador `bg-border/60` (`dropdown-menu.tsx:96,236`); controle `open` por `useState`, com `onOpenChangeComplete` para limpar estado depois da saída.
- **Never** construa portal, overlay ou focus trap próprios; nunca `DialogTrigger` para dialog com estado de formulário; dialog com seções usa a casca `gap-0 overflow-hidden p-0` e cada seção traz o próprio `p-6`.

Porquê: entrada de 96% a partir do gatilho (`--transform-origin`) e saída quase sem escala seguem "o que sai merece menos cerimônia"; o backdrop leve basta porque modal e página são o mesmo material.

## Do guia: 06. Formulários, auth e settings

### Shell de auth e tile da marca

| Peça | Classes exatas | Fonte |
|---|---|---|
| Wrapper da rota (`page.tsx`, server) | `flex min-h-svh items-center justify-center` (`min-h-svh`, nunca `100vh`) | app/login/page.tsx:23 |
| Coluna do formulário / de resultado | `mx-auto flex w-full max-w-lg flex-col p-6` (512px, sem `Card`, sombra ou borda: a página inteira é o formulário); resultado ("Verifique seu e-mail") com `gap-4` | registry/base-vega/blocks/login-form/login-form.tsx |
| Tile da marca | `size-10 rounded-md squircle:rounded-2xl corner-squircle bg-muted shadow-(--custom-shadow) flex justify-center items-center` com a marca em `w-7` (`BrandTile` no bloco) | login-form.tsx:185-187 |
| Título / subtítulo | `mt-5 mb-1 w-full text-start text-lg font-medium text-balance` / `mb-6 text-sm text-muted-foreground tracking-normal`; título de resultado `text-xl font-medium text-balance` em `mt-5 flex flex-col gap-2` | login-form.tsx:188-191, 160 |
| Dado variável no parágrafo | `<span className="font-medium text-foreground">{email}</span>` dentro de `text-sm text-muted-foreground`; texto sempre `text-start`, nunca centralizado | login-form.tsx:132 |
| Ícones de status (device) | `IconCircleCheckFilled size-5 text-green-500` aprovado; `IconCircleXFilled size-5 text-muted-foreground` negado (neutro, não erro); `text-destructive` só em falha | device-approve-client.tsx:123-153 |

### Botões de login

| Método | Controle | Label / espera |
|---|---|---|
| Google | `Button type="button" variant="secondary" className="w-full"` + ícone `size-3.5` (no Foglamp leva `mr-0.75`, única margem em ícone de botão do app; o `Button` já dá `gap-[5.5px]`) | "Entrar com Google" / "Redirecionando…" com `disabled` |
| Separador | `div.my-5.flex.items-center.gap-3` com duas linhas `h-px flex-1 bg-border/50` e `span.text-xs.text-muted-foreground/60` "ou"; só com Google e um form de e-mail, nunca no modo forgot | |
| Senha / esqueci / link mágico | forms `flex w-full flex-col gap-5` (`gap-6` com um campo só); submit `Button type="submit" className="w-full mt-2"` / `"w-full mt-1"` / `"w-full"` | "Entrar" / "Entrando…", "Enviar link de redefinição" / "Enviando…", "Enviar link mágico" / "Enviando…" |
| Voltar e trocar de modo | `Button variant="link" className="self-start px-0 text-muted-foreground/50"` (forgot) e `className="mt-4 self-start px-0 text-muted-foreground/50 hover:text-foreground"` (só quando senha e link mágico existem) | "Voltar para o login", "Prefiro receber um link por e-mail" / "Prefiro usar e-mail e senha" |
| "Esqueci a senha" | `<button type="button" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">` à direita do label Senha, em `div.flex.items-center.justify-between` | |

### Formulário canônico

| Peça | Valor exato | Fonte |
|---|---|---|
| Wrapper do campo | `flex flex-col gap-2.5` (10px) em auth; em dialogs e cards é `Field` (`group/field flex w-full gap-3 data-[invalid=true]:text-destructive`, vertical `flex-col *:w-full`) + `FieldLabel` | login-form.tsx:229; registry/base-vega/ui/field.tsx:57-61 |
| `Label` | `flex items-center gap-2 text-sm leading-none font-medium select-none` | registry/base-vega/ui/label.tsx:14 |
| `Input` | `h-9 w-full min-w-0 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base hover:dark:border-border/70 ... placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 ... aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30` (sombra no light, hairline no dark, `text-base` abaixo de `md` contra o zoom do iOS) | registry/base-vega/ui/input.tsx:14 |
| Erro | `<p className="text-xs text-destructive">` por erro (auth) ou `Field data-invalid` + `Input aria-invalid` + `FieldError` (`text-sm font-normal text-destructive`, só renderiza com conteúdo) em dialogs | login-form.tsx:241-245; field.tsx:221 |
| Placeholder de senha / `autoComplete` | `"••••••••"`; `email`, `current-password`, `new-password` | login-form.tsx:267-268 |
| Schemas | `z.object({ email: z.email("..."), password: z.string().min(1, "...") })`; reset `z.object({ password: z.string().min(8), confirm: z.string() }).refine((v) => v.password === v.confirm, { path: ["confirm"] })`; `z.email()` top-level é Zod 4; validação só no submit, botão habilitado até a primeira tentativa | login-form.tsx:76-81 |
| Pós-sucesso | senha: `window.location.href = callbackUrl` (navegação hard para o gate de SSR reler o cookie; `router.push` não serve); magic e forgot: troca a tela inteira por "Verifique seu e-mail" com a expiração ("15 minutos", "1 hora" em `text-foreground font-medium`); reset: `toast.success` + `router.push("/login")`; erro: `toast.error(error.message ?? fallback)` e `return`, form continua montado | login-form.tsx:34-35, 57-115 |

### Settings: tabs em pílula deslizante

| Peça | Classes exatas |
|---|---|
| Container | `div role="tablist" className="flex w-fit flex-wrap items-center gap-1 px-1"` |
| Botão | `button role="tab" aria-selected` com `relative h-8 cursor-pointer rounded-md squircle:rounded-xl corner-squircle px-2.5 text-sm font-medium` (Foglamp, apps/web/src/app/(app)/settings/org/org-settings-client.tsx); ativo `text-foreground` (não `text-primary`), inativo `text-muted-foreground hover:text-foreground hover:transition-colors` (sem `transition-colors` no botão: o fade de 150ms lia como "flick" quando a pílula saltava) |
| Pílula | `motion.span layoutId="settings-tab-bg" initial={false} transition={{ duration: 0.2, ease: ENTRANCE_EASE }} className="absolute inset-0 z-0 rounded-md squircle:rounded-xl corner-squircle bg-muted dark:bg-muted/50"` (`ENTRANCE_EASE = [0.32, 0.72, 0, 1]`, registry/base-vega/lib/motion.ts) |
| Label | `span.relative.z-10.flex.items-center.gap-1.5` + ícone `*Filled` `size-3.5`; o `z-10` evita que o `transform` da pílula pinte sobre o texto do botão de origem durante o voo |

### Card de settings e Save dentro do input

| Peça | Valor | Fonte |
|---|---|---|
| `InputGroup` | `group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md squircle:rounded-xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 ... has-[[data-slot=input-group-control]:focus-visible]:ring-[1.5px] ... dark:bg-input/30` (o anel de foco sobe para o grupo); `InputGroupInput` = `Input` + `flex-1 rounded-none border-0 dark:border-none bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent` | registry/base-vega/ui/input-group.tsx:19, 129 |
| Addon + botão | `align="inline-end"` (`order-last pr-2.5 has-[>button]:-mr-1`) sobrescrito para `pr-1.25`; `Button size="sm" variant="ghost"` (h-7) reduzido para `h-6.5 rounded-sm`, `mr-1`, `dark:hover:bg-muted`; `disabled` quando vazio ou igual ao salvo; `rounded-sm` dentro de `rounded-md` é o nested radius (externo = interno + inset) | input-group.tsx:35 |
| Enter salva / segredo | `<form className="flex items-center gap-2">` em volta do grupo (provider-keys-tab.tsx); chave salva nunca volta ao cliente: `type="password"` com placeholder `"••••••••••••"` e lixeira `size="icon-sm" variant="ghost-destructive"` | |

### Danger zone e confirmação "digite o nome"

`Card className="border-destructive/40" size="sm"` (único card de settings com borda real, somada à sombra) com `CardTitle className="text-destructive"` "Zona de perigo", `CardDescription` e `CardAction className="self-center"` > `Button variant="destructive" size="sm"` + `IconTrashFilled className="mb-px"`. O `destructive` não é vermelho sólido: `bg-destructive/10 shadow-[var(--custom-shadow-destructive)] text-destructive hover:bg-destructive/20` (registry/base-vega/ui/button.tsx:28). Dois níveis de confirmação (org-settings-client.tsx:438-498):

| Nível | Quando | `AlertDialog` |
|---|---|---|
| Simples | reversível ou barato (revogar chave, remover membro, revogar convite) | título "Revogar chave?", descrição `"{name}" vai parar de funcionar na hora.`, `AlertDialogCancel` (ghost por default) + `AlertDialogAction variant="destructive" disabled={isPending}` |
| Digite o nome | irreversível e caro (apagar org, apagar projeto) | título `Apagar {orgName}?`; `Field > FieldLabel` "Digite `<span className="font-medium text-foreground">{orgName}</span>` para confirmar" + `Input value={confirm} placeholder={orgName} autoComplete="off" autoFocus`; `canDelete = confirm.trim() === orgName`; `onOpenChange={(o) => { setOpen(o); if (!o) setConfirm(""); }}` |

Nada some durante a saída: o nome vai para um `useRef` (`lastRevokeName`), ou o alvo (`deleteTarget`) fica setado enquanto um booleano separado (`deleteOpen`) fecha, ou o reset roda em `onOpenChangeComplete` (Base UI), nunca em `onOpenChange`. `AlertDialogContent`: `max-w-xs` no mobile, `sm:max-w-lg`, header centrado no mobile e `text-left` a partir de `sm`, footer `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` (registry/base-vega/ui/alert-dialog.tsx:58, 90).

### Membros e convites

| Peça | Valor |
|---|---|
| Form de convite | `<form>` real (Enter envia) em `flex items-end gap-4`: `Field className="flex-1"` > `FieldLabel` "E-mail" > `Input type="email"`; `Field className="w-46"` > `FieldLabel` "Papel" > `Select` com `SelectTrigger className="w-full"` e `SelectItem` com `IconUserFilled`/`IconShieldFilled className="size-3.5 shrink-0 text-muted-foreground"`; `Button type="submit" className="mb-0.5" disabled={!email.trim() \|\| inviting}` + `IconMailFilled` "Convidar" |
| Linha de membro | `flex items-center justify-between gap-3 border-b border-border/50 py-3 px-1 pr-1.5 last:border-b-0 last:pb-1` (borda real: linha de lista é divisor, não superfície); `Avatar size="xs"` (`size-4.5`, fallback `text-[8px]`, registry/base-vega/ui/avatar.tsx:22,51) com iniciais + `span.text-sm.font-medium` + e-mail `span.text-xs.text-muted-foreground.font-normal.ml-2.5` |
| Papel e remoção | owner `Badge variant="orange"` + `IconCrownFilled` (registry/base-vega/ui/badge.tsx:26); outros em `Select` com `SelectTrigger size="sm"` (h-8) e `disabled` só na linha em atualização; `Button size="icon-sm" variant="ghost-destructive"` + `IconTrashFilled`, oculto para owner |
| Convites pendentes | subtítulo `p.text-sm.font-medium.text-muted-foreground`; `Avatar size="sm"` (`size-6`), e-mail `text-sm`, `Badge variant="secondary"` com o papel, `Button size="sm" variant="outline"` "Revogar" |

### New project dialog

`Dialog open onOpenChange > DialogContent > DialogHeader > DialogTitle` "Novo projeto" (sem descrição); `Field > FieldLabel` "Nome" > `Input autoFocus placeholder="Meu projeto"`; `Field > FieldLabel className="gap-1.5"` "URL" + `<span className="text-muted-foreground font-normal">(opcional)</span>` > `Input placeholder="exemplo.com"`; footer `Button` "Criar" `disabled={!name.trim() || create.isPending}`. Sucesso: `invalidateQueries` da lista **antes** de selecionar o novo id, fecha, limpa, `toast.success("Projeto criado")`. O sufixo "(opcional)" em `font-normal text-muted-foreground` dentro do `FieldLabel` é o padrão para campo opcional; a mesma técnica dá a unidade (`Threshold <span className="text-muted-foreground/50">{unit}</span>`).

## Do guia: 07. Dialogs e wizards

### Configuração que vira UI

Ícone, cor, unidade, placeholder e ordem de cada opção vivem num `.ts` sem JSX (`alert-config.ts`, `preset-meta.ts`), importado pela lista, pelo dialog de criação, pelo de edição e pelo detalhe: o badge de um item tem a mesma cor em todo lugar. Forma: `META: Record<Kind, { label, icon, badgeVariant, unit, placeholder }>` + opções `{ value, symbol, label }` (o `symbol` vai no trigger fechado, o `label` só na lista) + conversões puras (`thresholdToInput` multiplica por 100 em métrica de taxa, `thresholdFromInput` divide). Opções aposentadas continuam renderizáveis e editáveis com `<Badge variant="secondary">Legacy</Badge>` ao lado do rótulo no select de edição. Famílias de check (preset-meta.ts:51-78), chip no molde do tile da nav:

| Família | Chip (`FAMILY_CHIP`) | Badge |
|---|---|---|
| custom | `bg-orange-100 dark:bg-orange-950 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.14),0_2px_6px_-2px_rgba(249,115,22,0.25)] dark:shadow-(--custom-shadow)` | `orange` (Foglamp, apps/web/src/app/(app)/evals/preset-meta.ts) |
| safety / format / match | mesma receita em rose `244,63,94` / sky `14,165,233` / violet `139,92,246` | `rose` / `blue` / `violet` |
| quality / grounding / tool | fuchsia `217,70,239` / emerald `16,185,129` / amber `245,158,11` | `fuchsia` / `emerald` / `amber` |

### Dialog pequeno de criação

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

### Dialog grande: seções, faixa de status e histórico

- `gap-0 overflow-hidden p-0` anula o `gap-6 p-6` do popup; cada zona repõe o próprio padding (`p-6` no header e footer, `py-6` + `px-6` nos filhos do form). Os `Separator` (`bg-border/70`, `dark:bg-border/40` para discrição no escuro, registry/base-vega/ui/separator.tsx:19) vão de borda a borda e o scroll não vaza pelos cantos. Corpo em `h-[min(40rem,calc(100vh-16rem))]`: 640px no máximo ou a viewport menos 16rem; header e footer fixos.
- Salvar fora do `<form>`, no footer, ligado por `form="alert-details-form"`: `Button variant="ghost"` "Cancelar" + `type="submit"` "Salvar" `disabled={update.isPending}`.
- Faixa de status: `<dl className="flex items-center gap-6 px-6">` com colunas `flex flex-1 flex-col gap-1` separadas por `<Separator orientation="vertical" className="dark:bg-border/40" />`; `dt` `text-sm font-medium`, `dd` `tabular-nums text-muted-foreground` com `title={formatDateTime(...)}` e `formatRelative`; a coluna do `Switch id size="sm"` (`h-3.5 w-6`, thumb `size-2.5`, registry/base-vega/ui/switch.tsx:21,28) usa `gap-2.5` e o `dt` é `<label htmlFor>`.
- Formulário `FieldGroup className="gap-5 px-6"`; linha de três em `grid grid-cols-[1fr_auto_16.5rem] items-end gap-3`; nome gerado pelo servidor com `Button type="button" variant="secondary" size="xs" className="w-fit"` "Usar nome automático" quando editado à mão.
- Histórico: query com `enabled: open` e `refetchInterval: open ? 60_000 : false`; carregando `<div className="flex justify-center py-8"><Spinner /></div>`; vazio `<Empty className="p-8 py-10">` + `EmptyMedia variant="icon"`; lista `ul.flex.flex-col.gap-3.text-sm` > `li.flex.flex-col.gap-1.5` com `Badge variant="rose" | "emerald"` + `span.truncate.text-muted-foreground` + hora `shrink-0 text-xs text-muted-foreground` à direita e diagnóstico em `rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground`.
- Montagem: só existe com `selectedAlert`, `key={id}` reinicia o draft; `onOpenChange` fecha e `onOpenChangeComplete={(next) => { if (!next) setSelectedId(null); }}` desmonta depois da saída.

### Wizard de 3 passos

- `block w-auto … sm:max-w-none` tira o `grid w-full sm:max-w-md` do primitivo; a largura é do `motion.div`: 460 (passo 1), 800 (grade de cards), 600 (passo 3), spring `MORPH = { type: "spring", stiffness: 400, damping: 38 }` (registry/base-vega/lib/motion.ts). Troca de passo é fade de 180ms, sem slide; `Enter` avança respeitando `nextDisabled`.
- `AutoHeight` (evals-client.tsx:190-229) mede o filho com `ResizeObserver` e anima `height` com `MORPH`; primeira medição "snapped" (não anima na abertura); mede `offsetHeight`, não `getBoundingClientRect` (o dialog abre com `zoom-in` e o rect sairia escalado); o padding `px-6 py-1.5` fica no filho medido para o `overflow-hidden` ter folga para o focus ring.
- Passo 1: `Select` cujo valor fechado é `<Icon className="size-4 text-muted-foreground" />{label} <span className="text-muted-foreground">· {description}</span>` e cujo item aberto tem duas linhas (`span.flex.flex-col` com `text-xs text-muted-foreground`); `Combobox` de digitação livre com `ComboboxInput className="w-full"`, ícone do item escolhido em `InputGroupAddon align="inline-start"`, `ComboboxEmpty`.
- Passo 2: `ScrollFade className="max-h-[55vh]" fromClassName="from-popover"` (dentro de dialog o fade é cor de popover, registry/base-vega/components/scroll-fade.tsx:23) > grupos `flex flex-col gap-2` com `p.text-sm.font-medium.text-muted-foreground` e `grid grid-cols-2 gap-2`. Card de preset (Foglamp, apps/web/src/app/(app)/evals/evals-client.tsx): `button type="button" data-selected` com `group flex cursor-pointer items-start gap-3 rounded-lg squircle:rounded-3xl corner-squircle border border-border/60 p-3 text-left transition-colors hover:bg-muted/50 data-[selected=true]:border-primary/5 data-[selected=true]:bg-primary/5 dark:data-[selected=true]:bg-primary/10`; ícone `size-6 shrink-0 rounded-md squircle:rounded-xl corner-squircle p-1` + `FAMILY_CHIP`; nome `text-sm font-medium leading-none`, descrição `truncate text-xs leading-snug text-muted-foreground`.
- Passo 3: preflight em duas intensidades: bloqueio `<Alert variant="destructive" className="-mt-2 mb-4">` (`bg-card`, só texto e ícone tingidos, registry/base-vega/ui/alert.tsx:9-15); aviso `p.-mt-2.mb-4.flex.items-center.gap-1.5.text-xs.text-amber-600.dark:text-amber-400` + `IconAlertTriangle className="size-3.5 shrink-0"` ("advisory: uma linha discreta, não um banner"). Depois o bloco de campos compartilhado com o dialog de edição (`sm:max-w-xl`), controlado por props e devolvendo patches por `onChange`; validadores puros travam o botão nos dois lugares com a mesma regra, sem mensagem de submit.

### Segmented

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

### Listas com badge de status

| Peça | Valor |
|---|---|
| Tabela | `<Table className="table-fixed min-w-5xl" stickyHeader>` em `div.flex.flex-col.-mt-2`, dentro de `TooltipProvider delay={150}`; linha pausada `TableRow className={cn(!r.enabled && "opacity-60")}` |
| Condição | `<Badge variant={META.badgeVariant} className="min-w-0 max-w-full"><Icon /><span className="min-w-0 truncate">{label}</span></Badge>` + `<span className="shrink-0 tabular-nums"><span className="text-muted-foreground mr-1.5 ml-1">{símbolo}</span>{valor}</span>` |
| Nome em duas linhas | `h-16`: `span.truncate.text-[14px]` + `div.flex.min-w-0.items-center.gap-1.text-xs` tingido com `FAMILY_ICON` e `Icon className="size-3 shrink-0 mb-px"`; alerta na linha é ícone outline + `fill-current/20` em `text-destructive`, `size-3.5`, com `title` e `aria-label` (ou `Tooltip side="bottom"`) |
| Taxa colorida | `>= 0.9` `text-emerald-600 dark:text-emerald-400`, `< 0.5` `text-rose-600 dark:text-rose-400`, entre os dois sem cor; nulo `sem dado` em `text-muted-foreground/50` (regra do lume; o Foglamp usa `/40` com travessão) |
| Ações | `TableCell align="center"` > `div.flex.items-center.justify-center.gap-1` com `Button size="icon-sm" className="size-7"` `variant="ghost"` + `IconPencilFilled` e `variant="ghost-destructive"` + `IconTrashFilled`, ambos com `aria-label`; `Switch size="sm"` por linha com `onClick={(e) => e.stopPropagation()}` e `disabled` só na linha cuja mutation está em voo (`update.variables?.id === r.id`) |
| Status em histórico | `Badge variant="rose"` fired / `"emerald"` resolved (`h-5 px-2 text-xs`, sombra `--custom-shadow-rose` / `-emerald`, registry/base-vega/ui/badge.tsx:28-30,42) |

### Confirmação de delete

`AlertDialog open={deleteTarget !== null}`, título `Apagar {name}?`, descrição dizendo que não dá para desfazer, `AlertDialogCancel` (ghost) + `AlertDialogAction variant="destructive" disabled={isPending}` "Apagar". Um `useRef` `lastDeleteTarget` guarda o último alvo para o nome não sumir do título enquanto o dialog anima fechando (`deleteTarget` é zerado na hora). Conteúdo `max-w-xs` no mobile, `sm:max-w-lg` (registry/base-vega/ui/alert-dialog.tsx:58). Botão de criar: `<IconPlus strokeWidth={2.4} />` + texto no `trailing` da Toolbar; sem nenhum item vai para dentro do `EmptyState` com `className="mt-2"`, porque é mais descobrível ali.
