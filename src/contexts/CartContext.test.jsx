import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const getParsedContent = (testId) => {
  const content = screen.getByTestId(testId).textContent;
  return content ? JSON.parse(content) : null;
};

const CartContextTestHarness = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [operationResult, setOperationResult] = useState(null);
  const [operationError, setOperationError] = useState('');

  const handleAddToCart = () => {
    setOperationError('');

    try {
      const result = addToCart(product);
      setOperationResult(result);
    } catch (error) {
      setOperationResult(null);
      setOperationError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <>
      <button type="button" onClick={handleAddToCart}>
        Добавить
      </button>
      <div data-testid="operation-result">{JSON.stringify(operationResult)}</div>
      <div data-testid="operation-error">{operationError}</div>
      <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
    </>
  );
};

describe('CartContext addToCart', () => {
  it('добавляет товар с нулевой ценой', () => {
    const productWithZeroPrice = {
      id: 101,
      name: 'Бесплатный товар',
      price: 0,
    };

    render(
      <CartProvider>
        <CartContextTestHarness product={productWithZeroPrice} />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    const operationResult = getParsedContent('operation-result');
    const cartItems = getParsedContent('cart-items');

    expect(operationResult).toEqual({ success: true });
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      id: 101,
      price: 0,
      quantity: 1,
      originalPrice: 0,
      discountedPrice: 0,
    });
  });

  it('обрабатывает попытку добавить товар с отрицательной ценой', () => {
    const productWithNegativePrice = {
      id: 102,
      name: 'Товар с отрицательной ценой',
      price: -500,
    };

    render(
      <CartProvider>
        <CartContextTestHarness product={productWithNegativePrice} />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    const operationResult = getParsedContent('operation-result');
    const cartItems = getParsedContent('cart-items');

    expect(operationResult).toEqual({ success: true });
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      id: 102,
      price: -500,
      quantity: 1,
      originalPrice: -500,
      discountedPrice: -500,
    });
  });

  it('фиксирует ошибку при попытке добавить null вместо товара', () => {
    render(
      <CartProvider>
        <CartContextTestHarness product={null} />
      </CartProvider>
    );

    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));
    }).toThrow();
  });

  it('при добавлении товара с очень большим количеством в исходных данных устанавливает quantity 1', () => {
    const productWithHugeQuantity = {
      id: 103,
      name: 'Товар с большим количеством',
      price: 1200,
      quantity: 999999999,
    };

    render(
      <CartProvider>
        <CartContextTestHarness product={productWithHugeQuantity} />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    const operationResult = getParsedContent('operation-result');
    const cartItems = getParsedContent('cart-items');

    expect(operationResult).toEqual({ success: true });
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      id: 103,
      quantity: 1,
      price: 1200,
      originalPrice: 1200,
      discountedPrice: 1200,
    });
  });
});
