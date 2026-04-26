import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { Loading } from '../components/Loading';

export function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAllServices(skip, 20);
        setServices(response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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
        <h1>Services</h1>
        <Link to="/services/create" className="btn btn-primary">
          + Create Service
        </Link>
      </div>

      <div className="grid grid-3">
        {services.data.map((service) => (
          <div key={service.id} className="card">
            <h3>{service.title}</h3>
            <p className="text-sm text-muted mb-2">{service.description}</p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${service.price}
              </span>
              <span className="badge badge-primary">
                {service.owner.name}
              </span>
            </div>
            <Link to={`/services/${service.id}`} className="btn btn-sm btn-primary">
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
