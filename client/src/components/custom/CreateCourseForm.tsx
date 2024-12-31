import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CardComponent } from "./CardComponent";
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface CourseData {
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
}

export function CreateCourseForm() {
  const [formData, setFormData] = useState<CourseData>({
    course_code: "",
    title: "",
    description: "",
    short_description: "",
    is_active: true,
    start_date: "",
    end_date: "",
    max_students: 50,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/courses/", {
        ...formData,
        is_enrolled: false,
        available_slots: formData.max_students,
      });

      if (response.status === 201) {
        navigate("/dashboard/courses");
        toast({ title: "Course Created", description: "The course has been created successfully." });

        // Assuming you have a courses list page
      } else {
        setError("Failed to create course. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while creating the course. Please try again.");
    }
  };

  return (
    <CardComponent
      footer={
        <>
          <Button type="submit" form="create-course-form" className="w-full">
            Create Course
          </Button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </>
      }
    >
      <form id="create-course-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course_code">Course Code</Label>
          <Input id="course_code" name="course_code" value={formData.course_code} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description</Label>
          <Input
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2 flex justify-around items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input
              width="full"
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_students">Maximum Students</Label>
          <Input
            id="max_students"
            name="max_students"
            type="number"
            value={formData.max_students}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </CardComponent>
  );
}
