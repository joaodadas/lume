# Adotar o lume num projeto que já existe

Origem: decisão de 04/11/2026 (ver [DECISOES](../DECISOES.md)) e o caso do CRM da Lyx, que instalou o lume só no shell e repintou os componentes antigos por dentro: de longe parecia lume, de perto não. Este guia substitui o roteiro de migração da 52W em oito passos, que mantinha os dois sistemas convivendo por um tempo.

<!-- skill:start -->
- Projeto que já existe adota o lume **de uma vez**. O lume substitui a interface antiga, não convive com ela: nada de pasta paralela (`components/lume/ui`, `components/ds`), nada de alias desviado no `components.json`, nada de componente antigo com a API antiga e "a receita do lume por dentro".
- O caminho é o comando único de [comando-unico](./comando-unico.md): `npx -y @joao.dadas/lume@latest init`, seguido pelo agente até o fim. Ele instala a base, todos os componentes e a skill, com `--overwrite`, lista o que sobrou do sistema antigo e só termina quando o `lume check` passa.
- A API muda, e as telas são reescritas para a API do lume na mesma mudança: `variant="primary"` vira o `default`, `Modal` vira `Dialog`, `icon={X}` vira o ícone como filho, `asChild` vira `render`. A mudança fica grande, e é isso: metade migrada é o que dá a cara errada.
- O que é do produto e não existe no lume (um kanban, um editor, um bloco de domínio) mora em `components/app`, composto com os primitivos do lume. `components/ui` só tem item da registry.
- Sai junto, na mesma mudança: tokens e cores próprios do CSS global, outro `@theme inline` e outro `@layer base`, classes utilitárias próprias (`.btn`, `.card`, `.page-header`...), `lucide-react`, `radix-ui` e `@radix-ui/*`, fonte por `next/font/google` ou por outro pacote (`inter-ui`), e o `data-theme` setado à mão (vira `next-themes` com `attribute="class"`). Não existe camada de aliases temporária.
- O layout é escolha do produto: `layout="sidebar"` (trilho de ícones ou `collapsible="offcanvas"`) ou `layout="topbar"`. O `init` pergunta e grava no `lume.json`.
<!-- skill:end -->

## O que o agente troca no código

<!-- skill:start -->
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
<!-- skill:end -->

## Ícones: Lucide para Tabler

Tabler usa classe para tamanho (`className="size-4"`, nunca `size={16} strokeWidth={1.75}`) e tem variante `Filled` para a maioria; a regra do lume é filled quando existe, par outline e filled na nav. Os mais usados nos fronts da Lyx:

<!-- skill:start -->
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
<!-- skill:end -->

Nome fora da tabela: procure em tabler.io/icons; sem `Filled`, passe só `icon` no item da nav (sem `activeIcon`).

## Depois do `init`

- `lume check` sem violação é a definição de pronto. As violações dizem arquivo, linha e o que fazer.
- Lint e cobertura do projeto: trate `components/ui` e os blocos instalados como código da registry. Tire do lint de tamanho e da cobertura, como se faz com código gerado; o `lume check` é quem confere esses arquivos.
- Exceção de verdade, numa linha de código: comentário `lume:excecao motivo=<o porquê>` na linha ou na de cima. Componente do produto que precisa ficar em `components/ui`: `extras` no `lume.json`, com o motivo. As duas ficam no diff e passam pela revisão.

## O que não copiar do sistema antigo

- Cabeçalho de página com `border-bottom` e `backdrop-filter`: o `PageHeader` do lume não tem borda nem glass.
- Sidebar com `border-right`: o `Sidebar variant="inset"` não tem borda, o inset tem sombra.
- Card com faixa de cabeçalho e linha embaixo: o `Card` do lume não tem linha entre o cabeçalho e o conteúdo.
- `--shadow-md` e `--shadow-lg` como profundidade: a sombra é uma só, `--custom-shadow`.
- `--color-primary: var(--accent)` com a cor da marca: a Lyx usa o tema clássico, sem teal.
- `font-weight: 700` nos títulos e título de página maior que `text-base`: `font-medium` é o peso máximo no app.
- `.btn` com `border-radius: var(--radius)`: botão é pílula.
- `--color-chart-1: var(--accent)`: `--chart-1` a `--chart-5` são cinzas, e cor em gráfico é dado.
