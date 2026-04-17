import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CourseMarquee.css';

export function CourseMarquee() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/Courses`);
        if (res.ok) {
          const data = await res.json();
          // Duplicate the courses multiple times to ensure seamless scrolling
          const clones = Array(10).fill(data).flat();
          setCourses(clones);
        }
      } catch (err) {
        console.error('Failed to fetch courses for marquee', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading || courses.length === 0) return null;

  return (
    <section className="course-marquee" id="course-marquee-section">
      <div className="course-marquee__header">
        <div className="course-marquee__badge">Courses for you</div>
      </div>

      <div className="course-marquee__container">
        <div className="course-marquee__track">
          {courses.map((course, index) => (
            <Link
              key={`${course._id}-${index}`}
              to={`/course/${course._id}`}
              className="course-marquee__card"
            >
              <div className="course-marquee__card-image">
                <img src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course+Image'} alt={course.title} />
                <div className="course-marquee__card-overlay" />
              </div>
              <div className="course-marquee__card-content">
                <span className="course-marquee__card-category">{course.category || 'Trading'}</span>
                <h3 className="course-marquee__card-title">{course.title}</h3>
                <div className="course-marquee__card-footer">
                  <span className="course-marquee__card-instructor">{course.instructorName}</span>
                  <div className="course-marquee__card-stats">
                    <span className="course-marquee__card-enrolled">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {course.enrolledCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
