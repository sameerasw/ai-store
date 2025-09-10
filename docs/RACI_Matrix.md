# RACI Matrix

Team size: 1 BA, 2 Developers, 1 QA. This simple RACI maps ownership across key Ecommerce MVP workstreams derived from `Requirements_Specification.md`, `Decision_Analysis_and_Resolution.md`, and `Sprint_Planning.md`.

Legend
- R = Responsible (does the work)
- A = Accountable (final decision/owning outcome; exactly one per row)
- C = Consulted (two-way communication)
- I = Informed (one-way updates)

Assumptions
- Among the 2 Developers, assign a designated "Dev Lead" per workstream to hold A for build-focused items.
- If a Product Owner exists, they share A for scope decisions with BA; otherwise BA retains A on analysis items.

---

## Workstream RACI

| Workstream / Activity | BA | Dev (2) | QA |
|---|---|---|---|
| Requirements elicitation & backlog grooming | A/R | C | I |
| Acceptance criteria definition | A/R | C | C |
| Data model & architecture baseline | C | A/R | C |
| Product Catalog (admin CRUD, listing/detail) | C | A/R | C |
| Search & Filters | C | A/R | C |
| Offers & Promotions | C | A/R | C |
| Shopping Cart (session + user persistence) | C | A/R | C |
| Cart totals & pricing rules | C | A/R | C |
| Checkout flow (guest + minimal steps) | C | A/R | C |
| Payment gateway integration & webhooks | C | A/R | C |
| Order creation & tracking | C | A/R | C |
| Admin Back-Office & RBAC | C | A/R | C |
| Notifications/Email templates | C | A/R | C |
| Security & compliance (OWASP basics) | C | A/R | C |
| Performance & monitoring/alerts | I | A/R | C |
| Backups & recovery | I | A/R | C |
| Analytics events (GA4) | C | A/R | C |
| Test planning & execution | C | C | A/R |
| UAT coordination & sign-off | A/R | C | C |
| Release management & deployment | C | A/R | C |
| Legal pages/content integration | A/R | C | C |
| Documentation (user/admin) | A/R | C | C |
| Technical documentation (runbooks, ERD) | C | A/R | C |

Notes
- Exactly one A per row. If multiple developers, assign which developer is A during sprint planning.
- BA remains A for scope/requirements; Dev Lead remains A for implementation; QA remains A for test execution quality.

---

## How to Use in Jira
- Add these RACI roles as custom fields or include in issue Description.
- For dependencies, cross-reference stories in `Sprint_Planning.md` using "blocks/is blocked by" links.
- Suggested labels: `RACI`, `Ownership`, `MVP`.

---

## MVP Alignment Addendum (2025-09-10)

For this repository's MVP cut, the following clarifications apply:

- Team composition remains 1 BA, 2 Devs, 1 QA. No dedicated DevOps, Payments, or Email specialists are required in this cut.
- Out-of-scope workstreams (Admin CRUD, payment gateway integration, email notifications, order lifecycle automation, registration/addresses) are deferred. RACI rows referencing these remain for future phases but are not actionable in this iteration.
- Active workstreams now: Authentication, Product Catalog (read-only), Search & Filters, Offers (read-only), Cart totals (client-side), Orders (create/list/get), Security baseline, Performance/accessibility smokes, Documentation & Test Cases.
