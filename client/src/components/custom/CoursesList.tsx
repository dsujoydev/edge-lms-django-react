import { useEffect, useState } from "react";
import { CourseCard } from "../layout/CourseCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import api from "@/utils/api";
import { CreateCourseForm } from "./CreateCourseForm";
import { Course } from "@/types/layout.type";

export function CoursesList() {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/");
      setCourseData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>Add New Course</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new course</DialogTitle>
              <DialogDescription>
                <CreateCourseForm
                  onSuccess={() => {
                    fetchCourses();
                    setOpen(false);
                  }}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseData.map((course) => (
          <CourseCard key={course.id} courseProps={course} />
        ))}
      </div>
    </div>
  );
}
