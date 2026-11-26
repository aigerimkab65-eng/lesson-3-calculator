"use client";

import { Globe, Images, Sparkles } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { CATEGORY_ORDER } from "@/lib/pricing";
import type { ServiceCategory } from "@/lib/types";

const CATEGORY_META: Record<
  ServiceCategory,
  { title: string; subtitle: string; icon: typeof Sparkles }
> = {
  "AI-контент": {
    title: "AI-контент",
    subtitle: "Фото, видео, анимация и персонажи",
    icon: Sparkles,
  },
  Дизайн: {
    title: "Дизайн",
    subtitle: "Карточки, карусели и инфографика",
    icon: Images,
  },
  Сайты: {
    title: "Сайты",
    subtitle: "Визитка, лендинг, магазин и платформа",
    icon: Globe,
  },
};

interface StepCategoryProps {
  selectedCategory: ServiceCategory | null;
  onSelect: (category: ServiceCategory) => void;
}

export function StepCategory({
  selectedCategory,
  onSelect,
}: StepCategoryProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Что вам нужно?
        </h2>
        <p className="mt-1 text-sm text-muted">Выберите направление</p>
      </div>

      <div className="space-y-2.5">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          return (
            <OptionCard
              key={category}
              title={meta.title}
              subtitle={meta.subtitle}
              icon={meta.icon}
              selected={selectedCategory === category}
              onSelect={() => onSelect(category)}
            />
          );
        })}
      </div>
    </div>
  );
}
