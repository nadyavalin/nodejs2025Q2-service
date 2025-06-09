FROM node:22.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=optional && npm cache clean --force
COPY tsconfig.json tsconfig.build.json jest.config.json ./
COPY src ./src
COPY test ./test
COPY doc ./doc
COPY .eslintrc.js .prettierrc ./
RUN npm run build && npm run migration:compile
RUN cp /app/test/auth/.e2e.spec.ts /app/test/refresh/.e2e.spec.ts /app/test/ || true

FROM node:22.16.0-slim AS final
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --omit=optional && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc
COPY --from=builder /app/jest.config.json ./jest.config.json
COPY --from=builder /app/test ./test
COPY --from=builder /app/src ./src
COPY --from=builder /app/.eslintrc.js ./.eslintrc.js
COPY --from=builder /app/.prettierrc ./.prettierrc
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 4000
CMD ["node", "dist/main"]