import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard-shell.css';
import './css-pages/InstructorDashboard.css';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { useAuth } from '../context/AuthContext';
import { courseCategoryClass } from '../utils/courseCategoryClass';

const API = `${import.meta.env.VITE_API_URL}/Courses`;

function formatInt(n) {
  return typeof n === 'number' ? n.toLocaleString() : '0';
}

export function InstructorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const instructorId = user?.id;

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError('');

    fetch(`${API}/instructor/${instructorId}/stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load instructor stats');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to reach the server. Is the API running on port 5000?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [instructorId]);

  return (
    <>
      <Header />
      <div className="dash-page">
        <div className="dash-inner">
          <header className="dash-hero">
            <div className="dash-hero__top">
              <div>
                <p className="dash-eyebrow">Instructor</p>
                <h1 className="dash-title">Course studio</h1>
                <p className="dash-lede">
                  Welcome back, <strong>{user?.name}</strong>. Here is how your catalog is performing across
                  BrokenTrade.
                </p>
              </div>
              <Link to="/instructor/upload" className="dash-btn dash-btn--primary">
                New course
              </Link>
            </div>
          </header>

          {loading ? (
            <div className="dash-load">Loading your numbers…</div>
          ) : loadError ? (
            <div className="dash-err" role="alert">
              {loadError}
            </div>
          ) : (
            <>
              <section className="dash-stat-grid" aria-label="Course performance">
                <article className="dash-stat">
                  <span className="dash-stat__label">Total views</span>
                  <span className="dash-stat__value">{formatInt(stats?.totalViews)}</span>
                  <span className="dash-stat__hint">Across all of your courses</span>
                </article>
                <article className="dash-stat">
                  <span className="dash-stat__label">Enrolled members</span>
                  <span className="dash-stat__value">{formatInt(stats?.totalEnrolled)}</span>
                  <span className="dash-stat__hint">Sum of learner enrollments across your courses</span>
                </article>
                <article className="dash-stat dash-stat--accent">
                  <span className="dash-stat__label">Published courses</span>
                  <span className="dash-stat__value">{formatInt(stats?.courseCount)}</span>
                  <span className="dash-stat__hint">
                    <Link to="/courses">View public catalog →</Link>
                  </span>
                </article>
              </section>

              <section className="dash-panel" aria-label="Your courses">
                <div className="dash-panel__head">
                  <h2>Your courses</h2>
                  <span className="dash-panel__meta">{stats?.courseCount ?? 0} published</span>
                </div>

                {!stats?.courses?.length ? (
                  <div className="dash-empty">
                    <p>You do not have any courses yet. Publish your first lesson to appear here and on the catalog.</p>
                    <Link to="/instructor/upload" className="dash-btn dash-btn--ghost">
                      Create a course
                    </Link>
                  </div>
                ) : (
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Views</th>
                          <th>Enrolled</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.courses.map((c) => (
                          <tr key={c._id}>
                            <td className="dash-table__title">{c.title}</td>
                            <td>
                              <span className={courseCategoryClass(c.category)}>{c.category}</span>
                            </td>
                            <td>{formatInt(c.views)}</td>
                            <td>{formatInt(c.enrolledCount)}</td>
                            <td>
                              <Link className="dash-table__link" to={`/instructor/course/${c._id}/edit`}>
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
      <HomePageFutter />
    </>
  );
}
