import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Styles/AdminDashboard.css";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
} from "../services/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

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
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
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
      alert("Error adding product ❌",error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct, {
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });

      alert("Product updated successfully ✅");
      setEditingProduct(null);
      setEditForm({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
      });
      fetchProducts();
    } catch (error) {
      alert("Error updating product ❌",error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully ✅");
        fetchProducts();
      } catch (error) {
        alert("Error deleting product ❌",error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      price: "",
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
                <div className="order-actions">
                  <button className="btn-small btn-warning">
                    View Details
                  </button>
                  <button className="btn-small btn-success">
                    Mark Complete
                  </button>
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
