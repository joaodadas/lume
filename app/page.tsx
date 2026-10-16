import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import pkg from "@/package.json";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Button, buttonVariants } from "@/registry/base-vega/ui/button";
import { Card, CardContent } from "@/registry/base-vega/ui/card";

const COMANDOS = [
  `npx shadcn@latest init joaodadas/lume/base#v${pkg.version}`,
  `npx shadcn@latest add joaodadas/lume/kit-shell#v${pkg.version}`,
  "npx skills add joaodadas/lume --skill lume-design-engineering",
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          v{pkg.version}
        </Badge>
        <h1 className="font-display text-4xl font-[450] tracking-[-0.025em] text-balance">
          lume
        </h1>
        <p className="max-w-prose text-base text-muted-foreground text-pretty">
          Design system com a cara do Foglamp: tokens em oklch, sombra no lugar
          de borda, squircle, botões em pílula, tabelas densas e movimento
          contido. Componentes, blocos, guia e skill de agente, instaláveis por
          registry shadcn.
        </p>
      </div>

      <Card size="sm">
        <CardContent className="flex flex-col gap-2 font-mono text-xs">
          {COMANDOS.map((c) => (
            <code key={c} className="whitespace-pre-wrap break-all">
              {c}
            </code>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/componentes" />}>
          Componentes
          <IconArrowRight />
        </Button>
        <Button variant="outline" render={<Link href="/blocos" />}>
          Blocos
        </Button>
        <Button variant="outline" render={<Link href="/botoes" />}>
          Botões
        </Button>
        <Button variant="outline" render={<Link href="/guia" />}>
          Guia
        </Button>
        <a
          href="https://github.com/joaodadas/lume"
          className={buttonVariants({ variant: "ghost" })}
        >
          <IconBrandGithub />
          GitHub
        </a>
      </div>
    </main>
  );
}
