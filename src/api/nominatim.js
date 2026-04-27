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
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept-Language': 'ru-RU,ru;q=0.9',
        'User-Agent': 'ai-project-app/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка геокодирования: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Ошибка при запросе к Nominatim API:', error.message || error);
    throw error;
  }
};
