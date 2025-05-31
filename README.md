# Home Library REST API

This is a RESTful API for managing a music library, built with **NestJS**. It supports CRUD operations for **Artists**, **Albums**, **Tracks**, **Favorites**, and **Users**, with data stored in an in-memory repository. The API is documented using an OpenAPI 3.0 specification (`doc/api.yaml`), which can be imported into Postman for testing or viewed via Swagger UI.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
  - [Swagger UI](#swagger-ui)
  - [Importing OpenAPI Specification](#importing-openapi-specification)
- [Testing with Postman](#testing-with-postman)
  - [Postman Testing Examples](#postman-testing-examples)
- [Linting and Formatting](#linting-and-formatting)
- [Debugging in VSCode](#debugging-in-vscode)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/nadyavalin/nodejs2025Q2-service
   ```

   ```bash
   cd nodejs2025Q2-service
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   Create a `.env` file in the root directory and specify the port `4000`.
   You can create it from `.env.example`.

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run start:dev
```

- The server will start at `http://localhost:4000`.
- Code changes will automatically restart the server.
- Swagger UI is available at `http://localhost:4000/doc`.

### Production Mode

To build and run the application in production mode:

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm run start:prod
   ```

- The server will start at `http://localhost:4000`.
- Swagger UI is available at `http://localhost:4000/doc`.

## Running Tests

Run end-to-end (e2e) tests using Jest.
**Run all test suites without authorization:**

```bash
npm run test
```

or

```bash
npm run test -- test/*.spec.ts
```

Cover endpoints for `Artists`, `Albums`, `Tracks`, `Favorites`, `Users`.

Run a specific test suite:

```bash
npm run test -- test/users.e2e.spec.ts
```

```bash
npm run test -- test/artists.e2e.spec.ts
```

```bash
npm run test -- test/albums.e2e.spec.ts
```

```bash
npm run test -- test/tracks.e2e.spec.ts
```

```bash
npm run test -- test/favorites.e2e.spec.ts
```

**Run all tests with authorization:**
(not implemented yet)

Before running tests, make sure the server is running.

## API Documentation

The API is documented in the OpenAPI 3.0 specification file located at `doc/api.yaml`. This file describes all endpoints, request/response schemas, and can be viewed interactively via Swagger UI or imported into Postman for testing.

### Swagger UI

Swagger UI provides an interactive interface to explore and test the API endpoints defined in `doc/api.yaml`.

**How to launch Swagger UI**:

1. Start the application in development or production mode:
   ```bash
   npm run start:dev
   ```
   or
   ```bash
   npm run build
   npm run start:prod
   ```
2. Open a browser and navigate to `http://localhost:4000/doc`.
   - You will see the Swagger UI interface displaying all API endpoints grouped by tags (e.g., `User`, `Artist`, `Album`, `Track`, `Favorites`).

**How to use Swagger UI**:

- Browse endpoints to view their descriptions, parameters, request bodies, and possible responses.
- Use the **Try it out** button to test endpoints directly in the browser:
  1. Click on an endpoint (e.g., `POST /artist`).
  2. Click **Try it out**.
  3. Enter a request body (e.g., `{ "name": "TEST_artist", "grammy": true }`).
  4. Click **Execute** to send the request and view the response.
- The interface supports testing CRUD operations for all entities (`Artists`, `Albums`, `Tracks`, `Favorites`, `Users`).
- For more information about Swagger, visit [https://swagger.io](https://swagger.io).

### Importing OpenAPI Specification

To test the API in Postman:

1. Open Postman.
2. Click **Import** > **File** > select `doc/api.yaml`.
3. Postman will generate a collection with all endpoints.
4. Set the base URL to `http://localhost:4000` in the collection variables (if necessary).

## Testing with Postman

Below are examples of testing each endpoint using Postman. Ensure the server is running (`npm run start:dev`). All requests use `Accept: application/json` headers. POST and PUT requests use `Content-Type: application/json` headers.

### Authentication

First, create a user.

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

- **Get Artist by ID**:

  ```
  GET http://localhost:4000/artist/<artist-id>
  ```

  Response (200 OK):

  ```json
  {
    "id": "<uuid>",
    "name": "TEST_artist",
    "grammy": true
  }
  ```

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

- **Update Artist**:

  ```
  PUT http://localhost:4000/artist/<artist-id>
  Content-Type: application/json
  Body:
  {
    "name": "Updated_artist",
    "grammy": false
  }
  ```

  Response (200 OK):

  ```json
  {
    "id": "<uuid>",
    "name": "Updated_artist",
    "grammy": false
  }
  ```

- **Delete Artist**:
  ```
  DELETE http://localhost:4000/artist/<artist-id>
  ```
  Response (204 No Content).

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

- **Get All Albums**, **Get Album by ID**, **Update Album**, **Delete Album**: Use `/album` and `/album/<album-id>` (similar to Artists).

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

- **Get All Tracks**, **Get Track by ID**, **Update Track**, **Delete Track**: Use `/track` and `/track/<track-id>` (similar to Artists).

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

- **Add/Remove Albums/Tracks to Favorites**: Use `/favs/album/<album-id>`, `/favs/track/<track-id>` (similar to Artists).

## Linting and Formatting

To fix linting issues:

```bash
npm run lint
```

To format code with Prettier:

```bash
npm run format
```

## Debugging in VSCode

1. Open the project in VSCode.
2. Press `F5` to start debugging.
3. For more details, visit: [VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging).
