import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductManagement.css';

function ProductManagement({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'image') {
            setImagePreview(value);
            setImageFile(null);
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, image: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = formData.image;
        // If a file is selected, upload it
        if (imageFile) {
            const data = new FormData();
            data.append('image', imageFile);
            try {
                const res = await fetch('http://localhost:5000/api/products/upload', {
                    method: 'POST',
                    body: data
                });
                const result = await res.json();
                imageUrl = result.url;
            } catch (err) {
                alert('Image upload failed.');
                return;
            }
        }
        // Convert price and stock to numbers
        const processedData = {
            ...formData,
            image: imageUrl,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10)
        };

        try {
            if (editingProduct) {
                console.log('Updating product:', processedData);
                await onUpdateProduct({ ...processedData, _id: editingProduct._id });
                setEditingProduct(null);
            } else {
                console.log('Adding new product:', processedData);
                await onAddProduct(processedData);
            }

            setIsAddingProduct(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
                stock: ''
            });
            setImageFile(null);
            setImagePreview('');

            // Navigate back to admin products page
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsAddingProduct(true);
    };

    const handleDelete = (productId) => {
        console.log('Attempting to delete product with ID:', productId);
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDeleteProduct(productId);
        }
    };

    console.log('Rendering products:', products);

    return (
        <div className="product-management">
            <div className="product-header">
                <h2>Product Management</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        className="add-product-btn"
                        onClick={() => {
                            setIsAddingProduct(true);
                            setEditingProduct(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                image: '',
                                category: '',
                                stock: ''
                            });
                        }}
                    >
                        Add New Product
                    </button>
                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() => navigate('/admin')}
                    >
                        <span className="back-dashboard-icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15L7 10L12 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {isAddingProduct && (
                <div className="product-form-container">
                    <form onSubmit={handleSubmit} className="product-form">
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <div className={`form-group${formData.name ? ' has-value' : ''}`}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={`form-group${formData.description ? ' has-value' : ''}`}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={`form-group${formData.price ? ' has-value' : ''}`}>
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className={`form-group${formData.image ? ' has-value' : ''}`}>
                            <label>Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="Paste image URL or upload file below"
                            />
                            <div style={{ margin: '10px 0' }}>or</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileChange}
                            />
                            {(imagePreview || formData.image) && (
                                <div className="image-preview">
                                    <img
                                        src={imagePreview || formData.image}
                                        alt="Preview"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = '/no-image.png';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={`form-group${formData.category ? ' has-value' : ''}`}>
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={`form-group${formData.stock ? ' has-value' : ''}`}>
                            <label>Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setIsAddingProduct(false);
                                    setEditingProduct(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="products-list">
                {products.length === 0 ? (
                    <p className="no-products">No products available</p>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-thumbnail"
                                            onError={e => {
                                                console.log('Image failed to load:', product.image);
                                                e.target.onerror = null;
                                                e.target.src = '/no-image.png';
                                            }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>${product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                console.log('Delete button clicked for', product._id);
                                                handleDelete(product._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ProductManagement; 