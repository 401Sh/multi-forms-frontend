# Тесты для компонента SignIn

## Проверки:

- ✅ Рендеринг базовых элементов:
  - Поле логина
  - Поле пароля
  - Кнопка "Sign In"

- 🛑 Валидация:
  - Показывается ошибка, если поле логина пустое
  - Показывается ошибка, если поле пароля пустое

- 📤 Успешный вход:
  - Запрос к API (`/auth/signin`)
  - Сохраняется токен в `localStorage`
  - Вызывается `setAuth(true)`
  - Переход на страницу `/profile`

- ❌ Ошибки при входе:
  - Отображается сообщение об ошибке с сервера (`error.response.data.message`)
  - Если ошибка без ответа — показывается "Error signing in"

# Тесты для компонента SignUp

## Проверки:

- ✅ Рендеринг базовых элементов:
  - Поле логина
  - Поле пароля
  - Поле подтверждения пароля
  - Кнопка "Sign Up"

- 🛑 Валидация:
  - Показывается ошибка, если поле логина пустое
  - Показывается ошибка, если поле пароля пустое
  - Показывается ошибка, если пароли не совпадают

- 📤 Успешная регистрация:
  - Запрос к API (`/auth/signup`)
  - Сохраняется токен в `localStorage`
  - Вызывается `setAuth(true)`
  - Переход на страницу `/profile`

- ❌ Ошибки при регистрации:
  - Отображается сообщение об ошибке с сервера (`error.response.data.message`)
  - Если ошибка без ответа — показывается "Error signing in"