// Formatos Barra e Mural da vitrine (Barra de zonas, no guia 03). Barra:
// layout topbar com as zonas de um produto de leitura (Início; Mercado, Ativos
// com filhos e hint, Ferramentas; Agente, que é outra zona do domínio), um
// filho desabilitado, busca, carteira e alertas em tools, a faixa do trial no
// banner e o painel da carteira. Mural: o modo TV do BI, com nav vazia e fill;
// "Sair do modo TV" volta ao BI em layout sidebar no mesmo AppShell, e o
// destaque escolhido na página sobrevive à troca. Arquivo do site, não entra
// na registry.
"use client";

import {
  IconBellFilled,
  IconChartBar,
  IconDeviceTvFilled,
  IconLayoutDashboardFilled,
  IconLogout,
  IconSettingsFilled,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  goTo,
  Marca,
  PainelCarteira,
  PaletaDeBusca,
  paletteItems,
  percentual,
  Segmentado,
  ShellTool,
  useHashRoute,
  usePainel,
} from "@/components/blocos/demo-kit";
import {
  AGENTE_USER,
  ALERTAS,
  ATIVOS,
  type Ativo,
  BI_NAV,
  CARTEIRA,
  FERRAMENTAS,
  INDICES,
  INVEST_ACCOUNT,
  KPIS_OBRA,
  type KpiId,
  OBRA,
  OBRA_USER,
  zonas,
} from "@/components/blocos/mock";
import { AppShell } from "@/registry/base-vega/blocks/app-shell/app-shell";
import {
  findActive,
  flattenNav,
  type NavSection,
  navTile,
} from "@/registry/base-vega/blocks/app-shell/nav";
import {
  SearchTrigger,
  useShellLayout,
} from "@/registry/base-vega/blocks/app-shell/shell-parts";
import { EmptyState } from "@/registry/base-vega/components/empty-state";
import { PageHeader, PX } from "@/registry/base-vega/components/page-header";
import { Section } from "@/registry/base-vega/components/section";
import { StatCard } from "@/registry/base-vega/components/stat-card";
import { StatGrid } from "@/registry/base-vega/components/stat-grid";
import { formatMoney } from "@/registry/base-vega/lib/format";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";
import { DropdownMenuItem } from "@/registry/base-vega/ui/dropdown-menu";
import { SidebarMenuItem, useSidebar } from "@/registry/base-vega/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";

const SAIR = (
  <DropdownMenuItem onClick={() => toast("Sessão encerrada")}>
    <IconLogout />
    Sair
  </DropdownMenuItem>
);

// ---------------------------------------------------------------------------
// Barra
// ---------------------------------------------------------------------------

const INICIO = "#inicio";

// Variação do dia com uma casa ("+3,4%", "-1,2%"), no verde e no vermelho do
// delta do StatCard.
function Variacao({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "tabular-nums",
        value > 0 && "text-emerald-600 dark:text-emerald-500",
        value < 0 && "text-red-500 dark:text-red-500",
      )}
    >
      {percentual(value, true)}
    </span>
  );
}

export function TopbarDemo({ agenteHref }: { agenteHref: string }) {
  const nav = zonas(agenteHref);
  const all: NavSection[] = [...nav, { items: INVEST_ACCOUNT }];
  const routes = flattenNav(all).filter(
    (item) => !item.external && !item.disabled,
  );
  const route = useHashRoute(INICIO, (hash) =>
    routes.some((item) => item.href === hash),
  );
  const painel = usePainel(false);
  const [searching, setSearching] = useState(false);

  return (
    <AppShell
      layout="topbar"
      nav={nav}
      account={INVEST_ACCOUNT}
      pathname={route}
      brand={<Marca nome="Acme Invest" />}
      banner={<FaixaTrial />}
      panel={<PainelCarteira painel={painel} />}
      tools={
        <>
          <SearchTrigger
            label="Buscar ativo"
            onOpen={() => setSearching(true)}
          />
          <ShellTool
            icon={IconWallet}
            label="Minha carteira"
            variant="secondary"
            compact
            expanded={painel.open}
            onClick={painel.toggle}
          />
          <ShellTool
            icon={IconBellFilled}
            label="Alertas"
            iconOnly
            count={{ value: ALERTAS, label: `${ALERTAS} novos` }}
            onClick={() => toast(`${ALERTAS} alertas de preço`)}
          />
        </>
      }
      user={AGENTE_USER}
      userMenu={SAIR}
    >
      <PaletaDeBusca
        open={searching}
        onOpenChange={setSearching}
        title="Buscar ativo"
        description="Ache um ativo pelo ticker ou pelo nome."
        placeholder="Ticker ou nome…"
        groups={[
          {
            heading: "Ativos",
            items: ATIVOS.map((ativo) => ({
              id: ativo.ticker,
              label: ativo.ticker,
              hint: ativo.nome,
              onSelect: () => goTo(`#ativos/${ativo.classe}`),
            })),
          },
          { heading: "Zonas", items: paletteItems(nav) },
        ]}
      />
      <ZonaPage nav={all} route={route} />
    </AppShell>
  );
}

// Faixa fixa no topo do cartão, fora do scroll (slot banner).
function FaixaTrial() {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/40 bg-muted/50 py-2 text-xs",
        PX,
      )}
    >
      <span className="text-muted-foreground">
        Período de teste: faltam 12 dias para escolher um plano.
      </span>
      <Button
        variant="link"
        size="xs"
        className="h-auto px-0"
        onClick={() => toast("Planos abertos")}
      >
        Ver planos
      </Button>
    </div>
  );
}

function ZonaPage({ nav, route }: { nav: NavSection[]; route: string }) {
  const active = findActive(nav, route);
  const title = active?.item.label ?? "Início";

  if (route === "#mercado")
    return (
      <>
        <PageHeader title={title} />
        <StatGrid className="mt-1">
          {INDICES.map((indice) => (
            <Card key={indice.rotulo} size="sm">
              <CardHeader className="gap-1.5">
                <span className="text-sm">{indice.rotulo}</span>
                <div className="flex items-baseline justify-between gap-2">
                  <CardTitle className="tracking-tight tabular-nums">
                    {indice.valor}
                  </CardTitle>
                  <span className="text-xs">
                    <Variacao value={indice.variacao} />
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </StatGrid>
        <Section title="Maiores altas" className="mt-1">
          <AtivosTable
            ativos={[...ATIVOS].sort((a, b) => b.variacao - a.variacao)}
          />
        </Section>
      </>
    );

  if (route.startsWith("#ativos/"))
    return (
      <>
        <PageHeader title={title} />
        <AtivosTable
          ativos={ATIVOS.filter((ativo) => `#ativos/${ativo.classe}` === route)}
        />
      </>
    );

  if (route === "#ferramentas")
    return (
      <>
        <PageHeader title={title} />
        <section className={cn("mt-1 grid gap-4 lg:grid-cols-3", PX)}>
          {FERRAMENTAS.map((ferramenta) => (
            <Card key={ferramenta.titulo} size="sm">
              <CardHeader>
                <CardTitle>{ferramenta.titulo}</CardTitle>
                <CardDescription>{ferramenta.descricao}</CardDescription>
              </CardHeader>
              <div className="px-5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast(`${ferramenta.titulo} aberto`)}
                >
                  Abrir
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </>
    );

  if (route === "#conta")
    return (
      <>
        <PageHeader title={title} />
        <div className={PX}>
          <EmptyState
            icon={IconSettingsFilled}
            title="Nada para configurar aqui"
            description="Na vitrine, a conta só existe para o menu do avatar ter um item."
          >
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => goTo(INICIO)}
            >
              Voltar ao Início
            </Button>
          </EmptyState>
        </div>
      </>
    );

  return (
    <>
      <PageHeader title={title} />
      <StatGrid className="mt-1">
        <StatCard
          size="sm"
          label="Patrimônio"
          value={CARTEIRA.total}
          formatValue={(n) => formatMoney(n)}
        />
        <StatCard
          size="sm"
          label="Rendimento no mês"
          value={percentual(CARTEIRA.rendimentoMes, true)}
        />
        <StatCard
          size="sm"
          label="Proventos no mês"
          value={CARTEIRA.proventosMes}
          formatValue={(n) => formatMoney(n)}
        />
        <StatCard size="sm" label="Alertas de preço" value={ALERTAS} />
      </StatGrid>
      <Section title="Mercado hoje" className="mt-1">
        <AtivosTable ativos={ATIVOS.slice(0, 5)} />
      </Section>
    </>
  );
}

// As células trazem o gutter (px-8.25), como na tabela do dashboard.
function AtivosTable({ ativos }: { ativos: Ativo[] }) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead>Ativo</TableHead>
          <TableHead align="right" className="w-36">
            Preço
          </TableHead>
          <TableHead align="right" className="w-28">
            Dia
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ativos.map((ativo) => (
          <TableRow
            key={ativo.ticker}
            interactive
            onClick={() => toast(`Abrir ${ativo.ticker}`)}
          >
            <TableCell className="h-16">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium">
                  {ativo.ticker}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {ativo.nome}
                </span>
              </div>
            </TableCell>
            <TableCell align="right">{formatMoney(ativo.preco)}</TableCell>
            <TableCell align="right">
              <Variacao value={ativo.variacao} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ---------------------------------------------------------------------------
// Mural
// ---------------------------------------------------------------------------

const PAINEL = "#painel";
const BI_ROUTES = flattenNav(BI_NAV);
const isBiRoute = (hash: string) =>
  BI_ROUTES.some((item) => item.href === hash);

export function MuralDemo() {
  const [tv, setTv] = useState(true);
  const route = useHashRoute(PAINEL, isBiRoute);

  // Um AppShell só, com as props trocando: o layout muda e a página (com o
  // destaque escolhido) não remonta.
  return (
    <AppShell
      layout={tv ? "topbar" : "sidebar"}
      nav={tv ? [] : BI_NAV}
      fill={tv}
      pathname={route}
      brand={<Marca nome="Acme Obras" />}
      tools={tv ? <MuralTools onExit={() => setTv(false)} /> : undefined}
      user={tv ? undefined : OBRA_USER}
      userMenu={tv ? undefined : SAIR}
    >
      <ObraPage route={route} tv={tv} onTv={() => setTv(true)} />
    </AppShell>
  );
}

// Obra e período em texto e o botão de sair; na gaveta do celular, itens da
// lista, como todo tool.
function MuralTools({ onExit }: { onExit: () => void }) {
  const layout = useShellLayout();
  const { isMobile } = useSidebar();
  const contexto = `${OBRA.nome} · ${OBRA.periodo}`;
  return (
    <>
      {layout === "topbar" && !isMobile ? (
        <span className="px-2 text-sm text-muted-foreground tabular-nums">
          {contexto}
        </span>
      ) : (
        <SidebarMenuItem>
          <span className="flex px-2 py-1.5 text-sm text-muted-foreground tabular-nums">
            {contexto}
          </span>
        </SidebarMenuItem>
      )}
      <ShellTool icon={IconX} label="Sair do modo TV" onClick={onExit} />
    </>
  );
}

function ObraPage({
  route,
  tv,
  onTv,
}: {
  route: string;
  tv: boolean;
  onTv: () => void;
}) {
  // Estado da página: o AppShell troca de layout sem remontar este componente,
  // então a escolha feita no BI chega ao modo TV e volta.
  const [destaque, setDestaque] = useState<KpiId>(KPIS_OBRA[0].id);

  if (tv) return <MuralTv destaque={destaque} />;

  if (route !== PAINEL) {
    const active = findActive(BI_NAV, route);
    return (
      <>
        <PageHeader
          title={active?.item.label ?? "Relatório"}
          icon={active?.parent?.icon}
          iconClassName={active?.parent?.iconClassName}
        />
        <div className={PX}>
          <EmptyState
            icon={IconChartBar}
            title="Relatório sem dados na vitrine"
            description="Só o painel da obra tem números aqui."
          >
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => goTo(PAINEL)}
            >
              Voltar ao painel
            </Button>
          </EmptyState>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Painel da obra"
        icon={IconLayoutDashboardFilled}
        iconClassName={navTile("sky")}
        actions={
          <Button variant="secondary" onClick={onTv}>
            <IconDeviceTvFilled />
            Modo TV
          </Button>
        }
      />
      <StatGrid className="mt-1">
        {KPIS_OBRA.map((kpi) => (
          <StatCard
            key={kpi.id}
            size="sm"
            label={kpi.rotulo}
            value={kpi.valor}
          />
        ))}
      </StatGrid>
      <Section
        title="Destaque do mural"
        description="O indicador que o modo TV mostra em tamanho grande."
        className="mt-1"
      >
        <div className={PX}>
          <Segmentado
            label="Destaque do mural"
            value={destaque}
            onChange={setDestaque}
            options={KPIS_OBRA.map((kpi) => ({
              id: kpi.id,
              label: kpi.rotulo,
            }))}
          />
        </div>
      </Section>
    </>
  );
}

// O mural é lido de longe: os números passam do teto de texto do app (text-sm
// e text-xs), e só aqui.
function MuralTv({ destaque }: { destaque: KpiId }) {
  const hero = KPIS_OBRA.find((kpi) => kpi.id === destaque) ?? KPIS_OBRA[0];
  const rest = KPIS_OBRA.filter((kpi) => kpi.id !== hero.id);
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <div className="grid min-h-full flex-1 gap-4 md:grid-cols-3 md:grid-rows-3">
        <Card className="justify-between gap-2 px-6 md:col-span-2 md:row-span-3">
          <span className="text-sm text-muted-foreground">{hero.rotulo}</span>
          <span className="text-6xl font-medium tracking-tight tabular-nums md:text-8xl">
            {hero.valor}
          </span>
          <span className="text-sm text-muted-foreground">{hero.detalhe}</span>
        </Card>
        {rest.map((kpi) => (
          <Card key={kpi.id} size="sm" className="justify-between px-5">
            <span className="text-sm text-muted-foreground">{kpi.rotulo}</span>
            <span className="text-4xl font-medium tracking-tight tabular-nums">
              {kpi.valor}
            </span>
            <span className="text-xs text-muted-foreground">{kpi.detalhe}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
