"use client";

import type { QuizStep } from "@/lib/types";

interface ProgressBarProps {
  step: QuizStep;
  totalSteps: 3 | 4;
}

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const cappedStep = Math.min(step, totalSteps) as QuizStep;
  const percent = Math.round((cappedStep / totalSteps) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Шаг {cappedStep} из {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Прогресс: шаг ${cappedStep} из ${totalSteps}`}
        className="h-2 overflow-hidden rounded-full bg-border/60"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
