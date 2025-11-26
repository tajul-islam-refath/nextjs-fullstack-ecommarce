# Product Search and Filters Implementation

I have implemented search and filtering functionality for the product list page.

## Changes Made

1.  **Created `ProductFilters` Component** (`components/products/ProductFilters.tsx`)

    - Provides UI for:
      - Search (debounced)
      - Category filter
      - Featured status filter
      - Sorting options
    - Updates URL parameters to trigger server-side filtering.

2.  **Created `useDebounce` Hook** (`hooks/use-debounce.ts`)

    - Used to delay search input updates to prevent excessive API calls.

3.  **Updated `ProductsPage`** (`app/admin/products/page.tsx`)

    - Fetches all categories to populate the filter dropdown.
    - Passes categories to the client component.

4.  **Updated `ProductManagementClient`** (`components/products/ProductManagementClient.tsx`)
    - Accepts `categories` prop.
    - Renders `ProductFilters` above the product table.

## How it Works

1.  User interacts with filters (types in search, selects category, etc.).
2.  `ProductFilters` updates the URL search parameters (e.g., `?search=phone&categoryId=123`).
3.  The page reloads (server-side) with the new parameters.
4.  `ProductsPage` fetches filtered data using the existing `fetchProducts` API.
5.  The table displays the filtered results.
