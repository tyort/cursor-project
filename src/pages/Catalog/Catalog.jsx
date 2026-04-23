import React, { useState } from 'react';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { Notification } from '../../components/Notification/Notification';
import './Catalog.css';

export function Catalog() {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ open: false, message: '' });

  const handleAddToCart = (product) => {
    const result = addToCart(product);
    
    if (!result.success) {
      setNotification({
        open: true,
        message: result.message
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  return (
    <div className="catalog">
      <div className="catalog__container">
        <h2 className="catalog__title">Каталог товаров</h2>
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      </div>
      <Notification
        open={notification.open}
        message={notification.message}
        severity="warning"
        onClose={handleCloseNotification}
      />
    </div>
  );
}

