import React, { useState, useEffect } from "react";
import { LoginResponse } from "../services/economic-data.service";
import { AuthContext } from "../types/authContextTypes";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    // Update authentication status whenever token changes
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (tokenData: LoginResponse) => {
    localStorage.setItem("access_token", tokenData.access_token);
    setToken(tokenData.access_token);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
