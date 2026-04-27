import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header/Header';
import { Catalog } from './pages/Catalog/Catalog';
import { Cart } from './components/Cart/Cart';
import { CheckoutForm } from './components/CheckoutForm/CheckoutForm';
import './App.css';

export function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
