import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../contexts/CartContext';
import './CartItem.css';

export default function CartItem({ item }) {
  const { removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const total = item.price * item.quantity;

  return (
    <tr className="cart-item">
      <td className="cart-item__name">{item.name}</td>
      <td className="cart-item__price">{formatPrice(item.price)}</td>
      <td className="cart-item__quantity">{item.quantity}</td>
      <td className="cart-item__total">{formatPrice(total)}</td>
      <td className="cart-item__actions">
        <button
          className="cart-item__delete-button"
          onClick={handleRemove}
          aria-label="Удалить товар"
        >
          <DeleteIcon className="cart-item__delete-icon" />
          Удалить
        </button>
      </td>
    </tr>
  );
}

