# Home Library REST API

This is a RESTful API for managing a music library, built with **NestJS** and **TypeORM**. It supports CRUD operations for **Artists**, **Albums**, **Tracks**, **Favorites**, and **Users**, with data stored in a **PostgreSQL** database. The API is documented using an OpenAPI 3.0 specification (`doc/api.yaml`), which can be imported into Postman or viewed via Swagger UI.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [With Docker (Recommended)](#with-docker-recommended)
  - [Without Docker (Local Development)](#without-docker-local-development)
- [Running Tests](#running-tests)
- [Linting and Formatting](#linting-and-formatting)
- [Database Migrations](#database-migrations)
- [Vulnerability Scanning](#vulnerability-scanning)
- [Docker Hub](#docker-hub)
- [API Documentation](#api-documentation)
  - [Swagger UI](#swagger-ui)
  - [Importing OpenAPI Specification](#importing-openapi-specification)
- [Testing with Postman](#testing-with-postman)
  - [Postman Testing Examples](#postman-testing-examples)
- [Debugging in VSCode](#debugging-in-vscode)

## Prerequisites

- **Docker** and **Docker Compose** installed ([Install Docker](https://docs.docker.com/get-docker/)).
- **Node.js** v22.16.0 (if running without Docker).
- **PostgreSQL** (if running without Docker, optional for local development).
- **Git** for cloning the repository.
- **Postman** (optional, for manual API testing).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/nadyavalin/nodejs2025Q2-service
   cd nodejs2025Q2-service
   ```

2. **Install dependencies** (if running without Docker):

   ```bash
   npm install
   ```

3. **Create `.env` file**:

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Example `.env`:
   ```
   PORT=4000
   CRYPT_SALT=10
   JWT_SECRET_KEY=secret123
   JWT_SECRET_REFRESH_KEY=refresh123
   TOKEN_EXPIRE_TIME=1h
   TOKEN_REFRESH_EXPIRE_TIME=24h
   DATABASE_HOST=db
   DATABASE_PORT=5432
   DATABASE_USER=library_user
   DATABASE_PASSWORD=library_password
   DATABASE_NAME=home_library
   ```

## Running the Application

### With Docker (Recommended)

The application is containerized with Docker, including a PostgreSQL database and a test service.

1. **Build and start services**:

   ```bash
   docker-compose up -d --build
   ```

   - Application (`app`) runs at `http://localhost:4000`.
   - PostgreSQL (`db`) is accessible internally.
   - Test service (`test`) is available for running tests.
   - Swagger UI is at `http://localhost:4000/doc`.

2. **Create test database**:

   ```bash
   docker exec -it nodejs2025q2-service-db-1 psql -U postgres -c "CREATE DATABASE home_library_test OWNER library_user;"
   docker exec -it nodejs2025q2-service-db-1 psql -U library_user -d home_library_test -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
   ```

3. **Apply migrations**:

   For main database (`home_library`):

   ```bash
   docker-compose exec app npm run migration:run
   ```

   For test database (`home_library_test`):

   ```bash
   docker-compose exec test npm run migration:run
   ```

4. **Check container status**:

   ```bash
   docker ps -a
   ```

5. **View logs**:

   ```bash
   docker logs nodejs2025q2-service-app-1
   docker logs nodejs2025q2-service-db-1
   docker logs nodejs2025q2-service-test-1
   ```

6. **Stop and remove containers**:

   ```bash
   docker-compose down --volumes
   ```

### Without Docker (Local Development)

1. **Start PostgreSQL**:

   Ensure a local PostgreSQL server is running with databases `home_library` and `home_library_test` created, matching `.env` and `.env.test` credentials.

2. **Apply migrations**:

   ```bash
   npm run migration:run
   ```

   For test database, set `NODE_ENV=test`:

   ```bash
   NODE_ENV=test npm run migration:run
   ```

3. **Start in development mode**:

   ```bash
   npm run start:dev
   ```

   Or in production mode:

   ```bash
   npm run build
   npm run start:prod
   ```

   - Server runs at `http://localhost:4000`.
   - Swagger UI is at `http://localhost:4000/doc`.

## Running Tests

The application includes 40/67 end-to-end (E2E) tests using Jest and Supertest.

1. **Run tests with Docker**:

   ```bash
   docker-compose exec test npm run test
   ```

2. **Run tests locally** (requires server running):

   ```bash
   npm run test
   ```

3. **Run specific test suites**:

   ```bash
   npm run test -- test/users.e2e.spec.ts
   npm run test -- test/artists.e2e.spec.ts
   npm run test -- test/albums.e2e.spec.ts
   npm run test -- test/tracks.e2e.spec.ts
   npm run test -- test/favorites.e2e.spec.ts
   ```

**Note**: Ensure the test database (`home_library_test`) is created and migrations are applied before running tests.

## Linting and Formatting

1. **Run linting** (ESLint):

   With Docker:

   ```bash
   docker-compose exec app npm run lint
   ```

   Locally:

   ```bash
   npm run lint
   ```

2. **Format code** (Prettier):

   ```bash
   npm run format
   ```

## Database Migrations

Database schema is managed with TypeORM migrations.

1. **Apply migrations**:

   For main database:

   ```bash
   docker-compose exec app npm run migration:run
   ```

   For test database:

   ```bash
   docker-compose exec test npm run migration:run
   ```

2. **Verify tables**:

   ```bash
   docker exec -it nodejs2025q2-service-db-1 psql -U library_user -d home_library -c "\dt"
   docker exec -it nodejs2025q2-service-db-1 psql -U library_user -d home_library_test -c "\dt"
   ```

## Vulnerability Scanning

Scan Docker images.
**Run scan**:

   ```bash
   npm run scan
   ```

   Or directly:

   ```bash
   trivy image nadyavalin/library-app:latest
   trivy image postgres:16
   ```

## Docker Hub

The application image is available on Docker Hub:

- **Pull image**:

   ```bash
   docker pull nadyavalin/library-app:latest
   ```

- **Run image**:

   ```bash
   docker-compose up -d
   ```

## API Documentation

The API is documented in `doc/api.yaml` (OpenAPI 3.0).

### Swagger UI

1. Start the application:

   ```bash
   docker-compose up -d app
   ```

2. Open `http://localhost:4000/doc` in a browser.

3. Use **Try it out** to test endpoints interactively.

### Importing OpenAPI Specification

1. Open Postman.
2. Click **Import** > **File** > select `doc/api.yaml`.
3. Set base URL to `http://localhost:4000`.

## Testing with Postman

Ensure the server is running (`docker-compose up -d app`). All requests use `Accept: application/json`. POST and PUT requests use `Content-Type: application/json`.

### Authentication

- **Create User**:

  ```
  POST http://localhost:4000/user
  Content-Type: application/json
  Body:
  {
    "login": "testUser",
    "password": "testPassword"
  }
  ```

  Response (201 Created):
  ```json
  {
    "id": "<uuid>",
    "login": "testUser",
    "version": 1,
    "createdAt": <timestamp>,
    "updatedAt": <timestamp>
  }
  ```

### Artists Endpoints

- **Create Artist**:

  ```
  POST http://localhost:4000/artist
  Content-Type: application/json
  Body:
  {
    "name": "TEST_artist",
    "grammy": true
  }
  ```

  Response (201 Created):
  ```json
  {
    "id": "<uuid>",
    "name": "TEST_artist",
    "grammy": true
  }
  ```

- **Get All Artists**:

  ```
  GET http://localhost:4000/artist
  ```

  Response (200 OK):
  ```json
  [
    {
      "id": "<uuid>",
      "name": "TEST_artist",
      "grammy": true
    }
  ]
  ```

- **Get Artist by ID**, **Update Artist**, **Delete Artist**: Use `/artist/<artist-id>`.

### Albums Endpoints

- **Create Album**:

  ```
  POST http://localhost:4000/album
  Content-Type: application/json
  Body:
  {
    "name": "TEST_album",
    "year": 2023,
    "artistId": "<artist-id>"
  }
  ```

  Response (201 Created):
  ```json
  {
    "id": "<uuid>",
    "name": "TEST_album",
    "year": 2023,
    "artistId": "<artist-id>"
  }
  ```

- **Get All Albums**, **Get Album by ID**, **Update Album**, **Delete Album**: Use `/album` and `/album/<album-id>`.

### Tracks Endpoints

- **Create Track**:

  ```
  POST http://localhost:4000/track
  Content-Type: application/json
  Body:
  {
    "name": "TEST_track",
    "albumId": null,
    "artistId": "<artist-id>",
    "duration": 200
  }
  ```

  Response (201 Created):
  ```json
  {
    "id": "<uuid>",
    "name": "TEST_track",
    "albumId": null,
    "artistId": "<artist-id>",
    "duration": 200
  }
  ```

- **Get All Tracks**, **Get Track by ID**, **Update Track**, **Delete Track**: Use `/track` and `/track/<track-id>`.

### Favorites Endpoints

- **Add Artist to Favorites**:

  ```
  POST http://localhost:4000/favs/artist/<artist-id>
  Content-Type: application/json
  ```

  Response (201 Created).

- **Get Favorites**:

  ```
  GET http://localhost:4000/favs
  ```

  Response (200 OK):
  ```json
  {
    "artists": [{ "id": "<uuid>", "name": "TEST_artist", "grammy": true }],
    "albums": [],
    "tracks": []
  }
  ```

- **Remove Artist from Favorites**:

  ```
  DELETE http://localhost:4000/favs/artist/<artist-id>
  ```

  Response (204 No Content).

- **Add/Remove Albums/Tracks**: Use `/favs/album/<album-id>`, `/favs/track/<track-id>`.

## Debugging in VSCode

1. Open the project in VSCode.
2. Press `F5` to start debugging.
3. See [VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging).