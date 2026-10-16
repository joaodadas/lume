// Documento do /guia: FRONTEND.md ("frontend"), docs/guia/* ("guia/<x>"),
// docs/conceitos/* ("conceitos/<x>"), docs/adocao/* ("adocao/<x>"),
// docs/referencias.md ("referencias") e docs/DECISOES.md ("decisoes").
// generateStaticParams lista todos os arquivos, então cada rota é estática;
// slug desconhecido cai em notFound (Cache Components não aceita
// dynamicParams = false).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { lerDoc, listarDocs } from "@/components/guia/docs";
import { GuiaShell } from "@/components/guia/guia-shell";
import { DocMarkdown } from "@/components/guia/markdown";

type Params = { slug: string[] };

export function generateStaticParams(): Params[] {
  return listarDocs().map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resultado = lerDoc(slug.join("/"));
  if (!resultado) return { title: "Guia" };
  return {
    title: resultado.doc.titulo,
    description: resultado.doc.descricao || undefined,
  };
}

export default async function GuiaDocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resultado = lerDoc(slug.join("/"));
  if (!resultado) notFound();
  const { doc, markdown } = resultado;

  return (
    <GuiaShell ativo={doc.slug}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          <Link
            href="/guia"
            className="transition-colors hover:text-foreground"
          >
            Guia
          </Link>
          <span aria-hidden="true">/</span>
          <span>{doc.grupo}</span>
          <a
            href={`https://github.com/joaodadas/lume/blob/main/${doc.arquivo}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto normal-case tracking-normal transition-colors hover:text-foreground"
          >
            {doc.arquivo}
          </a>
        </div>
        <DocMarkdown doc={doc} markdown={markdown} />
      </div>
    </GuiaShell>
  );
}
