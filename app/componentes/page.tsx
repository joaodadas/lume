// Vitrine /componentes: grades variants × sizes dos 41 primitivos core do lume. Derivada do components-showcase.tsx do boilerplate (João Vitor Dadas), adaptada para a registry base-vega, ícones Tabler e textos em pt-BR.
"use client";

import {
  IconAlarm,
  IconBell,
  IconChartBar,
  IconChevronDown,
  IconHome,
  IconInfoCircle,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import {
  ComponentSection,
  type ShowcaseSection,
  ShowcaseToc,
  SizeRow,
  VariantColumn,
} from "@/components/showcase-shell";
import { SiteNav } from "@/components/site-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/base-vega/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/base-vega/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/base-vega/ui/alert-dialog";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/base-vega/ui/avatar";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Button } from "@/registry/base-vega/ui/button";
import { Calendar } from "@/registry/base-vega/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";
import { Checkbox } from "@/registry/base-vega/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/base-vega/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/base-vega/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/base-vega/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/base-vega/ui/empty";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/base-vega/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/base-vega/ui/hover-card";
import { Input } from "@/registry/base-vega/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/base-vega/ui/input-group";
import { Kbd, KbdGroup } from "@/registry/base-vega/ui/kbd";
import { Label } from "@/registry/base-vega/ui/label";
import { TextShimmerLoader } from "@/registry/base-vega/ui/loader";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/base-vega/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/base-vega/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/base-vega/ui/popover";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/registry/base-vega/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/base-vega/ui/radio-group";
import { ScrollArea } from "@/registry/base-vega/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/base-vega/ui/select";
import { Separator } from "@/registry/base-vega/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/base-vega/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/base-vega/ui/sidebar";
import { Skeleton } from "@/registry/base-vega/ui/skeleton";
import { Spinner } from "@/registry/base-vega/ui/spinner";
import { Switch } from "@/registry/base-vega/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/base-vega/ui/tabs";
import { Textarea } from "@/registry/base-vega/ui/textarea";
import { Toggle } from "@/registry/base-vega/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/base-vega/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/base-vega/ui/tooltip";

// Listas completas lidas de button.tsx e badge.tsx: a vitrine mostra tudo o
// que o cva aceita, inclusive ghost-destructive e os tamanhos icon.
const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "ghost-destructive",
  "destructive",
  "link",
] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const BUTTON_ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "green",
  "emerald",
  "blue",
  "sky",
  "violet",
  "fuchsia",
  "amber",
  "orange",
  "red",
  "rose",
] as const;
const BADGE_SIZES = ["sm", "md", "lg"] as const;

const FRUTAS = [
  "Abacaxi",
  "Banana",
  "Laranja",
  "Maçã",
  "Morango",
  "Uva",
] as const;

// Datas fixas para o calendário: com Cache Components o Next pré-renderiza o
// client component e barra new Date() / Date.now() na pré-renderização. O
// today também vai fixo para o DayPicker não calcular o dia por conta própria.
const HOJE = new Date(2026, 9, 16);
const INTERVALO = { from: new Date(2026, 9, 6), to: new Date(2026, 9, 26) };

// Chaves estáveis para a lista do scroll area (nada de índice como key).
const LINHAS = Array.from({ length: 20 }, (_, i) => `Linha ${i + 1}`);

// Sumário lateral e ids das seções, na ordem em que aparecem na página.
const SECOES = [
  { id: "botao", nome: "Botão" },
  { id: "badge", nome: "Badge" },
  { id: "alerta", nome: "Alerta" },
  { id: "avatar", nome: "Avatar" },
  { id: "input", nome: "Input" },
  { id: "field", nome: "Field" },
  { id: "select", nome: "Select" },
  { id: "native-select", nome: "Native select" },
  { id: "combobox", nome: "Combobox" },
  { id: "toggle", nome: "Toggle" },
  { id: "checkbox-radio-switch", nome: "Checkbox / Radio / Switch" },
  { id: "progress", nome: "Progress" },
  { id: "loader", nome: "Loader" },
  { id: "skeleton-spinner", nome: "Skeleton / Spinner" },
  { id: "card", nome: "Card" },
  { id: "tabs", nome: "Tabs" },
  { id: "accordion", nome: "Accordion" },
  { id: "collapsible", nome: "Collapsible" },
  { id: "pagination", nome: "Pagination" },
  { id: "overlays", nome: "Overlays" },
  { id: "hover-card", nome: "Hover card" },
  { id: "empty", nome: "Empty" },
  { id: "calendar", nome: "Calendar" },
  { id: "table", nome: "Table" },
  { id: "scroll-area-separator", nome: "Scroll area / Separator" },
  { id: "kbd", nome: "Kbd" },
  { id: "sidebar", nome: "Sidebar" },
  { id: "sonner", nome: "Toast" },
] as const satisfies readonly ShowcaseSection[];

export default function ComponentesPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      <main className="container mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 pb-6">
          <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
            Componentes
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground text-pretty">
            Os 41 primitivos core do lume, em grades de variante por tamanho,
            com as props reais de cada arquivo em registry/base-vega/ui.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[160px_1fr]">
          <aside className="hidden lg:block">
            <ShowcaseToc sections={SECOES} className="sticky top-20" />
          </aside>

          <TooltipProvider>
            <div className="flex min-w-0 flex-col">
              <ComponentSection
                id="botao"
                name="Botão"
                description="Variantes × tamanhos"
              >
                {BUTTON_VARIANTS.map((variant) => (
                  <VariantColumn key={variant} label={variant}>
                    {BUTTON_SIZES.map((size) => (
                      <SizeRow key={size} label={size}>
                        <Button variant={variant} size={size}>
                          Botão
                        </Button>
                      </SizeRow>
                    ))}
                    {BUTTON_ICON_SIZES.map((size) => (
                      <SizeRow key={size} label={size}>
                        <Button
                          variant={variant}
                          size={size}
                          aria-label="Adicionar"
                        >
                          <IconPlus />
                        </Button>
                      </SizeRow>
                    ))}
                  </VariantColumn>
                ))}
              </ComponentSection>

              <ComponentSection
                id="badge"
                name="Badge"
                description="Variantes × tamanhos"
              >
                {BADGE_VARIANTS.map((variant) => (
                  <VariantColumn key={variant} label={variant}>
                    {BADGE_SIZES.map((size) => (
                      <SizeRow key={size} label={size}>
                        <Badge variant={variant} size={size}>
                          Badge
                        </Badge>
                      </SizeRow>
                    ))}
                    <SizeRow label="com ícone">
                      <Badge variant={variant}>
                        <IconAlarm className="stroke-[2.5] mb-px" /> Badge
                      </Badge>
                    </SizeRow>
                  </VariantColumn>
                ))}
              </ComponentSection>

              <ComponentSection id="alerta" name="Alerta">
                <VariantColumn label="default">
                  <Alert>
                    <IconInfoCircle />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      Você pode configurar os alertas nas preferências.
                    </AlertDescription>
                  </Alert>
                </VariantColumn>
                <VariantColumn label="destructive">
                  <Alert variant="destructive">
                    <IconInfoCircle />
                    <AlertTitle>Algo deu errado</AlertTitle>
                    <AlertDescription>Tente enviar de novo.</AlertDescription>
                  </Alert>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="avatar" name="Avatar">
                <VariantColumn label="tamanhos">
                  <SizeRow label="xs">
                    <Avatar size="xs">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </SizeRow>
                  <SizeRow label="sm">
                    <Avatar size="sm">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </SizeRow>
                  <SizeRow label="default">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </SizeRow>
                  <SizeRow label="lg">
                    <Avatar size="lg">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </SizeRow>
                </VariantColumn>
                <VariantColumn label="com badge">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                    <AvatarBadge />
                  </Avatar>
                </VariantColumn>
                <VariantColumn label="grupo">
                  <AvatarGroup>
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+3</AvatarGroupCount>
                  </AvatarGroup>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="input" name="Input">
                <VariantColumn label="default">
                  <Input placeholder="email@exemplo.com" />
                  <Input placeholder="Desabilitado" disabled />
                  <Input placeholder="Inválido" aria-invalid />
                </VariantColumn>
                <VariantColumn label="textarea">
                  <Textarea
                    placeholder="Escreva sua mensagem aqui."
                    className="w-[220px]"
                  />
                </VariantColumn>
                <VariantColumn label="input group">
                  <InputGroup>
                    <InputGroupAddon>
                      <IconSearch />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Buscar…" />
                  </InputGroup>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="field" name="Field">
                <VariantColumn label="vertical" className="min-w-[260px]">
                  <Field className="w-[240px]">
                    <FieldLabel htmlFor="field-email">E-mail</FieldLabel>
                    <Input id="field-email" placeholder="voce@exemplo.com" />
                    <FieldDescription>
                      Nunca compartilhamos seu e-mail.
                    </FieldDescription>
                  </Field>
                </VariantColumn>
                <VariantColumn label="horizontal" className="min-w-[260px]">
                  <Field orientation="horizontal" className="w-[240px]">
                    <Switch id="field-aviao" />
                    <FieldLabel htmlFor="field-aviao">Modo avião</FieldLabel>
                  </Field>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="select" name="Select">
                <VariantColumn label="tamanho default">
                  <Select defaultValue="maca">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Escolha uma fruta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maca">Maçã</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="laranja">Laranja</SelectItem>
                    </SelectContent>
                  </Select>
                </VariantColumn>
                <VariantColumn label="tamanho sm">
                  <Select defaultValue="maca">
                    <SelectTrigger size="sm" className="w-[180px]">
                      <SelectValue placeholder="Escolha uma fruta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maca">Maçã</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="laranja">Laranja</SelectItem>
                    </SelectContent>
                  </Select>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="native-select"
                name="Native select"
                description="<select> nativo com a casca do sistema"
              >
                <VariantColumn label="tamanho default">
                  <NativeSelect defaultValue="maca">
                    <NativeSelectOption value="maca">Maçã</NativeSelectOption>
                    <NativeSelectOption value="banana">
                      Banana
                    </NativeSelectOption>
                    <NativeSelectOption value="laranja">
                      Laranja
                    </NativeSelectOption>
                  </NativeSelect>
                </VariantColumn>
                <VariantColumn label="tamanho sm">
                  <NativeSelect size="sm" defaultValue="maca">
                    <NativeSelectOption value="maca">Maçã</NativeSelectOption>
                    <NativeSelectOption value="banana">
                      Banana
                    </NativeSelectOption>
                    <NativeSelectOption value="laranja">
                      Laranja
                    </NativeSelectOption>
                  </NativeSelect>
                </VariantColumn>
                <VariantColumn label="desabilitado">
                  <NativeSelect defaultValue="maca" disabled>
                    <NativeSelectOption value="maca">Maçã</NativeSelectOption>
                  </NativeSelect>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="combobox"
                name="Combobox"
                description="Select com filtro"
              >
                <VariantColumn label="default" className="min-w-[260px]">
                  <Combobox items={FRUTAS as readonly string[]}>
                    <ComboboxInput
                      placeholder="Buscar fruta…"
                      className="w-[220px]"
                    />
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
                  </Combobox>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="toggle" name="Toggle">
                <VariantColumn label="default">
                  <SizeRow label="sm">
                    <Toggle size="sm">Negrito</Toggle>
                  </SizeRow>
                  <SizeRow label="default">
                    <Toggle>Negrito</Toggle>
                  </SizeRow>
                  <SizeRow label="lg">
                    <Toggle size="lg">Negrito</Toggle>
                  </SizeRow>
                </VariantColumn>
                <VariantColumn label="outline">
                  <SizeRow label="sm">
                    <Toggle variant="outline" size="sm">
                      Negrito
                    </Toggle>
                  </SizeRow>
                  <SizeRow label="default">
                    <Toggle variant="outline">Negrito</Toggle>
                  </SizeRow>
                  <SizeRow label="lg">
                    <Toggle variant="outline" size="lg">
                      Negrito
                    </Toggle>
                  </SizeRow>
                </VariantColumn>
                <VariantColumn label="toggle group">
                  <ToggleGroup defaultValue={["b"]}>
                    <ToggleGroupItem value="a">A</ToggleGroupItem>
                    <ToggleGroupItem value="b">B</ToggleGroupItem>
                    <ToggleGroupItem value="c">C</ToggleGroupItem>
                  </ToggleGroup>
                  <ToggleGroup defaultValue={["b"]} variant="outline">
                    <ToggleGroupItem value="a">A</ToggleGroupItem>
                    <ToggleGroupItem value="b">B</ToggleGroupItem>
                    <ToggleGroupItem value="c">C</ToggleGroupItem>
                  </ToggleGroup>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="checkbox-radio-switch"
                name="Checkbox / Radio / Switch"
              >
                <VariantColumn label="checkbox">
                  <div className="flex items-center gap-2">
                    <Checkbox id="cb-marcado" defaultChecked />
                    <Label htmlFor="cb-marcado">Marcado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="cb-desmarcado" />
                    <Label htmlFor="cb-desmarcado">Desmarcado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="cb-desabilitado" disabled />
                    <Label htmlFor="cb-desabilitado">Desabilitado</Label>
                  </div>
                </VariantColumn>
                <VariantColumn label="radio group">
                  <RadioGroup defaultValue="um" className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="um" id="radio-um" />
                      <Label htmlFor="radio-um">Opção um</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="dois" id="radio-dois" />
                      <Label htmlFor="radio-dois">Opção dois</Label>
                    </div>
                  </RadioGroup>
                </VariantColumn>
                <VariantColumn label="switch">
                  <div className="flex items-center gap-2">
                    <Switch id="sw-ligado" defaultChecked />
                    <Label htmlFor="sw-ligado">Notificações</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="sw-desligado" />
                    <Label htmlFor="sw-desligado">Desligado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="sw-sm-ligado" size="sm" defaultChecked />
                    <Label htmlFor="sw-sm-ligado">Compacto ligado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="sw-sm-desligado" size="sm" />
                    <Label htmlFor="sw-sm-desligado">Compacto desligado</Label>
                  </div>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="progress"
                name="Progress"
                description="Trilha h-1.5 em bg-muted, indicador em bg-primary"
              >
                <VariantColumn label="valores" className="min-w-[260px]">
                  <Progress value={25} className="w-[220px]" />
                  <Progress value={60} className="w-[220px]" />
                  <Progress value={92} className="w-[220px]" />
                </VariantColumn>
                <VariantColumn label="com rótulo" className="min-w-[260px]">
                  <Progress value={48} className="w-[220px]">
                    <ProgressLabel>Enviando</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="loader"
                name="Loader"
                description="TextShimmerLoader: gradiente varrendo o texto"
              >
                <VariantColumn label="tamanhos">
                  <SizeRow label="sm">
                    <TextShimmerLoader text="Pensando" size="sm" />
                  </SizeRow>
                  <SizeRow label="md">
                    <TextShimmerLoader text="Pensando" />
                  </SizeRow>
                  <SizeRow label="lg">
                    <TextShimmerLoader text="Pensando" size="lg" />
                  </SizeRow>
                </VariantColumn>
                <VariantColumn label="texto próprio">
                  <TextShimmerLoader text="Gerando relatório…" />
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="skeleton-spinner" name="Skeleton / Spinner">
                <VariantColumn label="skeleton" className="min-w-[260px]">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-10 w-[220px]" />
                </VariantColumn>
                <VariantColumn label="spinner">
                  <SizeRow label="sm">
                    <Spinner className="size-3" />
                  </SizeRow>
                  <SizeRow label="default">
                    <Spinner />
                  </SizeRow>
                  <SizeRow label="lg">
                    <Spinner className="size-6" />
                  </SizeRow>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="card" name="Card">
                <VariantColumn label="default" className="min-w-[280px]">
                  <Card className="w-[260px]">
                    <CardHeader>
                      <CardTitle>Título do card</CardTitle>
                      <CardDescription>
                        A descrição do card vai aqui.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Conteúdo com os detalhes.
                    </CardContent>
                  </Card>
                </VariantColumn>
                <VariantColumn label="sm" className="min-w-[260px]">
                  <Card size="sm" className="w-[240px]">
                    <CardHeader>
                      <CardTitle>Compacto</CardTitle>
                      <CardDescription>Padding menor.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Layout apertado.
                    </CardContent>
                  </Card>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="tabs" name="Tabs">
                <VariantColumn label="default">
                  <Tabs defaultValue="visao" className="w-[260px]">
                    <TabsList>
                      <TabsTrigger value="visao">Visão geral</TabsTrigger>
                      <TabsTrigger value="uso">Uso</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="visao"
                      className="pt-2 text-sm text-muted-foreground"
                    >
                      Painel de visão geral
                    </TabsContent>
                    <TabsContent
                      value="uso"
                      className="pt-2 text-sm text-muted-foreground"
                    >
                      Painel de uso
                    </TabsContent>
                  </Tabs>
                </VariantColumn>
                <VariantColumn label="line">
                  <Tabs defaultValue="visao" className="w-[260px]">
                    <TabsList variant="line">
                      <TabsTrigger value="visao">Visão geral</TabsTrigger>
                      <TabsTrigger value="uso">Uso</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="visao"
                      className="pt-2 text-sm text-muted-foreground"
                    >
                      Painel de visão geral
                    </TabsContent>
                    <TabsContent
                      value="uso"
                      className="pt-2 text-sm text-muted-foreground"
                    >
                      Painel de uso
                    </TabsContent>
                  </Tabs>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="accordion" name="Accordion">
                <VariantColumn label="single" className="min-w-[300px]">
                  <Accordion className="w-[280px]">
                    <AccordionItem value="a">
                      <AccordionTrigger>O que é isto?</AccordionTrigger>
                      <AccordionContent>
                        A vitrine de um design system.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="b">
                      <AccordionTrigger>Como eu uso?</AccordionTrigger>
                      <AccordionContent>
                        Instale os itens pela registry e componha.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="collapsible" name="Collapsible">
                <VariantColumn label="default">
                  <Collapsible className="w-[240px]">
                    <CollapsibleTrigger render={<Button variant="outline" />}>
                      Alternar <IconChevronDown className="ml-1" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-md shadow-(--custom-shadow) bg-muted/40 p-3 text-sm">
                      Conteúdo que estava escondido.
                    </CollapsibleContent>
                  </Collapsible>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="pagination" name="Pagination">
                <VariantColumn label="default">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#pagination" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#pagination">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#pagination" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#pagination">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#pagination" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="overlays"
                name="Overlays"
                description="Gatilhos: clique para abrir"
              >
                <VariantColumn label="dialog">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" />}>
                      Abrir dialog
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar perfil</DialogTitle>
                        <DialogDescription>
                          Faça as alterações no seu perfil e salve quando
                          terminar.
                        </DialogDescription>
                      </DialogHeader>
                      <Field>
                        <FieldLabel>Nome</FieldLabel>
                        <Input defaultValue="Maria Silva" />
                      </Field>
                      <DialogFooter>
                        <Button>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </VariantColumn>
                <VariantColumn label="alert dialog">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="destructive" />}
                    >
                      Excluir
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </VariantColumn>
                <VariantColumn label="sheet">
                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" />}>
                      Abrir sheet
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Configurações</SheetTitle>
                        <SheetDescription>
                          Ajuste as preferências.
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </VariantColumn>
                <VariantColumn label="sheet floating">
                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" />}>
                      Abrir sheet flutuante
                    </SheetTrigger>
                    <SheetContent variant="floating">
                      <SheetHeader>
                        <SheetTitle>Configurações</SheetTitle>
                        <SheetDescription>
                          Descolado das bordas, com cantos squircle.
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </VariantColumn>
                <VariantColumn label="popover">
                  <Popover>
                    <PopoverTrigger render={<Button variant="outline" />}>
                      Abrir popover
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <p className="text-sm">
                        Conteúdo do popover, com qualquer coisa dentro.
                      </p>
                    </PopoverContent>
                  </Popover>
                </VariantColumn>
                <VariantColumn label="tooltip">
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="outline" />}>
                      Passe o mouse
                    </TooltipTrigger>
                    <TooltipContent>Dica útil</TooltipContent>
                  </Tooltip>
                </VariantColumn>
                <VariantColumn label="dropdown">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                      Menu <IconChevronDown className="ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IconUser /> Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconBell /> Notificações
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <IconTrash /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="hover-card"
                name="Hover card"
                description="Prévia ao passar o mouse (Base UI PreviewCard)"
              >
                <VariantColumn label="default">
                  <HoverCard>
                    <HoverCardTrigger render={<Button variant="link" />}>
                      @joaodadas
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">João Vitor Dadas</span>
                          <span className="text-xs text-muted-foreground">
                            Mantém o lume.
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="empty" name="Empty">
                <VariantColumn label="default" className="min-w-[320px]">
                  <Empty className="w-[300px]">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconSearch />
                      </EmptyMedia>
                      <EmptyContent>
                        <EmptyTitle>Nenhum resultado</EmptyTitle>
                        <EmptyDescription>
                          Tente uma busca diferente.
                        </EmptyDescription>
                      </EmptyContent>
                    </EmptyHeader>
                  </Empty>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="calendar" name="Calendar">
                <VariantColumn label="único" className="min-w-[280px]">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    today={HOJE}
                    defaultMonth={HOJE}
                    className="rounded-md shadow-(--custom-shadow)"
                  />
                </VariantColumn>
                <VariantColumn label="intervalo" className="min-w-[560px]">
                  <Calendar
                    mode="range"
                    locale={ptBR}
                    numberOfMonths={2}
                    today={HOJE}
                    defaultMonth={HOJE}
                    selected={INTERVALO}
                    className="rounded-md shadow-(--custom-shadow)"
                  />
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="table" name="Table">
                <VariantColumn label="default" className="min-w-[400px]">
                  <Table className="w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Papel</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Maria</TableCell>
                        <TableCell>maria@exemplo.com</TableCell>
                        <TableCell>Admin</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>João</TableCell>
                        <TableCell>joao@exemplo.com</TableCell>
                        <TableCell>Membro</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </VariantColumn>
                <VariantColumn
                  label="com legenda e rodapé"
                  className="min-w-[400px]"
                >
                  <Table className="w-[400px]">
                    <TableCaption>
                      Faturas recentes do 1º trimestre.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fatura</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>FAT-001</TableCell>
                        <TableCell>Paga</TableCell>
                        <TableCell className="text-right">R$ 250,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>FAT-002</TableCell>
                        <TableCell>Pendente</TableCell>
                        <TableCell className="text-right">R$ 150,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>FAT-003</TableCell>
                        <TableCell>Paga</TableCell>
                        <TableCell className="text-right">R$ 320,00</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">R$ 720,00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="scroll-area-separator"
                name="Scroll area / Separator"
              >
                <VariantColumn label="scroll area" className="min-w-[260px]">
                  <ScrollArea className="h-[120px] w-[220px] rounded-md shadow-(--custom-shadow) p-3 text-sm">
                    {LINHAS.map((linha) => (
                      <div key={linha} className="py-1 text-muted-foreground">
                        {linha}
                      </div>
                    ))}
                  </ScrollArea>
                </VariantColumn>
                <VariantColumn label="separator">
                  <div className="flex w-[220px] flex-col gap-2 text-sm">
                    <span>Acima</span>
                    <Separator />
                    <span>Abaixo</span>
                  </div>
                  <div className="flex h-5 items-center gap-2 text-sm">
                    <span>Esquerda</span>
                    <Separator orientation="vertical" />
                    <span>Direita</span>
                  </div>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection id="kbd" name="Kbd">
                <VariantColumn label="único">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </VariantColumn>
                <VariantColumn label="grupo">
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="sidebar"
                name="Sidebar"
                description="Amostra com collapsible none, sem ocupar a página"
              >
                <VariantColumn label="menu" className="min-w-[260px]">
                  {/* O SidebarMenuButton lê o contexto do SidebarProvider, então
                      o provider entra aqui, mas com min-h-0 e w-auto para não
                      virar um wrapper de tela inteira. */}
                  <SidebarProvider className="min-h-0 w-auto">
                    <Sidebar
                      collapsible="none"
                      className="h-auto rounded-lg shadow-(--custom-shadow)"
                    >
                      <SidebarContent>
                        <SidebarGroup>
                          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                          <SidebarGroupContent>
                            <SidebarMenu>
                              <SidebarMenuItem>
                                <SidebarMenuButton isActive>
                                  <IconHome />
                                  <span>Início</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton>
                                  <IconChartBar />
                                  <span>Relatórios</span>
                                </SidebarMenuButton>
                                <SidebarMenuBadge>12</SidebarMenuBadge>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton>
                                  <IconSettings />
                                  <span>Configurações</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </SidebarGroup>
                      </SidebarContent>
                    </Sidebar>
                  </SidebarProvider>
                </VariantColumn>
                <VariantColumn label="tamanhos do botão">
                  <SidebarProvider className="min-h-0 w-auto">
                    <SidebarMenu className="w-[200px]">
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <IconHome />
                          <span>sm</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <IconHome />
                          <span>default</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                          <IconHome />
                          <span>lg</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton variant="outline">
                          <IconHome />
                          <span>outline</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarProvider>
                </VariantColumn>
              </ComponentSection>

              <ComponentSection
                id="sonner"
                name="Toast"
                description="Sonner, com o Toaster montado no layout"
              >
                <VariantColumn label="default">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast("Evento agendado", {
                        description: "Sexta, 9 de fevereiro às 14:00",
                      })
                    }
                  >
                    Mostrar toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Perfil atualizado")}
                  >
                    Sucesso
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.error("Algo deu errado")}
                  >
                    Erro
                  </Button>
                </VariantColumn>
              </ComponentSection>
            </div>
          </TooltipProvider>
        </div>
      </main>
    </div>
  );
}
