import React, { useState } from "react";
import { CardComponent } from "./CardComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";

interface AssignInstructorProps {
  courseId: string;
}

export function AssignInstructor({ courseId }: AssignInstructorProps) {
  const [instructorId, setInstructorId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAssignInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/courses/${courseId}/assign-instructor/`, { instructor_id: instructorId });
      setSuccess("Instructor assigned successfully.");
      setInstructorId("");
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to assign instructor.");
      setSuccess(null);
    }
  };

  return (
    <CardComponent
      title="Assign Instructor"
      description="Assign an instructor to this course."
      footer={
        <div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      }
    >
      <form onSubmit={handleAssignInstructor} className="space-y-4">
        <div>
          <Label htmlFor="instructorId">Instructor ID</Label>
          <Input id="instructorId" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required />
        </div>
        <Button type="submit">Assign Instructor</Button>
      </form>
    </CardComponent>
  );
}
