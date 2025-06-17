import React, { useState } from 'react';
import './TeaFilter.css';

function TeaFilter({ filters, setFilters }) {
  const [isVisible, setIsVisible] = useState(false);
  const handleTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type === type ? '' : type
    }));
  };

  const handlePriceChange = (priceRange) => {
    setFilters(prev => ({
      ...prev,
      price: prev.price === priceRange ? '' : priceRange
    }));
  };

  const handlePopularityChange = (popularity) => {
    setFilters(prev => ({
      ...prev,
      popularity: prev.popularity === popularity ? '' : popularity
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      price: '',
      popularity: ''
    });
  };

  return (
    <>
      <div className="filter-toggle-container">
        <button 
          className={`filter-toggle-btn ${isVisible ? 'active' : ''}`} 
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Hide Filters' : 'Show Filters'} 🍵
        </button>
        {(filters.type || filters.price || filters.popularity) && (
          <button className="clear-filters-btn filter-toggle-clear" onClick={handleClearFilters}>Clear All</button>
        )}
      </div>
      <div className={`tea-filter-container ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="filter-header">
          <h3>Filter By</h3>
          {(filters.type || filters.price || filters.popularity) && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>Clear All</button>
          )}
        </div>

      <div className="filter-section">
        <h4>Tea Type</h4>
        <div className="filter-options">
          <button 
            className={`filter-btn ${filters.type === 'black' ? 'active' : ''}`}
            onClick={() => handleTypeChange('black')}
          >
            Black
          </button>
          <button 
            className={`filter-btn ${filters.type === 'green' ? 'active' : ''}`}
            onClick={() => handleTypeChange('green')}
          >
            Green
          </button>
          <button 
            className={`filter-btn ${filters.type === 'white' ? 'active' : ''}`}
            onClick={() => handleTypeChange('white')}
          >
            White
          </button>
          <button 
            className={`filter-btn ${filters.type === 'oolong' ? 'active' : ''}`}
            onClick={() => handleTypeChange('oolong')}
          >
            Oolong
          </button>
          <button 
            className={`filter-btn ${filters.type === 'herbal' ? 'active' : ''}`}
            onClick={() => handleTypeChange('herbal')}
          >
            Herbal
          </button>
          <button 
            className={`filter-btn ${filters.type === 'blend' ? 'active' : ''}`}
            onClick={() => handleTypeChange('blend')}
          >
            Blend
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Price</h4>
        <div className="filter-options">
          <button 
            className={`filter-btn ${filters.price === 'low' ? 'active' : ''}`}
            onClick={() => handlePriceChange('low')}
          >
            Under $10
          </button>
          <button 
            className={`filter-btn ${filters.price === 'medium' ? 'active' : ''}`}
            onClick={() => handlePriceChange('medium')}
          >
            $10 - $15
          </button>
          <button 
            className={`filter-btn ${filters.price === 'high' ? 'active' : ''}`}
            onClick={() => handlePriceChange('high')}
          >
            Over $15
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Popularity</h4>
        <div className="filter-options">
          <button 
            className={`filter-btn ${filters.popularity === 'high' ? 'active' : ''}`}
            onClick={() => handlePopularityChange('high')}
          >
            Most Popular
          </button>
          <button 
            className={`filter-btn ${filters.popularity === 'medium' ? 'active' : ''}`}
            onClick={() => handlePopularityChange('medium')}
          >
            Popular
          </button>
          <button 
            className={`filter-btn ${filters.popularity === 'low' ? 'active' : ''}`}
            onClick={() => handlePopularityChange('low')}
          >
            New Arrivals
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default TeaFilter;
