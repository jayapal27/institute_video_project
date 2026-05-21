// frontend/src/components/SubjectManagement.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SubjectManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: '', course_id: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses/');
      setCourses(response.data);
    } catch (e) {
      console.error('Error fetching courses:', e);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects/');
      setSubjects(response.data);
    } catch (e) {
      console.error('Error fetching subjects:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.course_id) {
      setError('Please select a course');
      setLoading(false);
      return;
    }

    try {
      // Send course_id as integer, not string
      await api.post('/api/subjects/', {
        name: formData.name,
        course_id: parseInt(formData.course_id)
      });
      alert('Subject created successfully!');
      setFormData({ name: '', course_id: '' });
      fetchSubjects();
    } catch (e) {
      console.error('Error creating subject:', e.response?.data || e.message);
      setError(e.response?.data?.error || 'Error creating subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`/api/subjects/${id}/`);
      fetchSubjects();
    } catch (e) {
      console.error('Error deleting subject:', e);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div style={{ padding: '20px' }}>Access Denied</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Manage Subjects</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Subject</h3>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Subject Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select 
            value={formData.course_id} 
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
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
            {loading ? 'Creating...' : 'Create Subject'}
          </button>
        </form>
      </div>

      <h3>Existing Subjects</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Course</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => (
            <tr key={subject.id}>
              
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{subject.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{subject.course_name || 'N/A'}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <button 
                  onClick={() => handleDelete(subject.id)}
                  style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManagement;