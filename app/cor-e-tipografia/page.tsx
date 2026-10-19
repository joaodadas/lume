// Vitrine /cor-e-tipografia: as escalas de cor por papel e os papéis tipográficos de docs/guia/13-cor-e-tipografia.md, com as strings de classe da registry. Arquivo do site, fora da registry.
"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";

import { SiteNav } from "@/components/site-nav";
import { navTile } from "@/registry/base-vega/blocks/app-shell/nav";
import { CodeBlock } from "@/registry/base-vega/components/code-block";
import { Notice } from "@/registry/base-vega/components/notice";
import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Kbd } from "@/registry/base-vega/ui/kbd";

const NEUTRA = [
  { papel: "Canvas", classe: "bg-sidebar" },
  { papel: "Página", classe: "bg-background" },
  { papel: "Superfície", classe: "bg-card" },
  { papel: "Chip, skeleton", classe: "bg-muted" },
  { papel: "Ativo na navegação", classe: "bg-sidebar-accent" },
  { papel: "Divisória", classe: "bg-border" },
  { papel: "Anel de foco", classe: "bg-ring" },
  { papel: "Texto secundário", classe: "bg-muted-foreground" },
  { papel: "Sólido", classe: "bg-neutral-800 dark:bg-neutral-100" },
  { papel: "Texto principal", classe: "bg-foreground" },
] as const;

// Uma string completa por cor e por papel, para o Tailwind enxergar cada classe.
const CROMATICA = [
  {
    cor: "emerald",
    significado: "ok, pass",
    tile: navTile("emerald"),
    texto: "text-emerald-600 dark:text-emerald-400",
    solido: "bg-emerald-500",
  },
  {
    cor: "green",
    significado: "escala de calor",
    tile: null,
    texto: "text-green-600 dark:text-green-400",
    solido: "bg-green-500",
  },
  {
    cor: "rose",
    significado: "erro, falha",
    tile: navTile("rose"),
    texto: "text-rose-600 dark:text-rose-400",
    solido: "bg-rose-500",
  },
  {
    cor: "red",
    significado: "contagem de erro",
    tile: null,
    texto: "text-red-600 dark:text-red-400",
    solido: "bg-red-500",
  },
  {
    cor: "amber",
    significado: "aviso, abortado",
    tile: navTile("amber"),
    texto: "text-amber-600 dark:text-amber-400",
    solido: "bg-amber-500",
  },
  {
    cor: "orange",
    significado: "agentes",
    tile: navTile("orange"),
    texto: "text-orange-600 dark:text-orange-400",
    solido: "bg-orange-500",
  },
  {
    cor: "violet",
    significado: "llm",
    tile: navTile("violet"),
    texto: "text-violet-600 dark:text-violet-400",
    solido: "bg-violet-500",
  },
  {
    cor: "blue",
    significado: "tool",
    tile: navTile("blue"),
    texto: "text-blue-600 dark:text-blue-400",
    solido: "bg-blue-500",
  },
  {
    cor: "sky",
    significado: "sessões",
    tile: navTile("sky"),
    texto: "text-sky-600 dark:text-sky-400",
    solido: "bg-sky-500",
  },
  {
    cor: "fuchsia",
    significado: "evals",
    tile: navTile("fuchsia"),
    texto: "text-fuchsia-600 dark:text-fuchsia-400",
    solido: "bg-fuchsia-500",
  },
] as const;

const PAPEIS_DE_TEXTO = [
  {
    papel: "Título de página",
    classe: "text-base font-medium tracking-tight",
    exemplo: "Traces",
  },
  {
    papel: "Título de card",
    classe: "font-heading text-base leading-normal font-medium",
    exemplo: "Custo por modelo",
  },
  {
    papel: "Título de seção",
    classe: "text-sm font-medium",
    exemplo: "Uso por modelo",
  },
  {
    papel: "Título de auth",
    classe: "text-xl font-medium text-balance",
    exemplo: "Entre na sua conta",
  },
  {
    papel: "Corpo",
    classe: "text-sm",
    exemplo: "As chamadas das últimas 24 horas, agrupadas por modelo.",
  },
  {
    papel: "Texto de apoio",
    classe: "text-sm text-muted-foreground text-balance",
    exemplo: "Escolha um período para comparar com o anterior.",
  },
  {
    papel: "Descrição curta",
    classe: "text-xs text-muted-foreground text-pretty",
    exemplo: "Últimos 30 dias",
  },
  {
    papel: "Rótulo de campo",
    classe: "text-sm leading-none font-medium",
    exemplo: "E-mail",
  },
  {
    papel: "Valor e delta",
    classe: "tracking-tight tabular-nums",
    exemplo: "R$ 1.284,90",
  },
  {
    papel: "Código e id",
    classe: "font-mono text-xs text-foreground",
    exemplo: "tr_8f2a91c4",
  },
  {
    papel: "Link em texto",
    classe: "font-medium text-primary underline underline-offset-2",
    exemplo: "Ver documentação",
  },
  {
    papel: "Eyebrow (site)",
    classe:
      "font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
    exemplo: "Guia",
  },
  {
    papel: "Display (marketing)",
    classe: "font-display text-3xl font-[450] tracking-[-0.025em] text-balance",
    exemplo: "Observabilidade para agentes",
  },
] as const;

const SNIPPET_SECAO = `<section className="flex flex-col gap-3">
  <div className={cn("flex flex-wrap items-end justify-between gap-2", PX)}>
    <div className="flex flex-col gap-0.5">
      <h2 className="text-sm font-medium">Uso por modelo</h2>
      <p className="text-xs text-muted-foreground text-pretty">Últimos 30 dias</p>
    </div>
    <Button variant="outline" size="sm">Exportar</Button>
  </div>
</section>`;

function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-medium">{titulo}</h2>
        <p className="text-xs text-muted-foreground text-pretty">{descricao}</p>
      </div>
      {children}
    </section>
  );
}

function Classe({ children }: { children: string }) {
  return (
    <code className="font-mono text-[11px] break-all text-muted-foreground">
      {children}
    </code>
  );
}

export default function CorETipografiaPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      <main className="container mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
            Cor e tipografia
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground text-pretty">
            O papel de cada degrau de cor e de cada texto, com a classe que a
            registry usa. A regra completa está no capítulo 13 do guia.
          </p>
        </div>

        <Secao
          titulo="Escala neutra"
          descricao="Tokens em degraus da paleta neutral; a hierarquia vem só da luminância."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {NEUTRA.map((n) => (
              <div key={n.papel} className="flex min-w-0 flex-col gap-1.5">
                <div
                  className={cn(
                    "h-14 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow)",
                    n.classe,
                  )}
                />
                <span className="text-xs font-medium">{n.papel}</span>
                <Classe>{n.classe}</Classe>
              </div>
            ))}
          </div>
        </Secao>

        <Secao
          titulo="Escala cromática"
          descricao="Seis degraus com papel, cada um com o espelho no dark: tile 100/950 com glifo 500, badge 500/10 e 700/300, texto 600/400, sólido 500."
        >
          <div className="overflow-x-auto">
            <div className="flex min-w-[36rem] flex-col divide-y divide-border/40">
              <div className="grid grid-cols-[8rem_1fr_1fr_1fr_1fr] items-center gap-4 pb-2 text-xs text-muted-foreground">
                <span>Cor</span>
                <span>Tile 100 / 950</span>
                <span>Badge 500/10</span>
                <span>Texto 600 / 400</span>
                <span>Sólido 500</span>
              </div>
              {CROMATICA.map((c) => (
                <div
                  key={c.cor}
                  className="grid grid-cols-[8rem_1fr_1fr_1fr_1fr] items-center gap-4 py-2.5"
                >
                  <span className="flex flex-col">
                    <span className="font-mono text-xs">{c.cor}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.significado}
                    </span>
                  </span>
                  {c.tile ? (
                    <IconCircleCheckFilled className={cn("size-4.5", c.tile)} />
                  ) : (
                    <span className="text-xs text-muted-foreground/50">
                      sem tile
                    </span>
                  )}
                  <Badge variant={c.cor}>
                    <IconCircleCheckFilled />
                    {c.cor}
                  </Badge>
                  <span className={cn("text-sm tabular-nums", c.texto)}>
                    12 falhas
                  </span>
                  <span className={cn("size-2.5 rounded-full", c.solido)} />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Notice tone="warning" title="Aviso" className="px-0 md:px-0">
              Parágrafo em caixa tingida, texto 900 / 200.
            </Notice>
            <Notice tone="error" title="Erro" className="px-0 md:px-0">
              A mesma regra no tom de erro.
            </Notice>
            <Notice tone="info" title="Info" className="px-0 md:px-0">
              E no tom de informação.
            </Notice>
          </div>
        </Secao>

        <Secao
          titulo="Papéis tipográficos"
          descricao="Inter no app, Host Grotesk só no marketing, Geist Mono para código e eyebrow; peso máximo 500 no app."
        >
          <div className="flex flex-col divide-y divide-border/40">
            {PAPEIS_DE_TEXTO.map((p) => (
              <div
                key={p.papel}
                className="grid gap-1.5 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <span className="text-xs text-muted-foreground">{p.papel}</span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={p.classe}>{p.exemplo}</span>
                  <Classe>{p.classe}</Classe>
                </div>
              </div>
            ))}
            <div className="grid gap-1.5 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <span className="text-xs text-muted-foreground">Tecla</span>
              <span className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </span>
            </div>
          </div>
        </Secao>

        <Secao
          titulo="Snippet de layout"
          descricao="Sem Flex, Grid ou Container como componente: o molde é a string de classe, copiada da registry."
        >
          <CodeBlock code={SNIPPET_SECAO} />
        </Secao>
      </main>
    </div>
  );
}
