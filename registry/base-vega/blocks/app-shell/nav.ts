// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/nav.ts e apps/web/src/components/app/app-shell.tsx:208-211 @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: a tabela de rotas do Foglamp saiu (cada app passa a sua), href vira string em vez de Route do Next, a receita do tile virou navTile(cor) com as nove cores por extenso, isActive veio do app-shell e ganhou o flag exact no lugar do caso fixo de /settings.
import type { Icon } from "@tabler/icons-react";

export type NavItem = {
  /** Rota escrita como string ("/pedidos"), nunca o tipo Route do Next. */
  href: string;
  label: string;
  /** Outline icon, shown when the tab is inactive. */
  icon: Icon;
  /** Filled icon, shown when the tab is active. */
  activeIcon: Icon;
  /** Optional Tailwind class(es) for the icon, e.g. "text-blue-500". */
  iconClassName?: string;
  /** Só casa o pathname exato. Use quando um item é prefixo de outro, como
   * "/configuracoes" ao lado de "/configuracoes/equipe" (o caso que no Foglamp
   * era fixo em código para /settings). */
  exact?: boolean;
};

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

/** Look up a nav item by its href, e.g. to drive a page-header breadcrumb. */
export function navItem(items: NavItem[], href: string): NavItem | undefined {
  return items.find((item) => item.href === href);
}
