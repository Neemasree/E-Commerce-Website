# Freshmart — Remaining Work

## Required before a public production launch
- [ ] Configure MongoDB Atlas or another replica-set deployment and verify transaction support.
- [ ] Deploy API and frontend; verify the deployed API health endpoint reports a connected database.
- [ ] Provision a unique administrator using the environment-based script.
- [ ] Complete a browser journey on the deployed site: register → login → browse → cart → COD checkout → order history → cancel; then test admin product and order workflows.
- [ ] Review and remediate remaining moderate dependency advisories, especially development-tool dependencies.
- [ ] Add distributed rate limiting to authentication endpoints before exposing the API publicly.
- [ ] Add browser end-to-end tests and accessibility checks.

## Optional extensions
- [ ] Payment-provider integration with server-side order creation, signature verification, webhooks, and refunds.
- [ ] Email/SMS order notifications.
- [ ] Wishlist, coupons, customer reviews/ratings, delivery slots, and multiple saved addresses.
- [ ] Centralized logs, uptime monitoring, and error reporting.

## Completed
- [x] Registration/login validation, password hashing, JWT auth, and admin authorization.
- [x] Admin-only product CRUD and guarded fulfillment transitions.
- [x] Server-authoritative pricing and transaction-backed stock/order writes.
- [x] Pending-order cancellation with transactional inventory restoration.
- [x] Customer order ownership checks and order snapshots.
- [x] MongoDB replica-set integration suite in CI.
- [x] Frontend lint and production build in CI.
- [x] Environment templates, Render blueprint, and setup documentation.
- [x] Removed obsolete utilities containing hard-coded admin credentials.
- [x] Fixed catalog sorting to use promotional prices and zero-price offer handling.

All changes are committed directly to main. Do not create branches unless the repository owner changes this requirement.
