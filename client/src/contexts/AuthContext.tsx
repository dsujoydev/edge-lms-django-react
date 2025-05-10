import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/auth";
import { AuthContextType, User } from "@/types/auth.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserProfile()
        .then((userData) => setUser(userData))
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error during login:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
