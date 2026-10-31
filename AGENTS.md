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
- **Code, Communication & Documentation Language**:
  - All chat communications with the user, plans, explanations, code, comments, commit messages, and documentation (`AGENTS.md`, technical docs) must be written in **English**.
  - Only the user-facing interface text, labels, placeholders, and notifications in the application are in **Arabic** (`dir="rtl"`).
- **Strict Zero-Emoji Policy**:
  - **NEVER** use emojis anywhere in user interfaces, code, comments, documentation, or chat communications. Always use clean vector icons from `lucide-react`.

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
│   ├── products.ts               # Product, ProductCategory, CreateProductPayload
│   ├── subscriptions.ts          # Subscription, CoachAssignments, DuePayments
│   ├── pos.ts                    # POS Sales, Returns, DuePayments
│   └── clients.ts                # Client, CreateClientPayload, UpdateClientPayload
├── layouts/                      # Layout shells
│   ├── AdminLayout.tsx           # Dashboard shell with right sidebar, header & <Outlet />
│   └── PosLayout.tsx             # Dedicated POS workspace shell
├── pages/                        # Thin page view orchestrators (~100-180 lines max)
├── components/                   # Focused domain UI components (<350 lines max per file)
│   ├── ui/                       # Shared primitives (PaginationBar, AsyncSearchableSelect)
│   ├── subscriptions/            # Subscription tabs, tables, forms, modals
│   ├── pos/                      # POS register catalog, cart drawer, tables, modals
│   └── ...                       # Domain-specific subcomponents
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

### D. File Size & Modularity Standard (No Monolithic Files)
- **Maximum File Size**: No `.ts` or `.tsx` file may exceed **350 lines** of code (target **100–250 lines**).
- **Thin Page Orchestrators**: Files in `src/pages/**` must act strictly as lightweight layout and tab orchestrators (**80–180 lines**). Never inline full data tables, complex multi-section forms, or modals directly inside a page file.
- **Single Responsibility Decomposition**:
  - Multi-tab views must extract each tab into `src/components/<domain>/<TabName>Tab.tsx`.
  - Data tables must live in `src/components/<domain>/<Entity>Table.tsx`.
  - Modals and forms must live in `src/components/<domain>/<Action>Modal.tsx` and sub-section components if a form exceeds 250 lines.
