import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
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
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}

