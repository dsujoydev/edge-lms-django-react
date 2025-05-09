import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CourseCardProps } from "@/types/layout.type";

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
