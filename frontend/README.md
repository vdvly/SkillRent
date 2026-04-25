# SkillRent Frontend

A modern React + Vite frontend for the SkillRent on-demand services platform.

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── Navbar.jsx       # Navigation bar
│   ├── ProtectedRoute.jsx # Protected route wrapper
│   └── Loading.jsx      # Loading spinner
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Services.jsx
│   ├── CreateService.jsx
│   ├── Requests.jsx
│   ├── CreateRequest.jsx
│   ├── Messages.jsx
│   └── Profile.jsx
├── services/            # API calls
│   └── api.js          # API client
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   └── useApi.js
├── context/             # React Context
│   └── AuthContext.jsx
├── styles/              # Global styles
│   └── global.css
├── utils/               # Utility functions
│   └── axios.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Pages & Routes

- `/login` - Login page
- `/register` - Registration page
- `/` - Dashboard (protected)
- `/services` - Browse all services (protected)
- `/services/create` - Create new service (protected)
- `/requests` - Browse all requests (protected)
- `/requests/create` - Create new request (protected)
- `/messages` - View messages (protected)
- `/profile` - User profile (protected)

## Key Features

✅ User authentication (register/login)
✅ Browse services and requests
✅ Create services and requests
✅ Direct messaging
✅ User profiles with ratings
✅ Responsive design
✅ JWT token management
✅ Protected routes

## Technologies

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks
- **Styling**: Custom CSS (no external framework)

## API Integration

All API calls are centralized in `src/services/api.js`:

- Auth endpoints (register, login, profile)
- Services CRUD operations
- Requests CRUD operations
- Messaging
- Reviews

Axios is configured with:

- Automatic JWT token injection
- Global error handling
- Base URL configuration

## Future Enhancements

- Real-time messaging with WebSocket
- Search and filtering
- Geolocation-based discovery
- Payment integration
- Notifications
- Rating system UI
