// frontend/src/components/Login.js

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    const success = await login(username, password);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }

  };

  return (

    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f0f2f5" }}>

      <form onSubmit={handleSubmit} style={{ padding:"20px", background:"white", borderRadius:"8px", boxShadow:"0 2px 10px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column", gap:"10px", width:"300px" }}>

        <h2>Video Institute</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

};

export default Login;