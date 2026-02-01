import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Use proxy for external images to avoid CORS/ORB issues
  const getProxiedImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/400x400/e8e8e8/666?text=No+Image';
    if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    return `http://localhost:5000/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setIsAdding(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return (
      <div className="product-details">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="container">
          <div className="error">
            <h2>Product not found</h2>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://placehold.co/500x400/e8e8e8/666?text=No+Image'];

  return (
    <div className="product-details">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="product-content">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={getProxiedImageUrl(images[selectedImage])} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/500x400/e8e8e8/666?text=No+Image';
                }}
              />
              {discountPercentage > 0 && (
                <div className="discount-badge">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={getProxiedImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x80/e8e8e8/666?text=' + (index + 1);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="breadcrumb">
              <span>Products</span> / <span>{product.category}</span> / <span>{product.name}</span>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {'⭐'.repeat(5)}
              </div>
              <span className="rating-text">(4.5) • 127 reviews</span>
            </div>

            <div className="product-pricing">
              {product.offerPrice ? (
                <div className="pricing-with-offer">
                  <span className="offer-price">₹{product.offerPrice}</span>
                  <span className="original-price">₹{product.price}</span>
                  <span className="savings">You save ₹{product.price - product.offerPrice}</span>
                </div>
              ) : (
                <span className="price">₹{product.price}</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Fresh and high-quality product delivered straight from the farm to your doorstep. Perfect for your daily nutritional needs.'}</p>
            </div>

            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">🌱</span>
                <span>100% Organic</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">❄️</span>
                <span>Fresh & Cold</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Premium Quality</span>
              </div>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={decrementQuantity}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                className={`btn btn-primary add-to-cart ${isAdding ? 'loading' : ''}`}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="loading-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="cart-icon">🛒</span>
                    Add to Cart
                  </>
                )}
              </button>
              
              <button 
                className="btn btn-success buy-now"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product);
                  }
                  navigate('/checkout');
                }}
              >
                <span className="buy-icon">⚡</span>
                Buy Now
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="meta-item">
                <strong>Stock:</strong> {product.stock || 'In Stock'}
              </div>
              <div className="meta-item">
                <strong>SKU:</strong> {product._id.slice(-8).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast success">
          ✅ {quantity} x {product.name} added to cart!
        </div>
      )}

      <style jsx>{`
        .product-details {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .back-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 2rem;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          color: #764ba2;
          transform: translateX(-5px);
        }

        .product-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .product-images {
          position: sticky;
          top: 100px;
        }

        .main-image {
          position: relative;
          margin-bottom: 1rem;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .main-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .main-image:hover img {
          transform: scale(1.05);
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 8px 15px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .image-thumbnails {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .thumbnail:hover,
        .thumbnail.active {
          opacity: 1;
          border-color: #667eea;
          transform: scale(1.05);
        }

        .breadcrumb {
          color: #666;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .breadcrumb span:last-child {
          color: #333;
          font-weight: 600;
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .stars {
          color: #ffd700;
          font-size: 1.2rem;
        }

        .rating-text {
          color: #666;
        }

        .product-pricing {
          margin-bottom: 2rem;
        }

        .pricing-with-offer {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .offer-price {
          font-size: 2rem;
          font-weight: bold;
          color: #27ae60;
        }

        .original-price {
          font-size: 1.3rem;
          color: #999;
          text-decoration: line-through;
        }

        .price {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .savings {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .product-description {
          margin-bottom: 2rem;
        }

        .product-description h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .product-description p {
          color: #666;
          line-height: 1.6;
        }

        .product-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem;
          background: #f8f9fa;
          border-radius: 8px;
          font-weight: 500;
        }

        .feature-icon {
          font-size: 1.2rem;
        }

        .quantity-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .quantity-section label {
          font-weight: 600;
          color: #333;
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
          padding: 10px 15px;
          cursor: pointer;
          font-size: 1.2rem;
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
          padding: 10px 20px;
          font-weight: bold;
          background: #f8f9fa;
          border-left: 1px solid #e1e5e9;
          border-right: 1px solid #e1e5e9;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .add-to-cart {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 15px 30px;
          font-size: 1.1rem;
        }

        .buy-now {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 15px 30px;
          font-size: 1.1rem;
        }

        .add-to-cart.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .product-meta {
          border-top: 1px solid #e1e5e9;
          padding-top: 1.5rem;
        }

        .meta-item {
          margin-bottom: 0.5rem;
          color: #666;
        }

        .meta-item strong {
          color: #333;
        }

        .loading,
        .error {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading p {
          margin-top: 1rem;
          color: #666;
          font-size: 1.1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .product-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .product-images {
            position: static;
          }

          .product-title {
            font-size: 2rem;
          }

          .offer-price,
          .price {
            font-size: 1.5rem;
          }

          .product-features {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .add-to-cart,
          .buy-now {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .product-title {
            font-size: 1.5rem;
          }

          .main-image img {
            height: 300px;
          }

          .quantity-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;