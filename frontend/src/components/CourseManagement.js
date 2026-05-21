// frontend/src/components/CourseManagement.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses/');
      setCourses(response.data);
    } catch (e) {
      console.error('Error fetching courses:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/courses/', formData);
      alert('Course created successfully!');
      setFormData({ name: '', description: '' });
      fetchCourses();
    } catch (e) {
      console.error('Error creating course:', e.response?.data || e.message);
      setError(e.response?.data?.error || 'Error creating course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/api/courses/${id}/`);
      fetchCourses();
    } catch (e) {
      console.error('Error deleting course:', e);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div style={{ padding: '20px' }}>Access Denied</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Manage Courses</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Course</h3>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Course Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px', 
              background: loading ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      
    </div>
  );
};

export default CourseManagement;