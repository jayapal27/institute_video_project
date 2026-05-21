import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import "./VideoList.css";

const VideoList = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get('/api/videos/').then(res => setVideos(res.data)).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/api/videos/${id}/`);
      setVideos(videos.filter(v => v.id !== id));
    } catch (e) { alert('Delete failed'); }
  };

  return (
    <div className="video-container">
      <h2 className="video-title">Video Library</h2>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <h3>{video.title}</h3>
            <p className="video-info">Subject: {video.subject_name}</p>
            <p className="video-info">Uploaded By: {video.uploaded_by_name}</p>

            <video className="video-player" controls poster={video.thumbnail}>
              <source src={video.video_file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {(user?.role === 'ADMIN' || (user?.role === 'TEACHER' && video.uploaded_by === user.id)) && (
              <button onClick={() => handleDelete(video.id)} className="delete-btn">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;