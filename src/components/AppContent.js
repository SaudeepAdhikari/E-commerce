import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Products from './Products';
import Cart from './Cart';
import StorySection from './StorySection';
import Navbar from './Navbar';
import FloatingCart from './FloatingCart';
import Footer from './Footer';
import TeaSection from './TeaSection';
import ProductDetail from './ProductDetail';
import ProfileWrapper from './ProfileWrapper';
import CheckoutPage from './CheckoutPage';
import OrderHistory from './OrderHistory';

function AppContent({ onLogin, onLogout, onRegister, cart, products, addToCart, removeFromCart, updateQuantity, cartTotal, user }) {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="app-container">
            <Navbar cartCount={cartCount} user={user} onLogout={onLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage addToCart={addToCart} products={products} />} />
                    <Route path="/products" element={<Products products={products} addToCart={addToCart} />} />
                    <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} cartTotal={cartTotal} />} />
                    <Route path="/checkout" element={<CheckoutPage cart={cart} cartTotal={cartTotal} user={user} />} />
                    <Route path="/profile" element={<ProfileWrapper onLogin={onLogin} onLogout={onLogout} onRegister={onRegister} />} />
                    <Route path="/story" element={<StorySection />} />
                    <Route path="/tea" element={<TeaSection products={products} addToCart={addToCart} />} />
                    <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} user={user} />} />
                    <Route path="/order-history" element={<OrderHistory user={user} />} />
                </Routes>
            </main>
            <FloatingCart cart={cart} />
            <Footer />
        </div>
    );
}

export default AppContent; 