import { getSiteById } from "@/lib/pricing";
import type { QuizAction, QuizState } from "@/lib/types";

export const initialQuizState: QuizState = {
  activeStep: 1,
  mode: null,
  selectedCategory: null,
  selectedServiceId: null,
  selectedSiteId: null,
  quantity: null,
  selectedExtraIds: [],
  extraQuantities: {},
  urgencyId: null,
  supportEnabled: false,
  submitted: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_CATEGORY": {
      if (state.selectedCategory === action.category) {
        return state;
      }

      const mode = action.category === "Сайты" ? "sites" : "service";
      return {
        ...initialQuizState,
        activeStep: 1,
        mode,
        selectedCategory: action.category,
      };
    }
    case "SELECT_SERVICE":
      return {
        ...state,
        selectedServiceId: action.serviceId,
        selectedSiteId: null,
        mode: "service",
      };
    case "SELECT_SITE": {
      if (state.selectedSiteId === action.siteId) {
        return state;
      }

      return {
        ...state,
        selectedSiteId: action.siteId,
        selectedServiceId: null,
        mode: "sites",
        selectedExtraIds: [],
        extraQuantities: {},
        supportEnabled: false,
      };
    }
    case "SELECT_QUANTITY":
      return { ...state, quantity: action.quantity };
    case "TOGGLE_EXTRA": {
      const exists = state.selectedExtraIds.includes(action.extraId);
      const selectedExtraIds = exists
        ? state.selectedExtraIds.filter((id) => id !== action.extraId)
        : [...state.selectedExtraIds, action.extraId];
      return { ...state, selectedExtraIds };
    }
    case "SET_EXTRA_QUANTITY":
      return {
        ...state,
        extraQuantities: {
          ...state.extraQuantities,
          [action.extraId]: action.quantity,
        },
      };
    case "SELECT_URGENCY":
      return { ...state, urgencyId: action.urgencyId };
    case "TOGGLE_SUPPORT":
      return { ...state, supportEnabled: !state.supportEnabled };
    case "NEXT_STEP": {
      if (state.mode === "sites") {
        if (state.activeStep === 1 && state.selectedCategory === "Сайты") {
          return { ...state, activeStep: 2 };
        }
        if (state.activeStep === 2 && state.selectedSiteId) {
          const site = getSiteById(state.selectedSiteId);
          if (site?.basePriceKzt === null) {
            return state;
          }
          return { ...state, activeStep: 3 };
        }
        if (state.activeStep === 3) {
          return { ...state, activeStep: 4 };
        }
        return state;
      }

      if (state.activeStep === 1 && state.selectedCategory) {
        return { ...state, activeStep: 2 };
      }
      if (state.activeStep === 2 && state.selectedServiceId) {
        return { ...state, activeStep: 3 };
      }
      if (state.activeStep === 3 && state.quantity) {
        return { ...state, activeStep: 4 };
      }
      return state;
    }
    case "PREV_STEP":
      if (state.activeStep === 1) {
        return state;
      }
      return {
        ...state,
        activeStep: (state.activeStep - 1) as QuizState["activeStep"],
      };
    case "SUBMIT":
      return { ...state, submitted: true };
    case "RESET":
      return initialQuizState;
    default:
      return state;
  }
}
