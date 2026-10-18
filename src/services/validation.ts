import { APP_CONFIG } from "../constants/config";

export type PasswordError = "tooShort" | "mismatch";

export function validateNewPassword(password: string, confirmation: string): PasswordError | null {
  if (password.length < APP_CONFIG.minPasswordLength) return "tooShort";
  if (password !== confirmation) return "mismatch";
  return null;
}

const EGYPTIAN_MOBILE = /^01[0125]\d{8}$/;
const CARD_NUMBER = /^\d{16}$/;
const CARD_EXPIRY = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CARD_CVC = /^\d{3,4}$/;

export const stripSpaces = (value: string) => value.replace(/\s/g, "");

export const isValidPhone = (phone: string) => EGYPTIAN_MOBILE.test(stripSpaces(phone));

export const isValidCard = (number: string, expiry: string, cvc: string) =>
  CARD_NUMBER.test(stripSpaces(number)) && CARD_EXPIRY.test(expiry) && CARD_CVC.test(cvc);
