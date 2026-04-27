import {
  ApiError,
  NetworkError,
  RateLimitError,
  InvalidResponseError,
  ServiceUnavailableError
} from './apiErrors';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Выполняет fetch запрос с логикой повторных попыток (retry) и кэшированием (fallback).
 * 
 * @param {string} url - URL для запроса
 * @param {object} options - Опции fetch
 * @param {object} customConfig - Дополнительные настройки (retries, retryDelay, cacheKey, cacheTTL, fallbackData)
 * @returns {Promise<any>} Ответ от API
 */
export const fetchWithRetry = async (url, options = {}, customConfig = {}) => {
  const {
    retries = 3,
    retryDelay = 1000,
    cacheKey = null,
    cacheTTL = 1000 * 60 * 60, // 1 час по умолчанию
    fallbackData = undefined, // Резервные данные, если кэш пуст и API недоступно
  } = customConfig;

  // Если есть кэш и он валиден, можно сразу вернуть его (если это GET запрос)
  // Но обычно кэш используется как fallback при ошибке.
  // Здесь реализуем fallback-стратегию: если оффлайн, сразу берем из кэша или fallbackData.
  if (!navigator.onLine) {
    const error = new NetworkError();
    if (cacheKey) {
      const cached = getCachedData(cacheKey, cacheTTL);
      if (cached) {
        error.cachedData = cached;
        throw error;
      }
    }
    if (fallbackData !== undefined) {
      console.warn(`[apiClient] Оффлайн. Доступны резервные данные для ${url}`);
      error.fallbackData = fallbackData;
    }
    throw error;
  }

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (!navigator.onLine) {
        throw new NetworkError();
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 429) {
          throw new RateLimitError();
        }
        if (response.status >= 500 && response.status <= 599) {
          throw new ServiceUnavailableError(`Сервис недоступен (код ${response.status})`);
        }
        throw new ApiError(`Ошибка запроса: ${response.status} ${response.statusText}`, response.status);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new InvalidResponseError();
      }

      // Сохраняем успешный ответ в кэш
      if (cacheKey) {
        setCachedData(cacheKey, data);
      }

      return data;
    } catch (error) {
      lastError = error;

      // Не повторяем запрос для клиентских ошибок (400-499), кроме 429 (Rate Limit)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      // Если это последняя попытка
      if (attempt === retries) {
        // Fallback: пытаемся достать из кэша при сетевой ошибке или недоступности сервиса
        if (cacheKey && (error instanceof NetworkError || error instanceof ServiceUnavailableError || error instanceof RateLimitError)) {
          const cached = getCachedData(cacheKey, cacheTTL);
          if (cached) {
            console.warn(`[apiClient] Возвращены кэшированные данные для ${url} из-за ошибки:`, error.message);
            error.cachedData = cached;
            throw error;
          }
        }
        
        // Если кэша нет, но есть fallbackData (graceful degradation)
        if (fallbackData !== undefined) {
          console.warn(`[apiClient] Доступны резервные данные для ${url} из-за ошибки:`, error.message);
          error.fallbackData = fallbackData;
        }

        throw error;
      }

      // Ждем перед следующей попыткой (экспоненциальная задержка: 1s, 2s, 4s...)
      const waitTime = retryDelay * Math.pow(2, attempt);
      console.warn(`[apiClient] Ошибка запроса (${error.message}). Попытка ${attempt + 1} из ${retries}. Ожидание ${waitTime}мс...`);
      await delay(waitTime);
    }
  }

  throw lastError;
};

/**
 * Получает данные из localStorage, если они не устарели.
 */
function getCachedData(key, ttl) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
}

/**
 * Сохраняет данные в localStorage с текущей меткой времени.
 */
function setCachedData(key, data) {
  try {
    const item = JSON.stringify({
      timestamp: Date.now(),
      data
    });
    localStorage.setItem(key, item);
  } catch (e) {
    console.error('[apiClient] Ошибка при сохранении в кэш:', e);
  }
}
