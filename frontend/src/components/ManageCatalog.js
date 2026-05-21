import { useState, useEffect } from "react";
import api from "../api";
import "./ManageCatalog.css";

const ManageCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = () => {
    api.get("/api/courses/")
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  };

  const fetchSubjects = () => {
    api.get("/api/subjects/")
      .then(res => setSubjects(res.data))
      .catch(err => console.log(err));
  };

  const deleteCourse = async (id) => {
    await api.delete(`/api/courses/${id}/`);
    setCourses(courses.filter(c => c.id !== id));
  };

  const deleteSubject = async (id) => {
    await api.delete(`/api/subjects/${id}/`);
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="catalog-container">

  <h2 className="catalog-title">Manage Catalog</h2>

  <div className="catalog-section">

    <h3>Courses</h3>

    <ul className="course-list">
      {courses.map(course => (
        <li key={course.id} className="course-item">

          {course.name}

          <button
            className="delete-btn"
            onClick={() => deleteCourse(course.id)}
          >
            Delete
          </button>

        </li>
      ))}
    </ul>

  </div>

  <div className="catalog-section">

    <h3>Existing Subjects</h3>

    <table className="catalog-table">

      <thead>
        <tr>
          
          <th>Name</th>
          <th>Course</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {subjects.map(subject => (
          <tr key={subject.id}>

            
            <td>{subject.name}</td>
            <td>{subject.course_name || "N/A"}</td>

            <td>
              <button
                className="delete-btn"
                onClick={() => deleteSubject(subject.id)}
              >
                Delete
              </button>
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>  
  );
};

export default ManageCatalog;