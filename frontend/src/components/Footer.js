import './Footer.css';

const iconProps = {
  role: 'img',
  focusable: 'false',
  width: 24,
  height: 24,
};

const FacebookIcon = () => (
  <svg viewBox="0 0 32 32" {...iconProps}>
    <rect x="2" y="2" width="28" height="28" rx="8" fill="#1877F2" />
    <path
      d="M18.25 11.5H20v-2.7A20 20 0 0 0 17.64 8c-2.26 0-3.81 1.4-3.81 3.95v2.3H11v3.1h2.83V24h3.3v-6.65H20l.3-3.1h-3.17v-1.84c0-.89.24-1.51 1.12-1.51Z"
      fill="#fff"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 32 32" {...iconProps}>
    <defs>
      <linearGradient id="igGradient" x1="0%" x2="100%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="25%" stopColor="#FA7E1E" />
        <stop offset="50%" stopColor="#D62976" />
        <stop offset="75%" stopColor="#962FBF" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#igGradient)" />
    <circle cx="16" cy="16" r="5.3" stroke="#fff" strokeWidth="2" fill="none" />
    <circle cx="23" cy="9" r="1.6" fill="#fff" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 32 32" {...iconProps}>
    <rect x="2" y="2" width="28" height="28" rx="8" fill="#000000" />
    <path
      d="M24 12.64a6.3 6.3 0 0 1-3.22-.94v6.16c0 3.29-2.54 5.99-5.8 6.14a6 6 0 1 1 1.07-11.92v3.42a2.7 2.7 0 1 0 1.92 2.58v-9.74h3a4.78 4.78 0 0 0 3.03 2.13Z"
      fill="#69C9D0"
    />
    <path
      d="M24 11.19a4.78 4.78 0 0 1-3.03-2.13h-3v4.18a6 6 0 0 0-4.87 10.74c-.16-.45-.25-.93-.25-1.43a4.16 4.16 0 0 1 5.49-3.94v-3.41a2.69 2.69 0 0 0-2-.83 2.7 2.7 0 0 0-.95.17v-3.4a6 6 0 0 1 3.21-.16v-2.6h3.08c.52.96 1.4 1.74 2.32 2.12Z"
      fill="#EE1D52"
    />
  </svg>
);

const socials = [
  { label: 'Facebook', icon: <FacebookIcon />, href: 'https://facebook.com', bg: '#e8f1ff' },
  { label: 'Instagram', icon: <InstagramIcon />, href: 'https://instagram.com', bg: '#fff0f6' },
  { label: 'TikTok', icon: <TikTokIcon />, href: 'https://tiktok.com', bg: '#f5f5f5' },
];

const Footer = () => (
  <footer className="footer">
    <div>
      <strong>24/7 Hotline:</strong> 1-800-HEALTH (432584)
    </div>
    <div className="socials">
      {socials.map((item) => (
        <a
          key={item.label}
          className="social-btn social-icon"
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          style={{ background: item.bg }}
        >
          {item.icon}
        </a>
      ))}
    </div>
    <div>
      <strong>Email:</strong> yangconnect@gmail.com
    </div>
  </footer>
);

export default Footer;


