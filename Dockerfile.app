FROM node:22.16.0 AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libpq-dev \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:22.16.0
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 4000

CMD ["npm", "run", "start:prod"]