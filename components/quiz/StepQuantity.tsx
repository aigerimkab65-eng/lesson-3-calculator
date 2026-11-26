"use client";

import { Hash } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QUANTITY_OPTIONS } from "@/lib/pricing";
import type { QuantityOption } from "@/lib/types";

interface StepQuantityProps {
  selectedQuantity: QuantityOption | null;
  onSelect: (quantity: QuantityOption) => void;
}

export function StepQuantity({
  selectedQuantity,
  onSelect,
}: StepQuantityProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Сколько нужно?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Выберите количество единиц услуги
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {QUANTITY_OPTIONS.map((quantity) => (
          <OptionCard
            key={quantity}
            title={`${quantity}`}
            subtitle={quantity === 1 ? "единица" : "единиц"}
            icon={Hash}
            selected={selectedQuantity === quantity}
            onSelect={() => onSelect(quantity)}
          />
        ))}
      </div>
    </div>
  );
}
