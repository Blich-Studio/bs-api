# Release Notes - v0.2.4 (Pre-Alpha)

**Release Date:** October 21, 2025

## ⚠️ Pre-Alpha Release

This is the **first official pre-alpha release** of BS API. While the core functionality is in place and tested, this release should be considered unstable and not suitable for production use. We welcome feedback and bug reports to help us improve before the stable 1.0 release.

## 🎉 What's New

### Core Features

- **User Authentication & Profile Management** - Secure authentication integration with Supabase for user management
- **Article Management** - Full CRUD operations for articles with MongoDB persistence
- **Comment System** - Create, retrieve, and manage comments on articles
- **Like Functionality** - Track user likes on articles
- **Health Check Endpoint** - System health monitoring and diagnostics
- **Comprehensive Type System** - Strongly typed TypeScript interfaces for all major entities:
  - Articles with categories and metadata
  - User profiles with role management
  - Comments with threading support
  - Authentication tokens and user sessions
  - Like tracking and engagement metrics
  - Database operation results

### API Documentation

- **OpenAPI 3.0 Specification** - Automatically generated API documentation
- **Swagger UI** - Interactive API exploration at `/docs` endpoint
- **JSDoc Integration** - Type-safe documentation from code comments

### Developer Experience

- **TypeScript Support** - Full TypeScript support with strict type checking
- **Test-Driven Development** - Comprehensive test suite with:
  - Unit tests for types, middleware, and utilities
  - Integration tests for all API endpoints
  - Test coverage reporting
- **Development Tools**:
  - Hot-reload development server (`bun --watch`)
  - ESLint for code quality
  - Prettier for code formatting
  - Conventional Commits support with commitlint

### Security & Monitoring

- **Helmet.js** - HTTP header security
- **CORS Support** - Cross-origin resource sharing configuration
- **Morgan Logging** - HTTP request logging and monitoring
- **Structured Logging** - ECS-compliant logger utility for debugging

## 🏗️ Tech Stack

- **Runtime:** Bun (fast JavaScript runtime)
- **Framework:** Express.js
- **Language:** TypeScript
- **Databases:**
  - MongoDB for articles, comments, and likes
  - Supabase for user authentication
- **Testing:** Vitest with coverage reporting
- **Documentation:** OpenAPI 3.0 with Swagger UI
- **Development:** ESLint, Prettier, Morgan

## 📋 Known Limitations

As a pre-alpha release, please be aware of the following:

- API endpoints may change before the stable release
- Database schema may be subject to modifications
- Performance optimizations are still in progress
- Some error handling edge cases may not be covered
- Rate limiting is not yet implemented
- Caching strategies are not yet in place

## 🚀 Getting Started

### Installation

```bash
bun install
```

### Configuration

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server with hot-reload
bun run dev

# Run tests
bun run test

# Run specific test suites
bun run test:unit
bun run test:integration
bun run test:types
```

### API Documentation

Once the server is running, visit:

- **Swagger UI:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

## 📦 What's Included

### API Endpoints

- `GET /health` - System health status
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /profiles/:userId` - Get user profile
- `PUT /profiles/:userId` - Update user profile
- `POST /articles` - Create article
- `GET /articles` - List articles
- `GET /articles/:id` - Get article details
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article
- `POST /articles/:id/comments` - Add comment
- `GET /articles/:id/comments` - Get article comments
- `POST /articles/:id/like` - Like article
- `DELETE /articles/:id/like` - Unlike article

## 🐛 Feedback & Bug Reports

Found a bug or have a feature suggestion? Please visit our [GitHub Issues](https://github.com/Blich-Studio/bs-api/issues) page.

## 📖 Documentation

For detailed information, see:

- [README](README.md) - Project overview
- [Contributing Guide](CONTRIBUTING.md) - Development guidelines
- [Changelog](CHANGELOG.md) - Version history

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

**Thank you for trying BS API!** Your feedback helps us build a better product. 🙌
