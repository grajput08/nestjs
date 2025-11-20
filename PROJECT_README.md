## SYMB-ABM Nest API Overview

- Built with NestJS, Prisma, JWT auth, and modular feature domains (`auth`, `todo`, `reports`).
- Prisma manages persistence (see `prisma/schema.prisma`); `PrismaService` exposes the client via DI.
- `AuthModule` issues JWT tokens for login/signup; `JwtAuthGuard` protects feature routes.
- `TodoModule` provides CRUD APIs backed by Prisma, exported so other modules can compose its service.
- `ReportsModule` aggregates data via a **custom provider** (`TodoStatsProviderFactory`) and exposes them over new APIs using a **custom route decorator** (`RouteInfo`).

### Concepts Highlighted

1. `RouteInfo` decorator (in `src/common/decorators/route-info.decorator.ts`) composes metadata + interceptor usage so handlers can declare telemetry summaries/versioning in one line.
2. `RouteInfoInterceptor` reads that metadata and logs request/response timing without polluting controllers.
3. `TodoStatsProviderFactory` registers a computed provider under `TODO_STATS_PROVIDER`, showcasing Nest's ability to inject abstractions that are implemented via factories.

### Auth API

`POST /auth/login`

#### cURL

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret"}'
```

Response includes an `access_token` used in protected requests.

### Todo APIs

All `/todo` routes require a JWT bearer token.

#### Create

```bash
curl -X POST http://localhost:3000/todo \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","description":"Add README curl samples"}'
```

#### List

```bash
curl -X GET http://localhost:3000/todo \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### New Reports API

`GET /reports/todos/summary` (JWT protected)

Returns totals, completion rate, and the five most recent todos.

#### cURL

```bash
curl -X GET http://localhost:3000/reports/todos/summary \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Replace `<JWT_TOKEN>` with a token issued by the `auth/login` endpoint.

### Project Exploration

- `src/main.ts`: Bootstraps the Nest app.
- `src/app.module.ts`: Root module importing Prisma, Auth, Todo, and Reports modules.
- `src/auth`: DTOs, controller, service, and guard for authentication flows.
- `src/todo`: DTOs, controller, service, and entity definitions for todo management.
- `src/reports`: Controller (`reports.controller.ts`), service, providers, and module wiring for aggregated analytics.
- `src/common`: Reusable decorators/interceptors that can be shared by any feature module.

Run `pnpm run start:dev` for local development, `pnpm run lint` for style checks, and `pnpm run build` before deployment.
