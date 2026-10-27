// Tela cheia de um formato da vitrine: a demo em h-svh, sem moldura, com o
// fixed real da sidebar. É a rota que o iframe de 390 px da /blocos carrega e
// a base das capturas em 1440 e 390.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FORMATOS, isFormato } from "@/components/blocos/formatos";
import { FormatoDemo } from "@/components/blocos/formatos-vitrine";

type Props = { params: Promise<{ formato: string }> };

// Os cinco formatos saem pré-renderizados no build. Com Cache Components não
// existe dynamicParams: formato desconhecido cai no notFound abaixo.
export function generateStaticParams() {
  return FORMATOS.map(({ id }) => ({ formato: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { formato } = await params;
  const info = FORMATOS.find((item) => item.id === formato);
  if (!info) return {};
  return { title: `Formato ${info.nome}`, description: info.resumo };
}

// params fica dentro do Suspense: o App Shell da rota é o mesmo para os cinco
// formatos, e a navegação vinda da vitrine pinta o canvas na hora. As demos
// também leem o relógio (range-picker e bar-chart), que o Cache Components só
// aceita dentro de um Suspense.
export default function FormatoPage({ params }: Props) {
  return (
    <Suspense fallback={<div aria-hidden className="h-svh bg-sidebar" />}>
      <Formato params={params} />
    </Suspense>
  );
}

async function Formato({ params }: Props) {
  const { formato } = await params;
  if (!isFormato(formato)) notFound();
  return <FormatoDemo formato={formato} telaCheia />;
}
