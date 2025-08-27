# AppLauncher Integration Guide

This guide details exactly how AppLauncher should implement the integration functions used by the Tree of Links template. Each function includes the expected parameters, return types, and example payloads.

## Overview

The Tree of Links template uses these integration functions to connect to your existing AppLauncher infrastructure:

- **Authentication**: User management and session handling
- **Links**: CRUD operations for user links with ordering support
- **Analytics**: Click tracking and performance metrics
- **Payments**: Monetization through tips and subscriptions
- **Themes**: Visual customization persistence

All functions should be async and handle errors appropriately. The template expects consistent return shapes to ensure proper functionality.

## Authentication Functions

### `getCurrentUser()`

Get the currently authenticated user information.

**Location**: `/src/integrations/applauncher/auth.ts`

**Returns**: `Promise<User | null>`

**Interface**:
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}
```

**Example Return**:
```json
{
  "id": "user-123",
  "username": "johndoe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "bio": "Full-stack developer passionate about building great user experiences.",
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
}
```

**Notes**:
- Return `null` if no user is authenticated
- This drives the dashboard and profile page functionality

### `getUserByUsername(username: string)`

Fetch a user's profile information by their username for public profile pages.

**Location**: `/src/integrations/applauncher/auth.ts`

**Parameters**:
- `username` (string): The username to look up

**Returns**: `Promise<User | null>`

**Example Return**:
```json
{
  "id": "user-456",
  "username": "sarahsmith",
  "email": "sarah@example.com",
  "displayName": "Sarah Smith",
  "bio": "Designer & entrepreneur. Creating beautiful digital experiences.",
  "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
}
```

### `createOrUpdateUser(userData: Partial<User>)`

Create a new user account or update an existing one.

**Location**: `/src/integrations/applauncher/auth.ts`

**Parameters**:
- `userData` (Partial<User>): User data to create or update

**Returns**: `Promise<User>`

**Notes**:
- Should handle both creation and updates based on whether `id` is provided
- Used during user onboarding

### `isUsernameAvailable(username: string)`

Check if a username is available for registration.

**Location**: `/src/integrations/applauncher/auth.ts`

**Parameters**:
- `username` (string): The username to check

**Returns**: `Promise<boolean>`

## Link Management Functions

### `listLinks()`

Get all links for the current user, ordered by their position.

**Location**: `/src/integrations/applauncher/links.ts`

**Returns**: `Promise<Link[]>`

**Interface**:
```typescript
interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isPremium: boolean;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Return**:
```json
[
  {
    "id": "link-1",
    "title": "GitHub",
    "url": "https://github.com/johndoe",
    "icon": "github",
    "isPremium": false,
    "isVisible": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "link-2",
    "title": "Portfolio",
    "url": "https://johndoe.dev",
    "icon": "globe",
    "isPremium": true,
    "isVisible": false,
    "order": 1,
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**Notes**:
- Links should be sorted by `order` field in ascending order
- Used to populate the dashboard link manager

### `createLink(linkData: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>)`

Create a new link for the current user.

**Location**: `/src/integrations/applauncher/links.ts`

**Parameters**:
- `linkData`: Link data without system-generated fields

**Returns**: `Promise<Link>`

**Notes**:
- Generate unique `id` and timestamps
- Set appropriate default values for optional fields

### `updateLink(id: string, updates: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>)`

Update an existing link.

**Location**: `/src/integrations/applauncher/links.ts`

**Parameters**:
- `id` (string): Link ID to update
- `updates`: Fields to update

**Returns**: `Promise<Link>`

**Notes**:
- Should update the `updatedAt` timestamp
- Throw error if link not found

### `deleteLink(id: string)`

Delete a link.

**Location**: `/src/integrations/applauncher/links.ts`

**Parameters**:
- `id` (string): Link ID to delete

**Returns**: `Promise<void>`

**Notes**:
- Throw error if link not found or doesn't belong to current user

### `reorderLinks(linkIds: string[])`

Update the order of links based on new positions.

**Location**: `/src/integrations/applauncher/links.ts`

**Parameters**:
- `linkIds` (string[]): Array of link IDs in new order

**Returns**: `Promise<void>`

**Example**:
```javascript
// If user drags link-3 to position 0
reorderLinks(['link-3', 'link-1', 'link-2']);
// Should update order fields: link-3.order = 0, link-1.order = 1, link-2.order = 2
```

## Analytics Functions

### `trackClick(event: Omit<ClickEvent, 'timestamp'>)`

Track a link click event.

**Location**: `/src/integrations/applauncher/analytics.ts`

**Parameters**:
- `event`: Click event data without timestamp

**Interface**:
```typescript
interface ClickEvent {
  linkId: string;
  userId: string;
  referrer?: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}
```

**Example Call**:
```javascript
await trackClick({
  linkId: 'link-123',
  userId: 'user-456',
  referrer: 'https://twitter.com',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  ipAddress: '192.168.1.100'
});
```

### `getLinkStats(userId: string)`

Get detailed statistics for all links belonging to a user.

**Location**: `/src/integrations/applauncher/analytics.ts`

**Parameters**:
- `userId` (string): User ID to get stats for

**Returns**: `Promise<LinkStats[]>`

**Interface**:
```typescript
interface LinkStats {
  linkId: string;
  title: string;
  url: string;
  totalClicks: number;
  uniqueClicks: number;
  totalViews: number;
  clicksByDate: { [date: string]: number };
  topReferrers: { [referrer: string]: number };
  recentClicks: ClickEvent[];
  ctr: number;
}
```

**Example Return**:
```json
[
  {
    "linkId": "link-1",
    "title": "My Blog",
    "url": "https://blog.example.com",
    "totalClicks": 1250,
    "uniqueClicks": 890,
    "totalViews": 5000,
    "ctr": 25.0,
    "clicksByDate": {
      "2024-01-01": 45,
      "2024-01-02": 52,
      "2024-01-03": 38
    },
    "topReferrers": {
      "google.com": 200,
      "twitter.com": 150,
      "direct": 100
    },
    "recentClicks": [
      {
        "linkId": "link-1",
        "userId": "user-123",
        "referrer": "google.com",
        "timestamp": "2024-01-03T10:30:00.000Z",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.100"
      }
    ]
  }
]
```

## Payment Functions

### `createTipSession(userId: string)`

Create a payment session for tipping a user.

**Location**: `/src/integrations/applauncher/payments.ts`

**Parameters**:
- `userId` (string): User ID to create tip session for

**Returns**: `Promise<PaymentSession>`

**Interface**:
```typescript
interface PaymentSession {
  id: string;
  url: string;
  expiresAt: Date;
}
```

**Example Return**:
```json
{
  "id": "tip-session-123",
  "url": "https://payment-provider.com/tip/user-456",
  "expiresAt": "2024-01-01T01:30:00.000Z"
}
```

### `createSubscriptionSession(userId: string)`

Create a payment session for subscribing to a user.

**Location**: `/src/integrations/applauncher/payments.ts`

**Parameters**:
- `userId` (string): User ID to create subscription session for

**Returns**: `Promise<PaymentSession>`

**Example Return**:
```json
{
  "id": "sub-session-456",
  "url": "https://payment-provider.com/subscribe/user-789",
  "expiresAt": "2024-01-01T01:30:00.000Z"
}
```

### `unlockPremiumLink(linkId: string, userId: string)`

Unlock a premium link for a user (after payment).

**Location**: `/src/integrations/applauncher/payments.ts`

**Parameters**:
- `linkId` (string): Link ID to unlock
- `userId` (string): User ID unlocking the link

**Returns**: `Promise<boolean>`

**Notes**:
- Return `true` if unlock successful, `false` otherwise
- Should validate payment status before unlocking

## Theme Functions

### `getTheme(userId: string)`

Get the theme configuration for a user.

**Location**: `/src/integrations/applauncher/db.ts`

**Parameters**:
- `userId` (string): User ID to get theme for

**Returns**: `Promise<Theme | null>`

**Interface**:
```typescript
interface Theme {
  id: string;
  userId: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  backgroundImage?: string;
  font?: string;
  isDarkMode?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Return**:
```json
{
  "id": "theme-123",
  "userId": "user-456",
  "name": "Ocean Blue",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#60a5fa",
    "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "text": "#ffffff"
  },
  "backgroundImage": "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop",
  "font": "Inter",
  "isDarkMode": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `saveTheme(theme: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>)`

Save or update a user's theme configuration.

**Location**: `/src/integrations/applauncher/db.ts`

**Parameters**:
- `theme`: Theme data without system-generated fields

**Returns**: `Promise<Theme>`

**Notes**:
- Should handle both creation and updates
- Generate `id` and timestamps for new themes

## Error Handling

All functions should handle errors appropriately:

- **Authentication errors**: Return `null` for `getCurrentUser()` and `getUserByUsername()`
- **Not found errors**: Throw descriptive errors for missing resources
- **Permission errors**: Throw errors when users try to access unauthorized resources
- **Validation errors**: Throw errors for invalid input data

## Data Consistency

- Maintain referential integrity between users and their links/themes
- Ensure link ordering remains consistent after reorder operations
- Handle concurrent updates appropriately (optimistic locking recommended)

## Performance Considerations

- Implement appropriate database indexing
- Cache frequently accessed data (themes, user profiles)
- Use efficient queries for analytics data
- Consider pagination for large link lists (future enhancement)

---

For questions about implementation or if you need clarification on any function signature, refer to the mock implementations in the integration files or open an issue in the repository.
