import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext(null);

const storage = {
  getItem: async (key) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  setItem: async (key, value) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },

  deleteItem: async (key) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSession();
  }, []);

  const loadSavedSession = async () => {
    try {
      const savedToken = await storage.getItem("token");
      const savedUser = await storage.getItem("user");

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

    await storage.setItem("token", newToken);
    await storage.setItem("user", JSON.stringify(loggedUser));

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
      if (token) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.log("Logout API error:", error?.response?.data || error.message);
    }

    await storage.deleteItem("token");
    await storage.deleteItem("user");

    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);