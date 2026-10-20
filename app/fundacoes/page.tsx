// Fundações (/fundacoes): escalas de cor e tipografia na versão para pessoas, exemplo renderizado, faça e evite e código à parte. A versão para agentes é docs/guia/13-cor-e-tipografia.md, que vira a skill. Arquivo do site, fora da registry.
"use client";

import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";

import { ShowcaseToc } from "@/components/showcase-shell";
import { SiteNav } from "@/components/site-nav";
import { navTile } from "@/registry/base-vega/blocks/app-shell/nav";
import { CodeBlock } from "@/registry/base-vega/components/code-block";
import { Notice } from "@/registry/base-vega/components/notice";
import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Button } from "@/registry/base-vega/ui/button";
import { Input } from "@/registry/base-vega/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/base-vega/ui/tabs";

const SECOES = [
  { id: "neutra", nome: "Escala neutra" },
  { id: "cromatica", nome: "Escala cromática" },
  { id: "estados", nome: "Estados" },
  { id: "familias", nome: "Famílias" },
  { id: "tamanhos", nome: "Tamanhos" },
  { id: "papeis", nome: "Papéis de texto" },
  { id: "snippets", nome: "Snippets" },
] as const;

const NEUTRA = [
  { papel: "Canvas", token: "bg-sidebar" },
  { papel: "Página", token: "bg-background" },
  { papel: "Superfície", token: "bg-card" },
  { papel: "Chip e skeleton", token: "bg-muted" },
  { papel: "Item ativo", token: "bg-sidebar-accent" },
  { papel: "Divisória", token: "bg-border" },
  { papel: "Anel de foco", token: "bg-ring" },
  { papel: "Texto secundário", token: "bg-muted-foreground" },
  { papel: "Sólido", token: "bg-neutral-800 dark:bg-neutral-100" },
  { papel: "Texto principal", token: "bg-foreground" },
] as const;

// Uma string completa por cor e por papel, para o Tailwind enxergar cada classe.
const CORES = [
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

const TAMANHOS = [
  { classe: "text-[10px]", px: "10", papel: "badge sm" },
  { classe: "text-[11px]", px: "11", papel: "eyebrow mono" },
  { classe: "text-xs", px: "12", papel: "meta, legenda, badge", app: true },
  { classe: "text-[13px]", px: "13", papel: "valor denso de painel" },
  { classe: "text-sm", px: "14", papel: "corpo, rótulo, seção", app: true },
  { classe: "text-base", px: "16", papel: "título de página e card" },
  { classe: "text-lg", px: "18", papel: "corpo de marketing" },
  { classe: "text-xl", px: "20", papel: "título de auth" },
  { classe: "font-display text-3xl", px: "30", papel: "display, fora do app" },
] as const;

const PAPEIS = [
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
    papel: "Corpo",
    classe: "text-sm",
    exemplo: "As chamadas das últimas 24 horas, por modelo.",
  },
  {
    papel: "Texto de apoio",
    classe: "text-sm text-muted-foreground text-balance",
    exemplo: "Escolha um período para comparar.",
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
    papel: "Valor de métrica",
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
] as const;

const VALORES = ["1.284,90", "87,10", "12.030,00"];

const CODIGO_SECAO = `<section className="flex flex-col gap-3">
  <div className={cn("flex flex-wrap items-end justify-between gap-2", PX)}>
    <div className="flex flex-col gap-0.5">
      <h2 className="text-sm font-medium">Uso por modelo</h2>
      <p className="text-xs text-muted-foreground text-pretty">Últimos 30 dias</p>
    </div>
    <Button variant="outline" size="sm">Exportar</Button>
  </div>
</section>`;

const CODIGO_GRADE = `<section className={cn("@container", PX)}>
  <div className="grid gap-4 @lg:grid-cols-2 @min-[62rem]:grid-cols-4">
    <StatCard size="sm" ... />
  </div>
</section>`;

const CODIGO_PAR = `<div className="grid grid-cols-2 gap-4">
  <div className="flex min-w-0 flex-col gap-1">
    <span className="text-xs text-muted-foreground">Modelo</span>
    <span className="text-sm tabular-nums">gpt-5</span>
  </div>
</div>`;

const CODIGO_CITACAO = `<blockquote className="border-l-2 border-border/50 pl-3 text-sm text-muted-foreground text-pretty">
  A frase citada.
</blockquote>`;

function Secao({
  id,
  numero,
  titulo,
  orientacao,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  orientacao: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-20 flex-col gap-6 border-b border-border/40 py-10 first:pt-0 last:border-b-0"
    >
      <header className="flex max-w-prose flex-col gap-1.5">
        <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {numero}
        </p>
        <h2 className="font-heading text-base font-medium">{titulo}</h2>
        <p className="text-sm text-muted-foreground text-pretty">
          {orientacao}
        </p>
      </header>
      {children}
    </section>
  );
}

function Codigo({ children }: { children: string }) {
  return (
    <code className="w-fit rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] break-all text-muted-foreground">
      {children}
    </code>
  );
}

function Palco({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-28 items-center justify-center rounded-lg squircle:rounded-3xl corner-squircle bg-card p-6 shadow-(--custom-shadow)",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FacaEvite({
  faca,
  evite,
}: {
  faca: { visual: React.ReactNode; texto: string };
  evite: { visual: React.ReactNode; texto: string };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { ...faca, ok: true },
        { ...evite, ok: false },
      ].map((caso) => (
        <figure key={String(caso.ok)} className="flex flex-col gap-3">
          <Palco>{caso.visual}</Palco>
          <figcaption className="flex items-start gap-2 text-sm text-pretty">
            {caso.ok ? (
              <IconCircleCheckFilled className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            ) : (
              <IconCircleXFilled className="mt-0.5 size-4 shrink-0 text-rose-500" />
            )}
            <span>
              <span className="font-medium">
                {caso.ok ? "Faça." : "Evite."}
              </span>{" "}
              <span className="text-muted-foreground">{caso.texto}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function PreviaECodigo({
  titulo,
  codigo,
  children,
}: {
  titulo: string;
  codigo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{titulo}</h3>
      <Tabs defaultValue="previa">
        <TabsList>
          <TabsTrigger value="previa">Prévia</TabsTrigger>
          <TabsTrigger value="codigo">Código</TabsTrigger>
        </TabsList>
        <TabsContent value="previa">
          <Palco>
            <div className="w-full">{children}</div>
          </Palco>
        </TabsContent>
        <TabsContent value="codigo">
          <CodeBlock code={codigo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Estado({
  nome,
  classe,
  children,
}: {
  nome: string;
  classe: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <Palco className="min-h-24 p-4">{children}</Palco>
      <figcaption className="flex flex-col gap-1">
        <span className="text-xs font-medium">{nome}</span>
        <Codigo>{classe}</Codigo>
      </figcaption>
    </figure>
  );
}

export default function FundacoesPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      <main className="container mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 pb-10">
          <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
            Fundações
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground text-pretty">
            Escalas de cor e tipografia: qual cinza, qual cor e qual texto usar
            em cada lugar, com o exemplo ao lado. Nada aqui é componente novo:
            são os tokens e as classes que a registry já usa.
          </p>
          <aside className="flex max-w-prose flex-col gap-1 rounded-lg squircle:rounded-3xl corner-squircle bg-muted/50 px-4 py-3 text-sm">
            <span className="font-medium">Esta página é para pessoas.</span>
            <span className="text-muted-foreground text-pretty">
              Agentes leem as mesmas regras em tabela no{" "}
              <a
                href="https://github.com/joaodadas/lume/blob/main/docs/guia/13-cor-e-tipografia.md"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
              >
                capítulo 13 do guia
              </a>
              , que vira a skill lume-design-engineering.
            </span>
          </aside>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[160px_1fr]">
          <aside className="hidden lg:block">
            <ShowcaseToc sections={SECOES} className="sticky top-20" />
          </aside>

          <div className="flex min-w-0 flex-col">
            <Secao
              id="neutra"
              numero="01"
              titulo="Escala neutra"
              orientacao="Cinza é estrutura. A hierarquia vem só da claridade: escolha o token pelo papel, nunca pelo número da paleta."
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-5">
                {NEUTRA.map((n) => (
                  <figure key={n.papel} className="flex min-w-0 flex-col gap-2">
                    <div
                      className={cn(
                        "h-16 rounded-md squircle:rounded-2xl corner-squircle shadow-(--custom-shadow)",
                        n.token,
                      )}
                    />
                    <figcaption className="flex flex-col gap-1">
                      <span className="text-xs font-medium">{n.papel}</span>
                      <Codigo>{n.token}</Codigo>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <FacaEvite
                faca={{
                  visual: (
                    <div className="rounded-lg squircle:rounded-3xl corner-squircle bg-card px-5 py-4 text-sm shadow-(--custom-shadow)">
                      Superfície
                    </div>
                  ),
                  texto:
                    "Superfície no token de card, separada da página pela claridade e pela aresta de sombra.",
                }}
                evite={{
                  visual: (
                    <div className="rounded-lg border border-zinc-400 bg-zinc-200 px-5 py-4 text-sm text-zinc-800">
                      Superfície
                    </div>
                  ),
                  texto:
                    "Cinza de outra paleta e borda fechando a caixa: destoa dos tokens e não acompanha o dark.",
                }}
              />
            </Secao>

            <Secao
              id="cromatica"
              numero="02"
              titulo="Escala cromática"
              orientacao="Cor é significado. Toda cor usa os mesmos degraus, cada um com o seu par no dark; o resto da paleta não tem papel."
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-5">
                <Estado
                  nome="Tile, 100 e 950"
                  classe="bg-rose-100 dark:bg-rose-950"
                >
                  <IconCircleCheckFilled
                    className={cn("size-6", navTile("rose"))}
                  />
                </Estado>
                <Estado
                  nome="Fundo 500 a 10%"
                  classe="bg-rose-500/10 text-rose-700"
                >
                  <Badge variant="rose">
                    <IconAlertTriangleFilled />
                    Erro
                  </Badge>
                </Estado>
                <Estado
                  nome="Texto, 600 e 400"
                  classe="text-rose-600 dark:text-rose-400"
                >
                  <span className="text-sm text-rose-600 tabular-nums dark:text-rose-400">
                    12 falhas
                  </span>
                </Estado>
                <Estado nome="Sólido, 500" classe="bg-rose-500">
                  <span className="size-3 rounded-full bg-rose-500" />
                </Estado>
                <Estado
                  nome="Parágrafo, 900 e 200"
                  classe="text-rose-900 dark:text-rose-200"
                >
                  <Notice tone="error" title="Falha" className="px-0 md:px-0" />
                </Estado>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-normal">Cor</th>
                      <th className="pb-2 font-normal">Tile</th>
                      <th className="pb-2 font-normal">Badge</th>
                      <th className="pb-2 font-normal">Texto</th>
                      <th className="pb-2 font-normal">Sólido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {CORES.map((c) => (
                      <tr key={c.cor}>
                        <td className="py-2.5">
                          <span className="flex flex-col">
                            <span className="font-mono text-xs">{c.cor}</span>
                            <span className="text-xs text-muted-foreground">
                              {c.significado}
                            </span>
                          </span>
                        </td>
                        <td>
                          {c.tile ? (
                            <IconCircleCheckFilled
                              className={cn("size-4.5", c.tile)}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground/50">
                              sem tile
                            </span>
                          )}
                        </td>
                        <td>
                          <Badge variant={c.cor}>{c.cor}</Badge>
                        </td>
                        <td className={cn("tabular-nums", c.texto)}>
                          12 falhas
                        </td>
                        <td>
                          <span
                            className={cn(
                              "block size-2.5 rounded-full",
                              c.solido,
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <FacaEvite
                faca={{
                  visual: (
                    <Badge variant="rose">
                      <IconAlertTriangleFilled />
                      Erro
                    </Badge>
                  ),
                  texto:
                    "O Badge da registry: fundo translúcido e texto escuro, legível nos dois temas.",
                }}
                evite={{
                  visual: (
                    <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-medium text-rose-800">
                      Erro
                    </span>
                  ),
                  texto:
                    "Pílula feita à mão num degrau sem papel: no dark vira um bloco claro.",
                }}
              />
            </Secao>

            <Secao
              id="estados"
              numero="03"
              titulo="Estados"
              orientacao="Estado muda fundo, anel ou opacidade, nunca o tamanho. O press em escala é só do Button."
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                <Estado nome="Repouso" classe="bg-card">
                  <Button variant="outline" size="sm">
                    Filtro
                  </Button>
                </Estado>
                <Estado nome="Hover" classe="hover:bg-muted/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-muted/50 dark:bg-muted"
                  >
                    Filtro
                  </Button>
                </Estado>
                <Estado nome="Foco" classe="focus-visible:ring-ring/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ring-[1.5px] ring-ring/50"
                  >
                    Filtro
                  </Button>
                </Estado>
                <Estado
                  nome="Selecionado"
                  classe="data-active:bg-sidebar-accent/70"
                >
                  <span className="rounded-md squircle:rounded-xl corner-squircle bg-sidebar-accent/70 px-2 py-1.5 text-sm dark:bg-sidebar-accent/50">
                    Traces
                  </span>
                </Estado>
                <Estado
                  nome="Inválido"
                  classe="aria-invalid:ring-destructive/20"
                >
                  <Input
                    aria-invalid
                    defaultValue="email@"
                    aria-label="E-mail inválido"
                    className="w-36"
                  />
                </Estado>
                <Estado nome="Desabilitado" classe="disabled:opacity-50">
                  <Button size="sm" disabled>
                    Salvar
                  </Button>
                </Estado>
              </div>
            </Secao>

            <Secao
              id="familias"
              numero="04"
              titulo="Famílias"
              orientacao="Inter faz o app inteiro. As outras famílias têm um papel só cada uma."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    nome: "Inter",
                    utility: "font-sans",
                    papel: "Todo texto do app.",
                  },
                  {
                    nome: "Inter como heading",
                    utility: "font-heading",
                    papel: "Título de Card, Dialog, Sheet e Empty.",
                  },
                  {
                    nome: "Host Grotesk",
                    utility: "font-display",
                    papel: "Só marketing e títulos do site.",
                  },
                  {
                    nome: "Geist Mono",
                    utility: "font-mono",
                    papel: "Id, chave, código e eyebrow.",
                  },
                ].map((f) => (
                  <figure key={f.utility} className="flex flex-col gap-3">
                    <Palco className="min-h-24">
                      <span className={cn("text-4xl", f.utility)}>Aa</span>
                    </Palco>
                    <figcaption className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{f.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {f.papel}
                      </span>
                      <Codigo>{f.utility}</Codigo>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Secao>

            <Secao
              id="tamanhos"
              numero="05"
              titulo="Tamanhos"
              orientacao="O app vive em 14 e 12 px. A hierarquia vem de peso, tracking e cor, não de tamanho."
            >
              <div className="flex flex-col">
                {TAMANHOS.map((t) => (
                  <div
                    key={t.classe}
                    className={cn(
                      "grid grid-cols-[3rem_1fr] items-baseline gap-4 rounded-md px-3 py-2 sm:grid-cols-[3rem_1fr_12rem]",
                      "app" in t && "bg-muted/50",
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {t.px}px
                    </span>
                    <span className={cn("truncate", t.classe)}>
                      Revisão de traces
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {t.papel}
                    </span>
                  </div>
                ))}
              </div>
              <FacaEvite
                faca={{
                  visual: (
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium tracking-tight">
                        Traces
                      </span>
                      <span className="text-sm text-muted-foreground">
                        142 nas últimas 24 horas
                      </span>
                    </div>
                  ),
                  texto: "Título em 16 px, peso médio e espaçamento justo.",
                }}
                evite={{
                  visual: (
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-bold">Traces</span>
                      <span className="text-sm text-muted-foreground">
                        142 nas últimas 24 horas
                      </span>
                    </div>
                  ),
                  texto: "Título grande e em negrito grita numa tela densa.",
                }}
              />
            </Secao>

            <Secao
              id="papeis"
              numero="06"
              titulo="Papéis de texto"
              orientacao="Cada texto tem um papel e uma string pronta na registry. Copie a string, não invente uma parecida."
            >
              <div className="flex flex-col divide-y divide-border/40">
                {PAPEIS.map((p) => (
                  <div
                    key={p.papel}
                    className="grid gap-2 py-3 sm:grid-cols-[9rem_1fr_minmax(0,16rem)] sm:items-center sm:gap-4"
                  >
                    <span className="text-xs text-muted-foreground">
                      {p.papel}
                    </span>
                    <span className={p.classe}>{p.exemplo}</span>
                    <Codigo>{p.classe}</Codigo>
                  </div>
                ))}
              </div>
              <FacaEvite
                faca={{
                  visual: (
                    <div className="flex flex-col items-end text-sm tabular-nums">
                      {VALORES.map((v) => (
                        <span key={v}>{v}</span>
                      ))}
                    </div>
                  ),
                  texto:
                    "Número na Inter com dígitos tabulares, alinhado à direita.",
                }}
                evite={{
                  visual: (
                    <div className="flex flex-col items-end font-mono text-sm">
                      {VALORES.map((v) => (
                        <span key={v}>{v}</span>
                      ))}
                    </div>
                  ),
                  texto:
                    "Fonte mono só para alinhar número: a Inter já alinha e lê melhor.",
                }}
              />
            </Secao>

            <Secao
              id="snippets"
              numero="07"
              titulo="Snippets"
              orientacao="Layout é classe, não componente. Veja a prévia e copie da aba Código."
            >
              <div className="grid gap-8 lg:grid-cols-2">
                <PreviaECodigo
                  titulo="Cabeçalho de seção"
                  codigo={CODIGO_SECAO}
                >
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        Uso por modelo
                      </span>
                      <span className="text-xs text-muted-foreground text-pretty">
                        Últimos 30 dias
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Exportar
                    </Button>
                  </div>
                </PreviaECodigo>
                <PreviaECodigo titulo="Grade de métricas" codigo={CODIGO_GRADE}>
                  <div className="grid grid-cols-2 gap-3">
                    {["Chamadas", "Erros", "Latência", "Custo"].map((m) => (
                      <div
                        key={m}
                        className="flex flex-col gap-1 rounded-md squircle:rounded-2xl corner-squircle bg-background px-3 py-2 shadow-(--custom-shadow)"
                      >
                        <span className="text-xs text-muted-foreground">
                          {m}
                        </span>
                        <span className="text-sm tracking-tight tabular-nums">
                          1.284
                        </span>
                      </div>
                    ))}
                  </div>
                </PreviaECodigo>
                <PreviaECodigo titulo="Par rótulo e valor" codigo={CODIGO_PAR}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Modelo", "gpt-5"],
                      ["Duração", "1,2 s"],
                    ].map(([rotulo, valor]) => (
                      <div key={rotulo} className="flex min-w-0 flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                          {rotulo}
                        </span>
                        <span className="text-sm tabular-nums">{valor}</span>
                      </div>
                    ))}
                  </div>
                </PreviaECodigo>
                <PreviaECodigo titulo="Citação" codigo={CODIGO_CITACAO}>
                  <blockquote className="border-l-2 border-border/50 pl-3 text-sm text-muted-foreground text-pretty">
                    Cinza é estrutura, cor é significado.
                  </blockquote>
                </PreviaECodigo>
              </div>
            </Secao>
          </div>
        </div>
      </main>
    </div>
  );
}
