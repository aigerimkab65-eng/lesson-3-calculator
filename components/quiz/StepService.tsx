"use client";

import {
  BarChart3,
  Box,
  Camera,
  Images,
  Layers,
  ShoppingBag,
  Sparkles,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { formatPriceFrom } from "@/lib/calc";
import { getServicesByCategory } from "@/lib/pricing";
import type { ServiceCategory, ServiceId } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  camera: Camera,
  video: Video,
  box: Box,
  sparkles: Sparkles,
  user: UserRound,
  images: Images,
  "shopping-bag": ShoppingBag,
  "bar-chart": BarChart3,
  layers: Layers,
};

interface StepServiceProps {
  category: Exclude<ServiceCategory, "Сайты">;
  selectedServiceId: ServiceId | null;
  onSelect: (serviceId: ServiceId) => void;
}

export function StepService({
  category,
  selectedServiceId,
  onSelect,
}: StepServiceProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Выберите услугу
        </h2>
        <p className="mt-1 text-sm text-muted">
          Стоимость указана ориентировочно: тенге, рубли и доллары
        </p>
      </div>

      <div className="space-y-2.5">
        {getServicesByCategory(category).map((service) => {
          const Icon = ICON_MAP[service.icon] ?? Sparkles;
          return (
            <OptionCard
              key={service.id}
              title={service.title}
              subtitle={formatPriceFrom(service.basePrice)}
              icon={Icon}
              selected={selectedServiceId === service.id}
              onSelect={() => onSelect(service.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
