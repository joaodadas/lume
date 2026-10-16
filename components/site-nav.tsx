// Barra superior mínima do site do lume: marca, links das rotas e o ThemeSwitcher da registry. Arquivo do site (não entra na registry), por isso pode usar next/link e next/navigation.
"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeSwitcher } from "@/registry/base-vega/components/theme-switcher";
import { cn } from "@/registry/base-vega/lib/utils";
import { buttonVariants } from "@/registry/base-vega/ui/button";

const LINKS = [
  { href: "/componentes", label: "Componentes" },
  { href: "/blocos", label: "Blocos" },
  { href: "/botoes", label: "Botões" },
  { href: "/guia", label: "Guia" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-display text-base font-[450] tracking-[-0.02em] text-foreground"
        >
          lume
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          {LINKS.map((l) => {
            // Ativo quando a rota atual é a do link ou uma filha dele.
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-1 text-sm transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {/* Âncora direta com as classes do botão: assim o <a> já carrega o
              conteúdo acessível, sem depender do render do Button. */}
          <a
            href="https://github.com/joaodadas/lume"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <IconBrandGithub />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
