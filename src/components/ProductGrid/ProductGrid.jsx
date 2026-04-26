import React, { useCallback } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGrid.css';

/**
 * Компонент сетки товаров.
 * Отображает список карточек товаров.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Array<Object>} props.products - Массив товаров.
 * @param {Function} props.onAddToCart - Функция добавления товара в корзину.
 * @param {Function} [props.isAddToCartDisabled] - Функция для проверки доступности добавления товара.
 * @returns {JSX.Element} Сетка карточек товаров.
 */
export function ProductGrid({ products, onAddToCart, isAddToCartDisabled }) {
  const handleAddToCart = useCallback((product) => {
    onAddToCart(product);
  }, [onAddToCart]);

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          isAddDisabled={isAddToCartDisabled ? isAddToCartDisabled(product.id) : false}
        />
      ))}
    </div>
  );
}

