// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/theme-switcher.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*, MORPH importado de lib/motion no lugar da constante local, rótulos Sistema / Claro / Escuro e "Tema".
"use client";

import { IconDeviceLaptop, IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

import { MORPH } from "@/registry/base-vega/lib/motion";
import { cn } from "@/registry/base-vega/lib/utils";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";

// resolvedTheme is undefined during SSR and the first client render. We render a
// stable icon until mounted so the server and client agree; the real icon (and
// the active radio value) only appear once the theme is known on the client.
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// Same spring as the SDK-version toggle (instrument-empty-state), so segmented
// controls across the app glide identically.
// Aqui é o MORPH de lib/motion, o mesmo de toda pílula segmentada do sistema.

const THEME_OPTIONS = [
  { value: "system", label: "Sistema", icon: IconDeviceLaptop },
  { value: "light", label: "Claro", icon: IconSun },
  { value: "dark", label: "Escuro", icon: IconMoon },
] as const;

/**
 * Three-way theme control as a segmented pill (system / light / dark), matching
 * the SDK-version toggle. Switches instantly on click — no menu (used in the
 * marketing footer). The dropdown variant lives in {@link ThemeSubmenu}.
 */
// Precisa de um ThemeProvider acima (item theme-provider). Com o theme-provider-csp,
// troque o import de useTheme de "next-themes" pelo components/theme-provider que
// esse item instala (mesma forma: theme, setTheme, resolvedTheme).
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  // Unique per instance so the sliding pill is scoped to this control.
  const pillId = useId();

  return (
    <div className="inline-flex  items-center">
      {THEME_OPTIONS.map((opt) => {
        // Track the chosen setting (theme), not the resolved value, so "System"
        // is its own selectable state. Nothing is active until mounted, so the
        // server and first client render agree.
        const active = mounted && theme === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            aria-pressed={active}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "relative flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground/60 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={MORPH}
                className="absolute inset-0 rounded-full bg-input/50 shadow-(--custom-shadow) dark:bg-input/50"
              />
            )}
            <Icon className="relative z-10 size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

/** Theme picker rendered as a submenu item, for use inside another dropdown. */
export function ThemeSubmenu() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {mounted && resolvedTheme === "dark" ? <IconMoon /> : <IconSun />}
        Tema
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={mounted ? theme : undefined}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem value="light">
            <IconSun />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <IconMoon />
            Escuro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <IconDeviceLaptop />
            Sistema
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
