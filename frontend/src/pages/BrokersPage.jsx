import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import './css-pages/BrokersPage.css';

const API_URL = `${import.meta.env.VITE_API_URL}/User/all`;

// Component for Star Rating
const RatingStars = ({ rating }) => {
  return (
    <div className="broker-card__rating">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="star-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < Math.floor(rating || 5) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="rating-value">{rating || '5.0'}</span>
    </div>
  );
};

export function BrokersPage() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) {
          const allUsers = await res.json();
          // Filter only users with type 'Broker'
          const filtered = allUsers.filter(u => u.type === 'Broker');
          setBrokers(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch brokers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrokers();
  }, []);

  return (
    <div className="brokers-page-wrapper">
      <Header />
      
      <main className="brokers-container" id="brokers-listing-page">
        <header className="brokers-header">
          <h1>Verified Brokers</h1>
          <p>
            Choose from our curated list of professional brokers, vetted for 
            reliability and expertise in the financial markets.
          </p>
        </header>

        {loading ? (
          <div className="brokers-loading">
            <div className="spinner"></div>
            <p>Fetching the best brokers for you...</p>
          </div>
        ) : brokers.length === 0 ? (
          <div className="brokers-empty">
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>No brokers found at the moment.</h3>
            <p>We're currently expanding our network. Please check back later.</p>
          </div>
        ) : (
          <div className="brokers-grid">
            {brokers.map((broker) => (
              <article key={broker._id} className="broker-card">
                <div className="broker-card__avatar-section">
                  <div className="broker-card__avatar-wrapper">
                    <div className="broker-card__avatar-inner">
                      {broker.image ? (
                        <img 
                          src={broker.image} 
                          alt={broker.name} 
                          className="broker-card__img" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<span>${broker.name.charAt(0).toUpperCase()}</span>`;
                          }}
                        />
                      ) : (
                        <span>{broker.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="broker-card__online-badge" title="Verified Professional" />
                  </div>
                </div>

                <div className="broker-card__body">
                  <div className="broker-card__type-badge">Official Broker</div>
                  <h3 className="broker-card__name">{broker.name}</h3>
                  
                  <RatingStars rating={broker.rating} />
                  
                  <p className="broker-card__desc">
                    {broker.description || `Specialized in premium portfolio management and equity derivatives. Helping clients achieve financial goals through disciplined trading.`}
                  </p>

                  <div className="broker-card__footer">
                    <Link to={`/chat/broker/${broker._id}`} className="broker-card__btn" id={`connect-${broker._id}`}>
                      Connect Now
                    </Link>
                    <button className="broker-card__secondary-btn" title="Message Broker">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <HomePageFutter />
    </div>
  );
}
