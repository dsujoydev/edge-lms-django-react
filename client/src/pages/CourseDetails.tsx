import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../utils/api";
import { CardComponent } from "@/components/custom/CardComponent";
import { ModuleList } from "@/components/custom/ModuleList";
import { AssignInstructor } from "@/components/custom/AssignInstructor";

interface Course {
  id: string;
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
  available_slots: number;
  instructor?: string;
}

function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}/`);
        setCourse(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="space-y-6">
      <CardComponent
        title={course?.title || ""}
        description={course?.short_description || ""}
        footer={
          <div>
            <p>Start Date: {course?.start_date || "N/A"}</p>
            <p>End Date: {course?.end_date || "N/A"}</p>
            <p>
              Available Slots: {course?.available_slots ?? 0}/{course?.max_students ?? 0}
            </p>
          </div>
        }
      >
        <p>{course?.description || "No description available."}</p>
        <p>Course Code: {course?.course_code || "N/A"}</p>
        <p>Status: {course?.is_active ? "Active" : "Inactive"}</p>
        {course?.instructor && <p>Instructor: {course.instructor}</p>}
      </CardComponent>

      {courseId && <ModuleList courseId={courseId} />}
      {courseId && <AssignInstructor courseId={courseId} />}
    </div>
  );
}

export default CourseDetails;
