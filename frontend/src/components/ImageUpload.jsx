import React, { useState, useRef } from 'react';
import './ImageUpload.css';

export function ImageUpload({ label, onUploadSuccess, initialImage }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialImage || '');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setPreview(data.imageUrl);
      if (onUploadSuccess) {
        onUploadSuccess(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      {label && <label className="image-upload-label">{label}</label>}
      <div
        className={`image-upload-dropzone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="image-upload-preview">
            <img src={preview} alt="Upload preview" />
            <div className="image-upload-overlay">
              <span>Change Image</span>
            </div>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <p>Drag & Drop or Click to Upload</p>
            <small>JPG, PNG, WebP (Max 5MB)</small>
          </div>
        )}

        {uploading && (
          <div className="image-upload-loader">
            <div className="loader-spinner"></div>
            <span>Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
