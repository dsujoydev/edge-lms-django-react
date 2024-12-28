import { useEffect, useState } from "react";
import { CourseCard } from "../layout/CourseCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

interface Course {
  id: number;
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  instructor_name: string;
  enrolled_students_count: number;
  modules: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
  available_slots: number;
}

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/courses/");
        setCourses(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again later.");
        setIsLoading(false);
      }
    };

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
        <Button onClick={() => navigate("/add-course")}>Add New Course</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
