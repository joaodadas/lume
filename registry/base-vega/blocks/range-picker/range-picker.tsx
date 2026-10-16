// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/range-picker.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*; o divisor da coluna de presets trocou os hex #EFEFEF / #252525 por border-border/50 dark:border-border/40; Calendar com locale ptBR do date-fns (meses e dias da semana em português); os rótulos dos presets já vêm em pt-BR de lib/range.
"use client";

import { IconCalendarFilled, IconChevronDown } from "@tabler/icons-react";
import { ptBR } from "date-fns/locale";
import { useLayoutEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";

import {
  customRange,
  RANGE_PRESETS,
  type RangeValue,
  resolvePreset,
} from "@/registry/base-vega/lib/range";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import { Calendar } from "@/registry/base-vega/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/base-vega/ui/popover";

// One-click range presets surfaced as chips beside the calendar picker.
export const QUICK_PRESETS = ["24h", "3d", "7d"] as const;
export type QuickPreset = (typeof QUICK_PRESETS)[number];

/** True while one of the quick presets is the current range. */
export function isQuickPreset(value: RangeValue) {
  return (QUICK_PRESETS as readonly string[]).includes(value.key);
}

/** One quick-range chip. RangeControl lays them out; the landing demo lays
 * them out itself so each can enter on its own. */
export function RangePresetButton({
  preset,
  active,
  onClick,
}: {
  preset: QuickPreset;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "outline"}
      aria-pressed={active}
      className={cn(
        // transition-[color,box-shadow] leaves background-color out of
        // Button's transition-all, so the hover bg snaps instantly —
        // intentional; the calendar trigger matches it.
        "font-normal tabular-nums bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted transition-[color,box-shadow] active:scale-100",
        // Stay muted on hover (the outline variant lifts text to
        // foreground); only the surface responds, like ToggleChip.
        !active && "text-muted-foreground/50 hover:text-muted-foreground/50",
      )}
      onClick={onClick}
    >
      {preset}
    </Button>
  );
}

/** Quick-range chips + the calendar RangePicker. While a chip is active the
 * picker collapses to its icon — the label would only repeat the chip. */
export function RangeControl({
  value,
  onChange,
}: {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {QUICK_PRESETS.map((key) => (
        <RangePresetButton
          key={key}
          preset={key}
          active={value.key === key}
          onClick={() => onChange(resolvePreset(key))}
        />
      ))}
      <RangePicker
        value={value}
        onChange={onChange}
        compact={isQuickPreset(value)}
      />
    </div>
  );
}

export function RangePicker({
  value,
  onChange,
  compact = false,
}: {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  /** Icon-only trigger (the surrounding UI already conveys the range). */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // The calendar shows the current range highlighted (draft seeded on open), but
  // the first click of a new selection starts fresh — selecting against a
  // complete range would otherwise extend it and close on the first click.
  // `picking` tracks whether we're mid-selection.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [picking, setPicking] = useState(false);

  // The label's width is animated in CSS rather than letting the button snap
  // to its new size: the trigger sits at the end of a right-aligned toolbar
  // group, so a width change moves its *left* edge, and the tween makes it
  // grow/shrink leftwards while whatever follows it stays put. `width` can't
  // tween from `auto`, so the label is measured and set as px; `labelRef`
  // is a max-content span so its size is the intrinsic label width
  // regardless of the (clipped, tweening) box it sits in.
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: value.label entra de propósito: o rótulo muda e a medida precisa refazer (comentário do autor acima).
  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const update = () => setLabelWidth(el.getBoundingClientRect().width);
    update();
    // Fonts settling after mount change the label width too.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value.label]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setDraft({ from: value.from, to: value.to });
          setPicking(false);
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button
            // Mirrors the quick chips: whichever segment holds the current
            // selection renders secondary. `compact` means a chip owns it,
            // so the picker drops back to the plain outline surface.
            variant={compact ? "outline" : "secondary"}
            // Instant hover bg (no ease), matching the quick chips above.
            className="w-fit justify-start transition-[color,box-shadow] bg-card hover:bg-muted/50 aria-expanded:bg-muted/50 dark:hover:bg-muted dark:aria-expanded:bg-muted active:scale-100 font-normal gap-1.5"
          />
        }
      >
        <IconCalendarFilled
          className={cn(
            "ml-0.5 mb-px",
            compact ? "text-muted-foreground/50" : "text-foreground/95",
          )}
        />
        <span
          aria-hidden={compact}
          className={cn(
            "grid overflow-hidden transition-[width,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            // Collapsed: zero width, and eat the flex gap that would
            // otherwise sit between the icon and the chevron.
            compact && "-ml-1.5",
          )}
          style={{ width: compact ? 0 : (labelWidth ?? undefined) }}
        >
          <span ref={labelRef} className="w-max pr-1 pl-0.5">
            {value.label}
          </span>
        </span>
        <IconChevronDown className="ml-auto size-3.5 text-muted-foreground/50 mt-px" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="flex-row w-auto gap-0 overflow-hidden p-0"
      >
        {/* Divisor interno de meio pixel entre presets e calendário: era hex
            fixo (um por tema), agora o token de borda nas opacidades da
            linha de tabela. */}
        <div className="flex w-40 flex-col gap-1 border-r-[0.5px] border-solid border-border/50 dark:border-border/40 p-3">
          {RANGE_PRESETS.map((p) => (
            <Button
              key={p.key}
              variant={value.key === p.key ? "secondary" : "ghost"}
              size="sm"
              // Concentric with the popover: its radius (8px, 24px squircle)
              // minus this column's 12px padding — 12px under squircle, and
              // a small floor where the plain radius would go negative.
              className="justify-start font-normal transition-transform rounded-sm squircle:rounded-xl corner-squircle active:scale-100"
              onClick={() => {
                onChange(resolvePreset(p.key));
                setOpen(false);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="p-1 pl-2 pt-2">
          <Calendar
            mode="range"
            locale={ptBR}
            className="**:data-day:transition-none"
            numberOfMonths={2}
            defaultMonth={value.from}
            selected={draft}
            disabled={{ after: new Date() }}
            onSelect={(range, triggerDate) => {
              if (!picking) {
                // First click of a new selection: start fresh from the clicked
                // day instead of extending the highlighted range.
                setDraft({ from: triggerDate, to: undefined });
                setPicking(true);
                return;
              }
              // Second click: the range is complete → apply and close.
              setDraft(range);
              setPicking(false);
              if (range?.from && range.to) {
                onChange(customRange(range.from, range.to));
                setOpen(false);
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
