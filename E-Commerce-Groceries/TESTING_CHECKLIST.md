# ✅ FreshMart Groceries - Testing Checklist

## 🏠 Homepage Tests

- [ ] Page loads without errors
- [ ] Hero slider auto-rotates (3 slides)
- [ ] Category cards display correctly
- [ ] Featured products grid shows 8 products
- [ ] All images load properly
- [ ] "Shop Now" button navigates to products page
- [ ] Features section displays at bottom
- [ ] Mobile responsive (test on small screen)

## 🛍️ Products Page Tests

- [ ] All products display in grid
- [ ] Search bar works (try "tomato")
- [ ] Category filter works (select "vegetables")
- [ ] Sort by price works (low to high, high to low)
- [ ] Product cards show:
  - [ ] Product image
  - [ ] Product name
  - [ ] Price and offer price
  - [ ] Discount badge (if applicable)
  - [ ] "Add to Basket" button
- [ ] Click product card navigates to details
- [ ] "Add to Basket" button adds to cart
- [ ] Loading spinner shows when adding

## 📦 Product Details Page Tests

- [ ] Product details load correctly
- [ ] Main image displays
- [ ] Product name and description show
- [ ] Price and offer price display
- [ ] Discount percentage shows
- [ ] Quantity controls work (+/-)
- [ ] "Add to Cart" button works
- [ ] "Buy Now" button present
- [ ] Product features display
- [ ] Breadcrumb navigation works
- [ ] Back button returns to previous page

## 🛒 Cart Page Tests

- [ ] Cart displays all added items
- [ ] Item images show correctly
- [ ] Quantity can be increased
- [ ] Quantity can be decreased
- [ ] Remove button deletes item
- [ ] Cart total calculates correctly
- [ ] Delivery fee shows (₹50 or FREE)
- [ ] "Proceed to Checkout" button works
- [ ] "Continue Shopping" link works
- [ ] Empty cart shows appropriate message

## 🔐 Login/Register Tests

- [ ] Login form displays
- [ ] Register form displays (toggle)
- [ ] Email validation works
- [ ] Password field is secure (hidden)
- [ ] Demo credentials work:
  - Email: demo@freshmart.com
  - Password: demo123
- [ ] Error messages show for invalid login
- [ ] Successful login redirects to homepage
- [ ] User name shows in navbar after login
- [ ] Logout button works

## 💳 Checkout Page Tests

- [ ] Checkout page loads
- [ ] Order summary shows all items
- [ ] Delivery form displays
- [ ] All form fields validate:
  - [ ] Full name required
  - [ ] Email format validated
  - [ ] Phone number (10 digits)
  - [ ] Address required
  - [ ] City required
  - [ ] Pincode (6 digits)
- [ ] Payment method selection works
- [ ] "Place Order" button works
- [ ] Order confirmation shows
- [ ] Redirects to orders page

## 📋 Orders Page Tests

- [ ] Orders page displays
- [ ] Order history shows
- [ ] Order details display:
  - [ ] Order number
  - [ ] Order date
  - [ ] Items list
  - [ ] Delivery address
  - [ ] Total amount
  - [ ] Order status
- [ ] "Track Order" button present
- [ ] "Reorder" button present
- [ ] Empty orders shows message

## 📱 Mobile Responsive Tests

Test on mobile view (< 768px):
- [ ] Navbar collapses to hamburger menu
- [ ] Mobile menu opens/closes
- [ ] Product grid adjusts to single column
- [ ] Cart layout stacks vertically
- [ ] Checkout form stacks vertically
- [ ] All buttons are touch-friendly
- [ ] Text is readable
- [ ] Images scale properly

## 🎨 UI/UX Tests

- [ ] Green theme (#84c225) consistent
- [ ] Hover effects work on cards
- [ ] Buttons have hover states
- [ ] Loading spinners show during async operations
- [ ] Smooth transitions and animations
- [ ] No layout shifts
- [ ] Footer displays correctly
- [ ] All links work

## 🔧 Technical Tests

- [ ] No console errors
- [ ] API calls succeed (check Network tab)
- [ ] Cart persists on page refresh (localStorage)
- [ ] Authentication token stored
- [ ] Images load from CDN
- [ ] Page load time < 3 seconds
- [ ] No memory leaks

## 🐛 Common Issues to Check

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Database is seeded with products
- [ ] CORS is enabled
- [ ] Environment variables are set
- [ ] All dependencies installed

---

## 📊 Test Results

**Date:** ___________
**Tester:** ___________

**Passed:** ___ / 100
**Failed:** ___ / 100

**Notes:**
_________________________________
_________________________________
_________________________________

---

## ✅ Sign Off

- [ ] All critical features working
- [ ] No blocking bugs
- [ ] Mobile responsive
- [ ] Ready for demo/deployment

**Approved by:** ___________
**Date:** ___________
