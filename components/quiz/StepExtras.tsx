"use client";

import {
  convertKzt,
  formatPriceFromKzt,
  formatSupportLine,
  getExtraQuantity,
} from "@/lib/calc";
import {
  QUANTITY_OPTIONS,
  SITE_EXTRAS,
  SUPPORT_DESCRIPTION,
  SUPPORT_MONTHLY_KZT,
} from "@/lib/pricing";
import type { ExtraId, ExtraQuantities, QuantityOption } from "@/lib/types";

interface StepExtrasProps {
  selectedExtraIds: ExtraId[];
  extraQuantities: ExtraQuantities;
  supportEnabled: boolean;
  onToggleExtra: (extraId: ExtraId) => void;
  onExtraQuantity: (extraId: ExtraId, quantity: QuantityOption) => void;
  onToggleSupport: () => void;
}

export function StepExtras({
  selectedExtraIds,
  extraQuantities,
  supportEnabled,
  onToggleExtra,
  onExtraQuantity,
  onToggleSupport,
}: StepExtrasProps) {
  const supportParts = convertKzt(SUPPORT_MONTHLY_KZT);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Дополнения к сайту
        </h2>
        <p className="mt-1 text-sm text-muted">
          Можно выбрать несколько пунктов или пропустить
        </p>
      </div>

      <div className="space-y-2.5">
        {SITE_EXTRAS.map((extra) => {
          const checked = selectedExtraIds.includes(extra.id);
          const quantity = getExtraQuantity(extra.id, extraQuantities);

          return (
            <div key={extra.id} className="space-y-2">
              <label
                className={[
                  "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition",
                  "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
                  checked
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-surface hover:border-accent/40",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  checked={checked}
                  onChange={() => onToggleExtra(extra.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-foreground">
                    {extra.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {extra.hasQuantity
                      ? `${formatPriceFromKzt(extra.priceKzt)} ${extra.unitLabel ?? ""}`.trim()
                      : formatPriceFromKzt(extra.priceKzt)}
                  </span>
                </span>
              </label>

              {extra.hasQuantity && checked ? (
                <div className="grid grid-cols-4 gap-2 pl-1">
                  {QUANTITY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={quantity === option}
                      onClick={() => onExtraQuantity(extra.id, option)}
                      className={[
                        "rounded-xl border px-2 py-2 text-sm font-medium transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                        quantity === option
                          ? "border-accent bg-accent-soft text-foreground"
                          : "border-border bg-surface text-muted",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-surface px-4 py-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
            checked={supportEnabled}
            onChange={onToggleSupport}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-foreground">
              Поддержка сайта
            </span>
            <span className="mt-1 block text-sm text-muted">
              {formatSupportLine(supportParts)}
            </span>
          </span>
        </label>
        <p className="text-sm leading-relaxed text-muted">
          {SUPPORT_DESCRIPTION}
        </p>
        <p className="text-xs text-muted">
          Поддержка не входит в итоговую сумму проекта — это отдельная оплата
          каждый месяц.
        </p>
      </div>
    </div>
  );
}
