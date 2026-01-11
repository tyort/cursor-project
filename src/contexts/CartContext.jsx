import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      // Вычисляем цену со скидкой
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? Math.round(product.price * (1 - discount / 100))
        : product.price;
      
      if (existingItem) {
        // Сохраняем оригинальную цену и цену со скидкой, если их ещё нет
        return prevItems.map((item) =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                originalPrice: item.originalPrice || product.price,
                discountedPrice: item.discountedPrice !== undefined 
                  ? item.discountedPrice 
                  : discountedPrice
              }
            : item
        );
      }
      
      // Сохраняем оригинальную цену и цену со скидкой
      return [...prevItems, { 
        ...product, 
        quantity: 1,
        originalPrice: product.price,
        discountedPrice: discountedPrice
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Используем цену со скидкой, если она есть, иначе обычную цену
      const itemPrice = item.discountedPrice !== undefined 
        ? item.discountedPrice 
        : (item.originalPrice || item.price);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

