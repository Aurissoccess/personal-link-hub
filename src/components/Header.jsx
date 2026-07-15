import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, User, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('linkhub_session');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]); // Re-run when navigation happens

  const handleLogout = () => {
    localStorage.removeItem('linkhub_session');
    setCurrentUser(null);
    navigate('/');
  };

  // Do not show header on public profiles. Public profile is matched by /:username,
  // excluding known system paths: /, /login, /dashboard.
  const isPublicProfile = !['/', '/login', '/dashboard'].includes(location.pathname);
  if (isPublicProfile && location.pathname !== '/') {
    return null;
  }

  return (
    <header className="header-nav">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <Layers className="brand-icon" size={24} />
          <span className="brand-text">LinkHub</span>
        </Link>

        <nav className="nav-menu">
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Panel</span>
              </Link>
              
              <a 
                href={`/${currentUser.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="nav-link profile-link"
              >
                <User size={18} />
                <span>Sahifam</span>
                <ExternalLink size={14} className="ext-icon" />
              </a>

              <button onClick={handleLogout} className="btn-logout" title="Chiqish">
                <LogOut size={18} />
                <span className="logout-text">Chiqish</span>
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn btn-primary btn-sm-nav">
                  Kirish / Ro'yxatdan o'tish
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
      <style>{`
        .header-nav {
          background-color: var(--glass-bg);
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all var(--transition-normal);
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          transition: transform var(--transition-fast);
        }
        .brand-logo:hover {
          transform: scale(1.02);
        }
        .brand-icon {
          color: var(--accent-color);
          filter: drop-shadow(0 0 8px var(--accent-glow));
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 550;
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.05);
        }
        .profile-link {
          border: 1px dashed var(--glass-border);
        }
        .profile-link:hover {
          border-color: var(--accent-color);
          box-shadow: 0 0 10px 0 var(--accent-glow);
        }
        .ext-icon {
          opacity: 0.6;
        }
        .btn-logout {
          background: none;
          border: none;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          font-weight: 550;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast);
        }
        .btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
        .btn-sm-nav {
          font-size: 0.85rem;
          padding: 8px 16px;
        }
        @media (max-width: 600px) {
          .logout-text, .profile-link span {
            display: none;
          }
          .nav-link {
            padding: 8px;
          }
        }
      `}</style>
    </header>
  );
}
