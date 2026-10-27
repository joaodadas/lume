// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/app-shell.tsx:130-206 e 268-434 @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: só o shell ficou (Project, Range, Foggy, DevBar, HUD, quota e sunset saíram); nav (lista ou seções), brand, user e pathname viraram props; dois layouts, sidebar (trilho de ícones por padrão, ou offcanvas, com estado controlado) e topbar (barra de zonas no canvas, sidebar só no celular), na mesma árvore; slots top, tools, banner, fill e panel; NavLink foi para nav-list.tsx e o seletor para shell-parts.tsx; NavUser virou AccountMenu, com detail e modo compacto na barra; ShellTrigger no topo da sidebar e no cabeçalho do cartão (celular e offcanvas recolhido), que recebe o foco quando recolher ou expandir esconde o elemento focado; Cmd/Ctrl+B sem animação, fora de contenteditable e sem efeito na barra; os tools ficam montados e escondidos com a gaveta fechada, para o Cmd/Ctrl+K valer no celular; a barra é um container e as zonas que não cabem rolam; skip link, um só main e o viewport em div; HeaderActionsSlotProvider, LayoutReserveProvider e TooltipProvider montados pelo shell; EASE no recolher e reduced motion; a gaveta fecha ao navegar, como no painel; imports da registry e textos em pt-BR.
"use client";

import { IconChevronRight } from "@tabler/icons-react";
import type * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef } from "react";

import {
  HeaderActionsSlotProvider,
  LayoutReserveProvider,
} from "@/registry/base-vega/components/header-slot";
import { ThemeSubmenu } from "@/registry/base-vega/components/theme-switcher";
import { cn } from "@/registry/base-vega/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/base-vega/ui/avatar";
import { Button } from "@/registry/base-vega/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/registry/base-vega/ui/sidebar";
import { TooltipProvider } from "@/registry/base-vega/ui/tooltip";

import { findActive, type Nav, type NavLinkItem, toSections } from "./nav";
import { NavIcon } from "./nav-icon";
import {
  NAV_BUTTON,
  NavLink,
  NavMenuItem,
  NavSections,
  NavZones,
} from "./nav-list";
import {
  isEditableTarget,
  type ShellLayout,
  ShellLayoutProvider,
  ShellTrigger,
} from "./shell-parts";

export type AppShellUser = {
  name: string;
  email?: string;
  image?: string;
  /** Papel legível ou sessão, sob o nome no menu ("Engenheira, sessão do
   * Hub"). Nunca o código cru do papel. */
  detail?: string;
};

type AppShellBase = {
  /** Lista plana ou seções (nav.ts). */
  nav: Nav;
  /** Sidebar: rodapé, acima da conta. Barra: topo do menu de conta. */
  account?: NavLinkItem[];
  /** Topo da sidebar, esquerda da barra e cabeçalho do celular: a marca e o
   * nome, como irmãos. No trilho fica só o primeiro filho, centrado. */
  brand: React.ReactNode;
  /** Troca a marca: ContextSwitcher. */
  top?: React.ReactNode;
  /** Sidebar: abaixo do topo, como SidebarMenuItem. Barra: à direita, antes da
   * conta. Celular: topo da gaveta. */
  tools?: React.ReactNode;
  /** Faixa fixa no topo do cartão, fora do scroll (impersonação, só leitura,
   * trial). */
  banner?: React.ReactNode;
  user?: AppShellUser;
  /** DropdownMenuItem depois do submenu de tema. */
  userMenu?: React.ReactNode;
  /** usePathname no Next, useLocation no Router. */
  pathname: string;
  /** A página é dona da altura e do scroll: sai a coluna py-6 pb-16. */
  fill?: boolean;
  /** Irmão à direita do cartão, no canvas; empurra o cartão no desktop. */
  panel?: React.ReactNode;
  children: React.ReactNode;
};

type SidebarLayoutProps = {
  layout?: "sidebar";
  /** Padrão "icon" (trilho de 3rem). "offcanvas": some, e o cabeçalho do
   * cartão traz o gatilho. */
  collapsible?: "icon" | "offcanvas";
  /** Leia o cookie no servidor ou antes da pintura (SIDEBAR_COOKIE e
   * readSidebarOpen, de nav.ts). */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type TopbarLayoutProps = {
  layout: "topbar";
  collapsible?: never;
  defaultOpen?: never;
  open?: never;
  onOpenChange?: never;
};

export type AppShellProps = AppShellBase &
  (SidebarLayoutProps | TopbarLayoutProps);

// O EASE de lib/motion entra por seletor descendente no gap, no container e no
// rótulo de grupo, no lugar do ease-linear do primitivo. Com data-instant (o
// atalho), nada transiciona; com reduced motion, nada muda de largura, margem
// ou altura animando.
const CANVAS =
  "group/shell relative h-svh min-h-0 overflow-hidden [&_[data-slot=sidebar-gap]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-slot=sidebar-container]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_[data-sidebar=group-label]]:ease-[cubic-bezier(0.22,1,0.36,1)] [&[data-instant]_*]:transition-none motion-reduce:[&_[data-slot=sidebar-gap]]:transition-none motion-reduce:[&_[data-slot=sidebar-container]]:transition-none motion-reduce:[&_[data-sidebar=group-label]]:transition-none motion-reduce:[&_[data-sidebar=menu-button]]:transition-none";

const SKIP_LINK =
  "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-popover focus:px-3 focus:py-1.5 focus:text-sm focus:shadow-(--custom-shadow)";

// ShellTrigger e marca na mesma linha; no trilho, um sobre o outro, com o
// gatilho em (16, 16) e a marca na coluna dos ícones.
const TOP_LINE =
  "flex min-w-0 items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-start";

// A geometria do gatilho do ProjectSwitcher (h-8, gap-2, pl-1.75, svg 3.5), sem
// hover: a marca é só marca. No trilho sobra o primeiro filho, centrado em 32 px.
const BRAND =
  "flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:*:not-first:hidden";
const BRAND_BAR =
  "flex h-8 w-auto shrink-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0";
const CARD_BRAND =
  "flex min-w-0 flex-1 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0";

// box-content: o h-12 é a linha do gatilho, e a borda e a área segura
// (viewport-fit=cover) somam por fora. Assim o gatilho fica em (16, 16) no
// offcanvas recolhido: 8 do wrapper mais 8 do md:px-2, e 8 no topo.
const CARD_HEADER =
  "flex h-12 shrink-0 box-content items-center gap-2 border-b border-border/40 px-3 pt-[env(safe-area-inset-top)] md:hidden";

const WRAPPER =
  "flex min-h-0 min-w-0 flex-1 flex-col gap-2 transition-[margin] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[collapsible=offcanvas]:ml-2 md:peer-data-[variant=inset]:peer-data-[collapsible=icon]:ml-0.5";
const WRAPPER_BAR = "flex min-h-0 min-w-0 flex-1 flex-col md:mx-2 md:mb-2";

const VIEWPORT = "min-h-0 flex-1 overflow-y-auto outline-none";
const VIEWPORT_FILL =
  "flex min-h-0 flex-1 flex-col overflow-hidden outline-none";
const COLUMN = "flex flex-col gap-4 py-6 px-0 pb-16";
const COLUMN_FILL = "flex min-h-0 flex-1 flex-col";

function initials(value: string) {
  return value.slice(0, 2).toUpperCase();
}

// No Foglamp a sessão vinha do authClient e o nome esperava o mount para não
// divergir na hidratação; aqui user é prop, então SSR e cliente já coincidem.
// Na sidebar, na gaveta e no trilho é um item da lista; na barra (`compact`),
// só o avatar, com os itens de conta no topo do menu.
function AccountMenu({
  user,
  userMenu,
  account,
  current,
  compact = false,
}: {
  user: AppShellUser;
  userMenu?: React.ReactNode;
  account?: NavLinkItem[];
  current?: NavLinkItem;
  compact?: boolean;
}) {
  const { isMobile } = useSidebar();
  const name = user.name || user.email || "Conta";
  const email = user.email ?? "";
  const image = user.image || undefined;

  const content = (
    <>
      <div className="flex gap-3 items-center p-2">
        <Avatar size="sm">
          <AvatarImage src={image} alt="" />
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 pr-1">
          <DropdownMenuLabel className="max-w-56 truncate p-0 text-foreground">
            {name}
          </DropdownMenuLabel>
          {user.detail && (
            <DropdownMenuLabel className="max-w-56 truncate p-0 font-normal">
              {user.detail}
            </DropdownMenuLabel>
          )}
          {email && (
            <DropdownMenuLabel className="max-w-56 truncate p-0 font-normal">
              {email}
            </DropdownMenuLabel>
          )}
        </div>
      </div>
      <DropdownMenuSeparator />
      {compact && account && account.length > 0 && (
        <>
          {account.map((item) => (
            <NavMenuItem key={item.href} item={item} current={current} />
          ))}
          <DropdownMenuSeparator />
        </>
      )}
      <ThemeSubmenu />
      {/* Itens do app (sair, plano, admin): DropdownMenuItem passados pelo consumidor. */}
      {userMenu}
    </>
  );

  if (compact)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Conta: ${name}`}
            />
          }
        >
          <Avatar size="sm">
            <AvatarImage src={image} alt="" />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-auto min-w-56"
        >
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              aria-label={`Conta: ${name}`}
              className={cn(NAV_BUTTON, "pr-1.5")}
            />
          }
        >
          <Avatar size="xs">
            <AvatarImage src={image} alt="" />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          {/* min-w-0 lets the flex child shrink so the name can truncate. */}
          <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
            <span className="truncate">{name}</span>
          </div>
          <IconChevronRight className="ml-auto size-3.5! opacity-15" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side={isMobile ? "top" : "right"}
          sideOffset={8}
          className="min-w-(--anchor-width) w-fit"
        >
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

/** No celular a barra lateral é uma gaveta: fecha sozinha ao trocar de página. */
function CloseOnNavigate({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();
  useEffect(() => {
    // pathname é o gatilho: a cada troca de rota a gaveta fecha.
    if (pathname) setOpenMobile(false);
  }, [pathname, setOpenMobile]);
  return null;
}

// Cmd/Ctrl+B, antes do listener que o primitivo põe em window: o document
// recebe a bolha primeiro. Em contenteditable e na barra do desktop o evento
// para aqui, sem preventDefault (o negrito segue e o cookie não muda); quem já
// tratou a tecla (defaultPrevented) também fica com ela, como no useShortcut.
// No resto, data-instant corta as transições por dois frames e o primitivo
// alterna.
function ShellKeys({
  layout,
  rootRef,
}: {
  layout: ShellLayout;
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { isMobile } = useSidebar();
  // Na barra do desktop o atalho não alterna nada; o listener é reassinado
  // quando isso muda (a gaveta do celular continua alternando).
  const inBar = layout === "topbar" && !isMobile;
  useEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    const doc = root.ownerDocument;
    let frame = 0;
    const release = () => root.removeAttribute("data-instant");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "b" || !(event.metaKey || event.ctrlKey)) return;
      if (
        inBar ||
        event.defaultPrevented ||
        isEditableTarget(event.target, { richTextOnly: true })
      ) {
        event.stopPropagation();
        return;
      }
      root.setAttribute("data-instant", "");
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(() => {
        frame = view.requestAnimationFrame(release);
      });
    };
    doc.addEventListener("keydown", onKeyDown);
    return () => {
      doc.removeEventListener("keydown", onKeyDown);
      view.cancelAnimationFrame(frame);
      release();
    };
  }, [rootRef, inBar]);
  return null;
}

// Recolher e expandir tiram de cena o que podia estar com o foco: no trilho
// somem o rótulo do pai, os filhos, o item sem ícone, o ⋯ e o seletor sem
// ícone; no offcanvas a sidebar fica inert, e ao expandir o cabeçalho do cartão
// some de novo. Sem isto o navegador largaria o foco no body (WCAG 2.4.3). Roda
// logo depois do commit, antes de ele fazer isso, e leva o foco ao ShellTrigger
// que ficou à vista.
function keepFocus(root: HTMLElement) {
  const active = root.ownerDocument.activeElement;
  if (!active || !root.contains(active)) return;
  const gone = (el: Element) =>
    el.closest("[inert]") !== null || el.getClientRects().length === 0;
  if (!gone(active)) return;
  const trigger = Array.from(
    root.querySelectorAll<HTMLElement>("[data-shell-trigger]"),
  ).find((el) => !gone(el));
  trigger?.focus({ preventScroll: true });
}

type ShellFrameProps = AppShellBase & {
  layout: ShellLayout;
  collapsible: "icon" | "offcanvas";
  rootRef: React.RefObject<HTMLDivElement | null>;
};

// Tudo o que lê useSidebar. As posições não mudam entre layouts: skip link,
// os dois componentes sem DOM, a cópia escondida dos tools (ou null), a
// Sidebar (ou null), o wrapper e o panel; no wrapper, a barra (ou null) e o
// cartão; no cartão, o cabeçalho, a faixa (ou null) e o viewport. Trocar de
// layout ou de fill não remonta a página.
function ShellFrame({
  layout,
  collapsible,
  rootRef,
  nav,
  account,
  brand,
  top,
  tools,
  banner,
  user,
  userMenu,
  pathname,
  fill = false,
  panel,
  children,
}: ShellFrameProps) {
  const { isMobile, openMobile, state } = useSidebar();
  const viewportId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const bar = layout === "topbar";
  const current = findActive(
    [...toSections(nav), { items: account ?? [] }],
    pathname,
  )?.item;
  const hasAccount = account !== undefined && account.length > 0;
  // Recolhida em offcanvas no desktop, a sidebar fica fora da tela: o gatilho
  // passa para o cabeçalho do cartão e o que ficou fora sai da ordem do Tab.
  const offcanvasClosed =
    !bar && collapsible === "offcanvas" && state === "collapsed";

  // O estado da sidebar do desktop; null na barra e no celular, onde a gaveta
  // é um Dialog e já devolve o foco ao fechar.
  let desktopView: "offcanvas" | "expanded" | "collapsed" | null = null;
  if (!bar && !isMobile) desktopView = offcanvasClosed ? "offcanvas" : state;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (desktopView && root) keepFocus(root);
  }, [desktopView, rootRef]);

  // Abaixo de 768 px os tools moram na gaveta, e o Sheet desmonta o conteúdo
  // fechado: sem esta cópia escondida, o Cmd/Ctrl+K do SearchTrigger só valeria
  // com a gaveta aberta. Uma cópia por vez, porque ela sai quando a gaveta abre;
  // na animação de saída as duas coexistem, e o defaultPrevented do
  // useShortcut deixa só uma abrir a paleta.
  const toolsHost =
    tools && isMobile && !openMobile ? (
      <SidebarMenu hidden>{tools}</SidebarMenu>
    ) : null;

  const footer =
    hasAccount || user ? (
      <SidebarFooter>
        <nav aria-label="Conta">
          <SidebarMenu className="gap-0">
            {account?.map((item) => (
              <NavLink key={item.href} item={item} current={current} />
            ))}
            {user ? <AccountMenu user={user} userMenu={userMenu} /> : null}
          </SidebarMenu>
        </nav>
      </SidebarFooter>
    ) : null;

  // No topbar a Sidebar só existe no celular, como a gaveta.
  const sidebar =
    !bar || isMobile ? (
      <Sidebar
        variant="inset"
        collapsible={bar ? "offcanvas" : collapsible}
        inert={!isMobile && offcanvasClosed ? true : undefined}
      >
        <SidebarHeader>
          <div className={TOP_LINE}>
            <ShellTrigger />
            {top ?? <div className={BRAND}>{brand}</div>}
          </div>
          {tools ? <SidebarMenu className="gap-0">{tools}</SidebarMenu> : null}
        </SidebarHeader>
        <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
          <NavSections nav={nav} current={current} />
        </SidebarContent>
        {footer}
      </Sidebar>
    ) : null;

  // Sem user não há menu: os itens de conta ficam na barra, como links.
  let barAccount: React.ReactNode = null;
  if (user)
    barAccount = (
      <AccountMenu
        compact
        user={user}
        userMenu={userMenu}
        account={account}
        current={current}
      />
    );
  else if (hasAccount)
    barAccount = (
      <nav aria-label="Conta">
        <SidebarMenu className="w-auto flex-row items-center gap-1">
          {account.map((item) => (
            <NavLink key={item.href} item={item} current={current} bar />
          ))}
        </SidebarMenu>
      </nav>
    );

  // Montada só fora do celular, nunca só escondida: o SearchTrigger dela
  // registraria o Cmd+K de novo com a gaveta aberta. A barra é o container
  // shell-bar: estreita, o chip de busca vira só a lupa (e um tool do app pode
  // se compactar do mesmo jeito). Marca e direita não encolhem; o que não
  // couber das zonas rola dentro da nav, nunca por baixo da direita.
  const topbar =
    bar && !isMobile ? (
      <header
        data-slot="shell-bar"
        className="@container/shell-bar hidden h-12 shrink-0 items-center gap-3 px-2 md:flex"
      >
        {top ?? <div className={BRAND_BAR}>{brand}</div>}
        <NavZones nav={nav} current={current} />
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {tools}
          {barAccount}
        </div>
      </header>
    ) : null;

  return (
    <>
      <a
        data-slot="shell-skip-link"
        href={`#${viewportId}`}
        className={SKIP_LINK}
        onClick={(event) => {
          // Foco direto no viewport, sem hash na URL (a rota pode usar o hash).
          event.preventDefault();
          viewportRef.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <CloseOnNavigate pathname={pathname} />
      <ShellKeys layout={layout} rootRef={rootRef} />
      {toolsHost}
      {/* Só contexto, sem DOM: o peer da Sidebar continua irmão do wrapper. */}
      <TooltipProvider delay={150}>{sidebar}</TooltipProvider>

      {/* This wrapper owns the inset's canvas margin so the dev bar can sit
          above it without disturbing the sidebar/Foggy horizontal flex layout.
          With no dev bar in production, the single inset fills it exactly as it
          did before. */}
      {/* No lume, o lugar da dev bar é o da barra do topbar. */}
      <div data-slot="shell-wrapper" className={bar ? WRAPPER_BAR : WRAPPER}>
        {topbar}
        <SidebarInset className="min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl">
          {/* No celular, e no desktop com a sidebar recolhida em offcanvas: o
              gatilho, a marca (ou top) e a página atual. */}
          <header
            data-slot="shell-card-header"
            className={cn(CARD_HEADER, offcanvasClosed && "md:flex md:px-2")}
          >
            <ShellTrigger />
            {top ?? <div className={CARD_BRAND}>{brand}</div>}
            {current ? (
              <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <NavIcon
                  icon={current.icon}
                  activeIcon={current.activeIcon}
                  active
                  className={current.iconClassName}
                />
                {current.label}
              </span>
            ) : null}
          </header>
          {banner ? (
            <div data-slot="shell-banner" className="shrink-0">
              {banner}
            </div>
          ) : null}
          {/* The scroll viewport is a plain block with a definite height
              (flex-1 + min-h-0); the flex-column layout lives in a child so the
              scroll container itself never tries to flex-fit its content. */}
          <div
            ref={viewportRef}
            data-slot="shell-viewport"
            id={viewportId}
            tabIndex={-1}
            className={fill ? VIEWPORT_FILL : VIEWPORT}
          >
            <div
              data-slot="shell-column"
              className={fill ? COLUMN_FILL : COLUMN}
            >
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
      {panel ?? null}
    </>
  );
}

/**
 * A casca do app, em dois layouts sobre o mesmo canvas, o mesmo cartão e o
 * mesmo celular. `layout="sidebar"` (padrão): sidebar inset de 14rem que
 * recolhe para o trilho de ícones (`collapsible="icon"`, padrão) ou some
 * (`"offcanvas"`). `layout="topbar"`: barra h-12 de zonas no canvas, sem
 * sidebar no desktop. Abaixo de 768 px os dois viram o cabeçalho h-12 no
 * cartão e a gaveta (o Sheet do primitivo, com 3/4 da tela, até 24rem). O
 * scroll fica em três camadas: h-svh min-h-0 no provider, min-h-0
 * overflow-hidden no cartão (o único main) e o viewport
 * min-h-0 flex-1 overflow-y-auto, com a coluna da página em flex flex-col
 * gap-4 py-6 px-0 pb-16 (com `fill`, a página é dona do scroll). `pathname`
 * vem de fora (usePathname no Next, useLocation no Router) porque o bloco não
 * importa roteador nenhum.
 */
export function AppShell({
  layout = "sidebar",
  collapsible = "icon",
  defaultOpen,
  open,
  onOpenChange,
  ...shell
}: AppShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <HeaderActionsSlotProvider>
      <LayoutReserveProvider>
        <ShellLayoutProvider layout={layout} rootRef={rootRef}>
          <SidebarProvider
            ref={rootRef}
            defaultOpen={defaultOpen}
            open={open}
            onOpenChange={onOpenChange}
            className={cn(CANVAS, layout === "topbar" && "md:bg-sidebar")}
          >
            <ShellFrame
              layout={layout}
              collapsible={collapsible}
              rootRef={rootRef}
              {...shell}
            />
          </SidebarProvider>
        </ShellLayoutProvider>
      </LayoutReserveProvider>
    </HeaderActionsSlotProvider>
  );
}
