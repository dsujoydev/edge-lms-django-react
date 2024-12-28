import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{course.course_code}</p>
            <h3 className="font-semibold">{course.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.short_description || course.description}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">{course.modules} modules</p>
          <p className="text-sm text-muted-foreground">{course.enrolled_students_count} students</p>
        </div>
      </CardFooter>
    </Card>
  );
}
