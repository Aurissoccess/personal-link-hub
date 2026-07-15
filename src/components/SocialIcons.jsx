import React from 'react';
import { TelegramIcon, InstagramIcon, YoutubeIcon, LinkedinIcon, GithubIcon } from './BrandIcons';

export default function SocialIcons({ socials }) {
  if (!socials) return null;

  const socialPlatforms = [
    { key: 'telegram', icon: TelegramIcon, label: 'Telegram', color: '#0088cc' },
    { key: 'instagram', icon: InstagramIcon, label: 'Instagram', color: '#e1306c' },
    { key: 'youtube', icon: YoutubeIcon, label: 'YouTube', color: '#ff0000' },
    { key: 'linkedin', icon: LinkedinIcon, label: 'LinkedIn', color: '#0077b5' },
    { key: 'github', icon: GithubIcon, label: 'GitHub', color: '#333333' }
  ];

  const activeSocials = socialPlatforms.filter(p => socials[p.key] && socials[p.key].trim() !== '');

  if (activeSocials.length === 0) return null;

  return (
    <div className="social-icons-row">
      {activeSocials.map(platform => {
        const IconComponent = platform.icon;
        let url = socials[platform.key];
        // Ensure proper link prefixing
        if (url && !/^https?:\/\//i.test(url)) {
          if (platform.key === 'telegram') {
            const cleanUser = url.replace(/^@/, '');
            url = `https://t.me/${cleanUser}`;
          } else {
            url = `https://${url}`;
          }
        }

        return (
          <a
            key={platform.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label={platform.label}
            style={{ '--hover-color': platform.color }}
          >
            <IconComponent size={20} />
          </a>
        );
      })}
      <style>{`
        .social-icons-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 16px 0;
          flex-wrap: wrap;
          width: 100%;
        }
        .social-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        .social-icon-btn:hover {
          color: #ffffff;
          background-color: var(--hover-color);
          border-color: var(--hover-color);
          transform: translateY(-3px);
          box-shadow: 0 4px 12px var(--hover-color);
        }
        .social-icon-btn:active {
          transform: translateY(0);
        }
        .theme-minimal-light .social-icon-btn:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
