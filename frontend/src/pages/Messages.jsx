import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { messagesAPI } from '../services/api';
import { Loading } from '../components/Loading';

export function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const response = await messagesAPI.getReceivedMessages();
        setMessages(response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  if (loading) return <Loading />;

  if (!user) return <div>Please log in to view messages</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="mb-3">Messages</h1>

      {messages.length === 0 ? (
        <div className="card text-center">
          <p>No messages yet</p>
        </div>
      ) : (
        <div>
          {messages.map((message) => (
            <div key={message.id} className="card mb-2">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}>
                <strong>{message.sender.name}</strong>
                <span className="text-sm text-muted">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{message.content}</p>
              {!message.isRead && (
                <button
                  onClick={() => messagesAPI.markAsRead(message.id)}
                  className="btn btn-sm btn-primary"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
