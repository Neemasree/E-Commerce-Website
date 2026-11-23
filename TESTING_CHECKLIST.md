# Freshmart — Manual Acceptance Checklist

Use this checklist against a running local or deployed environment. Record the URL, date, browser, and results before claiming manual acceptance.

## Environment
- [ ] Backend starts with a valid MongoDB connection.
- [ ] GET /health returns HTTP 200 and database=connected.
- [ ] Frontend loads and API requests use the configured backend URL.
- [ ] Browser console and network panel show no unexpected errors.

## Customer journey
- [ ] Register a customer with a valid email and password.
- [ ] Invalid email, short password, and duplicate email are rejected.
- [ ] Log in and log out.
- [ ] Browse products and open product details.
- [ ] Search by product name, category, and description.
- [ ] Filter by category and sort by effective price in both directions.
- [ ] Add products to cart; refresh and verify persistence.
- [ ] Change quantities within stock limits and remove items.
- [ ] Attempt checkout while signed out; login is required.
- [ ] Submit invalid delivery details and verify inline errors.
- [ ] Place a COD order and verify server-calculated total and stock change.
- [ ] Verify the order appears only in the customer's order history.
- [ ] Track the order status.
- [ ] Cancel a pending order and verify stock restoration.
- [ ] Reorder and verify quantities respect current stock.

## Admin journey
- [ ] Provision an admin using the environment-based script.
- [ ] Log in as admin.
- [ ] Verify a customer cannot access admin pages or admin APIs.
- [ ] Create, edit, and delete products.
- [ ] Verify invalid offer prices and stock values are rejected.
- [ ] View all orders and expand order details.
- [ ] Advance an order through confirmed, shipped, and delivered.
- [ ] Verify invalid/backward transitions are rejected.

## Security and resilience
- [ ] Untrusted browser origins are rejected by CORS.
- [ ] Malformed JSON receives a controlled 400 response.
- [ ] Oversized JSON receives a controlled 413 response.
- [ ] Invalid product/order IDs receive controlled 400 responses.
- [ ] A customer cannot read or cancel another customer's order.
- [ ] A customer cannot mutate products or update fulfillment status.
- [ ] Insufficient stock does not create an order or decrement inventory.
- [ ] A second cancellation does not restore stock twice.
- [ ] No password, JWT, or password hash appears in browser responses or logs.

## Responsive and accessibility
- [ ] Navigation works on narrow mobile screens.
- [ ] Catalog, product details, cart, and checkout fit mobile widths.
- [ ] Forms have usable labels and keyboard focus.
- [ ] Checkout can be submitted using the keyboard.
- [ ] Buttons show clear disabled/loading states.
- [ ] Empty, loading, error, and success states are understandable.

## Automated checks
- [ ] GitHub Actions backend job passes, including MongoDB integration.
- [ ] Frontend lint passes.
- [ ] Frontend production build passes.
- [ ] Dependency audit output is reviewed; remaining moderate findings are documented.

## Result record
Environment/URL:
Date:
Browser/device:
Passed:
Failed:
Blockers:
Tester:
