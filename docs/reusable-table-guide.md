# Reusable Data Table with Pagination

This guide shows how to use the reusable `DataTableWithPagination` component and `usePagination` hook in your pages.

## Components Created

### 1. `DataTableWithPagination` Component

**Location:** `/components/common/DataTableWithPagination.tsx`

A generic, reusable table component with built-in pagination that works with any data type.

### 2. `usePagination` Hook

**Location:** `/hooks/usePagination.ts`

A custom hook that handles URL-based pagination for Next.js server components.

---

## Basic Usage

### Step 1: Define Your Data Type

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}
```

### Step 2: Define Table Columns

```typescript
import { Column } from "@/components/common/DataTableWithPagination";

const columns: Column<Product>[] = [
  {
    key: "name",
    header: "Product Name",
    render: (product) => <span className="font-medium">{product.name}</span>,
  },
  {
    key: "price",
    header: "Price",
    render: (product) => <span>${product.price.toFixed(2)}</span>,
  },
  {
    key: "stock",
    header: "Stock",
    render: (product) => (
      <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
        {product.stock}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    render: (product) => (
      <Button onClick={() => handleEdit(product)}>Edit</Button>
    ),
  },
];
```

### Step 3: Use in Your Component

```typescript
"use client";

import {
  DataTableWithPagination,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { usePagination } from "@/hooks/usePagination";

interface ProductListProps {
  products: Product[];
  pagination: PaginationData;
}

export function ProductList({ products, pagination }: ProductListProps) {
  const { isPending, handlePageChange } = usePagination(
    pagination.totalPages,
    pagination.limit
  );

  return (
    <DataTableWithPagination
      data={products}
      columns={columns}
      pagination={pagination}
      onPageChange={handlePageChange}
      isPending={isPending}
      emptyMessage="No products found."
      getRowKey={(product) => product.id}
    />
  );
}
```

---

## Complete Example: User Management Page

### Server Component (`app/admin/users/page.tsx`)

```typescript
import { UserManagementClient } from "@/components/users/UserManagementClient";
import { apiConfig, cacheConfig, paginationConfig } from "@/lib/config";

interface SearchParams {
  page?: string;
  limit?: string;
}

async function fetchUsers(page: string, limit: string) {
  const apiUrl = `${apiConfig.baseUrl}/api/users?page=${page}&limit=${limit}`;

  const response = await fetch(apiUrl, {
    next: {
      tags: ["users"],
      revalidate: cacheConfig.users.revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams.page || String(paginationConfig.defaultPage);
  const limit = searchParams.limit || String(paginationConfig.defaultLimit);

  try {
    const result = await fetchUsers(page, limit);

    return (
      <UserManagementClient
        initialUsers={result.data}
        initialPagination={result.pagination}
      />
    );
  } catch (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load users"}
        </p>
      </div>
    );
  }
}
```

### Client Component (`components/users/UserManagementClient.tsx`)

```typescript
"use client";

import { Mail, Shield, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DataTableWithPagination,
  Column,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { usePagination } from "@/hooks/usePagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface UserManagementClientProps {
  initialUsers: User[];
  initialPagination: PaginationData;
}

export function UserManagementClient({
  initialUsers,
  initialPagination,
}: UserManagementClientProps) {
  const { isPending, handlePageChange } = usePagination(
    initialPagination.totalPages,
    initialPagination.limit
  );

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{user.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            {user.role}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (user) => (
        <span className="text-slate-600">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(user)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    // Handle edit logic
  };

  const handleDelete = (user: User) => {
    // Handle delete logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">
            Manage your users ({initialPagination.total} total)
          </p>
        </div>
        <Button>Add User</Button>
      </div>

      <DataTableWithPagination
        data={initialUsers}
        columns={columns}
        pagination={initialPagination}
        onPageChange={handlePageChange}
        isPending={isPending}
        emptyMessage="No users found."
        getRowKey={(user) => user.id}
      />
    </div>
  );
}
```

---

## API Reference

### DataTableWithPagination Props

| Prop           | Type                     | Required | Description                             |
| -------------- | ------------------------ | -------- | --------------------------------------- |
| `data`         | `T[]`                    | ✅       | Array of data items to display          |
| `columns`      | `Column<T>[]`            | ✅       | Column definitions                      |
| `pagination`   | `PaginationData`         | ✅       | Pagination metadata                     |
| `onPageChange` | `(page: number) => void` | ✅       | Callback when page changes              |
| `isPending`    | `boolean`                | ❌       | Loading state during page transitions   |
| `emptyMessage` | `string`                 | ❌       | Message to show when no data            |
| `getRowKey`    | `(item: T) => string`    | ✅       | Function to get unique key for each row |

### Column Definition

```typescript
interface Column<T> {
  key: string; // Unique identifier for the column
  header: string; // Column header text
  render: (item: T) => ReactNode; // Render function for cell content
  className?: string; // Optional CSS class for cells
  headerClassName?: string; // Optional CSS class for header
}
```

### PaginationData Type

```typescript
interface PaginationData {
  page: number; // Current page number
  limit: number; // Items per page
  total: number; // Total number of items
  totalPages: number; // Total number of pages
  hasNext: boolean; // Whether there's a next page
  hasPrevious: boolean; // Whether there's a previous page
}
```

### usePagination Hook

```typescript
const { isPending, handlePageChange } = usePagination(
  totalPages: number,
  limit: number
);
```

**Returns:**

- `isPending`: Boolean indicating if page transition is in progress
- `handlePageChange`: Function to change pages `(newPage: number) => void`

---

## Advanced Features

### Custom Cell Rendering

```typescript
{
  key: "status",
  header: "Status",
  render: (item) => {
    const statusColors = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span className={`px-2 py-1 rounded text-sm ${statusColors[item.status]}`}>
        {item.status}
      </span>
    );
  },
}
```

### Conditional Styling

```typescript
{
  key: "price",
  header: "Price",
  className: "font-mono",
  render: (product) => (
    <span className={product.price > 100 ? "text-green-600" : "text-slate-600"}>
      ${product.price.toFixed(2)}
    </span>
  ),
}
```

### Action Buttons

```typescript
{
  key: "actions",
  header: "Actions",
  headerClassName: "text-right",
  className: "text-right",
  render: (item) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={() => handleView(item)}>View</Button>
      <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>
      <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
        Delete
      </Button>
    </div>
  ),
}
```

---

## Benefits

✅ **Type-Safe** - Full TypeScript support with generics
✅ **Reusable** - Works with any data type
✅ **Flexible** - Custom column rendering
✅ **SEO-Friendly** - URL-based pagination
✅ **Performance** - Automatic caching with Next.js
✅ **UX** - Smooth transitions without full page reloads
✅ **Accessible** - Proper ARIA labels and semantic HTML

---

## Migration Guide

### Before (Old Approach)

```typescript
// Custom table component for each entity
<CategoryTable categories={categories} />
<div className="pagination">
  <button onClick={() => setPage(page - 1)}>Previous</button>
  <button onClick={() => setPage(page + 1)}>Next</button>
</div>
```

### After (New Approach)

```typescript
// Reusable component with columns definition
<DataTableWithPagination
  data={categories}
  columns={categoryColumns}
  pagination={pagination}
  onPageChange={handlePageChange}
  getRowKey={(item) => item.id}
/>
```

**Advantages:**

- Less code duplication
- Consistent pagination across all pages
- Centralized pagination logic
- Easier to maintain and test
