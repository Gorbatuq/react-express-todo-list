# React–Express Todo List

Full-stack task management application built as a pet project to practice the full development cycle: frontend, backend, database, and deployment.

🔗 Live demo: [https://todo-list-baby.onrender.com](https://todo-list-baby.onrender.com)

---

## Frontend

Production-ready SPA built with React and TypeScript. Architecture is based on a strict API layer, feature-oriented structure, and explicit contracts defined with Zod.

### Tech Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- Zod
- Testing Library / Vitest

### Architectural Principles

- Single entry point to backend — only via `src/api`
- Frontend–backend contracts enforced with Zod
- Feature-first (vertical slice) architecture
- Minimal global state
- `shared` does not depend on `features`

### Project Structure

```
src/
├─ api/                         # Backend communication layer
│  ├─ core/                     # Low-level HTTP infrastructure
│  ├─ resources/                # auth / groups / tasks endpoints
│  └─ schema/                   # Zod contracts (DTOs + errors)
│
├─ app/                         # App root
│  ├─ App.tsx
│  └─ main.tsx                  # QueryClientProvider, Router, etc.
│
├─ context/                     # Theme context
├─ features/                    # Business features (vertical slices)
│  ├─ auth/                     # Auth UI (login / register / guest / forgot)
│  │  └─ components/
│  └─ taskGroup/                # Todo groups + tasks + drag-and-drop
│     ├─ components/
│     ├─ hooks/                 # queries, DnD handler, filters
│     └─ validation/            # group / task Zod schemas
│
├─ hooks/                       # Cross-feature hooks (auth queries/mutations)
├─ lib/                         # queryClient
├─ pages/                       # Route-level pages
├─ routes/                      # Route guards + route map
├─ shared/                      # Reusable UI, form helpers, auth schemas
├─ store/                       # Zustand UI store
├─ types/                       # Shared TS types
└─ __tests__/                   # API + UI tests
```

### Data Flow

```
UI → feature → api/resources → api/core → backend
```

All errors are normalized via `normalizeError`. The UI works with a single, consistent response format.

### Routing

Implemented with React Router and guard components:

- `ProtectedRoute` — blocks private pages for unauthenticated users
- `PublicOnlyRoute` — blocks auth pages for logged-in users

Route map (`src/routes/AppRoutes.tsx`):

- `/` → redirects to `/todo` if authenticated, otherwise `/welcome`
- `/welcome` (public-only)
- `/auth` (public-only)
- `/reset-password?token=...` (public-only)
- `/todo` (protected)
- `/profile` (protected)

Auth state is derived from `useMe()` (`queryKey: ["me"]`).

### Features

#### Auth (`src/features/auth`)

UI-only feature components:

- `AuthShell` — shared layout for auth screens
- `AuthForm` — login / register / continue as guest
- `ForgotPasswordForm` — reset link request

Mutations live in `src/hooks/auth/useAuthMutations.ts` and call `authApi`.

Password reset is handled on `/reset-password`, reading `token` from the query string and submitting a Zod-validated payload.

#### Task Groups / Tasks (`src/features/taskGroup`)

Core todo functionality:

- Groups list / grid UI
- Group card with header, filters, and task list
- Task item controls (checkbox, inline edit, delete)
- Confirm modal for destructive actions

Drag-and-drop:

- Implemented with `@hello-pangea/dnd`
- `useHandleDragEnd` supports:

  - group reorder (`groupsApi.reorder`)
  - task reorder inside group (`tasksApi.reorder`)
  - task move across groups (`tasksApi.update` with `{ groupId, toIndex }`)

React Query:

- Groups: `["groups"]`
- Tasks: `["tasks", groupId]`
- Optimistic updates for reorder/move with rollback on error

Validation:

- Feature schemas: `src/features/taskGroup/validation`
- Shared auth schemas: `src/shared/validation/authSchemas.ts`

### API Layer

- Direct `fetch` / `axios` usage outside `api/` is forbidden
- One file per backend resource in `api/resources`
- All request and response shapes defined with Zod

### State Management

- Zustand is used only for global UI state
- Business state is localized inside features

### Development

```
npm install
npm run dev
```

### Build

```
npm run build
```

---

## Backend

Production-grade REST API built with Express and TypeScript. Designed to support a SPA frontend with cookie-based authentication, strict data integrity, and deterministic ordering logic.

### Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT (httpOnly cookies)
- Nodemailer
- node-cron

### Architectural Principles

- Strict layered architecture: Routes → Controllers → Usecases → Repositories → Models
- Controllers are thin and contain no business logic
- All business rules live in usecases
- Database access is isolated in repositories
- Explicit validation and API contracts
- Deterministic error and response formats

### Project Structure

```
src/
├─ app.ts            # Express setup and middleware
├─ server.ts         # App bootstrap and cron startup
│
├─ config/           # Environment and database configuration
├─ routes/           # API route definitions
├─ controllers/      # HTTP adapters
├─ usecases/         # Business logic
├─ repositories/     # Database access
├─ models/           # Mongoose schemas and indexes
│
├─ validation/       # Zod schemas (body / params / query)
├─ dto/              # API response shaping
│
├─ middleware/       # auth, csrf, validation, error handling
├─ services/         # cookies, mailer, auth mail service
├─ jobs/             # Scheduled background jobs
├─ scripts/          # One-off maintenance scripts
├─ utils/            # Shared helpers
└─ types/            # Express type augmentation
```

### Request Flow

```
HTTP request
→ route
→ controller
→ usecase
→ repository
→ database
→ DTO
→ HTTP response
```

Each layer has a single responsibility and does not leak concerns.

### Authentication

- JWT stored in an httpOnly cookie (`token`)
- Client sends requests with credentials enabled
- Auth middleware:

  - verifies JWT
  - loads user id and role
  - attaches `req.user`

Supports registered users and guest users with limited capabilities.

### Authorization & Rules

- All resources are user-owned
- Ownership validated in usecases
- Guest users have enforced limits
- Destructive actions are transactional

### Ordering & Consistency

- Groups and tasks use explicit `order` fields with unique indexes
- Bulk reorder uses a two-phase strategy: temporary negative orders → final orders
- Range shifts applied deterministically (ASC / DESC)

This guarantees safe reordering under strict unique constraints.

### Background Jobs

- Cleanup of inactive guest users
- Expired password reset tokens via TTL indexes
- One-off maintenance scripts

### Error Handling

- Centralized error handler
- Single error response format
- Field-level validation errors
- Request ID included for traceability

### Environment Configuration

- Fully validated via Zod on startup
- Fail-fast on invalid or missing config
- Cookie, JWT, mail, and security settings via ENV

### Notes

The backend is designed as a real-world system with predictable behavior, explicit rules, safe data mutations, and frontend-oriented API design. New features are added by extending layers without refactoring the core.
