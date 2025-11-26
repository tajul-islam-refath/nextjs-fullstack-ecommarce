# Product Schema Documentation

## Overview

This is a production-ready e-commerce product schema designed for flexibility and scalability. It supports both simple products and complex products with variants, multiple images, and comprehensive inventory management.

## Schema Architecture

### Core Models

```
Product (Main)
├── ProductImage (Multiple images)
├── VariantOption (Variant types: Size, Color, etc.)
└── ProductVariant (Specific combinations with pricing/stock)
```

---

## Model Breakdown

### 1. **Product** (Main Product Model)

The central model for all products, whether simple or with variants.

#### Key Fields

| Field         | Type    | Description                               |
| ------------- | ------- | ----------------------------------------- |
| `id`          | String  | Unique identifier (CUID)                  |
| `name`        | String  | Product name                              |
| `slug`        | String  | URL-friendly identifier (unique, indexed) |
| `description` | Text    | Full product description                  |
| `categoryId`  | String  | Foreign key to Category                   |
| `hasVariants` | Boolean | Whether product has variants              |
| `status`      | Enum    | DRAFT, ACTIVE, ARCHIVED, OUT_OF_STOCK     |
| `featured`    | Boolean | Featured product flag                     |

#### Pricing Fields

```prisma
basePrice   Decimal  // Regular price (used when no variants)
salePrice   Decimal? // Sale/discounted price
costPrice   Decimal? // Cost for profit calculation
```

#### Inventory Fields

```prisma
stock Int     // Stock quantity (used when no variants)
sku   String? // Stock Keeping Unit (unique)
```

#### SEO Fields

```prisma
metaTitle       String? // SEO title
metaDescription String? // SEO description
metaKeywords    String? // SEO keywords
```

#### Additional Fields

```prisma
weight     Decimal? // Product weight in kg
dimensions String?  // JSON: {length, width, height}
brand      String?  // Brand name
tags       String[] // Array of tags for filtering
```

---

### 2. **ProductImage** (Multiple Images Support)

Supports multiple images per product with ordering and primary image selection.

#### Fields

| Field       | Type    | Description                 |
| ----------- | ------- | --------------------------- |
| `id`        | String  | Unique identifier           |
| `productId` | String  | Foreign key to Product      |
| `url`       | String  | Image URL                   |
| `alt`       | String? | Alt text for accessibility  |
| `position`  | Int     | Display order (0, 1, 2...)  |
| `isPrimary` | Boolean | Primary/featured image flag |

#### Example Usage

```typescript
// Product with 3 images
{
  images: [
    { url: "/img1.jpg", position: 0, isPrimary: true },
    { url: "/img2.jpg", position: 1, isPrimary: false },
    { url: "/img3.jpg", position: 2, isPrimary: false },
  ];
}
```

---

### 3. **VariantOption** (Variant Types)

Defines the types of variants available for a product (max 1 variant type per product as per requirements).

#### Fields

| Field       | Type     | Description                               |
| ----------- | -------- | ----------------------------------------- |
| `id`        | String   | Unique identifier                         |
| `productId` | String   | Foreign key to Product                    |
| `name`      | String   | Variant name (e.g., "Size", "Color")      |
| `values`    | String[] | Available options (e.g., ["S", "M", "L"]) |

#### Constraints

- **Unique constraint**: `[productId, name]` - Only ONE variant type per product
- This means you can have either "Size" OR "Color", not both

#### Example

```typescript
// T-Shirt with Size variants
{
  name: "Size",
  values: ["S", "M", "L", "XL"]
}

// OR (not both)

// T-Shirt with Color variants
{
  name: "Color",
  values: ["Red", "Blue", "Green"]
}
```

---

### 4. **ProductVariant** (Specific Variant Combinations)

Individual variant combinations with their own pricing and stock.

#### Fields

| Field       | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `id`        | String   | Unique identifier                  |
| `productId` | String   | Foreign key to Product             |
| `sku`       | String   | Unique SKU for this variant        |
| `name`      | String   | Display name (e.g., "Red - Large") |
| `options`   | String   | JSON of variant options            |
| `price`     | Decimal  | Variant price                      |
| `salePrice` | Decimal? | Variant sale price                 |
| `costPrice` | Decimal? | Variant cost price                 |
| `stock`     | Int      | Variant stock quantity             |
| `imageUrl`  | String?  | Variant-specific image             |
| `isActive`  | Boolean  | Whether variant is available       |

#### Example

```typescript
// T-Shirt variants
[
  {
    sku: "TSHIRT-S-001",
    name: "Small",
    options: '{"Size": "S"}',
    price: 29.99,
    stock: 50,
  },
  {
    sku: "TSHIRT-M-001",
    name: "Medium",
    options: '{"Size": "M"}',
    price: 29.99,
    stock: 75,
  },
  {
    sku: "TSHIRT-L-001",
    name: "Large",
    options: '{"Size": "L"}',
    price: 32.99,
    stock: 100,
  },
];
```

---

## Product Types

### Type 1: Simple Product (No Variants)

A product without variants uses the base product fields for pricing and inventory.

```typescript
{
  name: "Laptop Stand",
  slug: "laptop-stand",
  hasVariants: false,
  basePrice: 49.99,
  salePrice: 39.99,
  stock: 100,
  sku: "STAND-001",
  images: [
    { url: "/stand1.jpg", isPrimary: true },
    { url: "/stand2.jpg", isPrimary: false }
  ]
}
```

### Type 2: Product with Variants

A product with variants uses the `ProductVariant` model for pricing and inventory.

```typescript
{
  name: "Premium T-Shirt",
  slug: "premium-tshirt",
  hasVariants: true,
  basePrice: 29.99, // Base/reference price

  variantOptions: [
    {
      name: "Size",
      values: ["S", "M", "L", "XL"]
    }
  ],

  variants: [
    {
      sku: "TSHIRT-S",
      name: "Small",
      options: '{"Size": "S"}',
      price: 29.99,
      stock: 50
    },
    {
      sku: "TSHIRT-M",
      name: "Medium",
      options: '{"Size": "M"}',
      price: 29.99,
      stock: 75
    }
  ],

  images: [
    { url: "/tshirt1.jpg", isPrimary: true },
    { url: "/tshirt2.jpg", isPrimary: false }
  ]
}
```

---

## Indexes

Optimized for common queries:

### Product Indexes

- `slug` - Fast product lookup by URL
- `categoryId` - Filter by category
- `status` - Filter by status
- `featured` - Get featured products
- `createdAt` - Sort by newest

### ProductImage Indexes

- `productId` - Get all images for a product
- `isPrimary` - Find primary image quickly

### ProductVariant Indexes

- `productId` - Get all variants for a product
- `sku` - Fast variant lookup
- `isActive` - Filter active variants

---

## Common Queries

### Get Product with All Relations

```typescript
const product = await prisma.product.findUnique({
  where: { slug: "premium-tshirt" },
  include: {
    category: true,
    images: {
      orderBy: { position: "asc" },
    },
    variantOptions: true,
    variants: {
      where: { isActive: true },
      orderBy: { name: "asc" },
    },
  },
});
```

### Get Featured Products

```typescript
const featured = await prisma.product.findMany({
  where: {
    featured: true,
    status: "ACTIVE",
  },
  include: {
    images: {
      where: { isPrimary: true },
    },
  },
  take: 10,
});
```

### Check Stock Availability

```typescript
// For simple product
const product = await prisma.product.findUnique({
  where: { id: productId },
  select: { stock: true, hasVariants: true },
});

// For product with variants
const variant = await prisma.productVariant.findUnique({
  where: { sku: variantSku },
  select: { stock: true, isActive: true },
});
```

### Get Products by Category

```typescript
const products = await prisma.product.findMany({
  where: {
    categoryId: categoryId,
    status: "ACTIVE",
  },
  include: {
    images: {
      where: { isPrimary: true },
    },
  },
  orderBy: { createdAt: "desc" },
});
```

---

## Business Logic Examples

### Calculate Total Stock

```typescript
async function getTotalStock(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product.hasVariants) {
    return product.stock;
  }

  return product.variants.reduce((total, variant) => {
    return total + (variant.isActive ? variant.stock : 0);
  }, 0);
}
```

### Get Price Range

```typescript
async function getPriceRange(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { where: { isActive: true } } },
  });

  if (!product.hasVariants) {
    return {
      min: product.salePrice || product.basePrice,
      max: product.salePrice || product.basePrice,
    };
  }

  const prices = product.variants.map((v) => v.salePrice || v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
```

### Update Inventory

```typescript
async function updateInventory(sku: string, quantity: number) {
  // Check if it's a product SKU or variant SKU
  const variant = await prisma.productVariant.findUnique({
    where: { sku },
  });

  if (variant) {
    return prisma.productVariant.update({
      where: { sku },
      data: { stock: { decrement: quantity } },
    });
  }

  return prisma.product.update({
    where: { sku },
    data: { stock: { decrement: quantity } },
  });
}
```

---

## Migration Command

```bash
# Create migration
npx prisma migrate dev --name add_product_schema

# Generate Prisma Client
npx prisma generate

# Push to database (development)
npx prisma db push
```

---

## Best Practices

### 1. **Product Creation Flow**

```typescript
// 1. Create product
const product = await prisma.product.create({
  data: {
    name: "Premium T-Shirt",
    slug: "premium-tshirt",
    categoryId: categoryId,
    basePrice: 29.99,
    hasVariants: true,
    status: "DRAFT",
  },
});

// 2. Add images
await prisma.productImage.createMany({
  data: [
    { productId: product.id, url: "/img1.jpg", position: 0, isPrimary: true },
    { productId: product.id, url: "/img2.jpg", position: 1 },
  ],
});

// 3. Add variant options
await prisma.variantOption.create({
  data: {
    productId: product.id,
    name: "Size",
    values: ["S", "M", "L", "XL"],
  },
});

// 4. Create variants
await prisma.productVariant.createMany({
  data: [
    {
      productId: product.id,
      sku: "TSHIRT-S",
      name: "Small",
      options: '{"Size":"S"}',
      price: 29.99,
      stock: 50,
    },
    {
      productId: product.id,
      sku: "TSHIRT-M",
      name: "Medium",
      options: '{"Size":"M"}',
      price: 29.99,
      stock: 75,
    },
  ],
});

// 5. Publish
await prisma.product.update({
  where: { id: product.id },
  data: { status: "ACTIVE" },
});
```

### 2. **Inventory Management**

- Always check `hasVariants` before accessing stock
- Use transactions for inventory updates
- Set product status to `OUT_OF_STOCK` when all variants are depleted

### 3. **Performance**

- Use `select` to limit fields returned
- Use `include` judiciously
- Leverage indexes for filtering
- Consider caching for frequently accessed products

---

## Summary

This schema provides:

✅ **Flexible Product Types** - Simple or with variants
✅ **Multiple Images** - With ordering and primary selection
✅ **Single Variant Type** - Max one variant (Size OR Color)
✅ **Comprehensive Pricing** - Base, sale, and cost prices
✅ **Inventory Management** - Per product or per variant
✅ **SEO Optimization** - Meta fields for search engines
✅ **Production Ready** - Indexes, constraints, and cascading deletes
✅ **Scalable** - Designed for growth

Perfect for small to medium e-commerce platforms! 🚀
