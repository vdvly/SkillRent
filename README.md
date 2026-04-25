# SkillRent - On-Demand Services Platform

A full-stack MVP platform where users can offer and request services on demand.

## 📋 Overview

**SkillRent** is a modern web application that enables:

- Users to register and build profiles
- Service providers to list their offerings
- Clients to post service requests
- Real-time messaging between users
- Rating and review system
- Payment-ready architecture

## 🏗️ Project Structure

```
SkillRent/
├── backend/               # NestJS backend (REST API)
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── services/
│   │   ├── requests/
│   │   ├── messages/
│   │   ├── reviews/
│   │   └── ...
│   ├── prisma/            # Database schema
│   ├── package.json
│   └── README.md
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml     # PostgreSQL setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm or yarn

### Setup Instructions

#### 1. Database Setup (PostgreSQL)

**Option A: Using Docker**

```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**

- Create database: `createdb skillrent`
- Note your connection string

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npm run db:generate
npm run db:migrate
npm run start:dev
```

Backend runs on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 API Documentation

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile

### Users

- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `PUT /users/profile` - Update profile

### Services

- `GET /services` - List all services
- `POST /services` - Create service (protected)
- `GET /services/:id` - Get service details
- `PUT /services/:id` - Update service (protected)
- `DELETE /services/:id` - Delete service (protected)

### Requests

- `GET /requests` - List all requests
- `POST /requests` - Create request (protected)
- `GET /requests/:id` - Get request details
- `PUT /requests/:id` - Update request (protected)
- `DELETE /requests/:id` - Delete request (protected)

### Messages

- `POST /messages` - Send message (protected)
- `GET /messages/received` - Get received messages (protected)
- `GET /messages/conversation/:userId` - Get conversation (protected)

### Reviews

- `POST /reviews` - Create review (protected)
- `GET /reviews/:userId` - Get reviews for user

## 🎯 MVP Features

✅ User authentication with JWT
✅ User profiles with ratings
✅ Service listings with pricing
✅ Service requests with budget
✅ Direct messaging between users
✅ Rating & review system
✅ Pagination for listings
✅ Protected routes
✅ Input validation
✅ Error handling

## 🗄️ Database Schema

**Key Models:**

- **User**: Email, password, name, profile picture, bio, average rating, location
- **Service**: Title, description, price/hour, owner relationship, timestamp
- **ServiceRequest**: Title, description, budget, requester relationship, location
- **Message**: Content, sender/receiver relationship, read status, timestamp
- **Review**: Rating (1-5), comment, reviewer relationship, timestamp
- **Payment**: (Future) Amount, status, payment method

## 🔐 Authentication

- JWT (JSON Web Token) based authentication
- Password hashing with bcrypt
- 24-hour token expiration
- Refresh token support (future improvement)

## 🎨 Frontend Architecture

**State Management:**

- React Context for auth state
- Custom hooks (useAuth, useApi)
- Local storage for JWT tokens

**Routing:**

- React Router v6
- Protected routes for authenticated pages
- Client-side redirects on auth failure

**Styling:**

- Custom CSS (no external framework)
- Responsive grid layout
- Mobile-friendly design

## 🔮 Future Extensions

### Phase 2: Enhancements

1. **Geolocation**
   - Location-based service discovery
   - Distance calculations
   - Map integration

2. **Payments**
   - Stripe integration
   - Payment processing
   - Transaction history
   - Invoice generation

3. **Real-time Messaging**
   - WebSocket support
   - Typing indicators
   - Read receipts
   - Message notifications

4. **Search & Discovery**
   - Full-text search
   - Filters and sorting
   - Categories and tags
   - AI-based recommendations

5. **Advanced Features**
   - Portfolio showcase for service providers
   - Service badges and certifications
   - Dispute resolution system
   - Referral program
   - Analytics dashboard

## 📦 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Password**: bcrypt

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State**: React Context
- **Styling**: CSS

## 📝 Development Commands

### Backend

```bash
cd backend
npm run start:dev      # Start with watch mode
npm run build          # Build production
npm run lint           # Run linter
npm run test           # Run tests
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio
```

### Frontend

```bash
cd frontend
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview build
npm run lint           # Run linter
```

## 🤝 Project Standards

### Code Organization

- Feature-based folder structure
- Separation of concerns (controllers/services)
- DRY (Don't Repeat Yourself) principle
- Clear naming conventions

### Best Practices

- Type safety with TypeScript
- Input validation on all endpoints
- Proper error handling and logging
- CORS configured for security
- Environment-based configuration

### Scalability

- Modular architecture
- Prepared for microservices
- Database indexing on frequent queries
- Caching-ready structure
- Transaction support

## 🐳 Docker Setup

**Start PostgreSQL:**

```bash
docker-compose up -d
```

**Stop database:**

```bash
docker-compose down
```

**View database GUI:**
Open PgAdmin at `http://localhost:5050` (if using docker-compose with PgAdmin)

## 🧪 Testing

Future implementation planned for:

- Unit tests for services
- Integration tests for API
- E2E tests for user flows
- Component tests for frontend

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🔒 Security Considerations

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS enabled with frontend whitelist
- ✅ Input validation on all endpoints
- ✅ Error handling without sensitive data exposure
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: SQL injection prevention via Prisma
- ⚠️ TODO: HTTPS in production

## 📄 License

MIT

## 🤝 Contributing

This is an MVP project. Future contributions welcome!

## 📞 Support

For questions or issues, please refer to:

- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)

---

**Built with ❤️ to connect service providers and seekers**
