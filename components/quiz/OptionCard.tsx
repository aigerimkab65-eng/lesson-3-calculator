"use client";

import type { LucideIcon } from "lucide-react";

interface OptionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({
  title,
  subtitle,
  icon: Icon,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        selected
          ? "border-accent bg-accent-soft shadow-sm"
          : "border-border bg-surface hover:border-accent/40 hover:bg-surface-soft",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          selected
            ? "bg-accent text-accent-contrast"
            : "bg-surface-soft text-accent",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-snug text-foreground">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-1 block text-sm text-muted">{subtitle}</span>
        ) : null}
      </span>
    </button>
  );
}
