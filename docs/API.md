# Marketplace API — Documentation

**Base URL**: `http://localhost:5000/api`

---

## Standard Response Formats

**Success:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Success with Pagination:**
```json
{
  "success": true,
  "message": "Operation description",
  "meta": { "page": 1, "limit": 10, "total": 42 },
  "data": []
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

## 1. Auth

### POST `/auth/register` — Register a new user
**Auth**: Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "isDeleted": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

| Status | Meaning |
|--------|---------|
| 201 | Created successfully |
| 400 | Validation error |
| 409 | Email already in use |

---

### POST `/auth/login` — Login
**Auth**: Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

| Status | Meaning |
|--------|---------|
| 200 | Logged in |
| 400 | Validation error |
| 401 | Invalid credentials |
| 404 | User not found |

---

## 2. Users

> **Authorization Header**: `Bearer <accessToken>`

### GET `/users` — Get all users
**Auth**: ADMIN only

**Query Params**: `page`, `limit`

**Response `200`**: Paginated list of users.

---

### GET `/users/:id` — Get user by ID
**Auth**: ADMIN or Self

**Response `200`**: User object.

| Status | Meaning |
|--------|---------|
| 200 | Found |
| 403 | Forbidden |
| 404 | Not found |

---

### PATCH `/users/:id` — Update user
**Auth**: ADMIN or Self

**Request Body:**
```json
{ "name": "Updated Name" }
```

**Response `200`**: Updated user object.

---

### DELETE `/users/:id` — Soft-delete user
**Auth**: ADMIN only

**Response `200`**: User object with `isDeleted: true`.

---

## 3. Categories

### POST `/categories` — Create category
**Auth**: ADMIN

**Request Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics"
}
```
> `slug` is optional — auto-generated from `name` if omitted.

**Response `201`**: Category object.

| Status | Meaning |
|--------|---------|
| 201 | Created |
| 409 | Duplicate name/slug |

---

### GET `/categories` — Get all categories
**Auth**: Public

**Query Params**: `page`, `limit`

**Response `200`**: Paginated category list.

---

### GET `/categories/:id` — Get category by ID
**Auth**: Public

**Response `200`**: Category with nested active products.

---

### PATCH `/categories/:id` — Update category
**Auth**: ADMIN

**Request Body:**
```json
{ "name": "Updated Name" }
```

---

### DELETE `/categories/:id` — Soft-delete category
**Auth**: ADMIN

---

## 4. Products

### POST `/products` — Create product
**Auth**: ADMIN

**Request Body:**
```json
{
  "title": "Wireless Headphones",
  "description": "Optional description",
  "price": 199.99,
  "stock": 50,
  "status": "ACTIVE",
  "categoryId": "category-uuid"
}
```

`status` options: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`

---

### GET `/products` — Get all products
**Auth**: Public

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `searchTerm` | string | Search in title and description |
| `categoryId` | string | Filter by category UUID |
| `status` | string | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |
| `minPrice` | number | Min price filter |
| `maxPrice` | number | Max price filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortBy` | string | Field to sort by (default: `createdAt`) |
| `sortOrder` | string | `asc` or `desc` |

---

### GET `/products/:id` — Get product by ID
**Auth**: Public

**Response `200`**: Product with category and active reviews.

---

### PATCH `/products/:id` — Update product
**Auth**: ADMIN

---

### DELETE `/products/:id` — Soft-delete product
**Auth**: ADMIN

---

## 5. Reviews

### POST `/reviews` — Create a review
**Auth**: USER or ADMIN

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!",
  "productId": "product-uuid"
}
```

`rating` must be between 1 and 5.

**Response `201`**: Review with user and product info.

---

### GET `/reviews` — Get all reviews
**Auth**: Public

**Query Params**: `productId`, `userId`, `page`, `limit`

---

### DELETE `/reviews/:id` — Soft-delete review
**Auth**: Owner USER or ADMIN

---

## 6. Orders

### POST `/orders` — Create an order
**Auth**: USER or ADMIN

**Request Body:**
```json
{
  "items": [
    { "productId": "uuid", "quantity": 2 }
  ]
}
```

- Stock is automatically deducted per item (transactional).
- Total is auto-calculated from product prices × quantities.
- If a product has 0 remaining stock after the order, its status becomes `OUT_OF_STOCK`.

**Response `201`**: Full order with nested items.

---

### GET `/orders` — Get all orders
**Auth**: USER or ADMIN

> ADMIN sees all orders. USER sees only their own.

**Query Params**: `status`, `page`, `limit`

`status` options: `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`

---

### GET `/orders/:id` — Get order by ID
**Auth**: Owner USER or ADMIN

---

### PATCH `/orders/:id` — Update order status
**Auth**: ADMIN only

**Request Body:**
```json
{ "status": "COMPLETED" }
```

---

### DELETE `/orders/:id` — Soft-delete order
**Auth**: Owner USER or ADMIN

---

## Enums Reference

| Enum | Values |
|------|--------|
| `Role` | `ADMIN`, `USER` |
| `ProductStatus` | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |
| `OrderStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED` |

---

## Database Models

| Model | Table | Soft Delete |
|-------|-------|-------------|
| User | `users` | ✅ |
| Category | `categories` | ✅ |
| Product | `products` | ✅ |
| Review | `reviews` | ✅ |
| Order | `orders` | ✅ |
| OrderItem | `order_items` | — |
