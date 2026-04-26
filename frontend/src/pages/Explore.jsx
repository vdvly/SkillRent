import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import '../styles/global.css';

export default function Explore() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [searchType, setSearchType] = useState('services'); // 'services' or 'requests'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { request } = useApi();

  const categories = [
    'CLEANING',
    'TUTORING',
    'REPAIR',
    'DESIGN',
    'WRITING',
    'PROGRAMMING',
    'MARKETING',
    'PHOTOGRAPHY',
    'VIDEO',
    'MUSIC',
    'OTHER',
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);

      const endpoint =
        searchType === 'services'
          ? `/api/search/services?${params.toString()}`
          : `/api/search/requests?${params.toString()}`;

      const response = await request(endpoint, 'GET');
      setResults(response.data || []);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔍 Explore Services & Requests</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Search Type: </label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ marginLeft: '10px', padding: '8px' }}
          >
            <option value="services">Services</option>
            <option value="requests">Requests</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search by keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        {searchType === 'services' && (
          <div style={{ marginBottom: '15px' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {loading && <Loading />}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div>
          <h2>Results ({results.length})</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {results.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <h3>{item.title}</h3>
                <p>{item.description?.substring(0, 100)}...</p>

                {searchType === 'services' && (
                  <div>
                    <p>
                      <strong>Price:</strong> ${item.price}
                    </p>
                    <p>
                      <strong>Category:</strong> {item.category}
                    </p>
                  </div>
                )}

                {searchType === 'requests' && (
                  <div>
                    <p>
                      <strong>Budget:</strong> ${item.budget}
                    </p>
                    <p>
                      <strong>Urgency:</strong> {item.urgency}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: '10px' }}>
                  <p>
                    <strong>Posted by:</strong> {item.owner?.name || item.requester?.name}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐{' '}
                    {item.owner?.averageRating || item.requester?.averageRating || 'N/A'}
                  </p>
                </div>

                <button
                  style={{
                    marginTop: '10px',
                    padding: '8px 15px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && keyword && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No results found. Try a different search.
        </p>
      )}
    </div>
  );
}
