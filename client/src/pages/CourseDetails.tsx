import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { ModuleList } from './ModuleList';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, BookOpen } from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";
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
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}/`);
        setCourse(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch course details.");
        toast({
          title: "Error",
          description: "Failed to fetch course details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, toast]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!course) return <div className="flex justify-center items-center h-screen">Course not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{course.course_code}</p>
          </div>
          <Badge variant={course.is_active ? "default" : "secondary"}>{course.is_active ? "Active" : "Inactive"}</Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Course Details</h2>
            <p>{course.description}</p>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>Start: {new Date(course.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>End: {new Date(course.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>
                Available Slots: {course.available_slots}/{course.max_students}
              </span>
            </div>
            {course.instructor && (
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>Instructor: {course.instructor}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Modules</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Module</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Module</DialogTitle>
                  </DialogHeader>
                  <ModuleList courseId={id ?? ""} isDrawer={true} onClose={() => {}} />
                </DialogContent>
              </Dialog>
            </div>
            <ModuleList courseId={id ?? ""} />
          </div>
        </div>

        <Separator />

        <div className="flex justify-end space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Assign Instructor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Instructor</DialogTitle>
              </DialogHeader>
              <AssignInstructor courseId={id ?? ""} onClose={() => {}} />
            </DialogContent>
          </Dialog>
          <Button>Edit Course</Button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
