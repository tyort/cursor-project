import React, { useState, useCallback } from 'react';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { Notification } from '../../components/Notification/Notification';
import './Catalog.css';

export function Catalog() {
  const { addToCart, cartItems, MAX_QUANTITY_PER_PRODUCT } = useCart();
  const [notification, setNotification] = useState({ open: false, message: '' });

  const handleAddToCart = useCallback((product) => {
    const result = addToCart(product);

    if (!result.success) {
      setNotification({
        open: true,
        message: result.message
      });
    }
  }, [addToCart]);

  const handleCloseNotification = useCallback(() => {
    setNotification({ open: false, message: '' });
  }, []);

  const isAddToCartDisabled = useCallback((productId) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    return Boolean(cartItem && cartItem.quantity >= MAX_QUANTITY_PER_PRODUCT);
  }, [cartItems, MAX_QUANTITY_PER_PRODUCT]);

  return (
    <div className="catalog">
      <div className="catalog__container">
        <h2 className="catalog__title">Каталог товаров</h2>
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          isAddToCartDisabled={isAddToCartDisabled}
        />
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

