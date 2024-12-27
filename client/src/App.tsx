import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RegistrationForm } from "./components/custom/RegistrationForm";
import { SignInForm } from "./components/custom/SignInForm";
import { Button } from "@/components/ui/button";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  console.log(user);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Routes>
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<SignInForm />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
