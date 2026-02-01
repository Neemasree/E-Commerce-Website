# 🚀 FreshMart Groceries - Complete Setup Guide

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB installed and running - [Download](https://www.mongodb.com/try/download/community)
- ✅ Git (optional) - [Download](https://git-scm.com/)

## 📦 Step 1: Install Backend Dependencies

Open Command Prompt or PowerShell and run:

```bash
cd E-Commerce_Groceries\backend
npm install
```

**Expected packages:**
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken

## 📦 Step 2: Install Frontend Dependencies

```bash
cd ..\frontend
npm install
```

**Expected packages:**
- react
- react-dom
- react-router-dom
- axios
- vite

## 🗄️ Step 3: Start MongoDB

**Windows:**
```bash
# Open new terminal and run:
mongod
```

**Or use MongoDB Compass** (GUI tool)

## 🌱 Step 4: Seed the Database

```bash
cd ..\backend
npm run seed
```

**Expected output:**
```
Connected to MongoDB
Cleared existing products
Seeded database with sample products
```

## 🎯 Step 5: Start Backend Server

**Keep this terminal open:**
```bash
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB Connected
```

## 🎨 Step 6: Start Frontend Server

**Open NEW terminal:**
```bash
cd E-Commerce_Groceries\frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 🌐 Step 7: Open Browser

Navigate to: **http://localhost:5173**

## 🔐 Test Login

Use demo credentials:
- **Email:** demo@freshmart.com
- **Password:** demo123

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
1. Make sure MongoDB is running
2. Check `.env` file in backend folder
3. Verify MONGO_URI: `mongodb://localhost:27017/grocery_db`

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000 (Backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Issue: Module Not Found
**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rmdir /s node_modules
npm install

cd ..\frontend
rmdir /s node_modules
npm install
```

### Issue: CORS Error
**Solution:**
- Backend must be running on port 5000
- Frontend must be running on port 5173
- Check `backend/server.js` has `app.use(cors())`

---

## 📁 Project Structure

```
E-Commerce_Groceries/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── .env            # Environment variables
│   ├── server.js       # Main server file
│   ├── seed.js         # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # State management
│   │   ├── services/   # API calls
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   └── package.json
└── README.md
```

---

## ✨ Features Working

✅ User Registration & Login
✅ Product Listing with Images
✅ Search & Filter Products
✅ Add to Cart
✅ Update Cart Quantities
✅ Remove from Cart
✅ Checkout Process
✅ Order History
✅ Mobile Responsive Design
✅ BigBasket-inspired UI

---

## 🎯 Quick Test Checklist

1. ✅ Homepage loads with sliding banners
2. ✅ Products page shows all items
3. ✅ Click product to see details
4. ✅ Add product to cart
5. ✅ View cart and update quantities
6. ✅ Login with demo credentials
7. ✅ Complete checkout
8. ✅ View orders page

---

## 📞 Need Help?

If you encounter any issues:
1. Check all terminals are running
2. Verify MongoDB is active
3. Clear browser cache
4. Restart both servers

---

**Happy Shopping! 🛒✨**
