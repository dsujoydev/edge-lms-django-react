export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  is_published: boolean;
  course: string;
}

export interface Course {
  id: number | string;
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  instructor: string | null;
  instructor_name: string;
  enrolled_students_count: number;
  is_enrolled: boolean;
  modules?: Module[]; // Ensure consistency
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
  available_slots: number;
  created_at: string;
}

export interface CourseData {
  course_code: string;
  title: string;
  description: string;
  short_description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  max_students: number;
}
