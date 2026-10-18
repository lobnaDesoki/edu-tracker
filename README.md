# BrightPath Center — Education Tracker (demo)

Static demo of an education-center tracker. Instructors add materials and grades, students hand in work and follow their grades, parents follow everything about their children, and the admin manages accounts.

React 19 + TypeScript + Vite. English / Arabic (RTL). Fake data, kept in memory: changes stay until the page is refreshed.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

Demo accounts are listed on the sign-in page (password `Demo@1234`). "Mariam Khaled" is a first-sign-in account that goes through onboarding.

## Deploy (GitHub Pages)

1. Create a GitHub repo and push this folder to `main`.
2. On GitHub: **Settings → Pages → Source → GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes the site.

Hash routing (`#/…`) and a relative `base` make it work under any Pages sub-path.

## Folder structure

```
src/
├── app/            App providers, router, route guards
├── components/
│   ├── layout/     App shell: sidebar, top bar, language toggle
│   └── ui/         Reusable UI: Button, Card, Modal, Field, Table, Tabs…
├── constants/      Routes, navigation, roles, icons, business config
├── data/           Seed (fake) data — replaced by API calls later
├── features/       One folder per feature: pages + feature components
│   ├── admin/  attendance/  auth/  courses/  dashboard/  grades/
│   └── messages/  notifications/  payments/  settings/  tour/
├── hooks/          Shared hooks (student scope, lookups, conversations)
├── i18n/           en.ts / ar.ts dictionaries + provider
├── services/       Pure business logic (grades, payments, notifications…)
├── store/          Contexts + reducer holding the app state
├── styles/         Global CSS + design tokens (CSS variables)
├── types/          Data models
└── utils/          Small helpers (dates, ids, class names)
```

Rules followed: every value used more than once is a variable (CSS tokens, `APP_CONFIG`, `ROUTES`, `ICONS`, dictionaries); business rules live in `services/` and are reused by every page; UI text lives only in `i18n/`.

## User stories covered

**Onboarding:** admin generates email + temporary password · sign in · set new password on first sign-in · forgot / reset password (demo code shown) · phone verification by SMS code (demo code shown) · guided tour for each role (replay from Settings).

**Parent:** child switcher · enrolled courses · course progress · grade of every submission · message the instructor · pay installments by credit card, InstaPay or cash · see whether each assignment was submitted · course timeline · notifications: quiz due, absence, grade released, missing submission, late submission.

**Student:** course content · enrolled courses · attendance · course progress · grades · submit / edit assignments · message the instructor · pay installments (card / InstaPay / cash) · course timeline · reminders: quiz soon, submission due, grade released.

**Instructor:** assigned courses · students per course · student status page · view a submission · grade a submission · gradebook to enter many grades at once · take attendance · add / edit / view the course timeline · add a new assignment or quiz · add course content · message students and parents.

**Admin:** create instructor / student / parent accounts (email + password generated) · create a course and assign an instructor · enroll students in a course · link parents to students · delete accounts.
