import React from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import './Catalog.css';

export default function Catalog() {
  const { addToCart } = useCart();

  return (
    <div className="catalog">
      <div className="catalog__container">
        <h2 className="catalog__title">Каталог товаров</h2>
        <ProductGrid products={products} onAddToCart={addToCart} />
      </div>
    </div>
  );
}

