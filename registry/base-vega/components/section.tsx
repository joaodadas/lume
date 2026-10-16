// Título de seção dentro da página, do Secao do painel do lyx-pr-agent (João Vitor Dadas); não existe no Foglamp, que repete o cabeçalho de seção inline.

import { PX } from "@/registry/base-vega/components/page-header";
import { cn } from "@/registry/base-vega/lib/utils";

/** Bloco de seção: cabeçalho (h2 text-sm font-medium, descrição text-xs e
 * ações à direita) com o gutter PX e os filhos abaixo, em coluna com gap-3.
 * Os filhos cuidam do próprio gutter (StatGrid e tabelas já o têm), por isso
 * só o cabeçalho leva PX. */
export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className={cn("flex flex-wrap items-end justify-between gap-2", PX)}>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-medium">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground text-pretty">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
