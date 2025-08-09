# ==== Build frontend ====
FROM node:20 AS frontend
WORKDIR /client

# Копіюємо package.json для кешу залежностей
COPY client/package*.json ./
RUN npm ci

# Копіюємо решту коду і збираємо білд
COPY client/ .
RUN npm run build


# ==== Build backend ====
FROM node:20 AS backend
WORKDIR /server

# Копіюємо package.json для кешу залежностей
COPY server/package*.json ./
RUN npm ci

# Копіюємо решту коду бекенду
COPY server/ .

# Копіюємо зібраний фронт із попередньої стадії
COPY --from=frontend /client/dist ./public

# Компілюємо TypeScript у /server/dist
RUN npm run build


# ==== Production container ====
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Копіюємо тільки package.json і ставимо прод-залежності
COPY --from=backend /server/package*.json ./
RUN npm ci --omit=dev

# Копіюємо скомпільований бекенд
COPY --from=backend /server/dist ./dist

# Копіюємо статичні файли фронта
COPY --from=backend /server/public ./dist/public

EXPOSE 3000
CMD ["node", "dist/server.js"]
