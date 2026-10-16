// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/app-shell.tsx:130-206 e 268-434 @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: só o shell ficou (Project, Range, Foggy, DevBar, HUD, quota e sunset saíram); nav, brand, user e pathname viraram props; Link da registry no lugar de next/link e usePathname; NavUser lê user e aceita userMenu; header mobile h-12 md:hidden com SidebarTrigger e a gaveta fechando ao navegar, como no painel; imports da registry e textos em pt-BR.
"use client";

import { IconChevronRight } from "@tabler/icons-react";
import type * as React from "react";
import { useEffect } from "react";

import { Link } from "@/registry/base-vega/components/link";
import { ThemeSubmenu } from "@/registry/base-vega/components/theme-switcher";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/base-vega/ui/avatar";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/registry/base-vega/ui/sidebar";

import { isActive, type NavItem } from "./nav";
import { NavIcon } from "./nav-icon";

export type AppShellUser = {
  name: string;
  email?: string;
  image?: string;
};

function initials(value: string) {
  return value.slice(0, 2).toUpperCase();
}

// Um item de navegação: SidebarMenuButton renderizando o Link da registry
// (padrão Base UI `render`, nunca asChild). O NavIcon recebe o tile em
// iconClassName e faz o crossfade outline/filled de 100 ms.
function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href, item.exact);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} render={<Link href={item.href} />}>
        <NavIcon
          icon={item.icon}
          activeIcon={item.activeIcon}
          active={active}
          className={item.iconClassName}
        />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// No Foglamp a sessão vinha do authClient e o nome esperava o mount para não
// divergir na hidratação; aqui user é prop, então SSR e cliente já coincidem.
function NavUser({
  user,
  userMenu,
}: {
  user: AppShellUser;
  userMenu?: React.ReactNode;
}) {
  const name = user.name || user.email || "Conta";
  const email = user.email ?? "";
  const image = user.image || undefined;

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={<SidebarMenuButton className="pr-1.5" />}>
          <Avatar size="xs">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          {/* min-w-0 lets the flex child shrink so the name can truncate. */}
          <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
            <span className="truncate">{name}</span>
          </div>
          <IconChevronRight className="ml-auto size-3.5 opacity-15" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="right"
          sideOffset={8}
          className="min-w-(--anchor-width) w-fit"
        >
          <div className="flex gap-3 items-center p-2">
            <Avatar size="sm">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{initials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 pr-1">
              <DropdownMenuLabel className="max-w-56 truncate p-0 text-foreground">
                {name}
              </DropdownMenuLabel>
              {email && (
                <DropdownMenuLabel className="max-w-56 truncate p-0 font-normal">
                  {email}
                </DropdownMenuLabel>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <ThemeSubmenu />
          {/* Itens do app (sair, plano, admin): DropdownMenuItem passados pelo consumidor. */}
          {userMenu}
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

/**
 * A casca do app: sidebar inset à esquerda, o conteúdo num cartão que flutua
 * sobre o canvas com shadow-(--custom-shadow), scroll em três camadas (h-svh
 * min-h-0 no provider, min-h-0 overflow-hidden no inset, min-h-0 flex-1
 * overflow-y-auto no main) e a coluna da página em flex flex-col gap-4 py-6
 * px-0 pb-16. `pathname` vem de fora (usePathname no Next, useLocation no
 * Router) porque o bloco não importa roteador nenhum.
 */
export function AppShell({
  nav,
  account,
  brand,
  user,
  userMenu,
  pathname,
  children,
}: {
  nav: NavItem[];
  /** Itens do rodapé, acima do menu de conta (no Foglamp: API Keys e Settings). */
  account?: NavItem[];
  /** O que vai no topo da sidebar e no header mobile: marca mais nome. */
  brand: React.ReactNode;
  user?: AppShellUser;
  /** DropdownMenuItem extras do menu de conta, depois do submenu de tema. */
  userMenu?: React.ReactNode;
  pathname: string;
  children: React.ReactNode;
}) {
  const current = [...nav, ...(account ?? [])].find((item) =>
    isActive(pathname, item.href, item.exact),
  );

  return (
    <SidebarProvider className="group/shell relative h-svh min-h-0 overflow-hidden">
      <CloseOnNavigate pathname={pathname} />
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* A geometria do gatilho do ProjectSwitcher (h-8, gap-2, pl-1.75, svg 3.5), sem hover: a marca é só marca. */}
              <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden px-1 pr-2 pl-1.75 text-left text-sm [&_svg]:size-3.5 [&_svg]:shrink-0">
                {brand}
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {account?.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
            {user && <NavUser user={user} userMenu={userMenu} />}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* This wrapper owns the inset's canvas margin so the dev bar can sit
          above it without disturbing the sidebar/Foggy horizontal flex layout.
          With no dev bar in production, the single inset fills it exactly as it
          did before. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2">
        <SidebarInset className="min-h-0 overflow-hidden transition-shadow duration-200 md:rounded-lg squircle:md:rounded-3xl">
          {/* No celular: barra do topo com o botão da gaveta, a marca e a página atual. */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3 md:hidden">
            <SidebarTrigger />
            <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium [&_svg]:size-3.5 [&_svg]:shrink-0">
              {brand}
            </div>
            {current && (
              <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <NavIcon
                  icon={current.icon}
                  activeIcon={current.activeIcon}
                  active
                  className={current.iconClassName}
                />
                {current.label}
              </span>
            )}
          </header>
          {/* The scroll viewport is a plain block with a definite height
              (flex-1 + min-h-0); the flex-column layout lives in a child so the
              scroll container itself never tries to flex-fit its content. */}
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 py-6 px-0 pb-16">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
