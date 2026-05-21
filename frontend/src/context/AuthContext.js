import { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (token) {

      api.get("/api/users/me/")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
        })
        .finally(() => setLoading(false));

    } else {
      setLoading(false);
    }

  }, []);

  const login = async (username, password) => {

    try {

      const response = await api.post("/api/token/", {
        username,
        password
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const userResponse = await api.get("/api/users/me/");
      setUser(userResponse.data);

      return true;

    } catch (error) {

      console.error("Login error:", error.response?.data || error.message);
      return false;

    }

  };

  const logout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);

  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );

};