import { Link } from 'react-router-dom';
import '../styles/dashboard-shell.css';
import './css-pages/BrokerDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { ChatInbox } from '../components/ChatInbox';

export function BrokerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="dash-page">
        <div className="dash-inner broker-dash-layout">
          <div className="dash-main-content">
            <header className="dash-hero">
              <div className="dash-hero__top">
                <div>
                  <p className="dash-eyebrow">Broker</p>
                  <h1 className="dash-title">Partner desk</h1>
                  <p className="dash-lede">
                    <strong>{user?.name}</strong>, this area will host client onboarding, lead quality, and payout
                    summaries. Until those tools ship, use the links below to stay aligned with the product surface.
                  </p>
                </div>
              </div>
              <nav className="dash-quick" aria-label="Shortcuts">
                <Link className="dash-quick__link" to="/courses">
                  <span className="dash-quick__icon" aria-hidden="true">
                    ◆
                  </span>
                  <span>Course catalog</span>
                </Link>
                <Link className="dash-quick__link" to="/profile">
                  <span className="dash-quick__icon" aria-hidden="true">
                    ○
                  </span>
                  <span>Profile</span>
                </Link>
              </nav>
            </header>

            <section className="dash-panel broker-dash__panel">
              <div className="dash-spotlight broker-dash__spotlight">
                <div className="dash-spotlight__mark" aria-hidden="true">
                  B
                </div>
                <h2>Broker portal</h2>
                <p>
                  Client management, ticket volume, and revenue views will appear here when the broker programme is
                  switched on. Nothing is wrong with your account—this is simply ahead of the release.
                </p>
              </div>
            </section>
          </div>

          <aside className="dash-sidebar">
            <ChatInbox userId={user?.id} />
          </aside>
        </div>
      </div>
    </>
  );
}
