# SkillRent Backend

A NestJS backend for the SkillRent on-demand services platform.

## Project Structure

```
src/
├── auth/                 # Authentication module (JWT, login, register)
├── users/                # User management
├── services/             # Service offers
├── requests/             # Service requests
├── messages/             # Messaging system
├── reviews/              # Rating & review system
├── config/               # Configuration (Prisma, database)
├── common/               # Shared utilities, decorators, exceptions
└── main.ts              # Application entry point

prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

3. **Generate Prisma client**

   ```bash
   npm run db:generate
   ```

4. **Run migrations**

   ```bash
   npm run db:migrate
   ```

5. **Start the server**
   ```bash
   npm run start:dev
   ```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/profile` - Update profile (protected)

### Services

- `GET /services` - Get all services
- `POST /services` - Create service (protected)
- `GET /services/:id` - Get service by ID
- `PUT /services/:id` - Update service (protected)
- `DELETE /services/:id` - Delete service (protected)

### Requests

- `GET /requests` - Get all requests
- `POST /requests` - Create request (protected)
- `GET /requests/:id` - Get request by ID
- `PUT /requests/:id` - Update request (protected)
- `DELETE /requests/:id` - Delete request (protected)

### Messages

- `POST /messages` - Send message (protected)
- `GET /messages/received` - Get received messages (protected)
- `GET /messages/conversation/:userId` - Get conversation (protected)

### Reviews

- `POST /reviews` - Create review (protected)
- `GET /reviews/:userId` - Get reviews for user

## Database Schema

Key models:

- **User**: Profile, ratings, service history
- **Service**: Offered services with pricing
- **ServiceRequest**: Service requests with budget
- **Message**: Direct messaging between users
- **Review**: Ratings and feedback
- **Payment**: (Future) Payment transactions

## Authentication

- JWT tokens with 24h expiration
- Passwords hashed with bcrypt
- Protected routes use `@UseGuards(JwtGuard)`

## Future Extensions

- Geolocation-based service discovery
- Stripe payment integration
- WebSocket support for real-time messaging
- AI-based service matching
- Notification system

## Development Commands

```bash
npm run start:dev      # Start with watch mode
npm run build          # Build for production
npm run lint           # Run ESLint
npm run test           # Run tests
npm run db:studio      # Open Prisma Studio
npm run db:push        # Push schema to DB
```

## Project Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Password**: bcrypt
