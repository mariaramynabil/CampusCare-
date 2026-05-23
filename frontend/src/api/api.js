import axios from "axios";

// IMPORTANT:
// Android Emulator: use http://10.0.2.2:3000/api
// iPhone/real Android phone: use your laptop IPv4, e.g. http://192.168.1.8:3000/api
// Web/local only: http://localhost:3000/api
export const API_BASE_URL = "http://localhost:3000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
