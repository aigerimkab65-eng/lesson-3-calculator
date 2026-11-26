import type {
  ExtraId,
  QuantityOption,
  Service,
  ServiceCategory,
  SiteExtra,
  SiteId,
  SiteType,
  UrgencyOption,
} from "@/lib/types";

export const BRAND_NAME =
  "AIPrice — калькулятор стоимости AI-услуг Айгерим Кабаева";

export const WHATSAPP_PHONE = "77007002132";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

/** Базовая цена услуг AI/Дизайн в долларах. Курс для ориентира на экране. */
export const USD_TO_KZT = 520;
export const USD_TO_RUB = 90;

export const SUPPORT_MONTHLY_KZT = 25000;

export const SUPPORT_DESCRIPTION =
  "Замена текста, цен, фото и контактов (до 5 правок в месяц), проверка работы сайта, исправление поломок, напоминание о продлении домена и хостинга. Новые страницы, функции и переделка дизайна считаются отдельно.";

export const SERVICES: Service[] = [
  {
    id: "ai-photoshoot",
    title: "AI-фотосессия",
    category: "AI-контент",
    basePrice: 46,
    icon: "camera",
  },
  {
    id: "ai-video",
    title: "Рекламный / трендовый AI-ролик",
    category: "AI-контент",
    basePrice: 83,
    icon: "video",
  },
  {
    id: "viz-3d",
    title: "3D-визуализация",
    category: "AI-контент",
    basePrice: 56,
    icon: "box",
  },
  {
    id: "ai-animation",
    title: "AI-анимация / оживление фото",
    category: "AI-контент",
    basePrice: 28,
    icon: "sparkles",
  },
  {
    id: "ai-character",
    title: "AI-персонаж и креативная концепция",
    category: "AI-контент",
    basePrice: 56,
    icon: "user",
  },
  {
    id: "carousel",
    title: "Карусель для соцсетей",
    category: "Дизайн",
    basePrice: 46,
    icon: "images",
  },
  {
    id: "product-card",
    title: "Карточка товара",
    category: "Дизайн",
    basePrice: 19,
    icon: "shopping-bag",
  },
  {
    id: "infographic",
    title: "Инфографика для товара",
    category: "Дизайн",
    basePrice: 19,
    icon: "bar-chart",
  },
  {
    id: "card-set",
    title: "Комплект карточек товара",
    category: "Дизайн",
    basePrice: 65,
    icon: "layers",
  },
];

export const SITE_TYPES: SiteType[] = [
  {
    id: "site-card",
    title: "Сайт-визитка",
    basePriceKzt: 48400,
    icon: "globe",
  },
  {
    id: "landing",
    title: "Лендинг",
    basePriceKzt: 96200,
    icon: "layout",
  },
  {
    id: "corporate",
    title: "Корпоративный сайт",
    basePriceKzt: 130000,
    icon: "building",
  },
  {
    id: "shop",
    title: "Интернет-магазин",
    basePriceKzt: 208000,
    icon: "store",
  },
  {
    id: "platform",
    title: "Платформа / личный кабинет",
    basePriceKzt: null,
    icon: "key",
  },
];

export const SITE_EXTRAS: SiteExtra[] = [
  {
    id: "favicon",
    title: "Фавикон (значок сайта во вкладке)",
    priceKzt: 5200,
    hasQuantity: false,
  },
  {
    id: "extra-page",
    title: "Дополнительная страница",
    shortTitle: "Дополнительная страница",
    priceKzt: 13000,
    hasQuantity: true,
    unitLabel: "за страницу",
  },
  {
    id: "ai-animation",
    title: "AI-анимация для сайта (оживление фото, видео, персонаж)",
    shortTitle: "AI-анимация",
    priceKzt: 15000,
    hasQuantity: true,
    unitLabel: "за одну анимацию",
  },
  {
    id: "domain-hosting",
    title: "Подключение домена и хостинга",
    priceKzt: 10400,
    hasQuantity: false,
  },
  {
    id: "seo-basic",
    title: "Базовое SEO",
    priceKzt: 26000,
    hasQuantity: false,
  },
  {
    id: "payment",
    title: "Подключение оплаты на сайте (Kaspi и др.)",
    priceKzt: 31200,
    hasQuantity: false,
  },
  {
    id: "booking",
    title: "Онлайн-запись",
    priceKzt: 36400,
    hasQuantity: false,
  },
  {
    id: "crm",
    title: "Интеграция с CRM",
    priceKzt: 41600,
    hasQuantity: false,
  },
  {
    id: "chatbot",
    title: "Чат-бот",
    priceKzt: 52000,
    hasQuantity: false,
  },
  {
    id: "ai-consultant",
    title: "AI-консультант на сайт",
    priceKzt: 104000,
    hasQuantity: false,
  },
];

export const CATEGORY_ORDER: ServiceCategory[] = [
  "AI-контент",
  "Дизайн",
  "Сайты",
];

export const SERVICE_CATEGORY_ORDER: Array<Exclude<ServiceCategory, "Сайты">> = [
  "AI-контент",
  "Дизайн",
];

export const QUANTITY_OPTIONS: QuantityOption[] = [1, 2, 3, 5];

export const URGENCY_OPTIONS: UrgencyOption[] = [
  {
    id: "normal",
    title: "Обычные сроки",
    coefficientPercent: 100,
  },
  {
    id: "urgent",
    title: "Срочно (1–2 дня)",
    coefficientPercent: 130,
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}

export function getSiteById(id: string): SiteType | undefined {
  return SITE_TYPES.find((site) => site.id === id);
}

export function getExtraById(id: ExtraId): SiteExtra | undefined {
  return SITE_EXTRAS.find((extra) => extra.id === id);
}

export function getUrgencyById(id: string): UrgencyOption | undefined {
  return URGENCY_OPTIONS.find((option) => option.id === id);
}

export function getServicesByCategory(
  category: Exclude<ServiceCategory, "Сайты">,
): Service[] {
  return SERVICES.filter((service) => service.category === category);
}

export function isSiteId(id: string): id is SiteId {
  return SITE_TYPES.some((site) => site.id === id);
}
