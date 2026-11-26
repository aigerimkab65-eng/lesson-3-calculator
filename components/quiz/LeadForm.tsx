"use client";

import { useState, type FormEvent } from "react";
import {
  NAME_LIMIT_HINT,
  NAME_MAX_LENGTH,
  PHONE_TOO_LONG_HINT,
  clampName,
  formatPhoneInput,
  isNameAtLimit,
  isPhoneTooLong,
  normalizePhone,
  validateName,
  validatePhone,
} from "@/lib/phone";

interface LeadFormProps {
  onSubmit: (name: string, phone: string) => void;
  success: boolean;
}

export function LeadForm({ onSubmit, success }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, phone: false });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextNameError = validateName(name);
    const nextPhoneError = validatePhone(phone);

    setTouched({ name: true, phone: true });
    setNameError(nextNameError);
    setPhoneError(nextPhoneError);

    if (nextNameError || nextPhoneError) {
      return;
    }

    const normalized = normalizePhone(phone);
    if (!normalized) {
      setPhoneError("Введите полный номер в формате +7 XXX XXX-XX-XX");
      return;
    }

    onSubmit(name.trim(), normalized);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent-soft px-4 py-5 text-center">
        <p className="text-base font-medium text-foreground">
          Заявка готова — продолжите в WhatsApp
        </p>
      </div>
    );
  }

  const showNameLimitHint = isNameAtLimit(name);
  const showPhoneTooLongHint = isPhoneTooLong(phone);

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="lead-name" className="text-sm font-medium text-foreground">
          Имя
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          value={name}
          onChange={(event) => {
            const next = clampName(event.target.value);
            setName(next);
            if (touched.name) {
              setNameError(validateName(next));
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, name: true }));
            setNameError(validateName(name));
          }}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          placeholder="Как к вам обращаться"
        />
        {nameError ? (
          <p role="alert" className="text-sm text-danger">
            {nameError}
          </p>
        ) : null}
        {showNameLimitHint ? (
          <p className="text-sm text-muted">{NAME_LIMIT_HINT}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="lead-phone" className="text-sm font-medium text-foreground">
          Телефон
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            const next = formatPhoneInput(event.target.value);
            setPhone(next);
            if (touched.phone) {
              setPhoneError(validatePhone(next));
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, phone: true }));
            setPhoneError(validatePhone(phone));
          }}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          placeholder="+7 XXX XXX-XX-XX"
        />
        {phoneError ? (
          <p role="alert" className="text-sm text-danger">
            {phoneError}
          </p>
        ) : showPhoneTooLongHint ? (
          <p role="alert" className="text-sm text-danger">
            {PHONE_TOO_LONG_HINT}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-contrast transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Отправить в WhatsApp
      </button>
    </form>
  );
}
