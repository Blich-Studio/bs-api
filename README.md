# BS API

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CI](https://github.com/Blich-Studio/bs-api/workflows/CI/badge.svg)](https://github.com/Blich-Studio/bs-api/actions)

A production-grade TypeScript REST API for a blog application. Built with **Express.js**, **Bun**, and **MongoDB**, following **Test-Driven Development** principles.

**Version:** v0.2.4 (Pre-Alpha) | **Release Date:** October 21, 2025

---

## 🚀 Quick Start

**Get up and running in 5 minutes:**

```bash
# Clone and install
git clone https://github.com/Blich-Studio/bs-api.git
cd bs-api
bun install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and MongoDB credentials

# Run development server
bun run dev

# In another terminal, verify it works
curl http://localhost:3000/health
```

View API docs at `http://localhost:3000/docs`

**For detailed setup instructions, see the [Quick Start Guide](wiki/Quick-Start.md) in the wiki.**

---

## 📚 Documentation

All comprehensive documentation is in the **[Project Wiki](wiki/Home.md)**:

### Getting Started

- [Quick Start](wiki/Quick-Start.md) — 5-minute setup
- [Installation & Setup](wiki/Installation-and-Setup.md) — Detailed setup guide
- [Configuration Guide](wiki/Configuration-Guide.md) — Environment variables and settings

### Development

- [TDD Guide](wiki/TDD-Guide.md) — Test-Driven Development approach
- [Testing Best Practices](wiki/Testing-Best-Practices.md) — How to write tests
- [Contributing Guidelines](wiki/Contributing-Guidelines.md) — How to contribute
- [Commit Standards](wiki/Commit-Standards.md) — Conventional Commits format

### Technical Architecture

- [Architecture Overview](wiki/Architecture-Overview.md) — System design
- [Tech Stack](wiki/Tech-Stack.md) — Technologies and frameworks
- [Database Schema](wiki/Database-Schema.md) — Data models and relationships
- [API Endpoints](wiki/API-Endpoints.md) — Complete API reference

### Security & Authorization

- [Role-Based Authorization](wiki/Role-Based-Authorization.md) — JWT and RBAC system
- [Authentication Flow](wiki/Authentication-Flow.md) — How authentication works
- [Security Considerations](wiki/Security-Considerations.md) — Security best practices

---

## ✨ Key Features

| Feature                | Details                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| 🔐 **Authentication**  | JWT-based with Supabase integration                                     |
| 👥 **User Management** | Profile management and role-based access (Guest, Reader, Author, Admin) |
| 📝 **Articles**        | Full CRUD with MongoDB persistence                                      |
| 💬 **Comments**        | Thread-based commenting system                                          |
| 👍 **Likes**           | Track engagement on articles                                            |
| 📚 **API Docs**        | Interactive Swagger UI at `/docs`                                       |
| ✅ **Type Safe**       | Full TypeScript with strict mode                                        |
| 🧪 **Well Tested**     | Comprehensive unit & integration tests                                  |
| 🚀 **TDD**             | Test-driven development throughout                                      |

---

## 🛠️ Tech Stack

```
Runtime:       Bun (⚡ fast JavaScript runtime)
Framework:     Express.js
Language:      TypeScript (strict mode)
Databases:     MongoDB (articles, comments, likes)
               Supabase (user auth)
Testing:       Vitest with coverage
Documentation: OpenAPI 3.0 + Swagger UI
Security:      Helmet.js, CORS, JWT
Logging:       Morgan + ECS logger
```

---

## 💻 Common Commands

```bash
# Development
bun run dev                # Start dev server (with hot-reload)
bun run start             # Start production server

# Testing
bun run test              # Run all tests
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Generate coverage report
bun run test:unit        # Run unit tests only
bun run test:integration # Run integration tests only

# Code Quality
bun run lint              # Check code style
bun run lint:fix         # Fix linting issues
bun run format           # Format code with Prettier

# Releases
bun run release          # Create a new release
```

---

## 📁 Project Structure

```
src/
├── app.ts              # Express app setup
├── server.ts           # Server entry point
├── controllers/        # Route handlers
├── routes/             # Route definitions
├── types/              # TypeScript type definitions
├── middleware/         # Custom middleware
├── utils/              # Utility functions
├── schemas/            # Data validation schemas
└── __tests__/          # Test suites
    ├── unit/           # Unit tests
    └── integration/    # Integration tests
```

---

## 🔐 Authorization & Roles

The API uses role-based access control (RBAC) with 4 user roles:

| Role       | Permissions                                 |
| ---------- | ------------------------------------------- |
| **Guest**  | Read articles (public)                      |
| **Reader** | Read, comment, like; update own profile     |
| **Author** | Create/update own articles, comments, likes |
| **Admin**  | Manage resources (no hard delete)           |

**See [Role-Based Authorization](wiki/Role-Based-Authorization.md) for detailed policy.**

---

## 🧪 Testing

This project is built with **Test-Driven Development (TDD)**:

1. **Write a failing test** (RED)
2. **Implement code to pass** (GREEN)
3. **Refactor for quality** (REFACTOR)

Run tests with:

```bash
bun run test              # All tests
bun run test:watch       # Watch mode (best for development)
bun run test:coverage    # With coverage report
```

**See [TDD Guide](wiki/TDD-Guide.md) and [Testing Best Practices](wiki/Testing-Best-Practices.md) for details.**

---

## 🤝 Contributing

We welcome contributions! Before you start:

1. Read [Contributing Guidelines](wiki/Contributing-Guidelines.md)
2. Follow [Commit Standards](wiki/Commit-Standards.md) (Conventional Commits)
3. Write tests for new features (TDD)
4. Ensure all tests pass: `bun run test`

**Check [Contributing Guidelines](wiki/Contributing-Guidelines.md) for the full process.**

---

## 📄 Project Documentation Files

In the repository root:

- **[RELEASE_NOTES.md](RELEASE_NOTES.md)** — Current release (v0.2.4, Pre-Alpha)
- **[CHANGELOG.md](CHANGELOG.md)** — Version history
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Contribution guidelines
- **[LICENSE](LICENSE)** — GNU GPLv3

**For in-depth documentation, refer to the [Wiki](wiki/Home.md).**

---

## 📞 Support & Feedback

- 📖 **Questions?** Check the [Wiki](wiki/Home.md)
- 🐛 **Found a bug?** [Open an issue](https://github.com/Blich-Studio/bs-api/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/Blich-Studio/bs-api/discussions)
- 🤝 **Want to contribute?** See [Contributing Guidelines](wiki/Contributing-Guidelines.md)

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](LICENSE) for details.

---

**Last Updated:** October 21, 2025  
**Project Version:** v0.2.4 (Pre-Alpha)  
**Wiki:** [github.com/Blich-Studio/bs-api/wiki](https://github.com/Blich-Studio/bs-api/wiki)
