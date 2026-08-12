# SCIC / EJP-13 Backend — Implementation Plan

This plan details the implementation of a modular, production-ready REST API in Express.js + TypeScript + Prisma + PostgreSQL based on the EJP-13 architecture guidelines.

## User Review Required

> [!NOTE]
> - `bcryptjs` is already installed in `package.json`. We will install `zod` and `@types/bcryptjs` if needed, ensuring zero native build issues on Windows.
> - The database schema includes 5 core domain models (`User`, `Category`, `Product`, `Review`, `Order` + `OrderItem`), 3 Enums (`Role`, `OrderStatus`, `ProductStatus`), relational mapping (`@@map`), indexes (`@@index`), soft deletes (`isDeleted`), and timestamps.
> - PostgreSQL URL in `.env` default will target `postgresql://postgres:postgres@localhost:5432/scic_db?schema=public`.

## Proposed Changes

### Configuration & Tooling

#### [MODIFY] [package.json](file:///d:/projects/prisma%20backend/package.json)
- Add `zod` to dependencies.
- Ensure scripts for `dev`, `build`, `start`, `prisma:generate`, `prisma:migrate` match requirement.

#### [MODIFY] [.env](file:///d:/projects/prisma%20backend/.env)
#### [NEW] [.env.example](file:///d:/projects/prisma%20backend/.env.example)
- Define `DATABASE_URL`, `PORT`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`.

---

### Database Schema (Prisma)

#### [MODIFY] [prisma/schema.prisma](file:///d:/projects/prisma%20backend/prisma/schema.prisma)
- Update provider client to `prisma-client-js`.
- Define enums: `Role`, `OrderStatus`, `ProductStatus`.
- Define models: `User`, `Category`, `Product`, `Review`, `Order`, `OrderItem`.
- Add `isDeleted`, `createdAt`, `updatedAt`, `@@map`, and `@@index` across models.

---

### Core Libs, Utilities & Middlewares

#### [NEW] [src/config/index.ts](file:///d:/projects/prisma%20backend/src/config/index.ts)
- Read and export environment variables safely.

#### [MODIFY] [src/lib/prisma.ts](file:///d:/projects/prisma%20backend/src/lib/prisma.ts)
- Instantiate standard singleton `PrismaClient`.

#### [NEW] [src/utils/ApiError.ts](file:///d:/projects/prisma%20backend/src/utils/ApiError.ts)
#### [NEW] [src/utils/catchAsync.ts](file:///d:/projects/prisma%20backend/src/utils/catchAsync.ts)
#### [NEW] [src/utils/sendResponse.ts](file:///d:/projects/prisma%20backend/src/utils/sendResponse.ts)
#### [NEW] [src/utils/jwt.ts](file:///d:/projects/prisma%20backend/src/utils/jwt.ts)
#### [NEW] [src/utils/pick.ts](file:///d:/projects/prisma%20backend/src/utils/pick.ts) (for pagination & filtering params)

#### [NEW] [src/middlewares/auth.ts](file:///d:/projects/prisma%20backend/src/middlewares/auth.ts)
#### [NEW] [src/middlewares/validateRequest.ts](file:///d:/projects/prisma%20backend/src/middlewares/validateRequest.ts)
#### [NEW] [src/middlewares/globalErrorHandler.ts](file:///d:/projects/prisma%20backend/src/middlewares/globalErrorHandler.ts)

---

### Feature Modules

Each module will consist of 4 files: `.controller.ts`, `.service.ts`, `.route.ts`, and `.validation.ts`.

#### Auth Module
- [NEW] [src/services/auth/auth.validation.ts](file:///d:/projects/prisma%20backend/src/services/auth/auth.validation.ts)
- [NEW] [src/services/auth/auth.service.ts](file:///d:/projects/prisma%20backend/src/services/auth/auth.service.ts)
- [NEW] [src/services/auth/auth.controller.ts](file:///d:/projects/prisma%20backend/src/services/auth/auth.controller.ts)
- [NEW] [src/services/auth/auth.route.ts](file:///d:/projects/prisma%20backend/src/services/auth/auth.route.ts)

#### User Module
- [NEW] [src/services/user/user.validation.ts](file:///d:/projects/prisma%20backend/src/services/user/user.validation.ts)
- [NEW] [src/services/user/user.service.ts](file:///d:/projects/prisma%20backend/src/services/user/user.service.ts)
- [NEW] [src/services/user/user.controller.ts](file:///d:/projects/prisma%20backend/src/services/user/user.controller.ts)
- [NEW] [src/services/user/user.route.ts](file:///d:/projects/prisma%20backend/src/services/user/user.route.ts)

#### Category Module
- [NEW] [src/services/category/category.validation.ts](file:///d:/projects/prisma%20backend/src/services/category/category.validation.ts)
- [NEW] [src/services/category/category.service.ts](file:///d:/projects/prisma%20backend/src/services/category/category.service.ts)
- [NEW] [src/services/category/category.controller.ts](file:///d:/projects/prisma%20backend/src/services/category/category.controller.ts)
- [NEW] [src/services/category/category.route.ts](file:///d:/projects/prisma%20backend/src/services/category/category.route.ts)

#### Product Module
- [NEW] [src/services/product/product.validation.ts](file:///d:/projects/prisma%20backend/src/services/product/product.validation.ts)
- [NEW] [src/services/product/product.service.ts](file:///d:/projects/prisma%20backend/src/services/product/product.service.ts)
- [NEW] [src/services/product/product.controller.ts](file:///d:/projects/prisma%20backend/src/services/product/product.controller.ts)
- [NEW] [src/services/product/product.route.ts](file:///d:/projects/prisma%20backend/src/services/product/product.route.ts)

#### Review Module
- [NEW] [src/services/review/review.validation.ts](file:///d:/projects/prisma%20backend/src/services/review/review.validation.ts)
- [NEW] [src/services/review/review.service.ts](file:///d:/projects/prisma%20backend/src/services/review/review.service.ts)
- [NEW] [src/services/review/review.controller.ts](file:///d:/projects/prisma%20backend/src/services/review/review.controller.ts)
- [NEW] [src/services/review/review.route.ts](file:///d:/projects/prisma%20backend/src/services/review/review.route.ts)

#### Order Module
- [NEW] [src/services/order/order.validation.ts](file:///d:/projects/prisma%20backend/src/services/order/order.validation.ts)
- [NEW] [src/services/order/order.service.ts](file:///d:/projects/prisma%20backend/src/services/order/order.service.ts)
- [NEW] [src/services/order/order.controller.ts](file:///d:/projects/prisma%20backend/src/services/order/order.controller.ts)
- [NEW] [src/services/order/order.route.ts](file:///d:/projects/prisma%20backend/src/services/order/order.route.ts)

---

### Routing & Application Aggregation

#### [NEW] [src/routes/index.ts](file:///d:/projects/prisma%20backend/src/routes/index.ts)
- Aggregates `/auth`, `/users`, `/categories`, `/products`, `/reviews`, and `/orders` into central router.

#### [MODIFY] [src/app.ts](file:///d:/projects/prisma%20backend/src/app.ts)
- Mount middleware, routes `/api/v1`, 404 handler, global error handler.

#### [MODIFY] [src/server.ts](file:///d:/projects/prisma%20backend/src/server.ts)
- Initialize Prisma client connection and start HTTP server on `PORT`.

---

### API Documentation

#### [NEW] [docs/API.md](file:///d:/projects/prisma%20backend/docs/API.md)
- Complete documentation of all endpoints, authentication requirements, query parameters, request payloads, and standard response formats.

---

## Verification Plan

### Automated Verification
- Run `npx prisma generate` to verify schema validity and generate TypeScript types.
- Execute `npx tsc --noEmit` to verify type safety across all controllers, services, middlewares, and routes.

### Execution & Test Verification
- Start the server using `npm run dev` and test endpoint responses.
