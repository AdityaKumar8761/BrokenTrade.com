import React from "react";
import "./Hero.css";
import heroImage from "../assets/homepageimage.png";

export function Hero(){
  return (
    <div className="hero-container">

      {/* TEXT SECTION */}
      <div className="hero-text">
        <h1 className="hero-heading">Learn and Earn</h1>

        <button className="hero-button">
          Get started
        </button>
      </div>

      {/* IMAGE SECTION */}
      <div className="hero-image">
        <img src={heroImage} alt="Trading Learning Illustration" />
      </div>

    </div>
  );
};

