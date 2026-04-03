import './Header.css';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      
      <div className="logo">
        Brok&Treade
      </div>

      <nav className="navLinks">
        <Link to="/My-Dashboard">MY Dashboard</Link>
        <Link to="/fo">Instructor</Link>
        <Link to="/mutualfunds">Practice</Link>
        <Link to="/learn">My brokers</Link>
      </nav>

      <Link to="/login">
        <button className="loginBtn">
          Login / Sign up
        </button>
      </Link>

    </header>
  );
}