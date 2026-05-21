// frontend/src/components/Dashboard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome, {user?.username}</h1>
      <p>Role: <strong>{user?.role}</strong></p>
      <p>Email: {user?.email}</p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* All users can view videos */}
        <Link
          to="/videos"
          style={buttonStyle('#28a745', 'white')}
        >
          View Videos
        </Link>

        {/* Teachers get upload option */}
        {user?.role === 'TEACHER' && (
          <Link
            to="/upload"
            style={buttonStyle('#17a2b8', 'white')}
          >
            Upload Video
          </Link>
        )}

        {/* Admins get full management options */}
        {user?.role === 'ADMIN' && (
          <>
            <Link
              to="/users"
              style={buttonStyle('#ffc107', 'black')}
            >
              Manage Users
            </Link>

            <Link
              to="/courses"
              style={buttonStyle('#6f42c1', 'white')}
            >
              Add Courses
            </Link>

            <Link
              to="/subjects"
              style={buttonStyle('#6f42c1', 'white')}
            >
              Add Subjects
            </Link>

            <button
              onClick={() => navigate("/catalog")}
              style={buttonStyle('#007bff', 'white')}
            >
              Manage Courses & Subjects
            </button>
          </>
        )}


        
      </div>
    </div>
  );
};

// Helper for consistent button styling
const buttonStyle = (bgColor, color) => ({
  padding: '10px 20px',
  background: bgColor,
  color: color,
  textDecoration: 'none',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

export default Dashboard;