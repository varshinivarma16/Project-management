import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("pm_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pm_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("pm_token", token);
    } else {
      localStorage.removeItem("pm_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("pm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_user");
    }
  }, [user]);

  const authenticate = async (mode, formData) => {
    const endpoint = mode === "signup" ? "/auth/register" : "/auth/login";
    const { data } = await api.post(endpoint, formData);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    authenticate,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
