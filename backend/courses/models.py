
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Course(models.Model):
    course_code = models.CharField(max_length=20, unique=True, verbose_name="Course Code")
    title = models.CharField(max_length=200, verbose_name="Title")
    description = models.TextField(verbose_name="Description")
    short_description = models.CharField(max_length=200, blank=True, verbose_name="Short Description")
    instructor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses_teaching',
        verbose_name="Instructor"
    )
    students = models.ManyToManyField(
        User,
        through='Enrollment',
        related_name='courses_enrolled',
        verbose_name="Students"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    start_date = models.DateField(null=True, blank=True, verbose_name="Start Date")
    end_date = models.DateField(null=True, blank=True, verbose_name="End Date")
    max_students = models.PositiveIntegerField(null=True, blank=True, verbose_name="Max Students")

    @property
    def enrolled_students_count(self):
        return self.students.count()

    @property
    def has_available_slots(self):
        if self.max_students:
            return self.enrolled_students_count < self.max_students
        return True

    def __str__(self):
        return f"{self.course_code} - {self.title}"

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"

class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE, verbose_name="Course")
    title = models.CharField(max_length=200, verbose_name="Title")
    description = models.TextField(verbose_name="Description")
    order = models.PositiveIntegerField(verbose_name="Order")
    is_published = models.BooleanField(default=False, verbose_name="Is Published")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        ordering = ['order']
        unique_together = ['course', 'order']
        verbose_name = "Module"
        verbose_name_plural = "Modules"

    def __str__(self):
        return f"{self.course.course_code} - Module {self.order}: {self.title}"

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Student")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, verbose_name="Course")
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name="Enrolled At")
    is_completed = models.BooleanField(default=False, verbose_name="Is Completed")
    completion_date = models.DateTimeField(null=True, blank=True, verbose_name="Completion Date")
    last_accessed = models.DateTimeField(null=True, blank=True, verbose_name="Last Accessed")

    class Meta:
        unique_together = ['student', 'course']
        verbose_name = "Enrollment"
        verbose_name_plural = "Enrollments"

    def __str__(self):
        return f"{self.student.username} - {self.course.course_code}"

