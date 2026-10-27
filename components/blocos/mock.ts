// Dados fake da vitrine /blocos. Tudo determinístico (índice, seno e um jitter
// inteiro): nada de Math.random nem Date.now, porque o Next pré-renderiza os
// client components com Cache Components e barra qualquer fonte de entropia na
// pré-renderização. Empresas, tickers, obras e valores são inventados. Arquivo
// do site, não entra na registry.
import {
  type Icon,
  IconAffiliate,
  IconAffiliateFilled,
  IconBell,
  IconBellFilled,
  IconBook,
  IconBookFilled,
  IconChartBar,
  IconFolder,
  IconFolderFilled,
  IconGauge,
  IconGaugeFilled,
  IconGhost,
  IconGhostFilled,
  IconHelmet,
  IconHome,
  IconHomeFilled,
  IconInbox,
  IconKey,
  IconKeyFilled,
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconMessageCirclePlus,
  IconSettings,
  IconSettingsFilled,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";

import type { AppShellUser } from "@/registry/base-vega/blocks/app-shell/app-shell";
import {
  type NavLinkItem,
  type NavSection,
  navTile,
} from "@/registry/base-vega/blocks/app-shell/nav";

// Rotas em hash: o Link da registry é um <a> puro, e o hash troca o item ativo
// sem recarregar a página do site. Um app real passa "/traces" e o pathname do
// roteador.

// ---------------------------------------------------------------------------
// Lateral e trilho: o dashboard da Acme AI
// ---------------------------------------------------------------------------

// Núcleo sem rótulo, duas seções rotuladas, um item com filhos, uma contagem e
// um link que abre em nova aba (o guia do lume, para a seta levar a algum lugar).
export const NAV: NavSection[] = [
  {
    items: [
      {
        href: "#visao-geral",
        label: "Visão geral",
        icon: IconHome,
        activeIcon: IconHomeFilled,
        iconClassName: navTile("sky"),
      },
      {
        href: "#inbox",
        label: "Inbox",
        // Sem par Filled no Tabler: o mesmo glifo nos dois estados.
        icon: IconInbox,
        iconClassName: navTile("blue"),
        badge: { count: 3, label: "3 não lidas" },
      },
    ],
  },
  {
    label: "Observabilidade",
    items: [
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
        label: "Avaliações",
        icon: IconGauge,
        activeIcon: IconGaugeFilled,
        iconClassName: navTile("fuchsia"),
        children: [
          { href: "#avaliacoes", label: "Execuções" },
          { href: "#avaliacoes/conjuntos", label: "Conjuntos de dados" },
          { href: "#avaliacoes/criterios", label: "Critérios" },
        ],
      },
      {
        href: "#alertas",
        label: "Alertas",
        icon: IconBell,
        activeIcon: IconBellFilled,
        iconClassName: navTile("yellow"),
      },
    ],
  },
  {
    label: "Recursos",
    items: [
      {
        href: "/guia",
        label: "Documentação",
        icon: IconBook,
        activeIcon: IconBookFilled,
        iconClassName: "text-muted-foreground/70",
        external: "tab",
      },
    ],
  },
];

// Itens de conta: sem tile, glifo apagado, como no Foglamp.
export const ACCOUNT: NavLinkItem[] = [
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
  detail: "Administradora",
};

/** Os projetos do seletor no topo da sidebar (ContextSwitcher). */
export const PROJETOS = [
  { id: "suporte", label: "Suporte", detail: "3 alertas" },
  { id: "vendas", label: "Vendas", detail: "1 alerta" },
  { id: "back-office", label: "Back-office" },
] as const;
export type ProjetoId = (typeof PROJETOS)[number]["id"];

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
// Agente: conversas, pastas e a carteira do painel
// ---------------------------------------------------------------------------

export type Mensagem =
  | { id: string; papel: "pessoa"; texto: string }
  | {
      id: string;
      papel: "agente";
      /** Parágrafos da resposta. */
      texto: string[];
      /** Ferramenta já usada antes da resposta ("Consultou a carteira"). */
      ferramenta?: string;
    };

export type Pasta = "impostos" | "imoveis";

export type Conversa = {
  id: string;
  titulo: string;
  /** Seção da sidebar, ou a pasta onde a conversa mora. */
  onde: "fixadas" | "hoje" | "ontem" | "arquivadas" | Pasta;
  /** working: o agente ainda responde. unread: resposta que a pessoa não viu. */
  status?: "working" | "unread";
  mensagens: Mensagem[];
};

/** Rota de uma conversa no hash da demo. */
export function conversaHref(id: string) {
  return `#c/${id}`;
}

// Pergunta e resposta curtas para as conversas que não são a aberta.
function par(id: string, pergunta: string, resposta?: string[]): Mensagem[] {
  const pessoa: Mensagem = { id: `${id}-p`, papel: "pessoa", texto: pergunta };
  if (!resposta) return [pessoa];
  return [pessoa, { id: `${id}-a`, papel: "agente", texto: resposta }];
}

export const CONVERSAS: Conversa[] = [
  {
    id: "aposentadoria",
    titulo: "Plano de aposentadoria",
    onde: "fixadas",
    mensagens: par(
      "aposentadoria",
      "Quanto preciso juntar para parar aos 60?",
      [
        "Com o custo de vida que você informou, a meta fica perto de R$ 2,1 milhões em valores de hoje.",
      ],
    ),
  },
  {
    id: "reserva",
    titulo: "Reserva de emergência",
    onde: "fixadas",
    mensagens: par("reserva", "Minha reserva está do tamanho certo?", [
      "Ela cobre 7 meses de gastos. Para quem é autônomo, o usual é de 6 a 12.",
    ]),
  },
  {
    id: "declaracao",
    titulo: "Declaração de 2026",
    onde: "impostos",
    mensagens: par("declaracao", "O que muda na declaração deste ano?", [
      "Para a sua carteira, o principal é declarar os fundos imobiliários pelo custo médio.",
    ]),
  },
  {
    id: "ganho-capital",
    titulo: "Ganho de capital em ações",
    onde: "impostos",
    mensagens: par("ganho-capital", "Vendi ações em agosto. Pago imposto?", [
      "As vendas do mês somaram menos de R$ 20 mil, então o ganho fica isento.",
    ]),
  },
  {
    id: "financiar",
    titulo: "Financiar ou alugar",
    onde: "imoveis",
    mensagens: par("financiar", "Compensa financiar um apartamento agora?", [
      "Com os juros atuais, alugar e investir a diferença sai na frente nos primeiros 12 anos.",
    ]),
  },
  {
    id: "outubro",
    titulo: "Carteira de outubro",
    onde: "hoje",
    mensagens: [
      {
        id: "outubro-1",
        papel: "pessoa",
        texto: "Como a minha carteira fechou outubro?",
      },
      {
        id: "outubro-2",
        papel: "agente",
        ferramenta: "Consultou a carteira",
        texto: [
          "A carteira rendeu 1,2% em outubro, acima dos 0,9% do CDI no mês.",
          "Quem puxou foi a parte de ações, que subiu 3,4%. A renda fixa andou junto com o CDI e os fundos imobiliários ficaram estáveis.",
        ],
      },
      {
        id: "outubro-3",
        papel: "pessoa",
        texto: "Vale rebalancear agora?",
      },
      {
        id: "outubro-4",
        papel: "agente",
        texto: [
          "Ações passaram de 30% para 33% da carteira, acima da meta que você definiu. Vender cerca de R$ 3.800 em ações e levar para a renda fixa devolve a carteira aos 30%.",
          "Se preferir não vender, os próximos aportes podem ir só para a renda fixa até a proporção voltar.",
        ],
      },
    ],
  },
  {
    id: "aporte",
    titulo: "Simular aporte mensal",
    onde: "hoje",
    status: "working",
    mensagens: par(
      "aporte",
      "Quanto preciso aportar por mês para ter R$ 1 milhão em 15 anos?",
    ),
  },
  {
    id: "cdb-tesouro",
    titulo: "CDB ou Tesouro Selic",
    onde: "hoje",
    status: "unread",
    mensagens: par("cdb-tesouro", "Para a reserva, CDB ou Tesouro Selic?", [
      "Os dois servem. O CDB de liquidez diária a 100% do CDI rende um pouco mais e tem a garantia do FGC.",
    ]),
  },
  {
    id: "rebalancear",
    titulo: "Rebalancear para 2027",
    onde: "ontem",
    mensagens: par("rebalancear", "Qual alocação você sugere para 2027?", [
      "Manter 50% em renda fixa e subir o exterior de 8% para 12%, tirando de ações locais.",
    ]),
  },
  {
    id: "dividendos",
    titulo: "Dividendos do trimestre",
    onde: "ontem",
    mensagens: par("dividendos", "Quanto recebi de dividendos no trimestre?", [
      "R$ 1.284,30, sendo 62% de fundos imobiliários.",
    ]),
  },
  {
    id: "cambio",
    titulo: "Câmbio para a viagem",
    onde: "arquivadas",
    mensagens: par("cambio", "Compro os dólares da viagem de uma vez?", [
      "Comprar em três partes até a viagem dilui o risco de pegar o pior dia.",
    ]),
  },
  {
    id: "seguro",
    titulo: "Seguro do carro",
    onde: "arquivadas",
    mensagens: par("seguro", "O seguro do carro está caro?", [
      "Está 18% acima da média para o modelo e o seu CEP. Vale cotar antes de renovar.",
    ]),
  },
];

/** Pastas do histórico: com ícone aparece no trilho com menu ao lado; sem
 * ícone, some no trilho. */
export const PASTAS: {
  id: Pasta;
  label: string;
  icon?: Icon;
  activeIcon?: Icon;
}[] = [
  {
    id: "impostos",
    label: "Impostos",
    icon: IconFolder,
    activeIcon: IconFolderFilled,
  },
  { id: "imoveis", label: "Imóveis" },
];

/** O núcleo do Agente: Início é outra zona do domínio (navegação inteira),
 * com o href decidido por quem monta. */
export function agenteNucleo(inicioHref: string): NavLinkItem[] {
  return [
    {
      href: "#nova",
      label: "Nova conversa",
      icon: IconMessageCirclePlus,
      iconClassName: navTile("amber"),
    },
    {
      href: inicioHref,
      label: "Início",
      icon: IconHome,
      activeIcon: IconHomeFilled,
      iconClassName: navTile("sky"),
      external: "page",
    },
    {
      href: "#carteira",
      label: "Carteira",
      // Sem par Filled no Tabler: o mesmo glifo nos dois estados.
      icon: IconWallet,
      iconClassName: navTile("emerald"),
    },
  ];
}

export const AGENTE_USER: AppShellUser = {
  name: "Ana Souza",
  email: "ana@acme.com.br",
  detail: "Plano Investidor",
};

export type Alocacao = { classe: string; fracao: number; meta: number };

export const CARTEIRA = {
  total: 128_430.12,
  rendimentoMes: 0.012,
  cdiMes: 0.009,
  proventosMes: 482.6,
  alocacao: [
    { classe: "Renda fixa", fracao: 0.45, meta: 0.5 },
    { classe: "Ações", fracao: 0.33, meta: 0.3 },
    { classe: "Fundos imobiliários", fracao: 0.14, meta: 0.12 },
    { classe: "Exterior", fracao: 0.08, meta: 0.08 },
  ] satisfies Alocacao[],
};

// ---------------------------------------------------------------------------
// Barra: as zonas de um produto de leitura (Acme Invest)
// ---------------------------------------------------------------------------

/** Zonas em três seções separadas por espaço: Início; Mercado, Ativos e
 * Ferramentas; Agente. Ativos tem filhos com hint e um desabilitado. Agente é
 * outra zona do domínio (navegação inteira), com o href de quem monta. */
export function zonas(agenteHref: string): NavSection[] {
  return [
    { items: [{ href: "#inicio", label: "Início" }] },
    {
      items: [
        { href: "#mercado", label: "Mercado" },
        {
          label: "Ativos",
          children: [
            {
              href: "#ativos/acoes",
              label: "Ações",
              hint: "Empresas listadas na bolsa",
            },
            {
              href: "#ativos/fiis",
              label: "FIIs",
              hint: "Fundos imobiliários",
            },
            {
              href: "#ativos/etfs",
              label: "ETFs",
              hint: "Fundos que seguem um índice",
              disabled: "Em breve",
            },
            {
              href: "#ativos/exterior",
              label: "Exterior",
              hint: "BDRs e ações nos EUA",
            },
          ],
        },
        { href: "#ferramentas", label: "Ferramentas" },
      ],
    },
    { items: [{ href: agenteHref, label: "Agente", external: "page" }] },
  ];
}

export const INVEST_ACCOUNT: NavLinkItem[] = [
  {
    href: "#conta",
    label: "Configurações",
    icon: IconSettings,
    activeIcon: IconSettingsFilled,
    iconClassName: "text-muted-foreground/70",
  },
];

export type Ativo = {
  ticker: string;
  nome: string;
  classe: "acoes" | "fiis" | "exterior";
  preco: number;
  /** Variação do dia, em fração (0.034 = 3,4%). */
  variacao: number;
};

export const ATIVOS: Ativo[] = [
  {
    ticker: "ACME3",
    nome: "Acme Indústria",
    classe: "acoes",
    preco: 42.18,
    variacao: 0.034,
  },
  {
    ticker: "LUME3",
    nome: "Lume Energia",
    classe: "acoes",
    preco: 18.9,
    variacao: 0.021,
  },
  {
    ticker: "NIMB4",
    nome: "Nimbo Logística",
    classe: "acoes",
    preco: 9.74,
    variacao: -0.012,
  },
  {
    ticker: "ORLA11",
    nome: "Orla Lajes Corporativas",
    classe: "fiis",
    preco: 98.4,
    variacao: 0.004,
  },
  {
    ticker: "SERR11",
    nome: "Serra Logística",
    classe: "fiis",
    preco: 112.05,
    variacao: -0.006,
  },
  {
    ticker: "TERR39",
    nome: "Terra Tech (BDR)",
    classe: "exterior",
    preco: 61.3,
    variacao: 0.018,
  },
  {
    ticker: "MARE39",
    nome: "Maré Saúde (BDR)",
    classe: "exterior",
    preco: 27.66,
    variacao: -0.009,
  },
];

export const INDICES = [
  { rotulo: "Índice Acme", valor: "128.430 pts", variacao: 0.008 },
  { rotulo: "Dólar", valor: "R$ 5,42", variacao: -0.003 },
  { rotulo: "Juros futuros", valor: "10,65%", variacao: 0.001 },
  { rotulo: "Índice imobiliário", valor: "3.212 pts", variacao: -0.002 },
] as const;

export const FERRAMENTAS = [
  {
    titulo: "Simulador de aposentadoria",
    descricao: "Quanto aportar por mês para chegar à renda que você quer.",
  },
  {
    titulo: "Comparador de renda fixa",
    descricao: "CDB, LCI e Tesouro lado a lado, já com o imposto.",
  },
  {
    titulo: "Calculadora de IR",
    descricao: "O imposto das vendas do mês e o DARF pronto para pagar.",
  },
] as const;

export const ALERTAS = 2;

// ---------------------------------------------------------------------------
// Mural: o modo TV do BI de uma obra
// ---------------------------------------------------------------------------

export const OBRA = { nome: "Residencial Jardim Sul", periodo: "Semana 43" };

export const OBRA_USER: AppShellUser = {
  name: "Carlos Lima",
  email: "carlos@acme.com.br",
  detail: "Engenheiro da obra",
};

export const KPIS_OBRA = [
  {
    id: "avanco",
    rotulo: "Avanço físico",
    valor: "62%",
    detalhe: "Meta da semana: 60%",
  },
  {
    id: "concreto",
    rotulo: "Concreto lançado",
    valor: "48 m³",
    detalhe: "Hoje, até as 14h",
  },
  {
    id: "equipe",
    rotulo: "Equipe em campo",
    valor: "37",
    detalhe: "4 frentes de serviço",
  },
  {
    id: "seguranca",
    rotulo: "Dias sem acidente",
    valor: "128",
    detalhe: "Recorde da obra: 211",
  },
] as const;
export type KpiId = (typeof KPIS_OBRA)[number]["id"];

/** A navegação do BI fora do modo TV: categorias como itens com filhos. */
export const BI_NAV: NavSection[] = [
  {
    items: [
      {
        href: "#painel",
        label: "Painel da obra",
        icon: IconLayoutDashboard,
        activeIcon: IconLayoutDashboardFilled,
        iconClassName: navTile("sky"),
      },
    ],
  },
  {
    label: "Indicadores",
    items: [
      {
        label: "Produção",
        icon: IconChartBar,
        iconClassName: navTile("blue"),
        children: [
          { href: "#producao/concreto", label: "Concreto" },
          { href: "#producao/alvenaria", label: "Alvenaria" },
        ],
      },
      {
        label: "Equipe",
        icon: IconUsers,
        iconClassName: navTile("violet"),
        children: [
          { href: "#equipe/presenca", label: "Presença" },
          { href: "#equipe/horas", label: "Horas extras" },
        ],
      },
      {
        label: "Segurança",
        icon: IconHelmet,
        iconClassName: navTile("amber"),
        children: [
          { href: "#seguranca/ocorrencias", label: "Ocorrências" },
          { href: "#seguranca/treinamentos", label: "Treinamentos" },
        ],
      },
    ],
  },
];

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
