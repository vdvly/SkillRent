# SkillRent - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
# 1. Start database
docker-compose up -d

# 2. Terminal 1: Backend
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run start:dev

# 3. Terminal 2: Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

# 4. Open browser
http://localhost:5173
```

## 📂 Project Structure

```
backend/
├── src/auth/              # Login, register, JWT
├── src/users/             # User profiles
├── src/services/          # Service listings
├── src/requests/          # Service requests
├── src/messages/          # Messaging
├── src/reviews/           # Ratings
├── src/config/            # Database config
├── prisma/schema.prisma   # Database schema

frontend/
├── src/pages/             # Page components
├── src/components/        # Reusable components
├── src/services/api.js    # API calls
├── src/context/           # State management
├── src/hooks/             # Custom hooks
├── src/styles/            # CSS
```

## 🔧 Common Commands

### Backend

```bash
cd backend

# Development
npm run start:dev          # Start with watch
npm run build              # Build for prod
npm run lint               # Check code style

# Database
npm run db:generate        # Create Prisma client
npm run db:migrate         # Run migrations
npm run db:studio          # Open visual DB editor

# Testing
npm run test               # Run tests
npm run test:watch        # Watch mode
```

### Frontend

```bash
cd frontend

npm run dev                # Start dev server
npm run build              # Build for prod
npm run preview            # Preview build
npm run lint               # Check code style
```

## 🗄️ Database Quick Reference

### Create User

```sql
INSERT INTO "User" (email, password, name, "createdAt", "updatedAt")
VALUES ('user@example.com', 'hashed_password', 'John Doe', NOW(), NOW());
```

### Query Services

```sql
SELECT s.*, u.name FROM "Service" s
JOIN "User" u ON s."ownerId" = u.id
ORDER BY s."createdAt" DESC;
```

### Get User with Stats

```sql
SELECT u.*,
  COUNT(DISTINCT s.id) as services_count,
  COUNT(DISTINCT r.id) as reviews_count,
  AVG(r.rating) as avg_rating
FROM "User" u
LEFT JOIN "Service" s ON u.id = s."ownerId"
LEFT JOIN "Review" r ON u.id = r."reviewedUserId"
GROUP BY u.id;
```

## 🔐 Authentication Flow

### Login

```javascript
// Frontend
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { access_token, user } = await response.json();
localStorage.setItem("token", access_token);
```

### Protected Request

```javascript
// Automatically handled by axios interceptor
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
```

## 📋 API Usage Examples

### Create Service

```bash
curl -X POST http://localhost:3000/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development",
    "description": "Full-stack web dev",
    "price": 50
  }'
```

### Get All Services

```bash
curl http://localhost:3000/services?skip=0&take=20
```

### Send Message

```bash
curl -X POST http://localhost:3000/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello!",
    "receiverId": "user_id_here"
  }'
```

### Leave Review

```bash
curl -X POST http://localhost:3000/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great service!",
    "reviewedUserId": "service_provider_id"
  }'
```

## 🛠️ File Locations Reference

### Adding New Route

1. Create controller method in `backend/src/module/module.controller.ts`
2. Add service method in `backend/src/module/module.service.ts`
3. Create DTO in `backend/src/module/dto/module.dto.ts`

### Adding New Page

1. Create component in `frontend/src/pages/PageName.jsx`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Navbar.jsx`

### Database Schema Change

1. Edit `backend/prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Regenerate types: `npm run db:generate`

## 🐛 Troubleshooting

### "Port already in use"

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Cannot connect to database"

- Check docker: `docker ps`
- Verify DATABASE_URL in .env
- Ensure PostgreSQL is running on port 5432

### "JWT invalid"

- Clear localStorage: `localStorage.clear()`
- Logout and login again
- Check JWT_SECRET in backend .env

### "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Environment Variables

### Backend .env

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillrent?schema=public
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend .env

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Backend: Update service logic + API
   - Frontend: Create pages + components

3. **Test Changes**
   - Use Postman/Insomnia for API
   - Test in browser frontend
   - Check database with Prisma Studio

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

## 📚 Key Files to Know

| File                                   | Purpose             |
| -------------------------------------- | ------------------- |
| `backend/src/main.ts`                  | Backend entry point |
| `backend/src/app.module.ts`            | Module imports      |
| `backend/prisma/schema.prisma`         | Database schema     |
| `frontend/src/App.jsx`                 | React routing       |
| `frontend/src/services/api.js`         | API client          |
| `frontend/src/context/AuthContext.jsx` | Auth state          |

## 🚀 Deployment Checklist

- [ ] Update JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure FRONTEND_URL for CORS
- [ ] Use production PostgreSQL URL
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build`
- [ ] Run migrations: `npm run db:migrate`
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Test all endpoints
- [ ] Set up CI/CD pipeline

## 💡 Pro Tips

✅ Use Prisma Studio to debug database

```bash
npm run db:studio
```

✅ Check code for issues

```bash
npm run lint
```

✅ Format code

```bash
npm run format
```

✅ Use VS Code extensions:

- ESLint
- Prettier
- Thunder Client (API testing)
- Prisma

✅ Keep .env files secret

- Add to .gitignore
- Use .env.example as template

✅ Test API with Thunder Client or Postman

- Import backend/src/\*_/_.controller.ts
- Run requests locally

## 📞 Need Help?

- Check [README.md](./README.md) for overview
- Read [SETUP.md](./SETUP.md) for setup steps
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design
- Check backend/README.md for API details
- Check frontend/README.md for UI details

---

**Happy coding! 🎉**
