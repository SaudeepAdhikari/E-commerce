import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReviewsSection from './ReviewsSection';
import './ProductDetail.css';

function ProductDetail({ products, addToCart, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p._id === id || String(p.id) === id);

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-container">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const productId = product._id || String(product.id);

  return (
    <div className="product-detail">
      <Helmet>
        <title>{product.name} - Demaj Tea</title>
      </Helmet>
      <div className="product-container">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} className="product-main-img" />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <div className="product-description">{product.description}</div>
          <div className="price">${parseFloat(product.price).toFixed(2)}</div>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
      <ReviewsSection productId={productId} user={user} />
    </div>
  );
}

export default ProductDetail;
