// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/app-shell.tsx:312-362 @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: o map de nav e de account do ShellBody virou NavLink, com o Link da registry no lugar do next/link e o item ativo vindo de fora (current, de findActive); entram seções com rótulo, item com filhos (Collapsible na sidebar e na gaveta, menu ao lado no trilho e abaixo na barra), badge (contagem, status e selo, que viram um ponto no trilho com o texto no tooltip), external, disabled, hint, menu ⋯, aria-current, nav com rótulo, nada de área morta entre itens, pílula de 44 px na gaveta e zonas que rolam na barra estreita.
"use client";

import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconDotsFilled,
} from "@tabler/icons-react";
import type * as React from "react";
import { useEffect, useId, useState } from "react";

import { Link } from "@/registry/base-vega/components/link";
import { cn } from "@/registry/base-vega/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/base-vega/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/registry/base-vega/ui/sidebar";

import {
  type Nav,
  type NavBadge,
  type NavItem,
  type NavLinkItem,
  type NavParentItem,
  toSections,
} from "./nav";
import { NavIcon } from "./nav-icon";

/** Classes do SidebarMenuButton de primeiro nível em toda lista do shell
 * (seções, ferramentas, conta). A SidebarMenu em volta vai com gap-0. */
// Sem área morta entre itens: no lugar do gap-1 do primitivo, 2 px de borda
// transparente em cima e embaixo, fora do fundo (bg-clip-padding) e dentro do
// alvo. Passo de 36 px com pílula de 32 (32 por 36 no trilho), e o anel de
// foco entra para contornar a pílula. Um after com inset negativo não serve:
// o overflow-hidden do botão corta. Na gaveta, h-12 dá pílula de 44 px.
export const NAV_BUTTON =
  "relative h-9 border-y-2 border-transparent bg-clip-padding focus-visible:ring-inset group-has-data-[sidebar=menu-badge]/menu-item:pr-8 group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:p-1.75! in-data-[mobile=true]:h-12";

// O primitivo centra badge e ⋯ (20 px) no botão de 32 px com top-1.5; aqui o
// botão tem 36 px, e 48 na gaveta.
const SIDE_TOP =
  "peer-data-[size=default]/menu-button:top-2 in-data-[mobile=true]:peer-data-[size=default]/menu-button:top-3.5";

// Contagem e ⋯ dividem o canto: a contagem some quando o ⋯ aparece. Na gaveta
// o ⋯ fica sempre visível, então a contagem anda para a esquerda dele e o
// rótulo para antes dos dois (BOTH_IN_DRAWER).
const COUNT_UNDER_ACTION =
  "md:group-hover/menu-item:opacity-0 md:group-focus-within/menu-item:opacity-0 md:group-has-[[data-sidebar=menu-action][aria-expanded=true]]/menu-item:opacity-0 in-data-[mobile=true]:right-7";
const BOTH_IN_DRAWER = "in-data-[mobile=true]:pr-14!";

// No item com filhos, hover e foco valem só para a linha do pai
// (group/nav-row): os filhos moram no mesmo li, e o group/menu-item do
// primitivo acenderia o ⋯ do pai junto com o de cada filho.
const ROW_ACTION =
  "md:opacity-0 group-focus-within/nav-row:opacity-100 group-hover/nav-row:opacity-100 aria-expanded:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground";
const ROW_COUNT_UNDER_ACTION =
  "md:group-hover/nav-row:opacity-0 md:group-focus-within/nav-row:opacity-0 md:group-has-[[data-sidebar=menu-action][aria-expanded=true]]/nav-row:opacity-0 in-data-[mobile=true]:right-7";

// O filho repete o item: a mesma pílula sem área morta e o mesmo fundo de
// hover e de ativo, com o texto na coluna do rótulo do pai (8 de padding, 18
// de ícone e 8 de gap).
const SUB_BUTTON =
  "h-9 border-y-2 border-transparent bg-clip-padding pl-8.5 rounded-md squircle:rounded-xl corner-squircle hover:bg-sidebar-accent/70 active:bg-sidebar-accent/70 data-active:bg-sidebar-accent/70 dark:data-active:bg-sidebar-accent/50 focus-visible:ring-inset group-has-data-[sidebar=menu-action]/menu-sub-item:pr-8 in-data-[mobile=true]:h-12";
const SUB_ACTION =
  "top-2 in-data-[mobile=true]:top-3.5 md:opacity-0 group-focus-within/menu-sub-item:opacity-100 group-hover/menu-sub-item:opacity-100 aria-expanded:opacity-100";

// Altura medida pelo Base UI, 150 ms no EASE de lib/motion.
const PANEL =
  "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none group-data-[collapsible=icon]:hidden";

const MENU_BESIDE = "w-auto min-w-48 data-open:duration-0";
const MENU_BELOW = "w-auto min-w-56 data-open:duration-0";

// Contagem zero não aparece.
function shown(badge: NavBadge | undefined): NavBadge | undefined {
  return badge && "count" in badge && badge.count <= 0 ? undefined : badge;
}

// O texto do badge, para o tooltip do trilho e para o leitor de tela.
function badgeText(badge: NavBadge): string {
  return "text" in badge ? badge.text : badge.label;
}

function countText(count: number): string {
  return count > 99 ? "99+" : String(count);
}

// working em amber, a cor do agente.
function dotTone(badge: NavBadge): string {
  return "status" in badge && badge.status === "working"
    ? "bg-amber-500 motion-safe:animate-pulse"
    : "bg-sidebar-foreground/70";
}

// Âncora sem roteador. "page" leva a outra zona do domínio por navegação
// inteira, e o Link do app Next (link-next) trataria o caminho como rota dele.
function Anchor(props: React.ComponentProps<"a">) {
  return <a {...props} />;
}

function linkElement(item: NavLinkItem, active: boolean): React.ReactElement {
  if (item.disabled) return <span aria-disabled="true" />;
  if (item.external === "tab")
    return <Anchor href={item.href} target="_blank" rel="noreferrer" />;
  if (item.external === "page") return <Anchor href={item.href} />;
  return <Link href={item.href} aria-current={active ? "page" : undefined} />;
}

function Seal({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto shrink-0 text-xs text-muted-foreground/70">
      {children}
    </span>
  );
}

// O badge dentro do botão. A contagem do item de primeiro nível mora fora
// (SidebarMenuBadge) e aqui entra só o texto; no filho e no menu o número vem
// junto, com a classe que cada lugar passa em `count`.
function BadgeMark({ badge, count }: { badge?: NavBadge; count?: string }) {
  if (!badge) return null;
  if ("text" in badge) return <Seal>{badge.text}</Seal>;
  const said = <span className="sr-only">{`, ${badge.label}`}</span>;
  if ("status" in badge)
    return (
      <>
        <span
          aria-hidden="true"
          className={cn(
            "ml-auto size-1.5 shrink-0 rounded-full",
            dotTone(badge),
          )}
        />
        {said}
      </>
    );
  return (
    <>
      {count && (
        <span aria-hidden="true" className={count}>
          {countText(badge.count)}
        </span>
      )}
      {said}
    </>
  );
}

// No trilho, contagem, status e selo viram este ponto.
function RailDot({ badge }: { badge: NavBadge }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1.5 right-1.5 hidden size-1.5 rounded-full group-data-[collapsible=icon]:block",
        dotTone(badge),
      )}
    />
  );
}

// A cor leva ! porque o SidebarMenuSubButton pinta todo svg filho direto.
function TabMark() {
  return (
    <>
      <IconArrowUpRight className="ml-auto size-3.5! text-muted-foreground/50!" />
      <span className="sr-only">{" (abre em nova aba)"}</span>
    </>
  );
}

function CountBadge({ count, beside }: { count: number; beside?: string }) {
  return (
    <SidebarMenuBadge
      aria-hidden="true"
      className={cn("rounded-full", SIDE_TOP, beside)}
    >
      {countText(count)}
    </SidebarMenuBadge>
  );
}

// O ⋯ do item: atalho de uma ação que também existe na página. `trigger` é a
// classe de posição e de visibilidade de cada lugar (item, linha do pai, filho).
function ItemMenu({
  label,
  menu,
  trigger,
  showOnHover = false,
  bar = false,
}: {
  label: string;
  menu: React.ReactNode;
  trigger: string;
  showOnHover?: boolean;
  bar?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuAction
            showOnHover={showOnHover}
            aria-label={`Mais ações: ${label}`}
            className={trigger}
          />
        }
      >
        <IconDotsFilled />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={bar ? "bottom" : "right"}
        align="start"
        sideOffset={8}
        className={MENU_BESIDE}
      >
        {menu}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Um link de navegação de primeiro nível, o mesmo na sidebar aberta, no
 * trilho, na gaveta e na barra (`bar`, que tira o tooltip e usa w-auto).
 * `current` é o link da página atual, de findActive: só ele acende.
 */
export function NavLink({
  item,
  current,
  bar = false,
}: {
  item: NavLinkItem;
  current?: NavLinkItem;
  bar?: boolean;
}) {
  const active = item === current;
  const disabled = Boolean(item.disabled);
  const badge = disabled ? undefined : shown(item.badge);
  const count = badge && "count" in badge ? badge.count : undefined;
  const menu = disabled ? undefined : item.menu;
  let tooltip: string | undefined;
  if (!bar && !disabled)
    tooltip = badge ? `${item.label}, ${badgeText(badge)}` : item.label;

  return (
    <SidebarMenuItem
      className={cn(
        (!item.icon || disabled) && "group-data-[collapsible=icon]:hidden",
      )}
    >
      <SidebarMenuButton
        isActive={active}
        tooltip={tooltip}
        render={linkElement(item, active)}
        className={cn(
          NAV_BUTTON,
          bar && "w-auto",
          count !== undefined && menu && BOTH_IN_DRAWER,
        )}
      >
        <NavIcon
          icon={item.icon}
          activeIcon={item.activeIcon}
          active={active}
          className={item.iconClassName}
        />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {item.disabled ? (
          <Seal>{item.disabled}</Seal>
        ) : (
          <BadgeMark badge={badge} />
        )}
        {item.external === "tab" && !disabled && <TabMark />}
        {badge && !bar && <RailDot badge={badge} />}
      </SidebarMenuButton>
      {count !== undefined && (
        <CountBadge
          count={count}
          beside={menu ? COUNT_UNDER_ACTION : undefined}
        />
      )}
      {menu && (
        <ItemMenu
          label={item.label}
          menu={menu}
          trigger={SIDE_TOP}
          showOnHover
          bar={bar}
        />
      )}
    </SidebarMenuItem>
  );
}

/** Um link dentro de menu: o filho no menu do trilho e da barra, a conta no
 * menu compacto da barra. O hint vem sob o rótulo; desabilitado vira item
 * disabled com o motivo como selo. */
export function NavMenuItem({
  item,
  current,
}: {
  item: NavLinkItem;
  current?: NavLinkItem;
}) {
  const active = item === current;
  const body = (
    <>
      <NavIcon
        icon={item.icon}
        activeIcon={item.activeIcon}
        active={active}
        className={cn("size-4", item.iconClassName)}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{item.label}</span>
        {item.hint && (
          <span className="text-xs text-muted-foreground">{item.hint}</span>
        )}
      </span>
      {item.disabled ? (
        <Seal>{item.disabled}</Seal>
      ) : (
        <BadgeMark
          badge={shown(item.badge)}
          count="ml-auto text-xs text-muted-foreground tabular-nums"
        />
      )}
      {item.external === "tab" && !item.disabled && <TabMark />}
    </>
  );
  if (item.disabled)
    return <DropdownMenuItem disabled>{body}</DropdownMenuItem>;
  return (
    <DropdownMenuItem render={linkElement(item, active)}>
      {body}
    </DropdownMenuItem>
  );
}

function NavSubLink({
  item,
  current,
}: {
  item: NavLinkItem;
  current?: NavLinkItem;
}) {
  const active = item === current;
  const disabled = Boolean(item.disabled);
  const menu = disabled ? undefined : item.menu;
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={active}
        render={linkElement(item, active)}
        className={SUB_BUTTON}
      >
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {item.disabled ? (
          <Seal>{item.disabled}</Seal>
        ) : (
          <BadgeMark
            badge={shown(item.badge)}
            count="ml-auto text-xs font-medium tabular-nums"
          />
        )}
        {item.external === "tab" && !disabled && <TabMark />}
      </SidebarMenuSubButton>
      {menu && <ItemMenu label={item.label} menu={menu} trigger={SUB_ACTION} />}
    </SidebarMenuSubItem>
  );
}

// Sidebar aberta e gaveta: o pai abre no lugar. No trilho, o mesmo li troca o
// gatilho por um menu ao lado (sem tooltip: tooltip e menu no mesmo gatilho
// ficam de fora). Os dois gatilhos ficam montados e o CSS mostra um, então
// recolher e expandir não perde o aberto.
function SidebarParent({
  item,
  current,
}: {
  item: NavParentItem;
  current?: NavLinkItem;
}) {
  const activeChild =
    current && item.children.includes(current) ? current : undefined;
  const childActive = activeChild !== undefined;
  const [open, setOpen] = useState(
    () => childActive || item.defaultOpen === true,
  );
  const activeHref = activeChild?.href;
  // Um filho que fica ativo abre o pai; fechar continua com a pessoa.
  useEffect(() => {
    if (activeHref) setOpen(true);
  }, [activeHref]);

  const badge = shown(item.badge);
  const count = badge && "count" in badge ? badge.count : undefined;
  const marked = childActive && !open;

  return (
    <SidebarMenuItem
      className={cn(!item.icon && "group-data-[collapsible=icon]:hidden")}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="group/nav-row relative">
          <CollapsibleTrigger
            render={
              <SidebarMenuButton
                isActive={marked}
                className={cn(
                  NAV_BUTTON,
                  "group-data-[collapsible=icon]:hidden",
                  // O ⋯ de um filho também está no li: sem ⋯ próprio, o pai não
                  // reserva o canto.
                  !item.menu &&
                    "group-has-data-[sidebar=menu-action]/menu-item:pr-2",
                  count !== undefined && item.menu && BOTH_IN_DRAWER,
                )}
              />
            }
          >
            <NavIcon
              icon={item.icon}
              activeIcon={item.activeIcon}
              active={marked}
              className={item.iconClassName}
            />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <BadgeMark badge={badge} />
            <IconChevronRight className="ml-auto size-3.5! text-muted-foreground/50 transition-transform duration-150 group-data-[panel-open]/menu-button:rotate-90" />
          </CollapsibleTrigger>
          {item.icon && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    isActive={childActive}
                    aria-label={
                      badge ? `${item.label}, ${badgeText(badge)}` : item.label
                    }
                    className={cn(
                      NAV_BUTTON,
                      "hidden group-data-[collapsible=icon]:flex",
                    )}
                  />
                }
              >
                <NavIcon
                  icon={item.icon}
                  activeIcon={item.activeIcon}
                  active={childActive}
                  className={item.iconClassName}
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {badge && <RailDot badge={badge} />}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={8}
                className={MENU_BESIDE}
              >
                <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                {item.children.map((child) => (
                  <NavMenuItem
                    key={child.href}
                    item={child}
                    current={current}
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {count !== undefined && (
            <CountBadge
              count={count}
              beside={item.menu ? ROW_COUNT_UNDER_ACTION : undefined}
            />
          )}
          {item.menu && (
            <ItemMenu
              label={item.label}
              menu={item.menu}
              trigger={cn(SIDE_TOP, ROW_ACTION)}
            />
          )}
        </div>
        <CollapsibleContent className={PANEL}>
          <SidebarMenuSub className="mx-0 gap-0 border-l-0 px-0 py-0">
            {item.children.map((child) => (
              <NavSubLink key={child.href} item={child} current={current} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

// Barra: a zona com filhos abre um menu abaixo, no mousedown, nunca no hover.
function ZoneParent({
  item,
  current,
}: {
  item: NavParentItem;
  current?: NavLinkItem;
}) {
  const childActive = current !== undefined && item.children.includes(current);
  const badge = shown(item.badge);
  const count = badge && "count" in badge ? badge.count : undefined;
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              isActive={childActive}
              className={cn(NAV_BUTTON, "w-auto")}
            />
          }
        >
          <NavIcon
            icon={item.icon}
            activeIcon={item.activeIcon}
            active={childActive}
            className={item.iconClassName}
          />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <BadgeMark badge={badge} />
          <IconChevronDown className="size-3.5! text-muted-foreground/50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={8}
          className={MENU_BELOW}
        >
          {item.children.map((child) => (
            <NavMenuItem key={child.href} item={child} current={current} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {count !== undefined && (
        <CountBadge
          count={count}
          beside={item.menu ? COUNT_UNDER_ACTION : undefined}
        />
      )}
      {item.menu && (
        <ItemMenu
          label={item.label}
          menu={item.menu}
          trigger={SIDE_TOP}
          showOnHover
          bar
        />
      )}
    </SidebarMenuItem>
  );
}

/** Item com filhos (um nível só): abre no lugar na sidebar e na gaveta, vira
 * menu ao lado no trilho e menu abaixo na barra (`bar`). */
export function NavParent({
  item,
  current,
  bar = false,
}: {
  item: NavParentItem;
  current?: NavLinkItem;
  bar?: boolean;
}) {
  return bar ? (
    <ZoneParent item={item} current={current} />
  ) : (
    <SidebarParent item={item} current={current} />
  );
}

function NavNode({
  item,
  current,
  bar,
}: {
  item: NavItem;
  current?: NavLinkItem;
  bar?: boolean;
}) {
  return item.children === undefined ? (
    <NavLink item={item} current={current} bar={bar} />
  ) : (
    <NavParent item={item} current={current} bar={bar} />
  );
}

function nodeKey(item: NavItem): string {
  return item.children === undefined ? item.href : `pai:${item.label}`;
}

// O que vai para a tela: link sempre; pai só com filho (o filtro por papel
// pode esvaziar um).
function renderable(item: NavItem): boolean {
  return item.children === undefined || item.children.length > 0;
}

// O que aparece no trilho: item com ícone que não esteja desabilitado.
function inRail(item: NavItem): boolean {
  if (!item.icon) return false;
  return item.children !== undefined || !item.disabled;
}

// As seções com o que vai para a tela. A posição na lista é a key: seção que
// o filtro esvazia continua no índice dela e não remonta as vizinhas.
function visibleSections(nav: Nav) {
  return toSections(nav).map((section) => ({
    label: section.label,
    items: section.items.filter(renderable),
  }));
}

function NavGroup({
  label,
  items,
  current,
}: {
  label?: string;
  items: NavItem[];
  current?: NavLinkItem;
}) {
  const labelId = useId();
  return (
    <SidebarGroup
      className={cn(
        !items.some(inRail) && "group-data-[collapsible=icon]:hidden",
      )}
    >
      {label && <SidebarGroupLabel id={labelId}>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu
          aria-labelledby={label ? labelId : undefined}
          className="gap-0"
        >
          {items.map((item) => (
            <NavNode key={nodeKey(item)} item={item} current={current} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** A navegação principal na sidebar, no trilho e na gaveta: um SidebarGroup
 * por seção, com rótulo quando há. Seção vazia não aparece; seção sem item com
 * ícone some no trilho. Vai dentro do SidebarContent. */
export function NavSections({
  nav,
  current,
}: {
  nav: Nav;
  current?: NavLinkItem;
}) {
  const sections = visibleSections(nav);
  if (!sections.some((section) => section.items.length > 0)) return null;
  return (
    <nav aria-label="Principal" className="flex flex-col gap-2">
      {sections.map((section, index) =>
        section.items.length === 0 ? null : (
          <NavGroup
            // biome-ignore lint/suspicious/noArrayIndexKey: a posição é a identidade da seção (o rótulo pode faltar ou repetir) e não muda quando o filtro esvazia outra
            key={index}
            label={section.label}
            items={section.items}
            current={current}
          />
        ),
      )}
    </nav>
  );
}

/** As zonas da barra (layout topbar no desktop): uma SidebarMenu em linha por
 * seção, separadas por espaço. Zona com filhos abre menu abaixo. */
export function NavZones({
  nav,
  current,
}: {
  nav: Nav;
  current?: NavLinkItem;
}) {
  const sections = visibleSections(nav);
  if (!sections.some((section) => section.items.length > 0)) return null;
  // A zona não encolhe (o rótulo inteiro entra no min-content do item, com ou
  // sem truncate), e a seção também não: shrink-0 vence o min-w-0 da
  // SidebarMenu, que deixaria uma seção passar por cima da outra. Na barra
  // estreita a nav rola na horizontal, sem barra visível, e o Tab traz a zona
  // focada para a vista. O overscroll fica na nav, para o gesto não virar o
  // voltar do navegador.
  return (
    <nav
      aria-label="Principal"
      className="flex min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain no-scrollbar"
    >
      {sections.map((section, index) =>
        section.items.length === 0 ? null : (
          <SidebarMenu
            // biome-ignore lint/suspicious/noArrayIndexKey: a posição é a identidade da seção (o rótulo pode faltar ou repetir) e não muda quando o filtro esvazia outra
            key={index}
            className="w-auto shrink-0 flex-row items-center gap-1"
          >
            {section.items.map((item) => (
              <NavNode key={nodeKey(item)} item={item} current={current} bar />
            ))}
          </SidebarMenu>
        ),
      )}
    </nav>
  );
}
