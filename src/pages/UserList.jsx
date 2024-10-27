// src/pages/UserList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/users?page=${currentPage}&size=5`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch users.');

      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        setError(errorData.message || 'Failed to delete user.');
        return;
      }

      console.log(`User with ID ${id} deleted successfully.`);
      // Remove the deleted user from the list without reloading the page
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Unexpected Error:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/users/${id}`);
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>User List</h2>
      <button onClick={handleCreateUser}>Create New User</button>
      <table border="1" cellPadding="10" style={{ margin: '20px auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.roles.map((role) => role.authority).join(', ')}</td>
              <td>
                <button onClick={() => handleViewDetails(user.id)}>Details</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserList;
