# Freshmart — Verified Feature Inventory

Freshmart is a React, Express, and MongoDB grocery storefront. This document separates implemented functionality from external integrations and manual verification.

## Customer experience
- Responsive homepage with featured categories and product discovery.
- Product catalog search across name, category, and description.
- Category filtering and sorting by effective promotional price.
- Product details with current price, offer price, and stock.
- Shopping cart with quantity controls, stock limits, and local persistence.
- Authenticated checkout with delivery details and validation.
- Cash on Delivery checkout; online payment is not connected.
- Customer order history, progress timeline, pending-order cancellation, and reorder.

## Accounts and administration
- Customer registration/login, email validation, bcrypt password hashing, and 12-hour JWTs.
- Admin-only product create, update, and delete operations.
- Admin order listing and guarded status transitions: pending → confirmed → shipped → delivered.
- No default/demo admin account is created. Admin provisioning requires explicit environment variables.

## Data integrity and backend
- Express REST API, Mongoose models, product payload allowlisting, and validation.
- Server-authoritative checkout prices; client totals are not trusted.
- MongoDB transactions for order creation, stock decrement, cancellation, and stock restoration.
- Atomic inventory recheck during checkout.
- Customer order ownership checks and order snapshots for historical display.
- CORS allowlist, bounded JSON body, baseline security headers, no-store API responses, and database readiness endpoint.
- Explicit catalog seeding; no automatic startup demo data.

## Automated verification
- Backend JavaScript syntax checks and Node test suite.
- MongoDB 7 replica-set integration tests for auth, product CRUD, checkout, inventory, order ownership, cancellation, and admin fulfillment.
- Frontend ESLint and production build.
- Dependency audit reporting; CI blocks high and critical advisories.

A green CI run verifies the automated suite, not a live production deployment or every browser interaction.

## Not implemented / external setup required
- Razorpay, Stripe, UPI/card processing, refunds, and payment webhooks.
- Email/SMS notifications, wishlist, coupon engine, product reviews/ratings, multiple saved addresses, and delivery slots.
- Carrier/shipping-provider integration.
- Verified production deployment and complete deployed browser testing.
- Distributed rate limiting and centralized monitoring for multi-instance production.

## Portfolio positioning
The strongest demonstrable engineering points are role-based authorization, server-authoritative pricing, transaction-backed inventory, customer order isolation, admin fulfillment transitions, automated MongoDB integration tests, and deployment configuration. Describe this as a portfolio-ready full-stack application; do not claim online payments or verified production operation.
