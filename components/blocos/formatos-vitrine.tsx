// O seletor de formato da vitrine /blocos e a demo de cada formato. A escolha
// mora na URL (?formato=); a moldura mostra o formato no desktop e o iframe de
// 390 px mostra o mesmo formato no celular de verdade, porque o useIsMobile lê
// a janela do iframe. Arquivo do site, não entra na registry.
"use client";

import { IconArrowsMaximize } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AgentDemo } from "@/components/blocos/agent-demo";
import { DashboardDemo } from "@/components/blocos/dashboard-demo";
import { DemoFrame, DemoFrameFallback } from "@/components/blocos/demo-frame";
import { Segmentado } from "@/components/blocos/demo-kit";
import {
  FORMATOS,
  type Formato,
  formatoDe,
} from "@/components/blocos/formatos";
import { MuralDemo, TopbarDemo } from "@/components/blocos/topbar-demo";
import { Button } from "@/registry/base-vega/ui/button";

const OPTIONS = FORMATOS.map((item) => ({ id: item.id, label: item.nome }));

/** A demo de um formato. Na tela cheia, a travessia entre zonas (Agente e
 * Início) vai para a rota de tela cheia do outro formato; na moldura, para a
 * vitrine com o outro formato escolhido. As duas são navegação inteira. */
export function FormatoDemo({
  formato,
  telaCheia = false,
}: {
  formato: Formato;
  telaCheia?: boolean;
}) {
  const href = (destino: Formato) =>
    telaCheia ? `/blocos/${destino}` : `/blocos?formato=${destino}`;
  switch (formato) {
    case "lateral":
      return <DashboardDemo />;
    case "trilho":
      return <DashboardDemo defaultOpen={false} />;
    case "agente":
      return <AgentDemo inicioHref={href("barra")} />;
    case "barra":
      return <TopbarDemo agenteHref={href("agente")} />;
    case "mural":
      return <MuralDemo />;
  }
}

/** Seletor, moldura, iframe de 390 px e o link para a tela cheia. Lê
 * useSearchParams, então vai dentro de um Suspense (Cache Components). */
export function FormatosVitrine() {
  const searchParams = useSearchParams();
  const formato = formatoDe(searchParams.get("formato"));
  const info = FORMATOS.find((item) => item.id === formato) ?? FORMATOS[0];

  const choose = (next: Formato) => {
    // A query atual vem da janela: os filtros da tabela (useUrlFilters)
    // escrevem nela sem passar pelo roteador. O hash era rota da demo que sai.
    const params = new URLSearchParams(window.location.search);
    params.set("formato", next);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Segmentado
          label="Formato"
          value={formato}
          onChange={choose}
          options={OPTIONS}
        />
        <code className="font-mono text-xs text-muted-foreground">
          {info.props}
        </code>
      </div>
      <p className="max-w-prose text-sm text-muted-foreground text-pretty">
        {info.resumo}
      </p>

      {/* key: cada formato monta a própria demo (defaultOpen só vale na
          montagem, e as rotas em hash de uma não servem para a outra). */}
      <DemoFrame>
        <FormatoDemo key={formato} formato={formato} />
      </DemoFrame>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        {/* 390 px é a largura de um iPhone: abaixo dos 768 px do useIsMobile,
            o iframe mostra o celular real. A altura é a da moldura. */}
        <div className="w-[390px] max-w-full shrink-0 overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-sidebar shadow-(--custom-shadow-chrome)">
          <iframe
            // key: um iframe novo por formato, para a troca não empilhar
            // entradas no histórico da página.
            key={formato}
            src={`/blocos/${formato}`}
            title={`Formato ${info.nome} no celular`}
            loading="lazy"
            className="block h-[720px] w-full"
          />
        </div>
        <div className="flex max-w-prose flex-col items-start gap-2">
          <h2 className="text-sm font-medium">No celular</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Abaixo de 768 px os dois layouts viram o mesmo celular: o cabeçalho
            no cartão, com o gatilho, a marca e a página atual, e a gaveta de
            3/4 da tela (até 24rem) com itens de 44 px. As zonas da barra entram
            na gaveta como seções.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            render={<Link href={`/blocos/${formato}`} />}
          >
            <IconArrowsMaximize />
            Abrir em tela cheia
          </Button>
        </div>
      </div>
    </section>
  );
}

/** O que o Suspense mostra até a vitrine chegar: as mesmas alturas, vazias,
 * inclusive a linha do iframe, para o conteúdo abaixo não saltar na
 * hidratação. */
export function FormatosVitrineFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="h-8.5" />
      <div className="h-10" />
      <DemoFrameFallback />
      <div className="mt-6 h-[720px]" />
    </div>
  );
}
