import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './searchbar.css';

function SearchBar({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="searchbar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search for teas..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <i className="fas fa-search search-icon"></i>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(product => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="search-result-item"
            >
              <img src={product.image} alt={product.name} className="search-result-image" />
              <div className="search-result-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {searchTerm && searchResults.length === 0 && (
        <div className="no-results">
          No products found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default SearchBar;
