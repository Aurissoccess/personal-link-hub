import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../utils/db';
import SocialIcons from '../components/SocialIcons';
import LinkCard from '../components/LinkCard';
import { AlertCircle, ArrowLeft, Layers } from 'lucide-react';

export default function ProfileView() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      const cleanUsername = username.toLowerCase().trim();
      const userProfile = db.getProfile(cleanUsername);
      
      if (userProfile) {
        setProfile(userProfile);
        
        // Track Visitor Page View
        db.trackView(cleanUsername);

        // Dynamic SEO Update
        document.title = userProfile.seoTitle || `${userProfile.name} | LinkHub`;
        let metaDesc = document.querySelector("meta[name='description']");
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = userProfile.seoDescription || userProfile.bio || "";
      } else {
        setProfile(null);
        document.title = "Sahifa topilmadi | LinkHub";
      }
    }
    setLoading(false);

    // Cleanup page title on unmount
    return () => {
      document.title = "Personal Link Hub";
    };
  }, [username]);

  if (loading) {
    return (
      <div className="profile-loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // 404 View: Profile not found
  if (!profile) {
    return (
      <div className="profile-404-container animate-fade-in">
        <div className="profile-404-card card">
          <AlertCircle size={48} className="icon-alert" />
          <h2>Sahifa topilmadi</h2>
          <p>
            Kechirasiz, <strong>@{username}</strong> foydalanuvchisi tizimda ro'yxatdan o'tmagan.
            Ushbu ajoyib foydalanuvchi nomini birinchilardan bo'lib band qilishingiz mumkin!
          </p>
          <div className="actions-row">
            <Link to="/login" className="btn btn-primary">
              @{username} nomini band qilish
            </Link>
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Bosh sahifa
            </Link>
          </div>
        </div>
        <style>{`
          .profile-404-container {
            max-width: 480px;
            margin: 80px auto;
            padding: 0 20px;
          }
          .profile-404-card {
            text-align: center;
            padding: 40px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .icon-alert {
            color: #ef4444;
          }
          .profile-404-card h2 {
            font-size: 1.8rem;
          }
          .profile-404-card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.5;
          }
          .actions-row {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  }

  // Filter active links
  const activeLinks = (profile.links || []).filter(link => link.active);

  return (
    <div className={`theme-${profile.theme} profile-view-theme-wrapper`}>
      <div className="container-public animate-fade-in">
        
        {/* Profile Details Header */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="profile-avatar" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.avatar-fallback').style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatar-fallback" style={{ display: profile.avatar ? 'none' : 'flex' }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="profile-name">{profile.name || username}</h1>
          <p className="profile-bio">{profile.bio}</p>
        </div>

        {/* Social Media Link Icons */}
        <SocialIcons socials={profile.socials} />

        {/* Main List of Active Links */}
        <div className="profile-links-list">
          {activeLinks.length > 0 ? (
            activeLinks.map(link => (
              <LinkCard
                key={link.id}
                title={link.title}
                url={link.url}
                icon={link.icon}
                onClick={() => db.trackClick(username, link.id)}
              />
            ))
          ) : (
            <div className="profile-empty-links">
              <p>Hozircha hech qanday havola qo'shilmagan.</p>
            </div>
          )}
        </div>

        {/* Footer Brand Branding */}
        <footer className="profile-footer">
          <Link to="/" className="footer-logo">
            <Layers size={14} className="footer-logo-icon" />
            <span>O'z sahifangizni yarating - <strong>LinkHub</strong></span>
          </Link>
        </footer>

      </div>

      <style>{`
        .profile-view-theme-wrapper {
          min-height: 100vh;
          background: var(--bg-primary);
          background-image: var(--bg-gradient);
          background-attachment: fixed;
          color: var(--text-primary);
          transition: background 0.3s;
          width: 100%;
        }

        .profile-loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0a0b0d;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 12px;
          width: 100%;
        }

        .avatar-wrapper {
          position: relative;
          width: 96px;
          height: 96px;
          margin-bottom: 16px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, var(--accent-color) 0%, #ec4899 100%);
          box-shadow: 0 8px 24px var(--accent-glow);
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--bg-primary);
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: var(--glass-bg);
          border: 3px solid var(--bg-primary);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-family: var(--font-heading);
          font-weight: 800;
        }

        .profile-name {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .profile-bio {
          font-size: 0.925rem;
          color: var(--text-secondary);
          max-width: 360px;
          line-height: 1.5;
        }

        .profile-links-list {
          width: 100%;
          margin-top: 12px;
        }

        .profile-empty-links {
          text-align: center;
          padding: 24px;
          background-color: var(--glass-bg);
          border: 1px dashed var(--glass-border);
          border-radius: var(--border-radius-md);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .profile-footer {
          margin-top: auto;
          padding-top: 48px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }

        .footer-logo:hover {
          opacity: 1;
        }

        .footer-logo-icon {
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
}
