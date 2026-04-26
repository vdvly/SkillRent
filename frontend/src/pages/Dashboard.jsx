import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, requestsAPI } from '../services/api';
import { Loading } from '../components/Loading';

export function Dashboard() {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, requestsRes] = await Promise.all([
          servicesAPI.getAllServices(0, 6),
          requestsAPI.getAllRequests(0, 6),
        ]);
        setServices(servicesRes);
        setRequests(requestsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="mb-3">Welcome to SkillRent</h1>
      <p className="text-muted mb-3">
        Connect, offer services, and get things done
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/services/create" className="btn btn-primary">
          Offer a Service
        </Link>
        <Link to="/requests/create" className="btn btn-secondary">
          Create a Request
        </Link>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 className="mb-3">
          Recent Services{' '}
          <Link to="/services" style={{ fontSize: '0.875rem' }}>
            View All
          </Link>
        </h2>
        <div className="grid grid-3">
          {console.log(services.data)}
          {services.data.map((service) => (
            <div key={service.id} className="card">
              <h3>{service.title}</h3>
              <p className="text-sm text-muted mb-2">{service.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ${service.price}
                </span>
                <span className="text-sm text-muted">{service.owner.name}</span>
              </div>
              <Link to={`/services/${service.id}`} className="btn btn-sm btn-primary" style={{ marginTop: '1rem' }}>
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3">
          Recent Requests{' '}
          <Link to="/requests" style={{ fontSize: '0.875rem' }}>
            View All
          </Link>
        </h2>
        <div className="grid grid-3">
          {requests.data.map((request) => (
            <div key={request.id} className="card">
              <h3>{request.title}</h3>
              <p className="text-sm text-muted mb-2">{request.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ${request.budget}
                </span>
                <span className="text-sm text-muted">
                  {request.requester.name}
                </span>
              </div>
              <Link to={`/requests/${request.id}`} className="btn btn-sm btn-primary" style={{ marginTop: '1rem' }}>
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
