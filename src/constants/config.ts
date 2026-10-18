// Business settings used across the app. Change once here.
export const APP_CONFIG = {
  emailDomain: "brightpath.edu",
  reminderWindowDays: 3,
  minPasswordLength: 8,
  generatedPasswordLength: 10,
  verificationCodeLength: 6,
  installmentIntervalDays: 30,
  firstInstallmentOffsetDays: 7,
  instapayAddress: "brightpath@instapay",
  paymentProcessingMs: 1200,
  copiedFeedbackMs: 1500,
  defaultDueHour: 23,
} as const;
