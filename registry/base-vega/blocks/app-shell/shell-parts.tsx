// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/app-shell.tsx:76-128 @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: do ProjectSwitcher ficou a geometria do gatilho (SidebarMenuButton com pr-2 pl-1.75, svg de 3.5, chevron opacity-15, menu com sideOffset 8), agora ContextSwitcher com opção por link, detail, IconCheck na atual e footer, abrindo ao lado na sidebar e abaixo fora dela; entram ShellTrigger, SearchTrigger, useShortcut, isEditableTarget e o contexto do layout (useShellLayout), com rótulos em pt-BR; alvo de 44 px no celular para o gatilho e o seletor, e o chip de busca que vira só a lupa na barra estreita.
"use client";

import {
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
  IconSearch,
} from "@tabler/icons-react";
import type * as React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Link } from "@/registry/base-vega/components/link";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import { Kbd } from "@/registry/base-vega/ui/kbd";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/base-vega/ui/sidebar";

import { NAV_BUTTON } from "./nav-list";

export type ShellLayout = "sidebar" | "topbar";

type ShellContextValue = {
  layout: ShellLayout;
  rootRef?: React.RefObject<HTMLElement | null>;
};

const ShellContext = createContext<ShellContextValue>({ layout: "sidebar" });

/** Montado pelo AppShell em volta do SidebarProvider. `rootRef` aponta para o
 * canvas: os atalhos ouvem o ownerDocument dele, que não é o document global
 * quando o shell vive em outra janela. */
export function ShellLayoutProvider({
  layout,
  rootRef,
  children,
}: {
  layout: ShellLayout;
  rootRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ layout, rootRef }), [layout, rootRef]);
  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

/** O layout do AppShell em volta ("sidebar" fora dele). Um tool do app lê
 * isto e useSidebar().isMobile para saber se está na barra ou na gaveta. */
export function useShellLayout(): ShellLayout {
  return useContext(ShellContext).layout;
}

/** INPUT, TEXTAREA, SELECT ou contenteditable; com richTextOnly, só
 * contenteditable. */
export function isEditableTarget(
  target: EventTarget | null,
  { richTextOnly = false }: { richTextOnly?: boolean } = {},
): boolean {
  // Pela forma, sem instanceof: o alvo pode vir de outra janela.
  if (!target || !("tagName" in target)) return false;
  const element = target as HTMLElement;
  if (element.isContentEditable) return true;
  if (richTextOnly) return false;
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT"
  );
}

/** Atalho de teclado com listener no ownerDocument do shell, na fase de
 * bolha. Com `mod` (Cmd ou Ctrl, sem Alt e sem Shift), ignora contenteditable
 * e vale em input e textarea; sem `mod`, a tecla sozinha, fora de qualquer
 * campo. Evento já tratado (defaultPrevented) passa; o que casa leva
 * preventDefault. */
export function useShortcut(
  key: string,
  onPress: (event: KeyboardEvent) => void,
  { mod = false, enabled = true }: { mod?: boolean; enabled?: boolean } = {},
): void {
  const { rootRef } = useContext(ShellContext);
  // O onPress mais recente sem reassinar o listener (ele costuma ser uma
  // closure nova a cada render). Ref em vez de useEffectEvent, que só é estável
  // a partir do React 19.2.
  const press = useRef(onPress);
  useLayoutEffect(() => {
    press.current = onPress;
  });
  useEffect(() => {
    if (!enabled) return;
    const doc = rootRef?.current?.ownerDocument ?? document;
    const wanted = key.toLowerCase();
    function handleKeyDown(event: KeyboardEvent) {
      // O autofill do Chrome dispara keydown sem key.
      if (event.defaultPrevented || event.isComposing || !event.key) return;
      if (event.key.toLowerCase() !== wanted) return;
      const withMod = event.metaKey || event.ctrlKey;
      if (
        mod
          ? !withMod || event.altKey || event.shiftKey
          : withMod || event.altKey
      )
        return;
      if (isEditableTarget(event.target, { richTextOnly: mod })) return;
      event.preventDefault();
      press.current(event);
    }
    doc.addEventListener("keydown", handleKeyDown);
    return () => doc.removeEventListener("keydown", handleKeyDown);
  }, [key, mod, enabled, rootRef]);
}

/** Abre e fecha a sidebar: recolhe e expande no desktop, abre e fecha a gaveta
 * no celular. */
export function ShellTrigger({ className }: { className?: string }) {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  let label = expanded ? "Recolher barra lateral" : "Expandir barra lateral";
  if (isMobile) label = expanded ? "Fechar menu" : "Abrir menu";
  const Glyph = expanded
    ? IconLayoutSidebarLeftCollapseFilled
    : IconLayoutSidebarLeftExpandFilled;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      // O ghost pinta aria-expanded como popup aberto; aqui é só o estado da
      // sidebar, então o fundo some e o hover continua. Abaixo de md, o after
      // leva o alvo a 44 px sem mudar o desenho de 32. data-shell-trigger é
      // por onde o AppShell acha o gatilho à vista para devolver o foco.
      className={cn(
        "relative after:absolute after:-inset-1.5 md:after:hidden aria-expanded:bg-transparent aria-expanded:hover:bg-muted",
        className,
      )}
      data-shell-trigger=""
      aria-label={label}
      aria-expanded={expanded}
      aria-keyshortcuts="Meta+B Control+B"
      onClick={() => toggleSidebar()}
    >
      <Glyph />
    </Button>
  );
}

export type ContextOption = {
  id: string;
  label: string;
  /** Trocar de contexto é navegação: a URL guarda o contexto e Cmd+clique
   * abre outra aba. */
  href?: string;
  external?: "tab" | "page";
  icon?: React.ReactNode;
  /** Um dado por contexto, para decidir sem trocar ("3 pendentes"). */
  detail?: React.ReactNode;
};

// O gatilho do ProjectSwitcher. flex-1 só na sidebar e na gaveta, onde ele
// divide a linha com o ShellTrigger; na barra e no cabeçalho do cartão fica do
// tamanho do conteúdo. No trilho sobra só o ícone, centrado, e flex-none: na
// coluna do topo o flex-basis 0 do flex-1 venceria o size-8 (sairia com 28 px).
// Abaixo de md, h-11: 44 px de alvo na gaveta e no cabeçalho do cartão (o
// botão tem overflow-hidden, que cortaria um after).
const SWITCHER_TRIGGER =
  "w-auto min-w-0 gap-2 pr-2 pl-1.75 in-data-[slot=sidebar]:flex-1 max-md:h-11 [&_svg]:size-3.5 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.75!";

function ContextItem({
  option,
  selected,
  onSelect,
}: {
  option: ContextOption;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const body = (
    <>
      {option.icon}
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {option.detail && (
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {option.detail}
        </span>
      )}
      {option.external === "tab" && (
        <>
          <IconArrowUpRight className="size-3.5 text-muted-foreground/50" />
          <span className="sr-only">{" (abre em nova aba)"}</span>
        </>
      )}
      {/* Invisível nas outras opções para os detalhes ficarem na mesma coluna. */}
      <IconCheck className={cn(!selected && "invisible")} />
    </>
  );
  const current = selected ? "true" : undefined;
  const { href, external } = option;
  if (!href)
    return (
      <DropdownMenuItem
        aria-current={current}
        onClick={() => onSelect?.(option.id)}
      >
        {body}
      </DropdownMenuItem>
    );
  // Âncora pura no externo: "page" é navegação inteira até outra zona.
  return (
    <DropdownMenuItem
      aria-current={current}
      render={
        external ? (
          (props) => (
            <a
              {...props}
              href={href}
              target={external === "tab" ? "_blank" : undefined}
              rel={external === "tab" ? "noreferrer" : undefined}
            />
          )
        ) : (
          <Link href={href} />
        )
      }
    >
      {body}
    </DropdownMenuItem>
  );
}

/** Troca de contexto no `top` do AppShell (sistema, obra, setor, praça,
 * conta), só quando há mais de um. Abre no mousedown, ao lado na sidebar e
 * abaixo na barra, na gaveta e no cabeçalho do cartão. No trilho, opção sem
 * ícone deixa o seletor de fora, como o item de navegação sem ícone. */
export function ContextSwitcher({
  label,
  value,
  options,
  onSelect,
  footer,
}: {
  /** Tipo do contexto, para o leitor de tela e o rótulo do menu: "Sistema",
   * "Obra", "Setor". */
  label: string;
  value: string;
  options: ContextOption[];
  /** Para opção sem href (escopo guardado em estado). */
  onSelect?: (id: string) => void;
  /** Depois de um separador: "Todos os sistemas", "Abrir o Hub". */
  footer?: React.ReactNode;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [side, setSide] = useState<"right" | "bottom">("right");
  const current = options.find((option) => option.id === value);
  const name = current?.label ?? value;

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        // O mesmo top aparece na sidebar, na barra e no cabeçalho do cartão;
        // ao lado só dentro da sidebar do desktop.
        if (open)
          setSide(
            triggerRef.current?.closest('[data-slot="sidebar-container"]')
              ? "right"
              : "bottom",
          );
      }}
    >
      <DropdownMenuTrigger
        ref={triggerRef}
        render={
          <SidebarMenuButton
            aria-label={`${label}: ${name}`}
            className={cn(
              SWITCHER_TRIGGER,
              !current?.icon && "group-data-[collapsible=icon]:hidden",
            )}
          />
        }
      >
        {current?.icon}
        <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
          {name}
        </span>
        <IconChevronDown className="ml-auto opacity-15 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align="start"
        sideOffset={8}
        className="w-auto min-w-56 data-open:duration-0"
      >
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {options.map((option) => (
          <ContextItem
            key={option.id}
            option={option}
            selected={option.id === value}
            onSelect={onSelect}
          />
        ))}
        {footer && (
          <>
            <DropdownMenuSeparator />
            {footer}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const noSubscribe = () => () => {};

// ⌘ no Mac (o iPad também se apresenta como Mac), Ctrl no resto. null no
// servidor e na hidratação: o símbolo entra depois do mount, sem divergir.
function useModSymbol(): "⌘" | "Ctrl" | null {
  return useSyncExternalStore<"⌘" | "Ctrl" | null>(
    noSubscribe,
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => null,
  );
}

// Na barra estreita (container shell-bar abaixo de 64rem: o painel aberto, uma
// janela de tablet), o chip vira só a lupa, com o rótulo para o leitor de tela,
// e a largura fica para as zonas.
const CHIP_NARROW =
  "@max-5xl/shell-bar:w-8 @max-5xl/shell-bar:justify-center @max-5xl/shell-bar:p-0!";

// Na barra, a superfície de chip de FRONTEND.md (Badges e chips) sobre o
// Button outline.
function SearchChip({
  label,
  keys,
  kbd,
  onOpen,
}: {
  label: string;
  keys?: string;
  kbd: React.ReactNode;
  onOpen: () => void;
}) {
  // biome-ignore format: a string do botão é citada inteira nos docs, e o check 10 procura o literal
  return <Button variant="outline" className={cn("w-56 justify-start gap-2 bg-card font-normal text-muted-foreground transition-[color,box-shadow] hover:bg-muted/50 active:scale-100 dark:border-0 dark:shadow-(--custom-outline-shadow)", CHIP_NARROW)} aria-keyshortcuts={keys} onClick={() => onOpen()}>
    <IconSearch />
    <span className="truncate @max-5xl/shell-bar:sr-only">{label}</span>
    {kbd}
  </Button>;
}

/** Abre a paleta do app (item command) pelo clique e por Cmd/Ctrl+tecla.
 * Na sidebar e na gaveta é um item da lista; na barra, a superfície de chip. */
export function SearchTrigger({
  onOpen,
  label = "Buscar",
  shortcut = "k",
}: {
  onOpen: () => void;
  /** "Buscar" por padrão. */
  label?: string;
  /** Tecla com Cmd/Ctrl, "k" por padrão; null desliga. Um por tela. */
  shortcut?: string | null;
}) {
  const layout = useShellLayout();
  const { isMobile } = useSidebar();
  const symbol = useModSymbol();
  useShortcut(shortcut ?? "", () => onOpen(), {
    mod: true,
    enabled: shortcut !== null,
  });

  const key =
    shortcut && (shortcut.length === 1 ? shortcut.toUpperCase() : shortcut);
  const keys = key ? `Meta+${key} Control+${key}` : undefined;
  // O @max-5xl/shell-bar só casa no chip da barra estreita; na lista não há
  // container shell-bar em volta.
  const kbd =
    key && symbol ? (
      <Kbd className="ml-auto pointer-coarse:hidden @max-5xl/shell-bar:hidden">
        {symbol === "⌘" ? `⌘${key}` : `Ctrl ${key}`}
      </Kbd>
    ) : null;

  if (layout === "topbar" && !isMobile)
    return <SearchChip label={label} keys={keys} kbd={kbd} onOpen={onOpen} />;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        aria-keyshortcuts={keys}
        onClick={() => onOpen()}
        className={NAV_BUTTON}
      >
        <IconSearch />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {kbd}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
