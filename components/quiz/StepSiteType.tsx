"use client";

import {
  Building2,
  Globe,
  KeyRound,
  LayoutTemplate,
  Store,
  type LucideIcon,
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { formatPriceFromKzt } from "@/lib/calc";
import { SITE_TYPES } from "@/lib/pricing";
import type { SiteId } from "@/lib/types";
import { buildDiscussProjectUrl } from "@/lib/whatsapp";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  layout: LayoutTemplate,
  building: Building2,
  store: Store,
  key: KeyRound,
};

interface StepSiteTypeProps {
  selectedSiteId: SiteId | null;
  onSelect: (siteId: SiteId) => void;
}

export function StepSiteType({
  selectedSiteId,
  onSelect,
}: StepSiteTypeProps) {
  const selected = SITE_TYPES.find((site) => site.id === selectedSiteId);
  const isPlatform = selected?.basePriceKzt === null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Какой сайт нужен?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Цены в тенге, рублях и долларах
        </p>
      </div>

      <div className="space-y-2.5">
        {SITE_TYPES.map((site) => {
          const Icon = ICON_MAP[site.icon] ?? Globe;
          const subtitle =
            site.basePriceKzt === null
              ? "Индивидуальный расчёт"
              : formatPriceFromKzt(site.basePriceKzt);

          return (
            <OptionCard
              key={site.id}
              title={site.title}
              subtitle={subtitle}
              icon={Icon}
              selected={selectedSiteId === site.id}
              onSelect={() => onSelect(site.id)}
            />
          );
        })}
      </div>

      {isPlatform ? (
        <div className="space-y-3 rounded-2xl border border-border bg-surface-soft px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Индивидуальный расчёт
          </p>
          <p className="text-sm text-muted">
            Для платформы и личного кабинета цену обсуждаем отдельно.
          </p>
          <a
            href={buildDiscussProjectUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-contrast transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Обсудить проект в WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}
