// Código de uso de cada seção da vitrine /componentes, mostrado na aba Código. Os imports são os do projeto que instala (components/ui), não os da registry. Arquivo do site.

export const SNIPPETS: Record<string, string> = {
  botao: `import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

<Button>Salvar</Button>
<Button variant="secondary">
  <IconPlus strokeWidth={2.4} />
  Criar chave
</Button>
<Button variant="outline" size="sm">Filtro</Button>
<Button variant="ghost" size="icon-sm" aria-label="Adicionar">
  <IconPlus />
</Button>
<Button variant="ghost-destructive">Excluir</Button>`,

  badge: `import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

<Badge variant="emerald">
  <IconCircleCheckFilled />
  Ok
</Badge>
<Badge variant="rose" size="sm">Erro</Badge>
<Badge variant="outline">Rascunho</Badge>`,

  alerta: `import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert>
  <IconInfoCircle />
  <AlertTitle>Atenção</AlertTitle>
  <AlertDescription>Você pode configurar os alertas nas preferências.</AlertDescription>
</Alert>
<Alert variant="destructive">
  <IconInfoCircle />
  <AlertTitle>Algo deu errado</AlertTitle>
  <AlertDescription>Tente enviar de novo.</AlertDescription>
</Alert>`,

  avatar: `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

<Avatar size="sm">
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge />
</Avatar>
<AvatarGroup>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>`,

  input: `import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

<Input type="email" autoComplete="email" placeholder="email@exemplo.com" />
<Input aria-invalid placeholder="Inválido" />
<Textarea placeholder="Escreva sua mensagem aqui." />
<InputGroup>
  <InputGroupAddon>
    <IconSearch />
  </InputGroupAddon>
  <InputGroupInput placeholder="Buscar" />
</InputGroup>`,

  field: `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

<Field data-invalid={!!erro}>
  <FieldLabel htmlFor="email">E-mail</FieldLabel>
  <Input id="email" type="email" autoComplete="email" aria-invalid={!!erro} />
  <FieldDescription>Nunca compartilhamos seu e-mail.</FieldDescription>
  {erro && <FieldError>{erro}</FieldError>}
</Field>

<Field orientation="horizontal">
  <Switch id="aviao" />
  <FieldLabel htmlFor="aviao">Modo avião</FieldLabel>
</Field>`,

  select: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select defaultValue="maca">
  <SelectTrigger size="sm" className="w-44">
    <SelectValue placeholder="Escolha uma fruta" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="maca">Maçã</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`,

  "native-select": `import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

<NativeSelect size="sm" defaultValue="maca">
  <NativeSelectOption value="maca">Maçã</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelect>`,

  combobox: `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

<Combobox items={frutas}>
  <ComboboxInput placeholder="Buscar fruta" />
  <ComboboxContent>
    <ComboboxList>
      {(item: string) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
    <ComboboxEmpty>Nenhuma fruta encontrada.</ComboboxEmpty>
  </ComboboxContent>
</Combobox>`,

  "combobox-busca": `import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";

<Combobox items={modelos} defaultValue={null}>
  <ComboboxTrigger
    render={<Button variant="outline" className="w-56 justify-between font-normal" />}
  >
    <ComboboxValue placeholder="Escolha um modelo" />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxInput showTrigger={false} placeholder="Buscar modelo" />
    <ComboboxEmpty>Nenhum modelo encontrado.</ComboboxEmpty>
    <ComboboxList>
      {(item: string) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,

  "multi-select": `import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

const anchor = useComboboxAnchor();

<Combobox multiple items={modelos} defaultValue={["gpt-5"]}>
  <ComboboxChips ref={anchor} className="w-72">
    <ComboboxValue>
      {(valores: string[]) => (
        <>
          {valores.map((v) => (
            <ComboboxChip key={v}>{v}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Adicionar modelo" />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxEmpty>Nenhum modelo encontrado.</ComboboxEmpty>
    <ComboboxList>
      {(item: string) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,

  toggle: `import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

<Toggle variant="outline" size="sm">Negrito</Toggle>
<ToggleGroup defaultValue={["dia"]} variant="outline">
  <ToggleGroupItem value="dia">Dia</ToggleGroupItem>
  <ToggleGroupItem value="semana">Semana</ToggleGroupItem>
</ToggleGroup>`,

  "checkbox-radio-switch": `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

<div className="flex items-center gap-2">
  <Checkbox id="termos" />
  <Label htmlFor="termos">Aceito os termos</Label>
</div>

<RadioGroup defaultValue="um" className="flex flex-col gap-2">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="um" id="um" />
    <Label htmlFor="um">Opção um</Label>
  </div>
</RadioGroup>

<div className="flex items-center gap-2">
  <Switch id="avisos" size="sm" defaultChecked />
  <Label htmlFor="avisos">Notificações</Label>
</div>`,

  progress: `import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

<Progress value={48} className="w-56">
  <ProgressLabel>Enviando</ProgressLabel>
  <ProgressValue />
</Progress>`,

  loader: `import { TextShimmerLoader } from "@/components/ui/loader";

<TextShimmerLoader text="Pensando" size="sm" />`,

  "skeleton-spinner": `import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

<Skeleton className="h-3 w-20" />
<Skeleton className="size-8 rounded-full squircle:rounded-full" />
<Spinner />`,

  card: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card size="sm">
  <CardHeader className="flex flex-row items-center justify-between gap-4">
    <CardTitle>Custo por modelo</CardTitle>
    <CardDescription>Últimos 30 dias</CardDescription>
  </CardHeader>
  <CardContent className="mt-2">{grafico}</CardContent>
</Card>`,

  tabs: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="visao">
  <TabsList variant="line">
    <TabsTrigger value="visao">Visão geral</TabsTrigger>
    <TabsTrigger value="uso">Uso</TabsTrigger>
  </TabsList>
  <TabsContent value="visao">{visao}</TabsContent>
  <TabsContent value="uso">{uso}</TabsContent>
</Tabs>`,

  accordion: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

<Accordion>
  <AccordionItem value="o-que-e">
    <AccordionTrigger>O que é isto?</AccordionTrigger>
    <AccordionContent>A vitrine de um design system.</AccordionContent>
  </AccordionItem>
</Accordion>`,

  collapsible: `import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

<Collapsible>
  <CollapsibleTrigger render={<Button variant="outline" />}>
    Alternar <IconChevronDown />
  </CollapsibleTrigger>
  <CollapsibleContent>{conteudo}</CollapsibleContent>
</Collapsible>`,

  pagination: `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?pagina=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?pagina=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="?pagina=3" /></PaginationItem>
  </PaginationContent>
</Pagination>`,

  overlays: `import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const [aberto, setAberto] = useState(false);

<Dialog open={aberto} onOpenChange={setAberto}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogDescription>Salve quando terminar.</DialogDescription>
    </DialogHeader>
    {campos}
    <DialogFooter>
      <Button>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  "hover-card": `import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

<HoverCard>
  <HoverCardTrigger render={<Button variant="link" />}>@joaodadas</HoverCardTrigger>
  <HoverCardContent className="w-60 text-sm">{perfil}</HoverCardContent>
</HoverCard>`,

  command: `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

<Command className="shadow-(--custom-shadow)">
  <CommandInput placeholder="Buscar comando" />
  <CommandList>
    <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>
    <CommandGroup heading="Navegar">
      <CommandItem>Traces</CommandItem>
      <CommandItem>
        Configurações
        <CommandShortcut>⌘,</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,

  empty: `import { IconSearch } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

<Empty className="border border-dashed">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <IconSearch className="opacity-40" />
    </EmptyMedia>
    <EmptyContent>
      <EmptyTitle>Nenhum resultado</EmptyTitle>
      <EmptyDescription>Tente uma busca diferente.</EmptyDescription>
    </EmptyContent>
  </EmptyHeader>
</Empty>`,

  calendar: `import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

<Calendar mode="single" selected={data} onSelect={setData} locale={ptBR} />
<Calendar mode="range" numberOfMonths={2} selected={periodo} onSelect={setPeriodo} locale={ptBR} />`,

  "date-picker": `import { IconCalendarFilled } from "@tabler/icons-react";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatRangeLabel } from "@/lib/range";

const [data, setData] = useState<Date>();

<Popover>
  <PopoverTrigger render={<Button variant="outline" className="w-56 justify-start font-normal" />}>
    <IconCalendarFilled />
    {data ? formatRangeLabel(data, data) : "Escolha uma data"}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar mode="single" selected={data} onSelect={setData} locale={ptBR} />
  </PopoverContent>
</Popover>`,

  periodo: `import { IconCalendarFilled } from "@tabler/icons-react";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatRangeLabel } from "@/lib/range";

const [periodo, setPeriodo] = useState<DateRange>();

<Popover>
  <PopoverTrigger render={<Button variant="outline" className="justify-start font-normal" />}>
    <IconCalendarFilled />
    {periodo?.from && periodo.to
      ? formatRangeLabel(periodo.from, periodo.to)
      : "Escolha um período"}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar mode="range" numberOfMonths={2} selected={periodo} onSelect={setPeriodo} locale={ptBR} />
  </PopoverContent>
</Popover>

// Com presets (24h, 7d...) e o período guardado entre telas, use o bloco range-picker.`,

  table: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table className="table-fixed min-w-5xl" stickyHeader>
  <TableHeader>
    <TableRow>
      <TableHead className="w-40">Fatura</TableHead>
      <TableHead align="right" className="w-32">Valor</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow interactive onClick={() => router.push("/faturas/1")}>
      <TableCell className="h-12">FAT-001</TableCell>
      <TableCell align="right">{formatMoney(250, { currency: "BRL" })}</TableCell>
    </TableRow>
  </TableBody>
</Table>`,

  "scroll-area-separator": `import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

<ScrollArea className="h-32">{linhas}</ScrollArea>
<Separator />
<Separator orientation="vertical" />`,

  kbd: `import { Kbd, KbdGroup } from "@/components/ui/kbd";

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`,

  sidebar: `import { IconHome } from "@tabler/icons-react";
import { Link } from "@/components/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

<Sidebar variant="inset">
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive render={<Link href="/" />}>
              <IconHome />
              <span>Início</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>`,

  sonner: `import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Um <Toaster /> no layout raiz.
<Button variant="outline" onClick={() => toast.success("Perfil atualizado")}>
  Salvar
</Button>
toast.error(error.message, { action: { label: "tentar de novo", onClick: retry } });`,
};
