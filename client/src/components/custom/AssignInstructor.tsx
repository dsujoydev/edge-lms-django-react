import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

interface AssignInstructorProps {
  courseId: string;
  onClose?: () => void;
}

export function AssignInstructor({ courseId, onClose }: AssignInstructorProps) {
  const [instructorId, setInstructorId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        <Label htmlFor="instructorId">Instructor ID</Label>
        <Input
          id="instructorId"
          type="number"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Assign Instructor</Button>
    </form>
  );
}
