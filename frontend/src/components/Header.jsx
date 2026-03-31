import './Header.css';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      
      <div className="logo">
        Brokentrad
      </div>

      <nav className="navLinks">
        <Link to="/stocks">Stocks</Link>
        <Link to="/fo">F&O</Link>
        <Link to="/mutualfunds">Mutual Funds</Link>
        <Link to="/learn">Learn</Link>
      </nav>

      <Link to="/login">
        <button className="loginBtn">
          Login / Sign up
        </button>
      </Link>

    </header>
  );
}