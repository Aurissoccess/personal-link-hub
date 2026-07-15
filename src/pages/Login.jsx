import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, UserPlus, LogIn, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { db } from '../utils/db';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem('linkhub_session')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input sanitization
    if (!username.trim() || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (isLogin) {
      // Login flow
      const res = db.login(cleanUsername, password);
      if (res.success) {
        setSuccess("Muvaffaqiyatli kirdingiz! Yo'naltirilmoqda...");
        localStorage.setItem('linkhub_session', JSON.stringify(res.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(res.message);
      }
    } else {
      // Register flow
      if (!email.trim()) {
        setError("Iltimos, emailingizni kiriting.");
        return;
      }
      if (password.length < 6) {
        setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Parollar mos kelmadi.");
        return;
      }

      const res = db.register(cleanUsername, email.trim(), password);
      if (res.success) {
        setSuccess("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Tizimga kirilmoqda...");
        localStorage.setItem('linkhub_session', JSON.stringify(res.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(res.message);
      }
    }
  };

  const handleOAuthMock = (provider) => {
    setError('');
    setSuccess(`Google OAuth orqali kirilmoqda (Simulyatsiya)...`);
    
    // Auto-create/login a mock OAuth user
    setTimeout(() => {
      const mockUser = {
        username: `google_user_${Math.floor(Math.random() * 900) + 100}`,
        email: "google.user@example.com",
        isOAuth: true
      };
      
      // Seed profile if not exists
      const profiles = JSON.parse(localStorage.getItem('linkhub_profiles') || '{}');
      if (!profiles[mockUser.username]) {
        profiles[mockUser.username] = {
          name: "OAuth Mehmon",
          bio: "Google orqali kirgan mehmon foydalanuvchi.",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
          socials: { instagram: "", telegram: "", linkedin: "", youtube: "", github: "" },
          links: [{ id: "oauth-1", title: "Personal Link Hub loyihasi", url: "https://github.com", icon: "Link2", active: true }],
          theme: "neon-sunset",
          customBg: "",
          seoTitle: "Google OAuth Foydalanuvchisi",
          seoDescription: "Google orqali tizimda ro'yxatdan o'tgan foydalanuvchi sahifasi."
        };
        localStorage.setItem('linkhub_profiles', JSON.stringify(profiles));
        
        const analytics = JSON.parse(localStorage.getItem('linkhub_analytics') || '{}');
        analytics[mockUser.username] = { views: 0, clicks: {} };
        localStorage.setItem('linkhub_analytics', JSON.stringify(analytics));
      }
      
      localStorage.setItem('linkhub_session', JSON.stringify(mockUser));
      setSuccess("Muvaffaqiyatli kirdingiz! Yo'naltirilmoqda...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }, 1000);
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-card card">
        <div className="login-header">
          <div className="brand-logo-container">
            <Layers className="brand-logo-icon" size={32} />
          </div>
          <h2>{isLogin ? "Hisobga Kirish" : "Yangi Hisob Ochish"}</h2>
          <p className="login-subtitle">
            {isLogin 
              ? "Barcha havolalaringizni tahrirlash va boshqarish paneli" 
              : "Havolalaringizni yagona chiroyli portalga jamlashni hoziroq boshlang"}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">Foydalanuvchi nomi (username)</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="masalan: dilnoza"
                className="form-input text-lowercase"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="email">E-mail pochta</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="masalan: email@pochta.uz"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="password">Parol</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Parolni kiriting"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Parolni tasdiqlash</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Parolni qayta kiriting"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full submit-btn">
            {isLogin ? (
              <>
                <span>Kirish</span>
                <LogIn size={18} />
              </>
            ) : (
              <>
                <span>Ro'yxatdan O'tish</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="divider-row">
          <span className="divider-line"></span>
          <span className="divider-text">yoki</span>
          <span className="divider-line"></span>
        </div>

        <button 
          onClick={() => handleOAuthMock('google')} 
          className="btn btn-secondary w-full google-oauth-btn"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google orqali tezkor kirish</span>
        </button>

        <div className="login-footer">
          {isLogin ? (
            <p>
              Yangi sahifa yaratmoqchimisiz?{" "}
              <button onClick={() => setIsLogin(false)} className="toggle-form-btn">
                Ro'yxatdan o'ting
              </button>
            </p>
          ) : (
            <p>
              Hisobingiz bormi?{" "}
              <button onClick={() => setIsLogin(true)} className="toggle-form-btn">
                Tizimga kiring
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .login-page {
          max-width: 480px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .login-card {
          padding: 40px 32px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-logo-container {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background-color: rgba(99, 102, 241, 0.1);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: 0 0 16px var(--accent-glow);
        }

        .login-header h2 {
          font-size: 1.6rem;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .login-form {
          margin-top: 10px;
        }

        .w-full {
          width: 100%;
        }

        .submit-btn {
          margin-top: 8px;
          padding: 12px;
          font-weight: 700;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: var(--text-secondary);
          opacity: 0.7;
          pointer-events: none;
        }

        .input-with-icon .form-input {
          padding-left: 48px;
        }

        .text-lowercase {
          text-transform: lowercase;
        }

        .divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          gap: 12px;
        }

        .divider-line {
          height: 1px;
          flex-grow: 1;
          background-color: var(--glass-border);
        }

        .divider-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .google-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          font-weight: 600;
        }

        .google-oauth-btn:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: var(--text-secondary);
        }

        .google-icon {
          flex-shrink: 0;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .toggle-form-btn {
          background: none;
          border: none;
          color: var(--accent-color);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .toggle-form-btn:hover {
          color: #818cf8;
        }

        /* Alerts styling */
        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          font-size: 0.9rem;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .alert-success {
          background-color: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 20px;
          }
        }
      `}</style>
    </div>
  );
}
