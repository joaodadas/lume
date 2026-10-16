// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/onboarding-panel.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só a casca do OnboardingPanel (linhas 92-150) virou BorderBeamCard({ children, className, active }); sem tRPC, chave, prompt nem analytics; Card de @/registry/base-vega/ui/card.
"use client";

import { BorderBeam } from "border-beam";
import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";
import { Card } from "@/registry/base-vega/ui/card";

// Card com o anel de luz pulsante do onboarding do Foglamp: BorderBeam
// size="pulse-inner" colorVariant="colorful" strength 0.6, raio 16 px. É o
// card que chama atenção para o próximo passo (cole o prompt, crie a chave);
// um por tela, no máximo. O conteúdo vai dentro como num Card normal
// (CardHeader, CardTitle, CardDescription, CardAction, CardContent).
export function BorderBeamCard({
  children,
  className,
  active = true,
}: {
  children: React.ReactNode;
  /** Classes extras do Card interno (o anel segue o raio fixo de 16 px). */
  className?: string;
  /** Desliga o anel com fade (o card continua renderizado). */
  active?: boolean;
}) {
  return (
    <BorderBeam
      size="pulse-inner"
      colorVariant="colorful"
      strength={0.6}
      borderRadius={16}
      active={active}
    >
      {/* The beam shapes its ring with clip-path: inset(round) — always a
          circular arc, immune to corner-shape — so it can't be a squircle.
          corner-round! drops the Card's default superellipse to a plain round
          corner at the same 22px (rounded-3xl) radius so the edges align. */}
      {/* O rounded-2xl! (16 px) casa com o borderRadius={16} do anel; o card
          vizinho sem anel deve usar corner-round! também para o par ficar
          consistente. */}
      <Card className={cn("h-full corner-round! rounded-2xl!", className)}>
        {children}
      </Card>
    </BorderBeam>
  );
}
