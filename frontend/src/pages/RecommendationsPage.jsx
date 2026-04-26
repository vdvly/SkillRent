import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import '../styles/global.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedRequests, setRecommendedRequests] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const { request } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      if (user) {
        // Load personalized recommendations for authenticated users
        const [servicesRes, requestsRes, trendingRes] = await Promise.all([
          request('/api/recommendations', 'GET'),
          request('/api/recommendations/requests', 'GET'),
          request('/api/recommendations/trending', 'GET'),
        ]);

        setRecommendations(servicesRes.recommendations || []);
        setRecommendedRequests(servicesRes.recommendations || []);
        setTrending(trendingRes.trending || []);
      } else {
        // Load trending for anonymous users
        const trendingRes = await request('/api/recommendations/trending', 'GET');
        setTrending(trendingRes.trending || []);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const RecommendationCard = ({ item, type }) => (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3>{item.title}</h3>
      <p style={{ color: '#666' }}>{item.description?.substring(0, 80)}...</p>

      {type === 'service' && (
        <div>
          <p>
            💰 <strong>${item.price}</strong>
          </p>
          <p>
            🏷️ <strong>{item.category}</strong>
          </p>
        </div>
      )}

      {type === 'request' && (
        <div>
          <p>
            💰 Budget: <strong>${item.budget}</strong>
          </p>
          <p>
            ⏱️ Urgency: <strong>{item.urgency}</strong>
          </p>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <p>
          👤{' '}
          <strong>
            {item.owner?.name || item.requester?.name || 'Anonymous'}
          </strong>
        </p>
        <p>
          ⭐{' '}
          <strong>
            {item.owner?.averageRating || item.requester?.averageRating || 'N/A'}
          </strong>
        </p>
      </div>

      <button
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '10px',
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
  );

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>✨ Recommendations</h1>

      {user && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('services')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'services' ? '#4CAF50' : '#ddd',
                color: activeTab === 'services' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              📋 Services For You
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'requests' ? '#4CAF50' : '#ddd',
                color: activeTab === 'requests' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              📝 Requests For You
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'trending' ? '#4CAF50' : '#ddd',
                color: activeTab === 'trending' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🔥 Trending
            </button>
          </div>

          {activeTab === 'services' && recommendations.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {recommendations.map((service) => (
                <RecommendationCard
                  key={service.id}
                  item={service}
                  type="service"
                />
              ))}
            </div>
          )}

          {activeTab === 'requests' && recommendedRequests.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {recommendedRequests.map((request) => (
                <RecommendationCard
                  key={request.id}
                  item={request}
                  type="request"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trending Services (visible to all) */}
      {(activeTab === 'trending' || !user) && (
        <div>
          <h2>🔥 Trending Services</h2>
          {trending.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {trending.map((service) => (
                <RecommendationCard
                  key={service.id}
                  item={service}
                  type="service"
                />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>
              No trending services at the moment.
            </p>
          )}
        </div>
      )}

      {!user && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
          👤 <a href="/login">Sign in</a> to get personalized recommendations
        </p>
      )}
    </div>
  );
}
