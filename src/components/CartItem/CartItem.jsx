import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../../contexts/CartContext';
import './CartItem.css';

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

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

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const total = item.price * item.quantity;

  return (
    <tr className="cart-item">
      <td className="cart-item__name">{item.name}</td>
      <td className="cart-item__price">{formatPrice(item.price)}</td>
      <td className="cart-item__quantity">
        <div className="cart-item__quantity-controls">
          <button
            className="cart-item__quantity-button"
            onClick={handleDecrease}
            aria-label="Уменьшить количество"
            disabled={item.quantity <= 1}
          >
            <RemoveIcon className="cart-item__quantity-icon" />
          </button>
          <span className="cart-item__quantity-value">{item.quantity}</span>
          <button
            className="cart-item__quantity-button"
            onClick={handleIncrease}
            aria-label="Увеличить количество"
          >
            <AddIcon className="cart-item__quantity-icon" />
          </button>
        </div>
      </td>
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

