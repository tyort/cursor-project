import React from 'react';
import { render, screen } from '@testing-library/react';
import { Cart } from './Cart';
import { useCart } from '../../contexts/CartContext';

vi.mock('../../contexts/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../Notification/Notification', () => ({
  Notification: () => null,
}));

describe('Cart', () => {
  it('если в корзине нет товаров, список товаров не отображается', () => {
    useCart.mockReturnValue({
      cartItems: [],
      getTotalPrice: () => 0,
      getSubtotal: () => 0,
      updateQuantity: () => ({ success: true }),
      applyPromoCode: () => ({ success: true }),
      isPromoApplied: false,
    });

    render(<Cart />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('если в корзине товар за 1000 рублей, отображается сумма 1000', () => {
    useCart.mockReturnValue({
      cartItems: [
        {
          id: 1,
          name: 'Тестовый товар',
          price: 1000,
          quantity: 1,
        },
      ],
      getTotalPrice: () => 1000,
      getSubtotal: () => 1000,
      updateQuantity: () => ({ success: true }),
      applyPromoCode: () => ({ success: true }),
      isPromoApplied: false,
      removeFromCart: () => undefined,
    });

    render(<Cart />);

    const totalLabel = screen.getByText('Общая стоимость:');
    const totalRow = totalLabel.closest('.cart__total-row');
    const totalPrice = totalRow?.querySelector('.cart__total-price');

    expect(totalRow).not.toBeNull();
    expect(totalPrice).not.toBeNull();
    expect(totalPrice).toHaveTextContent(/1\s*000\s*₽/);
  });
});
