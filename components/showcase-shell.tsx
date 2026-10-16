// Casca da vitrine /componentes: seção com âncora, coluna de variante, linha de tamanho e o sumário lateral. Derivada do showcase-shell.tsx do boilerplate (João Vitor Dadas), sem upstream no Foglamp.
import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";

export type ShowcaseSection = {
  id: string;
  nome: string;
};

// Cada seção recebe o id em slug (a âncora do sumário) e um nome curto. O
// nome fica sticky à esquerda em telas largas; o conteúdo quebra em colunas.
// Divisor interno em border-b border-border/40, nunca borda fechando caixa.
export function ComponentSection({
  id,
  name,
  description,
  children,
}: {
  id: string;
  name: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="grid scroll-mt-20 grid-cols-1 gap-6 border-b border-border/40 py-10 lg:grid-cols-[200px_1fr]"
    >
      <div className="lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-heading text-base font-medium text-foreground">
          {name}
        </h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-6">{children}</div>
    </section>
  );
}

export function VariantColumn({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-[180px] flex-col gap-3", className)}>
      <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </div>
      <div className="flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}

export function SizeRow({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <span className="text-[10px] text-muted-foreground/80">{label}</span>
      ) : null}
      <div className="flex w-full items-center">{children}</div>
    </div>
  );
}

// Sumário lateral: lista de âncoras para as seções, sticky em telas largas.
// Só links, sem estado; o navegador cuida do scroll e do :target.
export function ShowcaseToc({
  sections,
  className,
}: {
  sections: readonly ShowcaseSection[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Seções"
      className={cn(
        "flex flex-col gap-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground"
        >
          {s.nome}
        </a>
      ))}
    </nav>
  );
}
