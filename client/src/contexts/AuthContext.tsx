import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/auth";

enum UserType {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "administrator",
}

// Interface for basic user data
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  profilePicture?: string | null;
  bio?: string;
  dateJoined?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserProfile()
        .then((userData) => setUser(userData))
        .catch(() => logout());
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    fetchUserProfile()
      .then((userData) => setUser(userData))
      .catch(console.error);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
