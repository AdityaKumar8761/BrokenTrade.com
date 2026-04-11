import React from "react";
import "./HomePageFutter.css";
import { Link } from "react-router-dom";

const footerLinks = {
  Products: [
    { label: "Stocks", href: "#" },
    { label: "Mutual Funds", href: "#" },
    { label: "F&O Trading", href: "#" },
    { label: "IPOs", href: "#" },
    { label: "Paper Trading", href: "/practice" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const creators = [
  { name: "Aditya", role: "Frontend & UI Design" },
  { name: "Raj", role: "Backend & APIs" },
  { name: "Nishidh", role: "Database & DevOps" },
];

export function HomePageFutter() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__inner">
        {/* Top — Brand + Links */}
        <div className="footer__top">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#footer-logo-grad)" />
                <path d="M8 18L12 10L16 16L20 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer__logo-text">BrokenTrade</span>
            </div>
            <p className="footer__tagline">
              Your trusted platform for learning investing and trading — the risk-free way.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="footer__column">
              <h4 className="footer__column-title">{section}</h4>
              <ul className="footer__links">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Creators */}
        <div className="footer__creators">
          <h4 className="footer__creators-title">Built with ❤️ by</h4>
          <div className="footer__creator-list">
            {creators.map((c) => (
              <div key={c.name} className="footer__creator">
                <div className="footer__creator-avatar">
                  {c.name.charAt(0)}
                </div>
                <div className="footer__creator-info">
                  <span className="footer__creator-name">{c.name}</span>
                  <span className="footer__creator-role">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <span>© 2026 BrokenTrade. All rights reserved.</span>
          <div className="footer__bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}