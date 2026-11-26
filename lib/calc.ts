import {
  getExtraById,
  getServiceById,
  getSiteById,
  getUrgencyById,
  USD_TO_KZT,
  USD_TO_RUB,
} from "@/lib/pricing";
import type {
  ExtraId,
  ExtraQuantities,
  QuantityOption,
  ServiceId,
  SiteId,
  UrgencyId,
} from "@/lib/types";

export interface PriceParts {
  usd: number;
  kzt: number;
  rub: number;
}

function roundDivide(numerator: number, denominator: number): number {
  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}

/**
 * Считает итоговую стоимость AI/Дизайн в долларах целыми числами.
 * total = round(basePrice * quantity * urgencyPercent / 100)
 */
export function calculateTotal(
  serviceId: ServiceId | null,
  quantity: QuantityOption | null,
  urgencyId: UrgencyId | null,
): number | null {
  if (serviceId === null || quantity === null || urgencyId === null) {
    return null;
  }

  const service = getServiceById(serviceId);
  const urgency = getUrgencyById(urgencyId);

  if (!service || !urgency) {
    return null;
  }

  const product =
    service.basePrice * quantity * urgency.coefficientPercent;

  if (!Number.isFinite(product) || product < 0) {
    return null;
  }

  const total = Math.floor((product + 50) / 100);

  if (!Number.isFinite(total) || total < 0) {
    return null;
  }

  return total;
}

export function getExtraQuantity(
  extraId: ExtraId,
  extraQuantities: ExtraQuantities,
): QuantityOption {
  return extraQuantities[extraId] ?? 1;
}

export function sumSiteExtrasKzt(
  selectedExtraIds: ExtraId[],
  extraQuantities: ExtraQuantities = {},
): number {
  let sum = 0;

  for (const extraId of selectedExtraIds) {
    const extra = getExtraById(extraId);
    if (!extra) {
      continue;
    }
    if (extra.hasQuantity) {
      sum += extra.priceKzt * getExtraQuantity(extraId, extraQuantities);
    } else {
      sum += extra.priceKzt;
    }
  }

  return sum;
}

/**
 * Считает итоговую стоимость сайта в тенге.
 * total = round((sitePrice + extras) * urgencyPercent / 100)
 * platform / без типа сайта → null
 */
export function calculateSiteTotal(
  siteId: SiteId | null,
  selectedExtraIds: ExtraId[],
  extraQuantities: ExtraQuantities,
  urgencyId: UrgencyId | null,
): number | null {
  if (siteId === null || urgencyId === null) {
    return null;
  }

  const site = getSiteById(siteId);
  const urgency = getUrgencyById(urgencyId);

  if (!site || site.basePriceKzt === null || !urgency) {
    return null;
  }

  const extrasSum = sumSiteExtrasKzt(selectedExtraIds, extraQuantities);
  const base = site.basePriceKzt + extrasSum;
  const product = base * urgency.coefficientPercent;

  if (!Number.isFinite(product) || product < 0) {
    return null;
  }

  const total = Math.floor((product + 50) / 100);

  if (!Number.isFinite(total) || total < 0) {
    return null;
  }

  return total;
}

export function convertUsd(amountUsd: number): PriceParts {
  if (!Number.isFinite(amountUsd) || amountUsd < 0) {
    return { usd: 0, kzt: 0, rub: 0 };
  }

  const usd = Math.floor(amountUsd);
  const kzt = Math.round(usd * USD_TO_KZT);
  const rub = Math.round(usd * USD_TO_RUB);

  return { usd, kzt, rub };
}

/** Перевод суммы в тенге в ₽ и $ тем же курсом, что и для остальных услуг. */
export function convertKzt(amountKzt: number): PriceParts {
  if (!Number.isFinite(amountKzt) || amountKzt < 0) {
    return { usd: 0, kzt: 0, rub: 0 };
  }

  const kzt = Math.floor(amountKzt);
  const usd = roundDivide(kzt, USD_TO_KZT);
  const rub = roundDivide(kzt * USD_TO_RUB, USD_TO_KZT);

  return { usd, kzt, rub };
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount);
}

export function formatMoneyLine(
  amount: number,
  suffix: "₸" | "₽" | "$",
): string {
  return `от ${formatAmount(amount)} ${suffix}`;
}

export function formatSupportLine(parts: PriceParts): string {
  return `+ ${formatAmount(parts.kzt)} ₸ в месяц · + ${formatAmount(parts.rub)} ₽ · + ${formatAmount(parts.usd)} $`;
}

export function getPriceParts(amountUsd: number): PriceParts {
  return convertUsd(amountUsd);
}

export function getPricePartsFromKzt(amountKzt: number): PriceParts {
  return convertKzt(amountKzt);
}

/** Короткая строка для карточек услуг (база в $). */
export function formatPriceFrom(amountUsd: number): string {
  const parts = convertUsd(amountUsd);
  return [
    formatMoneyLine(parts.kzt, "₸"),
    formatMoneyLine(parts.rub, "₽"),
    formatMoneyLine(parts.usd, "$"),
  ].join(" · ");
}

/** Короткая строка для карточек сайтов (база в ₸). */
export function formatPriceFromKzt(amountKzt: number): string {
  const parts = convertKzt(amountKzt);
  return [
    formatMoneyLine(parts.kzt, "₸"),
    formatMoneyLine(parts.rub, "₽"),
    formatMoneyLine(parts.usd, "$"),
  ].join(" · ");
}

export function formatPriceLabel(amountUsd: number | null): string {
  if (amountUsd === null) {
    return "Выберите услугу";
  }
  return formatPriceFrom(amountUsd);
}

export function formatPriceMessage(amountUsd: number): string {
  const parts = convertUsd(amountUsd);
  return [
    formatMoneyLine(parts.kzt, "₸"),
    formatMoneyLine(parts.rub, "₽"),
    formatMoneyLine(parts.usd, "$"),
  ].join(", ");
}

export function formatPriceMessageFromKzt(amountKzt: number): string {
  const parts = convertKzt(amountKzt);
  return [
    formatMoneyLine(parts.kzt, "₸"),
    formatMoneyLine(parts.rub, "₽"),
    formatMoneyLine(parts.usd, "$"),
  ].join(", ");
}
