import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AssignInstructorProps {
  courseId: string;
  onClose?: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  bio: string;
}

export function AssignInstructor({ courseId, onClose }: AssignInstructorProps) {
  const [instructorId, setInstructorId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/list/");
        console.log(response);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/courses/${courseId}/assign-instructor/`, { instructor_id: parseInt(instructorId) });
      toast({
        title: "Success",
        description: "Instructor assigned successfully.",
      });
      setInstructorId("");
      setError(null);
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      setError("Failed to assign instructor.");
      toast({
        title: "Error",
        description: "Failed to assign instructor.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleAssignInstructor} className="space-y-4">
      <div>
        {/* <Label htmlFor="instructorId">Instructor</Label> */}
        <Select onValueChange={(value) => setInstructorId(value)} value={instructorId}>
          <SelectTrigger id="instructorId">
            <SelectValue placeholder="Select Instructor" />
          </SelectTrigger>
          <SelectContent position="popper">
            {users
              .filter((type) => type.user_type === "instructor")
              .map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.first_name} {type.last_name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Assign Instructor</Button>
    </form>
  );
}
