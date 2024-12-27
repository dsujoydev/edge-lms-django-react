import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../../utils/auth";
import { CardComponent } from "./CardComponent";

export function SignInForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData.username, formData.password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials or an error occurred. Please try again.");
      console.log(err);
    }
  };

  return (
    <CardComponent
      title="Sign In"
      description="Enter your credentials to access your account."
      footer={
        <>
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Sign In
          </Button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </form>
    </CardComponent>
  );
}
