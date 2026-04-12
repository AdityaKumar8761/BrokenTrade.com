import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import heroImage from "../assets/homepageimage.png";
import { Link } from "react-router-dom";

export function Hero() {
  const heroRef = useRef(null);
  const [userCount, setUserCount] = useState("10K+");
  const [courseCount, setCourseCount] = useState("50+");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch User Count
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/User/count`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserCount(userData.count.toLocaleString());
        }

        // Fetch Course Count
        const courseRes = await fetch(`${import.meta.env.VITE_API_URL}/Courses/count`);
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourseCount(courseData.count);
        }
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hero--visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef} id="hero-section">
      <div className="hero__container">


        {/* Heading */}
        <h1 className="hero__heading">
          Learn to invest.
          <br />
          <span className="hero__heading-gradient">Without the risk.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero__subtitle">
          Practice stock trading with virtual money, learn from expert instructors,
          and build your confidence before entering real markets.
        </p>

        {/* CTA Buttons */}
        <div className="hero__actions">
          <Link to="/login">
            <button className="hero__btn hero__btn--primary" id="hero-cta-primary">
              Start Paper Trading
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
          <Link to="/My-Dashboard">
            <button className="hero__btn hero__btn--secondary" id="hero-cta-secondary">
              View Dashboard
            </button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="hero__trust">
          <div className="hero__trust-item">
            <span className="hero__trust-number">{userCount}</span>
            <span className="hero__trust-label">Active Learners</span>
          </div>
          <div className="hero__trust-divider" />
          <div className="hero__trust-item">
            <span className="hero__trust-number">₹0</span>
            <span className="hero__trust-label">Zero Real Money Risk</span>
          </div>
          <div className="hero__trust-divider" />
          <div className="hero__trust-item">
            <span className="hero__trust-number">{courseCount}</span>
            <span className="hero__trust-label">Expert Courses</span>
          </div>
        </div>

        {/* Hero Image with glass frame */}
        <div className="hero__image-wrapper">
          <div className="hero__image-glow" />
          <div className="hero__image-frame">
            <img src={heroImage} alt="BrokenTrade Platform Dashboard Preview" className="hero__image" />
          </div>
        </div>
      </div>
    </section>
  );
}
