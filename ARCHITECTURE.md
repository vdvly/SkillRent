# SkillRent MVP - Architecture & Implementation Guide

## 📐 Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│                   React + Vite (5173)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Pages: Auth, Dashboard, Services, Requests, Messages│   │
│  │ Components: Navbar, ProtectedRoute, Loading         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                      HTTP (Axios)
                            │
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                                │
│                 NestJS REST API (3000)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Auth    User    Service    Request    Message  Review│   │
│  │ Module  Module  Module     Module     Module  Module│   │
│  └─────────────────────────────────────────────────────┘   │
│  │  Controllers • Services • DTOs • Guards             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                      Prisma ORM
                            │
┌─────────────────────────────────────────────────────────────┐
│                 DATABASE LAYER                               │
│              PostgreSQL (5432)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Users • Services • Requests • Messages              │   │
│  │ Reviews • Payments                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Concepts

### Authentication Flow

```
1. User Registration
   └─ POST /auth/register (email, password, name)
   └─ Validate input → Hash password → Create user → Return user data

2. User Login
   └─ POST /auth/login (email, password)
   └─ Validate credentials → Generate JWT → Return token + user

3. Protected Requests
   └─ Frontend: Store JWT in localStorage
   └─ Every request: Include Authorization header
   └─ Backend: Verify JWT with JwtGuard → Extract user ID
```

### Data Flow Example: Creating a Service

```
FRONTEND:
1. User fills form (title, description, price)
2. onClick → POST /services with data
3. Include JWT token in Authorization header

BACKEND:
1. AuthGuard intercepts request
2. Validates JWT token → Extracts user ID
3. ServicesController receives request
4. ServicesService.createService(userId, dto)
5. Prisma creates record in database
6. Return created service to frontend

FRONTEND:
1. Response received
2. Redirect to /services
3. Display success message
```

### Database Relationships

```
User (1 → ∞)
├─ Services (1 owner → ∞ services)
├─ ServiceRequests (1 requester → ∞ requests)
├─ Messages Sent (1 sender → ∞ messages)
├─ Messages Received (1 receiver → ∞ messages)
├─ Reviews Given (1 reviewer → ∞ reviews)
├─ Reviews Received (1 reviewee → ∞ reviews)
└─ Payments (1 → ∞ payments)
```

## 🔑 Key Design Decisions

### 1. Module-Based Architecture

**Why:** Easy to scale, reusable logic, clear separation of concerns

```
Each module has:
- Controller: Handles HTTP requests
- Service: Business logic
- DTOs: Input/output validation
- Module: Dependency injection
```

### 2. JWT Authentication

**Why:** Stateless, scalable, industry standard

```
Token payload: { id: user_id, email: user_email }
Expiration: 24 hours
Stored in: localStorage (frontend)
Sent in: Authorization: Bearer {token}
```

### 3. Prisma ORM

**Why:** Type-safe, auto-migrations, excellent DX

```
Features:
- Auto-generated migration files
- Type-safe database queries
- Prisma Studio for dev
- Built-in relationship handling
```

### 4. React Context + Hooks

**Why:** Lightweight state management, no external deps

```
Context: AuthContext (user, login, logout, register)
Hooks: useAuth (access auth state)
Storage: localStorage for JWT persistence
```

## 📊 Database Schema Details

### User Model

```typescript
{
  id: string(cuid); // Unique identifier
  email: string(unique); // Login email
  password: string; // Hashed with bcrypt
  name: string; // Display name
  profilePicture: string // URL or file path
    ? bio
    : string // User bio
      ? latitude
      : float // For geolocation
        ? longitude
        : float // For geolocation
          ? averageRating
          : float; // 0-5 stars (calculated from reviews)
  createdAt: DateTime; // Account creation
  updatedAt: DateTime; // Last update
}
```

### Service Model

```typescript
{
  id: string(cuid); // Unique identifier
  title: string; // Service name
  description: string; // Service details
  price: float; // Price per hour
  ownerId: string(FK); // Reference to User
  latitude: float // Location (for future filtering)
    ? longitude
    : float // Location (for future filtering)
      ? createdAt
      : DateTime; // Created at
  updatedAt: DateTime; // Updated at
}
```

### ServiceRequest Model

```typescript
{
  id: string(cuid); // Unique identifier
  title: string; // What's needed
  description: string; // Request details
  budget: float; // Budget amount
  requesterId: string(FK); // Reference to User
  latitude: float // Location
    ? longitude
    : float // Location
      ? createdAt
      : DateTime; // Posted at
  updatedAt: DateTime; // Updated at
}
```

### Message Model

```typescript
{
  id: string (cuid)           // Unique identifier
  content: string             // Message body
  senderId: string (FK)       // Who sent
  receiverId: string (FK)     // Who receives
  createdAt: DateTime         // Created at
  isRead: boolean             // Read status (future feature)
  readAt: DateTime?           // When read (future feature)
}
```

### Review Model

```typescript
{
  id: string(cuid); // Unique identifier
  rating: int(1 - 5); // Star rating
  comment: string // Review text
    ? reviewerId
    : string(FK); // Who reviewed
  reviewedUserId: string(FK); // Who was reviewed
  createdAt: DateTime; // Created at
}
```

## 🚀 Implementation Checklist

### Backend Setup ✅

- [x] NestJS project initialized
- [x] Prisma ORM configured
- [x] PostgreSQL connection ready
- [x] JWT authentication implemented
- [x] 6 core modules created
- [x] DTO validation setup
- [x] Error handling
- [x] CORS enabled
- [x] Environment configuration

### Frontend Setup ✅

- [x] React + Vite initialized
- [x] React Router configured
- [x] Axios HTTP client setup
- [x] AuthContext created
- [x] Custom hooks (useAuth, useApi)
- [x] Protected routes
- [x] All pages created
- [x] Global styles
- [x] API service layer

### Database ✅

- [x] Prisma schema defined
- [x] All models created
- [x] Relationships configured
- [x] Indexes on frequent queries
- [x] Timestamps on all models

## 🔄 API Endpoints Reference

### Auth Module

```
POST   /auth/register          → Register user
POST   /auth/login             → Login user
GET    /auth/me                → Get current user profile
```

### Users Module

```
GET    /users                  → List all users
GET    /users/:id              → Get user by ID
PUT    /users/profile          → Update profile (protected)
```

### Services Module

```
GET    /services               → List all services
GET    /services/:id           → Get service details
POST   /services               → Create service (protected)
PUT    /services/:id           → Update service (protected)
DELETE /services/:id           → Delete service (protected)
GET    /services/owner/:id     → Get user's services
```

### Requests Module

```
GET    /requests               → List all requests
GET    /requests/:id           → Get request details
POST   /requests               → Create request (protected)
PUT    /requests/:id           → Update request (protected)
DELETE /requests/:id           → Delete request (protected)
GET    /requests/requester/:id → Get user's requests
```

### Messages Module

```
POST   /messages               → Send message (protected)
GET    /messages/received      → Get received messages (protected)
GET    /messages/conversation/:userId → Get conversation (protected)
POST   /messages/:id/read      → Mark message as read (protected)
```

### Reviews Module

```
POST   /reviews                → Create review (protected)
GET    /reviews/:userId        → Get reviews for user
```

## 🛡️ Security Best Practices Implemented

✅ **Password Security**

- Bcrypt hashing with salt rounds
- Min 6 character requirement
- Never returned from API

✅ **JWT Security**

- 24-hour expiration
- Stored in localStorage
- Automatic injection via middleware
- Auto-logout on invalid token

✅ **Input Validation**

- DTO validation on all endpoints
- Type checking with TypeScript
- Class-validator decorators

✅ **Database**

- Foreign key constraints
- Cascade delete for related records
- Unique constraints on email
- Indexed frequent queries

✅ **API Security**

- CORS configured securely
- Protected routes with AuthGuard
- User ownership verification
- No sensitive data in errors

## 🚀 Performance Considerations

### Database Optimization

- Indexes on: email, userId, createdAt, Foreign Keys
- Pagination on list endpoints (default 20 items)
- Relationship includes only when needed

### Frontend Optimization

- Lazy loading components
- Code splitting with React Router
- Efficient API calls
- Local caching with context

### Scalability Ready

- Stateless API (easy horizontal scaling)
- Database connection pooling ready
- Modular structure for microservices
- Prepared for caching layer

## 🔮 Future Enhancement Roadmap

### Phase 2: Core Features

1. **Search & Discovery**
   - Full-text search on services
   - Filter by category, price, rating
   - Geolocation-based search

2. **Geolocation**
   - Google Maps integration
   - Distance-based filtering
   - Location-based recommendations

3. **Enhanced Messaging**
   - WebSocket real-time messaging
   - Read receipts
   - Typing indicators
   - Media sharing

### Phase 3: Payments

1. **Stripe Integration**
   - Payment model in database
   - Payment service module
   - Transaction history
   - Invoice generation

2. **Escrow System**
   - Funds held during service
   - Release on completion
   - Dispute resolution

### Phase 4: Advanced Features

1. **Recommendations**
   - AI-based service matching
   - Personalized suggestions

2. **Provider Portfolio**
   - Portfolio showcase
   - Certifications
   - Service history

3. **Analytics Dashboard**
   - Provider earnings
   - Customer spending
   - Platform metrics

## 🧪 Testing Strategy

### Unit Tests (Future)

```typescript
// Example: Services Service
describe("ServicesService", () => {
  it("should create a service", async () => {
    // Test implementation
  });
});
```

### Integration Tests (Future)

```typescript
// Example: Services API
describe("Services API", () => {
  it("GET /services should return all services", () => {
    // Test implementation
  });
});
```

### E2E Tests (Future)

```javascript
// Example: Create Service Flow
cy.login(testUser);
cy.createService(serviceData);
cy.verifyServiceCreated();
```

## 📈 Monitoring & Logging

### Recommended Tools

- **Backend Logging**: Winston or Pino
- **Error Tracking**: Sentry
- **Analytics**: Mixpanel or Amplitude
- **Monitoring**: DataDog or New Relic

## 🎓 Learning Path

If you're new to the stack:

1. **NestJS Fundamentals**
   - Decorators & DI
   - Modules architecture
   - Controllers & Services
   - Guards & Middleware

2. **React Fundamentals**
   - Components & JSX
   - Hooks (useState, useEffect, useContext)
   - React Router Navigation
   - Context API

3. **Database Design**
   - Relationships & Foreign Keys
   - Indexing strategies
   - Migration management

4. **Full-Stack Integration**
   - API consumption from frontend
   - Authentication flows
   - Error handling across layers

## 🎯 Next Steps

1. **Clone/Navigate to Project**

   ```bash
   cd SkillRent
   ```

2. **Follow SETUP.md for initial setup**
   - Install dependencies
   - Configure database
   - Start servers

3. **Explore the codebase**
   - Start with backend/src/main.ts
   - Then frontend/src/App.jsx

4. **Create test data**
   - Register users
   - Create services & requests
   - Test messaging

5. **Read module-specific READMEs**
   - backend/README.md
   - frontend/README.md

---

**This is a solid MVP foundation. Everything is organized for easy feature additions!** 🚀
