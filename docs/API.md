# SCIC / EJP-13 Backend REST API Documentation

Base URL: `http://localhost:5000/api/v1`

Standard Response Structure:
```json
{
  "success": true,
  "message": "Operation response message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  },
  "data": { ... }
}
```

Standard Error Structure:
```json
{
  "success": false,
  "message": "Error details message",
  "error": { ... }
}
```

---

## 1. Auth Module

### POST `/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "isDeleted": false,
    "createdAt": "2026-08-12T11:00:00.000Z",
    "updatedAt": "2026-08-12T11:00:00.000Z"
  }
}
```

### POST `/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

## 2. User Module

### GET `/users`
- **Auth**: Bearer Token (`ADMIN`)
- **Query Params**: `page` (default `1`), `limit` (default `10`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "meta": { "page": 1, "limit": 10, "total": 1 },
  "data": [
    {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isDeleted": false,
      "createdAt": "2026-08-12T11:00:00.000Z",
      "updatedAt": "2026-08-12T11:00:00.000Z"
    }
  ]
}
```

### GET `/users/:id`
- **Auth**: Bearer Token (`ADMIN` or Self)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "isDeleted": false,
    "createdAt": "2026-08-12T11:00:00.000Z",
    "updatedAt": "2026-08-12T11:00:00.000Z"
  }
}
```

### PATCH `/users/:id`
- **Auth**: Bearer Token (`ADMIN` or Self)
- **Request Body**:
```json
{
  "name": "John Updated",
  "role": "ADMIN"
}
```
- **Response** (`200 OK`): User object.

### DELETE `/users/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Action**: Soft deletes user (`isDeleted: true`).
- **Response** (`200 OK`): User object.

---

## 3. Category Module

### POST `/categories`
- **Auth**: Bearer Token (`ADMIN`)
- **Request Body**:
```json
{
  "name": "Electronics",
  "slug": "electronics"
}
```
- **Response** (`201 Created`): Category object.

### GET `/categories`
- **Auth**: Public
- **Query Params**: `page`, `limit`
- **Response** (`200 OK`): List of active categories.

### GET `/categories/:id`
- **Auth**: Public
- **Response** (`200 OK`): Category object with associated products.

### PATCH `/categories/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Request Body**:
```json
{
  "name": "Home Electronics"
}
```
- **Response** (`200 OK`): Updated category object.

### DELETE `/categories/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Action**: Soft deletes category (`isDeleted: true`).
- **Response** (`200 OK`): Category object.

---

## 4. Product Module

### POST `/products`
- **Auth**: Bearer Token (`ADMIN`)
- **Request Body**:
```json
{
  "title": "Wireless Headphones",
  "description": "High quality bluetooth headphones",
  "price": 99.99,
  "stock": 50,
  "status": "ACTIVE",
  "categoryId": "category-uuid"
}
```
- **Response** (`201 Created`): Product object with category.

### GET `/products`
- **Auth**: Public
- **Query Params**:
  - `searchTerm` (searches title & description)
  - `categoryId`
  - `status` (`ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`)
  - `minPrice`, `maxPrice`
  - `page`, `limit`
  - `sortBy`, `sortOrder` (`asc` / `desc`)
- **Response** (`200 OK`): Paginated product list.

### GET `/products/:id`
- **Auth**: Public
- **Response** (`200 OK`): Product object with category and active reviews.

### PATCH `/products/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Request Body**: Partial product object.
- **Response** (`200 OK`): Updated product object.

### DELETE `/products/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Action**: Soft deletes product (`isDeleted: true`).
- **Response** (`200 OK`): Product object.

---

## 5. Review Module

### POST `/reviews`
- **Auth**: Bearer Token (`USER` / `ADMIN`)
- **Request Body**:
```json
{
  "rating": 5,
  "comment": "Amazing sound quality!",
  "productId": "product-uuid"
}
```
- **Response** (`201 Created`): Review object.

### GET `/reviews`
- **Auth**: Public
- **Query Params**: `productId`, `userId`, `page`, `limit`
- **Response** (`200 OK`): List of active reviews.

### DELETE `/reviews/:id`
- **Auth**: Bearer Token (`USER` owner or `ADMIN`)
- **Action**: Soft deletes review (`isDeleted: true`).
- **Response** (`200 OK`): Review object.

---

## 6. Order Module

### POST `/orders`
- **Auth**: Bearer Token (`USER` / `ADMIN`)
- **Request Body**:
```json
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ]
}
```
- **Response** (`201 Created`): Order object with order items. Stock is automatically deducted transactionally.

### GET `/orders`
- **Auth**: Bearer Token (`USER` / `ADMIN`)
- **Query Params**: `status` (`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`), `page`, `limit`
- **Notes**: `USER` only sees their own orders; `ADMIN` sees all orders.
- **Response** (`200 OK`): List of orders.

### GET `/orders/:id`
- **Auth**: Bearer Token (`USER` owner or `ADMIN`)
- **Response** (`200 OK`): Order details with nested products and items.

### PATCH `/orders/:id`
- **Auth**: Bearer Token (`ADMIN`)
- **Request Body**:
```json
{
  "status": "COMPLETED"
}
```
- **Response** (`200 OK`): Updated order.

### DELETE `/orders/:id`
- **Auth**: Bearer Token (`USER` owner or `ADMIN`)
- **Action**: Soft deletes order (`isDeleted: true`).
- **Response** (`200 OK`): Order object.
