import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    offerPrice: '',
    image: '',
    category: 'vegetables',
    stock: '',
    description: '',
    images: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['vegetables', 'dairy', 'fruits', 'grains', 'beverages'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
        stock: parseInt(formData.stock),
        image: formData.images[0] || formData.image,
        images: formData.images.filter(img => img.trim() !== '')
      };

      await createProduct(productData);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Add New Product</h1>
          <p>Add a new product to the store</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Pricing & Stock</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Product Images</h3>
              
              <div className="form-group">
                <label className="form-label">Main Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="images-section">
                <label className="form-label">Additional Images</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="image-input-group">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="btn btn-danger remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="btn btn-outline add-image-btn"
                >
                  + Add Another Image
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Product...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-add-product {
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

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          padding: 2rem;
        }

        .product-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 2rem;
        }

        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-section h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #667eea;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .images-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .remove-btn {
          padding: 8px 12px;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .add-image-btn {
          align-self: flex-start;
          margin-top: 0.5rem;
        }

        .error-message {
          background: #ffe6e6;
          color: #d63031;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .error-icon {
          font-size: 1.1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 2rem;
          border-top: 1px solid #f0f0f0;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .btn.loading {
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
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-container {
            margin: 0 1rem;
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .image-input-group {
            flex-direction: column;
            align-items: stretch;
          }

          .remove-btn {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }

          .form-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAddProduct;