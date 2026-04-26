import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const CartContext = createContext();
const MAX_QUANTITY_PER_PRODUCT = 2;
const PROMO_CODE = 'Кекс';
const PROMO_DISCOUNT = 15;

/**
 * Хук для использования контекста корзины.
 * @returns {Object} Объект с данными и методами корзины.
 * @throws {Error} Ошибка, если хук используется вне CartProvider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Провайдер состояния корзины.
 * Оборачивает дочерние компоненты и предоставляет им доступ к корзине.
 *
 * @param {Object} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние элементы.
 * @returns {JSX.Element} Провайдер контекста корзины.
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  /**
   * Добавляет товар в корзину.
   * Учитывает скидку товара и максимальное разрешенное количество.
   *
   * @param {Object} product - Объект добавляемого товара.
   * @returns {{ success: boolean, message?: string }} Результат добавления.
   */
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

  /**
   * Удаляет товар из корзины.
   *
   * @param {string|number} productId - Идентификатор удаляемого товара.
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  /**
   * Обновляет количество товара в корзине.
   * При достижении 0 удаляет товар. Проверяет максимальное допустимое количество.
   *
   * @param {string|number} productId - Идентификатор товара.
   * @param {number} newQuantity - Новое количество товара.
   * @returns {{ success: boolean, message?: string }} Результат обновления количества.
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    // Проверяем лимит количества товара
    if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
      const item = cartItems.find((cartItem) => cartItem.id === productId);
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

  /**
   * Применяет промокод к корзине.
   *
   * @param {string} code - Введенный промокод.
   * @returns {{ success: boolean, message?: string }} Результат применения промокода.
   */
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

