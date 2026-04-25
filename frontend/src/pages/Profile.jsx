import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usersAPI } from '../services/api';

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const response = await usersAPI.getUserById(user.id);
        setProfile(response);
        setBio(response.bio || '');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card">
        <h2 className="mb-3">{profile.name}</h2>

        <div className="mb-3">
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Rating:</strong> {profile.averageRating.toFixed(1)} / 5
          </p>
          <p>
            <strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-3">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', marginTop: '0.5rem' }}
            placeholder="Tell others about yourself"
          />
        </div>

        <button className="btn btn-primary" style={{ marginRight: '1rem' }}>
          Save Profile
        </button>
        <button className="btn btn-secondary">Change Password</button>
      </div>
    </div>
  );
}
