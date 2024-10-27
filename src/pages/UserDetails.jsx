// src/pages/UserDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserDetails() {
  const { id } = useParams(); // Get user ID from URL params
  const [user, setUser] = useState(null); // Store user data
  const [error, setError] = useState(null); // Handle errors
  const [loading, setLoading] = useState(true); // Track loading state
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const navigate = useNavigate();
  const { token } = useAuth(); // Retrieve JWT token

  // Fetch user details from API on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user details.');

        const data = await response.json();
        setUser(data); // Store the user data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Submit the updated user data to the API
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        setError(errorData.message || 'Failed to update user.');
        return;
      }

      console.log(`User with ID ${id} updated successfully.`);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      console.error('Unexpected Error:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>User Details</h2>
      <div>
        <label>ID: </label>
        <span>{user.id}</span>
      </div>
      <div>
        <label>First Name: </label>
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Last Name: </label>
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          name="password"
          value={user.password || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        {isEditing ? (
          <button onClick={handleUpdate}>Submit</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button onClick={() => navigate('/users')}>Back to User List</button>
      </div>
    </div>
  );
}

export default UserDetails;
