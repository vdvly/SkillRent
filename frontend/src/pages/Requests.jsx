import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsAPI } from '../services/api';
import { Loading } from '../components/Loading';

export function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestsAPI.getAllRequests(skip, 20);
        setRequests(response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchRequests();
  }, [skip]);

  if (loading) return <Loading />;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <h1>Service Requests</h1>
        <Link to="/requests/create" className="btn btn-primary">
          + Create Request
        </Link>
      </div>

      <div className="grid grid-3">
        {requests.map((request) => (
          <div key={request.id} className="card">
            <h3>{request.title}</h3>
            <p className="text-sm text-muted mb-2">{request.description}</p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${request.budget}
              </span>
              <span className="badge badge-primary">
                {request.requester.name}
              </span>
            </div>
            <Link to={`/requests/${request.id}`} className="btn btn-sm btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '2rem',
      }}>
        <button
          onClick={() => setSkip(Math.max(0, skip - 20))}
          disabled={skip === 0}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <button
          onClick={() => setSkip(skip + 20)}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}
