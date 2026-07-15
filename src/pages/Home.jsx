import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Zap, BarChart2, Palette, Move, ExternalLink } from 'lucide-react';
import { db } from '../utils/db';

export default function Home() {
  const publicProfiles = db.getPublicProfiles();

  const scrollToDemo = (e) => {
    e.preventDefault();
    const element = document.getElementById('demo-profiles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge-glow">
          <Zap size={14} />
          <span>100% Mobile-First va Tezkor</span>
        </div>
        <h1 className="hero-title">
          Barcha Havolalaringiz <br />
          <span className="accent-text">Bitta Chiroyli Sahifada</span>
        </h1>
        <p className="hero-subtitle">
          Ijtimoiy tarmoqlar, portfoliolar va shaxsiy havolalaringizni professional ko'rinishda jamlang.
          Mutlaqo bepul va tezkor boshqaruv paneli bilan.
        </p>
        
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary btn-lg">
            <span>Hozir Boshlash</span>
            <ArrowRight size={18} />
          </Link>
          <button onClick={scrollToDemo} className="btn btn-secondary btn-lg" style={{ cursor: 'pointer' }}>
            Demolarni ko'rish
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><Zap size={24} /></div>
          <h3>Tezkor Yuklanish</h3>
          <p>Sahifalar minimal kod va rasmlar yordamida Google PageSpeedda 90+ ball bilan ishlaydi.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Move size={24} /></div>
          <h3>Drag & Drop Tartiblash</h3>
          <p>Havolalaringiz o'rnini osongina sudrab almashtiring. O'zgarishlar darhol saqlanadi.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Palette size={24} /></div>
          <h3>Chiroyli Mavzular</h3>
          <p>Neon, shaffof (glassmorphism), tabiat va klassik dizaynlardan birini tanlang.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><BarChart2 size={24} /></div>
          <h3>Oddiy Analitika</h3>
          <p>Tashriflar soni (views) va har bir tugma bosilishini (click count va CTR) kuzating.</p>
        </div>
      </section>

      {/* Live Demo Profiles Section */}
      <section className="demo-section" id="demo-profiles">
        <h2 className="section-title">Jonli Demolar (Pre-seeded Profiles)</h2>
        <p className="section-subtitle">Tizimdagi tayyor foydalanuvchilar sahifalariga o'tib, platforma qanday ko'rinishda ishlashini sinab ko'ring:</p>

        <div className="profiles-grid">
          {publicProfiles.map(profile => (
            <a 
              key={profile.username}
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="profile-demo-card"
            >
              <div className="profile-demo-avatar-container">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="profile-demo-avatar" />
                ) : (
                  <div className="profile-demo-avatar-fallback">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-demo-info">
                <h4>{profile.name}</h4>
                <span className="profile-demo-tag">@{profile.username}</span>
                <p>{profile.bio}</p>
                <div className="profile-demo-footer">
                  <span className="theme-badge">{profile.theme}</span>
                  <span className="visit-badge">
                    Sahifani ko'rish <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <style>{`
        .home-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .hero-section {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .badge-glow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #818cf8;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.15;
          margin-bottom: 24px;
        }

        .accent-text {
          background: linear-gradient(135deg, var(--accent-color) 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 10px rgba(99, 102, 241, 0.15));
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 650px;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-lg {
          padding: 14px 28px;
          font-size: 1.05rem;
          border-radius: var(--border-radius-lg);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 100px;
        }

        .feature-card {
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          padding: 32px 24px;
          text-align: center;
          transition: transform var(--transition-normal), border-color var(--transition-normal);
          backdrop-filter: blur(10px);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
        }

        .feature-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background-color: rgba(99, 102, 241, 0.1);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.925rem;
          line-height: 1.5;
        }

        .demo-section {
          background-color: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-xl);
          padding: 48px;
          backdrop-filter: blur(5px);
        }

        .section-title {
          text-align: center;
          font-size: 1.85rem;
          margin-bottom: 12px;
        }

        .section-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-size: 1rem;
        }

        .profiles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .profiles-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .profile-demo-card {
          display: flex;
          gap: 20px;
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .profile-demo-card:hover {
          transform: translateY(-3px) scale(1.01);
          border-color: var(--accent-color);
          box-shadow: 0 10px 24px var(--accent-glow);
          background-color: rgba(255, 255, 255, 0.04);
        }

        .profile-demo-avatar-container {
          flex-shrink: 0;
        }

        .profile-demo-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--glass-border);
        }

        .profile-demo-avatar-fallback {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: var(--accent-color);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .profile-demo-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .profile-demo-info h4 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }

        .profile-demo-tag {
          font-size: 0.85rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .profile-demo-info p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 6px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .profile-demo-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          font-size: 0.775rem;
          font-weight: 600;
        }

        .theme-badge {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: capitalize;
        }

        .visit-badge {
          color: var(--accent-color);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 600px) {
          .home-container {
            padding: 40px 16px;
          }
          .hero-section {
            margin-bottom: 50px;
          }
          .demo-section {
            padding: 24px;
          }
          .profile-demo-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-demo-footer {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
