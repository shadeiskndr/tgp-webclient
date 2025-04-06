import { createContext } from "react";
import { LoginResponse } from "../services/economic-data.service";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (tokenData: LoginResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
