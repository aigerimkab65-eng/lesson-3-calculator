"use client";

import { LeadForm } from "@/components/quiz/LeadForm";
import {
  convertKzt,
  formatMoneyLine,
  formatSupportLine,
  getPriceParts,
  getPricePartsFromKzt,
} from "@/lib/calc";
import { SUPPORT_MONTHLY_KZT } from "@/lib/pricing";

interface ResultScreenProps {
  serviceTitle: string;
  summaryLines: string[];
  urgencyTitle: string;
  total: number;
  currencyBase: "usd" | "kzt";
  supportEnabled: boolean;
  submitted: boolean;
  onSubmitLead: (name: string, phone: string) => void;
  onBack: () => void;
  onReset: () => void;
}

export function ResultScreen({
  serviceTitle,
  summaryLines,
  urgencyTitle,
  total,
  currencyBase,
  supportEnabled,
  submitted,
  onSubmitLead,
  onBack,
  onReset,
}: ResultScreenProps) {
  const parts =
    currencyBase === "kzt"
      ? getPricePartsFromKzt(total)
      : getPriceParts(total);
  const supportParts = convertKzt(SUPPORT_MONTHLY_KZT);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface px-5 py-6 text-center shadow-[var(--shadow)]">
        <p className="text-sm text-muted">Ориентировочная стоимость</p>
        <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-price">
          {formatMoneyLine(parts.kzt, "₸")}
        </p>
        <p className="mt-2 text-xl font-medium text-foreground">
          {formatMoneyLine(parts.rub, "₽")}
        </p>
        <p className="mt-1 text-base text-muted">
          {formatMoneyLine(parts.usd, "$")}
        </p>
        {supportEnabled ? (
          <p className="mt-3 text-sm font-medium text-foreground">
            {formatSupportLine(supportParts)}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-muted">
          Цена приблизительная. Точную сумму уточним после обсуждения задачи.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-surface-soft px-4 py-4 text-sm">
        <p>
          <span className="text-muted">Услуга:</span>{" "}
          <span className="font-medium text-foreground">{serviceTitle}</span>
        </p>
        {summaryLines.map((line) => (
          <p key={line}>
            <span className="font-medium text-foreground">{line}</span>
          </p>
        ))}
        <p>
          <span className="text-muted">Сроки:</span>{" "}
          <span className="font-medium text-foreground">{urgencyTitle}</span>
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Оставить заявку
        </h2>
        <LeadForm onSubmit={onSubmitLead} success={submitted} />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Назад
        </button>
        {submitted ? (
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Рассчитать заново
          </button>
        ) : null}
      </div>
    </div>
  );
}
