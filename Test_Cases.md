# Test Cases (MVP Scope)

This suite aligns with the current implementation in the repo and the simplified MVP scope (no admin portal, no payments/checkout form, no emails, no registration). It covers storefront catalog discovery, offers, cart totals with client-side coupons, authentication, and orders.

## 0. Conventions
- ENV: Dev
- FE: http://localhost:5173
- BE: http://localhost:4000
- Accounts: `user/user123` (customer), `admin/admin123` (admin role seeded, but no admin features exposed)
- Data: DB is auto-seeded on first run.

---

## A. Authentication

- TC-A1 Login success (user)
  - Steps: Open `/login` → Enter `user/user123` → Login
  - Expected: Redirect to `/`, token stored in localStorage, username shown in header.

- TC-A2 Login failure (bad password)
  - Steps: `/login` → `user/wrong` → Login
  - Expected: Error message "Invalid credentials", no token stored.

- TC-A3 Logout
  - Steps: From any protected page → Click `Logout`
  - Expected: Token cleared, redirect to `/login`.

- TC-A4 API auth guard
  - Steps: Call `GET /orders` without `Authorization`
  - Expected: 401 Missing/Invalid token.

---

## B. Product Catalog

- TC-B1 List products
  - Steps: Load `/` (Products) → Observe grid
  - Expected: Seeded products shown with name, description, price.

- TC-B2 Search by keyword
  - Steps: Enter `headphones` → Search
  - Expected: Only relevant items remain; empty grid if no matches.

- TC-B3 Get product by ID (API)
  - Steps: `GET /products/1`
  - Expected: 200 with product JSON (id=1 if exists) or 404 if not found.

- TC-B4 Filtering by tags and category (API)
  - Steps: `GET /products?q=smart&tags=home` and `GET /products?category=Electronics`
  - Expected: Results constrained accordingly; no error.

- TC-B5 UI filter by category and tags
  - Steps: On Products page → choose a category from the dropdown → enter `home, smart` in Tags → Click Apply
  - Expected: Grid updates to only show products matching the selected category and containing all provided tags.

---

## C. Offers

- TC-C1 List active offers
  - Steps: Go to `Offers` page
  - Expected: At least one seeded active offer displayed.

- TC-C2 Offers API read-only
  - Steps: Attempt `POST /offers`
  - Expected: 404/Not Found or 405 (no route). Current code only exposes `GET /offers`.

---

## D. Cart & Totals (Client-side)

- TC-D1 Add to cart
  - Steps: On Products → Click `Add to Cart` for an item
  - Expected: Cart lists the item with qty=1; total updates.

- TC-D2 Update quantities
  - Steps: In cart → `+` then `-`
  - Expected: Qty adjusts and never goes below 1; totals recalc.

- TC-D3 Remove item
  - Steps: Click `Remove`
  - Expected: Item removed; totals recalc.

- TC-D4 Apply coupon SAVE10
  - Steps: Enter `SAVE10` → Apply
  - Expected: Discount = 10% of subtotal, shipping per rules, totals reflect.

- TC-D5 Apply coupon SAVE20
  - Steps: Enter `SAVE20` → Apply
  - Expected: Discount = 20% of subtotal; totals reflect.

- TC-D6 Apply coupon FREESHIP
  - Steps: Enter `FREESHIP` → Apply
  - Expected: Shipping = $0; totals reflect.

- TC-D7 Auto free shipping threshold
  - Steps: Add items so after-discount >= $100
  - Expected: Shipping = $0

- TC-D8 Tax calculation
  - Steps: Any non-empty cart
  - Expected: Tax = 8% of post-discount amount.

- TC-D9 Invalid coupon
  - Steps: Enter `INVALID` → Apply
  - Expected: No discount/free ship applied

---

## E. Orders

- TC-E1 Create order (happy path)
  - Pre: Logged in as `user`
  - Steps: Add 1+ items → Place Order
  - Expected: Success message with `Order #<id> placed!` and cart clears.

- TC-E2 List my orders
  - Pre: At least one prior order
  - Steps: Go to `Orders` page
  - Expected: Order list shows created orders, with status (default `pending`) and timestamp.

- TC-E3 Get my order by ID (API)
  - Steps: `GET /orders/{id}` with Authorization token for owner
  - Expected: 200 with order JSON

- TC-E4 Authorization on orders
  - Steps: `GET /orders/{id}` with a different user or no token
  - Expected: 403 (different user) or 401 (no token)

---

## F. API Contract Smokes

- TC-F1 Health
  - Steps: `GET /`
  - Expected: `{ status: 'ok', service: 'ai-store-backend' }`

- TC-F2 CORS
  - Steps: Calls from FE to BE in dev
  - Expected: No CORS errors in console.

---

## G. Security Smoke (Dev)

- TC-G1 Password hashing present
  - Steps: Inspect DB or code for bcrypt usage
  - Expected: `users.password_hash` is hashed; login uses bcrypt compare.

- TC-G2 JWT secret configurable
  - Steps: Set `BACKEND_JWT_SECRET` and restart
  - Expected: Tokens issued with new secret; old tokens invalid.

- TC-G3 SQL injection basic
  - Steps: Try `q=' OR 1=1 --` in `/products`
  - Expected: Parameterized queries prevent leakage; results behave normally.

---

## H. Performance & Accessibility Smokes (Dev)

- TC-H1 Page load
  - Steps: Load Products page on fresh start
  - Expected: <3s on dev machine; no severe console errors.

- TC-H2 API latency
  - Steps: `/products` and `/offers` response
  - Expected: <300ms typical on local.

- TC-H3 Accessibility quick pass
  - Steps: Keyboard tab through login and products; check labels/contrast
  - Expected: Usable via keyboard; text contrast readable; inputs labeled.

---

## I. Out-of-Scope (Do Not Test Now)
- Admin CRUD for products/offers/orders
- Payments/checkout forms and emails
- Order status lifecycle automation
- Registration and saved addresses

---

## J. Traceability (MVP mapping)
- FR-1.4: Covered by B1–B4
- FR-2.2: Covered by C1
- FR-2.3 (basic): Covered by D4–D9 (client-side only)
- FR-3.1–3.3: Covered by D1–D9
- FR-4.2: Covered by E2
- FR (orders create): Covered by E1, E3, E4
- NFR smokes: F1–F2, G1–G3, H1–H3
