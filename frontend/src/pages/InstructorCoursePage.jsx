import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { extractYoutubeId } from '../utils/youtube';
import { courseCategoryClass } from '../utils/courseCategoryClass';
import './css-pages/InstructorCoursePage.css';

const API = `${import.meta.env.VITE_API_URL}/Courses`;

function buildLessons(course) {
  const lessons = [];
  let cur = null;
  for (const block of course.content || []) {
    if (block.type === 'heading') {
      if (cur) lessons.push(cur);
      cur = { title: block.text, paragraphs: [] };
    } else if (block.type === 'paragraph' && cur) {
      cur.paragraphs.push(block.text);
    }
  }
  if (cur) lessons.push(cur);

  const mainVid = extractYoutubeId(course.videoUrl);
  if (lessons.length === 0) {
    return [
      {
        title: `L1 — ${course.title}`,
        paragraphs: [course.description],
        videoId: mainVid,
      },
    ];
  }
  return lessons.map((L, i) => ({
    ...L,
    videoId: i === 0 ? mainVid : null,
  }));
}

export function InstructorCoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [tab, setTab] = useState('video');
  const [joinBusy, setJoinBusy] = useState(false);
  const viewedRef = useRef(false);

  const lessons = useMemo(() => (course ? buildLessons(course) : []), [course]);
  const activeLesson = lessons[lessonIdx] || null;

  useEffect(() => {
    setLessonIdx(0);
    setTab('video');
    viewedRef.current = false;
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoading(true);
    setError('');

    const q = user?.id ? `?userId=${encodeURIComponent(user.id)}` : '';
    fetch(`${API}/${courseId}${q}`)
      .then((res) => {
        if (!res.ok) throw new Error('notfound');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCourse(data);
      })
      .catch(() => {
        if (!cancelled) setError('Course not found or unavailable.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, user?.id]);

  useEffect(() => {
    if (!course?._id || viewedRef.current) return;
    const owner = user && String(course.instructorId) === String(user.id);
    const can = course.isEnrolled || owner;
    if (!can) return;
    viewedRef.current = true;
    fetch(`${API}/${course._id}/view`, { method: 'POST' }).catch(() => {});
  }, [course, user]);

  useEffect(() => {
    if (!activeLesson) return;
    if (activeLesson.videoId) setTab('video');
    else setTab('notes');
  }, [lessonIdx, activeLesson?.videoId]);

  const isOwner = Boolean(user && course && String(course.instructorId) === String(user.id));
  const canAccess = Boolean(course && (course.isEnrolled || isOwner));

  const handleJoin = async () => {
    if (!user?.id || !course?._id) {
      navigate('/login');
      return;
    }
    setJoinBusy(true);
    try {
      const res = await fetch(`${API}/${course._id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not enroll.');
        return;
      }
      const q = `?userId=${encodeURIComponent(user.id)}`;
      const refreshed = await fetch(`${API}/${course._id}${q}`).then((r) => r.json());
      setCourse(refreshed);
      setError('');
    } catch {
      setError('Server not reachable.');
    } finally {
      setJoinBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="ic-page">
        <Header />
        <div className="ic-loading">Loading course…</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="ic-page">
        <Header />
        <div className="ic-gate">
          <p>{error}</p>
          <Link to="/courses">Back to courses</Link>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="ic-page">
        <Header />
        <div className="ic-gate">
          <h1>{course?.title}</h1>
          <p className="ic-gate__lead">
            Enroll to open the full classroom layout, sidebar lectures, and video player.
          </p>
          {error ? (
            <p className="ic-gate__err" role="alert">
              {error}
            </p>
          ) : null}
          {!user ? (
            <Link className="ic-gate__btn" to="/login">
              Log in to enroll
            </Link>
          ) : (
            <button type="button" className="ic-gate__btn" onClick={handleJoin} disabled={joinBusy}>
              {joinBusy ? 'Joining…' : 'Join course'}
            </button>
          )}
          <p className="ic-gate__back">
            <Link to="/courses">← Back to catalog</Link>
          </p>
        </div>
      </div>
    );
  }

  const next = () => setLessonIdx((i) => Math.min(i + 1, lessons.length - 1));
  const prev = () => setLessonIdx((i) => Math.max(i - 1, 0));

  return (
    <div className="ic-page">
      <Header />
      <div className="ic-shell">
        <aside className="ic-sidebar" aria-label="Course outline">
          <div className="ic-sidebar__head">
            <span className="ic-sidebar__icon" aria-hidden="true">
              ≡
            </span>
            <span>Course details</span>
          </div>
          <div className="ic-sidebar__course">{course.title}</div>
          <div className="ic-sidebar__category">
            <span className={courseCategoryClass(course.category)}>{course.category}</span>
          </div>
          <nav className="ic-lessons">
            {lessons.map((L, i) => (
              <button
                key={`${L.title}-${i}`}
                type="button"
                className={`ic-lesson ${i === lessonIdx ? 'ic-lesson--active' : ''}`}
                onClick={() => setLessonIdx(i)}
              >
                <span className="ic-lesson__play" aria-hidden="true">
                  ▶
                </span>
                <span className="ic-lesson__text">{L.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="ic-main">
          <div className="ic-banner">
            <div className="ic-banner__brand">BrokenTrade</div>
            <div className="ic-banner__meta">
              <div className="ic-banner__course">{course.title}</div>
              <div className="ic-banner__inst">Instructor: {course.instructorName}</div>
            </div>
            {isOwner ? (
              <div className="ic-banner__actions">
                <Link className="ic-banner__edit" to={`/instructor/course/${course._id}/edit`}>
                  Edit course
                </Link>
              </div>
            ) : null}
          </div>

          <div className="ic-main__top">
            <h1 className="ic-lecture-title">{activeLesson?.title}</h1>
            <div className="ic-nav-lectures">
              <button type="button" className="ic-nav-btn" onClick={prev} disabled={lessonIdx === 0}>
                ← Prev
              </button>
              <button
                type="button"
                className="ic-nav-btn ic-nav-btn--next"
                onClick={next}
                disabled={lessonIdx >= lessons.length - 1}
              >
                Next lecture →
              </button>
            </div>
          </div>

          <div className="ic-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className={`ic-tab ${tab === 'video' ? 'ic-tab--on' : ''}`}
              onClick={() => setTab('video')}
              aria-selected={tab === 'video'}
            >
              Video
            </button>
            <button
              type="button"
              role="tab"
              className={`ic-tab ${tab === 'notes' ? 'ic-tab--on' : ''}`}
              onClick={() => setTab('notes')}
              aria-selected={tab === 'notes'}
            >
              Notes
            </button>
          </div>

          {tab === 'video' ? (
            <div className="ic-panel">
              {activeLesson?.videoId ? (
                <div className="ic-embed">
                  <iframe
                    title={activeLesson.title}
                    src={`https://www.youtube.com/embed/${activeLesson.videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="ic-panel__empty">No video is attached to this lecture. Switch to the Notes tab.</p>
              )}
            </div>
          ) : (
            <div className="ic-panel ic-panel--notes">
              {(activeLesson?.paragraphs || []).map((p, i) => (
                <p key={i} className="ic-note-para">
                  {p}
                </p>
              ))}
            </div>
          )}

          <p className="ic-foot">
            <Link to="/courses">← Back to courses</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
