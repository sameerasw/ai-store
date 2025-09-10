# Sprint Planning Backlog

Team capacity assumption: 1 BA, 2 Devs, 1 QA. Two-week sprints. This backlog is organized sprint-by-sprint with user story titles, brief descriptions, estimates, and acceptance criteria (AC) in Given/When/Then format. Suitable for creating issues in Jira Boards.

Legend
- Type: Story/Task/Spike
- SP: Story Points (relative)
- Labels: use tags like `MVP`, `Catalog`, `Payments`, `Admin`, `NFR`

---

## Sprint 1 — Foundations

1. [Story] Auth: Basic Registration & Login (8 SP) [Labels: MVP, Auth]
   - Description: Implement secure cookie-based sessions with register/login/logout for storefront and admin entry point.
   - Acceptance Criteria:
     - Given a new user, when they register with valid email/password, then the account is created and they are logged in.
     - Given an existing user, when they login with correct credentials, then a session is established via HTTP-only cookie.
     - Given a user is logged in, when they logout, then the session cookie is invalidated.
     - Passwords are stored hashed with bcrypt/Argon2.
   - Definition of Done:
     - Unit tests for auth flows (register/login/logout) with >80% coverage of auth module.
     - CSRF protections and secure cookie flags enabled; password policy documented.
     - Basic rate limiting in place for login endpoint.
     - Security review checklist passed (OWASP basics for auth).
   - Dependencies:
     - Data schema for `users` table (Story 2) pending; can be scaffolded in parallel.

2. [Story] Data Schema & Migrations (Products, Categories, Users, Orders, Carts, Offers) (10 SP) [Labels: MVP, DataModel]
   - Description: Create initial relational schema with indexes and foreign keys per requirements.
   - Acceptance Criteria:
     - Given the migration is run, then all core tables exist with required columns and constraints.
     - Given indexes, when searching by SKU or category, then the query uses the appropriate index.
     - Given a rollback, when executed, then schema returns to pre-migration state without errors.
   - Definition of Done:
     - Migrations committed and executed in dev/staging; rollback tested.
     - ERD exported to repo/docs; index plan documented.
     - Seeds or factories available for test data.
   - Dependencies:
     - None; foundational for multiple stories.

3. [Story] Admin Shell & RBAC (8 SP) [Labels: Admin, Auth]
   - Description: Secure admin area behind authentication; role Admin required; basic navigation scaffold.
   - Acceptance Criteria:
     - Given a non-admin user, when accessing admin routes, then access is denied.
     - Given an admin user, when accessing admin routes, then admin navigation is visible.
   - Definition of Done:
     - Route guards implemented; unauthorized access returns 401/403 appropriately.
     - Basic admin layout with nav to Products, Offers, Orders.
     - Audit log of admin logins recorded (basic).
   - Dependencies:
     - Auth story (Story 1) and Users schema (Story 2).

4. [Story] Observability & Environments Setup (6 SP) [Labels: NFR, DevOps]
   - Description: Configure logging/monitoring (Sentry + platform logs/metrics), staging/prod configs.
   - Acceptance Criteria:
     - Given an application error, when it occurs in staging, then it appears in Sentry with stack trace and release tag.
     - Given staging and production, when deploying, then environment configs are separate and secure.
   - Definition of Done:
     - Sentry DSN configured by environment; release/version tagging enabled.
     - Health endpoint available; basic uptime checks configured.
     - Sensitive configs stored in secure secrets manager.
   - Dependencies:
     - None; can proceed in parallel.

5. [Spike] Payment Gateway Selection & Sandbox Access (3 SP) [Labels: Payments]
   - Description: Confirm primary countries/currencies and choose Stripe or Razorpay; set up sandbox and keys.
   - Acceptance Criteria:
     - Decision recorded; sandbox credentials available; test payment plan documented.
   - Definition of Done:
     - ADR in repo with decision and rationale; API keys stored securely for staging.
   - Dependencies:
     - Business input on regions/currencies.

---

## Sprint 2 — Catalog Core

1. [Story] Product CRUD (Admin) with Images (8 SP) [Labels: Catalog, Admin]
   - Description: Admin can create/update/delete products with images stored in object storage.
   - Acceptance Criteria:
     - Given admin, when creating a product with required fields, then product is persisted and visible in list.
     - Given product images, when uploaded, then they are stored and retrievable via CDN URL.
     - Given a product is inactive or stock = 0, then it is not purchasable on storefront.
   - Definition of Done:
     - Server/client validation for required fields and SKU uniqueness.
     - Image uploads virus-checked (if available) and size/format restricted.
     - Happy-path and edge E2E tests in staging for create/update/delete.
   - Dependencies:
     - Data schema (Story 2 Sprint 1); Admin shell (Story 3 Sprint 1); Object storage configured.

2. [Story] Product Listing & Detail (Storefront) (6 SP) [Labels: Catalog]
   - Description: Public listing with pagination and product detail view showing price, availability, images, description.
   - Acceptance Criteria:
     - Given active products, when visiting catalog, then name, price, and availability are displayed with pagination.
     - Given a product detail page, when opened, then original data matches admin-entered content.
   - Definition of Done:
     - Pagination defaults documented; SEO-friendly URLs/titles.
     - Basic accessibility checks (alt text for images; keyboard nav).
     - Page load performance <2s under nominal seed data.
   - Dependencies:
     - Product CRUD completed; CDN URLs available for images.

3. [Story] Search & Filters (Name, SKU, Category, Price) (4 SP) [Labels: Catalog, Search]
   - Description: Implement basic search and filters with indexed queries.
   - Acceptance Criteria:
     - Given a valid search term, when searching by name/SKU, then matching products are returned.
     - Given selected category and price range, when applied, then results reflect filters.
   - Definition of Done:
     - Indexes verified in query plans; no full table scans for SKU/category.
     - Query param validation and sanitization.
   - Dependencies:
     - Product listing in place; indexes from schema story.

4. [Story] Offer Management (Admin create/activate/deactivate) (6 SP) [Labels: Offers, Admin]
   - Description: Admin can manage offers with type, scope, value, validity, status.
   - Acceptance Criteria:
     - Given an active offer, when validity dates are current, then status is Active and editable by admin.
   - Definition of Done:
     - Validation on discount bounds and date ranges; preview label text.
     - Unit tests for offer activation/deactivation flows.
   - Dependencies:
     - Admin shell; Offers table in schema.

5. [Task] Email Service Abstraction & Dev Templates (3 SP) [Labels: Notifications]
   - Description: Integrate SendGrid/SMTP abstraction; stub templates for order confirmation and status update.
   - Acceptance Criteria:
     - Given staging, when sending a test email, then it is logged/delivered to a test inbox.
   - Definition of Done:
     - Environment-based provider config; templates versioned in repo.
     - Test keys and suppression list configured for staging.
   - Dependencies:
     - Observability setup; sender domain DNS underway.

---

## Sprint 3 — Cart & Storefront Polish

1. [Story] Shopping Cart Core (session + user persistence) (8 SP) [Labels: Cart]
   - Description: Add to cart, update quantities, remove items; persist for session and logged-in user.
   - Acceptance Criteria:
     - Given a product, when added to cart, then it appears in cart with correct price and qty.
     - Given quantity changes, when adjusted, then totals update immediately.
     - Given logged-in user, when re-login later, then cart contents persist.
   - Definition of Done:
     - Session storage secured; merge logic defined for guest-to-user carts.
     - Unit tests for add/update/remove flows; minimal E2E covering persistence.
   - Dependencies:
     - Product listing; Auth sessions; Data model for carts.

2. [Story] Cart Totals (subtotal, discounts, tax/shipping placeholders) (6 SP) [Labels: Cart]
   - Description: Compute and display totals with discount lines when applicable.
   - Acceptance Criteria:
     - Given items in cart, when any qty changes, then subtotal and grand total are recalculated correctly.
   - Definition of Done:
     - Deterministic order of discount application documented.
     - Rounding policy agreed and implemented; unit tests for edge cases.
   - Dependencies:
     - Offers model; Cart service.

3. [Story] Promotions Display on Storefront (banners/labels) (4 SP) [Labels: Offers, UX]
   - Description: Show discounted indicators and banners per active offers.
   - Acceptance Criteria:
     - Given an active discount, when viewing a discounted product, then original and discounted price are visible.
   - Definition of Done:
     - Components responsive and accessible; analytics event for promo impressions.
   - Dependencies:
     - Offers management; Catalog pages.

4. [Task] Accessibility & Performance Baseline (3 SP) [Labels: NFR]
   - Description: Ensure responsive design and basic WCAG AA for forms; optimize assets.
   - Acceptance Criteria:
     - Given catalog pages, when tested on mobile and desktop, then layout is responsive and meets basic contrast and keyboard navigation.
   - Definition of Done:
     - Lighthouse/Axe checks recorded; images optimized; caching headers set for static assets.
   - Dependencies:
     - Catalog and storefront pages available.

---

## Sprint 4 — Checkout & Orders

1. [Story] Checkout Flow (guest + minimal steps) (6 SP) [Labels: Checkout]
   - Description: Implement shipping/contact details page and review step with guest checkout.
   - Acceptance Criteria:
     - Given a cart, when proceeding to checkout, then user can enter shipping and email and proceed to review.
   - Definition of Done:
     - Form validation and error states; autosave of checkout form.
     - Analytics events for checkout started and checkout step completed.
   - Dependencies:
     - Cart totals; Email service; Auth (optional for account checkout).

2. [Story] Payment Integration (Hosted Checkout + Webhooks) (14 SP) [Labels: Payments]
   - Description: Integrate chosen gateway hosted checkout; handle server confirmation and idempotent webhook processing.
   - Acceptance Criteria:
     - Given a successful authorization, when webhook confirms payment, then an order is created with status Processing.
     - Given a failed payment, when retried, then user can attempt payment again; no duplicate orders are created.
   - Definition of Done:
     - Webhook endpoint secured and idempotent; retries handled.
     - Test cards/test UPI flows validated; logs and alerts on failures.
   - Dependencies:
     - Payment gateway spike results; Orders schema; Observability setup.

3. [Story] Order Creation & Confirmation Email (8 SP) [Labels: Orders, Notifications]
   - Description: Create orders with unique number and send confirmation email.
   - Acceptance Criteria:
     - Given a paid order, when created, then order has unique ID and a confirmation email is sent to the user.
   - Definition of Done:
     - Unique order number generation deterministic and documented.
     - Email rendered from template with test coverage; link to order status page.
   - Dependencies:
     - Email service abstraction; Payment confirmation event; Orders schema.

4. [Task] Error Handling & Retry UX for Payments (3 SP) [Labels: Payments, UX]
   - Acceptance Criteria:
     - Given common payment errors, when encountered, then user sees clear messaging and can retry safely.
   - Definition of Done:
     - Standardized error codes/messages; UX copy reviewed; retry limits enforced.
   - Dependencies:
     - Payment integration story.

---

## Sprint 5 — Offers, Admin Enhancements, Order Tracking

1. [Story] Apply Offers at Add-to-Cart and Checkout (6 SP) [Labels: Offers, Cart]
   - Description: Enforce eligibility rules and apply percentage/flat discounts; no stacking in MVP.
   - Acceptance Criteria:
     - Given eligible items, when added to cart or at checkout, then the correct discount is applied once.
   - Definition of Done:
     - Unit tests for rule evaluation; logging of applied rules in order totals.
     - Guardrails to prevent stacking implemented.
   - Dependencies:
     - Offers model and management; Cart totals integration.

2. [Story] Admin Order Management (filters, status updates) (10 SP) [Labels: Admin, Orders]
   - Description: Admin can list orders with filters and update statuses; audit history events recorded.
   - Acceptance Criteria:
     - Given admin, when updating status to Shipped, then the change is recorded and visible to customer.
   - Definition of Done:
     - Audit trail events persisted; status transitions validated.
     - Pagination and filters performant on nominal dataset.
   - Dependencies:
     - Orders schema; Admin shell; Email notifications (optional).

3. [Story] Customer Order Status (auth + guest lookup) (8 SP) [Labels: Orders]
   - Description: Customers can view order status via account or by order ID + email.
   - Acceptance Criteria:
     - Given an existing order, when a guest checks status with order ID + email, then current status is shown.
   - Definition of Done:
     - Rate-limited guest lookup; privacy safeguards for status endpoint.
   - Dependencies:
     - Orders data and status updates; Email confirmation contains order number.

4. [Task] Admin UX Polish & Navigation (3 SP) [Labels: Admin, UX]
   - Acceptance Criteria:
     - Given admin area, when navigating, then key sections (Products, Offers, Orders) are accessible with consistent UX.
   - Definition of Done:
     - Navigation consistency; basic keyboard accessibility; breadcrumbs where relevant.
   - Dependencies:
     - Admin shell; underlying admin features present.

---

## Sprint 6 — Hardening, UAT, Release Prep

1. [Story] NFR Hardening: Security & Performance (6 SP) [Labels: NFR]
   - Description: Add secure headers, CSRF protections, rate limiting, DB indexes review, caching where appropriate.
   - Acceptance Criteria:
     - Given vulnerability scans, when executed on staging, then no high-severity findings remain.
     - Given catalog/product pages, when tested under nominal load, then median load time < 2s.
   - Definition of Done:
     - Security headers verified; CSRF tokens validated; perf metrics dashboard created.
     - Load test report attached to ticket; improvements tracked.
   - Dependencies:
     - Core features implemented; observability in place.

2. [Story] Monitoring, Alerts, and Backup Policy (4 SP) [Labels: NFR, DevOps]
   - Description: Configure alerts on error rates, latency, 5xx, webhook failures; ensure daily DB backups.
   - Acceptance Criteria:
     - Given an error spike in staging, when simulated, then an alert is triggered to the configured channel.
     - Given daily backups, when restore drill is performed, then data is recoverable.
   - Definition of Done:
     - Alert thresholds documented; on-call runbook attached.
     - Backup retention policy configured; restore script validated.
   - Dependencies:
     - Observability setup; managed DB backup features.

3. [Story] UAT Support & Stabilization (6 SP) [Labels: UAT]
   - Description: Address UAT findings and stabilize for release.
   - Acceptance Criteria:
     - Given UAT defects, when fixes are delivered, then regression tests pass and exit criteria are met.
   - Definition of Done:
     - UAT exit report signed-off; critical defects closed or deferred with approval.
     - Regression suite green in staging; release notes drafted.
   - Dependencies:
     - Completion of feature stories; test data and accounts prepared.

4. [Task] Legal Pages & Email Template Finalization (2 SP) [Labels: Content]
   - Acceptance Criteria:
     - Given final content for Terms/Privacy/Refunds and email templates, when integrated, then they render correctly and links are accessible.
   - Definition of Done:
     - Legal URLs linked in footer/header; email templates approved by stakeholders.
   - Dependencies:
     - Content from business/legal; email service abstraction.

---

## Cross-Sprint Test Suites (Reference)
- Catalog/Offers: CRUD, eligibility, price display
- Cart/Checkout: totals integrity, retry flows
- Payments: success/failure, webhook idempotency
- Orders/Admin: RBAC, status transitions, audit history
- NFR: security headers, performance smoke, backups/restore

## Dependencies & Notes
- Confirm payment gateway and currencies before Sprint 4.
- Sender domain DNS (SPF/DKIM/DMARC) before email tests in Sprint 3/4.
- Tax/shipping rules may start as flat rates in MVP.
