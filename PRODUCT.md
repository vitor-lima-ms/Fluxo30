# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: a person in Brazil, acting alone, keeping their own money in view day to day. They are not sharing a login with a household, and they are not mixing a business ledger into the same product.

The job on the table is to record each gasto and each receita as it happens, with enough fidelity that the book can be trusted later.

## Product Purpose

Fluxo30 is a personal finance app whose job is a faithful ledger: every expense and every revenue is registered with the right amount, date, and category.

Success is a complete, accurate book of lançamentos — not a dashboard glance, not a budget ceiling, not a shared household view.

## Positioning

The mechanism a neighboring money app could not copy without becoming this product: two category scopes (global catalog + the user's own categories) and two separate books (gastos and receitas), never a single blended transaction list.

## Operating Context

- Language of the product is Portuguese (Brazil). Calendar math for the current month uses `America/Sao_Paulo`.
- The person signs in with an email/password session (cookie-based JWT) and works in a Vue web app at `apps/web`, talking to the API at `apps/api`.
- A lançamento belongs to exactly one category. Categories are either global or user-scoped, typed as `expense` or `revenue`, and carry a name, hex color, and icon.
- Amounts are stored as positive `numeric(14,2)` with no currency field. There is no account, wallet, or multi-currency model in the product today.
- The existing home summary (current month vs previous month, same month last year, and year-to-date monthly average) is an API capability. It is not the definition of success.

## Capabilities and Constraints

Confirmed today:

- Auth: `POST /api/v1/user/login`, `POST /api/v1/user/logout`, `GET /api/v1/user` (cookie session).
- Home summary: `GET /api/v1/home` for the signed-in user.
- Data model: `users`, `global_scoped_categories`, `user_scoped_categories`, `expenses`, `revenues`. Soft delete. API data access is TypeORM Query Builder only (no TypeORM entities).
- Frontend scaffold exists (`apps/web`: Vue 3, Vite, TypeScript, Vuetify, Pinia, Vue Router, Atomic Design folders). No product screens (home, ledger, categories, auth UI) are implemented yet.

Not in the product today (do not imply them):

- Accounts, wallets, or a currency field.
- Recurrence, budgets/orçamentos, or household/shared ledgers.
- CRUD HTTP APIs for categories, expenses, or revenues (tables exist; those flows are not shipped).

Terminology to keep: **gasto** (expense), **receita** (revenue), **categoria**, **lançamento**. Kind values in data are `expense` | `revenue`. Scopes are `global` | `user`.

## Brand Commitments

- Product name: **Fluxo30**.
- Do not copy Ambtec brand, the Stolz typeface, or themes `ambtecLight` / `ambtecDark`.
- Current UI typeface in `apps/web` is Roboto. Replacing it is allowed only as an explicit Impeccable visual-world decision, not as a silent restyle.
- Voice and personality are not established.

## Evidence on Hand

- Synthetic development seeds only (`apps/api` development catalog: categories such as Alimentação, Transporte, Moradia, Salário, and generated ledger rows). Treat as demo data, never as real customers.
- No logo beyond `apps/web/public/favicon.ico`. No testimonials, press, case studies, or production screenshots.
- Future work must not fabricate customers, quotes, benchmarks, or Ambtec-derived identity.

## Product Principles

1. The ledger is the product: completeness and correctness of lançamentos outrank dashboards and decoration.
2. Gastos and receitas stay separate books, never a single mixed feed.
3. Categories come in two scopes — a shared catalog and the user's own — and a lançamento always belongs to exactly one.
4. The product is personal, solo, and Brazilian (pt-BR, São Paulo calendar); do not stretch it into household, business, or generic-global money software.
5. Do not impersonate another product's brand or invent proof the repo does not have.
