"use client";

import { useReducer, useState } from "react";
import { MessageCircle } from "lucide-react";
import { PriceBar } from "@/components/quiz/PriceBar";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { QuizNav } from "@/components/quiz/QuizNav";
import { ResultScreen } from "@/components/quiz/ResultScreen";
import { StepCategory } from "@/components/quiz/StepCategory";
import { StepExtras } from "@/components/quiz/StepExtras";
import { StepQuantity } from "@/components/quiz/StepQuantity";
import { StepService } from "@/components/quiz/StepService";
import { StepSiteType } from "@/components/quiz/StepSiteType";
import { StepUrgency } from "@/components/quiz/StepUrgency";
import { calculateSiteTotal, calculateTotal } from "@/lib/calc";
import {
  BRAND_NAME,
  getExtraById,
  getServiceById,
  getSiteById,
  getUrgencyById,
} from "@/lib/pricing";
import { initialQuizState, quizReducer } from "@/lib/quizReducer";
import type { ExtraId, QuizState } from "@/lib/types";
import {
  buildDiscussProjectUrl,
  buildLeadWhatsAppUrl,
  openWhatsAppUrl,
} from "@/lib/whatsapp";

function isPlatformSelected(state: QuizState): boolean {
  if (!state.selectedSiteId) {
    return false;
  }
  return getSiteById(state.selectedSiteId)?.basePriceKzt === null;
}

function stepHasSelection(state: QuizState): boolean {
  if (state.activeStep === 1) {
    return state.selectedCategory !== null;
  }

  if (state.mode === "sites") {
    if (state.activeStep === 2) {
      return state.selectedSiteId !== null && !isPlatformSelected(state);
    }
    if (state.activeStep === 3) {
      return true;
    }
    return state.urgencyId !== null;
  }

  if (state.activeStep === 2) {
    return state.selectedServiceId !== null;
  }
  if (state.activeStep === 3) {
    return state.quantity !== null;
  }
  return state.urgencyId !== null;
}

function getExtraLabels(
  selectedExtraIds: ExtraId[],
  extraQuantities: QuizState["extraQuantities"],
): string[] {
  return selectedExtraIds.map((id) => {
    const extra = getExtraById(id);
    if (!extra) {
      return id;
    }
    if (extra.hasQuantity) {
      const quantity = extraQuantities[id] ?? 1;
      const name = extra.shortTitle ?? extra.title;
      return `${name} x${quantity}`;
    }
    return extra.title;
  });
}

export function QuizShell() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [stepKey, setStepKey] = useState(0);

  const isSites = state.mode === "sites";
  const totalSteps = 4;
  const platform = isPlatformSelected(state);

  const serviceTotal = calculateTotal(
    state.selectedServiceId,
    state.quantity,
    state.urgencyId,
  );

  const siteUrgencyForPrice =
    state.urgencyId ??
    (state.selectedSiteId && !platform ? "normal" : null);

  const siteTotal = calculateSiteTotal(
    state.selectedSiteId,
    state.selectedExtraIds,
    state.extraQuantities,
    siteUrgencyForPrice,
  );

  const total = isSites ? siteTotal : serviceTotal;
  const currencyBase = isSites ? "kzt" : "usd";

  const service = state.selectedServiceId
    ? getServiceById(state.selectedServiceId)
    : undefined;
  const site = state.selectedSiteId
    ? getSiteById(state.selectedSiteId)
    : undefined;
  const urgency = state.urgencyId
    ? getUrgencyById(state.urgencyId)
    : undefined;

  const title = isSites ? site?.title : service?.title;

  function handleNext() {
    if (platform && state.activeStep === 2) {
      setShowHint(false);
      return;
    }

    if (!stepHasSelection(state)) {
      setShowHint(true);
      return;
    }

    setShowHint(false);

    if (state.activeStep === 4) {
      setShowResult(true);
      setStepKey((key) => key + 1);
      return;
    }

    dispatch({ type: "NEXT_STEP" });
    setStepKey((key) => key + 1);
  }

  function handleBack() {
    setShowHint(false);
    if (showResult) {
      setShowResult(false);
      setStepKey((key) => key + 1);
      return;
    }
    dispatch({ type: "PREV_STEP" });
    setStepKey((key) => key + 1);
  }

  function handleLeadSubmit(name: string, phone: string) {
    if (!title || !urgency || total === null) {
      return;
    }

    if (isSites) {
      openWhatsAppUrl(
        buildLeadWhatsAppUrl({
          name,
          phone,
          serviceTitle: title,
          extras: getExtraLabels(
            state.selectedExtraIds,
            state.extraQuantities,
          ),
          urgencyTitle: urgency.title,
          total,
          currencyBase: "kzt",
          supportEnabled: state.supportEnabled,
        }),
      );
    } else {
      if (state.quantity === null) {
        return;
      }
      openWhatsAppUrl(
        buildLeadWhatsAppUrl({
          name,
          phone,
          serviceTitle: title,
          quantity: state.quantity,
          urgencyTitle: urgency.title,
          total,
          currencyBase: "usd",
        }),
      );
    }

    dispatch({ type: "SUBMIT" });
  }

  function handleReset() {
    dispatch({ type: "RESET" });
    setShowResult(false);
    setShowHint(false);
    setStepKey((key) => key + 1);
  }

  const canGoNext = platform && state.activeStep === 2
    ? false
    : stepHasSelection(state);

  const lastStep = state.activeStep === 4;

  const summaryLines = isSites
    ? [
        state.selectedExtraIds.length > 0
          ? `Дополнения: ${getExtraLabels(state.selectedExtraIds, state.extraQuantities).join(", ")}`
          : "Дополнения: без дополнений",
      ]
    : [`Количество: ${state.quantity ?? "—"}`];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-4 py-6 sm:py-10">
      <header className="mb-6 space-y-3">
        <p className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          AIPrice
        </p>
        <p className="text-sm leading-relaxed text-muted">{BRAND_NAME}</p>
      </header>

      {!showResult ? (
        <ProgressBar step={state.activeStep} totalSteps={totalSteps} />
      ) : null}

      <div className="mt-5">
        <PriceBar
          total={platform ? null : total}
          currencyBase={currencyBase}
          individual={platform}
        />
      </div>

      <div className="mt-6 min-h-[420px]">
        <div key={stepKey} className="step-enter">
          {showResult && title && urgency && total !== null ? (
            <ResultScreen
              serviceTitle={title}
              summaryLines={summaryLines}
              urgencyTitle={urgency.title}
              total={total}
              currencyBase={currencyBase}
              supportEnabled={isSites && state.supportEnabled}
              submitted={state.submitted}
              onSubmitLead={handleLeadSubmit}
              onBack={handleBack}
              onReset={handleReset}
            />
          ) : null}

          {!showResult && state.activeStep === 1 ? (
            <StepCategory
              selectedCategory={state.selectedCategory}
              onSelect={(category) => {
                setShowHint(false);
                dispatch({ type: "SELECT_CATEGORY", category });
              }}
            />
          ) : null}

          {!showResult &&
          state.activeStep === 2 &&
          state.mode === "service" &&
          state.selectedCategory &&
          state.selectedCategory !== "Сайты" ? (
            <StepService
              category={state.selectedCategory}
              selectedServiceId={state.selectedServiceId}
              onSelect={(serviceId) => {
                setShowHint(false);
                dispatch({ type: "SELECT_SERVICE", serviceId });
              }}
            />
          ) : null}

          {!showResult && state.activeStep === 2 && state.mode === "sites" ? (
            <StepSiteType
              selectedSiteId={state.selectedSiteId}
              onSelect={(siteId) => {
                setShowHint(false);
                dispatch({ type: "SELECT_SITE", siteId });
              }}
            />
          ) : null}

          {!showResult &&
          state.activeStep === 3 &&
          state.mode === "service" ? (
            <StepQuantity
              selectedQuantity={state.quantity}
              onSelect={(quantity) => {
                setShowHint(false);
                dispatch({ type: "SELECT_QUANTITY", quantity });
              }}
            />
          ) : null}

          {!showResult && state.activeStep === 3 && state.mode === "sites" ? (
            <StepExtras
              selectedExtraIds={state.selectedExtraIds}
              extraQuantities={state.extraQuantities}
              supportEnabled={state.supportEnabled}
              onToggleExtra={(extraId) =>
                dispatch({ type: "TOGGLE_EXTRA", extraId })
              }
              onExtraQuantity={(extraId, quantity) =>
                dispatch({ type: "SET_EXTRA_QUANTITY", extraId, quantity })
              }
              onToggleSupport={() => dispatch({ type: "TOGGLE_SUPPORT" })}
            />
          ) : null}

          {!showResult && state.activeStep === 4 ? (
            <StepUrgency
              selectedUrgencyId={state.urgencyId}
              onSelect={(urgencyId) => {
                setShowHint(false);
                dispatch({ type: "SELECT_URGENCY", urgencyId });
              }}
            />
          ) : null}
        </div>
      </div>

      {!showResult && !(platform && state.activeStep === 2) ? (
        <div className="mt-6">
          <QuizNav
            canGoBack={state.activeStep > 1}
            canGoNext={canGoNext}
            isLastStep={lastStep}
            onBack={handleBack}
            onNext={handleNext}
            showHint={showHint}
          />
        </div>
      ) : null}

      {!showResult && platform && state.activeStep === 2 ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Назад
          </button>
        </div>
      ) : null}

      <div className="mt-8 border-t border-border pt-5">
        <p className="mb-3 text-sm text-muted">
          Сложные и индивидуальные проекты обсуждаем отдельно
        </p>
        <a
          href={buildDiscussProjectUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Обсудить проект в WhatsApp
        </a>
      </div>
    </div>
  );
}
