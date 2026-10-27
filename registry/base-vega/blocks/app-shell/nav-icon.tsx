// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/app-shell.tsx:213-255 @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: extraído para arquivo próprio, imports da registry e, como no painel, um único glifo quando o ícone não tem variante filled (activeIcon === icon); shrink-0 no wrapper, activeIcon opcional (sem ele, o mesmo glifo único) e nada renderizado para item sem icon.
import type { Icon } from "@tabler/icons-react";

import { cn } from "@/registry/base-vega/lib/utils";

// Cross-fades the outline icon into its filled variant when the tab goes active.
// Both icons are stacked in the same grid cell so only the glyph opacity tweens;
// the colored chip (`className`, e.g. background + padding + shadow) lives on the
// wrapper so it stays constant across the swap instead of fading in and out.
//
// The wrapper is pinned to the icon footprint (`size-4.5`) and the inner SVGs
// fill its padded content box (`size-full`, overriding the sidebar's forced
// `[&_svg]:size-4.5`). This keeps a chip item's outer size at 18px with the glyph
// inset by its padding — matching the original single-icon geometry — rather than
// letting the padding grow the chip around two full-size icons.
//
// Nem todo ícone do Tabler tem o par Filled; quando o item repete o mesmo
// componente nos dois campos, ou não passa activeIcon, fica um glifo só,
// sempre visível.
//
// Item sem icon (conversa, favorito) não ganha ícone nem lugar reservado: o
// rótulo começa no padding do botão, na coluna do rótulo da seção. Sem icon,
// activeIcon é ignorado, porque é o icon que decide se o item vai para o trilho.
export function NavIcon({
  icon: OutlineIcon,
  activeIcon: ActiveIcon,
  active,
  className,
}: {
  icon?: Icon;
  activeIcon?: Icon;
  active: boolean;
  className?: string;
}) {
  if (!OutlineIcon) return null;
  const hasFilled = ActiveIcon !== undefined && ActiveIcon !== OutlineIcon;
  return (
    <span
      className={cn(
        "grid size-4.5 shrink-0 place-items-center [&_svg]:size-full!",
        className,
      )}
    >
      <OutlineIcon
        className={cn(
          "[grid-area:1/1] transition-opacity duration-100 ease-in-out",
          active && hasFilled ? "opacity-0" : "opacity-100",
        )}
      />
      {hasFilled && (
        <ActiveIcon
          className={cn(
            "[grid-area:1/1] transition-opacity duration-100 ease-in-out",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
