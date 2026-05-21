import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const VideoUpload = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    setLoading(true);

    if (user.role !== 'TEACHER') {
      setError('Only teachers can upload videos');
      setLoading(false);
      return;
    }

    if (!videoFile) {
      setError('Please select a video file');
      setLoading(false);
      return;
    }

    if (!subject) {
      setError('Please select a subject');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append("subject_id", subject);
    formData.append('video_file', videoFile);
    formData.append('thumbnail', thumbnail);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }


    try {

      const response = await api.post('/api/videos/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log(response.data);

      alert('Video uploaded successfully!');
      navigate('/videos');

    } catch (e) {

      console.error(e.response?.data || e.message);
      setError('Upload failed');

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="upload-container">

      <div className="upload-card">

        <h2>Upload Video</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">

          <input
            className="upload-input"
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            className="upload-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >

            <option value="">Select Subject</option>

            {subjects.map(s => (

              <option key={s.id} value={s.id}>
                {s.name}
              </option>

            ))}

          </select>

          <div className="file-group">
            <label>Video File</label>
            <input type="file" accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>

          <div className="file-group">
            <label>Thumbnail</label>
            <input type="file" accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>

          <button className="upload-btn" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </button>

        </form>

      </div></div>

  );

};

export default VideoUpload;