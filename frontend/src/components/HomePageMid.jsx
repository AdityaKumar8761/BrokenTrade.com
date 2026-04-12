import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomePageMid.css";

const features = [
  {
    id: "investing",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(37, 99, 235, 0.1)" />
        <path d="M10 22L14 14L18 18L22 10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Learn Investing",
    description: "Master the fundamentals of long-term wealth building with curated courses on stocks, mutual funds, and portfolio strategy.",
    tag: "Popular",
    path: "/learn?category=investing&file=basics",
    stocks: [
      { name: "RELIANCE", price: "₹2,456.30", change: "+1.2%" },
      { name: "TCS", price: "₹3,890.50", change: "+0.8%" },
      { name: "INFY", price: "₹1,567.20", change: "-0.3%" },
    ],
  },
  {
    id: "trading",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(139, 92, 246, 0.1)" />
        <path d="M10 16H14L16 12L18 20L20 16H22" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Learn Trading",
    description: "Explore Forex, Crypto, and Intraday strategies with real-time simulations and expert analysis.",
    tag: "New",
    path: "/learn?category=trading&file=basics",
    categories: ["Forex", "Crypto", "Intraday"],
  },
  {
    id: "ipo",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(16, 185, 129, 0.1)" />
        <path d="M16 10V22M16 10L20 14M16 10L12 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Upcoming IPOs",
    description: "Stay ahead with IPO listings, GMP data, and detailed analysis before you invest.",
    tag: "Live",
    path: "/learn?category=ipo&file=basics",
    ipos: ["TechCorp Ltd", "FinEdge Pvt"],
  },
  {
    id: "bonds",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(245, 158, 11, 0.1)" />
        <path d="M11 21V14M16 21V11M21 21V16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Bonds & Fixed Income",
    description: "Stable returns, low risk. Understand government and corporate bonds for a balanced portfolio.",
    tag: "Guide",
    path: "/learn?category=bonds&file=basics",
    stats: { yield: "7.2%", safety: "AAA" },
  },
];

export function HomePageMid() {
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`mid ${isVisible ? 'mid--visible' : ''}`}
      ref={sectionRef}
      id="features-section"
    >
      <div className="mid__container">
        {/* Section Header */}
        <div className="mid__header">
          <span className="mid__label">What You'll Learn</span>
          <h2 className="mid__heading">
            Everything you need to
            <br />
            <span className="mid__heading-accent">master the markets</span>
          </h2>
          <p className="mid__description">
            From beginner-friendly investing guides to advanced trading strategies —
            we've got your financial education covered.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mid__grid">
          {features.map((feature, index) => (
            <Link
              to={feature.path}
              key={feature.id}
              className={`mid__card ${activeCard === feature.id ? 'mid__card--active' : ''}`}
              onMouseEnter={() => setActiveCard(feature.id)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ animationDelay: `${index * 100}ms`, textDecoration: 'none' }}
              id={`feature-card-${feature.id}`}
            >
              {/* Card Header */}
              <div className="mid__card-top">
                <div className="mid__card-icon">{feature.icon}</div>
                <span className={`mid__card-tag mid__card-tag--${feature.id}`}>
                  {feature.tag}
                </span>
              </div>

              {/* Card Content */}
              <h3 className="mid__card-title">{feature.title}</h3>
              <p className="mid__card-desc">{feature.description}</p>

              {/* Dynamic Content */}
              {feature.stocks && (
                <div className="mid__card-stocks">
                  {feature.stocks.map((s, i) => (
                    <div key={i} className="mid__stock-row">
                      <span className="mid__stock-name">{s.name}</span>
                      <span className="mid__stock-price">{s.price}</span>
                      <span className={`mid__stock-change ${s.change.startsWith('+') ? 'mid__stock-change--up' : 'mid__stock-change--down'}`}>
                        {s.change}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {feature.categories && (
                <div className="mid__card-categories">
                  {feature.categories.map((cat, i) => (
                    <span key={i} className="mid__category-pill">{cat}</span>
                  ))}
                </div>
              )}

              {feature.ipos && (
                <div className="mid__card-ipos">
                  {feature.ipos.map((ipo, i) => (
                    <div key={i} className="mid__ipo-row">
                      <div className="mid__ipo-dot" />
                      <span>{ipo}</span>
                    </div>
                  ))}
                </div>
              )}

              {feature.stats && (
                <div className="mid__card-stats">
                  <div className="mid__stat">
                    <span className="mid__stat-value">{feature.stats.yield}</span>
                    <span className="mid__stat-label">Avg. Yield</span>
                  </div>
                  <div className="mid__stat">
                    <span className="mid__stat-value">{feature.stats.safety}</span>
                    <span className="mid__stat-label">Rating</span>
                  </div>
                </div>
              )}

              {/* Arrow indicator */}
              <div className="mid__card-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10H15M15 10L11 6M15 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
