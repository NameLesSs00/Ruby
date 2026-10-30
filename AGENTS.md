# Developer & Agent Guidelines (AGENTS.md) — Ruby Swimming Academy

This document specifies coding standards, scalable architecture, and design guidelines for the **Ruby Swimming Academy** management system. Any AI agent or developer contributing to this repository must consult and strictly adhere to the rules outlined here.

---

## 1. UI Localization & Visual Identity

### Arabic-First User Interface
- **Language & Direction**: The end-user interface must be in **Arabic** by default with right-to-left layout (`dir="rtl"` and `lang="ar"`).
- **Typography**: Clean, modern Arabic typography (e.g., **Cairo** or **Tajawal**).
- **Logical CSS Properties**: Always prefer bidirectional CSS properties:
  - Use `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`.
  - Use `padding-inline-start` / `padding-inline-end` instead of `padding-left` / `padding-right`.
  - Use `text-start` and `text-end` for text alignment.
- **Code & Documentation Language**: All code, comments, commit messages, and documentation (`AGENTS.md`, technical docs) must be written in **English**. Only the user-facing interface text, labels, and notifications are in **Arabic**.

### Brand Palette (Ruby Swimming Academy Logo)
- **Dark Navy**: `#0D1527` (primary text, dark headers, sidebar backgrounds)
- **Energy Orange**: `#F37023` / `#FF6B22` (primary CTA buttons, highlights, badges)
- **Aqua Cyan**: `#36C5F0` / `#38BDF8` (water/pool indicators, active links, accents)
- **Neutrals**: `#FFFFFF` (card surfaces) and `#F8FAFC` (page backgrounds)

---

## 2. Directory Structure

Only create files and folders as explicitly requested:

```text
src/
├── assets/                       # Static media and brand assets
├── lib/                          # Third-party library configuration
│   ├── axios.ts                  # Centralized Axios instance with interceptors & base URL
│   ├── query-client.ts           # TanStack Query client configuration with cache defaults
│   └── sonner.ts                 # Arabic-friendly toast helper wrappers
├── modules/                      # Domain features & TypeScript data types (added strictly on demand)
│   ├── auth.ts                   # LoginPayload, AuthTokens, DecodedUser
│   ├── coaches.ts                # Coach, CreateCoachPayload, UpdateCoachPayload
│   ├── employees.ts              # Employee, CreateEmployeePayload, UpdateEmployeePayload
│   ├── suppliers.ts              # Supplier, CreateSupplierPayload, UpdateSupplierPayload
│   └── products.ts               # Product, ProductCategory, CreateProductPayload
├── pages/                        # Page views
│   ├── LoginPage.tsx             # Arabic RTL Login screen
│   ├── AdminDashboardPage.tsx    # Dashboard shell with right sidebar
│   ├── CoachesPage.tsx           # Coaches table, search, modal dialogs
│   ├── EmployeesPage.tsx         # Employees table, search, modal dialogs, deletion
│   ├── SuppliersPage.tsx         # Suppliers table, search, modal dialogs, deletion
│   └── ProductsPage.tsx          # Products & categories table, filter, modal dialogs
├── App.tsx                       # Root component
└── main.tsx                      # App entry point
```

---

## 3. Mandatory Development Standards

### A. Data Fetching (TanStack Query + Axios)
- Do not use direct `fetch()`. All network communication must pass through the configured Axios client at `src/lib/axios.ts`.
- Manage loading, error, and caching state via **TanStack Query** hooks.
- Base URL: `https://swimming1academy.runasp.net`.

### B. User Notifications (Sonner)
- Always use `sonner` via `src/lib/sonner.ts` or directly with RTL alignment.

### C. Strict Scope Rule
- Never generate unrequested modules, files, or placeholder folders in advance. Only create or modify what the user explicitly directs.
