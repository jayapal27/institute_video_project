import axios from "axios";

const api = axios.create({
  baseURL: "http://35.89.150.199/api/",
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;