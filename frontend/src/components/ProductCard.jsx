import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, getItemQuantity } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);

  const getImageUrl = (imageUrl) =>
    imageUrl || "https://placehold.co/400x400/e8e8e8/666?text=No+Image";

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addToCart(product);
    setIsAdding(false);
  };

  const quantityInCart = getItemQuantity(product._id);
  const maxInCart = Number.isInteger(product.stock) && quantityInCart >= product.stock;

  const discountPercentage = product.offerPrice
    ? Math.round(
        ((product.price - product.offerPrice) / product.price) * 100
      )
    : 0;

  return (
    <>
      <div className="product-card">
        <Link to={`/product/${product._id}`} className="product-link">
          {discountPercentage > 0 && (
            <div className="discount-badge">{discountPercentage}% OFF</div>
          )}

          <div className="product-image-container">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="product-image"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/400x400/e8e8e8/666?text=No+Image")
              }
            />
          </div>

          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-weight">Stock: {product.stock}</p>

            <div className="product-pricing">
              <span className="offer-price">
                ₹{product.offerPrice || product.price}
              </span>
              {product.offerPrice && (
                <span className="original-price">₹{product.price}</span>
              )}
            </div>
          </div>
        </Link>

        <button
          className={`add-btn ${
            product.stock <= 0 ? "out-of-stock" : ""
          } ${isAdding ? "loading" : ""}`}
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0 || maxInCart}
        >
          {product.stock <= 0
            ? "Out of Stock"
            : maxInCart
            ? "Stock Limit Reached"
            : isAdding
            ? "Adding..."
            : "Add to Basket"}
        </button>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #84c225;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .discount-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 1;
        }

        .product-image-container {
          padding: 16px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-info {
          padding: 0 12px 12px;
          flex: 1;
        }

        .product-name {
          font-size: 0.875rem;
          color: #333;
          margin-bottom: 4px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 36px;
        }

        .product-weight {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 8px;
        }

        .product-pricing {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .offer-price {
          font-size: 1rem;
          font-weight: 700;
        }

        .original-price {
          font-size: 0.8rem;
          color: #999;
          text-decoration: line-through;
        }

        .add-btn {
          margin: 0 12px 12px;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #84c225;
          background: white;
          color: #84c225;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-btn:hover:not(:disabled) {
          background: #84c225;
          color: white;
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .add-btn.out-of-stock {
          background: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        @media (max-width: 768px) {
          .product-image-container {
            height: 150px;
          }
        }
      `}</style>
    </>
  );
};

export default ProductCard;
