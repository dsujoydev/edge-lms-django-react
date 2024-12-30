import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  is_published: boolean;
  course: string;
}

interface Course {
  id: number | string;
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  instructor: string | null; // Nullable
  instructor_name: string;
  enrolled_students_count: number;
  is_enrolled: boolean;
  modules: Module[]; // Array of Module objects
  is_active: boolean;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  max_students: number;
  available_slots: number;
  created_at: string; // ISO timestamp string
}

interface CourseCardProps {
  courseData: Course; // The course object passed to the CourseCard
}

export function CourseCard({ courseData }: CourseCardProps) {
  const navigate = useNavigate();
  console.log(courseData);
  return (
    <Card className="overflow-hidden" onClick={() => navigate(`/dashboard/courses/${courseData.id}`)}>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt={courseData.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{courseData.course_code}</p>
            <h3 className="font-semibold">{courseData.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {courseData.short_description || courseData.description}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">{courseData.modules ? courseData.modules.length : 0} modules</p>
          <p className="text-sm text-muted-foreground">{courseData.enrolled_students_count} students</p>
        </div>
      </CardFooter>
    </Card>
  );
}
