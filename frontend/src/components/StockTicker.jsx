import React from "react";
import "./StockTicker.css";

const stocks = [
  { name: "NIFTY 50", value: 22456.80, change: 1.31, up: true },
  { name: "SENSEX", value: 74211.20, change: 0.89, up: true },
  { name: "BANK NIFTY", value: 48921.50, change: 1.76, up: true },
  { name: "NIFTY IT", value: 33450.15, change: -0.42, up: false },
  { name: "NIFTY FMCG", value: 46135.95, change: 1.31, up: true },
  { name: "SMALLCAP 250", value: 14749.10, change: 3.22, up: true },
  { name: "MIDCAP 150", value: 18230.40, change: -0.18, up: false },
  { name: "NIFTY AUTO", value: 23890.60, change: 2.05, up: true },
];

export function StockTicker() {
  const items = [...stocks, ...stocks, ...stocks];
  
  return (
    <div className="ticker-wrapper" id="stock-ticker">
      <div className="ticker-fade ticker-fade--left" />
      <div className="ticker-fade ticker-fade--right" />

      <div className="ticker">
        <div className="ticker__track">
          {items.map((stock, index) => (
            <div key={index} className="ticker__item">
              <span className="ticker__name">{stock.name}</span>
              <span className="ticker__value">{stock.value.toLocaleString('en-IN')}</span>
              <span className={`ticker__change ${stock.up ? 'ticker__change--up' : 'ticker__change--down'}`}>
                {stock.up ? '▲' : '▼'} {Math.abs(stock.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
