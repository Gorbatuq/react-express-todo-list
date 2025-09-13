# React-Express Todo List

A full-stack task management application built as a pet project to practice the complete development cycle (frontend + backend + database + deployment).

🔗 [Live demo](https://todo-list-baby.onrender.com)

---

## ✨ Features

- User registration & login with JWT (HttpOnly cookie)
- Guest mode (create tasks without an account)
- CRUD for tasks and groups
- Drag & Drop sorting (powered by `@hello-pangea/dnd`)
- Task and group priorities
- Validation with **Zod**
- Data isolation between users
- Dockerized environment (dev + prod)

---

## 🛠️ Tech Stack

**Frontend**

- React 19 + Vite + TypeScript
- Zustand (state management), React Query (data fetching)
- TailwindCSS (UI), react-toastify (notifications)

**Backend**

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod for validation
- JWT authentication (HttpOnly cookie)

**Other**

- ESLint for static analysis
- Docker + Docker Compose for local development and deployment

---

## 🚀 Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```
