# 06. Formulários, auth e settings

Origem: mapa cap. 12. Cobre o shell das telas de auth e o tile da marca, os botões de login, o formulário canônico com valores exatos (e o equivalente em React Hook Form), o `login-form` do lume ligado ao Better Auth, a área de settings (tabs em pílula, save dentro do input, danger zone, membros e convites) e o dialog de novo projeto. Itens: `field`, `label`, `input`, `input-group`, `select`, `switch`, `avatar`, `badge`, `card`, `dialog`, `alert-dialog`, `sonner`, `use-copied`, `copy-icon` e o bloco `login-form`, agrupados em `kit-formulario` e `kit-feedback`. Instale com `npx shadcn@latest add joaodadas/lume/kit-formulario#v0.1.0` e `npx shadcn@latest add joaodadas/lume/kit-feedback#v0.1.0`. Caminhos sem prefixo `registry/` são do Foglamp (`apps/web/src/...`).

## Dois idiomas de formulário

**Auth** usa `@tanstack/react-form` + Zod em `validators.onSubmit` + `form.Subscribe` para o botão (os únicos dois `useForm(` do app: `components/login-form.tsx` e `app/reset-password/reset-password-form.tsx`). **Settings e dialogs** usam `useState` por campo + `useMutation`, botão travado por `!name.trim() || mutation.isPending`, sem Zod no cliente: a validação é a do servidor e o erro vira `toast.error` (9 arquivos). Convivem porque o layout é o mesmo: label em cima, controle embaixo, erro pequeno em vermelho, botão primário cheio (auth) ou à direita (dialogs). No lume a lib é livre (TanStack Form ou React Hook Form) desde que o campo seja o da registry (`docs/DECISOES.md`, 2026-10-15).

## Shell de auth e tile da marca

<!-- skill:start -->
| Peça | Classes exatas | Fonte |
|---|---|---|
| Wrapper da rota (`page.tsx`, server) | `flex min-h-svh items-center justify-center` (`min-h-svh`, nunca `100vh`) | app/login/page.tsx:23 |
| Coluna do formulário / de resultado | `mx-auto flex w-full max-w-lg flex-col p-6` (512px, sem `Card`, sombra ou borda: a página inteira é o formulário); resultado ("Verifique seu e-mail") com `gap-4` | registry/base-vega/blocks/login-form/login-form.tsx |
| Tile da marca | `size-10 rounded-md squircle:rounded-2xl corner-squircle bg-muted shadow-(--custom-shadow) flex justify-center items-center` com a marca em `w-7` (`BrandTile` no bloco) | login-form.tsx:185-187 |
| Título / subtítulo | `mt-5 mb-1 w-full text-start text-lg font-medium text-balance` / `mb-6 text-sm text-muted-foreground tracking-normal`; título de resultado `text-xl font-medium text-balance` em `mt-5 flex flex-col gap-2` | login-form.tsx:188-191, 160 |
| Dado variável no parágrafo | `<span className="font-medium text-foreground">{email}</span>` dentro de `text-sm text-muted-foreground`; texto sempre `text-start`, nunca centralizado | login-form.tsx:132 |
| Ícones de status (device) | `IconCircleCheckFilled size-5 text-green-500` aprovado; `IconCircleXFilled size-5 text-muted-foreground` negado (neutro, não erro); `text-destructive` só em falha | device-approve-client.tsx:123-153 |
<!-- skill:end -->

## Botões de login

<!-- skill:start -->
| Método | Controle | Label / espera |
|---|---|---|
| Google | `Button type="button" variant="secondary" className="w-full"` + ícone `size-3.5` (no Foglamp leva `mr-0.75`, única margem em ícone de botão do app; o `Button` já dá `gap-[5.5px]`) | "Entrar com Google" / "Redirecionando…" com `disabled` |
| Separador | `div.my-5.flex.items-center.gap-3` com duas linhas `h-px flex-1 bg-border/50` e `span.text-xs.text-muted-foreground/60` "ou"; só com Google e um form de e-mail, nunca no modo forgot | |
| Senha / esqueci / link mágico | forms `flex w-full flex-col gap-5` (`gap-6` com um campo só); submit `Button type="submit" className="w-full mt-2"` / `"w-full mt-1"` / `"w-full"` | "Entrar" / "Entrando…", "Enviar link de redefinição" / "Enviando…", "Enviar link mágico" / "Enviando…" |
| Voltar e trocar de modo | `Button variant="link" className="self-start px-0 text-muted-foreground/50"` (forgot) e `className="mt-4 self-start px-0 text-muted-foreground/50 hover:text-foreground"` (só quando senha e link mágico existem) | "Voltar para o login", "Prefiro receber um link por e-mail" / "Prefiro usar e-mail e senha" |
| "Esqueci a senha" | `<button type="button" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">` à direita do label Senha, em `div.flex.items-center.justify-between` | |
<!-- skill:end -->
Hierarquia: o primário (`bg-neutral-800 dark:bg-neutral-100 shadow-[var(--custom-shadow-primary)]`, registry/base-vega/ui/button.tsx:15) é sempre o submit do form de e-mail; Google é `secondary`; navegação lateral é `variant="link"` (`underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground`, button.tsx:31) rebaixada com `text-muted-foreground/50`. Nenhum botão de auth gira spinner: a espera é o label trocado + `disabled`. Modo inicial: `methods.password ? "password" : "magic"`.

## Formulário canônico

Render de um campo com TanStack Form (login-form.tsx:229-245); o `<form>` faz `e.preventDefault(); e.stopPropagation(); form.handleSubmit();` e o submit lê `form.Subscribe` com `{ canSubmit, isSubmitting }`:

```tsx
<passwordForm.Field name="email">
  {(field) => (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={field.name}>E-mail</Label>
      <Input id={field.name} name={field.name} type="email" autoComplete="email" placeholder="voce@exemplo.com"
        value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
      {field.state.meta.errors.map((error) => (
        <p key={error?.message} className="text-xs text-destructive">{error?.message}</p>
      ))}
    </div>
  )}
</passwordForm.Field>
```

<!-- skill:start -->
| Peça | Valor exato | Fonte |
|---|---|---|
| Wrapper do campo | `flex flex-col gap-2.5` (10px) em auth; em dialogs e cards é `Field` (`group/field flex w-full gap-3 data-[invalid=true]:text-destructive`, vertical `flex-col *:w-full`) + `FieldLabel` | login-form.tsx:229; registry/base-vega/ui/field.tsx:57-61 |
| `Label` | `flex items-center gap-2 text-sm leading-none font-medium select-none` | registry/base-vega/ui/label.tsx:14 |
| `Input` | `h-9 w-full min-w-0 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 bg-transparent px-2.5 py-1 text-base hover:dark:border-border/70 ... placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring/50 ... aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30` (sombra no light, hairline no dark, `text-base` abaixo de `md` contra o zoom do iOS) | registry/base-vega/ui/input.tsx:14 |
| Erro | `<p className="text-xs text-destructive">` por erro (auth) ou `Field data-invalid` + `Input aria-invalid` + `FieldError` (`text-sm font-normal text-destructive`, só renderiza com conteúdo) em dialogs | login-form.tsx:241-245; field.tsx:221 |
| Placeholder de senha / `autoComplete` | `"••••••••"`; `email`, `current-password`, `new-password` | login-form.tsx:267-268 |
| Schemas | `z.object({ email: z.email("..."), password: z.string().min(1, "...") })`; reset `z.object({ password: z.string().min(8), confirm: z.string() }).refine((v) => v.password === v.confirm, { path: ["confirm"] })`; `z.email()` top-level é Zod 4; validação só no submit, botão habilitado até a primeira tentativa | login-form.tsx:76-81 |
| Pós-sucesso | senha: `window.location.href = callbackUrl` (navegação hard para o gate de SSR reler o cookie; `router.push` não serve); magic e forgot: troca a tela inteira por "Verifique seu e-mail" com a expiração ("15 minutos", "1 hora" em `text-foreground font-medium`); reset: `toast.success` + `router.push("/login")`; erro: `toast.error(error.message ?? fallback)` e `return`, form continua montado | login-form.tsx:34-35, 57-115 |
<!-- skill:end -->

O mesmo campo em React Hook Form (adição do lume; o campo continua sendo o da registry):

```tsx
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: "onSubmit" });
<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
  <div className="flex flex-col gap-2.5">
    <Label htmlFor="email">E-mail</Label>
    <Input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com"
      aria-invalid={!!form.formState.errors.email || undefined} {...form.register("email")} />
    {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
  </div>
  <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
    {form.formState.isSubmitting ? "Entrando…" : "Entrar"}
  </Button>
</form>
```

## `login-form` do lume e Better Auth

O bloco (registry/base-vega/blocks/login-form/login-form.tsx) é presentacional: saíram `@tanstack/react-form`, `better-auth`, `env`, `toast` e `GoogleLogo`; entraram `methods` (`{ password, magicLink, google }`), os callbacks `onPassword(email, password)`, `onMagicLink(email)`, `onForgot(email)`, `onGoogle()`, `brand` e `googleIcon` como `ReactNode`, `pending` e `error` vindos de fora, `zod.safeParse` no submit e erros em `Field` + `FieldError className="text-xs"`. Callback que rejeita mantém o form na tela com a mensagem (o `toast.error` + `return` do original); callback que resolve avança para "Verifique seu e-mail". Better Auth devolve `{ data, error }` em vez de lançar, então o adaptador lança (adição do lume):

```tsx
const callbackURL = `${env.NEXT_PUBLIC_APP_URL}${sanitizeNext(next) ?? "/overview"}`; // só "/..." e nunca "//": sem open redirect
const unwrap = async <T,>(p: Promise<{ error?: { message?: string } | null } & T>) => {
  const r = await p; if (r.error) throw new Error(r.error.message ?? "Não foi possível entrar."); return r;
};
<LoginForm brand={<BrandMark className="w-7" />} methods={methods}
  onPassword={async (email, password) => { await unwrap(authClient.signIn.email({ email, password, callbackURL })); window.location.href = callbackURL; }}
  onMagicLink={(email) => unwrap(authClient.signIn.magicLink({ email, callbackURL }))}
  onForgot={(email) => unwrap(authClient.requestPasswordReset({ email, redirectTo: "/reset-password" }))}
  onGoogle={() => authClient.signIn.social({ provider: "google", callbackURL })} />
```

`signIn.magicLink` exige o plugin `magicLinkClient()` no `createAuthClient`; `requestPasswordReset` chamava-se `forgetPassword` antes do Better Auth 1.3. Navegação hard depois de entrar, aceitar convite ou apagar org é regra, não estilo.

## Settings: tabs em pílula deslizante

`/settings/org` não usa o primitivo `Tabs`: é uma linha de botões com uma pílula compartilhada por `layoutId` (org-settings-client.tsx:134-190). Header `RouteHeader noIcon` (título simples, sem tile de nav); corpo `div.flex.flex-col.gap-6.px-6`; ids das tabs em `?tab=` trocados com `router.replace(..., { scroll: false })`.

<!-- skill:start -->
| Peça | Classes exatas |
|---|---|
| Container | `div role="tablist" className="flex w-fit flex-wrap items-center gap-1 px-1"` |
| Botão | `button role="tab" aria-selected` com `relative h-8 cursor-pointer rounded-md squircle:rounded-xl corner-squircle px-2.5 text-sm font-medium` (Foglamp, apps/web/src/app/(app)/settings/org/org-settings-client.tsx); ativo `text-foreground` (não `text-primary`), inativo `text-muted-foreground hover:text-foreground hover:transition-colors` (sem `transition-colors` no botão: o fade de 150ms lia como "flick" quando a pílula saltava) |
| Pílula | `motion.span layoutId="settings-tab-bg" initial={false} transition={{ duration: 0.2, ease: ENTRANCE_EASE }} className="absolute inset-0 z-0 rounded-md squircle:rounded-xl corner-squircle bg-muted dark:bg-muted/50"` (`ENTRANCE_EASE = [0.32, 0.72, 0, 1]`, registry/base-vega/lib/motion.ts) |
| Label | `span.relative.z-10.flex.items-center.gap-1.5` + ícone `*Filled` `size-3.5`; o `z-10` evita que o `transform` da pílula pinte sobre o texto do botão de origem durante o voo |
<!-- skill:end -->

## Card de settings e Save dentro do input

Toda tab é um ou mais `Card size="sm"` (`gap-2 py-5`, `px-5` no header, `CardTitle` em `text-sm`, registry/base-vega/ui/card.tsx:17-43) com `CardTitle` + `CardDescription` e, com botão no canto, `CardAction className="self-center"` (o header vira `grid-cols-[1fr_auto]`). Edição inline (org-settings-client.tsx:340-359, 4 ocorrências no Foglamp):

```tsx
<Field>
  <FieldLabel>Nome</FieldLabel>
  <InputGroup className="max-w-sm">
    <InputGroupInput value={name} onChange={(e) => setName(e.target.value)} />
    <InputGroupAddon align="inline-end" className="pr-1.25">
      <Button size="sm" variant="ghost" className="mr-1 h-6.5 rounded-sm dark:hover:bg-muted"
        disabled={!name.trim() || name === saved} onClick={save}>Salvar</Button>
    </InputGroupAddon>
  </InputGroup>
</Field>
```

<!-- skill:start -->
| Peça | Valor | Fonte |
|---|---|---|
| `InputGroup` | `group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md squircle:rounded-xl corner-squircle shadow-(--custom-shadow) dark:shadow-none dark:border-[0.5px] dark:border-border/50 ... has-[[data-slot=input-group-control]:focus-visible]:ring-[1.5px] ... dark:bg-input/30` (o anel de foco sobe para o grupo); `InputGroupInput` = `Input` + `flex-1 rounded-none border-0 dark:border-none bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent` | registry/base-vega/ui/input-group.tsx:19, 129 |
| Addon + botão | `align="inline-end"` (`order-last pr-2.5 has-[>button]:-mr-1`) sobrescrito para `pr-1.25`; `Button size="sm" variant="ghost"` (h-7) reduzido para `h-6.5 rounded-sm`, `mr-1`, `dark:hover:bg-muted`; `disabled` quando vazio ou igual ao salvo; `rounded-sm` dentro de `rounded-md` é o nested radius (externo = interno + inset) | input-group.tsx:35 |
| Enter salva / segredo | `<form className="flex items-center gap-2">` em volta do grupo (provider-keys-tab.tsx); chave salva nunca volta ao cliente: `type="password"` com placeholder `"••••••••••••"` e lixeira `size="icon-sm" variant="ghost-destructive"` | |
<!-- skill:end -->

## Danger zone e confirmação "digite o nome"

<!-- skill:start -->
`Card className="border-destructive/40" size="sm"` (único card de settings com borda real, somada à sombra) com `CardTitle className="text-destructive"` "Zona de perigo", `CardDescription` e `CardAction className="self-center"` > `Button variant="destructive" size="sm"` + `IconTrashFilled className="mb-px"`. O `destructive` não é vermelho sólido: `bg-destructive/10 shadow-[var(--custom-shadow-destructive)] text-destructive hover:bg-destructive/20` (registry/base-vega/ui/button.tsx:28). Dois níveis de confirmação (org-settings-client.tsx:438-498):

| Nível | Quando | `AlertDialog` |
|---|---|---|
| Simples | reversível ou barato (revogar chave, remover membro, revogar convite) | título "Revogar chave?", descrição `"{name}" vai parar de funcionar na hora.`, `AlertDialogCancel` (ghost por default) + `AlertDialogAction variant="destructive" disabled={isPending}` |
| Digite o nome | irreversível e caro (apagar org, apagar projeto) | título `Apagar {orgName}?`; `Field > FieldLabel` "Digite `<span className="font-medium text-foreground">{orgName}</span>` para confirmar" + `Input value={confirm} placeholder={orgName} autoComplete="off" autoFocus`; `canDelete = confirm.trim() === orgName`; `onOpenChange={(o) => { setOpen(o); if (!o) setConfirm(""); }}` |

Nada some durante a saída: o nome vai para um `useRef` (`lastRevokeName`), ou o alvo (`deleteTarget`) fica setado enquanto um booleano separado (`deleteOpen`) fecha, ou o reset roda em `onOpenChangeComplete` (Base UI), nunca em `onOpenChange`. `AlertDialogContent`: `max-w-xs` no mobile, `sm:max-w-lg`, header centrado no mobile e `text-left` a partir de `sm`, footer `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` (registry/base-vega/ui/alert-dialog.tsx:58, 90).
<!-- skill:end -->

## Membros e convites

<!-- skill:start -->
| Peça | Valor |
|---|---|
| Form de convite | `<form>` real (Enter envia) em `flex items-end gap-4`: `Field className="flex-1"` > `FieldLabel` "E-mail" > `Input type="email"`; `Field className="w-46"` > `FieldLabel` "Papel" > `Select` com `SelectTrigger className="w-full"` e `SelectItem` com `IconUserFilled`/`IconShieldFilled className="size-3.5 shrink-0 text-muted-foreground"`; `Button type="submit" className="mb-0.5" disabled={!email.trim() \|\| inviting}` + `IconMailFilled` "Convidar" |
| Linha de membro | `flex items-center justify-between gap-3 border-b border-border/50 py-3 px-1 pr-1.5 last:border-b-0 last:pb-1` (borda real: linha de lista é divisor, não superfície); `Avatar size="xs"` (`size-4.5`, fallback `text-[8px]`, registry/base-vega/ui/avatar.tsx:22,51) com iniciais + `span.text-sm.font-medium` + e-mail `span.text-xs.text-muted-foreground.font-normal.ml-2.5` |
| Papel e remoção | owner `Badge variant="orange"` + `IconCrownFilled` (registry/base-vega/ui/badge.tsx:26); outros em `Select` com `SelectTrigger size="sm"` (h-8) e `disabled` só na linha em atualização; `Button size="icon-sm" variant="ghost-destructive"` + `IconTrashFilled`, oculto para owner |
| Convites pendentes | subtítulo `p.text-sm.font-medium.text-muted-foreground`; `Avatar size="sm"` (`size-6`), e-mail `text-sm`, `Badge variant="secondary"` com o papel, `Button size="sm" variant="outline"` "Revogar" |
<!-- skill:end -->

## New project dialog

<!-- skill:start -->
`Dialog open onOpenChange > DialogContent > DialogHeader > DialogTitle` "Novo projeto" (sem descrição); `Field > FieldLabel` "Nome" > `Input autoFocus placeholder="Meu projeto"`; `Field > FieldLabel className="gap-1.5"` "URL" + `<span className="text-muted-foreground font-normal">(opcional)</span>` > `Input placeholder="exemplo.com"`; footer `Button` "Criar" `disabled={!name.trim() || create.isPending}`. Sucesso: `invalidateQueries` da lista **antes** de selecionar o novo id, fecha, limpa, `toast.success("Projeto criado")`. O sufixo "(opcional)" em `font-normal text-muted-foreground` dentro do `FieldLabel` é o padrão para campo opcional; a mesma técnica dá a unidade (`Threshold <span className="text-muted-foreground/50">{unit}</span>`).
<!-- skill:end -->

## O que não copiar

- Os três tiles de auth divergentes (reset `rounded-lg`, convite sem sombra, inválido `rounded`) e os três visuais de "Voltar para o login": use o tile e o link do bloco `login-form`. `mr-0.75` no ícone do Google: passe o ícone sem margem.
- `useOrgPeople` (membros espelhados em `useState` com `refresh()` manual) e os "Loading…" crus de notifications, usage e invitation: `useQuery` + `Skeleton` atrás de `use-delayed-loading`.
- Lixeira `ghost` em membros e pricing e `IconPlus` outline no header de pricing: padronize em `ghost-destructive` e `IconPlusFilled strokeWidth={2.4}`.
- `toastOptions.classNames.toast = "cn-toast"` (sem CSS no repo), `DevBar`, onboarding com mint silencioso de chave e `AnimatedApiKey` (slot-text, mapa 11.10).
