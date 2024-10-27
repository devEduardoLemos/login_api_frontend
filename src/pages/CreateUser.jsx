// src/pages/CreateUser.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: [{ id: 3 }], // Default role with id 3
  });
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const token = localStorage.getItem('jwt'); // Retrieve JWT token

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Send JWT in the header
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // Parse response body

      if (!response.ok) {
        // If the response is not OK, log it and set the error message
        console.error('API Error Response:', responseData);
        setError(responseData.message || 'Failed to create user.');
        return;
      }

      console.log('User created successfully:', responseData); // Log success response
      navigate('/users'); // Navigate to user list after success
    } catch (err) {
      // Log unexpected errors (e.g., network issues)
      console.error('Unexpected Error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
