// Sumário lateral do /guia: documentos agrupados (Regras, Guia, Conceitos,
// Adoção, Referências, Decisões), com o ativo marcado por aria-current. Server
// component: o slug ativo vem dos params, sem hook de rota. Arquivo do site.
import Link from "next/link";

import { docsPorGrupo } from "@/components/guia/docs";
import { cn } from "@/registry/base-vega/lib/utils";

export function Sumario({
  ativo,
  className,
}: {
  /** Slug do documento aberto; vazio no índice. */
  ativo?: string;
  className?: string;
}) {
  const grupos = docsPorGrupo();
  return (
    <nav
      aria-label="Documentos"
      className={cn("flex flex-col gap-5 text-xs", className)}
    >
      <Link
        href="/guia"
        aria-current={ativo ? undefined : "page"}
        className={cn(
          "rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground",
          ativo ? "text-muted-foreground" : "bg-muted text-foreground",
        )}
      >
        Índice
      </Link>
      {grupos.map(({ grupo, docs }) => (
        <div key={grupo} className="flex flex-col gap-1">
          <div className="px-2 font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {grupo}
          </div>
          {docs.map((d) => {
            const atual = d.slug === ativo;
            return (
              <Link
                key={d.slug}
                href={`/guia/${d.slug}`}
                aria-current={atual ? "page" : undefined}
                className={cn(
                  "truncate rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground",
                  atual ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                {d.titulo}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
