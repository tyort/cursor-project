import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('ничего не отображает, если не передали данные карточки', () => {
    const { container } = render(<ProductCard />);

    expect(container.firstChild).toBeNull();
  });

  it('не показывает скидку, если discount не передан', () => {
    const productWithoutDiscount = {
      id: 1,
      name: 'Тестовый товар',
      price: 1500,
      image: '/image.png',
    };

    const { container } = render(<ProductCard product={productWithoutDiscount} />);

    expect(screen.getByText('Тестовый товар')).toBeInTheDocument();
    expect(container.querySelector('.product-card__discount-badge')).toBeNull();
    expect(container.querySelector('.product-card__price-old')).toBeNull();
  });
});
