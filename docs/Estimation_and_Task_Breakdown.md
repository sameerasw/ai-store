# Estimation and Task Breakdown

This plan is derived from `d:\Ecommerce1\Requirements_Specification.md` and targets three roles: Business Analysts (BA), Developers (Dev), and Test Engineers (QA). It focuses on MVP scope per MoSCoW priorities and NFRs.

Assumptions
- Team: 1 BA, 2 Devs, 1 QA.
- Sprint length: 2 weeks; indicative team capacity ~35–40 story points per sprint (reduced from the prior estimate due to fewer Devs).
- Tech stack: Monolithic web app + managed PostgreSQL + payment gateway (Stripe or Razorpay) + SendGrid + object storage + CDN.
- Environments: Dev, Staging, Production.
- Estimates are for MVP delivery and include analysis, build, and testing time; they are indicative and to be refined during sprint planning.

Legend
- SP = Story Points (relative complexity/effort)
- D = Dev days (focus time); QA and BA days are listed separately where relevant

---

## 1) Product Catalog (FR-1..FR-5)

BA Tasks (8 SP, 2 BA days)
- Clarify product fields, status rules, images policy, SKU uniqueness.
- Define category taxonomy and simple filters.
- Write acceptance criteria for listing, detail, activation/stock rules.

Dev Tasks (26 SP, ~12 D)
- Product model, CRUD, migrations, indexing (SKU, status, category). (8 SP)
- Admin UI for product CRUD with image upload (object storage). (8 SP)
- Storefront: listing with pagination, product detail page. (6 SP)
- Search (name, SKU) and filters (category, price). (4 SP)

QA Tasks (10 SP, ~5 QA days)
- Test CRUD, validation, images, pagination, filters, and activation/stock purchasing rules.
- Regression on catalog performance and basic security checks (OWASP basics).

## 2) Offers & Promotions (FR-6..FR-9, FR-30)

BA Tasks (6 SP, 1.5 BA days)
- Define offer types (percentage/flat), scope, validity, and display rules.
- Acceptance criteria for price display and eligibility.

Dev Tasks (16 SP, ~7 D)
- Offer data model, admin create/activate/deactivate. (6 SP)
- Apply offers at add-to-cart and checkout; price display (original vs discounted). (6 SP)
- Home/listing indicators and banners. (4 SP)

QA Tasks (8 SP, ~4 QA days)
- Validate rule application across edge cases (expired, inactive, product-level vs cart-level).
- Verify UI labels, totals, and non-stacking behavior per MVP.

## 3) Shopping Cart (FR-10..FR-13)

BA Tasks (4 SP, 1 BA day)
- Define cart persistence behavior (guest/session vs user), quantity rules.

Dev Tasks (18 SP, ~8 D)
- Cart service (session + user), line items, totals (subtotal, discount, tax, shipping placeholder). (8 SP)
- Update quantities/remove items, real-time totals. (6 SP)
- Basic persistence for logged-in users. (4 SP)

QA Tasks (8 SP, ~4 QA days)
- Functional: add/update/remove, persistence, concurrency basics.
- Totals integrity tests and rounding.

## 4) Checkout & Payments (FR-14..FR-19)

BA Tasks (10 SP, 2.5 BA days)
- Define checkout flow, minimal steps, guest vs registered.
- Confirm payment gateway and supported currencies; email requirements.

Dev Tasks (28 SP, ~13 D)
- Checkout UI (shipping details, review). (6 SP)
- Payment gateway integration (hosted Checkout), server-side confirmation, webhook handling with idempotency. (14 SP)
- Order creation with unique order number and initial status; confirmation email send. (8 SP)

QA Tasks (14 SP, ~7 QA days)
- Positive/negative payment flows, retries, webhook resiliency.
- Email confirmation rendering and deliverability (staging-safe).

## 5) Order Management & Tracking (FR-20..FR-23)

BA Tasks (6 SP, 1.5 BA days)
- Define status model and transitions (Processing, Shipped, Delivered, Cancelled).
- Specify admin filters and customer lookup (order ID + email).

Dev Tasks (18 SP, ~8 D)
- Admin order list with filters, status update actions, and audit trail. (10 SP)
- Customer order status view (auth and guest lookup). (8 SP)

QA Tasks (10 SP, ~5 QA days)
- Verify status transitions, audit events, permissions, and notifications.

## 6) User Accounts (FR-24..FR-25)

BA Tasks (4 SP, 1 BA day)
- Define registration fields, password reset policies, basic profile management.

Dev Tasks (16 SP, ~7 D)
- Auth (secure cookie sessions), registration/login/logout. (8 SP)
- Password hashing (bcrypt/Argon2), password reset via email link. (8 SP)

QA Tasks (8 SP, ~4 QA days)
- Auth flows, password reset, rate limiting and CSRF checks.

## 7) Notifications (FR-26..FR-27)

BA Tasks (3 SP, 0.75 BA days)
- Define templates (logo/footer), sender identity, optional toggles.

Dev Tasks (10 SP, ~4.5 D)
- Email service abstraction (SendGrid/SMTP), templates for order confirmation and status updates. (10 SP)

QA Tasks (6 SP, ~3 QA days)
- Template verification, edge cases (bounces), internationalization readiness (basic).

## 8) Admin Back-Office (FR-28..FR-30)

BA Tasks (3 SP, 0.75 BA days)
- Roles/permissions definition for Admin.

Dev Tasks (12 SP, ~5.5 D)
- Admin authentication/authorization, navigation, and basic UX for products/offers/orders. (12 SP)

QA Tasks (6 SP, ~3 QA days)
- RBAC checks, unauthorized access attempts, session timeouts.

## 9) Non-Functional Requirements (NFR-1..NFR-16)

BA Tasks (2 SP, 0.5 BA days)
- Document SLAs and acceptance for performance, availability, and security posture.

Dev Tasks (22 SP, ~10 D)
- Security: HTTPS, CSRF, input validation, secure headers, password hashing policy. (6 SP)
- Performance: basic caching, DB indexes, pagination defaults, CDN/static optimization. (8 SP)
- Observability: logging/monitoring setup (Sentry + platform logs/metrics). (4 SP)
- Environments and pipelines: staging/prod config, basic CI tests. (4 SP)

QA Tasks (10 SP, ~5 QA days)
- Non-functional testing: performance smoke, basic accessibility, security checks.

## 10) Data Model & Migrations (Section 4)

BA Tasks (2 SP, 0.5 BA days)
- Validate fields and relationships against business needs.

Dev Tasks (10 SP, ~4.5 D)
- Implement schema (Products, Categories, Offers, Carts, Orders, Users, Audit/History optional). (10 SP)

QA Tasks (4 SP, ~2 QA days)
- Migration integrity, referential constraints, rollback tests on staging.

## 11) Integrations (Section 5)

BA Tasks (3 SP, 0.75 BA days)
- Confirm providers (Payment, Email, Analytics) and access.

Dev Tasks (10 SP, ~4.5 D)
- Payment gateway, email service, and GA4 integration scaffolding. (10 SP)

QA Tasks (5 SP, ~2.5 QA days)
- Integration tests for webhooks, email delivery (sandbox), analytics event firing.

## 12) Acceptance Criteria & UAT Support (Section 6)

BA Tasks (5 SP, 1.25 BA days)
- Transform AC samples into detailed testable scenarios; manage UAT schedule.

Dev Tasks (6 SP, ~3 D)
- Support UAT fixes and stabilization. (6 SP)

QA Tasks (10 SP, ~5 QA days)
- Execute AC-based test cases; triage and re-test defects.

## 13) Risks & Mitigations (Section 8)

BA Tasks (2 SP, 0.5 BA days)
- Maintain risk register; facilitate change control per MoSCoW.

Dev Tasks (4 SP, ~2 D)
- Implement feature flags or configuration toggles for risky areas. (4 SP)

QA Tasks (4 SP, ~2 QA days)
- Scenario-based testing on performance and gateway onboarding timelines.

---

## Roll-up Estimates (MVP)
- BA: ~37 SP (~9.25 BA days)
- Dev: ~218 SP (~100 Dev days)
- QA: ~101 SP (~50.5 QA days)

Capacity-based projection with 1 BA, 2 Devs, 1 QA
- Dev capacity per sprint ≈ 20 dev-days (2 devs × 10 days/sprint).
- Pure development workload: ~100 dev-days ≈ 5 sprints.
- Considering sequencing, integration, QA cadence, and risk buffer: plan 6 sprints (12 weeks).

Indicative Timeline (6 sprints, 12 weeks)
- Sprint 1: Foundations (schema, auth, admin shell, environments, logging/monitoring)
- Sprint 2: Catalog core (CRUD, listing/detail, images) + basic search/filters
- Sprint 3: Cart core + storefront polish + email base
- Sprint 4: Checkout + payment integration + order creation + confirmations
- Sprint 5: Offers engine + admin enhancements + order tracking
- Sprint 6: NFR hardening + UAT + fixes + performance tuning + release prep

Notes
- Parallelize BA analysis ahead of Dev by 0.5–1 sprint to keep backlog ready.
- QA begins test design in Sprint 1; heavier execution from Sprint 2 onwards.

---

## Task Breakdown by Milestone

Milestone A: Foundations (Sprint 1)
- BA: Clarify data model, roles, and AC baselines.
- Dev: DB schema/migrations, auth, admin shell, logging/monitoring, CI skeleton.
- QA: Environment readiness tests, basic auth and CRUD smoke.

Milestone B: Catalog & Cart (Sprints 2–3)
- BA: Filters/search definitions, image handling policy.
- Dev: Catalog UI/UX, search/filters, cart service and persistence; storefront polish.
- QA: Catalog/cart test passes, non-functional smoke.

Milestone C: Checkout & Orders (Sprint 4)
- BA: Finalize checkout flow and emails; gateway/currency decision.
- Dev: Payment integration, order creation, confirmation emails, webhook reliability.
- QA: Payment flows, email validation, webhook edge cases.

Milestone D: Offers & Admin (Sprint 5)
- BA: Offer rules and display clarifications.
- Dev: Offers engine, admin lists/actions, order tracking.
- QA: Offers eligibility tests, RBAC checks.

Milestone E: Hardening & Release (Sprint 6)
- BA: UAT coordination, sign-off criteria.
- Dev: Performance tweaks, bug fixes, docs.
- QA: Regression, performance smoke, accessibility basics.

---

## Open Dependencies and Inputs
- Confirm payment gateway and currencies; set up sandbox accounts.
- Provide email sender domain and DNS records (SPF/DKIM/DMARC).
- Define tax/shipping rules for MVP (flat/table-based).
- Supply legal pages (Terms, Privacy, Refunds) and email templates.

## Risks Impacting Estimates
- Gateway onboarding delays; product data quality; scope creep; performance under load.
- Mitigations per DAR: sandbox early, validation templates, enforce MoSCoW, load testing in staging.
