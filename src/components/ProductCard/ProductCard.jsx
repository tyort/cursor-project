import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import './ProductCard.css';

/**
 * Компонент карточки товара.
 * Отображает изображение, название, цену и кнопку добавления в корзину.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.product - Данные товара.
 * @param {string|number} props.product.id - Уникальный идентификатор товара.
 * @param {string} props.product.name - Название товара.
 * @param {number} props.product.price - Цена товара.
 * @param {number} [props.product.discount] - Скидка на товар в процентах.
 * @param {string} props.product.image - URL изображения товара.
 * @param {Function} props.onAddToCart - Обработчик добавления товара в корзину.
 * @param {boolean} [props.isAddDisabled=false] - Флаг отключения кнопки добавления.
 * @returns {JSX.Element|null} Компонент карточки товара.
 */
export function ProductCard({ product, onAddToCart, isAddDisabled = false }) {
  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Вычисляем цену со скидкой
  const discount = product.discount || 0;
  const discountedPrice = discount > 0
    ? Math.round(product.price * (1 - discount / 100))
    : product.price;

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <div className="product-card__price-container">
            {discount > 0 && (
              <>
                <p className="product-card__price-old">{formatPrice(product.price)}</p>
                <span className="product-card__discount-badge">-{discount}%</span>
              </>
            )}
            <p className="product-card__price">{formatPrice(discountedPrice)}</p>
          </div>
          <button
            className="product-card__button"
            onClick={handleAddToCart}
            disabled={isAddDisabled}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}

