# SkillRent Backend - Phase 2 API Documentation

## Overview

Phase 2 implements core marketplace features with a focus on clean architecture, proper error handling, and production-readiness.

## 🔑 Key Features

### ✅ Services System

- Full CRUD operations for services
- Category filtering (enum-based)
- Price range filtering
- Keyword search
- Owner verification

### ✅ Requests System

- Full CRUD for service requests
- Urgency level filtering (LOW, MEDIUM, HIGH)
- Budget range filtering
- Keyword search
- Requester verification

### ✅ User Profile System

- Public profile endpoints
- User services listing
- User requests listing
- Review statistics
- Reputation scoring

### ✅ Messaging System

- Conversation-based messaging
- Automatic conversation creation
- Mark messages as read
- Conversation history
- Participant-based access control

### ✅ Reviews System

- User-to-user ratings (1-5 stars)
- Duplicate review prevention (unique constraint)
- Review update and deletion
- Average rating calculation
- Rating statistics and distribution

## 📡 API Endpoints

### Global Response Format

All endpoints return a consistent response format:

```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```

### Error Handling

Errors follow the same format:

```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

---

## 🛠️ Services Endpoints

### GET /services

Get all services with optional filtering

**Query Parameters:**

- `skip` (default: 0) - Pagination offset
- `take` (default: 20) - Number of results
- `category` - Filter by ServiceCategory enum
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Keyword search in title/description

**Example:**

```bash
GET /services?category=PROGRAMMING&minPrice=50&maxPrice=150&search=web
```

### GET /services/:id

Get service by ID with owner details

### GET /services/category/:category

Get services by specific category

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)

### GET /services/owner/:ownerId

Get services offered by a specific user

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 10)

### POST /services

Create a new service (requires authentication)

**Body:**

```json
{
  "title": "string",
  "description": "string",
  "price": number,
  "category": "CLEANING" | "TUTORING" | "REPAIR" | ... | "OTHER",
  "latitude": number (optional),
  "longitude": number (optional)
}
```

### PUT /services/:id

Update service (owner only)

**Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "price": number (optional),
  "category": enum (optional)
}
```

### DELETE /services/:id

Delete service (owner only)

**Service Categories:**

- CLEANING, TUTORING, REPAIR, DESIGN, WRITING, PROGRAMMING, MARKETING, PHOTOGRAPHY, VIDEO, MUSIC, OTHER

---

## 📋 Requests Endpoints

### GET /requests

Get all requests with optional filtering

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)
- `urgency` - Filter by RequestUrgency (LOW, MEDIUM, HIGH)
- `minBudget` - Minimum budget
- `maxBudget` - Maximum budget
- `search` - Keyword search

### GET /requests/:id

Get specific request by ID

### GET /requests/urgency/:urgency

Get requests by urgency level

### GET /requests/requester/:requesterId

Get requests by requester

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 10)

### POST /requests

Create new request (requires authentication)

**Body:**

```json
{
  "title": "string",
  "description": "string",
  "budget": number,
  "urgency": "LOW" | "MEDIUM" | "HIGH" (optional),
  "latitude": number (optional),
  "longitude": number (optional)
}
```

### PUT /requests/:id

Update request (owner only)

**Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "budget": number (optional),
  "urgency": enum (optional)
}
```

### DELETE /requests/:id

Delete request (owner only)

---

## 👤 Users Endpoints

### GET /users

Get all users (paginated)

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 10)

### GET /users/:id

Get user basic info

### GET /users/profile/:id

Get public profile with reputation data

**Returns:**

```json
{
  "id": "string",
  "name": "string",
  "profilePicture": "string",
  "bio": "string",
  "averageRating": number,
  "createdAt": "ISO date",
  "reviewsCount": number,
  "servicesCount": number,
  "requestsCount": number
}
```

### GET /users/:id/services

Get all services offered by user

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 10)

### GET /users/:id/requests

Get all requests created by user

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 10)

### GET /users/:id/reviews

Get all reviews for user

### PUT /users/profile

Update current user profile (requires authentication)

**Body:**

```json
{
  "name": "string (optional)",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "latitude": number (optional),
  "longitude": number (optional)
}
```

---

## 💬 Messages Endpoints

### POST /messages

Send a message (requires authentication)

**Body:**

```json
{
  "content": "string",
  "receiverId": "string"
}
```

**Note:** Automatically creates a conversation if it doesn't exist

### GET /messages/conversations

Get all conversations for current user

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)

**Returns:** List of conversations with last message and participants

### GET /messages/conversations/:conversationId

Get conversation details

### GET /messages/conversation/:userId

Get messages with a specific user (legacy endpoint)

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 50)

### GET /messages/received

Get received messages (requires authentication)

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)

### POST /messages/:id/read

Mark message as read (requires authentication)

### POST /messages/conversations/:conversationId/read

Mark entire conversation as read (requires authentication)

---

## ⭐ Reviews Endpoints

### POST /reviews

Create a review (requires authentication)

**Body:**

```json
{
  "rating": number (1-5),
  "comment": "string (optional)",
  "reviewedUserId": "string"
}
```

**Note:** Duplicate reviews are prevented via unique constraint

### GET /reviews/:userId

Get reviews for a user

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)

### GET /reviews/:userId/stats

Get review statistics for a user

**Returns:**

```json
{
  "totalReviews": number,
  "averageRating": number,
  "ratingDistribution": {
    "1": number,
    "2": number,
    "3": number,
    "4": number,
    "5": number
  }
}
```

### GET /reviews/user/:userId

Get reviews given by a user (requires authentication)

**Query Parameters:**

- `skip` (default: 0)
- `take` (default: 20)

### GET /reviews/review/:reviewId

Get specific review by ID

### PUT /reviews/:reviewId

Update review (owner only)

**Body:**

```json
{
  "rating": number (1-5, optional),
  "comment": "string (optional)"
}
```

### DELETE /reviews/:reviewId

Delete review (owner only)

---

## 🔐 Authentication

All protected endpoints require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <jwt_token>
```

Protected endpoints are marked with `@UseGuards(JwtGuard)` in the code.

---

## 🗄️ Database Models

### User

- id, email, password, name, profilePicture, bio
- latitude, longitude (for geolocation)
- averageRating, createdAt, updatedAt
- Relations: services, requests, messages, conversations, reviews, payments

### Service

- id, title, description, category (enum)
- price, ownerId (User relation)
- latitude, longitude (future geolocation)
- createdAt, updatedAt
- Indexes: ownerId, category, createdAt, title

### ServiceRequest

- id, title, description, budget
- urgency (enum: LOW, MEDIUM, HIGH)
- requesterId (User relation)
- latitude, longitude (future geolocation)
- createdAt, updatedAt
- Indexes: requesterId, urgency, createdAt, title

### Conversation

- id, participant1Id, participant2Id (both User relations)
- messages (Message relation)
- createdAt, updatedAt
- Unique constraint: participant1Id, participant2Id (prevents duplicates)
- Indexes: participant1Id, participant2Id, updatedAt

### Message

- id, content, senderId (User relation)
- conversationId (Conversation relation)
- isRead, readAt, createdAt
- Indexes: senderId, conversationId, createdAt

### Review

- id, rating (1-5), comment (optional)
- reviewerId, reviewedUserId (both User relations)
- createdAt
- Unique constraint: reviewerId, reviewedUserId (prevents duplicate reviews)
- Indexes: reviewerId, reviewedUserId, createdAt

### Payment

- id, amount, currency, status
- userId (User relation)
- createdAt, updatedAt
- Indexes: userId, status

---

## 🚀 Architecture Improvements

### Error Handling

- Global exception filter for all error types
- Custom exception classes
- Consistent error response format

### Response Formatting

- Global response interceptor
- All responses follow consistent format
- Automatic success flag injection

### Input Validation

- DTOs with class-validator decorators
- Global validation pipe
- Whitelist and forbid non-whitelisted properties
- Type transformation

### Security

- JWT authentication with JwtGuard
- Ownership verification for all write operations
- Password hashing with bcrypt
- CORS enabled

### Scalability

- Indexed database queries
- Pagination on all list endpoints
- Optimized includes (select only needed fields)
- Conversation-based messaging for efficient queries

---

## 🔮 Future Enhancements (Ready for)

### Geolocation (Fields Reserved)

- `latitude`, `longitude` in User, Service, ServiceRequest
- Ready for geo-spatial queries

### Payments (Architecture Ready)

- Payment model already defined
- Ready for Stripe/PayPal integration
- Designed for transaction history

### Real-time Chat (Design Pattern Ready)

- Conversation-based structure supports WebSockets
- Message read status already implemented
- Ready for typing indicators

### AI Matching (Data Structure Ready)

- Services and requests properly indexed and categorized
- Ready for recommendation algorithms

---

## 📝 Notes

### Pagination

- Default pagination applied to all list endpoints
- Use `skip` and `take` query parameters
- Large `take` values may impact performance

### Ownership Verification

- Users can only update/delete their own resources
- Attempted unauthorized modifications return 403 Forbidden

### Unique Constraints

- Email is unique per User
- Each user can give only one review to another user
- Each conversation is unique per user pair

### Rating Calculation

- Automatically recalculated when review is added/updated/deleted
- Average rating rounded to 1 decimal place
- Ratings updated on the User model
