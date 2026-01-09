import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../CartItem/CartItem';
import './Cart.css';

export default function Cart() {
  const { cartItems, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

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
        <div className="cart__total">
          <span className="cart__total-label">Общая стоимость:</span>
          <span className="cart__total-price">{formatPrice(totalPrice)}</span>
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
                <CartItem key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

