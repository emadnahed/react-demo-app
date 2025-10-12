import React from 'react';
import useFetch from '../hooks/useFetch';
import './CatGallery.css';

const CatGallery = () => {
  const { data: cats, loading, error } = useFetch('https://api.thecatapi.com/v1/images/search?limit=9');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cute cats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>😿 Oops! Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <div className="cat-gallery">
      <h2>🐱 Cat Gallery</h2>
      <div className="cat-grid">
        {cats && cats.map((cat) => (
          <div key={cat.id} className="cat-card">
            <img 
              src={cat.url} 
              alt="A cute cat" 
              className="cat-image"
              loading="lazy"
            />
            <div className="cat-details">
              <span>Breed: {cat.breeds?.[0]?.name || 'Unknown'}</span>
              <span>Temperament: {cat.breeds?.[0]?.temperament || 'Not specified'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatGallery;
