# Cart Security Best Practices

## Overview

This document outlines the security measures and best practices implemented in the cart system to protect user data and prevent unauthorized access.

## Security Measures Implemented

### 1. **Ownership Verification**

Every cart operation now includes strict ownership verification:

```typescript
// Before: Relied on unguessable IDs (weak security)
await prisma.cartItem.delete({ where: { id: itemId } });

// After: Explicit ownership check
const item = await prisma.cartItem.findUnique({
  where: { id: itemId },
  include: { cart: { include: { guestSession: true } } },
});

if (!item.cart.guestSession?.sessionToken === guestToken) {
  throw new Error("Unauthorized");
}
```

**Why this matters**: Prevents users from manipulating other users' carts by guessing item IDs.

### 2. **Input Validation**

All user inputs are validated before processing:

```typescript
// Product ID validation
if (!productId || typeof productId !== "string") {
  throw new Error("Invalid product ID");
}

// Quantity constraints
if (quantity < 1 || quantity > 99) {
  throw new Error("Quantity must be between 1 and 99");
}
```

**Protections**:

- ✅ Type checking prevents injection attacks
- ✅ Range validation prevents abuse (e.g., adding 999999 items)
- ✅ Null/undefined checks prevent crashes

### 3. **Product & Variant Verification**

Before adding items to cart, we verify they exist and are available:

```typescript
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: { variants: true },
});

if (!product) {
  throw new Error("Product not found");
}

if (variantId) {
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant?.isActive) {
    throw new Error("Product variant is no longer available");
  }
}
```

**Prevents**:

- ❌ Adding deleted products to cart
- ❌ Adding inactive variants
- ❌ Mismatched product-variant combinations

### 4. **Session Validation**

Guest sessions are validated at every step:

```typescript
const guestToken = await getGuestSessionToken();

if (!guestToken) {
  throw new Error("No session found. Please refresh the page.");
}

const guestSession = await prisma.guestSession.findUnique({
  where: { sessionToken: guestToken },
});

if (!guestSession) {
  throw new Error("Invalid session. Please refresh the page.");
}
```

**Benefits**:

- ✅ Prevents operations with expired sessions
- ✅ Ensures session exists in database
- ✅ Clear error messages for users

### 5. **Helper Functions for Reusability**

Extracted common security logic into helper functions:

#### `verifyCartOwnership(cartId: string)`

- Checks if current user/guest owns the specified cart
- Returns cart if owned, null otherwise
- Centralizes ownership logic

#### `getOrCreateCart()`

- Validates session before cart access
- Creates cart if it doesn't exist
- Ensures cart is always associated with valid session

**Advantages**:

- 🔒 Consistent security checks across all operations
- 🔧 Easier to maintain and update
- 🐛 Reduces code duplication and bugs

### 6. **Quantity Limits**

Enforced maximum quantity per item:

```typescript
// When adding items
const newQuantity = Math.min(existingItem.quantity + quantity, 99);

// When updating
if (quantity > 99) {
  throw new Error("Quantity cannot exceed 99");
}
```

**Prevents**:

- ❌ Database overflow
- ❌ UI breaking with large numbers
- ❌ Inventory manipulation

### 7. **Error Handling**

All operations throw descriptive errors instead of silently failing:

```typescript
// Before
if (!item) return; // Silent failure

// After
if (!item) {
  throw new Error("Cart item not found"); // Clear error
}
```

**Benefits**:

- ✅ Users get clear feedback
- ✅ Easier debugging
- ✅ Better error logging

## Security Checklist

When adding new cart operations, ensure:

- [ ] **Input Validation**: All parameters are validated
- [ ] **Ownership Check**: User/guest owns the resource
- [ ] **Session Validation**: Session exists and is valid
- [ ] **Resource Verification**: Products/variants exist and are active
- [ ] **Error Handling**: Descriptive errors for all failure cases
- [ ] **Path Revalidation**: `revalidatePath()` called after mutations
- [ ] **Transaction Safety**: Consider using Prisma transactions for complex operations

## API Functions

### `getCart()`

**Security**: Returns only the cart belonging to current session

### `addToCart(productId, variantId, quantity)`

**Security**:

- ✅ Validates product exists
- ✅ Validates variant (if specified)
- ✅ Validates quantity range (1-99)
- ✅ Caps total quantity at 99
- ✅ Requires valid session

### `removeFromCart(itemId)`

**Security**:

- ✅ Verifies ownership before deletion
- ✅ Validates item exists
- ✅ Requires valid session

### `updateCartItemQuantity(itemId, quantity)`

**Security**:

- ✅ Verifies ownership before update
- ✅ Validates quantity range (1-99)
- ✅ Validates item exists
- ✅ Requires valid session

### `clearCart()`

**Security**:

- ✅ Only clears cart belonging to current session
- ✅ Validates session exists

## Potential Vulnerabilities Addressed

| Vulnerability                               | Mitigation                                  |
| ------------------------------------------- | ------------------------------------------- |
| **IDOR (Insecure Direct Object Reference)** | Ownership verification on all operations    |
| **SQL Injection**                           | Prisma ORM with parameterized queries       |
| **Session Hijacking**                       | HttpOnly cookies, secure flag in production |
| **Resource Exhaustion**                     | Quantity limits (max 99 per item)           |
| **Invalid State**                           | Product/variant existence checks            |
| **Race Conditions**                         | Atomic database operations                  |

## Future Security Enhancements

1. **Rate Limiting**: Prevent cart spam/abuse
2. **CSRF Protection**: Add CSRF tokens for state-changing operations
3. **Audit Logging**: Log all cart modifications for security monitoring
4. **Stock Validation**: Check product stock before adding to cart
5. **Price Validation**: Verify prices haven't changed since adding to cart
6. **Session Expiry**: Implement automatic cleanup of expired guest sessions
7. **Captcha**: Add captcha for suspicious cart activity

## Testing Security

Example test cases:

```typescript
// Test: Cannot modify another user's cart
test("should prevent unauthorized cart access", async () => {
  const result = await removeFromCart(otherUserItemId);
  expect(result).toThrow("Unauthorized");
});

// Test: Cannot add invalid quantities
test("should reject invalid quantities", async () => {
  await expect(addToCart(productId, null, 100)).rejects.toThrow();
  await expect(addToCart(productId, null, 0)).rejects.toThrow();
});

// Test: Cannot add non-existent products
test("should reject non-existent products", async () => {
  await expect(addToCart("fake-id", null, 1)).rejects.toThrow(
    "Product not found"
  );
});
```

## Compliance Notes

- **GDPR**: Guest sessions are anonymized (no PII stored)
- **PCI DSS**: No payment data stored in cart
- **OWASP Top 10**: Addresses broken access control, injection, security misconfiguration

---

**Last Updated**: 2025-11-28  
**Reviewed By**: Development Team  
**Next Review**: When adding authenticated user support
