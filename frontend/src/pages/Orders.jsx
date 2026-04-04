import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();
  const orderSuccess = location.state?.orderSuccess;

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch {
      setError("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- BUTTON HANDLERS ---------------- */

  const handleTrackOrder = (order) => {
    alert(`Order status: ${(order.status || "pending").toUpperCase()}`);
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const product = item.productId || item;
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        offerPrice: product.offerPrice,
        image: product.image,
      });
    });
    navigate("/cart");
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "PUT",
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch {
      alert("Failed to cancel order");
    }
  };

  /* ---------------- HELPERS ---------------- */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f39c12";
      case "confirmed":
        return "#3498db";
      case "shipped":
        return "#9b59b6";
      case "delivered":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <h3>{error}</h3>
          <button onClick={fetchOrders} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orderSuccess && (
          <div className="success-message">
            <span>✅</span>
            <div>
              <h3>Order placed successfully!</h3>
              <p>Thank you for shopping with us.</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {(order.status || "pending").toUpperCase()}
                  </span>
                </div>

                {/* ORDER ITEMS */}
                <div className="order-items">
                  {order.items.map((item, idx) => {
                    const product = item.productId || item;
                    return (
                      <div key={idx} className="order-item">
                        <img
                          src={
                            product.image ||
                            "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg"
                          }
                          alt={product.name}
                        />
                        <div>
                          <h4>{product.name}</h4>
                          <p>Qty: {item.quantity}</p>
                          <p>₹{product.price} each</p>
                        </div>
                        <strong>
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                {/* ACTIONS */}
                <div className="order-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => handleTrackOrder(order)}
                  >
                    Track Order
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={() => handleReorder(order)}
                  >
                    Reorder
                  </button>

                  {(order.status === "pending" || !order.status) && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- STYLES ---------------- */}
      <style jsx>{`
        .orders-page {
          min-height: calc(100vh - 140px);
          padding: 2rem 0 4rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .order-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
        }

        .status-badge {
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .order-items {
          padding: 1.5rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid #eee;
          padding: 1rem 0;
        }

        .order-item img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .order-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem;
        }

        @media (max-width: 768px) {
          .order-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;