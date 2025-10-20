# BS API (ts-blog)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A TypeScript-based REST API for a blog application, built with Express.js and Bun. This project follows Test-Driven Development (TDD) principles to ensure robust and maintainable code.

## Links

- [API Documentation](http://localhost:3000/docs) (when running locally)
- [Contributing Guide](CONTRIBUTING.md)
- [GitHub Repository](https://github.com/Blich-Studio/bs-api)

## Features

- User authentication and profile management via Supabase
- Article creation, retrieval, and management with MongoDB
- Comment system for articles
- Like functionality
- Health check endpoint
- Comprehensive API documentation via Swagger UI
- Automatic OpenAPI spec generation from code comments

## Tech Stack

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB for CMS data (articles, comments, etc.)
- **Authentication**: Supabase for user management and auth
- **Testing**: Vitest with coverage reporting
- **Linting/Formatting**: ESLint and Prettier
- **Documentation**: OpenAPI 3.0 specification with swagger-jsdoc
- **Security**: Helmet for HTTP headers
- **Logging**: Morgan middleware

## Installation

To install dependencies:

```bash
bun install
```

## Configuration

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

### Environment Variables

- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Your Supabase anonymous key
- **PORT**: Server port (default: 3000)
- **NODE_ENV**: Environment (development/production)
- **OPENAPI_TITLE**: API title for OpenAPI docs
- **OPENAPI_VERSION**: API version
- **OPENAPI_DESCRIPTION**: API description
- **OPENAPI_SERVER_URL**: Server URL for OpenAPI docs

## Usage

### Development

Run the server in watch mode for development:

```bash
bun run dev
```

### Production

Start the server:

```bash
bun run start
```

The server will run on the configured port (check `PORT` in `.env.local`).

## API Documentation

Once the server is running, visit `/docs` to access the Swagger UI for interactive API documentation.

The OpenAPI specification is generated automatically from JSDoc comments in the code.

## Testing

This project is developed using Test-Driven Development (TDD). All features are backed by comprehensive unit and integration tests.

### Run All Tests

```bash
bun run test
```

### Run Unit Tests Only

```bash
bun run test:unit
```

### Run Integration Tests Only

```bash
bun run test:integration
```

### Test Coverage

Generate coverage report:

```bash
bun run test:coverage
```

### Watch Mode

Run tests in watch mode during development:

```bash
bun run test:watch
```

## Project Structure

```
src/
├── app.ts              # Main Express app setup
├── server.ts           # Server entry point
├── controllers/        # Route handlers
├── routes/             # Route definitions
├── schemas/            # Data validation schemas
├── services/           # Business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── middleware/         # Custom middleware
└── __tests__/          # Test files
    ├── unit/           # Unit tests
    └── integration/    # Integration tests
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
