import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PRODUCTS } from '../data/products';
import ReviewsSection from './ReviewsSection';
import './ProductDetail.css';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === parseInt(id));
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
        <title>{product.name} - Tea Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="product-container">
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>

        <div className="product-gallery">
          <img src={product.image} alt={product.name} className="product-main-img" />
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToCart(product)}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <ReviewsSection
        productId={product.id}
        initialReviews={productReviews}
        onAddReview={handleAddReview}
      />
    </div>
  );
}

export default ProductDetail;
