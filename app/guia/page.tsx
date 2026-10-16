// Índice do /guia: todos os documentos agrupados, cada um com a descrição de
// uma linha lida do primeiro parágrafo do arquivo. Rota estática: lê os .md
// com node:fs em build e não toca em relógio nem request.
import { IconFileText } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { docsPorGrupo } from "@/components/guia/docs";
import { GuiaShell } from "@/components/guia/guia-shell";

export const metadata: Metadata = {
  title: "Guia",
  description:
    "As regras do FRONTEND.md, o guia longo, os conceitos do craft, os roteiros de adoção, as referências e as decisões do lume.",
};

export default function GuiaIndexPage() {
  const grupos = docsPorGrupo();
  return (
    <GuiaShell>
      <div className="flex flex-col gap-2 pb-8">
        <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
          Guia
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground text-pretty">
          Tudo o que dev e agente leem antes de escrever uma tela com o lume: as
          regras duras do FRONTEND.md, o guia longo com valores e tabelas, os
          conceitos do craft, os roteiros de adoção, as referências e o registro
          de decisões. A mesma fonte vai cru em{" "}
          <Link
            href="/guia.md"
            className="font-medium text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
          >
            /guia.md
          </Link>{" "}
          e o índice para agentes em{" "}
          <Link
            href="/llms.txt"
            className="font-medium text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
          >
            /llms.txt
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {grupos.map(({ grupo, docs }) => (
          <section key={grupo} className="flex flex-col gap-3">
            <h2 className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {grupo}
            </h2>
            <ul className="flex flex-col divide-y divide-border/40">
              {docs.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/guia/${d.slug}`}
                    className="group flex items-start gap-3 rounded-md py-3 transition-colors hover:bg-muted/50 sm:-mx-2 sm:px-2"
                  >
                    <IconFileText className="mt-0.5 size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium tracking-tight text-foreground">
                        {d.titulo}
                      </span>
                      {d.descricao ? (
                        <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                          {d.descricao}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </GuiaShell>
  );
}
