import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/products/${editingId}`
        : '/api/products';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        setFormData({ name: '', description: '', price: '', stock: '' });
        setEditingId(null);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error submitting form');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
      } else {
        alert('Error deleting product');
      }
    } catch (err) {
      alert('Error deleting product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditingId(product.id);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 E-Commerce Product Manager</h1>
        <p>Full Stack Application - Node.js + React + MySQL</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
            <input
              type="number"
              name="price"
              placeholder="Price (₹) *"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              min="0"
            />
            <div className="button-group">
              <button type="submit" className="submit-btn">
                {editingId ? '✓ Update Product' : '+ Add Product'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', description: '', price: '', stock: '' });
                  }}
                  className="cancel-btn"
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-section">
          <div className="section-header">
            <h2>Products</h2>
            <span className="product-count">{products.length} items</span>
          </div>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <p>📦 No products yet. Add your first product above!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-id">ID: {product.id}</span>
                  </div>
                  <p className="description">{product.description || 'No description'}</p>
                  <div className="product-info">
                    <span className="price">₹{parseFloat(product.price).toFixed(2)}</span>
                    <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="button-group">
                    <button onClick={() => handleEdit(product)} className="edit-btn">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="delete-btn">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>© 2025 E-Commerce App | Built with Node.js, React & MySQL</p>
      </footer>
    </div>
  );
}

export default App;
