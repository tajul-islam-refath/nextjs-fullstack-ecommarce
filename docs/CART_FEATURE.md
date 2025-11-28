# Guest User Cart Feature

## Overview

Implemented a complete shopping cart feature that supports both authenticated users and guest visitors. Guest sessions are tracked via cookies and stored in the database.

## Database Schema

### GuestSession Model

- `id`: UUID (primary key)
- `sessionToken`: Unique session token
- `createdAt`: Timestamp
- `expiresAt`: Timestamp (30 days from creation)
- `cart`: One-to-one relation with Cart

### Cart Model

- `id`: CUID (primary key)
- `userId`: Optional reference to User
- `guestSessionId`: Optional reference to GuestSession
- `items`: One-to-many relation with CartItem
- **Note**: A cart belongs to either a user OR a guest session

### CartItem Model

- `id`: CUID (primary key)
- `cartId`: Reference to Cart
- `productId`: Reference to Product
- `variantId`: Optional reference to ProductVariant
- `quantity`: Integer (default: 1)
- **Unique constraint**: (cartId, productId, variantId) - prevents duplicate items

## Implementation Details

### 1. Guest Session Tracking

- **Proxy/Middleware** (`proxy.ts`): Generates and sets `guest_session` cookie
- **Guest Tracker** (`lib/guest.ts`): Persists guest sessions to database
- **Component** (`GuestUserTracker.tsx`): Server component that tracks sessions on page load

### 2. Cart Actions (`lib/actions/cart.ts`)

Server actions for cart management:

- `getCart()`: Fetches cart for current user or guest
- `addToCart(productId, variantId, quantity)`: Adds item to cart
- `removeFromCart(itemId)`: Removes item from cart
- `updateCartItemQuantity(itemId, quantity)`: Updates item quantity

### 3. UI Components

#### Cart Page (`app/(store)/cart/page.tsx`)

- Server component that fetches cart data
- Renders CartClient with cart data

#### CartClient (`components/store/cart/CartClient.tsx`)

- Displays cart items or empty state
- Grid layout with items on left, summary on right

#### CartItem (`components/store/cart/CartItem.tsx`)

- Individual cart item display
- Quantity controls (+/-)
- Remove button
- Price calculation with discounts

#### CartSummary (`components/store/cart/CartSummary.tsx`)

- Order summary with subtotal, savings, shipping
- Free shipping threshold ($50)
- Checkout button
- Trust badges

#### CartCount (`components/store/CartCount.tsx`)

- Badge showing cart item count
- Displayed in navbar
- Client component that fetches on mount

### 4. Product Integration

Updated `product-context.tsx`:

- `addToCart()` now calls server action
- Shows toast notifications on success/error
- Supports both simple products and variants

## Features

### Guest Users

✅ Automatic session creation via cookie
✅ Session persisted to database (30-day expiry)
✅ Full cart functionality without login
✅ Cart survives page refreshes

### Cart Management

✅ Add products to cart (with variants)
✅ Update quantities
✅ Remove items
✅ View cart summary
✅ Calculate totals with discounts
✅ Free shipping threshold

### User Experience

✅ Toast notifications for actions
✅ Real-time cart count in navbar
✅ Responsive design
✅ Loading states
✅ Empty cart state
✅ Price calculations with sale prices

## Usage

### Adding to Cart

```tsx
import { addToCart } from "@/lib/actions/cart";

// Add simple product
await addToCart(productId, null, quantity);

// Add product variant
await addToCart(productId, variantId, quantity);
```

### Getting Cart

```tsx
import { getCart } from "@/lib/actions/cart";

const cart = await getCart();
// Returns cart for current user or guest session
```

### Updating Quantity

```tsx
import { updateCartItemQuantity } from "@/lib/actions/cart";

await updateCartItemQuantity(itemId, newQuantity);
```

### Removing Item

```tsx
import { removeFromCart } from "@/lib/actions/cart";

await removeFromCart(itemId);
```

## Security Considerations

1. **Session Validation**: Guest sessions are validated via cookie token
2. **Ownership Checks**: Cart actions verify ownership before modifications
3. **HttpOnly Cookies**: Session cookies are httpOnly and secure in production
4. **Unique Constraints**: Database prevents duplicate cart items

## Future Enhancements

- [ ] Merge guest cart with user cart on login
- [ ] Cart expiration/cleanup for old guest sessions
- [ ] Persistent cart across devices for logged-in users
- [ ] Cart item stock validation
- [ ] Wishlist integration
- [ ] Recently viewed items
- [ ] Cart abandonment tracking

## Files Created/Modified

### Created

- `/proxy.ts` - Middleware for guest session cookies
- `/lib/guest.ts` - Guest session utilities
- `/lib/actions/cart.ts` - Cart server actions
- `/app/(store)/cart/page.tsx` - Cart page
- `/components/store/cart/CartClient.tsx`
- `/components/store/cart/CartItem.tsx`
- `/components/store/cart/CartSummary.tsx`
- `/components/store/CartCount.tsx`
- `/components/common/GuestUserTracker.tsx`

### Modified

- `/prisma/schema.prisma` - Added GuestSession, Cart, CartItem models
- `/components/store/product/product-context.tsx` - Integrated cart actions
- `/components/store/Navbar.tsx` - Added cart count badge
- `/app/(store)/layout.tsx` - Added GuestUserTracker

## Database Migrations

- `20251128030542_add_guest_session` - Added GuestSession table
- `20251128034017_add_cart_model` - Added Cart and CartItem tables
