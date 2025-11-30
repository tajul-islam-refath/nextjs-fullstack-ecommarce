# Analytics Feature Implementation

## Overview

Added a dedicated analytics page to the admin dashboard (`/admin/analytics`) to provide insights into sales performance and top-selling products.

## New Files

### 1. `/app/admin/analytics/page.tsx`

- **Purpose**: Main entry point for the analytics dashboard.
- **Features**:
  - Server-side initial data fetching.
  - Suspense boundary for loading state.
  - Metadata for SEO.

### 2. `/components/admin/analytics/AnalyticsClient.tsx`

- **Purpose**: Client component for managing analytics state and UI.
- **Features**:
  - **Period Filtering**: Dropdown to select time range (Last 7 days, Last 30 days, This Month, Last Month).
  - **Summary Cards**: Total Revenue, Total Orders, Average Order Value.
  - **Layout**: Responsive grid layout for charts and lists.

### 3. `/components/admin/analytics/SalesChart.tsx`

- **Purpose**: Visualizing sales trends.
- **Features**:
  - Uses `recharts` library.
  - Area chart showing sales over time.
  - Custom tooltip with detailed info (Sales amount, Order count).
  - Responsive container.

### 4. `/components/admin/analytics/TopProducts.tsx`

- **Purpose**: Displaying top performing products.
- **Features**:
  - Ranked list of top 5 selling products.
  - Shows quantity sold.

## Updated Files

### 1. `/lib/service/order.service.ts`

- Added `getSalesAnalytics(startDate, endDate)`: Fetches and groups order data by date.
- Added `getTopSellingProducts(limit)`: Aggregates order items to find top selling products by quantity.

### 2. `/lib/actions/dashboard.actions.ts`

- Added `getAnalyticsData(period)`: Server action to coordinate data fetching based on selected time period. Handles date logic for different periods.

## Dependencies Added

- `recharts`: For charting.
- `date-fns`: For date formatting.

## Usage

Navigate to `/admin/analytics` to view the dashboard. Use the dropdown in the top right to filter data by different time periods.
