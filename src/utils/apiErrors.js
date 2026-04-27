/**
 * Базовый класс для ошибок API
 */
export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Ошибка сети (отсутствие интернета или недоступность сервера на уровне сети)
 */
export class NetworkError extends ApiError {
  constructor(message = 'Ошибка сети. Проверьте подключение к интернету.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Ошибка превышения лимита запросов (HTTP 429)
 */
export class RateLimitError extends ApiError {
  constructor(message = 'Превышен лимит запросов. Пожалуйста, подождите.') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Ошибка неверного ответа от сервера (невозможно распарсить JSON и т.д.)
 */
export class InvalidResponseError extends ApiError {
  constructor(message = 'Неверный формат ответа от сервера.') {
    super(message, 500);
    this.name = 'InvalidResponseError';
  }
}

/**
 * Ошибка недоступности сервиса (HTTP 502, 503, 504)
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message = 'Сервис временно недоступен. Повторите попытку позже.') {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}
