import React, { useState } from "react";
import "./HomePageMid.css";

const stockData = [
  { name: "RELIANCE", price: 2456.3 },
  { name: "TCS", price: 3890.5 },
  { name: "INFY", price: 1567.2 },
];

export function HomePageMid(){
  const [hovered, setHovered] = useState(null);

  const randomChange = (price) => {
    return (price + (Math.random() * 10 - 5)).toFixed(2);
  };

  return (
    <div className="mid-container">
      <h2 className="mid-heading">
        Knowledge at you fingers
      </h2>

      <div className="mid-grid">

        {/* STOCKS */}
        <div
          className="card stocks"
          onMouseEnter={() => setHovered("stocks")}
          onMouseLeave={() => setHovered(null)}
        >
          <h3>Stocks</h3>

          <div className="stock-list">
            {stockData.map((s, i) => (
              <div key={i} className="stock-item">
                <span>{s.name}</span>
                <span>
                  ₹ {hovered === "stocks" ? randomChange(s.price) : s.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ETFs */}
        <div
          className="card etf"
          onMouseEnter={() => setHovered("etf")}
          onMouseLeave={() => setHovered(null)}
        >
          <h3>ETFs</h3>
          <div className="icons">
            <div className="icon">💰</div>
            <div className="icon">🌍</div>
            <div className="icon">📈</div>
          </div>

          {hovered === "etf" && (
            <p className="hover-text">
              Gold, Global & Index ETFs
            </p>
          )}
        </div>

        {/* IPO */}
        <div
          className="card ipo"
          onMouseEnter={() => setHovered("ipo")}
          onMouseLeave={() => setHovered(null)}
        >
          <h3>IPOs</h3>

          <div className="ipo-list">
            <div className="ipo-item">TechCorp Ltd</div>
            <div className="ipo-item">FinEdge Pvt</div>
          </div>

          {hovered === "ipo" && (
            <button className="apply-btn">Apply Now</button>
          )}
        </div>

        {/* Bonds */}
        <div
          className="card bonds"
          onMouseEnter={() => setHovered("bonds")}
          onMouseLeave={() => setHovered(null)}
        >
          <h3>Bonds</h3>

          <p>
            {hovered === "bonds"
              ? "Stable returns. Low risk. Smart choice."
              : "Earn fixed interest"}
          </p>
        </div>

      </div>
    </div>
  );
};

