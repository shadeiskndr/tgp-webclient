import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginResponse } from "../services/economic-data.service";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (tokenData: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
