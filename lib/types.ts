export type ServiceId =
  | "ai-photoshoot"
  | "ai-video"
  | "viz-3d"
  | "ai-animation"
  | "ai-character"
  | "carousel"
  | "product-card"
  | "infographic"
  | "card-set";

export type SiteId =
  | "site-card"
  | "landing"
  | "corporate"
  | "shop"
  | "platform";

export type ExtraId =
  | "favicon"
  | "extra-page"
  | "ai-animation"
  | "domain-hosting"
  | "seo-basic"
  | "payment"
  | "booking"
  | "crm"
  | "chatbot"
  | "ai-consultant";

export type ServiceCategory = "AI-контент" | "Дизайн" | "Сайты";

export type QuantityOption = 1 | 2 | 3 | 5;

export type ExtraQuantities = Partial<Record<ExtraId, QuantityOption>>;

export type UrgencyId = "normal" | "urgent";

export type QuizStep = 1 | 2 | 3 | 4;

export type QuizMode = "service" | "sites";

export interface Service {
  id: ServiceId;
  title: string;
  category: Exclude<ServiceCategory, "Сайты">;
  basePrice: number;
  icon: string;
}

export interface SiteType {
  id: SiteId;
  title: string;
  /** Цена в тенге. null = индивидуальный расчёт */
  basePriceKzt: number | null;
  icon: string;
}

export interface SiteExtra {
  id: ExtraId;
  title: string;
  /** Короткое имя для WhatsApp, если есть количество */
  shortTitle?: string;
  priceKzt: number;
  hasQuantity: boolean;
  unitLabel?: string;
}

export interface UrgencyOption {
  id: UrgencyId;
  title: string;
  coefficientPercent: number;
}

export interface QuizState {
  activeStep: QuizStep;
  mode: QuizMode | null;
  selectedCategory: ServiceCategory | null;
  selectedServiceId: ServiceId | null;
  selectedSiteId: SiteId | null;
  quantity: QuantityOption | null;
  selectedExtraIds: ExtraId[];
  extraQuantities: ExtraQuantities;
  urgencyId: UrgencyId | null;
  supportEnabled: boolean;
  submitted: boolean;
}

export type QuizAction =
  | { type: "SELECT_CATEGORY"; category: ServiceCategory }
  | { type: "SELECT_SERVICE"; serviceId: ServiceId }
  | { type: "SELECT_SITE"; siteId: SiteId }
  | { type: "SELECT_QUANTITY"; quantity: QuantityOption }
  | { type: "TOGGLE_EXTRA"; extraId: ExtraId }
  | {
      type: "SET_EXTRA_QUANTITY";
      extraId: ExtraId;
      quantity: QuantityOption;
    }
  | { type: "SELECT_URGENCY"; urgencyId: UrgencyId }
  | { type: "TOGGLE_SUPPORT" }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT" }
  | { type: "RESET" };

export interface LeadFormValues {
  name: string;
  phone: string;
}
