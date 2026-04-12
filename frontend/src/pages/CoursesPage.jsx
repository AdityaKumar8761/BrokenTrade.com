import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { useAuth } from '../context/AuthContext';
import { extractYoutubeId } from '../utils/youtube';
import { courseCategoryClass } from '../utils/courseCategoryClass';
import './css-pages/CoursesPage.css';

const API = `${import.meta.env.VITE_API_URL}/Courses`;

function thumbForCourse(course) {
  const yt = extractYoutubeId(course.videoUrl);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  if (course.thumbnail) return course.thumbnail;
  return null;
}

function formatInt(n) {
  const v = typeof n === 'number' ? n : 0;
  return v.toLocaleString();
}

export function CoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [enrollBusy, setEnrollBusy] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = user?.id ? `${API}?userId=${encodeURIComponent(user.id)}` : API;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!active?._id) return;
    setEnrollError('');
    const q = user?.id ? `?userId=${encodeURIComponent(user.id)}` : '';
    fetch(`${API}/${active._id}${q}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((detail) => {
        if (!detail) return;
        setActive((cur) =>
          cur && cur._id === detail._id
            ? {
                ...cur,
                ...detail,
                enrolledCount: detail.enrolledCount,
                isEnrolled: detail.isEnrolled,
              }
            : cur
        );
      })
      .catch(() => {});
  }, [active?._id, user?.id]);

  const openJoinModal = (course) => {
    setActive(course);
  };

  const closeModal = () => {
    setActive(null);
    setEnrollError('');
  };

  const patchAfterEnroll = (courseId, enrolledCount) => {
    setCourses((prev) =>
      prev.map((c) =>
        c._id === courseId ? { ...c, enrolledCount, isEnrolled: true } : c
      )
    );
  };

  const handleEnroll = async () => {
    if (!active?._id || !user?.id) return;
    setEnrollBusy(true);
    setEnrollError('');
    try {
      const res = await fetch(`${API}/${active._id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEnrollError(data.error || 'Could not enroll');
        return;
      }
      if (typeof data.enrolledCount === 'number') {
        patchAfterEnroll(active._id, data.enrolledCount);
      } else {
        patchAfterEnroll(active._id, active.enrolledCount);
      }
      const id = active._id;
      closeModal();
      navigate(`/instructor-course/${id}`);
    } catch {
      setEnrollError('Server not reachable.');
    } finally {
      setEnrollBusy(false);
    }
  };

  const showJoinModal = Boolean(
    active && user && String(active.instructorId) !== String(user.id) && !active.isEnrolled
  );

  return (
    <div className="courses-page-wrapper">
      <Header />
      <main className="courses-container">
        <header className="courses-header">
          <h1>Explore professional courses</h1>
          <p>Learn from industry experts and master the financial markets.</p>
        </header>

        {loading ? (
          <div className="courses-loading">
            <div className="spinner"></div>
            <p>Fetching courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="courses-empty">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h3>No courses found yet.</h3>
            <p>Our instructors are currently building new content. Check back soon!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => {
              const thumb = thumbForCourse(course);
              const yt = extractYoutubeId(course.videoUrl);
              const isOwner = user && String(course.instructorId) === String(user.id);

              let action = null;
              if (course.isEnrolled) {
                action = (
                  <Link
                    to={`/instructor-course/${course._id}`}
                    className="course-card__btn course-card__btn--enrolled"
                  >
                    Enrolled
                  </Link>
                );
              } else if (!user) {
                action = (
                  <Link to="/login" className="course-card__btn course-card__btn--ghost">
                    Log in to enroll
                  </Link>
                );
              } else if (isOwner) {
                action = (
                  <Link
                    to={`/instructor-course/${course._id}`}
                    className="course-card__btn course-card__btn--secondary"
                  >
                    Open course
                  </Link>
                );
              } else {
                action = (
                  <button
                    type="button"
                    className="course-card__btn"
                    onClick={() => openJoinModal(course)}
                  >
                    Join course
                  </button>
                );
              }

              return (
                <div key={course._id} className="course-card">
                  <div className="course-card__thumb">
                    {thumb ? (
                      <img src={thumb} alt="" />
                    ) : (
                      <div className={`course-card__placeholder ${courseCategoryClass(course.category)}`}>
                        {course.category}
                      </div>
                    )}
                    <span className={`course-card__tag ${courseCategoryClass(course.category)}`}>
                      {course.category}
                    </span>
                    {yt ? <span className="course-card__play" aria-hidden="true" /> : null}
                  </div>
                  <div className="course-card__body">
                    <h3 className="course-card__title">{course.title}</h3>
                    <p className="course-card__instructor">By {course.instructorName}</p>
                    <div className="course-card__meta">
                      <span>{formatInt(course.views)} views</span>
                      <span className="course-card__meta-dot">·</span>
                      <span>{formatInt(course.enrolledCount)} enrolled</span>
                    </div>
                    <p className="course-card__desc">{course.description}</p>
                    {action}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <HomePageFutter />

      {showJoinModal ? (
        <div className="course-modal-overlay" role="presentation" onClick={closeModal}>
          <div
            className="course-modal course-modal--compact"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="course-modal__head">
              <h2 id="course-modal-title">{active.title}</h2>
              <button type="button" className="course-modal__close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>
            <p className="course-modal__sub">
              Instructor: <strong>{active.instructorName}</strong>
            </p>
            <p className="course-modal__desc">{active.description}</p>
            <div className="course-modal__meta">
              <span>{formatInt(active.views)} views</span>
              <span className="course-card__meta-dot">·</span>
              <span>{formatInt(active.enrolledCount)} enrolled</span>
            </div>
            <div className="course-modal__enroll">
              <button
                type="button"
                className="course-modal__enroll-btn"
                onClick={handleEnroll}
                disabled={enrollBusy}
              >
                {enrollBusy ? 'Joining…' : 'Join course'}
              </button>
              {enrollError ? (
                <p className="course-modal__enroll-err" role="alert">
                  {enrollError}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
