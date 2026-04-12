import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './css-pages/DocumentationPage.css';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';

export function DocumentationPage() {
  const location = useLocation();
  const [structure, setStructure] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null); // { category: '...', file: '...' }
  const [docContent, setDocContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const file = params.get('file');
    if (cat && file) {
      setActiveDoc({ category: cat, file });
    }
  }, [location.search, setActiveDoc]);

  // Fetch structure
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/docs/structure`)
      .then(res => res.json())
      .then(data => setStructure(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load documentation structure.');
      });
  }, []);

  // Compute flattened list of docs for next/prev navigation
  const flatDocs = useMemo(() => {
    return structure.flatMap(c => c.files.map(f => ({ category: c.category, file: f })));
  }, [structure]);

  const currentIndex = useMemo(() => {
    if (!activeDoc) return -1;
    return flatDocs.findIndex(d => d.category === activeDoc.category && d.file === activeDoc.file);
  }, [activeDoc, flatDocs]);

  // Determine Table of Contents from active document
  const toc = useMemo(() => {
    if (!docContent || !docContent.content) return [];
    return docContent.content.filter(block => block.type === 'heading').map(b => b.text);
  }, [docContent]);

  const scrollToHeading = (text) => {
    const id = text.replace(/\s+/g, '-').toLowerCase();
    const element = document.getElementById(id);
    if (element) {
      // offset by header height roughly
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Change active doc and scroll top
  const handleNavClick = (doc) => {
    setActiveDoc(doc);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Fetch content when topic changes
  useEffect(() => {
    if (!activeDoc) return;

    setLoadingContent(true);
    fetch(`${import.meta.env.VITE_API_URL}/docs/content/${activeDoc.category}/${activeDoc.file}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load document');
        return res.json();
      })
      .then(data => {
        setDocContent(data);
        // Defer scroll reset until DOM paints the new content
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
      })
      .catch(err => {
        console.error(err);
        setDocContent(null);
      })
      .finally(() => {
        setLoadingContent(false);
      });
  }, [activeDoc]);

  return (
    <>
      <Header />
      <div className="docs-layout">

        {/* LEFT SIDEBAR (Navigation) */}
        <div className={`docs-sidebar docs-sidebar-left ${!sidebarOpen ? 'docs-sidebar--closed' : ''}`}>
          <div className="docs-sidebar-header">
            <h2>User Guide</h2>
            {/* Desktop hide button inside sidebar */}
            <button className="docs-toggle-btn-inner" onClick={() => setSidebarOpen(false)} title="Hide Sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          </div>
          {error && <p className="docs-error">{error}</p>}

          {structure.length === 0 && !error ? (
            <p className="docs-loading-text">Loading guide...</p>
          ) : (
            <div className="docs-nav-tree">
              {structure.map(categoryObj => (
                <div key={categoryObj.category} className="docs-category">
                  <div className="docs-cat-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    {categoryObj.category.replace(/_/g, ' ')}
                  </div>
                  <ul className="docs-files">
                    {categoryObj.files.map(file => (
                      <li
                        key={file}
                        className={`docs-file-item ${activeDoc?.category === categoryObj.category && activeDoc?.file === file ? 'active' : ''}`}
                        onClick={() => handleNavClick({ category: categoryObj.category, file })}
                      >
                        {file.replace(/_/g, ' ')}
                      </li>
                    ))}
                    {categoryObj.files.length === 0 && (
                      <li className="docs-file-empty">Empty</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MIDDLE CONTENT PANE */}
        <div className={`docs-main-content ${!sidebarOpen ? 'docs-main--expanded' : ''}`}>

          {/* Unhide button when sidebar is closed */}
          {!sidebarOpen && (
            <button className="docs-toggle-btn-outer" onClick={() => setSidebarOpen(true)} title="Show Sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          )}

          <div className="docs-center-container">
            <div className="docs-reader" key={activeDoc ? activeDoc.file : 'empty'}>
              {!activeDoc ? (
                <div className="docs-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  <h3>Select a guide</h3>
                  <p>Choose a topic from the left sidebar to begin.</p>
                </div>
              ) : loadingContent ? (
                <div className="docs-empty">
                  <div className="docs-spinner"></div>
                  <p>Loading content...</p>
                </div>
              ) : docContent ? (
                <div className="docs-article-wrapper">
                  {/* BREADCRUMBS */}
                  <div className="docs-breadcrumbs">
                    Documentation &gt; {activeDoc.category.replace(/_/g, ' ')} &gt; <span>{activeDoc.file.replace(/_/g, ' ')}</span>
                  </div>

                  <h1 className="docs-reader-title">{docContent.title}</h1>

                  {/* ACTUAL CONTENT */}
                  <div className="docs-reader-body">
                    {docContent.content.map((block, idx) => {
                      if (block.type === 'heading') {
                        const headingId = block.text.replace(/\s+/g, '-').toLowerCase();
                        return <h2 id={headingId} key={idx} className="docs-block-heading">{block.text}</h2>;
                      }
                      if (block.type === 'paragraph') {
                        return <p key={idx} className="docs-block-paragraph">{block.text}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ) : (
                <div className="docs-empty">
                  <p style={{ color: 'red' }}>Error loading document content.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (On this page) */}
        {activeDoc && docContent && (
          <div className="docs-sidebar docs-sidebar-right">
            <div className="docs-toc-section">
              <h3 className="docs-right-header">On this page</h3>
              <ul className="docs-toc-list">
                {toc.map((heading, idx) => (
                  <li key={idx} onClick={() => scrollToHeading(heading)}>{heading}</li>
                ))}
                {toc.length === 0 && <li className="docs-toc-empty">No headings</li>}
              </ul>
            </div>

            <div className="docs-related-section">
              <h3 className="docs-right-header">Related resources</h3>
              <ul className="docs-related-list">
                {flatDocs.slice(Math.max(0, currentIndex - 1), currentIndex + 3).map((d, i) => {
                  if (d.file === activeDoc.file) return null;
                  return (
                    <li key={i} onClick={() => handleNavClick(d)}>
                      {d.file.replace(/_/g, ' ')} Guide
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* Full-width footer below layout */}
      <HomePageFutter />
    </>
  );
}
