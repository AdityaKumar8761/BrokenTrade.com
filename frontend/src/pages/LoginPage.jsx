import { useState } from 'react';
import './css-pages/login.css';

export function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="page">

      <div className="bgGlow1"></div>
      <div className="bgGlow2"></div>

      <div className="cardWrapper">

        {/* LEFT (SIGN IN) */}
        <div className="left">
          <h2>Sign In</h2>
          <p>
            Don't have an account?{" "}
            <span className="link" onClick={() => setIsSignup(true)}>
              Sign Up
            </span>
          </p>

          <input className="input" placeholder="Email" />
          <input className="input" type="password" placeholder="Password" />

          <button className="button">Login</button>

          <div className="divider">or</div>

          <div className="socialRow">
            <button className="socialBtn">Google</button>
            <button className="socialBtn">Facebook</button>
          </div>
        </div>

        {/* RIGHT (SIGN UP) */}
        <div className="right">
          <h2>Create Trading Account</h2>
          <p>
            Already registered?{" "}
            <span className="link" onClick={() => setIsSignup(false)}>
              Sign In
            </span>
          </p>

          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Mobile Number" />
          <input className="input" placeholder="PAN Number" />
          <input className="input" type="date" />
          <input className="input" type="password" placeholder="Password" />

          <select className="input">
            <option>Select Account Type</option>
            <option>Broker</option>
            <option>New Learner</option>
            <option>Trainer</option>
            <option>Admin</option>
          </select>

          <button className="button">Create Account</button>
        </div>

        {/* OVERLAY */}
        <div
          className={`overlay ${isSignup ? 'move' : ''}`}
        >
          <h1>Brokentrad</h1>
          <p>{isSignup ? "Let's get you started" : "Learn and Earn"}</p>
        </div>

      </div>
    </div>
  );
}