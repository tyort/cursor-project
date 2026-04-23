import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const CartContext = createContext();
const MAX_QUANTITY_PER_PRODUCT = 2;
const PROMO_CODE = 'Кекс';
const PROMO_DISCOUNT = 15;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const addToCart = useCallback((product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    // Проверяем лимит количества товара
    if (existingItem && existingItem.quantity >= MAX_QUANTITY_PER_PRODUCT) {
      return { success: false, message: `Достигнут лимит: можно добавить не более ${MAX_QUANTITY_PER_PRODUCT} шт. товара "${product.name}"` };
    }

    setCartItems((prevItems) => {
      const currentItem = prevItems.find((item) => item.id === product.id);

      // Вычисляем цену со скидкой
      const discount = product.discount || 0;
      const discountedPrice = discount > 0
        ? Math.round(product.price * (1 - discount / 100))
        : product.price;

      if (currentItem) {
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
        discountedPrice
      }];
    });

    return { success: true };
  }, [cartItems]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }
    
    // Проверяем лимит количества товара
    if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
      const item = cartItems.find((item) => item.id === productId);
      return { 
        success: false, 
        message: `Достигнут лимит: можно добавить не более ${MAX_QUANTITY_PER_PRODUCT} шт. товара "${item?.name || ''}"` 
      };
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    return { success: true };
  }, [cartItems, removeFromCart]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => {
      const itemPrice = item.discountedPrice !== undefined
        ? item.discountedPrice
        : (item.originalPrice || item.price);
      return total + itemPrice * item.quantity;
    }, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(() => {
    if (isPromoApplied) {
      return Math.round(subtotal * (1 - PROMO_DISCOUNT / 100));
    }
    return subtotal;
  }, [isPromoApplied, subtotal]);

  const getSubtotal = useCallback(() => subtotal, [subtotal]);
  const getTotalItems = useCallback(() => totalItems, [totalItems]);
  const getTotalPrice = useCallback(() => totalPrice, [totalPrice]);

  const applyPromoCode = useCallback((code) => {
    // Проверяем, не применен ли уже промокод
    if (isPromoApplied) {
      return { success: false, message: 'Промокод уже применен' };
    }
    
    // Проверяем правильность промокода
    if (code.trim() !== PROMO_CODE) {
      return { success: false, message: 'Неверный промокод' };
    }
    
    setIsPromoApplied(true);
    return { success: true };
  }, [isPromoApplied]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    applyPromoCode,
    isPromoApplied,
    MAX_QUANTITY_PER_PRODUCT,
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    applyPromoCode,
    isPromoApplied,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

