import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#fff',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary)',
          textDecoration: 'none',
        }}>
          SkillRent
        </Link>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Navigation for all users */}
          <Link to="/explore" style={{ fontSize: '14px' }}>🔍 Explore</Link>
          <Link to="/recommendations" style={{ fontSize: '14px' }}>✨ Trending</Link>

          {user ? (
            <>
              <Link to="/services" style={{ fontSize: '14px' }}>Services</Link>
              <Link to="/requests" style={{ fontSize: '14px' }}>Requests</Link>
              <Link to="/messages" style={{ fontSize: '14px' }}>💬 Messages</Link>
              <Link to="/activity" style={{ fontSize: '14px' }}>📊 Activity</Link>
              <Link to="/payments" style={{ fontSize: '14px' }}>💳 Payments</Link>
              <Link to="/profile" style={{ fontSize: '14px' }}>👤 Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
