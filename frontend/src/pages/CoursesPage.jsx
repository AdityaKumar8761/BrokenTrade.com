import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import './css-pages/CoursesPage.css';

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/Courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="courses-page-wrapper">
      <Header />
      <main className="courses-container">
        <header className="courses-header">
          <h1>Explore Professional Courses</h1>
          <p>Learn from industry experts and master the financial markets.</p>
        </header>

        {loading ? (
          <div className="courses-loading">
            <div className="spinner"></div>
            <p>Fetching courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="courses-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h3>No courses found yet.</h3>
            <p>Our instructors are currently building new content. Check back soon!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-card__thumb">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                  ) : (
                    <div className="course-card__placeholder">
                      {course.category}
                    </div>
                  )}
                  <span className="course-card__tag">{course.category}</span>
                </div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__instructor">By {course.instructorName}</p>
                  <p className="course-card__desc">{course.description}</p>
                  <button className="course-card__btn">Start Learning</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <HomePageFutter />
    </div>
  );
}
