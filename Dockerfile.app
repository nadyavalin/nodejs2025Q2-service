FROM node:22.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

FROM node:22.16.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production && \
    npm install ts-node typeorm-ts-node-commonjs && \
    npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/entities ./src/entities
COPY --from=builder /app/src/data-source.ts ./src/
COPY --from=builder /app/src/migration ./src/migration
EXPOSE 4000
CMD ["node", "dist/main"]