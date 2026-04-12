import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { ImageUpload } from '../components/ImageUpload';
import './css-pages/InstructorUploadPage.css';

const API = `${import.meta.env.VITE_API_URL}/Courses`;

export function InstructorUploadPage() {
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    content: [{ type: 'heading', text: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [editStatus, setEditStatus] = useState(isEdit ? 'loading' : 'idle');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isEdit) {
      setEditStatus('idle');
      return;
    }
    if (user?.type !== 'Instructor' || !user?.id) {
      setEditStatus(user ? 'forbidden' : 'loading');
      return;
    }

    let cancelled = false;
    setEditStatus('loading');
    setMessage({ type: '', text: '' });

    fetch(`${API}/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error('notfound');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (String(data.instructorId) !== String(user.id)) {
          setEditStatus('forbidden');
          return;
        }
        setCourseData({
          title: data.title || '',
          category: data.category || '',
          description: data.description || '',
          videoUrl: data.videoUrl || '',
          thumbnail: data.thumbnail || '',
          content:
            Array.isArray(data.content) && data.content.length
              ? data.content
              : [{ type: 'heading', text: '' }],
        });
        setEditStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setEditStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [isEdit, courseId, user?.id, user?.type]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const updateBlock = (index, text) => {
    const newContent = [...courseData.content];
    newContent[index].text = text;
    setCourseData({ ...courseData, content: newContent });
  };

  const addBlock = (type) => {
    setCourseData({
      ...courseData,
      content: [...courseData.content, { type, text: '' }],
    });
  };

  const removeBlock = (index) => {
    if (courseData.content.length === 1) return;
    const newContent = courseData.content.filter((_, i) => i !== index);
    setCourseData({ ...courseData, content: newContent });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEdit) {
        const res = await fetch(`${API}/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title: courseData.title,
            category: courseData.category,
            description: courseData.description,
            videoUrl: courseData.videoUrl,
            thumbnail: courseData.thumbnail,
            content: courseData.content,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update course');
        }
        setMessage({ type: 'success', text: 'Course updated. Redirecting…' });
        setTimeout(() => navigate(`/instructor-course/${courseId}`), 1200);
      } else {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...courseData,
            instructorId: user.id,
            instructorName: user.name,
          }),
        });
        if (res.ok) {
          setMessage({ type: 'success', text: 'Course uploaded successfully! Redirecting...' });
          setTimeout(() => navigate('/courses'), 2000);
        } else {
          const err = await res.json();
          throw new Error(err.error || 'Failed to upload course');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (user?.type !== 'Instructor') {
    return (
      <div className="upload-access-denied">
        <Header />
        <div className="denied-box">
          <h2>Access Denied</h2>
          <p>Only verified Instructors can upload course content.</p>
          <button type="button" onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (isEdit && editStatus === 'loading') {
    return (
      <div className="upload-page-wrapper">
        <Header />
        <main className="upload-container">
          <p className="upload-loading-msg">Loading course for editing…</p>
        </main>
        <HomePageFutter />
      </div>
    );
  }

  if (isEdit && editStatus === 'forbidden') {
    return (
      <div className="upload-access-denied">
        <Header />
        <div className="denied-box">
          <h2>Cannot edit this course</h2>
          <p>You can only edit courses you created.</p>
          <Link to="/My-Dashboard">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  if (isEdit && editStatus === 'error') {
    return (
      <div className="upload-access-denied">
        <Header />
        <div className="denied-box">
          <h2>Course not found</h2>
          <p>This course may have been removed.</p>
          <Link to="/courses">Back to courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page-wrapper">
      <Header />
      <main className="upload-container">
        <header className="upload-header">
          <h1>{isEdit ? 'Edit course' : 'Publish New Course'}</h1>
          <p>
            {isEdit
              ? 'Update your catalog listing, outline, and video link. Only you can save changes to this course.'
              : 'Share your knowledge with thousands of learners.'}
          </p>
          {isEdit ? (
            <p className="upload-header__subnav">
              <Link to={`/instructor-course/${courseId}`}>← View course classroom</Link>
              {' · '}
              <Link to="/My-Dashboard">Dashboard</Link>
            </p>
          ) : null}
        </header>

        <form className="upload-form" onSubmit={handleSubmit}>
          {message.text ? (
            <div className={`form-message ${message.type}`}>{message.text}</div>
          ) : null}

          <section className="form-section">
            <h3>Course Overview</h3>
            <div className="form-group">
              <label>Course Title</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                placeholder="e.g., Master the Art of Intraday Trading"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={courseData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="Finance">Finance</option>
                  <option value="Investing">Investing</option>
                  <option value="Trading">Trading</option>
                  <option value="IPO">IPO</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
              <ImageUpload
                label="Course Thumbnail"
                initialImage={courseData.thumbnail}
                onUploadSuccess={(url) => setCourseData({ ...courseData, thumbnail: url })}
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleChange}
                rows="3"
                placeholder="A brief summary of what students will learn..."
                required
              />
            </div>
          </section>

          <section className="form-section">
            <h3>Course Content (Written)</h3>
            <p className="section-hint">
              Structure your course with headings and paragraphs just like official documentation.
            </p>

            <div className="blocks-editor">
              {courseData.content.map((block, index) => (
                <div key={index} className={`edit-block edit-block--${block.type}`}>
                  <div className="block-controls">
                    <span className="block-label">{block.type === 'heading' ? 'H' : 'P'}</span>
                    <button type="button" className="remove-block" onClick={() => removeBlock(index)}>
                      ×
                    </button>
                  </div>
                  {block.type === 'heading' ? (
                    <input
                      type="text"
                      value={block.text}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      placeholder="Enter heading..."
                    />
                  ) : (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      placeholder="Start writing paragraph content..."
                      rows="4"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="editor-actions">
              <button type="button" className="add-block-btn" onClick={() => addBlock('heading')}>
                + Add Heading
              </button>
              <button type="button" className="add-block-btn" onClick={() => addBlock('paragraph')}>
                + Add Paragraph
              </button>
            </div>
          </section>

          <section className="form-section">
            <h3>Video Integration</h3>
            <div className="form-group">
              <label>Video URL (YouTube / Vimeo / direct link)</label>
              <input
                type="text"
                name="videoUrl"
                value={courseData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtu.be/..."
              />
              <small>Used as the primary lesson video (L1) in the course classroom.</small>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Publish Course'}
            </button>
          </div>
        </form>
      </main>
      <HomePageFutter />
    </div>
  );
}
