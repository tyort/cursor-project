/* eslint-env node */
module.exports = {
  // Считаем этот конфиг корневым, чтобы ESLint не искал настройки выше по дереву.
  root: true,
  env: {
    // Разрешаем глобальные переменные браузера (window, document и т.д.).
    browser: true,
    // Включаем актуальные глобалы стандарта ECMAScript 2024.
    es2024: true,
  },
  parserOptions: {
    // Поддержка синтаксиса JavaScript уровня ES2024.
    ecmaVersion: 2024,
    // Используем ES-модули (import/export).
    sourceType: 'module',
    ecmaFeatures: {
      // Включаем парсинг JSX для React-компонентов.
      jsx: true,
    },
  },
  // Базовый набор правил проекта для React от HTML Academy.
  extends: ['htmlacademy/react'],
  settings: {
    react: {
      // Автоопределение версии React для корректной работы react-правил.
      version: 'detect',
    },
  },
  rules: {
    // Разрешаем текущий стиль именования файлов без проверки плагином.
    'check-file/filename-naming-convention': 'off',
    // Разрешаем текущий стиль именования папок без проверки плагином.
    'check-file/folder-naming-convention': 'off',
    // Не требуем PropTypes (актуально при использовании альтернативной типизации).
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  ],
};
