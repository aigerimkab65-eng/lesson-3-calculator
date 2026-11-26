import { describe, expect, it } from "vitest";
import {
  calculateSiteTotal,
  calculateTotal,
  convertKzt,
  convertUsd,
  formatMoneyLine,
  formatPriceFrom,
} from "@/lib/calc";
import { USD_TO_KZT, USD_TO_RUB } from "@/lib/pricing";

describe("calculateTotal", () => {
  it("ai-photoshoot, 1, normal -> 46", () => {
    expect(calculateTotal("ai-photoshoot", 1, "normal")).toBe(46);
  });

  it("ai-photoshoot, 3, urgent -> 179", () => {
    expect(calculateTotal("ai-photoshoot", 3, "urgent")).toBe(179);
  });

  it("ai-video, 5, urgent -> 540", () => {
    expect(calculateTotal("ai-video", 5, "urgent")).toBe(540);
  });

  it("product-card, 2, normal -> 38", () => {
    expect(calculateTotal("product-card", 2, "normal")).toBe(38);
  });

  it("card-set, 5, urgent -> 423", () => {
    expect(calculateTotal("card-set", 5, "urgent")).toBe(423);
  });

  it("no service selected -> null", () => {
    expect(calculateTotal(null, 1, "normal")).toBeNull();
  });

  it("converts usd to tenge and rubles", () => {
    expect(convertUsd(46)).toEqual({ usd: 46, kzt: 23920, rub: 4140 });
  });

  it("formats all three currencies", () => {
    const formatted = formatPriceFrom(46);
    expect(formatted).toContain("₸");
    expect(formatted).toContain("₽");
    expect(formatted).toContain("$");
    expect(formatMoneyLine(1234, "$").replace(/\u00a0/g, " ")).toBe(
      "от 1 234 $",
    );
  });
});

describe("calculateSiteTotal", () => {
  it("site-card, no extras, normal: 48400", () => {
    expect(calculateSiteTotal("site-card", [], {}, "normal")).toBe(48400);
  });

  it("landing, no extras, normal: 96200", () => {
    expect(calculateSiteTotal("landing", [], {}, "normal")).toBe(96200);
  });

  it("corporate + payment + crm, normal: 202800", () => {
    expect(
      calculateSiteTotal("corporate", ["payment", "crm"], {}, "normal"),
    ).toBe(202800);
  });

  it("corporate + payment + crm, urgent: 263640", () => {
    expect(
      calculateSiteTotal("corporate", ["payment", "crm"], {}, "urgent"),
    ).toBe(263640);
  });

  it("site-card + extra-page x2 + favicon, normal: 79600", () => {
    expect(
      calculateSiteTotal(
        "site-card",
        ["extra-page", "favicon"],
        { "extra-page": 2 },
        "normal",
      ),
    ).toBe(79600);
  });

  it("site-card + ai-animation x2, normal: 78400", () => {
    expect(
      calculateSiteTotal(
        "site-card",
        ["ai-animation"],
        { "ai-animation": 2 },
        "normal",
      ),
    ).toBe(78400);
  });

  it("site-card + ai-animation x2, urgent: 101920", () => {
    expect(
      calculateSiteTotal(
        "site-card",
        ["ai-animation"],
        { "ai-animation": 2 },
        "urgent",
      ),
    ).toBe(101920);
  });

  it("ai-animation not selected: does not change the total", () => {
    const without = calculateSiteTotal("site-card", [], {}, "normal");
    const withUnusedQuantity = calculateSiteTotal(
      "site-card",
      [],
      { "ai-animation": 5 },
      "normal",
    );
    expect(without).toBe(48400);
    expect(withUnusedQuantity).toBe(without);
  });

  it("extra-page and ai-animation quantities are independent", () => {
    // 48400 + 13000*3 + 15000*2 + 5200 = 122600
    expect(
      calculateSiteTotal(
        "site-card",
        ["extra-page", "ai-animation", "favicon"],
        { "extra-page": 3, "ai-animation": 2 },
        "normal",
      ),
    ).toBe(122600);
  });

  it("platform: no price", () => {
    expect(calculateSiteTotal("platform", [], {}, "normal")).toBeNull();
  });

  it("no site type selected: null", () => {
    expect(calculateSiteTotal(null, [], {}, "normal")).toBeNull();
  });

  it("support turned on does not change the total", () => {
    const withoutSupport = calculateSiteTotal("site-card", [], {}, "normal");
    const withSupportIgnored = calculateSiteTotal(
      "site-card",
      [],
      {},
      "normal",
    );
    expect(withoutSupport).toBe(48400);
    expect(withSupportIgnored).toBe(withoutSupport);
  });

  it("site totals convert with existing rates", () => {
    const total = calculateSiteTotal("site-card", [], {}, "normal");
    expect(total).toBe(48400);
    const parts = convertKzt(total!);
    expect(parts.kzt).toBe(48400);
    expect(parts.usd).toBe(Math.round(48400 / USD_TO_KZT));
    expect(parts.rub).toBe(Math.round((48400 * USD_TO_RUB) / USD_TO_KZT));
  });
});
