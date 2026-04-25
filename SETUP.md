# SkillRent - Detailed Setup Guide

## 🎯 Complete Setup Instructions

### 1. Clone or Navigate to Project

```bash
cd SkillRent
```

### 2. Install All Dependencies

**Option A: Using root npm workspaces (recommended)**

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

**Option B: Manual installation**

```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and PgAdmin
docker-compose up -d

# Verify containers are running
docker ps
```

**Access PgAdmin:**

- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

#### Option B: Local PostgreSQL

```bash
# Create database
createdb skillrent

# Or use SQL:
# CREATE DATABASE skillrent;
```

### 4. Backend Configuration

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file with your database connection
# DATABASE_URL="postgresql://postgres:password@localhost:5432/skillrent?schema=public"
```

**Edit backend/.env:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillrent?schema=public"
JWT_SECRET="your-secret-key-change-this"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 5. Initialize Database

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Optional: Seed database with test data
# npm run db:seed (not implemented yet)

# Optional: Open Prisma Studio
# npm run db:studio
```

### 6. Frontend Configuration

```bash
cd frontend

# Copy environment file
cp .env.example .env

# .env content:
# VITE_API_URL=http://localhost:3000
```

### 7. Start Development Servers

#### Terminal 1: Backend

```bash
cd backend
npm run start:dev
# Server will run on http://localhost:3000
```

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### 8. Test the Application

**Backend API Test:**

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Frontend Test:**

- Open http://localhost:5173
- Register a new account
- Create a service or request
- Explore the platform

## 📊 Prisma Studio (Visual Database Browser)

```bash
cd backend
npm run db:studio
# Opens http://localhost:5555 in your browser
```

## 🔍 Common Issues & Solutions

### Issue: Connection refused on PostgreSQL

**Solution:**

- Check if PostgreSQL is running: `docker ps` (Docker) or check Services (Windows)
- Verify DATABASE_URL in .env matches your setup
- Ensure PostgreSQL is on port 5432

### Issue: Migration error

**Solution:**

```bash
cd backend
npm run db:push  # Alternative to migrate
# or
npx prisma migrate reset  # WARNING: Resets database
```

### Issue: Frontend can't connect to backend

**Solution:**

- Check backend is running on port 3000
- Verify VITE_API_URL in frontend/.env is correct
- Check CORS is enabled in backend (default: http://localhost:5173)

### Issue: "Port already in use"

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## 🛑 Stopping Everything

```bash
# Stop Docker containers
docker-compose down

# Stop development servers
# Use Ctrl+C in each terminal
```

## 📁 Project Structure After Setup

```
SkillRent/
├── backend/
│   ├── node_modules/
│   ├── src/
│   ├── prisma/
│   ├── dist/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── .env
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Production Deployment

### Build for Production

**Backend:**

```bash
cd backend
npm run build
# Creates dist/ folder
```

**Frontend:**

```bash
cd frontend
npm run build
# Creates dist/ folder
```

### Environment for Production

Create `.env` files with production values:

**backend/.env:**

```env
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/skillrent?schema=public"
JWT_SECRET="very-long-random-secret-key-256-chars"
PORT=3000
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
```

**frontend/.env.production:**

```env
VITE_API_URL=https://api.yourdomain.com
```

### Deployment Options

**Option 1: Railway.app**

- Connect GitHub repo
- Add PostgreSQL database
- Deploy with one click

**Option 2: Heroku**

- Set environment variables
- Deploy using git push

**Option 3: DigitalOcean/AWS/Azure**

- Build Docker images
- Deploy containers
- Configure load balancer

## 📚 Next Steps

1. **Read Documentation**
   - Backend: [backend/README.md](./backend/README.md)
   - Frontend: [frontend/README.md](./frontend/README.md)

2. **Explore the Code**
   - Start with `backend/src/main.ts`
   - Then explore `frontend/src/App.jsx`

3. **Create Sample Data**
   - Register multiple test users
   - Create some services and requests

4. **Plan Next Features**
   - Geolocation
   - Payments
   - WebSocket messaging
   - Search/filtering

## 💡 Tips

- Use Prisma Studio to visualize your database
- Keep your `.env` files secret (add to .gitignore)
- Run both servers for development workflow
- Use VS Code for better development experience
- Keep API documentation updated as you add features

---

**Happy coding! 🎉**
