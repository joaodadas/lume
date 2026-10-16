// Faixa de aviso da página, generalizada de Aviso e FalhaDeLeitura do painel do lyx-pr-agent (João Vitor Dadas); não existe no Foglamp. Três tons (warning, error, info), cada um com a sombra colorida do token no lugar de borda.

import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconInfoCircleFilled,
} from "@tabler/icons-react";

import { PX } from "@/registry/base-vega/components/page-header";
import { cn } from "@/registry/base-vega/lib/utils";

export type NoticeTone = "warning" | "error" | "info";

// Receita por tom: fundo a 10%, texto escuro no claro e claro no escuro, ícone
// Tabler filled na cor cheia e a sombra do token (--custom-shadow-amber, -rose,
// -blue), que faz o papel da borda. Warning é a receita original do painel.
const TONES: Record<
  NoticeTone,
  { box: string; icon: string; Icon: typeof IconAlertTriangleFilled }
> = {
  warning: {
    box: "bg-amber-500/10 text-amber-900 shadow-(--custom-shadow-amber) dark:bg-amber-500/10 dark:text-amber-200",
    icon: "text-amber-500",
    Icon: IconAlertTriangleFilled,
  },
  error: {
    box: "bg-rose-500/10 text-rose-900 shadow-(--custom-shadow-rose) dark:bg-rose-500/10 dark:text-rose-200",
    icon: "text-rose-500",
    Icon: IconAlertCircleFilled,
  },
  info: {
    box: "bg-blue-500/10 text-blue-900 shadow-(--custom-shadow-blue) dark:bg-blue-500/10 dark:text-blue-200",
    icon: "text-blue-500",
    Icon: IconInfoCircleFilled,
  },
};

/** Faixa de aviso entre os blocos da página (cota pausada, leitura velha,
 * falha de rede). Título em peso médio seguido de ponto e o texto corrido na
 * mesma linha; o gutter é o PX da página. */
export function Notice({
  tone = "warning",
  title,
  children,
  className,
}: {
  tone?: NoticeTone;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { box, icon, Icon } = TONES[tone];
  return (
    <div className={cn(PX, className)}>
      <div
        role={tone === "error" ? "alert" : "status"}
        className={cn(
          "flex items-start gap-3 rounded-lg px-4 py-3 text-sm",
          box,
        )}
      >
        <Icon className={cn("mt-0.5 size-4 shrink-0", icon)} />
        <p className="text-pretty">
          <span className="font-medium">
            {title}
            {children ? "." : null}
          </span>
          {children ? <> {children}</> : null}
        </p>
      </div>
    </div>
  );
}
