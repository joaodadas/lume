// Dados fake da vitrine /blocos. Tudo determinístico (índice, seno e um jitter
// inteiro): nada de Math.random nem Date.now, porque o Next pré-renderiza os
// client components com Cache Components e barra qualquer fonte de entropia na
// pré-renderização. Arquivo do site, não entra na registry.
import {
  IconAffiliate,
  IconAffiliateFilled,
  IconBell,
  IconBellFilled,
  IconGauge,
  IconGaugeFilled,
  IconGhost,
  IconGhostFilled,
  IconHome,
  IconHomeFilled,
  IconKey,
  IconKeyFilled,
  IconSettings,
  IconSettingsFilled,
} from "@tabler/icons-react";

import type { AppShellUser } from "@/registry/base-vega/blocks/app-shell/app-shell";
import {
  type NavItem,
  navTile,
} from "@/registry/base-vega/blocks/app-shell/nav";

// ---------------------------------------------------------------------------
// Navegação do shell
// ---------------------------------------------------------------------------

// Rotas em hash: o Link da registry é um <a> puro, e o hash troca o item ativo
// sem recarregar a página do site. Um app real passa "/traces" e o pathname do
// roteador.
export const NAV: NavItem[] = [
  {
    href: "#visao-geral",
    label: "Visão geral",
    icon: IconHome,
    activeIcon: IconHomeFilled,
    iconClassName: navTile("sky"),
  },
  {
    href: "#traces",
    label: "Traces",
    icon: IconAffiliate,
    activeIcon: IconAffiliateFilled,
    iconClassName: navTile("violet"),
  },
  {
    href: "#agentes",
    label: "Agentes",
    icon: IconGhost,
    activeIcon: IconGhostFilled,
    iconClassName: navTile("orange"),
  },
  {
    href: "#avaliacoes",
    label: "Avaliações",
    icon: IconGauge,
    activeIcon: IconGaugeFilled,
    iconClassName: navTile("fuchsia"),
  },
  {
    href: "#alertas",
    label: "Alertas",
    icon: IconBell,
    activeIcon: IconBellFilled,
    iconClassName: navTile("yellow"),
  },
];

// Itens de conta: sem tile, glifo apagado, como no Foglamp.
export const ACCOUNT: NavItem[] = [
  {
    href: "#chaves",
    label: "Chaves de API",
    icon: IconKey,
    activeIcon: IconKeyFilled,
    iconClassName: "text-muted-foreground/70",
  },
  {
    href: "#configuracoes",
    label: "Configurações",
    icon: IconSettings,
    activeIcon: IconSettingsFilled,
    iconClassName: "text-muted-foreground/70",
  },
];

export const USER: AppShellUser = {
  name: "Ana Souza",
  email: "ana@acme.com.br",
};

// ---------------------------------------------------------------------------
// Domínio: agentes, modelos e tipos de span
// ---------------------------------------------------------------------------

export const AGENTS = [
  "suporte-n1",
  "triagem",
  "cobranca",
  "onboarding",
] as const;
export type Agent = (typeof AGENTS)[number];

export const MODELS = [
  { key: "m0", id: "gpt-5" },
  { key: "m1", id: "claude-sonnet-4.5" },
  { key: "m2", id: "gemini-2.5-flash" },
] as const;
export type ModelKey = (typeof MODELS)[number]["key"];

export const SPAN_TYPES = [
  "llm",
  "tool",
  "agent",
  "embedding",
  "other",
] as const;

// ---------------------------------------------------------------------------
// Séries por hora (um dia fixo: 15/10/2026)
// ---------------------------------------------------------------------------

export type Bucket = {
  /** Rótulo do eixo x ("03:00"). */
  bucket: string;
  requests: number;
  errors: number;
  p95: number;
  cost: number;
  m0: number;
  m1: number;
  m2: number;
};

const DAY = "15/10";

function jitter(i: number, mod: number) {
  return ((i * 7919) % mod) / mod;
}

export const BUCKETS: Bucket[] = Array.from({ length: 24 }, (_, i) => {
  const wave = 0.5 + 0.5 * Math.sin((i - 6) / 3.2);
  const j = jitter(i, 13);
  const requests = Math.round(180 + wave * 640 + j * 120);
  const errors = Math.round(requests * (0.008 + 0.03 * (((i * 31) % 7) / 7)));
  const p95 = Math.round(620 + wave * 480 + j * 160);
  const m0 = +(0.9 + wave * 2.4 + j * 0.5).toFixed(3);
  const m1 = +(0.4 + (1 - wave) * 1.6 + j * 0.3).toFixed(3);
  const m2 = +(0.15 + wave * 0.5 + j * 0.2).toFixed(3);
  return {
    bucket: `${String(i).padStart(2, "0")}:00`,
    requests,
    errors,
    p95,
    cost: +(m0 + m1 + m2).toFixed(3),
    m0,
    m1,
    m2,
  };
});

/** Ticks do eixo x a cada 4 horas, para a faixa não lotar. */
export const BUCKET_TICKS = BUCKETS.filter((_, i) => i % 4 === 0).map(
  (b) => b.bucket,
);

/** Rótulo completo para o tooltip: "15/10 03:00". */
export function bucketFull(bucket: string) {
  return `${DAY} ${bucket}`;
}

// Totais do dia; os cards escalam pelo tamanho do período escolhido.
const DAY_TOTALS = BUCKETS.reduce(
  (acc, b) => ({
    requests: acc.requests + b.requests,
    errors: acc.errors + b.errors,
    cost: acc.cost + b.cost,
  }),
  { requests: 0, errors: 0, cost: 0 },
);

export type Summary = {
  requests: number;
  errorRate: number;
  p95: number;
  cost: number;
};

/** Resumo para um período de `windowMs`: o dia fixo escalado pela janela, com
 * o período anterior ligeiramente diferente para o delta ter o que mostrar. */
export function summaryFor(windowMs: number): {
  current: Summary;
  previous: Summary;
} {
  const factor = Math.max(windowMs / 86_400_000, 1 / 24);
  const current: Summary = {
    requests: Math.round(DAY_TOTALS.requests * factor),
    errorRate: DAY_TOTALS.errors / DAY_TOTALS.requests,
    p95: 1_060,
    cost: +(DAY_TOTALS.cost * factor).toFixed(2),
  };
  const previous: Summary = {
    requests: Math.round(current.requests * 0.91),
    errorRate: current.errorRate * 1.18,
    p95: 1_210,
    cost: +(current.cost * 1.07).toFixed(2),
  };
  return { current, previous };
}

// ---------------------------------------------------------------------------
// Traces da tabela
// ---------------------------------------------------------------------------

export type Trace = {
  id: string;
  name: string;
  agent: Agent;
  model: ModelKey;
  type: (typeof SPAN_TYPES)[number];
  spans: number;
  tokens: number;
  durationMs: number;
  cost: number;
  errorCount: number;
  /** ISO fixo; a coluna usa formatDateTime. */
  startedAt: string;
};

const NAMES = [
  "Como troco o cartão da assinatura?",
  "Segunda via do boleto de setembro",
  "Cancelar plano e manter os dados",
  "Resumir o contrato enviado em PDF",
  "Qual o prazo de reembolso?",
  "Atualizar endereço de cobrança",
  "Exportar relatório de uso em CSV",
  "Convidar colega para o workspace",
  "Erro 502 ao chamar a API de busca",
  "Comparar planos Pro e Business",
  "Reenviar e-mail de confirmação",
  "Integração com o Slack caiu de novo",
] as const;

// Horário base fixo (UTC); cada trace recua 17 min em relação ao anterior.
const BASE_TIME = Date.UTC(2026, 9, 15, 17, 32, 0);

export const TRACES: Trace[] = Array.from({ length: 36 }, (_, i) => {
  const j = jitter(i, 17);
  const errorCount = i % 7 === 3 ? 1 + (i % 3) : 0;
  const tokens = Math.round(900 + j * 6_400 + (i % 5) * 700);
  const durationMs = Math.round(400 + j * 5_200 + errorCount * 900);
  return {
    id: `tr_${(0x3a1f + i * 2_741).toString(16).padStart(6, "0")}`,
    name: NAMES[i % NAMES.length],
    agent: AGENTS[i % AGENTS.length],
    model: MODELS[(i * 5) % MODELS.length].key,
    type: SPAN_TYPES[i % 7 < 3 ? 0 : (i % 7) - 2],
    spans: 3 + ((i * 11) % 14),
    tokens,
    durationMs,
    cost: +((tokens / 1_000_000) * (2.4 + j * 9)).toFixed(6),
    errorCount,
    startedAt: new Date(BASE_TIME - i * 17 * 60_000).toISOString(),
  };
});

export const TRACE_SORT_KEYS = ["tokens", "duration", "cost", "when"] as const;
export type TraceSortKey = (typeof TRACE_SORT_KEYS)[number];

export const TRACE_SORT_ACCESSORS: Record<
  TraceSortKey,
  (row: Trace) => number | string
> = {
  tokens: (t) => t.tokens,
  duration: (t) => t.durationMs,
  cost: (t) => t.cost,
  when: (t) => t.startedAt,
};

export const PAGE_SIZES = [25, 50, 100];

// ---------------------------------------------------------------------------
// Peças avulsas
// ---------------------------------------------------------------------------

/** Chaves fixas que o RollingText revela em sequência ao clicar "Gerar outra". */
export const API_KEYS = [
  "lm_live_8f3a2c91e4b7d605a1c3",
  "lm_live_27d9e0b4f6a18c3e5d72",
  "lm_live_c41b7e9f2a86d0e3b519",
] as const;

export const INSTALL_SNIPPET = `import { StatCard } from "@/components/stat-card";
import { CardSparkline } from "@/components/card-sparkline";
import { formatCount, formatDelta } from "@/lib/format";

export function Requests({ current, previous, series }: Props) {
  return (
    <StatCard
      size="sm"
      label="Requisições"
      value={current}
      formatValue={formatCount}
      delta={formatDelta(current, previous)}
      chart={<CardSparkline data={series} className="text-sky-500/40" />}
    />
  );
}`;
