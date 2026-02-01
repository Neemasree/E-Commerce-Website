import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🛒</span>
            FreshCart
          </Link>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            {user && (
              <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Orders
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛒</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            {user ? (
              <div className="user-menu">
                <span className="user-name">Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
          padding: 0;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--light-green);
          text-decoration: none;
        }

        .brand-icon {
          font-size: 1.8rem;
          margin-right: 0.5rem;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--light-green);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.15);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-link {
          position: relative;
          color: var(--light-green);
          font-size: 1.5rem;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .cart-link:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          color: white;
          font-weight: 500;
        }

        .btn-outline {
          background: white;
          color: var(--primary-green);
          border: none;
          padding: 8px 16px;
          font-size: 0.9rem;
        }

        .btn-outline:hover {
          background: #f0f0f0;
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-menu-btn span {
          width: 25px;
          height: 3px;
          background: white;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .navbar-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #84c225;
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .navbar-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #007bff;
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .navbar-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .navbar-actions {
            gap: 0.5rem;
          }

          .user-name {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .navbar-brand {
            font-size: 1.2rem;
          }

          .brand-icon {
            font-size: 1.5rem;
          }

          .cart-link {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
