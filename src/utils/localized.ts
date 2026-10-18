import type { Localized } from "../types";

/** Wraps user-typed text so it shows in every language. */
export const sameInAllLanguages = (text: string): Localized => ({ en: text, ar: text });
