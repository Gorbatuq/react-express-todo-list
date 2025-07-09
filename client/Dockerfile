# build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM node:18
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--port", "4173", "--host"]
