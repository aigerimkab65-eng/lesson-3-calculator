"use client";

import { Clock3, Zap } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { URGENCY_OPTIONS } from "@/lib/pricing";
import type { UrgencyId } from "@/lib/types";

interface StepUrgencyProps {
  selectedUrgencyId: UrgencyId | null;
  onSelect: (urgencyId: UrgencyId) => void;
}

export function StepUrgency({
  selectedUrgencyId,
  onSelect,
}: StepUrgencyProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Когда нужно?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Срочный заказ повышает стоимость на 30%
        </p>
      </div>

      <div className="space-y-2.5">
        {URGENCY_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={option.title}
            subtitle={
              option.coefficientPercent === 100
                ? "без доплаты"
                : `коэффициент ${option.coefficientPercent}%`
            }
            icon={option.id === "urgent" ? Zap : Clock3}
            selected={selectedUrgencyId === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
