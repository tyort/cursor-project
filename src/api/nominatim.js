import { fetchWithRetry } from '../utils/apiClient';

/**
 * Выполняет геокодирование адреса через Nominatim API (OpenStreetMap).
 * Важно: API разрешает не более 1 запроса в секунду.
 *
 * @param {string} address - Искомый адрес
 * @returns {Promise<Array<{lat: string, lon: string, display_name: string}> | null>} Массив объектов с координатами и названием или null
 */
export const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.append('q', address);
  url.searchParams.append('format', 'json');

  try {
    const data = await fetchWithRetry(
      url.toString(),
      {
        method: 'GET',
        headers: {
          'Accept-Language': 'ru-RU,ru;q=0.9',
          'User-Agent': 'ai-project-app/1.0'
        }
      },
      {
        retries: 2, // 2 повторные попытки (всего 3 запроса)
        retryDelay: 1500, // задержка 1.5с (из-за лимита Nominatim)
        cacheKey: `geocode_${address}`, // Кэширование запросов
        cacheTTL: 1000 * 60 * 60 * 24 // 24 часа кэш
      }
    );

    return data;
  } catch (error) {
    if (error.cachedData) {
      console.warn('Использованы кэшированные данные для геокодирования из-за ошибки:', error.message);
      return error.cachedData;
    }
    
    console.error('Ошибка при запросе к Nominatim API:', error.message || error);
    throw error;
  }
};
