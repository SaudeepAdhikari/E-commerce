import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReviewsSection from './ReviewsSection';
import './ProductDetail.css';

function ProductDetail({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p._id === id);
  const [productReviews, setProductReviews] = useState(() => {
    // Retrieve reviews from localStorage if available
    const savedReviews = localStorage.getItem(`productReviews-${id}`);
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  const handleAddReview = (newReview) => {
    const updatedReviews = [...productReviews, newReview];
    setProductReviews(updatedReviews);
    // Save to localStorage
    localStorage.setItem(`productReviews-${id}`, JSON.stringify(updatedReviews));
  };

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
      <ReviewsSection
        productId={id}
        reviews={productReviews}
        onAddReview={handleAddReview}
      />
    </div>
  );
}

export default ProductDetail;
