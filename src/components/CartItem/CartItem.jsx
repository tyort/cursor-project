import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import './CartItem.css';

export function CartItem({ item, onUpdateQuantity }) {
  const { removeFromCart } = useCart();

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  // Используем цену со скидкой, если она есть, иначе обычную цену
  const itemPrice = item.discountedPrice !== undefined 
    ? item.discountedPrice 
    : (item.originalPrice || item.price);
  const total = itemPrice * item.quantity;

  return (
    <tr className="cart-item">
      <td className="cart-item__name">{item.name}</td>
      <td className="cart-item__price">
        {item.discountedPrice !== undefined && item.discountedPrice !== item.originalPrice ? (
          <div className="cart-item__price-container">
            <span className="cart-item__price-old">{formatPrice(item.originalPrice || item.price)}</span>
            <span className="cart-item__price-new">{formatPrice(itemPrice)}</span>
          </div>
        ) : (
          <span>{formatPrice(itemPrice)}</span>
        )}
      </td>
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

