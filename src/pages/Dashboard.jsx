import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link2, Palette, BarChart3, Settings, Plus, Save, 
  Trash2, Edit3, Eye, EyeOff, Layout, Globe, FileText,
  User, Mail, ArrowUpRight, CheckCircle2, AlertCircle, GripVertical
} from 'lucide-react';
import { db } from '../utils/db';
import DragDropList from '../components/DragDropList';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: {} });

  // Navigation Tab
  const [activeTab, setActiveTab] = useState('links'); // links, appearance, analytics, seo

  // Alert Notifications
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  // Form states - Link Builder
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('Globe');
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);

  // Form states - Appearance / Profile info
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('glass-dark');
  const [socials, setSocials] = useState({
    instagram: '', telegram: '', linkedin: '', youtube: '', github: ''
  });

  // Form states - SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Available icons for link buttons
  const availableIcons = [
    { name: 'Globe', label: 'Veb-sayt (Globe)' },
    { name: 'Palette', label: 'Dizayn/Portfolio' },
    { name: 'Play', label: 'Video/YouTube' },
    { name: 'MessageCircle', label: 'Telegram/Chat' },
    { name: 'Download', label: 'Yuklab olish' },
    { name: 'Github', label: 'GitHub Repozitoriy' },
    { name: 'Linkedin', label: 'LinkedIn Profil' },
    { name: 'Mail', label: 'Elektron Pochta' },
    { name: 'Briefcase', label: 'Karyera/Resume' },
    { name: 'FileText', label: 'Hujjat/Maqola' }
  ];

  // Available pre-designed themes
  const themesList = [
    { id: 'glass-dark', name: 'Glass Dark', preview: 'linear-gradient(135deg, #1a1c23 0%, #070709 100%)', text: '#ffffff' },
    { id: 'neon-sunset', name: 'Neon Sunset', preview: 'linear-gradient(135deg, #1e0b36 0%, #2e0926 100%)', text: '#ffffff' },
    { id: 'forest-emerald', name: 'Forest Emerald', preview: 'linear-gradient(135deg, #071f1a 0%, #020706 100%)', text: '#f0fdf4' },
    { id: 'ocean-breeze', name: 'Ocean Breeze', preview: 'linear-gradient(135deg, #061e3d 0%, #082d4c 100%)', text: '#ecfeff' },
    { id: 'warm-terracotta', name: 'Warm Terracotta', preview: 'linear-gradient(135deg, #2c1611 0%, #3a1d13 100%)', text: '#fffbeb' },
    { id: 'minimal-light', name: 'Minimal Light', preview: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', text: '#0f172a' }
  ];

  useEffect(() => {
    const sessionStr = localStorage.getItem('linkhub_session');
    if (!sessionStr) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(sessionStr);
      setCurrentUser(user);

      // Fetch user profile data
      const userProfile = db.getProfile(user.username);
      if (userProfile) {
        setProfile(userProfile);
        setProfileName(userProfile.name || '');
        setProfileBio(userProfile.bio || '');
        setProfileAvatar(userProfile.avatar || '');
        setSelectedTheme(userProfile.theme || 'glass-dark');
        setSocials(userProfile.socials || { instagram: '', telegram: '', linkedin: '', youtube: '', github: '' });
        setSeoTitle(userProfile.seoTitle || '');
        setSeoDescription(userProfile.seoDescription || '');
      }

      // Fetch analytics data
      const userAnalytics = db.getAnalytics(user.username);
      setAnalytics(userAnalytics);

    } catch (e) {
      console.error(e);
      navigate('/login');
    }
  }, [navigate]);

  const triggerAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  // 1. Link Builder Logic
  const handleSaveLink = (e) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) {
      triggerAlert('error', 'Iltimos, sarlavha va URL manzilini kiriting.');
      return;
    }

    let updatedLinks = [...(profile.links || [])];
    
    if (editingLinkId) {
      // Edit mode
      updatedLinks = updatedLinks.map(link => 
        link.id === editingLinkId 
          ? { ...link, title: linkTitle.trim(), url: linkUrl.trim(), icon: linkIcon } 
          : link
      );
      triggerAlert('success', 'Havola muvaffaqiyatli tahrirlandi!');
    } else {
      // Create mode
      const newLink = {
        id: `link-${Date.now()}`,
        title: linkTitle.trim(),
        url: linkUrl.trim(),
        icon: linkIcon,
        active: true
      };
      updatedLinks.push(newLink);
      triggerAlert('success', 'Yangi havola muvaffaqiyatli qo\'shildi!');
    }

    // Save profile update
    const updatedProfile = { ...profile, links: updatedLinks };
    db.updateProfile(currentUser.username, updatedProfile);
    setProfile(updatedProfile);

    // Reset Link form
    setLinkTitle('');
    setLinkUrl('');
    setLinkIcon('Globe');
    setEditingLinkId(null);
    setIsLinkFormOpen(false);
  };

  const handleEditLinkStart = (link) => {
    setEditingLinkId(link.id);
    setLinkTitle(link.title);
    setLinkUrl(link.url);
    setLinkIcon(link.icon || 'Globe');
    setIsLinkFormOpen(true);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLink = (linkId) => {
    if (!window.confirm("Haqiqatan ham ushbu havolani o'chirib tashlamoqchimisiz?")) return;
    
    const updatedLinks = (profile.links || []).filter(link => link.id !== linkId);
    const updatedProfile = { ...profile, links: updatedLinks };
    
    db.updateProfile(currentUser.username, updatedProfile);
    setProfile(updatedProfile);
    triggerAlert('success', 'Havola o\'chirildi.');
  };

  const handleToggleLinkActive = (linkId) => {
    const updatedLinks = (profile.links || []).map(link => 
      link.id === linkId ? { ...link, active: !link.active } : link
    );
    const updatedProfile = { ...profile, links: updatedLinks };
    
    db.updateProfile(currentUser.username, updatedProfile);
    setProfile(updatedProfile);
  };

  const handleReorderLinks = (newLinks) => {
    const updatedProfile = { ...profile, links: newLinks };
    db.updateProfile(currentUser.username, updatedProfile);
    setProfile(updatedProfile);
  };

  // 2. Profile Appearance Settings Logic
  const handleSaveAppearance = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      name: profileName.trim(),
      bio: profileBio.trim(),
      avatar: profileAvatar.trim(),
      theme: selectedTheme,
      socials: {
        instagram: socials.instagram.trim(),
        telegram: socials.telegram.trim(),
        linkedin: socials.linkedin.trim(),
        youtube: socials.youtube.trim(),
        github: socials.github.trim()
      }
    };

    const res = db.updateProfile(currentUser.username, updatedProfile);
    if (res.success) {
      setProfile(res.profile);
      triggerAlert('success', 'Tashqi ko\'rinish sozlamalari muvaffaqiyatli saqlandi!');
    } else {
      triggerAlert('error', 'Saqlashda xatolik yuz berdi.');
    }
  };

  // 3. SEO Settings Logic
  const handleSaveSEO = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim()
    };

    const res = db.updateProfile(currentUser.username, updatedProfile);
    if (res.success) {
      setProfile(res.profile);
      triggerAlert('success', 'SEO sozlamalari saqlandi!');
    } else {
      triggerAlert('error', 'Saqlashda xatolik yuz berdi.');
    }
  };

  // Calculate stats
  const totalViews = analytics.views || 0;
  const totalClicks = Object.values(analytics.clicks || {}).reduce((a, b) => a + b, 0);
  const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  if (!currentUser || !profile) return null;

  return (
    <div className="container-app animate-fade-in">
      {/* Alert Banner */}
      {alert.show && (
        <div className={`toast alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Top Welcome Panel */}
      <div className="dashboard-top-panel card">
        <div className="panel-welcome-info">
          <h2>Boshqaruv Paneli</h2>
          <p>Foydalanuvchi: <span className="highlight">@{currentUser.username}</span></p>
        </div>
        <div className="panel-welcome-actions">
          <a 
            href={`/${currentUser.username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm-view"
          >
            <span>Havolani ko'rish</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Navigation Sidebar Tabs */}
        <aside className="dashboard-sidebar">
          <button 
            className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            <Link2 size={18} />
            <span>Havolalar boshqaruvi</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            <span>Tashqi ko'rinish (Dizayn)</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Analitika</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <Settings size={18} />
            <span>SEO sozlamalari</span>
          </button>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="dashboard-content card">
          
          {/* TAB 1: LINKS MANAGEMENT */}
          {activeTab === 'links' && (
            <div className="tab-pane">
              <div className="tab-header">
                <h3>Havolalar ro'yxati</h3>
                {!isLinkFormOpen && (
                  <button onClick={() => setIsLinkFormOpen(true)} className="btn btn-primary btn-sm">
                    <Plus size={16} /> Yangi havola qo'shish
                  </button>
                )}
              </div>

              {isLinkFormOpen && (
                <form onSubmit={handleSaveLink} className="link-form-card card animate-fade-in">
                  <h4>{editingLinkId ? "Havolani tahrirlash" : "Yangi havola yaratish"}</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Tugma matni (Sarlavha)</label>
                    <input 
                      type="text" 
                      placeholder="masalan: Mening shaxsiy blogim" 
                      className="form-input"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Havola manzili (URL)</label>
                    <input 
                      type="text" 
                      placeholder="masalan: https://medium.com/@username" 
                      className="form-input"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ikonka tanlang</label>
                    <select 
                      className="form-input select-icon" 
                      value={linkIcon} 
                      onChange={(e) => setLinkIcon(e.target.value)}
                    >
                      {availableIcons.map(icon => (
                        <option key={icon.name} value={icon.name}>{icon.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} /> Saqlash
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsLinkFormOpen(false);
                        setEditingLinkId(null);
                        setLinkTitle('');
                        setLinkUrl('');
                        setLinkIcon('Globe');
                      }}
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              )}

              <div className="dnd-instructions">
                <GripVertical size={16} />
                <span>Havolalar tartibini o'zgartirish uchun sudrab (Drag & Drop) joylashtiring.</span>
              </div>

              <DragDropList
                items={profile.links || []}
                onReorder={handleReorderLinks}
                onEdit={handleEditLinkStart}
                onDelete={handleDeleteLink}
                onToggleActive={handleToggleLinkActive}
              />
            </div>
          )}

          {/* TAB 2: APPEARANCE CUSTOMIZER */}
          {activeTab === 'appearance' && (
            <div className="tab-pane">
              <form onSubmit={handleSaveAppearance}>
                <h3 className="section-title-sub">Profil sozlamalari</h3>
                
                <div className="profile-details-section">
                  <div className="form-group">
                    <label className="form-label">Ism / Taxallus</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qisqa tavsif (Bio)</label>
                    <textarea 
                      rows="3" 
                      className="form-input text-area-bio" 
                      placeholder="Masalan: Frontend dasturchi, kitobxon va video-blogger."
                      value={profileBio} 
                      onChange={(e) => setProfileBio(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profil rasmi URL manzili (Avatar URL)</label>
                    <input 
                      type="text" 
                      placeholder="Rasm havolasini kiriting (masalan: Unsplash yoki telegram avatar)" 
                      className="form-input" 
                      value={profileAvatar} 
                      onChange={(e) => setProfileAvatar(e.target.value)}
                    />
                  </div>
                </div>

                <h3 className="section-title-sub mt-6">Dizayn mavzulari (Themes)</h3>
                <div className="themes-grid-selector">
                  {themesList.map(t => (
                    <div 
                      key={t.id} 
                      className={`theme-option-card ${selectedTheme === t.id ? 'active' : ''}`}
                      onClick={() => setSelectedTheme(t.id)}
                      style={{ '--preview-bg': t.preview }}
                    >
                      <div className="theme-option-preview">
                        <div className="theme-inner-card" style={{ backgroundColor: t.id === 'minimal-light' ? '#ffffff' : 'rgba(255,255,255,0.1)' }}></div>
                        <div className="theme-inner-card" style={{ backgroundColor: t.id === 'minimal-light' ? '#ffffff' : 'rgba(255,255,255,0.1)' }}></div>
                      </div>
                      <span className="theme-option-name">{t.name}</span>
                    </div>
                  ))}
                </div>

                <h3 className="section-title-sub mt-6">Ijtimoiy tarmoqlar piktogrammalari</h3>
                <div className="socials-inputs-grid">
                  <div className="form-group">
                    <label className="form-label">Telegram URL yoki Username</label>
                    <input 
                      type="text" 
                      placeholder="t.me/username yoki @username" 
                      className="form-input" 
                      value={socials.telegram} 
                      onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Instagram URL</label>
                    <input 
                      type="text" 
                      placeholder="instagram.com/username" 
                      className="form-input" 
                      value={socials.instagram} 
                      onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube URL</label>
                    <input 
                      type="text" 
                      placeholder="youtube.com/@channel" 
                      className="form-input" 
                      value={socials.youtube} 
                      onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input 
                      type="text" 
                      placeholder="linkedin.com/in/username" 
                      className="form-input" 
                      value={socials.linkedin} 
                      onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input 
                      type="text" 
                      placeholder="github.com/username" 
                      className="form-input" 
                      value={socials.github} 
                      onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-4 btn-save-appearance">
                  <Save size={16} /> Dizaynni saqlash
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="tab-pane">
              <h3>Profil statistikasi</h3>
              
              <div className="analytics-summary-cards">
                <div className="stat-card">
                  <span className="stat-label">Umumiy ko'rishlar</span>
                  <span className="stat-value">{totalViews}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Umumiy bosishlar</span>
                  <span className="stat-value">{totalClicks}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">CTR ko'rsatkichi</span>
                  <span className="stat-value">{overallCTR}%</span>
                </div>
              </div>

              <h4 className="mt-6 mb-4">Havolalar bo'yicha bosish statistikasi</h4>
              <div className="links-stats-list">
                {profile.links && profile.links.length > 0 ? (
                  profile.links.map(link => {
                    const clicks = analytics.clicks[link.id] || 0;
                    const ctr = totalViews > 0 ? ((clicks / totalViews) * 100).toFixed(1) : 0;
                    // Percentage of clicks relative to highest clicked item to draw beautiful scale bars
                    const maxClicks = Math.max(...Object.values(analytics.clicks || {}), 1);
                    const widthPercent = (clicks / maxClicks) * 100;

                    return (
                      <div key={link.id} className="link-stat-item">
                        <div className="link-stat-info-row">
                          <span className="stat-link-title">{link.title}</span>
                          <span className="stat-link-numbers"><strong>{clicks} marta</strong> ({ctr}% CTR)</span>
                        </div>
                        <div className="stat-bar-track">
                          <div className="stat-bar-fill" style={{ width: `${widthPercent}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">Hali hech qanday havola yo'q, analitika yaratilishi uchun havola qo'shing.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="tab-pane">
              <form onSubmit={handleSaveSEO}>
                <h3>Qidiruv tizimi optimallashtiruvchisi (SEO)</h3>
                <p className="tab-desc">Google, Yandex va ijtimoiy tarmoqlar (Telegram, Facebook link previews) uchun sahifangizni tayyorlang.</p>
                
                <div className="form-group">
                  <label className="form-label">Meta sarlavha (Meta Title)</label>
                  <input 
                    type="text" 
                    placeholder="masalan: Dilnoza Olimova | UI/UX Dizayner Portfoliosi" 
                    className="form-input" 
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                  <span className="help-text">Qidiruv natijalarida ko'rinadigan asosiy ko'k sarlavha (Tavsiya etiladi: 50-60 belgi).</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta tavsif (Meta Description)</label>
                  <textarea 
                    rows="4" 
                    placeholder="masalan: Dilnoza Olimovaning barcha foydali ijtimoiy tarmoqlari, dizayn kurslari va portfoliolarining yagona rasmiy ro'yxati." 
                    className="form-input" 
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                  <span className="help-text">Qidiruv natijalarida sarlavha ostida ko'rinadigan qisqa matn (Tavsiya etiladi: 150-160 belgi).</span>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> SEO sozlamalarini saqlash
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .dashboard-top-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          margin-bottom: 24px;
          gap: 16px;
        }

        .panel-welcome-info h2 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .panel-welcome-info p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .highlight {
          color: var(--accent-color);
          font-weight: 700;
        }

        .btn-sm-view {
          font-size: 0.9rem;
          padding: 10px 18px;
          gap: 6px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (min-width: 850px) {
          .dashboard-grid {
            grid-template-columns: 280px 1fr;
          }
        }

        .dashboard-sidebar {
          display: flex;
          flex-direction: row;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        @media (min-width: 850px) {
          .dashboard-sidebar {
            flex-direction: column;
            overflow-x: visible;
            padding-bottom: 0;
          }
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: var(--border-radius-md);
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          flex-grow: 1;
        }

        @media (min-width: 850px) {
          .tab-btn {
            flex-grow: 0;
            width: 100%;
          }
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.05);
          transform: translateX(2px);
        }

        .tab-btn.active {
          background-color: var(--accent-color);
          border-color: var(--accent-color);
          color: #ffffff;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .tab-btn.active:hover {
          transform: none;
        }

        .dashboard-content {
          min-height: 500px;
        }

        .tab-pane h3 {
          font-size: 1.4rem;
          margin-bottom: 16px;
        }

        .tab-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-top: -8px;
          margin-bottom: 24px;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tab-header h3 {
          margin-bottom: 0;
        }

        .btn-sm {
          font-size: 0.85rem;
          padding: 8px 14px;
          gap: 4px;
        }

        /* Forms in Dashboard */
        .link-form-card {
          margin-bottom: 24px;
          background-color: rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .link-form-card h4 {
          font-size: 1.1rem;
          margin-bottom: 16px;
        }

        .select-icon {
          cursor: pointer;
        }

        .form-actions-row {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .dnd-instructions {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          background-color: rgba(255, 255, 255, 0.02);
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--glass-border);
        }

        .section-title-sub {
          font-size: 1.15rem;
          margin-bottom: 16px;
          border-left: 3px solid var(--accent-color);
          padding-left: 8px;
        }

        .mt-6 {
          margin-top: 28px;
        }

        .mb-4 {
          margin-bottom: 16px;
        }

        .text-area-bio {
          resize: vertical;
          min-height: 80px;
        }

        /* Themes Selector */
        .themes-grid-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .theme-option-card {
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: center;
          background-color: var(--glass-bg);
          padding: 8px;
        }

        .theme-option-card:hover {
          transform: translateY(-2px);
          border-color: var(--text-secondary);
        }

        .theme-option-card.active {
          border-color: var(--accent-color);
          box-shadow: 0 0 10px 0 var(--accent-glow);
        }

        .theme-option-preview {
          height: 70px;
          border-radius: var(--border-radius-sm);
          background: var(--preview-bg);
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          padding: 8px;
        }

        .theme-inner-card {
          height: 8px;
          width: 80%;
          border-radius: 4px;
          opacity: 0.8;
        }

        .theme-option-name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Socials inputs */
        .socials-inputs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 600px) {
          .socials-inputs-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .btn-save-appearance {
          width: 100%;
          padding: 12px;
        }

        @media (min-width: 600px) {
          .btn-save-appearance {
            width: auto;
          }
        }

        /* Help texts */
        .help-text {
          display: block;
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-top: 6px;
        }

        /* Analytics tabs */
        .analytics-summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        @media (max-width: 500px) {
          .analytics-summary-cards {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--accent-color);
          text-shadow: 0 0 10px var(--accent-glow);
        }

        .links-stats-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 12px;
        }

        .link-stat-item {
          background-color: rgba(255,255,255,0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          padding: 14px 18px;
        }

        .theme-minimal-light .link-stat-item {
          background-color: #ffffff;
        }

        .link-stat-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.95rem;
          flex-wrap: wrap;
          gap: 8px;
        }

        .stat-link-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-link-numbers {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .stat-bar-track {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .theme-minimal-light .stat-bar-track {
          background-color: #e2e8f0;
        }

        .stat-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color) 0%, #ec4899 100%);
          border-radius: 3px;
          transition: width var(--transition-slow);
        }

        /* Toast notification */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.3s ease forwards;
        }

        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
