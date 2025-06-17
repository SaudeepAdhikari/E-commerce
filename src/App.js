import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import PromoBanner from './components/PromoBanner';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import TeaSection from './components/TeaSection';
import StorySection from './components/StorySection';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import Profile from './components/Profile';
import { PRODUCTS } from './data/products';

function AppContent({ cart, addToCart, removeFromCart, cartTotal, user }) {
  const [showSearch, setShowSearch] = useState(false);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest('.search-container') && !event.target.closest('.search-btn')) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  return (
    <div className="App">
      <PromoBanner />
      <nav className="navbar">
        <Link to="/" className="nav-logo">Demaj Tea</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tea" className="nav-link">Tea Collection</Link>
          <Link to="/story" className="nav-link">Our Story</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Link>
          <button
            className="nav-link search-btn"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
          <Link to="/profile" className="nav-link profile-link">
            {user ? user.name : 'Login'}
          </Link>
        </div>
        {showSearch && (
          <div className="search-container">
            <SearchBar products={PRODUCTS} />
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/tea" element={<TeaSection addToCart={addToCart} />} />
        <Route path="/story" element={<StorySection />} />
        <Route path="/reviews" element={<TestimonialsCarousel />} />
        <Route path="/product/:id" element={<ProductDetail products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} cartTotal={cartTotal} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} cartTotal={cartTotal} />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState(null);

  // Update cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setCartTotal(total);
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (email, password) => {
    // In a real app, this would make an API call to your backend
    // For now, we'll simulate a successful login
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: email,
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleRegister = async (name, email, password) => {
    // In a real app, this would make an API call to your backend
    // For now, we'll simulate a successful registration
    const mockUser = {
      id: 1,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const newCart = [...prevCart, { ...product, cartId: Date.now() }];
      return newCart;
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <HelmetProvider>
      <Router>
        <AppContent
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          user={user}
        />
      </Router>
    </HelmetProvider>
  );
}

export default App;
