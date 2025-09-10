# Overall Test Strategy and Design

This document defines the test strategy, approach, scope, environments, tools, data strategy, entry/exit criteria, deliverables, and governance for the Online Shopping Web Application (MVP) described in `Scope_Document.md` and `Requirements_Specification (1).md`.

## 1. Purpose and Scope
- Ensure the MVP meets functional requirements (FR-1 … FR-30) and non-functional requirements (NFR-1 … NFR-16).
- Cover end-to-end customer and admin flows: catalog, offers, cart, checkout/payments, order management, basic accounts, notifications, and admin back-office.
- Validate cross-cutting qualities: security, performance, availability, usability/accessibility, maintainability, and basic analytics readiness.

## 2. Test Objectives
- Verify happy-path purchase flow is defect-free and measurable via analytics.
- Validate admin can manage products, offers, and orders without assistance.
- Confirm discount/offer application logic and price calculations across product and cart levels.
- Ensure payment is processed via third-party gateway without storing raw card data (PCI-DSS aligned).
- Confirm statuses and notifications are correct and consistent.
- Validate MVP NFRs: load time (<2s), 100 concurrent users baseline, 99.5% uptime target (observed via monitoring in staging/early prod), responsive UI, basic WCAG.

## 3. Test In/Out of Scope
- In scope: All items listed in `Scope_Document.md` section 3 (MVP), including responsive design and basic analytics readiness.
- Out of scope: Items listed under section 4 (Future Roadmap), e.g., AI recommendations, loyalty, supplier stock sync, advanced CMS, multi-currency, etc.

## 4. Test Levels
- Unit Testing: Developer-owned using test frameworks (e.g., Jest/Vitest for FE, JUnit/PyTest/NUnit or equivalent per stack for BE).
- Component/Integration Testing: Services, repositories, controllers, and UI components with mocked or test doubles; gateway sandbox integration tests.
- API Testing: Contract and functional tests for REST/GraphQL endpoints; schema validation and error conditions.
- System Testing: End-to-end across storefront, checkout, payments (sandbox), and admin.
- Non-Functional Testing: Performance, security, accessibility, reliability/backup checks.
- UAT: Business validation of core scenarios prior to go-live.

## 5. Test Types and Approach
- Functional Testing
  - Positive/negative, boundary, state transitions (e.g., stock > 0 vs =0), and data validation.
  - Cross-browser/responsive checks for key viewports (mobile, tablet, desktop).
  - Localization is single-language for MVP; verify content and currency consistency.
- Regression Testing
  - Maintain a smoke and regression pack focusing on critical flows: search → PDP → cart → checkout → payment → order confirmation; admin CRUD and status updates.
- API/Contract Testing
  - Validate request/response models, error codes, and idempotency where applicable (e.g., payment retry).
- Data Integrity Testing
  - Product, stock, prices, and offer rules apply consistently across list, detail, cart, and order records.
- Security Testing (AppSec hygiene)
  - Basic OWASP Top 10 checks, auth/session controls, CSRF/XSS mitigations, password hashing verification, role-based access controls for admin.
- Performance Testing
  - Baseline page load and API response under typical load; concurrency goal of 100 users; simple stress to identify saturation points; caching validation.
- Accessibility Testing
  - Basic WCAG 2.1 AA checks on forms, contrast, keyboard navigation, focus management, semantic landmarks.
- Reliability/Backup/Monitoring Readiness
  - Verify error logging/monitoring events captured; daily backup job simulations (where feasible in staging) and restore procedures documented.

## 6. Feature-wise Test Design Overview
- Product Catalog (FR-1 … FR-5)
  - CRUD validations, pagination, search by name/SKU, filter by category/price, active/stock gating, PDP correctness.
- Offers & Promotions (FR-6 … FR-9)
  - Creation rules, validity dates, status toggles, banner/label display, price strike-throughs, eligibility checks at add-to-cart and checkout.
- Shopping Cart (FR-10 … FR-13)
  - Add/remove/update quantity, totals and recalculation, persistence for session and logged-in users, stock re-checks.
- Checkout & Payments (FR-14 … FR-19)
  - Guest vs. registered checkout, minimal-step flow, gateway sandbox authorization, order creation and confirmation email, retry handling.
- Order Management & Tracking (FR-20 … FR-23)
  - Admin filters and status updates (Processing, Shipped, Delivered, Cancelled); customer status visibility; order history timeline.
- User Accounts (FR-24 … FR-25)
  - Registration, login, hashed passwords, password reset.
- Notifications (FR-26 … FR-27)
  - Order confirmation and status updates; configurable templates or static branding.
- Admin Back-Office (FR-28 … FR-30)
  - RBAC, manual updates, offer previews; CSV import is a nice-to-have—smoke tested if implemented.

## 7. Test Environment Strategy
- Environments
  - Dev: Developer validation and unit/component tests.
  - Staging: System, regression, UAT, and non-functional tests. Integrated with payment gateway sandbox, email test domain/service sandbox, and analytics test property.
  - Production: Post-deploy smoke and monitoring; no functional manual testing unless critical.
- Data
  - Use anonymized or synthetic data. Seed products/categories/offers aligned with `Scope_Document.md` deliverables.
  - Test payment with sandbox cards only; no real card data.
- Access & Accounts
  - Separate admin test accounts with least privilege. Separate email inbox for test notifications.

## 8. Tools and Frameworks
- Test Management: Lightweight within repo (Markdown for `Test_Cases.md`), optionally Azure Test Plans/Jira Xray if available.
- Functional E2E: Playwright or Cypress for UI; Postman/Newman or REST Assured for API.
- Unit/Component: Jest/Vitest, JUnit/PyTest/NUnit depending on tech stack.
- Performance: k6, JMeter, or Locust.
- Security: OWASP ZAP (baseline scan), dependency scanning via SCA tool (e.g., npm audit/pip-audit).
- Accessibility: axe DevTools/Playwright-axe, Lighthouse.
- CI/CD: Pipeline to run unit, API, E2E smoke, and SAST/DAST baselines on PRs/merges.

## 9. Test Data Strategy
- Deterministic datasets for pricing and discount scenarios (percentage/flat; product/cart scope; overlapping validity windows).
- Edge cases: zero/low stock, inactive products, expired/future offers, invalid promo application.
- PII handling: Only synthetic emails/names; purge/rotate datasets regularly.

## 10. Entry and Exit Criteria
- Entry to System Testing
  - Feature complete for MVP scope; unit and component tests green; environment stable; sandbox integrations available.
- Exit from System/Regression
  - All high/critical defects closed; medium defects have workarounds; regression pass ≥95%; key NFR baselines met; Product Owner sign-off.
- Entry to UAT
  - Stable build in staging; smoke pack green; test data prepared; scenarios agreed with business.
- Exit from UAT
  - All UAT-blocking issues resolved or accepted; go-live checklist completed.

## 11. Defect Management and Reporting
- Tracking: Use the team’s issue tracker (e.g., Jira). Severity and priority defined; duplication checks in place.
- Workflow: New → Triaged → In Progress → In Review → Ready for Test → Verified → Closed.
- SLA Targets (MVP):
  - Critical fix ETA: 24–48h; High: 2–4 days; Medium: Sprint; Low: Backlog.
- Reporting: Daily/bi-weekly test status, defect trends, pass/fail rates, and top risks.

## 12. Metrics
- Test coverage by module and by requirement (FR/NFR).
- Defect density and leakage (found in UAT/prod vs earlier phases).
- Mean time to detect/fix; build health trends.
- Performance baseline metrics: P95 page load, API latency, error rates.
- Accessibility score and violations count.

## 13. Non-Functional Test Plans
- Performance & Scalability (NFR-6 … NFR-8)
  - Goals: <2s page load (catalog/PDP), 100 concurrent users without degradation; verify caching improves throughput.
  - Scenarios: Browse catalog, search, add to cart, checkout APIs; admin list/update operations.
  - KPIs: P50/P95 latency, throughput (RPS), error rate, resource utilization.
- Security & Compliance (NFR-1 … NFR-5)
  - HTTPS enforced; no card data stored; auth/session controls; RBAC; CSRF/XSS/SQLi checks; password hashing verified.
  - Tools: ZAP baseline, SCA; manual checks for authz bypass.
- Availability & Reliability (NFR-9 … NFR-11)
  - Monitoring hooks validated; error/latency alerts; backup job tested in staging and restore drill documented.
- Usability & Accessibility (NFR-12 … NFR-13)
  - Responsive layouts; keyboard navigation; color contrast; form labels and errors; basic screen reader checks.
- Maintainability & DevOps (NFR-14 … NFR-16)
  - Linting, code style; CI tiers for unit/E2E; test artifacts; core automated tests for add-to-cart, checkout, order status.

## 14. Traceability Matrix (Sample)
| Requirement | Test Coverage (examples) |
|---|---|
| FR-2 Listing pagination | UI tests for pagination controls; API tests for list endpoints with page/size |
| FR-3 Search & filter | UI tests for search by name/SKU; filter by category/price; API parameter validation |
| FR-5 Purchasable gating | Negative tests for inactive/out-of-stock items not purchasable |
| FR-6/FR-9 Offers & eligibility | Offer CRUD tests; validity windows; eligibility at add-to-cart and checkout; price calculations |
| FR-12 Cart totals | Recalc tests for subtotal/discount/tax/shipping/grand total |
| FR-14–FR-19 Checkout & payments | Guest/registered flows; gateway sandbox success/failure/retry; confirmation email |
| FR-20–FR-23 Orders | Admin filters; status transitions; customer visibility; history events |
| FR-24–FR-25 Accounts | Registration/login; password hash; reset via email link |
| FR-28–FR-30 Admin access | RBAC enforcement; manual updates; offer previews |
| NFR-6 Performance | Load tests for catalog/PDP; API latency thresholds |
| NFR-1,2,3 Security | HTTPS; no card storage; OWASP checks; CSRF/XSS mitigations |
| NFR-12–13 Accessibility | Axe/Lighthouse audits; keyboard and contrast checks |

Note: Full RTM will be maintained alongside `Test_Cases.md` and updated per change.

## 15. Test Deliverables
- This Test Strategy and Design document.
- `Test_Cases.md` covering functional and NFR scenarios.
- Automation suites: unit, API, and critical-path E2E.
- Performance and security test reports.
- Test data seeds and environment config notes.
- Daily/weekly status reports and exit report.

## 16. Schedule and Milestones (aligned to Scope high-level timeline)
- Weeks 1–2: Test planning, environment setup, data seeding, unit test scaffolding.
- Weeks 3–5: System and integration testing in sprints; build regression pack; start automation for critical flows.
- Week 6: Full regression, NFR testing, UAT support, defect closure, go-live prep.
- Week 7: Launch smoke tests and hypercare monitoring.

## 17. Risks and Mitigations
- Payment gateway onboarding delays → Use sandbox early; coordinate merchant setup.
- Product data quality → Use templates and validations; phased imports.
- Scope creep → Strict MVP adherence and change control.
- Performance under load → Early baseline tests; caching; optimize hot paths.

## 18. UAT Plan (High-Level)
- Participants: Product Owner, Business Stakeholders, QA support.
- Scope: Happy-path purchase, admin management, offers display, order status updates, essential notifications.
- Process: Scenario walkthroughs with predefined data; defects tracked in same system; go/no-go criteria agreed.

## 19. Go/No-Go Criteria (MVP)
- All critical/high defects closed; regression pass rate ≥95%.
- Key NFR baselines met (performance, security, accessibility checks).
- UAT sign-off obtained; deployment and rollback plans validated.

## 20. MVP Scope Alignment Addendum (2025-09-10)

To minimize scope and match the current implementation in this repository, the following clarifications apply to this MVP build. This addendum adjusts test expectations without altering the broader long-term strategy above.

- In-Scope (Implemented Now)
  - Customer authentication (login/logout) using JWT; seeded users.
  - Customer catalog browsing and product detail via read-only APIs (`/products`, `/products/:id`) with basic text filter params.
  - Offers display via read-only API (`/offers` returning active offers only).
  - Shopping cart on the storefront with client-side totals: subtotal, coupons (SAVE10, SAVE20, FREESHIP), tax (8%), shipping rules (free at >= $100 or FREESHIP), and grand total.
  - Order placement and order history for the logged-in customer (`POST /orders`, `GET /orders`, `GET /orders/:id`).

- Deferred/Out-of-Scope for This MVP Cut (Not Implemented)
  - Admin portal and admin CRUD for products/offers/orders (FR-1.1–1.3, FR-2.1, FR-4.3) – deferred; APIs removed for now.
  - Checkout data capture (shipping address/contact) and payment processing (FR-3.4) – not included; order placement is simplified.
  - Order confirmation emails and notifications (FR-3.5; Notifications section) – not included.
  - Automated order status lifecycle (Processing → Shipped → Delivered) (FR-4.1) – not included.
  - Customer registration and saved addresses (FR-5.1, FR-5.2) – not included.

Testing in this phase should follow `Test_Cases.md`, which reflects the above scope. As features are added in subsequent iterations, this addendum will be revised and the full strategy sections (e.g., admin, payments, notifications) become in-scope.

---
Document owner: QA Lead
Version: 1.0
Date: 2025-09-10
