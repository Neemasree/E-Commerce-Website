import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateQuantity(productId, newQuantity);
    setIsUpdating(prev => ({ ...prev, [productId]: false }));
  };

  const handleRemoveItem = async (productId) => {
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeFromCart(productId);
    setIsUpdating(prev => ({ ...prev, [productId]: false }));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const deliveryFee = total >= 500 ? 0 : 50;
  const finalTotal = total + deliveryFee;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="items-count">{cartItems.length} items in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className={`cart-item ${isUpdating[item._id] ? 'updating' : ''}`}>
                <div className="item-image">
                  <img 
                    src={item.image || '/api/placeholder/100/100'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="12">${item.name}</text></svg>`;
                    }}
                  />
                </div>

                <div className="item-details">
                  <Link to={`/product/${item._id}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-category">{item.category}</p>
                  
                  <div className="item-pricing">
                    {item.offerPrice ? (
                      <>
                        <span className="offer-price">₹{item.offerPrice}</span>
                        <span className="original-price">₹{item.price}</span>
                      </>
                    ) : (
                      <span className="price">₹{item.price}</span>
                    )}
                  </div>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1 || isUpdating[item._id]}
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {isUpdating[item._id] ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={isUpdating[item._id]}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ₹{((item.offerPrice || item.price) * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => handleRemoveItem(item._id)}
                    className="remove-btn"
                    disabled={isUpdating[item._id]}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'free' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              
              {total < 500 && (
                <div className="delivery-notice">
                  <span className="notice-icon">💡</span>
                  Add ₹{(500 - total).toFixed(2)} more for free delivery!
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary checkout-btn"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>📱</span>
                  <span>💰</span>
                </div>
              </div>
            </div>

            <div className="continue-shopping">
              <Link to="/products" className="btn btn-outline">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .items-count {
          color: #666;
          font-size: 1.1rem;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .empty-cart-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-cart h2 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-cart p {
          color: #666;
          margin-bottom: 2rem;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .cart-items {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 1.5rem;
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          position: relative;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item.updating {
          opacity: 0.7;
        }

        .cart-item:hover {
          background: #f8f9fa;
        }

        .item-image {
          border-radius: 8px;
          overflow: hidden;
        }

        .item-image img {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .item-name:hover {
          color: #667eea;
        }

        .item-category {
          color: #666;
          font-size: 0.9rem;
          text-transform: capitalize;
        }

        .item-pricing {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .offer-price {
          font-size: 1.1rem;
          font-weight: bold;
          color: #27ae60;
        }

        .original-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
        }

        .price {
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
        }

        .item-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-btn {
          background: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #f8f9fa;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          padding: 8px 16px;
          font-weight: bold;
          background: #f8f9fa;
          border-left: 1px solid #e1e5e9;
          border-right: 1px solid #e1e5e9;
          min-width: 50px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .item-total {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }

        .remove-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .remove-btn:hover:not(:disabled) {
          background: #ffe6e6;
          transform: scale(1.1);
        }

        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-summary {
          position: sticky;
          top: 100px;
        }

        .summary-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          padding: 2rem;
          margin-bottom: 1rem;
        }

        .summary-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: #666;
        }

        .summary-row.total {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }

        .summary-row .free {
          color: #27ae60;
          font-weight: bold;
        }

        .delivery-notice {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .notice-icon {
          font-size: 1.2rem;
        }

        .summary-divider {
          height: 1px;
          background: #e1e5e9;
          margin: 1.5rem 0;
        }

        .checkout-btn {
          width: 100%;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .payment-methods {
          text-align: center;
        }

        .payment-methods p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 1.5rem;
        }

        .continue-shopping .btn {
          width: 100%;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 1rem;
          }

          .item-image img {
            width: 80px;
            height: 80px;
          }

          .item-controls {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 1rem;
          }

          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }

          .cart-item {
            padding: 1rem;
          }

          .summary-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;