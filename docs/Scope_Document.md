# Scope Document

## 1. Project Overview
- Domain: E‑Commerce
- Project Name: Online Shopping Web Application (MVP)
- Summary: Build a web-based online shopping platform where customers can browse products, view offers and promotions, add items to a cart, and place orders via a simple and secure checkout. Admin users can manage products, offers, and orders from a backend. The solution should be designed for future scalability.

## 2. Objectives
- Provide a simple, intuitive storefront for browsing and purchasing products.
- Enable basic promotions and discounts to drive conversions.
- Offer a smooth checkout process with secure payment handling.
- Allow admins to manage products, stock, offers, and orders efficiently.
- Deliver an MVP that is scalable for future advanced features.

## 3. In-Scope (MVP)
- Product Catalog Management
  - Add, update, and view products with name, price, stock, images, and basic description.
  - Product listing, search, and simple filtering.
- Offers & Promotions
  - Display discounts, special deals, and basic promotional banners or tags.
  - Apply simple percentage or flat discounts at product or cart level (as defined).
- Shopping Cart & Checkout
  - Add/remove products to/from cart.
  - View cart totals (subtotal, discount, taxes/shipping as applicable).
  - Guest checkout or simple account creation; capture shipping and contact details.
  - Payment via a secure payment gateway (to be selected).
- Order Placement & Tracking
  - Order creation with unique order ID.
  - Order status tracking: Processing, Shipped, Delivered.
  - Basic order history for registered users.
- Admin/Back-Office
  - Manage products (CRUD), stock updates.
  - Manage offers and promotions (create, activate/deactivate).
  - View orders and update order status.
- Platform & UX
  - Responsive web UI (desktop and mobile).
  - Accessibility-conscious design (basic WCAG considerations).
  - Basic analytics readiness (page views, conversion funnel via GA or similar).

## 4. Out of Scope (Future Roadmap)
- AI-driven product recommendations.
- Personalized offers & loyalty programs.
- Real-time stock updates from suppliers.
- Integration with logistics/marketing platforms.
- Subscription-based premium features.
- Advanced CMS, multi-warehouse, multi-currency, or marketplace features.
- Native mobile apps.

## 5. Assumptions
- Single region/site, single currency and language for MVP.
- Standard tax and shipping rules (simple flat-rate or table-based; no complex compliance engines).
- A third-party payment gateway will be used; merchant account availability is the client’s responsibility.
- Product data and images will be provided by the client.
- Hosting environment and domain will be provided or approved by the client.
- Email notifications will use a standard SMTP or transactional email service (e.g., SendGrid), configured by or with the client’s credentials.

## 6. Constraints
- Timeboxed MVP delivery timeline (to be defined jointly).
- Budget aligned with MVP scope only.
- Compliance: Basic PCI-DSS compliance by outsourcing card handling to a compliant gateway; the app will not store raw card data.
- Performance constraints appropriate for MVP traffic volumes.

## 7. Deliverables
- Web application (front-end + backend) meeting MVP scope.
- Admin backend for product, offer, and order management.
- Basic documentation: admin guide, deployment/runbook, and environment configuration notes.
- Test plan and test cases for MVP features.
- Initial seed data templates (CSV or admin UI) for products and offers.

## 8. Success Criteria
- Customers can browse, add to cart, and complete purchases without defects in the happy path.
- Admins can manage catalog, offers, and orders without technical support.
- Basic performance: product listing pages load in <2 seconds at typical MVP load.
- Conversion funnel is measurable via analytics.
- <1% payment failures attributable to the platform (excluding gateway-side issues).

## 9. High-Level Timeline (Tentative)
- Week 1–2: Discovery, design, architecture, setup.
- Week 3–5: Core development (catalog, cart, checkout, admin).
- Week 6: QA, UAT, fixes, go-live prep.
- Week 7: Launch and hypercare.

---

## MVP Alignment Addendum (2025-09-10)

To keep documentation consistent with the code in this repository, the MVP scope for this build is adjusted as follows:

- In-Scope (Implemented Now)
  - Storefront authentication: login/logout via JWT; seeded users.
  - Product catalog: read-only list and detail. Client can search and filter by `q`, `category`, and `tags`.
  - Offers: read-only list of active offers displayed to customers.
  - Cart & totals (client-side): subtotal, coupons (SAVE10, SAVE20, FREESHIP), 8% tax, shipping rules (free at ≥$100 or FREESHIP), grand total.
  - Orders: create order and view order history for the logged-in user.

- Out of Scope for This Cut (Deferred)
  - Admin portal and admin CRUD for products, offers, and orders.
  - Checkout forms (shipping/contact) and payment processing via gateway.
  - Emails/notifications (order confirmation, status updates).
  - Automated order status lifecycle and tracking.
  - Customer registration and saved addresses.

Deliverables reference: See `Test_Cases.md` and `Overall_Test_Strategy_and_Design.md` section "MVP Scope Alignment Addendum" for testing and quality alignment to this scope.
