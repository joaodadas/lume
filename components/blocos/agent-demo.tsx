// Formato Agente da vitrine (o formato Agente do guia 03): layout sidebar
// que abre no trilho de ícones, o histórico de conversas sem ícone (some no
// trilho), uma conversa com status working, a página em fill quando é
// conversa e o painel da carteira no slot panel, empurrando o cartão. As
// respostas do agente são fixas. Arquivo do site, não entra na registry.
"use client";

import {
  IconArchiveFilled,
  IconArchiveOff,
  IconArrowUp,
  IconDotsFilled,
  IconLayoutSidebarRightCollapseFilled,
  IconLayoutSidebarRightExpandFilled,
  IconLogout,
  IconPencilFilled,
  IconPinFilled,
  IconPinnedOff,
  IconSparklesFilled,
  IconTool,
  IconWallet,
} from "@tabler/icons-react";
import type * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import {
  goTo,
  Marca,
  type Painel,
  PainelCarteira,
  PaletaDeBusca,
  percentual,
  useHashRoute,
  usePainel,
} from "@/components/blocos/demo-kit";
import {
  AGENTE_USER,
  agenteNucleo,
  CARTEIRA,
  CONVERSAS,
  type Conversa,
  conversaHref,
  type Mensagem,
  PASTAS,
} from "@/components/blocos/mock";
import { AppShell } from "@/registry/base-vega/blocks/app-shell/app-shell";
import {
  type NavBadge,
  type NavLinkItem,
  type NavSection,
  navTile,
} from "@/registry/base-vega/blocks/app-shell/nav";
import { SearchTrigger } from "@/registry/base-vega/blocks/app-shell/shell-parts";
import { PageHeader } from "@/registry/base-vega/components/page-header";
import { ScrollFade } from "@/registry/base-vega/components/scroll-fade";
import { Section } from "@/registry/base-vega/components/section";
import { StatCard } from "@/registry/base-vega/components/stat-card";
import { StatGrid } from "@/registry/base-vega/components/stat-grid";
import { formatMoney, formatPercent } from "@/registry/base-vega/lib/format";
import { useReduce } from "@/registry/base-vega/lib/motion";
import { Button } from "@/registry/base-vega/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/base-vega/ui/empty";
import { TextShimmerLoader } from "@/registry/base-vega/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";

const NOVA = "#nova";
const CARTEIRA_HREF = "#carteira";
const ABERTA = conversaHref("outubro");

// O tempo que a resposta fixa leva para chegar: o bastante para o status
// "Respondendo" aparecer na sidebar.
const REPLY_DELAY = 1400;

const REPLY = [
  "Esta é a vitrine do lume: a resposta é sempre esta.",
  "Num app de verdade, o texto chega em streaming e a conversa sai de Respondendo quando ele termina.",
];

const SUGESTOES = [
  "Como fechou a minha carteira em outubro?",
  "Quanto rendeu a renda fixa este ano?",
  "Estou perto da meta de alocação?",
];

type Onde = Conversa["onde"];

const SECAO: Record<Onde, string> = {
  fixadas: "Fixadas",
  hoje: "Hoje",
  ontem: "Ontem",
  arquivadas: "Arquivadas",
  impostos: "Impostos",
  imoveis: "Imóveis",
};

type Acoes = {
  mover: (conversa: Conversa, onde: Onde) => void;
};

/** As ações de uma conversa: as mesmas no ⋯ da sidebar e no topo da página. */
function AcoesDaConversa({
  conversa,
  acoes,
}: {
  conversa: Conversa;
  acoes: Acoes;
}) {
  return (
    <>
      <DropdownMenuItem onClick={() => toast("Título em edição")}>
        <IconPencilFilled />
        Renomear
      </DropdownMenuItem>
      {conversa.onde === "fixadas" ? (
        <DropdownMenuItem onClick={() => acoes.mover(conversa, "hoje")}>
          <IconPinnedOff />
          Desafixar
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onClick={() => acoes.mover(conversa, "fixadas")}>
          <IconPinFilled />
          Fixar
        </DropdownMenuItem>
      )}
      {conversa.onde === "arquivadas" ? (
        <DropdownMenuItem onClick={() => acoes.mover(conversa, "hoje")}>
          <IconArchiveOff />
          Desarquivar
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onClick={() => acoes.mover(conversa, "arquivadas")}>
          <IconArchiveFilled />
          Arquivar
        </DropdownMenuItem>
      )}
    </>
  );
}

/** O Nav do Agente a partir das conversas: núcleo com ícone, Fixadas, Pastas,
 * Hoje e Ontem rotuladas, e Arquivadas como item com filhos, fechado. */
function agentNav(
  conversas: Conversa[],
  inicioHref: string,
  badgeOf: (conversa: Conversa) => NavBadge | undefined,
  acoes: Acoes,
): NavSection[] {
  const link = (conversa: Conversa): NavLinkItem => ({
    href: conversaHref(conversa.id),
    label: conversa.titulo,
    badge: badgeOf(conversa),
    menu: <AcoesDaConversa conversa={conversa} acoes={acoes} />,
  });
  const em = (onde: Onde) =>
    conversas.filter((conversa) => conversa.onde === onde).map(link);
  return [
    { items: agenteNucleo(inicioHref) },
    { label: "Fixadas", items: em("fixadas") },
    {
      label: "Pastas",
      items: PASTAS.map((pasta) => ({
        label: pasta.label,
        icon: pasta.icon,
        activeIcon: pasta.activeIcon,
        iconClassName: "text-muted-foreground/70",
        children: em(pasta.id),
        menu: (
          <DropdownMenuItem onClick={() => toast("Título da pasta em edição")}>
            <IconPencilFilled />
            Renomear pasta
          </DropdownMenuItem>
        ),
      })),
    },
    { label: "Hoje", items: em("hoje") },
    { label: "Ontem", items: em("ontem") },
    { items: [{ label: "Arquivadas", children: em("arquivadas") }] },
  ];
}

export function AgentDemo({ inicioHref }: { inicioHref: string }) {
  const [conversas, setConversas] = useState(CONVERSAS);
  const [replying, setReplying] = useState<ReadonlySet<string>>(new Set());
  const [seen, setSeen] = useState<ReadonlySet<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const painel = usePainel(true);
  const seq = useRef(0);
  const timers = useRef(new Set<number>());

  const route = useHashRoute(
    ABERTA,
    (hash) =>
      hash === NOVA ||
      hash === CARTEIRA_HREF ||
      conversas.some((conversa) => conversaHref(conversa.id) === hash),
  );
  const atual = conversas.find(
    (conversa) => conversaHref(conversa.id) === route,
  );
  const atualId = atual?.id;
  const chat = route === NOVA || atual !== undefined;

  // Abrir a conversa conta como ver a resposta nova.
  useEffect(() => {
    if (atualId)
      setSeen((prev) =>
        prev.has(atualId) ? prev : new Set(prev).add(atualId),
      );
  }, [atualId]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
    };
  }, []);

  const badgeOf = (conversa: Conversa): NavBadge | undefined => {
    if (conversa.status === "working" || replying.has(conversa.id))
      return { status: "working", label: "Respondendo" };
    if (conversa.status === "unread" && !seen.has(conversa.id))
      return { status: "unread", label: "Resposta nova" };
    return undefined;
  };

  const acoes: Acoes = {
    mover: (conversa, onde) =>
      setConversas((prev) =>
        prev.map((item) =>
          item.id === conversa.id ? { ...item, onde } : item,
        ),
      ),
  };

  const reply = (id: string) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      setConversas((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                mensagens: [
                  ...item.mensagens,
                  {
                    id: `${id}-r${item.mensagens.length}`,
                    papel: "agente",
                    texto: REPLY,
                  },
                ],
              }
            : item,
        ),
      );
      setReplying((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, REPLY_DELAY);
    timers.current.add(timer);
  };

  const send = (texto: string) => {
    seq.current += 1;
    const pessoa: Mensagem = {
      id: `m${seq.current}`,
      papel: "pessoa",
      texto,
    };
    if (atual) {
      setConversas((prev) =>
        prev.map((item) =>
          item.id === atual.id
            ? { ...item, mensagens: [...item.mensagens, pessoa] }
            : item,
        ),
      );
      setReplying((prev) => new Set(prev).add(atual.id));
      reply(atual.id);
      return;
    }
    // Nova conversa: entra no topo de Hoje com a pergunta como título.
    const id = `nova-${seq.current}`;
    const nova: Conversa = {
      id,
      titulo: texto.length > 40 ? `${texto.slice(0, 40).trimEnd()}…` : texto,
      onde: "hoje",
      mensagens: [pessoa],
    };
    setConversas((prev) => {
      const first = prev.findIndex((item) => item.onde === "hoje");
      const at = first === -1 ? prev.length : first;
      return [...prev.slice(0, at), nova, ...prev.slice(at)];
    });
    setReplying((prev) => new Set(prev).add(id));
    reply(id);
    goTo(conversaHref(id));
  };

  const nav = agentNav(conversas, inicioHref, badgeOf, acoes);

  return (
    <AppShell
      nav={nav}
      pathname={route}
      brand={<Marca nome="Acme Invest" />}
      // A vitrine mostra o Agente já no trilho. No app, defaultOpen vem do
      // cookie, e a primeira visita abre a sidebar.
      defaultOpen={false}
      fill={chat}
      panel={<PainelCarteira painel={painel} />}
      tools={
        <SearchTrigger
          label="Buscar conversas"
          onOpen={() => setSearching(true)}
        />
      }
      user={AGENTE_USER}
      userMenu={
        <DropdownMenuItem onClick={() => toast("Sessão encerrada")}>
          <IconLogout />
          Sair
        </DropdownMenuItem>
      }
    >
      <PaletaDeBusca
        open={searching}
        onOpenChange={setSearching}
        title="Buscar conversas"
        description="Abra uma conversa do histórico."
        placeholder="Buscar conversa…"
        groups={[
          {
            heading: "Conversas",
            items: conversas.map((conversa) => ({
              id: conversaHref(conversa.id),
              label: conversa.titulo,
              hint: SECAO[conversa.onde],
              onSelect: () => goTo(conversaHref(conversa.id)),
            })),
          },
        ]}
      />
      {chat ? (
        <ChatPage
          conversa={atual}
          working={
            atual !== undefined &&
            (atual.status === "working" || replying.has(atual.id))
          }
          onSend={send}
          painel={painel}
          acoes={acoes}
        />
      ) : (
        <CarteiraPage painel={painel} />
      )}
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Conversa (página em fill)
// ---------------------------------------------------------------------------

function PanelToggle({ painel }: { painel: Painel }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={painel.open ? "Fechar carteira" : "Abrir carteira"}
      aria-expanded={painel.open}
      onClick={painel.toggle}
    >
      {painel.open ? (
        <IconLayoutSidebarRightCollapseFilled />
      ) : (
        <IconLayoutSidebarRightExpandFilled />
      )}
    </Button>
  );
}

// O primeiro ancestral que rola na vertical: o viewport do ScrollFade.
function scrollParent(element: HTMLElement | null): HTMLElement | null {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
  }
  return null;
}

function ChatPage({
  conversa,
  working,
  onSend,
  painel,
  acoes,
}: {
  conversa?: Conversa;
  working: boolean;
  onSend: (texto: string) => void;
  painel: Painel;
  acoes: Acoes;
}) {
  const mensagens = conversa?.mensagens ?? [];
  const reduce = useReduce();
  const endRef = useRef<HTMLDivElement>(null);
  const last = useRef({ id: conversa?.id, count: mensagens.length });

  // Mensagem nova na mesma conversa desce até o fim; abrir outra conversa
  // não rola nada. Só o viewport da lista rola: o scrollIntoView alinharia
  // também a página do site em volta da moldura.
  useEffect(() => {
    const before = last.current;
    last.current = { id: conversa?.id, count: mensagens.length };
    if (before.id !== conversa?.id || mensagens.length <= before.count) return;
    const list = scrollParent(endRef.current);
    list?.scrollTo({
      top: list.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [conversa?.id, mensagens.length, reduce]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
          <span className="shrink-0 text-muted-foreground">Agente</span>
          <span aria-hidden className="text-muted-foreground/40">
            /
          </span>
          <span className="truncate font-medium">
            {conversa?.titulo ?? "Nova conversa"}
          </span>
        </div>
        <PanelToggle painel={painel} />
        {conversa && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Mais ações: ${conversa.titulo}`}
                />
              }
            >
              <IconDotsFilled />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-auto min-w-48 data-open:duration-0"
            >
              <AcoesDaConversa conversa={conversa} acoes={acoes} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {mensagens.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center px-4">
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconSparklesFilled className="text-amber-500" />
              </EmptyMedia>
              <EmptyTitle>Pergunte ao agente</EmptyTitle>
              <EmptyDescription>
                Ele lê a sua carteira e responde com os números dela.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <ScrollFade
          containerClassName="min-h-0 flex-1"
          className="h-full"
          fromClassName="from-background"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
            {mensagens.map((mensagem) => (
              <Bolha key={mensagem.id} mensagem={mensagem} />
            ))}
            {working && (
              <TextShimmerLoader text="Pensando…" size="sm" className="pl-3" />
            )}
            <div ref={endRef} />
          </div>
        </ScrollFade>
      )}

      <div className="shrink-0 px-4 pb-[max(--spacing(4),env(safe-area-inset-bottom))]">
        <Composer
          key={conversa?.id ?? "nova"}
          onSend={onSend}
          sugestoes={mensagens.length === 0 ? SUGESTOES : undefined}
        />
      </div>
    </div>
  );
}

function Bolha({ mensagem }: { mensagem: Mensagem }) {
  if (mensagem.papel === "pessoa")
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-lg squircle:rounded-3xl corner-squircle bg-card shadow-(--custom-shadow) px-3 py-2 text-sm text-primary">
          {mensagem.texto}
        </div>
      </div>
    );
  return (
    <div className="flex flex-col items-start gap-1.5">
      {mensagem.ferramenta && (
        <div className="ml-3 flex w-fit items-center gap-1.5 py-1 text-xs text-muted-foreground">
          <IconTool className="size-3 shrink-0 fill-current stroke-0" />
          {mensagem.ferramenta}
        </div>
      )}
      <div className="max-w-[90%] px-3 py-0 text-sm leading-relaxed [&_p]:my-1.5 *:first:mt-0 *:last:mb-0">
        {mensagem.texto.map((paragrafo) => (
          <p key={paragrafo}>{paragrafo}</p>
        ))}
      </div>
    </div>
  );
}

// Receita do guia 08: o textarea cru como card, Enter envia e Shift+Enter
// quebra a linha; text-base abaixo de md para o iOS não dar zoom.
function Composer({
  onSend,
  sugestoes,
}: {
  onSend: (texto: string) => void;
  sugestoes?: readonly string[];
}) {
  const [texto, setTexto] = useState("");
  const fieldId = useId();
  const send = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    onSend(clean);
    setTexto("");
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return;
    event.preventDefault();
    send(texto);
  };
  return (
    <form
      className="relative mx-auto flex w-full max-w-3xl flex-col gap-2 p-1 pt-0"
      onSubmit={(event) => {
        event.preventDefault();
        send(texto);
      }}
    >
      {sugestoes && (
        <div className="flex flex-col items-start">
          {sugestoes.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => send(sugestao)}
              className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md squircle:rounded-xl corner-squircle px-2 py-1.5 text-left text-sm text-muted-foreground/50 hover:bg-accent/70 hover:text-foreground dark:hover:bg-accent/40"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
      <label htmlFor={fieldId} className="sr-only">
        Mensagem para o agente
      </label>
      <textarea
        id={fieldId}
        rows={2}
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Pergunte ao agente…"
        className="max-h-32 min-h-20 flex-1 resize-none rounded-xl squircle:rounded-4xl corner-squircle bg-card p-4 pr-12 text-base shadow-(--custom-shadow) outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:border-ring md:text-sm dark:bg-muted/30"
      />
      <Button
        type="submit"
        size="icon-xs"
        aria-label="Enviar"
        disabled={!texto.trim()}
        className="absolute right-4 bottom-4"
      >
        <IconArrowUp className="size-4" />
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Carteira (página comum, fora do fill)
// ---------------------------------------------------------------------------

function CarteiraPage({ painel }: { painel: Painel }) {
  return (
    <>
      <PageHeader
        title="Carteira"
        icon={IconWallet}
        iconClassName={navTile("emerald")}
        actions={<PanelToggle painel={painel} />}
      />
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
          label="CDI no mês"
          value={percentual(CARTEIRA.cdiMes)}
        />
        <StatCard
          size="sm"
          label="Proventos no mês"
          value={CARTEIRA.proventosMes}
          formatValue={(n) => formatMoney(n)}
        />
      </StatGrid>
      <Section
        title="Alocação"
        description="Quanto cada classe pesa hoje, contra a meta que você definiu."
        className="mt-1"
      >
        {/* As células trazem o gutter (px-8.25), como na tabela do dashboard. */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Classe</TableHead>
              <TableHead align="right" className="w-28">
                Hoje
              </TableHead>
              <TableHead align="right" className="w-28">
                Meta
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CARTEIRA.alocacao.map((item) => (
              <TableRow key={item.classe}>
                <TableCell className="h-12">{item.classe}</TableCell>
                <TableCell align="right">
                  {formatPercent(item.fracao)}
                </TableCell>
                <TableCell align="right" className="text-muted-foreground">
                  {formatPercent(item.meta)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </>
  );
}
