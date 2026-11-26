"use client";

interface QuizNavProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  showHint: boolean;
}

export function QuizNav({
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  showHint,
}: QuizNavProps) {
  return (
    <div className="space-y-3">
      {showHint ? (
        <p role="alert" className="text-sm text-danger">
          Выберите вариант, чтобы продолжить
        </p>
      ) : null}
      <div className="flex gap-3">
        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Назад
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          aria-disabled={!canGoNext}
          className={[
            "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            canGoNext
              ? "bg-accent text-accent-contrast hover:opacity-95"
              : "bg-border/70 text-muted",
          ].join(" ")}
        >
          {isLastStep ? "Показать результат" : "Далее"}
        </button>
      </div>
    </div>
  );
}
