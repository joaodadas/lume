// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: só PageHeader e PageHeaderBack (linhas 45-133 do upstream); Link da indireção (@/registry/base-vega/components/link) no lugar de next/link e href string no lugar do tipo Route; gutter PX ("px-4 md:px-8", do painel) no lugar do px-8 fixo; o resto das classes verbatim.
"use client";

import { type Icon, IconChevronRight } from "@tabler/icons-react";

import { useHeaderActionsSlot } from "@/registry/base-vega/components/header-slot";
import { Link } from "@/registry/base-vega/components/link";
import { cn } from "@/registry/base-vega/lib/utils";

/** Margem lateral da página: a mesma do Foglamp no desktop (px-8, 32px),
 * menor no celular. Todo bloco que encosta na borda da página usa isto
 * (PageHeader, StatGrid, Section, Notice), nunca um px-* próprio. */
export const PX = "px-4 md:px-8";

/**
 * A clickable parent crumb rendered before the page title, e.g. an "Evals"
 * link that takes the user back to the list. Pairs the section's nav icon with
 * its label; the shape is a subset of `NavItem`, so a nav entry can be passed
 * straight through.
 */
export type PageHeaderBack = {
  href: string;
  label: string;
  icon: Icon;
  iconClassName?: string;
};

export function PageHeader({
  title,
  titleLeading,
  titleTrailing,
  description,
  actions,
  back,
  icon: TitleIcon,
  iconClassName,
}: {
  title: string;
  /** Inline element rendered right before the title (e.g. an agent's colored
   * icon), sitting after the breadcrumb chevron when `back` is set. */
  titleLeading?: React.ReactNode;
  /** Inline element rendered right after the title (e.g. a copy-id button). */
  titleTrailing?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** When set, renders a `[icon] Label › Title` breadcrumb instead of a plain
   * title — the icon + label link back to the parent page. */
  back?: PageHeaderBack;
  /** Section icon rendered before the title (e.g. the nav icon on a list page).
   * Ignored when `back` is set, since the breadcrumb already shows an icon. */
  icon?: Icon;
  iconClassName?: string;
}) {
  const BackIcon = back?.icon;
  // Sem HeaderActionsSlotProvider acima, o slot é null e o header funciona
  // igual; só a Toolbar perde o lugar para portalar as ações.
  const slot = useHeaderActionsSlot();
  return (
    // h-8 (not h-7) so action buttons — the h-8 RangePicker — fit without
    // overflowing the line, which shifted content below by ~4px whenever a
    // header had actions.
    <div
      className={cn("flex flex-wrap items-end justify-between gap-4 h-8", PX)}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        {back && BackIcon ? (
          <h1 className="flex items-center gap-1.5 text-base font-medium tracking-tight">
            <Link
              href={back.href}
              className="flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <BackIcon
                className={cn("size-4.5 shrink-0", back.iconClassName)}
              />
              {back.label}
            </Link>
            <IconChevronRight className="size-4 shrink-0 text-muted-foreground/50 stroke-[1.5px]" />
            {titleLeading}
            <span className="truncate">{title}</span>
            {titleTrailing}
          </h1>
        ) : (
          <h1 className="flex items-center gap-2 text-base font-medium tracking-tight">
            {TitleIcon && (
              <TitleIcon className={cn("size-4.5 shrink-0", iconClassName)} />
            )}
            {titleLeading}
            <span className="truncate">{title}</span>
            {titleTrailing}
          </h1>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {/* Always rendered (even without actions) so a Toolbar can portal its
          trailing controls here when they'd wrap — see header-slot.tsx.
          Nudged down so the picker lines up with the title text. */}
      <div
        ref={slot?.setEl}
        className="flex items-center gap-2 translate-y-1 empty:hidden"
      >
        {actions}
      </div>
    </div>
  );
}
