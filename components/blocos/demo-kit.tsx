// Peças que as demos dos formatos dividem: a rota em hash, a marca, a paleta de
// busca, a ferramenta que se adapta à barra e à gaveta, e o painel da carteira
// (receita do guia 08). Composição do site sobre a registry, não entra nela.
"use client";

import { type Icon, IconX } from "@tabler/icons-react";
import { motion } from "motion/react";
import type * as React from "react";
import { useCallback, useEffect, useEffectEvent, useId, useState } from "react";

import { CARTEIRA } from "@/components/blocos/mock";
import {
  type Nav,
  type NavLinkItem,
  toSections,
} from "@/registry/base-vega/blocks/app-shell/nav";
import { NAV_BUTTON } from "@/registry/base-vega/blocks/app-shell/nav-list";
import { useShellLayout } from "@/registry/base-vega/blocks/app-shell/shell-parts";
import { useReportLayoutReserve } from "@/registry/base-vega/components/header-slot";
import { useIsMobile } from "@/registry/base-vega/hooks/use-mobile";
import {
  formatCompact,
  formatMoney,
  formatPercent,
} from "@/registry/base-vega/lib/format";
import {
  ENTRANCE_EASE,
  MORPH,
  useReduce,
} from "@/registry/base-vega/lib/motion";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/base-vega/ui/command";
import { Sheet, SheetContent, SheetTitle } from "@/registry/base-vega/ui/sheet";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/base-vega/ui/sidebar";

// ---------------------------------------------------------------------------
// Rota em hash
// ---------------------------------------------------------------------------

/** O "pathname" das demos: o hash da URL, quando é uma rota que a demo
 * conhece. No servidor e na hidratação vale o `fallback`; hash desconhecido
 * mantém a rota atual. */
export function useHashRoute(
  fallback: string,
  isRoute: (hash: string) => boolean,
): string {
  const [route, setRoute] = useState(fallback);
  const accepts = useEffectEvent(isRoute);
  useEffect(() => {
    const sync = () => {
      const { hash } = window.location;
      if (hash && accepts(hash)) setRoute(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return route;
}

/** Navega para uma rota da demo: o hashchange troca a página, como um clique
 * no link da sidebar. */
export function goTo(href: string) {
  window.location.hash = href;
}

/** Porcentagem com as casas do formatCompact ("1,2%", "0,9%"): o
 * formatPercent arredonda para inteiro, e rendimento de mês vive no decimal.
 * Com `signed`, o positivo leva o sinal de mais. */
export function percentual(fraction: number, signed = false) {
  const text = `${formatCompact(fraction * 100)}%`;
  return signed && fraction > 0 ? `+${text}` : text;
}

// ---------------------------------------------------------------------------
// Marca
// ---------------------------------------------------------------------------

/** A marca e o nome como irmãos, como o AppShell pede: no trilho sobra só o
 * primeiro filho. */
export function Marca({ nome }: { nome: string }) {
  return (
    <>
      <span
        aria-hidden
        className="size-3.5 shrink-0 rounded-[5px] squircle:rounded-xl corner-squircle bg-foreground"
      />
      <span className="truncate font-medium">{nome}</span>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pílula segmentada
// ---------------------------------------------------------------------------

/** Pílula segmentada da receita do guia 09: botões com aria-pressed e a pílula
 * deslizando com MORPH. Com reduced motion ela troca de lugar sem deslizar. O
 * texto não transiciona; só o hover do inativo suaviza (hover-restraint). */
export function Segmentado<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { id: T; label: string }[];
}) {
  const pillId = useId();
  const reduce = useReduce();
  return (
    // fieldset é o group nativo; min-w-0 desfaz o min-content dele.
    <fieldset
      aria-label={label}
      className="inline-flex min-w-0 max-w-full flex-wrap rounded-md squircle:rounded-2xl corner-squircle bg-muted p-0.75 dark:bg-muted/50"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative cursor-pointer rounded-md squircle:rounded-xl corner-squircle px-2 py-1 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring/50",
              active
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground hover:transition-colors",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={reduce ? { duration: 0 } : MORPH}
                className="absolute inset-0 rounded-md squircle:rounded-xl corner-squircle bg-background shadow-(--custom-shadow) dark:bg-input/50"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Paleta de busca
// ---------------------------------------------------------------------------

export type ItemDaPaleta = {
  id: string;
  label: string;
  hint?: string;
  icon?: Icon;
  onSelect: () => void;
};

/** A paleta do app sobre o item command, aberta pelo SearchTrigger. Vai dentro
 * do AppShell (nos children) para fechar a gaveta do celular quando abre: dois
 * modais abertos brigariam pelo foco. */
export function PaletaDeBusca({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  groups,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder: string;
  groups: { heading: string; items: ItemDaPaleta[] }[];
}) {
  const { setOpenMobile } = useSidebar();
  useEffect(() => {
    if (open) setOpenMobile(false);
  }, [open, setOpenMobile]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="data-open:duration-0"
    >
      <Command>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          {groups.map((group) =>
            group.items.length === 0 ? null : (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      keywords={
                        item.hint ? [item.label, item.hint] : [item.label]
                      }
                      onSelect={() => {
                        onOpenChange(false);
                        item.onSelect();
                      }}
                    >
                      {ItemIcon && (
                        <ItemIcon className="text-muted-foreground" />
                      )}
                      {/* flex-1 no rótulo: o CommandItem fecha a linha com um
                          check ml-auto, que dividiria o espaço com o hint. */}
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.hint}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ),
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function openLink(item: NavLinkItem) {
  if (item.external === "tab") window.open(item.href, "_blank", "noreferrer");
  else if (item.external === "page") window.location.assign(item.href);
  else goTo(item.href);
}

/** Os destinos de um Nav para a paleta: cada link na ordem da tela, o filho
 * com o pai como hint e o ícone do pai. Desabilitado fica de fora. */
export function paletteItems(nav: Nav): ItemDaPaleta[] {
  return toSections(nav).flatMap((section) =>
    section.items.flatMap((node) => {
      const links = node.children
        ? node.children.map((item) => ({ item, parent: node }))
        : [{ item: node, parent: undefined }];
      return links
        .filter(({ item }) => !item.disabled)
        .map(({ item, parent }) => ({
          id: item.href,
          label: item.label,
          hint: parent?.label ?? item.hint,
          icon: item.icon ?? parent?.icon,
          onSelect: () => openLink(item),
        }));
    }),
  );
}

// ---------------------------------------------------------------------------
// Ferramenta do slot tools
// ---------------------------------------------------------------------------

/** Um botão do slot `tools` que se adapta como o SearchTrigger: na barra do
 * desktop é Button; na sidebar, no trilho e na gaveta é item da lista (o slot
 * mora num ul ali). A contagem vira ponto na barra e número na lista, sempre
 * com o texto para o leitor de tela. */
export function ShellTool({
  icon: ToolIcon,
  label,
  onClick,
  variant = "ghost",
  iconOnly = false,
  compact = false,
  expanded,
  count,
}: {
  icon: Icon;
  label: string;
  onClick: () => void;
  /** Variante do Button na barra. */
  variant?: "ghost" | "secondary";
  /** Na barra, só o ícone; o rótulo vai para o aria-label. */
  iconOnly?: boolean;
  /** Na barra estreita (container shell-bar abaixo de 64rem), só o ícone,
   * como o chip de busca; o rótulo fica para o leitor de tela. */
  compact?: boolean;
  /** Para o botão que abre e fecha um painel. */
  expanded?: boolean;
  count?: { value: number; label: string };
}) {
  const layout = useShellLayout();
  const { isMobile } = useSidebar();
  const shownCount = count && count.value > 0 ? count : undefined;
  const said = shownCount ? `, ${shownCount.label}` : "";

  if (layout === "topbar" && !isMobile)
    return (
      <Button
        variant={variant}
        size={iconOnly ? "icon-sm" : "sm"}
        aria-label={iconOnly ? `${label}${said}` : undefined}
        aria-expanded={expanded}
        onClick={onClick}
        className={cn(
          shownCount && "relative",
          compact &&
            !iconOnly &&
            "@max-5xl/shell-bar:size-8 @max-5xl/shell-bar:p-0!",
        )}
      >
        <ToolIcon />
        {iconOnly ? null : (
          <span className={cn(compact && "@max-5xl/shell-bar:sr-only")}>
            {label}
          </span>
        )}
        {shownCount && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-foreground/70"
          />
        )}
        {!iconOnly && said && <span className="sr-only">{said}</span>}
      </Button>
    );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        aria-expanded={expanded}
        onClick={onClick}
        className={NAV_BUTTON}
      >
        <ToolIcon />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {shownCount && (
          <>
            <span
              aria-hidden
              className="ml-auto text-xs text-muted-foreground tabular-nums"
            >
              {shownCount.value}
            </span>
            <span className="sr-only">{said}</span>
          </>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ---------------------------------------------------------------------------
// Painel da carteira
// ---------------------------------------------------------------------------

/** Largura do painel: o mínimo do Foggy (320 a 640 px), para o cartão ficar
 * acima de 420 px na moldura com a sidebar aberta. */
const PANEL_WIDTH = 320;

/** Estado do painel, como o da sidebar: aberto no desktop e na folha do
 * celular são dois valores, para a folha não abrir sozinha ao carregar no
 * celular. */
export function usePainel(openOnDesktop: boolean) {
  const isMobile = useIsMobile();
  const [desktop, setDesktop] = useState(openOnDesktop);
  const [mobile, setMobile] = useState(false);
  const open = isMobile ? mobile : desktop;
  const setOpen = useCallback(
    (value: boolean) => (isMobile ? setMobile(value) : setDesktop(value)),
    [isMobile],
  );
  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);
  return { isMobile, open, desktop, mobile, setOpen, setMobile, toggle };
}

export type Painel = ReturnType<typeof usePainel>;

// Esc fecha o painel, menos quando quem está com o foco já trata a tecla: um
// menu, um diálogo ou um campo (no composer, Esc não deve fechar nada).
const OWNS_ESCAPE =
  '[role="menu"], [role="dialog"], [role="listbox"], input, textarea, select, [contenteditable="true"]';

/** Irmão do wrapper no canvas (slot `panel`): no desktop a largura anima e
 * empurra o cartão; abaixo de 768 px vira Sheet à direita. */
export function PainelCarteira({ painel }: { painel: Painel }) {
  const reduce = useReduce();
  const titleId = useId();
  const onDesktop = painel.open && !painel.isMobile;
  // A largura final vai para a Toolbar antes do tween (guia 08).
  const reserveRef = useReportLayoutReserve(onDesktop ? PANEL_WIDTH : 0);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(OWNS_ESCAPE)) return;
    painel.setOpen(false);
  });
  useEffect(() => {
    if (!onDesktop) return;
    const handle = (event: KeyboardEvent) => onKeyDown(event);
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onDesktop]);

  if (painel.isMobile)
    return (
      <Sheet open={painel.mobile} onOpenChange={painel.setMobile}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="gap-0 bg-sidebar p-2"
        >
          <CarteiraConteudo
            title={<SheetTitle className="text-sm">Sua carteira</SheetTitle>}
            onClose={() => painel.setMobile(false)}
          />
        </SheetContent>
      </Sheet>
    );

  return (
    <motion.aside
      ref={reserveRef}
      aria-labelledby={titleId}
      inert={!painel.open}
      initial={false}
      animate={{ width: painel.open ? PANEL_WIDTH : 0 }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.25, ease: ENTRANCE_EASE }
      }
      // hidden abaixo de md: no servidor e na hidratação o useIsMobile vale
      // false, e sem isso o celular pintaria o painel aberto antes da folha.
      className="relative hidden h-full shrink-0 md:block"
    >
      {/* Largura fixa por dentro: o conteúdo não reflui enquanto abre. */}
      <div className="h-full w-80 py-2 pr-2">
        <CarteiraConteudo
          title={
            <h2 id={titleId} className="text-sm font-medium">
              Sua carteira
            </h2>
          }
          onClose={() => painel.setOpen(false)}
        />
      </div>
    </motion.aside>
  );
}

function CarteiraConteudo({
  title,
  onClose,
}: {
  title: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2 pl-2">
        {title}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Fechar carteira"
          onClick={onClose}
        >
          <IconX />
        </Button>
      </div>
      <Card size="sm">
        <CardHeader className="gap-1">
          <span className="text-xs text-muted-foreground">Patrimônio</span>
          <CardTitle className="text-base tracking-tight tabular-nums">
            {formatMoney(CARTEIRA.total)}
          </CardTitle>
          <span className="text-xs text-muted-foreground tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-500">
              {percentual(CARTEIRA.rendimentoMes, true)}
            </span>{" "}
            em outubro, contra {percentual(CARTEIRA.cdiMes)} do CDI
          </span>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Alocação</CardTitle>
        </CardHeader>
        <CardContent className="mt-1 flex flex-col gap-3">
          {CARTEIRA.alocacao.map((item) => (
            <div key={item.classe} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="truncate">{item.classe}</span>
                <span className="shrink-0 tabular-nums">
                  {formatPercent(item.fracao)}
                  <span className="text-muted-foreground">
                    {" "}
                    de {formatPercent(item.meta)}
                  </span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/60"
                  style={{ width: `${item.fracao * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
