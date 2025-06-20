import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Products.css';

function Products({ products, addToCart }) {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category.toLowerCase() === selectedCategory);

    // Get unique categories from products
    const categories = ['all', ...new Set(products.map(product => product.category.toLowerCase()))];

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Our Tea Collection</h1>
                <div className="category-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <Link to={`/product/${product._id}`}>
                            <img src={product.image} alt={product.name} className="product-image" />
                        </Link>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                            <button
                                className="add-to-cart-btn"
                                onClick={() => addToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products; 