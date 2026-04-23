import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

export function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <h1 className="header__title">Магазин товаров</h1>
        </Link>
        <Link to="/cart" className="header__cart-link">
          <div className="header__cart-icon-wrapper">
            <ShoppingCartIcon className="header__cart-icon" />
            {totalItems > 0 && (
              <span className="header__cart-badge">{totalItems}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

