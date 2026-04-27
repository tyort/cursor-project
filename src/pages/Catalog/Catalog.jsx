import React, { useState, useCallback, useEffect } from 'react';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { products as fallbackProducts } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { Notification } from '../../components/Notification/Notification';
import { fetchWithRetry } from '../../utils/apiClient';
import { NetworkError, ServiceUnavailableError } from '../../utils/apiErrors';
import './Catalog.css';

/**
 * Компонент каталога товаров.
 * Загружает список товаров с внешнего API, отображает их в виде сетки
 * и обеспечивает интеграцию с корзиной. При ошибке загрузки использует локальные данные.
 *
 * @returns {JSX.Element} Страница каталога.
 */
export function Catalog() {
  const { addToCart, cartItems, MAX_QUANTITY_PER_PRODUCT } = useCart();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'warning' });
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithRetry(
          'https://fakestoreapi.com/products?limit=10',
          {},
          {
            retries: 3,
            retryDelay: 1000,
            cacheKey: 'catalog_products',
            cacheTTL: 1000 * 60 * 60 * 2, // 2 часа кэш
            fallbackData: fallbackProducts // Резервные данные, если API и кэш недоступны
          }
        );

        // Маппинг данных из FakeStoreAPI в наш формат
        const mappedProducts = data.map((item) => ({
          id: item.id,
          name: item.title,
          price: Math.round(item.price * 90), // Конвертация в условные рубли
          discount: item.id % 2 === 0 ? 10 : 0, // Искусственная скидка для каждого второго товара
          description: item.description,
          image: item.image
        }));

        setProductsList(mappedProducts);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        
        // Обработка fallback-стратегии
        if (error.cachedData || error.fallbackData) {
          const fallbackSource = error.cachedData ? error.cachedData : error.fallbackData;
          
          // Маппинг данных (FakeStoreAPI или fallback) в наш формат
          const mappedProducts = fallbackSource.map((item) => ({
            id: item.id,
            name: item.title || item.name, // Поддержка как FakeStoreAPI (title), так и fallback (name)
            price: item.price > 1000 ? item.price : Math.round(item.price * 90), // Конвертация, если данные из API
            discount: item.discount !== undefined ? item.discount : (item.id % 2 === 0 ? 10 : 0),
            description: item.description,
            image: item.image
          }));

          setProductsList(mappedProducts);
          
          setNotification({
            open: true,
            message: 'Не удалось загрузить актуальные товары с сервера. Показан кэшированный каталог.',
            severity: 'warning'
          });
        } else {
          setNotification({
            open: true,
            message: 'Не удалось загрузить товары. Пожалуйста, проверьте подключение к интернету.',
            severity: 'error'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product) => {
    const result = addToCart(product);

    if (!result.success) {
      setNotification({
        open: true,
        message: result.message,
        severity: 'warning'
      });
    }
  }, [addToCart]);

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  const isAddToCartDisabled = useCallback((productId) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    return Boolean(cartItem && cartItem.quantity >= MAX_QUANTITY_PER_PRODUCT);
  }, [cartItems, MAX_QUANTITY_PER_PRODUCT]);

  return (
    <div className="catalog">
      <div className="catalog__container">
        <h2 className="catalog__title">Каталог товаров</h2>
        {isLoading ? (
          <p className="catalog__loading">Загрузка товаров...</p>
        ) : (
          <ProductGrid
            products={productsList}
            onAddToCart={handleAddToCart}
            isAddToCartDisabled={isAddToCartDisabled}
          />
        )}
      </div>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity || 'warning'}
        onClose={handleCloseNotification}
      />
    </div>
  );
}

