import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { registerUser } from "../../utils/auth";
import { CardComponent } from "./CardComponent";

const USER_TYPES = [
  { value: "student", label: "Student" },
  { value: "instructor", label: "Instructor" },
  { value: "admin", label: "Administrator" },
];

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, user_type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.log(err);
    }
  };

  return (
    <CardComponent
      className="w-full max-w-md"
      title="Register"
      description="Create your account to get started."
      footer={
        <>
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Register
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="userType">User Type</Label>
            <Select onValueChange={handleSelectChange} value={formData.user_type}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {USER_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </CardComponent>
  );
}
