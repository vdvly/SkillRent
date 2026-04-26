import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import './styles/global.css';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { CreateService } from './pages/CreateService';
import { Requests } from './pages/Requests';
import { CreateRequest } from './pages/CreateRequest';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import Explore from './pages/Explore';
import RecommendationsPage from './pages/RecommendationsPage';
import UserProfile from './pages/UserProfile';
import Activity from './pages/Activity';
import Payments from './pages/Payments';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Advanced Features - Accessible to all */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/users/:userId" element={<UserProfile />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/create"
            element={
              <ProtectedRoute>
                <CreateService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests/create"
            element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
