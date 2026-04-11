import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.header__user')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/My-Dashboard' },
    { label: 'Instructors', path: '/fo' },
    { label: 'Learn', path: '/learn' },
    { label: 'Brokers', path: '/brokers' },
  ];

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="main-header">
      <div className="header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo" id="header-logo">
          <div className="header__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logo-gradient)" />
              <path d="M8 18L12 10L16 16L20 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="header__logo-text">BrokenTrade</span>
        </Link>

        {/* Navigation */}
        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`} id="main-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header__nav-link ${location.pathname === item.path ? 'header__nav-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {user ? (
            /* ── Logged In: Show user avatar + dropdown ── */
            <div className="header__user">
              <button
                className="header__avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="user-avatar-btn"
              >
                <span className="header__avatar-letter">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="header__avatar-name">{user.name}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`header__chevron ${dropdownOpen ? 'header__chevron--open' : ''}`}>
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="header__dropdown" id="user-dropdown">
                  <div className="header__dropdown-info">
                    <span className="header__dropdown-name">{user.name}</span>
                    <span className="header__dropdown-email">{user.email}</span>
                    <span className="header__dropdown-type">{user.type}</span>
                  </div>
                  <div className="header__dropdown-divider" />
                  <Link to="/My-Dashboard" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    className="header__dropdown-item header__dropdown-item--logout"
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    id="logout-btn"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not Logged In: Show Get Started button ── */
            <Link to="/login" id="header-login-btn">
              <button className="header__cta">
                Get Started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="header__cta-arrow">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className={`header__hamburger ${mobileOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}