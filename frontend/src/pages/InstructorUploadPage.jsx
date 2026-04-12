import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { ImageUpload } from '../components/ImageUpload';
import './css-pages/InstructorUploadPage.css';

export function InstructorUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    content: [{ type: 'heading', text: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      content: [...courseData.content, { type, text: '' }]
    });
  };

  const removeBlock = (index) => {
    if (courseData.content.length === 1) return; // Keep at least one block
    const newContent = courseData.content.filter((_, i) => i !== index);
    setCourseData({ ...courseData, content: newContent });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:5000/Courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...courseData,
          instructorId: user.id,
          instructorName: user.name
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Course uploaded successfully! Redirecting...' });
        setTimeout(() => navigate('/courses'), 2000);
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload course');
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
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page-wrapper">
      <Header />
      <main className="upload-container">
        <header className="upload-header">
          <h1>Publish New Course</h1>
          <p>Share your knowledge with thousands of learners.</p>
        </header>

        <form className="upload-form" onSubmit={handleSubmit}>
          {message.text && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

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
              ></textarea>
            </div>
          </section>

          <section className="form-section">
            <h3>Course Content (Written)</h3>
            <p className="section-hint">Structure your course with headings and paragraphs just like official documentation.</p>
            
            <div className="blocks-editor">
              {courseData.content.map((block, index) => (
                <div key={index} className={`edit-block edit-block--${block.type}`}>
                  <div className="block-controls">
                    <span className="block-label">{block.type === 'heading' ? 'H' : 'P'}</span>
                    <button type="button" className="remove-block" onClick={() => removeBlock(index)}>×</button>
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
                    ></textarea>
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
              <label>Video URL (S3 / YouTube/ Vimeo)</label>
              <input
                type="text"
                name="videoUrl"
                value={courseData.videoUrl}
                onChange={handleChange}
                placeholder="Currently disabled - Leave empty for S3 integration later"
                disabled
              />
              <small>Video capabilities will be enabled once S3 storage is connected.</small>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Course'}
            </button>
          </div>
        </form>
      </main>
      <HomePageFutter />
    </div>
  );
}
