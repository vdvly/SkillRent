import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import '../styles/global.css';

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { request } = useApi();

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, reputationRes, servicesRes, reviewsRes] = await Promise.all([
        request(`/users/profile/${userId}`, 'GET'),
        request(`/users/${userId}/reputation`, 'GET'),
        request(`/users/${userId}/services`, 'GET'),
        request(`/users/${userId}/reviews`, 'GET'),
      ]);

      setProfile(profileRes);
      setReputation(reputationRes);
      setServices(servicesRes);
      setReviews(reviewsRes);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!profile)
    return <div style={{ padding: '20px' }}>User not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <img
          src={profile.profilePicture || 'https://via.placeholder.com/120'}
          alt="profile"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 10px 0' }}>{profile.name}</h1>

          {/* Reputation Badge */}
          {reputation && (
            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '5px 0' }}>
                ⭐ <strong>Rating:</strong> {reputation.averageRating}/5.0
              </p>
              <p style={{ margin: '5px 0' }}>
                📝 <strong>Reviews:</strong> {reputation.totalReviews}
              </p>
            </div>
          )}

          {profile.bio && <p style={{ color: '#666', marginBottom: '10px' }}>{profile.bio}</p>}

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '15px',
            }}
          >
            <div>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Services Offered
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>
                {profile.servicesCount || 0}
              </p>
            </div>
            <div>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Requests Posted
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>
                {profile.requestsCount || 0}
              </p>
            </div>
            <div>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Reviews Received
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>
                {profile.reviewsCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'overview' ? '#4CAF50' : 'transparent',
              color: activeTab === 'overview' ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
            }}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setActiveTab('services')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'services' ? '#4CAF50' : 'transparent',
              color: activeTab === 'services' ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'services' ? 'bold' : 'normal',
            }}
          >
            💼 Services
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'reviews' ? '#4CAF50' : 'transparent',
              color: activeTab === 'reviews' ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'reviews' ? 'bold' : 'normal',
            }}
          >
            ⭐ Reviews
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && reputation && (
          <div style={{ marginTop: '20px' }}>
            <h2>User Reputation</h2>
            <div
              style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <p>
                <strong>Overall Rating:</strong> {reputation.averageRating}/5.0
              </p>
              <p>
                <strong>Total Reviews:</strong> {reputation.totalReviews}
              </p>
              <p>
                <strong>Member Since:</strong>{' '}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div style={{ marginTop: '20px' }}>
            <h2>Services Offered ({services.length})</h2>
            {services.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '15px',
                }}
              >
                {services.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '8px',
                    }}
                  >
                    <h4 style={{ margin: '0 0 10px 0' }}>{service.title}</h4>
                    <p style={{ color: '#666', marginBottom: '10px' }}>
                      {service.description?.substring(0, 60)}...
                    </p>
                    <p>
                      <strong>Price:</strong> ${service.price}
                    </p>
                    <p>
                      <strong>Category:</strong> {service.category}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No services listed yet</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ marginTop: '20px' }}>
            <h2>Reviews ({reviews.length})</h2>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}
                    >
                      <strong>{review.reviewer?.name}</strong>
                      <span style={{ color: '#ff9800', fontWeight: 'bold' }}>
                        {'⭐'.repeat(review.rating)}
                      </span>
                    </div>
                    <p style={{ margin: '0', color: '#666' }}>
                      {review.comment || 'No comment provided'}
                    </p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#999' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No reviews yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
