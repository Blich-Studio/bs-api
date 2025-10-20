# Contributing to BS API

Thank you for your interest in contributing to the BS API (ts-blog)! This project follows Test-Driven Development (TDD) principles and uses [Conventional Commits](https://conventionalcommits.org/) for commit messages, which are processed by [standard-version](https://github.com/conventional-changelog/standard-version) to generate changelogs.

## Commit Guidelines

All commits must follow the Conventional Commits format to ensure proper changelog generation:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Examples

- `feat: add user authentication`
- `fix: resolve null pointer in health check`
- `docs: update API documentation`
- `refactor: extract controller logic`

### Breaking Changes

For breaking changes, add `!` after the type/scope and describe in the footer:

```
feat!: change API response format

BREAKING CHANGE: The response now includes a new field
```

## Development Setup

1. **Fork and Clone**: Fork the repository on GitHub and clone it locally.
2. **Install Dependencies**: Use Bun to install all dependencies.
   ```bash
   bun install
   ```
3. **Set up Supabase**: Create a Supabase project for authentication and user management. Configure environment variables (e.g., `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
4. **Set up MongoDB**: Set up a MongoDB instance (local via Docker or cloud service like MongoDB Atlas) for CMS data. Configure the connection string in environment variables.
5. **Verify Setup**: Run the tests to ensure everything is working.
   ```bash
   bun run test
   ```

## TDD Workflow

We strictly follow Test-Driven Development:

1. **Write a Failing Test**: Start by writing a test that describes the desired behavior. Ensure it fails initially.
2. **Implement the Code**: Write the minimal code necessary to make the test pass.
3. **Refactor**: Clean up the code while ensuring tests still pass.
4. **Repeat**: Continue this cycle for each new feature or bug fix.

### Running Tests

- **All Tests**: `bun run test`
- **Unit Tests**: `bun run test:unit`
- **Integration Tests**: `bun run test:integration`
- **Coverage**: `bun run test:coverage`
- **Watch Mode**: `bun run test:watch` (useful during development)

## Code Style and Quality

- **Linting**: Run ESLint to check code quality.
  ```bash
  bun run lint
  ```
  Fix issues automatically:
  ```bash
  bun run lint:fix
  ```
- **Formatting**: Use Prettier for consistent code formatting.
  ```bash
  bun run format
  ```
- **TypeScript**: Ensure all code is properly typed. Run type checks via Vitest.

## Making Changes

1. Create a feature branch from `main` (or the current development branch).
2. Follow the TDD cycle for your changes.
3. Ensure all tests pass and coverage is maintained.
4. Update documentation if necessary (e.g., OpenAPI spec, README).
5. Commit using conventional commit messages (enforced by commitlint).

## Pull Requests

- **Title**: Use conventional commit format (e.g., `feat: add user authentication`).
- **Description**: Describe the changes, why they were made, and how they were tested.
- **Tests**: Include new or updated tests.
- **Review**: Request review from maintainers.
- **Merge**: PRs are merged after approval and passing CI checks.

## Reporting Issues

- Use GitHub Issues for bugs or feature requests.
- Provide clear steps to reproduce bugs.
- Include relevant logs, error messages, and environment details.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive community.

For questions or discussions, feel free to open an issue or start a discussion on GitHub.
