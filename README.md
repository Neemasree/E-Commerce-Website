# 🛒 Freshmart - E-Commerce Platform

A full-stack, modern e-commerce platform for grocery shopping with an intuitive user interface, robust backend, and seamless shopping experience.

## ✨ Key Features

### Customer Features
- **Homepage** - Hero section with auto-sliding banners and featured categories
- **Product Catalog** - Browse 185+ products with filtering and sorting capabilities
- **Advanced Search** - Search by product name across all categories
- **Smart Categories** - Filter products by Vegetables, Dairy, Fruits, Beverages, and Grains
- **Shopping Cart** - Add/remove items, adjust quantities, with persistent storage
- **Checkout** - Complete address form with validation and multiple payment options
- **Order Management** - View order history and reorder functionality
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- **Real-time Stock Updates** - Accurate inventory management
- **Price Calculations** - Automatic total with dynamic delivery fees (Free above ₹500)
- **Discount Badges** - Visual indicators for promotional products
- **Smooth Animations** - Enhanced UX with CSS transitions and animations
- **Secure Payments** - Support for COD, Card, and UPI payments
- **Data Persistence** - MongoDB backend for reliable data storage

## 🏗️ Project Structure

```
E-Commerce-Website/
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Node.js + Express backend server
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── package.json
├── .gitignore
├── package.json             # Root-level dependencies
├── README.md                # This file
├── FEATURES.md              # Detailed feature list
├── SETUP_GUIDE.md           # Installation instructions
├── FINAL_SETUP.md           # Final configuration guide
├── START.bat                # Quick start script for Windows
└── OTHER_DOCS.md            # Additional documentation
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React, Vite, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Security** | bcryptjs |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM |

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
Simply run the batch file:
```bash
START.bat
```

### Option 2: Manual Setup

**1. Install Backend Dependencies**
```bash
cd backend
npm install
```

**2. Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

**3. Start MongoDB**
```bash
mongod
```
Or use MongoDB Compass (GUI tool)

**4. Configure Environment Variables**

Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://127.0.0.1:27017/grocery_db
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

**5. Start the Backend Server**
```bash
cd backend
npm start
```

**6. Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`. The backend starts on the port configured in `backend/.env`.

## 📖 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run backend tests
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm test           # Run frontend tests
```

## 🧪 Testing

Refer to [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive testing guidelines and procedures.

## 📚 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature list for customers and admins
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation and configuration guide
- **[FINAL_SETUP.md](FINAL_SETUP.md)** - Final setup and deployment instructions
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Testing procedures and checklist
- **[TODO.md](TODO.md)** - Future enhancements and roadmap

## 🔐 Security Features

- Password encryption using bcryptjs
- JWT-based authentication and authorization
- Secure API endpoints with token validation
- Input validation and sanitization
- CORS protection
- Secure session management

## 📦 Database Schema

The application uses MongoDB with the following main collections:
- **Users** - Customer accounts and profiles
- **Products** - Product catalog with pricing and inventory
- **Orders** - Order history and tracking
- **Categories** - Product categories

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit them (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Neema Sree** - [GitHub Profile](https://github.com/Neemasree)

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (`mongod`)
- Check connection string in `.env`
- Verify MongoDB is listening on port 27017

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Specify port with `npm run dev -- --port 3000`

### CORS Errors
- Verify backend URL in frontend API configuration
- Check CORS settings in Express backend

### Module Not Found
- Delete `node_modules` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 💡 Tips & Best Practices

1. **Development**: Use `npm run dev` for hot-reload capabilities
2. **Testing**: Run tests before pushing code
3. **Database**: Keep backups of important data
4. **Security**: Never commit `.env` files to version control
5. **Performance**: Monitor bundle size and optimize images

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the maintainer directly
- Check existing issues for solutions

---

**Happy Shopping! 🎉** — Freshmart is a learning project; verify production readiness and payment-provider integration before real-world use.
