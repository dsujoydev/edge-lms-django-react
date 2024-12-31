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
  instructor: string | null;
  instructor_name: string;
  enrolled_students_count: number;
  is_enrolled: boolean;
  modules?: Module[]; // Ensure consistency with the optional `modules` property
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
  available_slots: number;
  created_at: string;
}

interface CourseCardProps {
  courseProps: Course; // Ensure the type is consistent
}

export function CourseCard({ courseProps }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden" onClick={() => navigate(`/dashboard/courses/${courseProps.id}`)}>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt={courseProps.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{courseProps.course_code}</p>
            <h3 className="font-semibold">{courseProps.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {courseProps.short_description || courseProps.description}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">{courseProps.modules?.length || 0} modules</p>
          <p className="text-sm text-muted-foreground">{courseProps.enrolled_students_count} students</p>
        </div>
      </CardFooter>
    </Card>
  );
}
