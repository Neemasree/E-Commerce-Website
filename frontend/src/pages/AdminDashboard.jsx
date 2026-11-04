import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Styles/AdminDashboard.css";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
} from "../services/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [productError, setProductError] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Vegetables",
    stock: "",
    description: "",
    image: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    setProductError("");
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setProductError(err.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      setActionError(err.response?.data?.message || "Unable to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductError("");
    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });

      alert("Product added successfully ✅");
      setShowAddForm(false);
      setNewProduct({
        name: "",
        price: "",
        category: "Vegetables",
        stock: "",
        description: "",
        image: "",
      });
      fetchProducts();
    } catch (error) {
      setProductError(error.response?.data?.message || error.message || "Unable to add product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      offerPrice: product.offerPrice ?? "",
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setProductError("");
    try {
      await updateProduct(editingProduct, {
        ...editForm,
        price: Number(editForm.price),
        offerPrice: editForm.offerPrice === "" ? null : Number(editForm.offerPrice),
        stock: Number(editForm.stock),
      });

      alert("Product updated successfully ✅");
      setEditingProduct(null);
      setEditForm({
        name: "",
        price: "",
        offerPrice: "",
        category: "",
        stock: "",
        description: "",
        image: "",
      });
      fetchProducts();
    } catch (error) {
      setProductError(error.response?.data?.message || error.message || "Unable to update product");
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    setActionError("");
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status: updated.status } : order));
    } catch (error) {
      setActionError(error.response?.data?.message || error.message || "Unable to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setProductError("");
        await deleteProduct(id);
        alert("Product deleted successfully ✅");
        fetchProducts();
      } catch (error) {
        setProductError(error.response?.data?.message || error.message || "Unable to delete product");
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      price: "",
      offerPrice: "",
      category: "",
      stock: "",
      description: "",
      image: "",
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Admin access required</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products ({products.length})
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <>
          {productError && <p className="error-message" role="alert">{productError}</p>}
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Product"}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="add-product-form">
              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
              />

              <input
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                required
              />

              <button type="submit">Add Product</button>
            </form>
          )}

          {/* Edit Form */}
          {editingProduct && (
            <div className="edit-form-container">
              <h3>Edit Product</h3>
              <form
                onSubmit={handleUpdateProduct}
                className="edit-product-form"
              >
                <input
                  placeholder="Product Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Offer Price (optional)"
                  value={editForm.offerPrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, offerPrice: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
                <input
                  placeholder="Image URL"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Update Product</button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image} alt={p.name} width="50" />
                      </td>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <div className="orders-list">
          {actionError && <p className="error-message" role="alert">{actionError}</p>}
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="loading">No orders found</div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className="order-status">
                    {order.status || "Pending"}
                  </span>
                </div>
                <div className="order-details">
                  <p>
                    <strong>Customer:</strong> {order.user?.name || "N/A"} (
                    {order.user?.email || "N/A"})
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.items?.length || 0}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod || "COD"}
                  </p>
                </div>
                <details className="admin-order-items">
                  <summary>View order details</summary>
                  <p><strong>Delivery:</strong> {order.address?.fullName}, {order.address?.address}, {order.address?.city} - {order.address?.pincode}</p>
                  <p><strong>Contact:</strong> {order.address?.phone} · {order.address?.email}</p>
                  {(order.items || []).map((item, index) => (
                    <p key={item._id || index}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}</p>
                  ))}
                </details>
                <div className="order-actions">
                  {order.status === "pending" && (
                    <button className="btn-small btn-success" disabled={updatingOrderId === order._id} onClick={() => handleOrderStatusUpdate(order._id, "confirmed")}>
                      {updatingOrderId === order._id ? "Updating..." : "Confirm"}
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <button className="btn-small btn-success" disabled={updatingOrderId === order._id} onClick={() => handleOrderStatusUpdate(order._id, "shipped")}>
                      {updatingOrderId === order._id ? "Updating..." : "Mark Shipped"}
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button className="btn-small btn-success" disabled={updatingOrderId === order._id} onClick={() => handleOrderStatusUpdate(order._id, "delivered")}>
                      {updatingOrderId === order._id ? "Updating..." : "Mark Delivered"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
