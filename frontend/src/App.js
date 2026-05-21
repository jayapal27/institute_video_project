// frontend/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VideoList from './components/VideoList';
import VideoUpload from './components/VideoUpload';
import UserManagement from './components/UserManagement';
import CourseManagement from './components/CourseManagement';
import SubjectManagement from './components/SubjectManagement';
import ManageCatalog from "./components/ManageCatalog";
import Navbar from './components/Navbar';




const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/videos" element={<ProtectedRoute><VideoList /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><SubjectManagement /></ProtectedRoute>} />
          <Route path="/catalog" element={<ManageCatalog />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;