import { describe, expect, it } from "vitest";
import {
  NAME_MAX_LENGTH,
  PHONE_TOO_LONG_HINT,
  clampName,
  formatPhoneInput,
  isNameAtLimit,
  isPhoneTooLong,
  isValidPhone,
  normalizePhone,
  validateName,
  validatePhone,
} from "@/lib/phone";

describe("name limit", () => {
  it("clamps name to 60 characters", () => {
    const long = "а".repeat(80);
    const clamped = clampName(long);
    expect(clamped).toHaveLength(NAME_MAX_LENGTH);
    expect(isNameAtLimit(clamped)).toBe(true);
  });

  it("validateName still requires at least 2 characters", () => {
    expect(validateName("")).toBe("Введите имя — минимум 2 символа");
    expect(validateName("A")).toBe("Введите имя — минимум 2 символа");
    expect(validateName("Ai")).toBeNull();
    expect(validateName("а".repeat(NAME_MAX_LENGTH))).toBeNull();
  });

  it("isNameAtLimit is false below 60 characters", () => {
    expect(isNameAtLimit("Айгерим")).toBe(false);
    expect(isNameAtLimit("а".repeat(59))).toBe(false);
    expect(isNameAtLimit("а".repeat(60))).toBe(true);
  });
});

describe("phone too long", () => {
  it("does not silently drop extra digits while formatting", () => {
    const formatted = formatPhoneInput("87007002132123");
    expect(formatted).toContain("123");
    expect(digitsCount(formatted)).toBeGreaterThan(11);
    expect(isPhoneTooLong(formatted)).toBe(true);
  });

  it("shows too-long hint and rejects submit", () => {
    const formatted = formatPhoneInput("770070021321234");
    expect(validatePhone(formatted)).toBe(PHONE_TOO_LONG_HINT);
    expect(isValidPhone(formatted)).toBe(false);
    expect(normalizePhone(formatted)).toBeNull();
  });

  it("still accepts normal 11-digit phones", () => {
    expect(isValidPhone("87007002132")).toBe(true);
    expect(normalizePhone("8 700 700 21 32")).toBe("+77007002132");
    expect(validatePhone("+7 700 700-21-32")).toBeNull();
  });
});

function digitsCount(value: string): number {
  return value.replace(/\D/g, "").length;
}
