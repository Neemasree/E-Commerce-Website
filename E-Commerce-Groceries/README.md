# 🛒 FreshMart Groceries - E-Commerce Platform

A modern, responsive e-commerce platform for grocery shopping built with React.js, Node.js, Express, and MongoDB.

## ✨ Features

### 🎨 Frontend Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: CSS animations and transitions for better UX
- **Product Showcase**: Beautiful product cards with hover effects
- **Advanced Search & Filtering**: Search by name, filter by category, sort by price
- **Shopping Cart**: Add/remove items, update quantities with smooth animations
- **User Authentication**: Login/Register with JWT tokens
- **Product Details**: Detailed product pages with image galleries
- **Checkout Process**: Complete checkout with address and payment options
- **Order Management**: View order history and track orders
- **Sliding Hero Section**: Auto-sliding hero banner on homepage

### 🔧 Backend Features
- **RESTful API**: Clean API endpoints for all operations
- **Authentication**: JWT-based user authentication
- **Database**: MongoDB with Mongoose ODM
- **Product Management**: CRUD operations for products
- **Order Processing**: Complete order management system
- **User Management**: User registration and profile management

### 📱 Mobile Responsive
- Fully responsive design
- Touch-friendly interface
- Mobile navigation menu
- Optimized for all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Commerce_Groceries
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Environment Variables**
   
   Create `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/grocery_db
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the Backend Server**
   ```bash
   npm run dev
   # or
   npm start
   ```

8. **Start the Frontend Development Server**
   ```bash
   cd ../frontend
   npm run dev
   ```

9. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
E-Commerce_Groceries/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   └── AdminAddProduct.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### 🏠 Homepage
- Auto-sliding hero section with 3 different slides
- Category showcase with hover effects
- Featured products grid
- Company features section

### 🛍️ Products Page
- Search functionality
- Category filtering
- Price sorting (low to high, high to low)
- Responsive product grid
- Loading states and animations

### 📦 Product Details
- Image gallery with thumbnails
- Quantity selector
- Add to cart with loading animation
- Product features and specifications
- Breadcrumb navigation

### 🛒 Shopping Cart
- Real-time quantity updates
- Remove items functionality
- Order summary with delivery calculations
- Persistent cart (localStorage)
- Smooth animations for all interactions

### 💳 Checkout
- Complete address form with validation
- Multiple payment options (COD, Card, UPI)
- Order summary
- Form validation with error messages

### 📋 Orders
- Order history with detailed information
- Order status tracking
- Delivery address display
- Reorder functionality

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- User session management

## 🎨 Design Features

### Animations & Transitions
- Smooth hover effects on all interactive elements
- Loading spinners for async operations
- Fade-in animations for page content
- Sliding animations for mobile menu
- Product card hover transformations

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons and controls
- Optimized images and content
- Collapsible navigation for mobile

### Color Scheme
- Primary: Linear gradients (#667eea to #764ba2)
- Success: Green tones (#27ae60)
- Warning: Orange/Red tones (#f39c12, #e74c3c)
- Neutral: Grays for text and backgrounds

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🛠️ Technologies Used

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling with animations
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables
3. Connect to MongoDB Atlas for production database

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Netlify, Vercel, or similar platforms
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@freshmart.com

## 🎉 Demo Credentials

For testing purposes:
- **Email**: demo@freshmart.com
- **Password**: demo123

---

**Happy Shopping! 🛒✨**