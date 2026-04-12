import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css-pages/login.css';

const API_URL = `${import.meta.env.VITE_API_URL}/User`;

export function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    mobile: '',
    pan: '',
    dob: '',
    password: '',
    type: '',
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setError('');
  };

  // ─── LOGIN ────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Save user and redirect to home
      login(data.user);
      navigate('/');
    } catch (err) {
      setError('Server not reachable. Make sure backend is running.');
    }
    setLoading(false);
  };

  // ─── REGISTER ─────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!registerForm.name || !registerForm.email || !registerForm.mobile ||
        !registerForm.pan || !registerForm.dob || !registerForm.password || !registerForm.type) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto-login after registration
      login(data.user);
      navigate('/');
    } catch (err) {
      setError('Server not reachable. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="bgGlow1"></div>
      <div className="bgGlow2"></div>

      <div className="cardWrapper">

        {/* LEFT — SIGN IN */}
        <form className="left" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <p>
            Don't have an account?{" "}
            <span className="link" onClick={() => { setIsSignup(true); setError(''); }}>
              Sign Up
            </span>
          </p>

          {!isSignup && error && <div className="error-msg">{error}</div>}

          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />

          <button className="button" type="submit" disabled={loading}>
            {loading && !isSignup ? 'Signing in...' : 'Login'}
          </button>

          <div className="divider">or</div>

          <div className="socialRow">
            <button type="button" className="socialBtn">Google</button>
            <button type="button" className="socialBtn">Facebook</button>
          </div>
        </form>

        {/* RIGHT — SIGN UP */}
        <form className="right" onSubmit={handleRegister}>
          <h2>Create Trading Account</h2>
          <p>
            Already registered?{" "}
            <span className="link" onClick={() => { setIsSignup(false); setError(''); }}>
              Sign In
            </span>
          </p>

          {isSignup && error && <div className="error-msg">{error}</div>}

          <input
            className="input"
            name="name"
            placeholder="Full Name"
            value={registerForm.name}
            onChange={handleRegisterChange}
            required
          />
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            className="input"
            name="mobile"
            placeholder="Mobile Number"
            value={registerForm.mobile}
            onChange={handleRegisterChange}
            required
          />
          <input
            className="input"
            name="pan"
            placeholder="PAN Number"
            value={registerForm.pan}
            onChange={handleRegisterChange}
            required
          />
          <input
            className="input"
            name="dob"
            type="date"
            value={registerForm.dob}
            onChange={handleRegisterChange}
            required
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
            minLength={6}
          />

          <select
            className="input select"
            name="type"
            value={registerForm.type}
            onChange={handleRegisterChange}
            required
          >
            <option value="">Select Account Type</option>
            <option value="Learner">Learner</option>
            <option value="Instructor">Instructor</option>
            <option value="Broker">Broker</option>
            <option value="Admin">Admin</option>
          </select>

          <button className="button" type="submit" disabled={loading}>
            {loading && isSignup ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* OVERLAY */}
        <div className={`overlay ${isSignup ? 'move' : ''}`}>
          <h1>BrokenTrade</h1>
          <p>{isSignup ? "Let's get you started" : "Learn and Earn"}</p>
        </div>

      </div>
    </div>
  );
}