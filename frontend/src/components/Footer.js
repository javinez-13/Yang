import './Footer.css';

const socials = [
  { label: 'Facebook', icon: '📘', href: 'https://facebook.com' },
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
  { label: 'TikTok', icon: '🎵', href: 'https://tiktok.com' },
];

const Footer = () => (
  <footer className="footer">
    <div>
      <strong>24/7 Hotline:</strong> 1-800-HEALTH (432584)
    </div>
    <div className="socials">
      {socials.map((item) => (
        <a key={item.label} className="social-btn" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
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


