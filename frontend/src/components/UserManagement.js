import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import "./UserManagement.css";

const UserManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editSubjects, setEditSubjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'STUDENT', subject_ids: [] });

  useEffect(() => {

    api.get("/api/users/")
      .then(res => {
        const filteredUsers = res.data.filter(u => u.role !== "ADMIN");
        setUsers(filteredUsers);
      })
      .catch(err => console.log(err));

  }, []);

  useEffect(() => {
    api.get('/api/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubjectChange = (id) => {

    if (formData.subject_ids.includes(id)) {
      setFormData({
        ...formData,
        subject_ids: formData.subject_ids.filter(sub => sub !== id)
      });
    } else {
      setFormData({
        ...formData,
        subject_ids: [...formData.subject_ids, id]
      });
    }

  };
  const editUser = (selectedUser) => {

    setEditingUser(selectedUser);

    setEditSubjects(selectedUser.subjects?.map(s => s.id) || []);

  };

  const handleEditSubjectChange = (id) => {

    if (editSubjects.includes(id)) {

      setEditSubjects(editSubjects.filter(sub => sub !== id));

    } else {

      setEditSubjects([...editSubjects, id]);

    }

  };

  const updateUserSubjects = async () => {

    try {

      await api.put(`/api/users/${editingUser.id}/update_subjects/`, {
        subject_ids: editSubjects
      });

      alert("Student updated successfully");

      setEditingUser(null);

    } catch (err) {

      console.log(err);
      alert("Error updating student");

    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/users/register_user/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        subject_ids: formData.subject_ids
      });

      alert("User created successfully");
      navigate('/dashboard');

    } catch (e) {
      console.log(e.response?.data);
      alert("Error creating user");
    }
  };
  const deleteUser = async (selectedUser) => {

    if (selectedUser.role === "ADMIN") {
      alert("Admin cannot be deleted");
      return;
    }

    try {

      await api.delete(`/api/users/${selectedUser.id}/`);

      setUsers(users.filter(u => u.id !== selectedUser.id));

    } catch (err) {

      console.log(err);

    }

  };

  if (user?.role !== 'ADMIN') return <div style={{ padding: '20px' }}>Access Denied</div>;

  return (
    <div className="user-container">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>
        <div className="subject-list">
          <p>Select Subjects</p>

          {subjects.map(subject => (
            <label className="subject-item" key={subject.id}>
              <input
                type="checkbox"
                value={subject.id}
                checked={formData.subject_ids.includes(subject.id)}
                onChange={() => handleSubjectChange(subject.id)}
              />

              <span>{subject.name}</span>
            </label>
          ))}</div>


        <button type="submit" className="register-btn">Register</button>
      </form>


      <h2>User List</h2>

      <table className="user-table">

        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {users.map(user => (

            <tr key={user.id}>

              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>


              <td>
                <button className="edit-btn" onClick={() => editUser(user)}>Edit</button>

                <button className="delete-btn" onClick={() => deleteUser(user)}>Delete</button>
              </td>

            </tr>

          ))}
          {editingUser && (
            <div className="modal-overlay">

              <div className="modal-box">

                <h3>Edit Student: {editingUser.username}</h3>

                <p>Select Subjects</p>

                <div className="subject-list">
                  {subjects.map(subject => (
                    <label className="subject-item" key={subject.id}>
                      <input
                        type="checkbox"
                        checked={editSubjects.includes(subject.id)}
                        onChange={() => handleEditSubjectChange(subject.id)}
                      />

                      <span className="subject-name">{subject.name}</span>
                    </label>
                  ))}
                </div>

                <div className="modal-buttons">

                  <button className="update-btn" onClick={updateUserSubjects}>
                    Update
                  </button>

                  <button
                    className="close-btn"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>
          )}

        </tbody>

      </table>
    </div>
  );
};

export default UserManagement;