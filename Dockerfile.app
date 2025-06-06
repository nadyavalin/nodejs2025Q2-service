# Этап 1: Сборка
FROM node:22.16.0 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

# Этап 2: Продакшен
FROM node:22.16.0-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc

EXPOSE 4000

CMD ["npm", "run", "start:prod"]