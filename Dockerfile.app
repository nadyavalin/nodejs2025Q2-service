FROM node:22.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY doc ./doc
RUN npm run build

FROM node:22.16.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc
CMD ["npm", "run", "start:prod"]