import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSession();
  }, []);

  const loadSavedSession = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync("token");
      const savedUser = await SecureStore.getItemAsync("user");

      if (savedToken && savedUser) {
        setAuthToken(savedToken);
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Session load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: newToken, user: loggedUser } = response.data;

    await SecureStore.setItemAsync("token", newToken);
    await SecureStore.setItemAsync("user", JSON.stringify(loggedUser));

    setAuthToken(newToken);
    setToken(newToken);
    setUser(loggedUser);

    return loggedUser;
  };

  const register = async ({ full_name, email, password, role }) => {
    return api.post("/auth/register", {
      full_name,
      email,
      password,
      role,
    });
  };

  const logout = async () => {
    try {
      if (token) await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout API error:", error?.response?.data || error.message);
    }

    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
