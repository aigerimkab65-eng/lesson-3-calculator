"use client";

import {
  formatMoneyLine,
  getPriceParts,
  getPricePartsFromKzt,
} from "@/lib/calc";

interface PriceBarProps {
  total: number | null;
  currencyBase: "usd" | "kzt";
  individual?: boolean;
}

export function PriceBar({
  total,
  currencyBase,
  individual = false,
}: PriceBarProps) {
  const parts =
    total === null
      ? null
      : currencyBase === "kzt"
        ? getPricePartsFromKzt(total)
        : getPriceParts(total);

  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow)]">
      <p className="text-xs uppercase tracking-[0.08em] text-muted">
        Предварительная стоимость
      </p>
      {individual ? (
        <p className="mt-1 font-display text-2xl font-semibold text-price">
          Индивидуальный расчёт
        </p>
      ) : parts ? (
        <div className="mt-2 space-y-1">
          <p className="font-display text-2xl font-semibold text-price">
            {formatMoneyLine(parts.kzt, "₸")}
          </p>
          <p className="text-base font-medium text-foreground">
            {formatMoneyLine(parts.rub, "₽")}
          </p>
          <p className="text-sm text-muted">
            {formatMoneyLine(parts.usd, "$")}
          </p>
        </div>
      ) : (
        <p className="mt-1 font-display text-2xl font-semibold text-price">
          Выберите услугу
        </p>
      )}
    </div>
  );
}
