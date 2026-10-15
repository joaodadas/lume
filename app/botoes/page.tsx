// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/app/buttons/page.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports da registry, texto em pt-BR, listas de
// variants e sizes completas (ghost-destructive, badges red/fuchsia/sky/outline,
// size sm do badge e tamanhos icon do botão).
"use client";

import {
  IconArrowRight,
  IconBell,
  IconBellFilled,
  IconBolt,
  IconBoltFilled,
  IconBookmark,
  IconBookmarkFilled,
  IconCamera,
  IconCircleCheckFilled,
  IconClock,
  IconCloud,
  IconCloudFilled,
  IconDownload,
  IconEyeFilled,
  IconFlag,
  IconFlagFilled,
  IconFolder,
  IconFolderFilled,
  IconHeart,
  IconHeartFilled,
  IconHome,
  IconHomeFilled,
  IconMail,
  IconMapPin,
  IconMapPinFilled,
  IconMoon,
  IconMoonFilled,
  IconPlayerPlayFilled,
  IconPlus,
  IconRocket,
  IconSettings,
  IconSettingsFilled,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconSun,
  IconSunFilled,
  IconThumbUp,
  IconThumbUpFilled,
  IconTrash,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Badge } from "@/registry/base-vega/ui/badge";
import { Button } from "@/registry/base-vega/ui/button";
import { Kbd } from "@/registry/base-vega/ui/kbd";

// Playground para afinar button e badge. Aperte T em qualquer lugar da página
// para alternar light e dark.

const OUTLINED = [
  IconStar,
  IconHeart,
  IconPlus,
  IconArrowRight,
  IconDownload,
  IconSettings,
  IconTrash,
  IconBolt,
  IconBell,
  IconBookmark,
  IconCamera,
  IconClock,
  IconCloud,
  IconFlag,
  IconFolder,
  IconHome,
  IconMail,
  IconMapPin,
  IconMoon,
  IconSun,
  IconRocket,
  IconSparkles,
  IconThumbUp,
];

const FILLED = [
  IconStarFilled,
  IconHeartFilled,
  IconBellFilled,
  IconBookmarkFilled,
  IconBoltFilled,
  IconCircleCheckFilled,
  IconTrashFilled,
  IconSettingsFilled,
  IconPlayerPlayFilled,
  IconFlagFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconMoonFilled,
  IconSunFilled,
  IconCloudFilled,
  IconMapPinFilled,
  IconEyeFilled,
  IconThumbUpFilled,
];

// Sorteio determinístico para servidor e cliente renderizarem o mesmo markup
// (Math.random quebraria a hidratação). Cada slot recebe um ícone diferente,
// alterna filled e outline e troca entre leading e trailing.
function pick(i: number) {
  const filled = i % 2 === 1;
  const pool = filled ? FILLED : OUTLINED;
  const Icon = pool[(i * 7 + 3) % pool.length] ?? IconStar;
  const leading = i % 3 !== 1;
  return { Icon, leading };
}

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "ghost-destructive",
  "destructive",
  "link",
] as const;

const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "green",
  "emerald",
  "blue",
  "sky",
  "violet",
  "fuchsia",
  "amber",
  "orange",
  "red",
  "rose",
] as const;

const BADGE_SIZES = ["sm", "md", "lg"] as const;

function useThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "t" || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return;
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolvedTheme, setTheme]);
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function BotoesPage() {
  useThemeHotkey();

  // Contador único na página inteira para dois vizinhos não repetirem ícone.
  let slot = 0;

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <div>
        <h1 className="text-lg font-semibold">Botões e badges</h1>
        <p className="text-sm text-muted-foreground">
          Aperte <Kbd>T</Kbd> para alternar o tema
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Botões</h2>
        <div className="flex flex-col gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Row key={variant} label={variant}>
              {BUTTON_SIZES.map((size) => {
                const { Icon, leading } = pick(slot++);
                return (
                  <Button key={size} variant={variant} size={size}>
                    {leading && <Icon />}
                    Botão
                    {!leading && <Icon />}
                  </Button>
                );
              })}
              {ICON_SIZES.map((size) => {
                const { Icon } = pick(slot++);
                return (
                  <Button
                    key={size}
                    variant={variant}
                    size={size}
                    aria-label={`${variant} ${size}`}
                  >
                    <Icon />
                  </Button>
                );
              })}
            </Row>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Badges</h2>
        <div className="flex flex-col gap-3">
          {BADGE_VARIANTS.map((variant) => (
            <Row key={variant} label={variant}>
              {BADGE_SIZES.map((size) => {
                const { Icon, leading } = pick(slot++);
                return (
                  <Badge key={size} variant={variant} size={size}>
                    {leading && <Icon />}
                    Badge
                    {!leading && <Icon />}
                  </Badge>
                );
              })}
            </Row>
          ))}
        </div>
      </section>
    </main>
  );
}
