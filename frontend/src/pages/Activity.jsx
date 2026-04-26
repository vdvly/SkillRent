import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import '../styles/global.css';

export default function Activity() {
  const [userActivity, setUserActivity] = useState([]);
  const [allActivity, setAllActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('user');
  const { request } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      setLoading(true);

      if (user) {
        const [userActRes, userStatsRes, allActRes, platformStatsRes] = await Promise.all([
          request('/api/activity/user', 'GET'),
          request('/api/activity/user/stats', 'GET'),
          request('/api/activity', 'GET'),
          request('/api/activity/platform/stats', 'GET'),
        ]);

        setUserActivity(userActRes || []);
        setStats(userStatsRes);
        setAllActivity(allActRes || []);
        setPlatformStats(platformStatsRes);
      } else {
        const [allActRes, platformStatsRes] = await Promise.all([
          request('/api/activity', 'GET'),
          request('/api/activity/platform/stats', 'GET'),
        ]);

        setAllActivity(allActRes || []);
        setPlatformStats(platformStatsRes);
      }
    } catch (err) {
      console.error('Failed to load activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    const icons = {
      created_service: '💼',
      posted_request: '📝',
      sent_message: '💬',
      left_review: '⭐',
      made_payment: '💳',
      updated_profile: '👤',
    };
    return icons[action] || '📌';
  };

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 Activity Log</h1>

      {/* Platform Stats */}
      {platformStats && (
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          <h2>📈 Platform Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Total Activities</p>
              <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
                {platformStats.totalActivities || 0}
              </p>
            </div>
            {platformStats.breakdown &&
              Object.entries(platformStats.breakdown).slice(0, 3).map(([action, count]) => (
                <div
                  key={action}
                  style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    {getActivityIcon(action)} {action.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <p style={{ margin: '10px 0', fontSize: '24px', fontWeight: 'bold' }}>{count}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* User Section */}
      {user && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('user')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'user' ? '#4CAF50' : '#ddd',
                color: activeTab === 'user' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              👤 My Activity
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'all' ? '#4CAF50' : '#ddd',
                color: activeTab === 'all' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🌍 All Activity
            </button>
          </div>

          {activeTab === 'user' && (
            <div>
              <h2>Your Activity Stats</h2>
              {stats && (
                <div
                  style={{
                    backgroundColor: '#f9f9f9',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <p>
                    <strong>Total Activities:</strong> {stats.totalActivities}
                  </p>
                  {stats.breakdown &&
                    Object.entries(stats.breakdown).map(([action, count]) => (
                      <p key={action}>
                        {getActivityIcon(action)} <strong>{action.replace(/_/g, ' ').toUpperCase()}:</strong> {count}
                      </p>
                    ))}
                </div>
              )}

              <h3>Recent Activity</h3>
              {userActivity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {userActivity.slice(0, 20).map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{getActivityIcon(activity.action)}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>
                          {activity.action.replace(/_/g, ' ').charAt(0).toUpperCase() +
                            activity.action.replace(/_/g, ' ').slice(1)}
                        </p>
                        {activity.description && (
                          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>No activity yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Activity (visible to all) */}
      {(activeTab === 'all' || !user) && (
        <div>
          <h2>🌍 Platform Activity</h2>
          {allActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allActivity.slice(0, 30).map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{getActivityIcon(activity.action)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>
                      {activity.action.replace(/_/g, ' ').charAt(0).toUpperCase() +
                        activity.action.replace(/_/g, ' ').slice(1)}
                    </p>
                    {activity.description && (
                      <p style={{ margin: '3px 0 0 0', color: '#666', fontSize: '12px' }}>
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#999', fontSize: '11px' }}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No activity to display</p>
          )}
        </div>
      )}
    </div>
  );
}
