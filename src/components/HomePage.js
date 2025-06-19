import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import StarRating from './StarRating';
import TestimonialsCarousel from './TestimonialsCarousel';
import TeaFilter from './TeaFilter';
import AnimatedBackground from './AnimatedBackground';
import './HomePage.css';

function HomePage({ addToCart, products, scrollTo, initialFilters, updateFiltersInURL }) {
  const navigate = useNavigate();
  const categoriesRef = React.useRef(null);
  const testimonialsRef = React.useRef(null);
  const contactRef = React.useRef(null);

  const [filters, setFilters] = useState(initialFilters || {
    type: '',
    price: '',
    popularity: ''
  });
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (scrollTo === 'categories' && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollTo === 'testimonials' && testimonialsRef.current) {
      testimonialsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollTo === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollTo]);

  useEffect(() => {
    let result = products;
    if (filters.type) result = result.filter(product => product.category.toLowerCase() === filters.type.toLowerCase());
    if (filters.price) {
      if (filters.price === 'low') result = result.filter(product => product.price < 10);
      if (filters.price === 'medium') result = result.filter(product => product.price >= 10 && product.price <= 15);
      if (filters.price === 'high') result = result.filter(product => product.price > 15);
    }
    setFilteredProducts(result);
    if (updateFiltersInURL) updateFiltersInURL(filters);
  }, [filters, products, updateFiltersInURL]);

  return (
    <>
      <Helmet>
        <title>Demaj Tea - Premium Award-Winning Teas</title>
        <meta name="description" content="Discover premium, award-winning teas sourced directly from the finest gardens. Experience the unique flavors and aromas of our curated tea collection." />
      </Helmet>

      <AnimatedBackground />

      {/* Hero Section */}
      <header className="hero-section enhanced-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <img className="hero-bg-img" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Tea Garden" loading="lazy" />

        <div className="hero-content">
          <h1>Experience Good TEA!</h1>
          <p>Premium, award-winning teas directly from the source. Taste the difference in every cup.</p>
          <div className="hero-buttons">
            <a className="cta-button" href="#featured">Shop Now</a>
            <Link to="/story" className="cta-button secondary">Our Story</Link>
          </div>
        </div>
      </header>

      {/* Featured Teas */}
      <section id="featured" className="featured-teas" ref={categoriesRef}>
        <TeaFilter filters={filters} setFilters={setFilters} />
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <h3>No teas match your selected filters</h3>
            <p>Try adjusting your filters to see more products</p>
            <button className="reset-filters-btn" onClick={() => setFilters({ type: '', price: '', popularity: '' })}>Reset Filters</button>
          </div>
        ) : (
          <div className="tea-list">
            {filteredProducts.map((product, i) => (
              <div className="tea-card" key={product._id} onClick={() => navigate(`/product/${product._id}`)} style={{ animationDelay: `${i * 0.12 + 0.2}s` }} role="button" tabIndex={0} aria-label={`View details for ${product.name}`}>
                <img src={product.image} alt={product.name} className="tea-card-image" loading="lazy" />
                <div className="tea-type-badge">{product.category}</div>
                <div className="tea-card-title">{product.name}</div>
                <div className="tea-card-desc">{product.description}</div>
                <div className="tea-card-price">${parseFloat(product.price).toFixed(2)}</div>
                <button className="tea-card-btn" onClick={e => { e.stopPropagation(); addToCart(product._id ? product : { ...product, _id: product.id }); }} aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" ref={testimonialsRef}>
        <h2>What Our Customers Say</h2>
        <TestimonialsCarousel />
      </section>
      <div ref={contactRef}></div>
    </>
  );
}

export default HomePage;
