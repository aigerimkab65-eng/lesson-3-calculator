import { describe, expect, it } from "vitest";
import { backFromResult } from "@/lib/quizNavigation";
import { initialQuizState, quizReducer } from "@/lib/quizReducer";

describe("quizReducer SELECT_SITE", () => {
  it("keeps extras and support when the same site type is selected again", () => {
    let state = quizReducer(initialQuizState, {
      type: "SELECT_CATEGORY",
      category: "Сайты",
    });
    state = quizReducer(state, { type: "SELECT_SITE", siteId: "corporate" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "payment" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "crm" });
    state = quizReducer(state, {
      type: "SET_EXTRA_QUANTITY",
      extraId: "ai-animation",
      quantity: 3,
    });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "ai-animation" });
    state = quizReducer(state, { type: "TOGGLE_SUPPORT" });

    const before = state;
    const after = quizReducer(state, { type: "SELECT_SITE", siteId: "corporate" });

    expect(after).toBe(before);
    expect(after.selectedExtraIds).toEqual(["payment", "crm", "ai-animation"]);
    expect(after.extraQuantities).toEqual({ "ai-animation": 3 });
    expect(after.supportEnabled).toBe(true);
  });

  it("clears extras and support when a different site type is selected", () => {
    let state = quizReducer(initialQuizState, {
      type: "SELECT_CATEGORY",
      category: "Сайты",
    });
    state = quizReducer(state, { type: "SELECT_SITE", siteId: "corporate" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "payment" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "crm" });
    state = quizReducer(state, {
      type: "SET_EXTRA_QUANTITY",
      extraId: "ai-animation",
      quantity: 3,
    });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "ai-animation" });
    state = quizReducer(state, { type: "TOGGLE_SUPPORT" });

    const after = quizReducer(state, { type: "SELECT_SITE", siteId: "shop" });

    expect(after.selectedSiteId).toBe("shop");
    expect(after.selectedExtraIds).toEqual([]);
    expect(after.extraQuantities).toEqual({});
    expect(after.supportEnabled).toBe(false);
  });
});

describe("quizReducer SELECT_CATEGORY", () => {
  it("keeps state when the same category is selected again", () => {
    let state = quizReducer(initialQuizState, {
      type: "SELECT_CATEGORY",
      category: "Сайты",
    });
    state = quizReducer(state, { type: "SELECT_SITE", siteId: "corporate" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "payment" });

    const before = state;
    const after = quizReducer(state, {
      type: "SELECT_CATEGORY",
      category: "Сайты",
    });

    expect(after).toBe(before);
    expect(after.selectedExtraIds).toEqual(["payment"]);
  });
});

describe("back from result screen", () => {
  it("returns to urgency step and keeps all chosen answers", () => {
    let state = quizReducer(initialQuizState, {
      type: "SELECT_CATEGORY",
      category: "Сайты",
    });
    state = quizReducer(state, { type: "NEXT_STEP" });
    state = quizReducer(state, { type: "SELECT_SITE", siteId: "landing" });
    state = quizReducer(state, { type: "NEXT_STEP" });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "extra-page" });
    state = quizReducer(state, {
      type: "SET_EXTRA_QUANTITY",
      extraId: "extra-page",
      quantity: 2,
    });
    state = quizReducer(state, { type: "TOGGLE_EXTRA", extraId: "ai-animation" });
    state = quizReducer(state, {
      type: "SET_EXTRA_QUANTITY",
      extraId: "ai-animation",
      quantity: 2,
    });
    state = quizReducer(state, { type: "TOGGLE_SUPPORT" });
    state = quizReducer(state, { type: "NEXT_STEP" });
    state = quizReducer(state, { type: "SELECT_URGENCY", urgencyId: "urgent" });

    expect(state.activeStep).toBe(4);

    const afterBackFromResult = backFromResult(state);

    expect(afterBackFromResult).toEqual(state);
    expect(afterBackFromResult.activeStep).toBe(4);
    expect(afterBackFromResult.selectedCategory).toBe("Сайты");
    expect(afterBackFromResult.selectedSiteId).toBe("landing");
    expect(afterBackFromResult.selectedExtraIds).toEqual([
      "extra-page",
      "ai-animation",
    ]);
    expect(afterBackFromResult.extraQuantities).toEqual({
      "extra-page": 2,
      "ai-animation": 2,
    });
    expect(afterBackFromResult.urgencyId).toBe("urgent");
    expect(afterBackFromResult.supportEnabled).toBe(true);
  });
});
