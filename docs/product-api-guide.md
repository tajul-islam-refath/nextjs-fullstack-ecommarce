# Product API Documentation

## Overview

Comprehensive API for managing and retrieving products with advanced search, filtering, and pagination capabilities.

---

## API Endpoint

### GET `/api/products`

Retrieve paginated products with optional search and filters.

---

## Query Parameters

| Parameter      | Type    | Default   | Description                                               |
| -------------- | ------- | --------- | --------------------------------------------------------- |
| `page`         | number  | 1         | Page number (must be positive)                            |
| `limit`        | number  | 10        | Items per page (max: 100)                                 |
| `search`       | string  | -         | Search in name, description, or SKU                       |
| `categoryId`   | string  | -         | Filter by category ID                                     |
| `featuredType` | enum    | -         | Filter by featured type: `LATEST`, `HOT`, `POPULAR`       |
| `minPrice`     | number  | -         | Minimum price filter                                      |
| `maxPrice`     | number  | -         | Maximum price filter                                      |
| `hasVariants`  | boolean | -         | Filter products with/without variants                     |
| `sortBy`       | enum    | createdAt | Sort field: `createdAt`, `name`, `basePrice`, `updatedAt` |
| `sortOrder`    | enum    | desc      | Sort order: `asc`, `desc`                                 |

---

## Request Examples

### Basic Pagination

```bash
GET /api/products?page=1&limit=10
```

### Search Products

```bash
GET /api/products?search=laptop&page=1&limit=20
```

### Filter by Category

```bash
GET /api/products?categoryId=clx123abc&page=1
```

### Filter by Featured Type

```bash
# Get latest products
GET /api/products?featuredType=LATEST&limit=10

# Get hot deals
GET /api/products?featuredType=HOT&limit=10

# Get popular items
GET /api/products?featuredType=POPULAR&limit=10
```

### Filter by Price Range

```bash
GET /api/products?minPrice=10&maxPrice=100&page=1
```

### Filter by Variants

```bash
# Products with variants
GET /api/products?hasVariants=true

# Simple products (no variants)
GET /api/products?hasVariants=false
```

### Sorting

```bash
# Sort by name ascending
GET /api/products?sortBy=name&sortOrder=asc

# Sort by price descending
GET /api/products?sortBy=basePrice&sortOrder=desc

# Sort by newest first
GET /api/products?sortBy=createdAt&sortOrder=desc
```

### Combined Filters

```bash
GET /api/products?categoryId=clx123&search=laptop&minPrice=500&maxPrice=2000&sortBy=basePrice&sortOrder=asc&page=1&limit=20
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "clx123abc",
      "name": "Premium Laptop",
      "slug": "premium-laptop",
      "description": "High-performance laptop for professionals",
      "categoryId": "clx456def",
      "basePrice": "1299.99",
      "salePrice": "1099.99",
      "costPrice": "800.00",
      "stock": 50,
      "sku": "LAPTOP-001",
      "featuredType": "HOT",
      "hasVariants": false,
      "metaTitle": "Premium Laptop - Best Performance",
      "metaDescription": "Get the best laptop for work and gaming",
      "metaKeywords": "laptop, premium, performance",
      "weight": "2.5",
      "dimensions": "{\"length\": 35, \"width\": 25, \"height\": 2}",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z",
      "category": {
        "id": "clx456def",
        "name": "Electronics",
        "slug": "electronics"
      },
      "images": [
        {
          "id": "clx789ghi",
          "url": "https://example.com/laptop.jpg",
          "alt": "Premium Laptop"
        }
      ],
      "variants": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Product with Variants

```json
{
  "id": "clx123xyz",
  "name": "Premium T-Shirt",
  "slug": "premium-tshirt",
  "basePrice": "29.99",
  "hasVariants": true,
  "variants": [
    {
      "id": "clxvar001",
      "sku": "TSHIRT-S",
      "name": "Small",
      "price": "29.99",
      "salePrice": null,
      "stock": 50
    },
    {
      "id": "clxvar002",
      "sku": "TSHIRT-M",
      "name": "Medium",
      "price": "29.99",
      "salePrice": "24.99",
      "stock": 75
    }
  ]
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Invalid query parameters",
  "details": [
    {
      "field": "page",
      "message": "Expected number, received string"
    }
  ]
}
```

### Error Response (500 Internal Server Error)

```json
{
  "error": "Internal server error",
  "message": "Failed to fetch products"
}
```

---

## ProductService Methods

### `getPaginatedProducts(query)`

Main method for retrieving products with filters and pagination.

```typescript
const productService = new ProductService(prisma);
const result = await productService.getPaginatedProducts({
  page: 1,
  limit: 10,
  search: "laptop",
  categoryId: "clx123",
  featuredType: "HOT",
  minPrice: 500,
  maxPrice: 2000,
  sortBy: "basePrice",
  sortOrder: "asc",
});
```

### `getProductById(id)`

Get a single product by ID with all relations.

```typescript
const product = await productService.getProductById("clx123abc");
```

### `getProductBySlug(slug)`

Get a single product by slug with all relations.

```typescript
const product = await productService.getProductBySlug("premium-laptop");
```

### `getFeaturedProducts(featuredType, limit)`

Get featured products by type.

```typescript
const latest = await productService.getFeaturedProducts("LATEST", 10);
const hot = await productService.getFeaturedProducts("HOT", 10);
const popular = await productService.getFeaturedProducts("POPULAR", 10);
```

### `getProductsByCategory(categoryId, page, limit)`

Get products by category with pagination.

```typescript
const products = await productService.getProductsByCategory("clx123", 1, 10);
```

### `searchProducts(searchTerm, page, limit)`

Search products by term.

```typescript
const results = await productService.searchProducts("laptop", 1, 20);
```

### `getTotalStock(productId)`

Get total stock for a product (including all variants).

```typescript
const totalStock = await productService.getTotalStock("clx123abc");
```

### `getPriceRange(productId)`

Get price range for a product (min and max from variants).

```typescript
const priceRange = await productService.getPriceRange("clx123abc");
// Returns: { min: 29.99, max: 39.99 }
```

### `isInStock(productId, variantId?)`

Check if product or variant is in stock.

```typescript
// Check product
const inStock = await productService.isInStock("clx123abc");

// Check specific variant
const variantInStock = await productService.isInStock("clx123abc", "clxvar001");
```

---

## Caching

The API uses Next.js caching with the following configuration:

- **Cache Duration**: 1 hour (3600 seconds)
- **Cache Tags**: `['products']`
- **Stale While Revalidate**: 24 hours (86400 seconds)

### Cache Headers

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### Cache Invalidation

To invalidate the cache after product updates:

```typescript
import { revalidateTag } from "next/cache";

// Invalidate all products cache
revalidateTag("products", "default");
```

---

## Usage Examples

### Frontend: Product Listing Page

```typescript
"use client";

import { useState, useEffect } from "react";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(
        "/api/products?page=1&limit=12&sortBy=createdAt&sortOrder=desc"
      );
      const data = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination {...pagination} />
    </div>
  );
}
```

### Frontend: Search with Filters

```typescript
export function ProductSearch() {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    featuredType: "",
  });

  async function handleSearch() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`/api/products?${params.toString()}`);
    const data = await response.json();
    // Handle results...
  }

  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search products..."
      />
      <select
        value={filters.categoryId}
        onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
      >
        <option value="">All Categories</option>
        {/* Category options */}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

### Server Component: Featured Products

```typescript
async function getFeaturedProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?featuredType=HOT&limit=8`,
    {
      next: { tags: ["products"], revalidate: 3600 },
    }
  );
  return response.json();
}

export default async function HomePage() {
  const { data: hotProducts } = await getFeaturedProducts();

  return (
    <section>
      <h2>🔥 Hot Deals</h2>
      <div className="grid grid-cols-4 gap-4">
        {hotProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

---

## Performance Optimization

### Indexes Used

The following database indexes optimize query performance:

- `Product.slug` - Fast product lookup by URL
- `Product.categoryId` - Filter by category
- `Product.featuredType` - Filter by featured type
- `Product.createdAt` - Sort by newest
- `ProductImage.productId` - Get product images
- `ProductImage.isPrimary` - Find primary image
- `ProductVariant.productId` - Get product variants
- `ProductVariant.isActive` - Filter active variants

### Query Optimization

- Uses `select` to limit fields returned
- Parallel execution of count and data queries
- Includes only necessary relations
- Filters inactive variants automatically

---

## Testing

### Test Basic Pagination

```bash
curl "http://localhost:3000/api/products?page=1&limit=10"
```

### Test Search

```bash
curl "http://localhost:3000/api/products?search=laptop"
```

### Test Filters

```bash
curl "http://localhost:3000/api/products?categoryId=clx123&minPrice=100&maxPrice=500"
```

---

## Summary

✅ **Comprehensive Filtering** - Search, category, price, featured type
✅ **Flexible Sorting** - Multiple sort fields and orders
✅ **Pagination** - Efficient pagination with metadata
✅ **Caching** - Next.js caching for performance
✅ **Type-Safe** - Zod validation for all inputs
✅ **Optimized Queries** - Indexed fields and parallel execution
✅ **Rich Relations** - Includes category, images, and variants
✅ **Production Ready** - Error handling and validation

Perfect for building a scalable e-commerce product catalog! 🚀
