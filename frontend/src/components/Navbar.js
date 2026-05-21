// frontend/src/components/Navbar.js
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        

        {/* All users can view videos */}
        <Link to="/videos" style={linkStyle}>Videos</Link>

        {/* Teacher links */}
        {user?.role === 'TEACHER' && (
          <Link to="/upload" style={linkStyle}>Upload Video</Link>
        )}

        {/* Admin links */}
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/users" style={linkStyle}>Manage Users</Link>
            <Link to="/courses" style={linkStyle}>Add Courses</Link>
            <Link to="/subjects" style={linkStyle}>Add Subjects</Link>
            <button
              onClick={() => navigate("/catalog")}
             style={linkStyle}
            >
              Manage Course & Subjects
            </button>
          </>
        )}
        <Link to="/dashboard"  style={linkStyle}>Go To DashBoard</Link>

        
      </div>

      {/* Logout */}
      <div>
        <button onClick={logout} style={linkStyle}>Logout</button>
      </div>
    </nav>
  );
};

// Styles
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  background: '#343a40',
  color: 'white',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  background: '#495057',
};

const buttonStyle = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  background: '#ffc107',
  color: 'black',
};

const brandStyle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: 'white',
  textDecoration: 'none',
};

export default Navbar;