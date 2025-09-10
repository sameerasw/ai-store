# Requirements Specification Document
## MVP Alignment Addendum (2025-09-10)

This addendum aligns the requirements to the current implementation in this repository. It preserves the original long-term requirements above while clarifying what is in-scope now vs deferred, to avoid conflicts with the code.

- In-Scope (Implemented Now)
  - Customer login/logout with JWT; seeded users (`admin`, `user`).
  - Product catalog read-only for customers: list with filters (`q`, `category`, `tags`) and get-by-id.
  - Offers read-only: list of active offers.
  - Shopping cart and totals (client-side): subtotal, coupons (SAVE10, SAVE20, FREESHIP), 8% tax, shipping rules (free at ≥$100 or FREESHIP), total.
  - Order placement and order history for the logged-in user.

- Deferred/Out-of-Scope for this MVP Cut
  - Admin CRUD for products/offers/orders and back-office UI.
  - Checkout form (shipping/contact) and payment processing.
  - Notification emails, order status lifecycle automation, and tracking details.
  - Registration and saved addresses.

- Test Artifacts
  - See repository root `Test_Cases.md` for concrete test cases aligned to this scope.


## 1. User Roles
- Visitor/Customer
  - Browse products, search/filter, add to cart.
  - Checkout as guest or register/login.
  - View order status (with order ID or within account).
- Admin
  - Manage products (CRUD), stock, pricing, images.
  - Manage offers/promotions (CRUD), activate/deactivate.
  - View and update orders, change order status.

## 2. Functional Requirements

### 2.1 Product Catalog
- FR-1: The system shall allow admins to create, read, update, and delete products with fields: name, SKU, price, stock quantity, category, image(s), short description, status (active/inactive).
- FR-2: The storefront shall display a product listing page with pagination.
- FR-3: Users shall be able to search products by name and SKU, and filter by category and price range (basic).
- FR-4: The product detail page shall display name, price, availability, images, and description.
- FR-5: Only products marked active with stock > 0 shall be purchasable.

### 2.2 Offers & Promotions
- FR-6: Admins shall create offers with fields: name, type (percentage/flat), scope (product-level or cart-level), discount value, validity dates, and status.
- FR-7: The storefront shall visually indicate discounted items and show original vs discounted price on product detail and cart pages when applicable.
- FR-8: The home/listing pages shall display active promotions via banners or labels.
- FR-9: The system shall validate offer eligibility at add-to-cart and checkout.

### 2.3 Shopping Cart
- FR-10: Users shall add products to cart from listing/details pages.
- FR-11: Users shall modify cart item quantities and remove items.
- FR-12: Cart shall display line items, subtotal, discounts, taxes/shipping (if applicable), and grand total.
- FR-13: Cart contents shall persist during the session and for logged-in users upon re-login (basic persistence).

### 2.4 Checkout & Payments
- FR-14: Users shall proceed to checkout with minimal steps (shipping details, payment).
- FR-15: The system shall support guest checkout and simple registration.
- FR-16: The system shall integrate with a secure third-party payment gateway; card data shall not be stored on the platform.
- FR-17: On successful payment authorization, an order shall be created with a unique order ID and initial status “Processing.”
- FR-18: The system shall send order confirmation to the user’s email (if provided).
- FR-19: The system shall handle common payment errors gracefully and allow retry.

### 2.5 Order Management & Tracking
- FR-20: Admins shall view orders with filters (date range, status, customer email).
- FR-21: Admins shall update order status among: Processing, Shipped, Delivered, Cancelled.
- FR-22: Customers shall view their order status by logging in or via order ID + email lookup.
- FR-23: The system shall record order history events (status changes timestamped).

### 2.6 User Accounts (Basic)
- FR-24: Users may create an account with email and password, view their order history, and manage basic profile details.
- FR-25: Passwords shall be stored hashed; password reset via email link.

### 2.7 Notifications
- FR-26: The system shall send transactional emails: order confirmation, order status update (optional for MVP).
- FR-27: Admins may configure email templates (logo, footer) at a basic level or via static templates.

### 2.8 Admin Back-Office
- FR-28: Authentication required for admin access with role-based access control (Admin).
- FR-29: Admin UI shall support bulk product updates (CSV import) or manual updates via forms. At MVP, at least manual updates are required; CSV import is nice-to-have.
- FR-30: Admins shall activate/deactivate offers and preview display text/labels.

## 3. Non-Functional Requirements (NFRs)

### 3.1 Security & Compliance
- NFR-1: Use HTTPS for all traffic.
- NFR-2: Do not store raw payment card data; use PCI-DSS compliant gateway.
- NFR-3: Implement OWASP Top 10 mitigations (CSRF, XSS, SQLi).
- NFR-4: Passwords stored using strong hashing (e.g., bcrypt/Argon2).
- NFR-5: Enforce secure session management and token-based auth for APIs.

### 3.2 Performance & Scalability
- NFR-6: Page load time for catalog and product detail pages <2s under nominal MVP load.
- NFR-7: Support at least 100 concurrent users without service degradation in MVP.
- NFR-8: Architecture should support horizontal scaling for future growth.

### 3.3 Availability & Reliability
- NFR-9: Target 99.5% uptime for MVP.
- NFR-10: Implement basic monitoring and logging for errors and performance metrics.
- NFR-11: Create daily automated backups for database.

### 3.4 Usability & Accessibility
- NFR-12: Responsive design for mobile and desktop.
- NFR-13: Meet basic WCAG 2.1 AA considerations for forms, contrast, and keyboard navigation.

### 3.5 Maintainability & DevOps
- NFR-14: Codebase shall follow standard conventions and include documentation.
- NFR-15: Provide staging and production environment configuration.
- NFR-16: Automated tests for core flows (add to cart, checkout, order status update).

## 4. Data Model (MVP Outline)
- Product
  - id, name, sku, description, price, stock_qty, category_id, images[], status, created_at, updated_at
- Category
  - id, name, parent_id (optional)
- Offer/Promotion
  - id, name, type (percentage|flat), scope (product|cart), discount_value, valid_from, valid_to, status, applicable_product_ids[]
- Cart
  - id, user_id (nullable for guest), items[{product_id, qty, unit_price, discount}], totals{subtotal, discount, tax, shipping, grand_total}, updated_at
- Order
  - id, user_id (nullable for guest), order_number, items[{product_id, name, qty, unit_price, discount}], totals, shipping_address, contact_email, status, payment_ref, created_at
- User
  - id, email, password_hash, name, addresses[], role, created_at, last_login
- Audit/History (optional for MVP)
  - id, entity_type, entity_id, action, actor_id, timestamp, notes

## 5. Integrations
- Payment Gateway: Third-party provider (to be selected; e.g., Stripe/PayPal/Razorpay), with webhook support for payment status.
- Email Service: SMTP or transactional email service (e.g., SendGrid/Mailgun).
- Analytics: Google Analytics or similar.

## 6. Acceptance Criteria (Samples)

### 6.1 Catalog & Offers
- AC-1: Given active products, when a user visits the catalog, then products are displayed with name, price, and availability.
- AC-2: Given an active discount, when a user views a discounted product, then both original and discounted prices are visible.

### 6.2 Cart & Checkout
- AC-3: Given items in cart, when a user updates quantity, then totals update immediately and stock validation occurs.
- AC-4: Given valid shipping and payment details, when a user places an order, then the order is created, payment is authorized, and a confirmation is sent.

### 6.3 Orders
- AC-5: Given an existing order, when an admin updates status to Shipped, then the customer can see the updated status and receives a notification (if enabled).
- AC-6: Given a guest order and order ID + email, when the user checks status, then the current status is shown.

### 6.4 Admin
- AC-7: Given admin credentials, when logged in, then the admin can create/update products and offers and view orders.

## 7. Prioritization (MoSCoW)
- Must Have: Catalog browsing, product CRUD, cart, checkout with payment gateway, order creation and status updates, admin access, basic offers display, responsive UI, minimal analytics.
- Should Have: Search and category filtering, email notifications, order history for users, offer management UI, basic error monitoring.
- Could Have: CSV product import, more granular filters, discount stacking rules, order status notification emails.
- Won’t Have (MVP): AI recommendations, loyalty, supplier stock sync, logistics/marketing integrations, subscriptions.

## 8. Risks & Mitigations
- Risk: Payment gateway delays in onboarding. Mitigation: Sandbox integration early; client to expedite merchant setup.
- Risk: Product data quality issues. Mitigation: Provide templates and validation rules; phased data import.
- Risk: Scope creep. Mitigation: Strict adherence to MVP scope and change control.
- Risk: Performance under load. Mitigation: Basic caching and load testing in staging.

## 9. Open Questions
- Which payment gateway and countries/currencies for MVP?
- Tax and shipping rules specifics?
- Return/refund policy workflow required in MVP?
- Email sender domain and templates?
- Any legal pages or compliance text required (Terms, Privacy, Refund Policy)?
