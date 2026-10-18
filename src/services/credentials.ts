import { APP_CONFIG } from "../constants/config";

// Characters that are hard to confuse when read aloud (no 0/O, 1/l/I).
const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const DIGITS = "0123456789";
const FALLBACK_EMAIL_NAME = "user";

const randomFrom = (chars: string, length: number) =>
  Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

export const generatePassword = () => randomFrom(PASSWORD_CHARS, APP_CONFIG.generatedPasswordLength);

export const generateCode = () => randomFrom(DIGITS, APP_CONFIG.verificationCodeLength);

/** "Sara Ali" → "sara.ali@domain", adding a number if the address is taken. */
export function generateEmail(name: string, takenEmails: string[]): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .join(".")
      .replace(/[^a-z.]/g, "") || FALLBACK_EMAIL_NAME;
  const build = (suffix: string) => `${base}${suffix}@${APP_CONFIG.emailDomain}`;
  let email = build("");
  for (let n = 2; takenEmails.includes(email); n++) email = build(String(n));
  return email;
}
