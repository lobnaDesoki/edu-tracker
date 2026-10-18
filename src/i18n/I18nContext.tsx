import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language, Localized } from "../types";
import { ar } from "./ar";
import { en, type Dictionary } from "./en";

const DICTIONARIES: Record<Language, Dictionary> = { en, ar };
const LOCALES: Record<Language, string> = { en: "en-GB", ar: "ar-EG" };
const DIRECTIONS: Record<Language, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };
const OTHER_LANGUAGE: Record<Language, Language> = { en: "ar", ar: "en" };

interface I18nValue {
  language: Language;
  toggleLanguage: () => void;
  t: Dictionary;
  /** Picks the current language from data stored in every language. */
  l: (text: Localized) => string;
  formatDate: (iso: string) => string;
  formatDateTime: (iso: string) => string;
  formatMoney: (amountEgp: number) => string;
  formatPercent: (value?: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = DIRECTIONS[language];
    document.title = DICTIONARIES[language].appName;
  }, [language]);

  const value = useMemo<I18nValue>(() => {
    const locale = LOCALES[language];
    const t = DICTIONARIES[language];
    const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
    const dateTime = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
    const money = new Intl.NumberFormat(locale, { style: "currency", currency: "EGP", maximumFractionDigits: 0 });
    const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
    return {
      language,
      toggleLanguage: () => setLanguage(OTHER_LANGUAGE[language]),
      t,
      l: (text) => text[language],
      formatDate: (iso) => date.format(new Date(iso)),
      formatDateTime: (iso) => dateTime.format(new Date(iso)),
      formatMoney: (amount) => money.format(amount),
      formatPercent: (value) => (value === undefined ? t.common.none : percent.format(value / 100)),
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
