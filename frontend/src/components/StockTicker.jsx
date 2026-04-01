import React from "react";
import "./StockTicker.css";

const stocks = [
  { name: "NIFTY FMCG", value: 46135.95, change: 1.31 },
  { name: "NIFTY SMALLCAP 250", value: 14749.1, change: 3.22 },
  { name: "NIFTY SMALL", value: 15709.8, change: 3.01 },
  { name: "SENSEX", value: 74211.2, change: 0.89 },
  { name: "BANK NIFTY", value: 48921.5, change: 1.76 },
];

export function StockTicker() {
  return (
    <div className="ticker-wrapper">
      <div className="fade-left" />
      <div className="fade-right" />

      <div className="ticker">
        <div className="ticker-track">
          {[...stocks, ...stocks].map((stock, index) => (
            <div key={index} className="ticker-item">
              <span className="name">{stock.name}</span>
              <span className="value">{stock.value.toLocaleString()}</span>
              <span className="change">
                ↑ {stock.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

