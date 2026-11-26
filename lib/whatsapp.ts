import {
  formatPriceMessage,
  formatPriceMessageFromKzt,
  formatSupportLine,
  convertKzt,
} from "@/lib/calc";
import { SUPPORT_MONTHLY_KZT, WHATSAPP_URL } from "@/lib/pricing";

export interface WhatsAppLeadPayload {
  name: string;
  phone: string;
  serviceTitle: string;
  quantity?: number;
  extras?: string[];
  urgencyTitle: string;
  total: number;
  currencyBase: "usd" | "kzt";
  supportEnabled?: boolean;
}

export function buildLeadMessage(payload: WhatsAppLeadPayload): string {
  const lines = [
    "Здравствуйте! Хочу оформить заявку через AIPrice.",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.serviceTitle}`,
  ];

  if (payload.quantity !== undefined) {
    lines.push(`Количество: ${payload.quantity}`);
  }

  if (payload.extras && payload.extras.length > 0) {
    lines.push(`Дополнения: ${payload.extras.join(", ")}`);
  } else if (payload.currencyBase === "kzt") {
    lines.push("Дополнения: без дополнений");
  }

  lines.push(`Сроки: ${payload.urgencyTitle}`);

  const totalText =
    payload.currencyBase === "kzt"
      ? formatPriceMessageFromKzt(payload.total)
      : formatPriceMessage(payload.total);

  lines.push(`Ориентировочная стоимость: ${totalText}`);

  if (payload.supportEnabled) {
    lines.push(
      `Поддержка сайта: ${formatSupportLine(convertKzt(SUPPORT_MONTHLY_KZT))}`,
    );
  }

  return lines.join("\n");
}

export function buildLeadWhatsAppUrl(payload: WhatsAppLeadPayload): string {
  const text = encodeURIComponent(buildLeadMessage(payload));
  return `${WHATSAPP_URL}?text=${text}`;
}

export function buildDiscussProjectUrl(): string {
  const text = encodeURIComponent(
    "Здравствуйте! Хочу обсудить платформу / личный кабинет или другой индивидуальный проект через AIPrice.",
  );
  return `${WHATSAPP_URL}?text=${text}`;
}

export function openWhatsAppUrl(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
