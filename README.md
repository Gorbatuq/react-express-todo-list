# React-Express Todo List

Full-stack застосунок для керування завданнями. Реалізований як pet-проєкт для практики повного циклу розробки (frontend + backend + база + деплой).

🔗 [Live demo](https://todo-list-baby.onrender.com)

---

## ✨ Функціонал

- Реєстрація та вхід з JWT (HttpOnly cookie)
- Гостьовий режим (можна створювати задачі без акаунта)
- CRUD для задач і груп
- Drag & Drop для сортування (на базі `@hello-pangea/dnd`)
- Пріоритети завдань та груп
- Валідація через **Zod**
- Захист даних між користувачами
- Dockerized середовище (dev + prod)

---

## 🛠️ Технології

**Frontend**

- React 19 + Vite + TypeScript
- Zustand (state management), React Query (data fetching)
- TailwindCSS (UI), react-toastify (нотифікації)

**Backend**

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod для валідації
- JWT авторизація (HttpOnly cookie)

**Інше**

- ESLint для статичного аналізу
- Docker + Docker Compose для локального запуску і деплою

---

## 🚀 Запуск локально

### Backend

```bash
cd server
npm install
npm run dev
```
