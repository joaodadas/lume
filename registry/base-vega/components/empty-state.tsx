// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só EmptyState (linhas 687-716 do upstream), em arquivo próprio sobre o Empty da registry; NoProject ficou de fora (tRPC e auth do Foglamp).

import { cn } from "@/registry/base-vega/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/base-vega/ui/empty";

/** Estado vazio padrão das páginas: caixa tracejada (a única borda fechando
 * caixa do sistema), ícone em tile apagado a 40% e título curto. Filhos vão
 * abaixo da descrição, para um botão de ação ou link. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Empty className={cn("border border-dashed", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className={cn("opacity-40", iconClassName)} />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>{title}</EmptyTitle>
          {description && <EmptyDescription>{description}</EmptyDescription>}
          {children}
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  );
}
