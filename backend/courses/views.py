# courses/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from .permissions import IsAdminOrInstructor, IsInstructorForCourse, CanEnrollCourse
from django.db.models import Count, Q
from datetime import datetime, timedelta

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all().select_related('instructor').prefetch_related('enrollment_set')

    PERMISSION_CLASSES = {
        'create': [IsAdminOrInstructor],
        'update': [IsAdminOrInstructor, IsInstructorForCourse],
        'partial_update': [IsAdminOrInstructor, IsInstructorForCourse],
        'destroy': [IsAdminOrInstructor, IsInstructorForCourse],
        'enroll': [CanEnrollCourse],
    }

    def get_permissions(self):
        permission_classes = self.PERMISSION_CLASSES.get(self.action, [permissions.IsAuthenticated])
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Course.objects.filter(is_active=True)
        elif user.user_type == 'instructor':
            return Course.objects.filter(instructor=user)
        return Course.objects.all()

    def perform_create(self, serializer):
        if self.request.user.user_type == 'instructor':
            serializer.save(instructor=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        student = request.user
        
        if Enrollment.objects.filter(course=course, student=student).exists():
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment = Enrollment.objects.create(course=course, student=student)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def assign_instructor(self, request, pk=None):
        if request.user.user_type != 'admin':
            return Response(
                {'detail': 'Only admin can assign instructors.'},
                status=status.HTTP_403_FORBIDDEN
            )

        course = self.get_object()
        instructor_id = request.data.get('instructor_id')
        
        instructor = get_object_or_404(User, id=instructor_id, user_type='instructor')
        course.instructor = instructor
        course.save()
        return Response({'detail': 'Instructor assigned successfully.'})

    @action(detail=True, methods=['get'])
    def enrollment_stats(self, request, pk=None):
        course = self.get_object()
        today = datetime.now()
        last_month = today - timedelta(days=30)

        stats = {
            'total_enrolled': course.enrolled_students_count,
            'available_slots': course.max_students - course.enrolled_students_count if course.max_students else None,
            'completion_rate': course.enrollment_set.filter(is_completed=True).count() / course.enrolled_students_count if course.enrolled_students_count > 0 else 0,
            'recent_enrollments': course.enrollment_set.filter(enrolled_at__gte=last_month).count(),
            'active_students': course.enrollment_set.filter(last_accessed__gte=last_month).count()
        }
        
        return Response(stats)

    @action(detail=False, methods=['get'])
    def enrollment_overview(self, request):
        if request.user.user_type not in ['admin', 'instructor']:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        courses = self.get_queryset()
        overview = courses.annotate(
            student_count=Count('students'),
            completed_count=Count('enrollment', filter=Q(enrollment__is_completed=True))
        ).values('course_code', 'title', 'student_count', 'completed_count')
        
        return Response(overview)
