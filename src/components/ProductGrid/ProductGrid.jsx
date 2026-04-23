import React, { useCallback } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGrid.css';

export function ProductGrid({ products, onAddToCart }) {
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
        />
      ))}
    </div>
  );
}

