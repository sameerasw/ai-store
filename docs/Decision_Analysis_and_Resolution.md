# Decision Analysis and Resolution (DAR)

## 1. Purpose
- Provide a structured, traceable approach to evaluate key architecture and implementation decisions for the ecommerce MVP.
- Ensure choices align with functional requirements (catalog, cart, checkout, orders, admin) and non-functional requirements (security, performance, availability, maintainability) defined in `d:\Ecommerce1\Requirements_Specification.md`.

## 2. Scope
- Decisions covering: payment gateway, email service, data store, search approach, hosting and architecture, authentication/session strategy, promotions/discounts design, monitoring/logging, backups, analytics, notifications, CSV import (MVP posture).
- Aligned with open questions (Section 9 of the requirements): payment gateway regions/currencies, taxes/shipping rules, refund workflow, email sender domain, legal pages/policies.

## 3. Decision Drivers and Evaluation Criteria
- Security & Compliance: HTTPS, PCI-DSS alignment, OWASP Top 10 mitigations, strong password hashing.
- Performance & Scalability: <2s page loads, 100 concurrent users for MVP, path to horizontal scale.
- Availability & Reliability: ~99.5% uptime target, logging/monitoring, daily backups.
- Maintainability & DevOps: conventions, staging/prod configs, automated tests.
- Cost & Time-to-Market: MVP-first, low integration friction.
- Regional Fit: Supported countries/currencies; local payment methods.
- Feature Fit: Meets FRs for checkout, offers, notifications, admin back-office.

Relative weighting: Security (High), Regional Fit (High), Time-to-Market (High), Performance (Medium), Cost (Medium), Maintainability (Medium).

## 4. Decision Topics, Alternatives, Analysis, and Recommendations

### 4.1 Payment Gateway
- Requirements mapping: FR-16, FR-17, FR-18; NFR-2; Open Question: countries/currencies.
- Alternatives:
  - Stripe: Global coverage, mature APIs/Webhooks, 3DS/SCA, hosted Checkout, great docs.
  - PayPal (Checkout): Global brand, wallet + cards, webhooks.
  - Razorpay: Strong India coverage (UPI/net-banking), webhooks.
- Analysis: All PCI-DSS compliant and tokenized. Stripe strongest developer tooling; Razorpay ideal for India-first; PayPal adds wallet familiarity.
- Recommendation:
  - India-first MVP: Razorpay; Stripe as expansion path.
  - International/uncertain region: Stripe for MVP.
- Notes: Do not store card data. Use hosted forms/Checkout. Implement idempotent webhooks for payment status updates.

### 4.2 Email Service
- Requirements mapping: FR-18, FR-26, FR-27; NFR-10.
- Alternatives: SendGrid, Mailgun, SMTP.
- Recommendation: SendGrid for MVP (transactional templates, logs, webhooks). SMTP for local/dev.
- Action: Configure sender domain and DNS (SPF/DKIM/DMARC).

### 4.3 Data Store (Relational Database)
- Requirements mapping: Catalog, orders, users, offers; ACs; backups.
- Alternatives: PostgreSQL, MySQL.
- Recommendation: Managed PostgreSQL (v14+). Use strict FKs; indexes for SKU, product status, category, order_number.
- Notes: Daily automated backups with retention per policy.

### 4.4 Search and Filtering
- Requirements mapping: FR-3 (basic search/filter by name, SKU, category, price).
- Alternatives: DB-backed search with indexes; DB full-text; Elasticsearch/OpenSearch.
- Recommendation: DB-backed with proper indexes (btree for SKU/category/price; trigram or FTS for name as needed). Avoid Elasticsearch in MVP.

### 4.5 Hosting and Application Architecture
- Requirements mapping: NFR-6..NFR-9, NFR-14..NFR-16.
- Alternatives: Monolith (web+API) vs microservices.
- Recommendation: Monolith behind HTTPS on cloud platform (Azure App Service/AWS Elastic Beanstalk/GCP Cloud Run) + managed Postgres + object storage (Blob/S3/GCS) + CDN for static/media. 12-factor config; separate staging/prod.

### 4.6 Authentication and Session Management
- Requirements mapping: FR-24..FR-25, FR-28; NFR-3, NFR-4, NFR-5.
- Alternatives: Secure cookie sessions; JWT everywhere.
- Recommendation: Secure, HTTP-only cookie sessions for storefront/admin; JWT for external APIs if needed. Hash passwords with bcrypt/Argon2; enable CSRF protection and rate limiting.

### 4.7 Offers/Promotions Engine (MVP)
- Requirements mapping: FR-6..FR-9, FR-30; AC-2.
- Alternatives: Inline cart/checkout calculation vs dedicated rules engine.
- Recommendation: DB-driven offers (percentage/flat; product/cart scope; validity and status) applied at add-to-cart and checkout. No stacking for MVP. Record applied rules in order totals.

### 4.8 Notifications
- Requirements mapping: FR-26..FR-27.
- Alternatives: Synchronous send vs background jobs.
- Recommendation: Synchronous send for MVP via email service abstraction; plan to move to background queue shortly after MVP.

### 4.9 Monitoring and Logging
- Requirements mapping: NFR-10, NFR-9; Risk: performance under load.
- Alternatives: Sentry/Elastic APM/Datadog + cloud logs/metrics.
- Recommendation: Sentry for error tracking + platform-native logs/metrics. Alerts on error rate, latency, 5xx, and webhook failures.

### 4.10 Backups and Recovery
- Requirements mapping: NFR-11.
- Recommendation: Daily automated DB backups (7–14 days retention). Versioned object storage for product images. Quarterly restore drills.

### 4.11 Analytics
- Requirements mapping: Integrations section.
- Alternatives: Google Analytics 4 or privacy-first alternatives.
- Recommendation: GA4 basic page + conversion events (add-to-cart, checkout start, purchase). Respect cookie consent where applicable.

### 4.12 CSV Import for Products (MVP posture)
- Requirements mapping: FR-29 (nice-to-have).
- Recommendation: Defer CSV import to post-MVP. Continue manual admin forms.

## 5. Summary of Recommendations
- Payment: Stripe (international/uncertain) or Razorpay (India-first). Confirm region/currencies.
- Email: SendGrid; configure sender domain/DNS.
- DB: Managed PostgreSQL; strong indexing/constraints.
- Search: Database indexing; avoid Elasticsearch in MVP.
- Architecture: Monolith + managed DB + object storage + CDN; 12-factor; HTTPS.
- Auth: Secure cookie sessions; JWT for APIs if needed; bcrypt/Argon2; CSRF and rate limits.
- Offers: Simple DB-driven rules; deterministic application; no stacking.
- Notifications: Synchronous initially; abstract for future background jobs.
- Monitoring: Sentry + cloud logs/metrics; set alerts.
- Backups: Daily DB backups; storage versioning; periodic restore tests.
- Analytics: GA4 basic events.
- CSV Import: Post-MVP.

## 6. Assumptions and Dependencies
- Business will provide legal pages and policies.
- Taxes/shipping rules to be clarified; MVP may start with flat rates.
- Email sender domain and API credentials available.
- Payment gateway merchant onboarding completed in time.

## 7. Risks and Mitigations
- Payment onboarding delays: Start sandbox integration early; parallelize merchant setup.
- Product data quality: Provide templates and validations; phased import.
- Scope creep: Enforce MoSCoW prioritization and change control.
- Performance under load: Proper DB indexes, CDN, light caching; basic load tests in staging.
- Webhook reliability: Retries + idempotency keys; log failures and alert.

## 8. Decision Log and Traceability
- Maps to FR-16..FR-19 (payments), FR-26..FR-27 (emails), FR-1..FR-5 (catalog), FR-24..FR-25, FR-28 (auth/admin), and NFR-1..NFR-16 (security, performance, reliability, maintainability). See sections above for specific links.

## 9. Open Items and Next Steps
- Confirm primary countries and currencies for MVP to finalize gateway choice.
- Decide tax/shipping calculation approach (flat, table-based, service-backed) for MVP.
- Provide email sender domain; set up SPF/DKIM/DMARC.
- Provide policy pages (Terms, Privacy, Refunds).
- Review backup retention requirements (legal/compliance, if any).
- Create staging/production environment configurations.

---

### Appendix A: Abbreviated Evaluation Matrix

- Payment Gateway (Stripe vs PayPal vs Razorpay)
  - Security/Compliance: All High
  - Regional Fit: Stripe = High (broad), PayPal = High (broad), Razorpay = Very High (India)
  - Integration Speed: Stripe = Very High, PayPal = High, Razorpay = High
  - Fees: Comparable; region-specific
  - Overall (MVP): Stripe (international), Razorpay (India-first)

- Email (SendGrid vs Mailgun vs SMTP)
  - Deliverability/Tooling: SendGrid = High, Mailgun = High, SMTP = Medium
  - Time-to-Market: SendGrid = High, Mailgun = High, SMTP = Medium
  - Overall: SendGrid

- Search (DB vs Full-text vs Elasticsearch)
  - Complexity: DB = Low, FTS = Medium, ES = High
  - Performance @100 users: DB = High, FTS = High, ES = High
  - Cost: DB = Low, FTS = Low, ES = Medium/High
  - Overall: DB with indexes

- Architecture (Monolith vs Microservices)
  - MVP Delivery Speed: Monolith = Very High, Microservices = Low
  - Scalability Path: Both acceptable; Monolith evolves later
  - Overall: Monolith for MVP
