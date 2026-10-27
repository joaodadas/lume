// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/nav.ts e apps/web/src/components/app/app-shell.tsx:208-211 @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: a tabela de rotas do Foglamp saiu (cada app passa a sua), href vira string em vez de Route do Next, a receita do tile virou navTile(cor) com as nove cores por extenso, isActive veio do app-shell e ganhou o flag exact no lugar do caso fixo de /settings; o modelo ganhou seções, item com filhos, badge, external, disabled, hint e menu, com icon e activeIcon opcionais; toSections, flattenNav e findActive leem lista plana ou seções, navItem também, e SIDEBAR_COOKIE com readSidebarOpen leem o recolhido que o primitivo grava.
import type { Icon } from "@tabler/icons-react";
import type * as React from "react";

/** Dado ao lado do rótulo, sempre com texto para o leitor de tela. */
export type NavBadge =
  | { count: number; label: string } // "3 não lidas"; some com 0; "99+" acima de 99
  | { status: "working" | "unread"; label: string } // ponto; working em amber (agente)
  | { text: string }; // selo: "Em breve", "fase 2"

type NavBase = {
  label: string;
  /** Outline icon, shown when the tab is inactive. Item sem ícone (conversa,
   * favorito) não aparece no trilho. */
  icon?: Icon;
  /** Filled icon, shown when the tab is active. Sem ele, o glifo de icon fica
   * nos dois estados. */
  activeIcon?: Icon;
  /** Optional Tailwind class(es) for the icon, e.g. "text-blue-500". No lume,
   * navTile(cor), ou "text-muted-foreground/70" em item de conta. */
  iconClassName?: string;
  badge?: NavBadge;
  /** DropdownMenuItem do botão ⋯: atalho de uma ação que também existe na
   * página. */
  menu?: React.ReactNode;
};

export type NavLinkItem = NavBase & {
  /** Rota escrita como string ("/pedidos"), nunca o tipo Route do Next. */
  href: string;
  /** Só casa o pathname exato. Use quando um item é prefixo de outro, como
   * "/configuracoes" ao lado de "/configuracoes/equipe" (o caso que no Foglamp
   * era fixo em código para /settings). */
  exact?: boolean;
  /** "tab": nova aba e seta. "page": <a> com navegação inteira, sem seta
   * (outra zona do domínio). Nunca ativo. */
  external?: "tab" | "page";
  /** Motivo visível ("Em breve"): rótulo sem link, aria-disabled, sem tooltip,
   * fora do trilho. Nunca ativo. */
  disabled?: string;
  /** Linha de apoio quando o item aparece num menu (zona com filhos, menu do
   * trilho). */
  hint?: string;
  children?: never;
};

export type NavParentItem = NavBase & {
  /** Um nível só. Sidebar e gaveta: abre no lugar. Trilho e barra: menu ao
   * lado. */
  children: NavLinkItem[];
  /** Vale na montagem. Um filho ativo abre o item de qualquer jeito. */
  defaultOpen?: boolean;
  href?: never;
};

export type NavItem = NavLinkItem | NavParentItem;

export type NavSection = {
  /** Sem rótulo no núcleo. No trilho o rótulo some. */
  label?: string;
  items: NavItem[];
};

/** Lista plana (o contrato da v0.2 continua valendo) ou seções. */
export type Nav = NavItem[] | NavSection[];

export type NavTileColor =
  | "rose"
  | "emerald"
  | "orange"
  | "sky"
  | "fuchsia"
  | "yellow"
  | "violet"
  | "blue"
  | "amber";

// A receita do tile colorido do ícone de navegação (nav.ts:44 do Foglamp):
// fundo {cor}-100 no claro e {cor}-950 no escuro, raio de 5px (xl no squircle),
// p-0.5, glifo em {cor}-500, anel interno de 1px a 14% da cor mais uma sombra
// curta a 25%; no escuro cai para a sombra neutra. Os rgba são o {cor}-500 do
// Tailwind, os mesmos do nav.ts e do span-type.tsx. Uma string completa por
// cor, sem interpolação, para o Tailwind enxergar cada classe.
const TILES: Record<NavTileColor, string> = {
  rose: "bg-rose-100 dark:bg-rose-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-rose-500 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.14),0_2px_6px_-2px_rgba(244,63,94,0.25)] dark:shadow-(--custom-shadow)",
  emerald:
    "bg-emerald-100 dark:bg-emerald-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-emerald-500 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.14),0_2px_6px_-2px_rgba(16,185,129,0.25)] dark:shadow-(--custom-shadow)",
  orange:
    "bg-orange-100 dark:bg-orange-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.14),0_2px_6px_-2px_rgba(249,115,22,0.25)] dark:shadow-(--custom-shadow)",
  sky: "bg-sky-100 dark:bg-sky-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-sky-500 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.14),0_2px_6px_-2px_rgba(14,165,233,0.25)] dark:shadow-(--custom-shadow)",
  fuchsia:
    "bg-fuchsia-100 dark:bg-fuchsia-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-fuchsia-500 shadow-[inset_0_0_0_1px_rgba(217,70,239,0.14),0_2px_6px_-2px_rgba(217,70,239,0.25)] dark:shadow-(--custom-shadow)",
  yellow:
    "bg-yellow-100 dark:bg-yellow-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-yellow-500 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.14),0_2px_6px_-2px_rgba(234,179,8,0.25)] dark:shadow-(--custom-shadow)",
  violet:
    "bg-violet-100 dark:bg-violet-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-violet-500 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.14),0_2px_6px_-2px_rgba(139,92,246,0.25)] dark:shadow-(--custom-shadow)",
  blue: "bg-blue-100 dark:bg-blue-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14),0_2px_6px_-2px_rgba(59,130,246,0.25)] dark:shadow-(--custom-shadow)",
  amber:
    "bg-amber-100 dark:bg-amber-950 rounded-[5px] squircle:rounded-xl p-0.5 corner-squircle text-amber-500 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.14),0_2px_6px_-2px_rgba(245,158,11,0.25)] dark:shadow-(--custom-shadow)",
};

/** Devolve a string literal do tile colorido para `iconClassName`. Itens de
 * conta (sem tile) usam "text-muted-foreground/70", como no Foglamp. */
export function navTile(color: NavTileColor): string {
  return TILES[color];
}

/** Ativo por igualdade ou por prefixo de segmento ("/pedidos" ativa em
 * "/pedidos/42", não em "/pedidosx"). Com `exact`, só igualdade. A raiz "/"
 * só casa exata, senão ficaria acesa em toda página. */
export function isActive(pathname: string, href: string, exact = false) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Seção tem items e item nunca tem (o item com filhos usa children), então o
// primeiro elemento decide a forma da lista inteira.
function isSectionList(nav: Nav): nav is NavSection[] {
  const first = nav[0];
  return first !== undefined && "items" in first;
}

/** Seções do Nav: a lista plana vira uma seção sem rótulo. Seção vazia fica
 * na lista, para a key por índice não mudar quando o filtro por papel a
 * esvazia; quem renderiza pula. */
export function toSections(nav: Nav): NavSection[] {
  if (isSectionList(nav)) return nav;
  return nav.length > 0 ? [{ items: nav }] : [];
}

// Cada link na ordem da tela, com o pai quando é filho. O pai em si não entra:
// não tem href.
function entries(nav: Nav): { item: NavLinkItem; parent?: NavParentItem }[] {
  return toSections(nav).flatMap((section) =>
    section.items.flatMap((node) =>
      node.children
        ? node.children.map((item) => ({ item, parent: node }))
        : [{ item: node }],
    ),
  );
}

/** Todos os links, filhos inclusive, na ordem da tela (externos e
 * desabilitados também). */
export function flattenNav(nav: Nav): NavLinkItem[] {
  return entries(nav).map((entry) => entry.item);
}

/** O link da página atual e, quando ele é filho, o pai. Externo e desabilitado
 * nunca ficam ativos. Se mais de um casa, ganha o href mais longo, o mais
 * específico: em "/pedidos/novo", o item "/pedidos/novo" vence "/pedidos".
 * No empate, o primeiro na ordem da tela. */
export function findActive(
  nav: Nav,
  pathname: string,
): { item: NavLinkItem; parent?: NavParentItem } | undefined {
  let best: { item: NavLinkItem; parent?: NavParentItem } | undefined;
  for (const entry of entries(nav)) {
    const { item } = entry;
    if (item.external || item.disabled) continue;
    if (!isActive(pathname, item.href, item.exact)) continue;
    if (!best || item.href.length > best.item.href.length) best = entry;
  }
  return best;
}

/** Look up a nav item by its href, e.g. to drive a page-header breadcrumb.
 * Aceita lista plana ou seções e procura também nos filhos. */
export function navItem(nav: Nav, href: string): NavLinkItem | undefined {
  return flattenNav(nav).find((item) => item.href === href);
}

/** O cookie que o primitivo grava a cada troca (SIDEBAR_COOKIE_NAME em
 * ui/sidebar.tsx). O app lê no servidor, ou antes da pintura, e passa o
 * resultado em defaultOpen. */
export const SIDEBAR_COOKIE = "sidebar_state";

/** "true" e "false" são os dois valores que o primitivo grava. Ausente ou
 * qualquer outro valor cai no fallback, aberto por padrão: a primeira visita
 * abre a sidebar. */
export function readSidebarOpen(
  value: string | undefined,
  fallback = true,
): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}
