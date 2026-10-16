// Demo do bloco app-shell no site: a casca da registry com um dashboard real
// dentro (page-header, range-picker, stat-grid, dois gráficos do evilcharts,
// data-table completa e empty-state), tudo sobre os dados fake de ./mock.ts.
// Arquivo do site, não entra na registry.
"use client";

import {
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconBellFilled,
  IconCirclesFilled,
  IconCoinFilled,
  IconCpu,
  IconGaugeFilled,
  IconGhost,
  IconGhostFilled,
  IconLogout,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ACCOUNT,
  AGENTS,
  BUCKET_TICKS,
  BUCKETS,
  bucketFull,
  MODELS,
  NAV,
  PAGE_SIZES,
  summaryFor,
  TRACE_SORT_ACCESSORS,
  TRACES,
  type TraceSortKey,
  USER,
} from "@/components/blocos/mock";
import { AppShell } from "@/registry/base-vega/blocks/app-shell/app-shell";
import { navItem } from "@/registry/base-vega/blocks/app-shell/nav";
import {
  ClearFiltersButton,
  FilterSelect,
  PaginationFooter,
  SearchInput,
  SortableHead,
  sortRows,
  ToggleChip,
  Toolbar,
  useTableSort,
  useUrlFilters,
} from "@/registry/base-vega/blocks/data-table/data-table";
import {
  RangeProvider,
  useRange,
} from "@/registry/base-vega/blocks/range-picker/range-context";
import { RangePicker } from "@/registry/base-vega/blocks/range-picker/range-picker";
import {
  CardSparkline,
  CardSparklinePlaceholder,
} from "@/registry/base-vega/components/card-sparkline";
import { EmptyState } from "@/registry/base-vega/components/empty-state";
import * as AreaChart from "@/registry/base-vega/components/evilcharts/charts/area-chart";
import * as BarChart from "@/registry/base-vega/components/evilcharts/charts/bar-chart";
import type { ChartConfig } from "@/registry/base-vega/components/evilcharts/core/chart";
import { HeaderActionsSlotProvider } from "@/registry/base-vega/components/header-slot";
import { PageHeader, PX } from "@/registry/base-vega/components/page-header";
import { PillMeter } from "@/registry/base-vega/components/pill-meter";
import { Section } from "@/registry/base-vega/components/section";
import { SpanTypeBadge } from "@/registry/base-vega/components/span-type";
import { StatCard } from "@/registry/base-vega/components/stat-card";
import { StatGrid } from "@/registry/base-vega/components/stat-grid";
import { TableRowsSkeleton } from "@/registry/base-vega/components/table-skeletons";
import {
  ChartLegend,
  themed,
} from "@/registry/base-vega/components/trend-charts";
import { useDelayedLoading } from "@/registry/base-vega/hooks/use-delayed-loading";
import { useEntranceOnce } from "@/registry/base-vega/hooks/use-entrance-once";
import {
  formatCost,
  formatCostFixed,
  formatCount,
  formatDateTime,
  formatDelta,
  formatDuration,
  formatPercent,
  formatSpanDuration,
  formatTokens,
} from "@/registry/base-vega/lib/format";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";
import { DropdownMenuItem } from "@/registry/base-vega/ui/dropdown-menu";
import { Label } from "@/registry/base-vega/ui/label";
import { Switch } from "@/registry/base-vega/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";
import { TooltipProvider } from "@/registry/base-vega/ui/tooltip";

import { DemoFrame } from "./demo-frame";

// Séries sem semântica usam a paleta neutra --chart-*; erro usa --destructive
// (cor com significado). Os tokens já flipam por tema, então light e dark
// recebem o mesmo valor.
const volumeConfig = {
  requests: { label: "Requisições", colors: themed("var(--chart-2)") },
  errors: { label: "Erros", colors: themed("var(--destructive)") },
} satisfies ChartConfig;

const costConfig = {
  m0: { label: MODELS[0].id, colors: themed("var(--chart-1)") },
  m1: { label: MODELS[1].id, colors: themed("var(--chart-3)") },
  m2: { label: MODELS[2].id, colors: themed("var(--chart-5)") },
} satisfies ChartConfig;

// Título à esquerda e legenda à direita; no card estreito da moldura a legenda
// desce inteira para a linha de baixo em vez de quebrar um nome de modelo.
const CHART_HEADER =
  "flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-1.5";
const LEGEND_WRAP = "flex flex-wrap justify-end [&_button]:whitespace-nowrap";

const AGENT_OPTIONS = AGENTS.map((a) => ({ value: a, label: a }));
const MODEL_OPTIONS = MODELS.map((m) => ({ value: m.key, label: m.id }));
const MODEL_NAME = Object.fromEntries(MODELS.map((m) => [m.key, m.id]));

// Colunas do esqueleto espelham as células reais (título com linha meta,
// badge, cinco números à direita).
const SKELETON_COLS = [
  { w: "w-40", sub: "w-56" },
  { w: "w-14" },
  { align: "right", w: "w-12" },
  { align: "right", w: "w-14" },
  { align: "right", w: "w-20" },
  { align: "right", w: "w-16" },
] as const;

const ALL_NAV = [...NAV, ...ACCOUNT];

/** O item ativo vem do hash da URL: cada link da sidebar é um <a href="#..."> e
 * o hashchange troca a página sem recarregar o site. */
function useHashPathname() {
  const [pathname, setPathname] = useState(NAV[0].href);
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (ALL_NAV.some((item) => item.href === hash)) setPathname(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return pathname;
}

export function DashboardDemo() {
  const pathname = useHashPathname();
  return (
    <DemoFrame>
      <HeaderActionsSlotProvider>
        <RangeProvider storageKey="lume.blocos.range">
          <AppShell
            nav={NAV}
            account={ACCOUNT}
            pathname={pathname}
            brand={
              <>
                <span className="size-3.5 rounded-[5px] squircle:rounded-xl corner-squircle bg-foreground" />
                <span className="truncate font-medium">Acme AI</span>
              </>
            }
            user={USER}
            userMenu={
              <DropdownMenuItem onClick={() => toast("Sessão encerrada")}>
                <IconLogout />
                Sair
              </DropdownMenuItem>
            }
          >
            <DashboardPage pathname={pathname} />
          </AppShell>
        </RangeProvider>
      </HeaderActionsSlotProvider>
    </DemoFrame>
  );
}

function DashboardPage({ pathname }: { pathname: string }) {
  const entrance = useEntranceOnce();
  const { range, setRange } = useRange();
  const current = navItem(ALL_NAV, pathname) ?? NAV[0];

  // Um único interruptor simula a query em voo: os stat cards seguram o valor
  // e a tabela troca o corpo pelo esqueleto, os dois só depois dos 700 ms.
  const [loading, setLoading] = useState(false);
  const skeleton = useDelayedLoading(loading);
  const loadingId = useId();

  const windowMs = range.to.getTime() - range.from.getTime();
  const { current: cur, previous: prev } = useMemo(
    () => summaryFor(windowMs),
    [windowMs],
  );

  const [volumeSelected, setVolumeSelected] = useState<string | null>(null);
  const [costSelected, setCostSelected] = useState<string | null>(null);

  // Filtro, busca, página e tamanho moram na URL; a ordenação é local
  // (lista completa, o cliente ordena).
  const [params, patch] = useUrlFilters({
    q: "",
    agent: "",
    model: "",
    errors: "",
    page: "1",
    size: "25",
  });
  const { sort, toggle } = useTableSort<TraceSortKey>({
    key: "when",
    dir: "desc",
  });
  const errorsOnly = params.errors === "1";
  const hasFilters = Boolean(params.q || params.agent || params.model);
  const page = Math.max(0, (Number.parseInt(params.page, 10) || 1) - 1);
  const pageSize = PAGE_SIZES.includes(Number(params.size))
    ? Number(params.size)
    : 25;

  const filtered = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    const rows = TRACES.filter(
      (t) =>
        (!q || t.name.toLowerCase().includes(q)) &&
        (!params.agent || t.agent === params.agent) &&
        (!params.model || t.model === params.model) &&
        (!errorsOnly || t.errorCount > 0),
    );
    return sortRows(rows, sort, TRACE_SORT_ACCESSORS);
  }, [params.q, params.agent, params.model, errorsOnly, sort]);
  const rows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <>
      <div className={cn(entrance && "page-fade-in")}>
        <PageHeader
          title={current.label}
          icon={current.activeIcon}
          iconClassName={current.iconClassName}
          actions={
            <>
              <RangePicker value={range} onChange={setRange} />
              <Button
                variant="secondary"
                onClick={() => toast.success("Chave criada")}
              >
                <IconPlus strokeWidth={2.4} />
                Nova chave
              </Button>
            </>
          }
        />
      </div>

      {/* Volume, saúde, performance, custo: o custo fecha a faixa. */}
      <StatGrid className={cn("mt-1", entrance && "page-fade-in")}>
        <StatCard
          size="sm"
          icon={IconCirclesFilled}
          iconClassName="text-sky-400 dark:text-sky-500"
          label="Requisições"
          value={cur.requests}
          formatValue={formatCount}
          delta={formatDelta(cur.requests, prev.requests)}
          loading={loading}
          skeleton={skeleton}
          chartPlaceholder={<CardSparklinePlaceholder />}
          chart={
            <CardSparkline
              data={BUCKETS.map((b) => b.requests)}
              className="text-blue-400/50 dark:text-sky-600/40"
            />
          }
        />
        <StatCard
          size="sm"
          icon={IconAlertTriangleFilled}
          iconClassName="text-red-500/90 dark:text-red-600/95 mt-px"
          label="Taxa de erro"
          value={cur.errorRate}
          formatValue={formatPercent}
          delta={formatDelta(cur.errorRate, prev.errorRate)}
          deltaInverted
          loading={loading}
          skeleton={skeleton}
          chartPlaceholder={<PillMeter fraction={null} />}
          chart={
            <PillMeter
              fraction={cur.errorRate}
              className="text-red-400 dark:text-red-700"
            />
          }
        />
        <StatCard
          size="sm"
          icon={IconGaugeFilled}
          iconClassName="text-fuchsia-400 dark:text-fuchsia-500"
          label="Latência p95"
          value={cur.p95}
          formatValue={formatDuration}
          delta={formatDelta(cur.p95, prev.p95)}
          deltaInverted
          loading={loading}
          skeleton={skeleton}
          chartPlaceholder={<CardSparklinePlaceholder />}
          chart={
            <CardSparkline
              data={BUCKETS.map((b) => b.p95)}
              className="text-fuchsia-400/50 dark:text-fuchsia-600/40"
            />
          }
        />
        <StatCard
          size="sm"
          icon={IconCoinFilled}
          iconClassName="text-amber-400 dark:text-yellow-500"
          label="Custo"
          value={cur.cost}
          formatValue={(n) => formatCost(n, 2)}
          delta={formatDelta(cur.cost, prev.cost)}
          deltaInverted
          loading={loading}
          skeleton={skeleton}
          chartPlaceholder={<CardSparklinePlaceholder />}
          chart={
            <CardSparkline
              data={BUCKETS.map((b) => b.cost)}
              className="text-yellow-400/50 dark:text-yellow-500/35"
            />
          }
        />
      </StatGrid>

      {/* Par de gráficos: volume e erros por hora, custo por modelo. */}
      <section
        className={cn(
          "grid gap-4 lg:grid-cols-2",
          PX,
          entrance && "page-fade-in",
        )}
      >
        <Card size="sm">
          <CardHeader className={CHART_HEADER}>
            <CardTitle className="shrink-0">Requisições e erros</CardTitle>
            <div className={LEGEND_WRAP}>
              <ChartLegend
                config={volumeConfig}
                selected={volumeSelected}
                onSelect={setVolumeSelected}
              />
            </div>
          </CardHeader>
          <CardContent className="mt-3">
            <AreaChart.EvilAreaChart
              config={volumeConfig}
              data={BUCKETS}
              xDataKey="bucket"
              isLoading={loading}
              selectedDataKey={volumeSelected}
              onSelectionChange={setVolumeSelected}
              className="h-56 w-full"
              chartProps={{
                // left: 2 (vs 5 do Recharts) encosta os rótulos do eixo y na
                // borda do conteúdo do card.
                margin: { top: 5, right: 5, bottom: 5, left: 2 },
              }}
            >
              <AreaChart.Grid />
              <AreaChart.XAxis
                dataKey="bucket"
                ticks={BUCKET_TICKS}
                interval={0}
              />
              <AreaChart.YAxis
                allowDecimals={false}
                tickFormatter={(v) => formatCount(Number(v))}
              />
              <AreaChart.Tooltip
                labelFormatter={(v) => bucketFull(String(v))}
                valueFormatter={(v) => formatCount(Number(v))}
              />
              <AreaChart.Area dataKey="requests" strokeVariant="solid" />
              <AreaChart.Area
                dataKey="errors"
                strokeVariant="solid"
                variant="lines"
              />
            </AreaChart.EvilAreaChart>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className={CHART_HEADER}>
            <CardTitle className="shrink-0">Custo por modelo</CardTitle>
            <div className={LEGEND_WRAP}>
              <ChartLegend
                config={costConfig}
                selected={costSelected}
                onSelect={setCostSelected}
              />
            </div>
          </CardHeader>
          <CardContent className="mt-3">
            <BarChart.EvilBarChart
              config={costConfig}
              data={BUCKETS}
              xDataKey="bucket"
              stackType="stacked"
              isLoading={loading}
              selectedDataKey={costSelected}
              onSelectionChange={setCostSelected}
              className="h-56 w-full"
              chartProps={{
                margin: { top: 5, right: 5, bottom: 5, left: 2 },
                // Mais folga entre buckets (padrão 10%) mantém as barras finas.
                barCategoryGap: "40%",
              }}
            >
              <BarChart.Grid />
              <BarChart.XAxis
                dataKey="bucket"
                ticks={BUCKET_TICKS}
                interval={0}
              />
              <BarChart.YAxis tickFormatter={(v) => formatCost(Number(v), 2)} />
              <BarChart.Tooltip
                labelFormatter={(v) => bucketFull(String(v))}
                valueFormatter={(v) => formatCost(Number(v))}
                reverse
              />
              {Object.keys(costConfig).map((k) => (
                <BarChart.Bar key={k} dataKey={k} isClickable />
              ))}
            </BarChart.EvilBarChart>
          </CardContent>
        </Card>
      </section>

      {/* Lista: toolbar e cabeçalhos pintam sempre; só o corpo espera. */}
      <Section
        title="Traces"
        description="Busca, filtros, ordenação e página vivem na URL."
        className={cn("mt-1", entrance && "page-fade-in")}
      >
        <div className="flex flex-col gap-4">
          <Toolbar
            trailing={
              <>
                <Switch
                  id={loadingId}
                  size="sm"
                  checked={loading}
                  onCheckedChange={(checked) => setLoading(checked)}
                />
                <Label
                  htmlFor={loadingId}
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  Simular carregamento
                </Label>
              </>
            }
          >
            <SearchInput
              value={params.q}
              onChange={(q) => patch({ q })}
              placeholder="Buscar trace…"
            />
            <FilterSelect
              value={params.agent}
              onChange={(agent) => patch({ agent })}
              allLabel="Qualquer agente"
              icon={IconGhost}
              options={AGENT_OPTIONS}
            />
            <FilterSelect
              value={params.model}
              onChange={(model) => patch({ model })}
              allLabel="Qualquer modelo"
              icon={IconCpu}
              options={MODEL_OPTIONS}
            />
            <ToggleChip
              active={errorsOnly}
              onClick={() => patch({ errors: errorsOnly ? "" : "1" })}
            >
              <IconAlertTriangle className="size-3.5" />
              Só erros
            </ToggleChip>
            <ClearFiltersButton
              show={hasFilters || errorsOnly}
              onClick={() => patch({ q: "", agent: "", model: "", errors: "" })}
            />
          </Toolbar>

          {!loading && filtered.length === 0 ? (
            <div className={cn("mt-2", PX)}>
              <EmptyState
                icon={IconGhostFilled}
                title="Nenhum trace encontrado"
                description="Tente outra busca ou limpe os filtros."
              />
            </div>
          ) : (
            // Coluna sem gap: a borda superior do rodapé encosta na última linha.
            <div className="-mt-2 flex flex-col">
              <TooltipProvider delay={150}>
                {/* table-fixed: as larguras vêm dos w-* do header, e a troca
                    esqueleto para dado não mexe nas colunas. min-w-3xl (não
                    5xl) porque a moldura da demo é mais estreita que a
                    janela de um app. */}
                <Table className="table-fixed min-w-3xl" stickyHeader>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trace</TableHead>
                      <TableHead className="w-28">Tipo</TableHead>
                      <SortableHead
                        sortKey="tokens"
                        sort={sort}
                        onSort={toggle}
                        align="right"
                        className="w-28"
                      >
                        Tokens
                      </SortableHead>
                      <SortableHead
                        sortKey="duration"
                        sort={sort}
                        onSort={toggle}
                        align="right"
                        className="w-28"
                      >
                        Duração
                      </SortableHead>
                      <SortableHead
                        sortKey="cost"
                        sort={sort}
                        onSort={toggle}
                        align="right"
                        className="w-36"
                      >
                        Custo
                      </SortableHead>
                      <SortableHead
                        sortKey="when"
                        sort={sort}
                        onSort={toggle}
                        align="right"
                        className="w-32"
                      >
                        Quando
                      </SortableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      skeleton ? (
                        <TableRowsSkeleton
                          rows={5}
                          cols={SKELETON_COLS}
                          rowHeight="h-16"
                        />
                      ) : null
                    ) : (
                      rows.map((t) => (
                        <TableRow
                          key={t.id}
                          interactive
                          onClick={() => toast(`Abrir trace ${t.id}`)}
                        >
                          <TableCell className="h-16">
                            {/* min-w-0: sem isso a linha meta invade a próxima
                                coluna em vez de truncar. */}
                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="truncate text-sm">{t.name}</span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <IconGhostFilled className="size-3 text-orange-500" />
                                <span className="truncate">{t.agent}</span>
                                <span className="text-muted-foreground/40">
                                  /
                                </span>
                                <span className="truncate">
                                  {MODEL_NAME[t.model]}
                                </span>
                                {t.errorCount > 0 && (
                                  <span className="ml-1 inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <IconAlertTriangle className="size-3.5 fill-current/20" />
                                    {t.errorCount}
                                  </span>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <SpanTypeBadge type={t.type} />
                          </TableCell>
                          <TableCell align="right">
                            {formatTokens(t.tokens)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-muted-foreground"
                          >
                            {formatSpanDuration(t.durationMs)}
                          </TableCell>
                          <TableCell align="right" className="font-medium">
                            {formatCostFixed(t.cost, 6)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-muted-foreground"
                          >
                            {formatDateTime(t.startedAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>

              {!loading && rows.length > 0 && (
                <PaginationFooter
                  page={page}
                  pageSize={pageSize}
                  total={filtered.length}
                  shown={rows.length}
                  noun={["trace", "traces"]}
                  onPageChange={(p) => patch({ page: String(p + 1) })}
                  onPageSizeChange={(s) => patch({ size: String(s) })}
                  pageSizes={PAGE_SIZES}
                />
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Seção vazia de propósito: o empty-state tracejado com ação. */}
      <Section
        title="Alertas"
        description="Regras de limite por métrica, avaliadas a cada minuto."
        className={cn("mt-1", entrance && "page-fade-in")}
      >
        <div className={PX}>
          <EmptyState
            icon={IconBellFilled}
            title="Nenhum alerta configurado"
            description="Crie uma regra para ser avisado quando a latência ou o custo passar do limite."
          >
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => toast.success("Alerta criado")}
            >
              <IconPlus strokeWidth={2.4} />
              Criar alerta
            </Button>
          </EmptyState>
        </div>
      </Section>
    </>
  );
}
