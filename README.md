# StayHub — Airbnb Clone API

A production-style backend for an Airbnb-inspired booking platform, built with **NestJS**, **MongoDB**, and **Clean Architecture** principles.

This isn't a small CRUD demo — it's a real API with authentication, role-based authorization, file uploads, bookings, reviews, OTP flows, internationalized error handling, and local infrastructure via Docker.

## ✨ Features

- **Authentication & Authorization** — register, login, refresh tokens, current-account endpoint, role-based access control (users & system admins)
- **User Management** — secure password hashing, profile management
- **Units / Listings** — create, update, delete, activate/deactivate with owner-level authorization
- **File Uploads** — unit photo upload/update/delete with validation by size, extension, and file signature; S3-compatible storage (MinIO locally)
- **Bookings** — availability checks, price calculation, guest/host actions, cancellation flows
- **Reviews & Ratings** — booking reviews, unit review aggregation
- **Favorites** — save and manage favorite units
- **OTP & Forgot Password** — OTP generation/verification, email integration via an adapter pattern (Nodemailer)
- **Global Exception Handling** — centralized custom exceptions with translated error messages (`nestjs-i18n`)
- **Validation** — DTO validation and response transformation (`class-validator`, `class-transformer`)
- **API Documentation** — Swagger
- **Local Infrastructure** — MongoDB, MinIO, and Mailpit via Docker Compose

## 🏗️ Architecture

- Clean, use-case based application structure
- Thin controllers — business logic lives in services/use-cases
- Reusable base repository pattern for MongoDB
- Modules communicate through well-defined boundaries (no leaking database logic across layers)

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Database | MongoDB |
| Validation | class-validator, class-transformer, Joi |
| i18n | nestjs-i18n |
| File Storage | S3-compatible (MinIO for local dev) |
| Email Testing | Mailpit |
| Package Manager | pnpm |
| Node Version Manager | fnm |
| API Docs | Swagger |
| API Testing | Bruno (`air-bnb-collection`) |

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) — managed via [fnm](https://github.com/Schniz/fnm)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) & Docker Compose

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd stayhub_airbnb
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env.development
```

### 4. Start local infrastructure (MongoDB, MinIO, Mailpit)

```bash
docker compose up -d
```

### 5. Run the app

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:<PORT>` (see `.env` for the configured port).

Swagger docs available at `http://localhost:<PORT>/api` (adjust path if different in your setup).

## 📂 Project Structure

```
src/
├── common/              → Shared building blocks (filters, exceptions, guards, pipes, config)
├── modules/             → Feature modules (users, units, bookings, reviews, favorites, otp, ...)
├── i18n/                → Translation resources (ar/en)
└── main.ts              → Application bootstrap
```

## 🧪 Useful Commands

### Development

```bash
pnpm run start:dev        # Start in watch mode
pnpm run build             # Build the project
npx tsc --noEmit           # Type-check without emitting files
npx tsc --version           # Check installed TypeScript version
```

### Generating a Resource

```bash
nest g resource modules/<name>
```

### Docker

```bash
docker compose up -d       # Start MongoDB, MinIO, Mailpit
docker compose down         # Stop all services
```

### Dependency Management

```bash
pnpm i --save @nestjs/config
pnpm i --save class-validator class-transformer
pnpm install --save nestjs-i18n
pnpm install tsx --save-dev
npm install joi
npm i --save-dev @types/node
```

### Clean Reinstall (if dependencies get into a bad state)

```bash
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
pnpm install
```

## ⚙️ Configuration Notes

- Environment variables are validated at startup via a Joi schema (fail-fast on misconfiguration).
- `NODE_ENV` is strongly typed via an `Environment` enum, shared across the config layer for compile-time safety.
- If you hit a `baseUrl is deprecated` warning on newer TypeScript versions, add the following inside `compilerOptions` in `tsconfig.json`, right after `"baseUrl": "./"`:

```jsonc
"ignoreDeprecations": "6.0"
```

## 🌍 Internationalization

Error and validation messages are translated via `nestjs-i18n`. Translation resources live under `src/i18n/<lang>/`. Supported languages: Arabic (`ar`), English (`en`).

## 🛡️ Error Handling

All exceptions are caught by a global exception filter and normalized into a consistent response shape, with translated messages based on the request's language.

## 📮 API Testing

A ready-to-use [Bruno](https://www.usebruno.com/) collection is available under `air-bnb-collection/` for testing all API flows locally.

## 📄 License

This project is for educational purposes as part of a backend development course.
##########
The flow works like this:

Service throws exception with i18n key as message (e.g., new CustomConflictException('ERROR.EMAIL_ALREADY_REGISTERED'))
CustomExceptionFilter catches it and calls exception.formatError(this.i18nService)
BaseCustomException.formatError() calls i18nService.translate(this.message) where this.message is the i18n key
CustomI18nService.translate() uses I18nContext.current()?.lang to get the current language
The language is resolved by QueryResolver (query param lang), HeaderResolver (x-lang header), or AcceptLanguageResolver
The translated message is returned based on the current language
This is a clean i18n implementation. The translation files are in the correct location (src/i18n/en/ and src/i18n/ar/) and the I18nJsonLoader is configured in the CoreModule to load from src/i18n/.
##
1. Service throws: CustomConflictException('ERROR.EMAIL_ALREADY_REGISTERED')
                    ↓
2. CustomExceptionFilter catches → calls exception.formatError(i18nService)
                    ↓
3. BaseCustomException.formatError() → i18nService.translate('ERROR.EMAIL_ALREADY_REGISTERED')
                    ↓
4. CustomI18nService.translate() → gets current lang from I18nContext
                    ↓
5. I18nJsonLoader looks up key in src/i18n/{lang}/error.json