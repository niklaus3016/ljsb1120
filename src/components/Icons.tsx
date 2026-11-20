import React from 'react';

interface IconProps {
  className?: string;
  filled?: boolean;
}

export const BrandEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.35" />
    <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" />
    {/* Left crescent (Yang face) */}
    <path
      d="M32 20c-8.5 5-14 13.5-14 20s5.5 15 14 20c2.2 1.3 4.2-.8 3-3-3.5-6.5-5-12-5-17s1.5-10.5 5-17c1.2-2.2-.8-4.3-3-3z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Right crescent (Yin face) */}
    <path
      d="M48 20c8.5 5 14 13.5 14 20s-5.5 15-14 20c-2.2 1.3-4.2-.8-3-3 3.5-6.5 5-12 5-17s-1.5-10.5-5-17c-1.2-2.2.8-4.3 3-3z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="currentColor"
      fillOpacity="0.82"
    />
    <rect x="36.5" y="36.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const JiaobeiNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', filled }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M9.5 4.5C6.2 6.6 4.2 9.5 4.2 12s2 5.4 5.3 7.5c.9.6 1.8-.3 1.2-1.2-1.4-2.2-2-4.3-2-6.3s.6-4.1 2-6.3c.6-.9-.3-1.8-1.2-1.2z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.25 : 0}
    />
    <path
      d="M14.5 4.5c3.3 2.1 5.3 5 5.3 7.5s-2 5.4-5.3 7.5c-.9.6-1.8-.3-1.2-1.2 1.4-2.2 2-4.3 2-6.3s-.6-4.1-2-6.3c-.6-.9.3-1.8 1.2-1.2z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.85 : 0}
    />
  </svg>
);

export const ScrollNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', filled }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 4.5h10a2 2 0 0 1 2 2v11.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18V6.5a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.14 : 0}
    />
    <path d="M9 9h6M9 12.5h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 7H3.8a1.3 1.3 0 0 0-1.3 1.3v9.4A1.8 1.8 0 0 0 4.3 19.5H6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const BookNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', filled }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4.5 5.5A1.5 1.5 0 0 1 6 4h12a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-13Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.14 : 0}
    />
    <path d="M8.5 4v16" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 8.5h4.5M12 12h4.5M12 15.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SealNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', filled }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
      fillOpacity={filled ? 0.14 : 0}
    />
    <path
      d="M9 9h6v6H9z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const MeditateIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
