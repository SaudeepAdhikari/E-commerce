import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import AppContent from './components/AppContent';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import UserManagement from './components/admin/UserManagement';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from backend API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(user => setUser(user))
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
        });
    }
    const savedAdminStatus = localStorage.getItem('isAdmin');
    if (savedAdminStatus) {
      setIsAdmin(JSON.parse(savedAdminStatus));
    }
  }, []);

  // Fetch user cart from backend
  const fetchUserCart = async (token) => {
    const res = await fetch('http://localhost:5000/api/users/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const backendCart = await res.json();
    // Map backend cart to frontend format (with product details)
    return backendCart.map(item => ({
      ...item.product,
      id: item.product._id,
      cartId: item.product._id, // Use productId as cartId for backend carts
      quantity: item.quantity
    }));
  };

  // On login, fetch user and cart
  const handleLogin = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || (data.errors && data.errors[0]?.msg) || 'Login failed');
    }
    localStorage.setItem('token', data.token);
    setUser(data.user);
    // Fetch cart from backend and set it
    const backendCart = await fetchUserCart(data.token);
    setCart(backendCart);
  };

  // On logout, clear cart
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('cart');
  };

  const handleRegister = async (name, email, password) => {
    const res = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || (data.errors && data.errors[0]?.msg) || 'Registration failed');
    }
    // Auto-login after registration
    await handleLogin(email, password);
  };

  const handleAdminLogin = (success) => {
    console.log('Admin login attempt:', success);
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', JSON.stringify(true));
      console.log('Admin login successful');
    } else {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
      console.log('Admin login failed');
    }
  };

  // Product management functions (API)
  const addProduct = async (newProduct) => {
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    await fetchProducts(); // Always refresh after add
  };

  const updateProduct = async (updatedProduct) => {
    const res = await fetch(`http://localhost:5000/api/products/${updatedProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    const updated = await res.json();
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  const deleteProduct = async (productId) => {
    await fetch(`http://localhost:5000/api/products/${productId}`, { method: 'DELETE' });
    await fetchProducts(); // Always refresh after delete
  };

  // Add to cart
  const addToCart = async (product) => {
    if (user) {
      // If logged in, sync with backend
      const token = localStorage.getItem('token');
      // Check if already in cart
      const existing = cart.find(item => item.id === product._id);
      const quantity = existing ? existing.quantity + 1 : 1;
      const res = await fetch('http://localhost:5000/api/users/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ product: product._id, quantity })
      });
      if (res.ok) {
        const backendCart = await res.json();
        setCart(backendCart.map(item => ({
          ...item.product,
          id: item.product._id,
          cartId: item.product._id,
          quantity: item.quantity
        })));
      }
    } else {
      // Guest: local cart
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product._id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, id: product._id, cartId: Date.now(), quantity: 1 }];
        }
      });
    }
  };

  // Remove from cart
  const removeFromCart = async (cartId) => {
    if (user) {
      const token = localStorage.getItem('token');
      // cartId is productId for backend cart
      const res = await fetch(`http://localhost:5000/api/users/cart/${cartId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const backendCart = await res.json();
        setCart(backendCart.map(item => ({
          ...item.product,
          id: item.product._id,
          cartId: item.product._id,
          quantity: item.quantity
        })));
      }
    } else {
      setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    }
  };

  // Update quantity
  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    if (user) {
      const token = localStorage.getItem('token');
      // cartId is productId for backend cart
      const res = await fetch('http://localhost:5000/api/users/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ product: cartId, quantity })
      });
      if (res.ok) {
        const backendCart = await res.json();
        setCart(backendCart.map(item => ({
          ...item.product,
          id: item.product._id,
          cartId: item.product._id,
          quantity: item.quantity
        })));
      }
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart (optional, e.g. after checkout)
  const clearCart = async () => {
    if (user) {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/users/cart', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCart([]);
    } else {
      setCart([]);
    }
  };

  const ProtectedRoute = ({ children }) => {
    console.log('ProtectedRoute check - isAdmin:', isAdmin);
    if (!isAdmin) {
      console.log('Redirecting to login page');
      return <Navigate to="/admin/login" replace />;
    }
    console.log('Rendering protected content');
    return children;
  };

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={
            isAdmin ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={handleAdminLogin} />
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard products={products} onLogout={handleLogout} onDeleteProduct={deleteProduct} />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <ProductManagement
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                loading={loadingProducts}
              />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <AppContent
              cart={cart}
              products={products}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartTotal={cartTotal}
              user={user}
              updateQuantity={updateQuantity}
              isAdmin={isAdmin}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onRegister={handleRegister}
              loadingProducts={loadingProducts}
            />
          } />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
