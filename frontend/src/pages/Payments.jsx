import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import '../styles/global.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { request } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [paymentsRes, statsRes] = await Promise.all([
        request('/api/payments', 'GET'),
        request('/api/payments/stats', 'GET'),
      ]);

      setPayments(paymentsRes.data || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setMessage('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        currency: formData.currency,
      };

      const response = await request('/api/payments', 'POST', payload);

      setMessage(`✅ Payment processed! Status: ${response.status}`);
      setFormData({ amount: '', description: '', currency: 'USD' });
      setShowForm(false);

      // Reload payments
      setTimeout(loadPayments, 1000);
    } catch (err) {
      setMessage('❌ Failed to process payment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'failed':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '•';
    }
  };

  if (loading && !stats) return <Loading />;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>💳 Payments & Billing</h1>

      {/* Stats */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>TOTAL SPENT</p>
            <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
              ${stats.totalSpent?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>COMPLETED</p>
            <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
              {stats.completedPayments || 0}
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>PENDING</p>
            <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>
              {stats.pendingPayments || 0}
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>FAILED</p>
            <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>
              {stats.failedPayments || 0}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: message.includes('❌') ? '#ffebee' : '#e8f5e9',
            border: `1px solid ${message.includes('❌') ? '#f44336' : '#4CAF50'}`,
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}

      {/* Create Payment Button */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {showForm ? '❌ Cancel' : '➕ New Payment'}
        </button>

        {showForm && (
          <form
            onSubmit={handleCreatePayment}
            style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Amount</strong>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
                placeholder="0.00"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Currency</strong>
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Description (Optional)</strong>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
                placeholder="Add payment details..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 20px',
                backgroundColor: submitting ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Processing...' : 'Process Payment'}
            </button>
          </form>
        )}
      </div>

      {/* Payment History */}
      <h2>Payment History</h2>
      {payments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {payments.map((payment) => (
            <div
              key={payment.id}
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  {payment.description || 'Payment'}
                </p>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                  {new Date(payment.createdAt).toLocaleDateString()}{' '}
                  {new Date(payment.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    margin: '0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#4CAF50',
                  }}
                >
                  ${payment.amount.toFixed(2)} {payment.currency}
                </p>
                <p
                  style={{
                    margin: '5px 0 0 0',
                    color: getStatusColor(payment.status),
                    fontWeight: 'bold',
                  }}
                >
                  {getStatusIcon(payment.status)}{' '}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666' }}>No payments yet</p>
      )}
    </div>
  );
}
