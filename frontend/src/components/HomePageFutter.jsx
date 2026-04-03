import React from "react";
import "./HomePageFutter.css";

export function HomePageFutter() {
  return (
    <footer className="footer">

      {/* 🔹 Top Center Brand */}
      <div className="footer-brand">
        <h1>Broke&Trade</h1>
        <p>Your trusted platform for learing Investing and Trading.</p>
      </div>

      {/* 🔹 Middle Sections */}
      <div className="footer-container">

        <div className="footer-section">
          <h4>Products</h4>
          <ul>
            <li>Stocks</li>
            <li>Mutual Funds</li>
            <li>F&O</li>
            <li>IPO</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>About</li>
            <li>Pricing</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      {/* 🔹 Creators Section */}
      <div className="footer-creators">
        <h3>Creators</h3>

        <div className="creator-list">
          <div className="creator">
            <h4>Aditya</h4>
            <p>Frontend Developer & UI Designer</p>
          </div>

          <div className="creator">
            <h4>Raj</h4>
            <p>Backend Developer & API Specialist</p>
          </div>

          <div className="creator">
            <h4>Nishidh</h4>
            <p>Database & DevOps Engineer</p>
          </div>
        </div>
      </div>

      {/* 🔹 Bottom */}
      <div className="footer-bottom">
        © 2026 TradeX. All rights reserved.
      </div>

    </footer>
  );
}