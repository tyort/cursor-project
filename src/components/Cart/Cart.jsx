import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../CartItem/CartItem';
import { Notification } from '../Notification/Notification';
import { formatPrice } from '../../utils/formatPrice';
import './Cart.css';

/**
 * Компонент корзины покупок.
 * Отображает список добавленных товаров, позволяет изменять их количество,
 * применять промокод и видеть итоговую стоимость.
 *
 * @returns {JSX.Element} Компонент корзины.
 */
export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    getTotalPrice,
    getSubtotal,
    updateQuantity,
    applyPromoCode,
    isPromoApplied
  } = useCart();
  const totalPrice = getTotalPrice();
  const subtotal = getSubtotal();
  const [notification, setNotification] = useState({ open: false, message: '' });
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleUpdateQuantity = useCallback((itemId, newQuantity) => {
    const result = updateQuantity(itemId, newQuantity);

    if (!result.success) {
      setNotification({
        open: true,
        message: result.message
      });
    }
  }, [updateQuantity]);

  const handleCloseNotification = useCallback(() => {
    setNotification({ open: false, message: '' });
  }, []);

  const handleApplyPromoCode = useCallback(() => {
    setPromoError('');
    const result = applyPromoCode(promoCode);

    if (!result.success) {
      setPromoError(result.message);
    }
  }, [applyPromoCode, promoCode]);

  const handlePromoCodeChange = useCallback((e) => {
    setPromoCode(e.target.value);
    if (promoError) {
      setPromoError('');
    }
  }, [promoError]);

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart__container">
          <h2 className="cart__title">Корзина</h2>
          <p className="cart__empty">Корзина пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__container">
        <h2 className="cart__title">Корзина</h2>
        <div className="cart__promo-section">
          <input
            type="text"
            className="cart__promo-input"
            placeholder="Введите промокод"
            value={promoCode}
            onChange={handlePromoCodeChange}
            disabled={isPromoApplied}
          />
          <button
            className="cart__promo-button"
            onClick={handleApplyPromoCode}
            disabled={isPromoApplied || !promoCode.trim()}
          >
            Применить
          </button>
          {promoError && (
            <p className="cart__promo-error">{promoError}</p>
          )}
          {isPromoApplied && (
            <p className="cart__promo-success">Промокод применен! Скидка 15%</p>
          )}
        </div>
        <div className="cart__total">
          {isPromoApplied && (
            <div className="cart__total-row">
              <span className="cart__total-label">Сумма до скидки:</span>
              <span className="cart__total-price-old">{formatPrice(subtotal)}</span>
            </div>
          )}
          <div className="cart__total-row">
            <span className="cart__total-label">Общая стоимость:</span>
            <span className="cart__total-price">{formatPrice(totalPrice)}</span>
          </div>
          <button 
            className="cart__promo-button"
            style={{ marginTop: '16px', width: '100%', padding: '12px' }}
            onClick={() => navigate('/checkout')}
          >
            Оформить заказ
          </button>
        </div>
        <div className="cart__table-wrapper">
          <table className="cart__table">
            <thead>
              <tr>
                <th className="cart__table-header">Название</th>
                <th className="cart__table-header">Цена</th>
                <th className="cart__table-header">Количество</th>
                <th className="cart__table-header">Сумма</th>
                <th className="cart__table-header">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </tbody>
          </table>
        </div>
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

