// Grade de StatCards com container query, do GradeDeNumeros do painel do lyx-pr-agent (João Vitor Dadas); não existe no Foglamp, que repete o grid em cada página.

import { PX } from "@/registry/base-vega/components/page-header";
import { cn } from "@/registry/base-vega/lib/utils";

/**
 * Fileira de cartões de número. As colunas seguem a largura da área de
 * conteúdo (container query), não a da janela, que não sabe da barra lateral.
 * Quatro colunas só quando cada cartão fica com pelo menos ~236 px (62rem de
 * área); com a barra lateral aberta isso dá ~1290 px de janela, perto do `xl`
 * que o Foglamp usa. Abaixo, 2 colunas; abaixo de 32rem (@lg), 1. Com
 * columns = 3: 1 ou 3 (a partir de 42rem, @2xl). O gutter é o PX da página.
 */
export function StatGrid({
  columns = 4,
  className,
  children,
}: {
  columns?: 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("@container", PX, className)}>
      <div
        className={cn(
          "grid gap-4",
          columns === 4
            ? "@lg:grid-cols-2 @min-[62rem]:grid-cols-4"
            : "@2xl:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}
