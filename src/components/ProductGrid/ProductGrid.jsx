import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGrid.css';

export function ProductGrid({ products, onAddToCart }) {
  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log('Товар добавлен в корзину:', product);
    }
  };

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

