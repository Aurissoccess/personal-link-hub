import React from 'react';
import * as Icons from 'lucide-react';
import { getBrandIcon } from './BrandIcons';

export default function LinkCard({ title, url, icon, onClick }) {
  // Safe icon resolver
  const renderIcon = () => {
    if (!icon) return <Icons.Link2 size={20} />;
    
    // Check if it's a brand icon first
    const brandIcon = getBrandIcon(icon);
    if (brandIcon) return brandIcon;

    const IconComponent = Icons[icon];
    if (IconComponent) {
      return <IconComponent size={20} />;
    }
    return <Icons.Link2 size={20} />;
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick();
    }
  };

  // Ensure absolute URL
  let formattedUrl = url;
  if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  return (
    <a
      href={formattedUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-card-btn"
    >
      <div className="link-card-icon-container">
        {renderIcon()}
      </div>
      <span className="link-card-title">{title}</span>
      <div className="link-card-arrow">
        <Icons.ChevronRight size={16} />
      </div>
      <style>{`
        .link-card-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px 20px;
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          transition: all var(--transition-normal);
          text-align: left;
          position: relative;
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          margin-bottom: 14px;
        }
        
        .link-card-btn:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: var(--accent-color);
          box-shadow: 0 8px 24px var(--accent-glow);
          background-color: rgba(255, 255, 255, 0.08);
        }

        .theme-minimal-light .link-card-btn:hover {
          background-color: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }
        
        .link-card-btn:active {
          transform: translateY(0) scale(1);
        }
        
        .link-card-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          margin-right: 16px;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        
        .link-card-btn:hover .link-card-icon-container {
          transform: scale(1.15);
        }
        
        .link-card-title {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.05rem;
          flex-grow: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 12px;
        }
        
        .link-card-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: all var(--transition-fast);
        }
        
        .link-card-btn:hover .link-card-arrow {
          opacity: 1;
          transform: translateX(3px);
          color: var(--accent-color);
        }
      `}</style>
    </a>
  );
}
