# courses/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Enrollment, Module
from .serializers import CourseSerializer, EnrollmentSerializer, ModuleSerializer
from .permissions import IsAdminOrInstructor, IsInstructorForCourse, CanEnrollCourse
from django.db.models import Count, Q
from datetime import datetime, timedelta

class ModuleViewSet(viewsets.ModelViewSet):
   serializer_class = ModuleSerializer
   permission_classes = [IsAdminOrInstructor]

   def get_queryset(self):
       if getattr(self, 'swagger_fake_view', False):
           # queryset just for schema generation metadata
           return Module.objects.none()
       
       # Get modules for a specific course
       course_id = self.kwargs.get('course_pk') or self.request.query_params.get('course_id')
       if course_id:
           return Module.objects.filter(course_id=course_id).order_by('order')
       return Module.objects.all().order_by('order')

   def create(self, request, *args, **kwargs):
       course_id = self.kwargs.get('course_pk') or request.data.get('course_id')
       if not course_id:
           return Response(
               {'error': 'Course ID is required'}, 
               status=status.HTTP_400_BAD_REQUEST
           )

       course = get_object_or_404(Course, id=course_id)
       
       # Check if user is admin or the course instructor
       if not (request.user.user_type == 'admin' or course.instructor == request.user):
           return Response(
               {'error': 'You do not have permission to add modules to this course'}, 
               status=status.HTTP_403_FORBIDDEN
           )

       # Auto-set the order if not provided
       if 'order' not in request.data:
           last_module = Module.objects.filter(course=course).order_by('-order').first()
           order = (last_module.order + 1) if last_module else 1
           request.data['order'] = order

       serializer = self.get_serializer(data=request.data)
       serializer.is_valid(raise_exception=True)
       serializer.save(course=course)

       return Response(serializer.data, status=status.HTTP_201_CREATED)

   def update(self, request, *args, **kwargs):
       module = self.get_object()
       course = module.course

       # Check if user is admin or the course instructor
       if not (request.user.user_type == 'admin' or course.instructor == request.user):
           return Response(
               {'error': 'You do not have permission to modify this module'}, 
               status=status.HTTP_403_FORBIDDEN
           )

       return super().update(request, *args, **kwargs)

   def destroy(self, request, *args, **kwargs):
       module = self.get_object()
       course = module.course

       # Check if user is admin or the course instructor
       if not (request.user.user_type == 'admin' or course.instructor == request.user):
           return Response(
               {'error': 'You do not have permission to delete this module'}, 
               status=status.HTTP_403_FORBIDDEN
           )

       # Reorder remaining modules
       modules_to_update = Module.objects.filter(
           course=course, 
           order__gt=module.order
       )
       for mod in modules_to_update:
           mod.order -= 1
           mod.save()

       return super().destroy(request, *args, **kwargs)

   def reorder_modules(self, request, course_pk=None):
       """
       Reorder modules within a course
       Expected format: {"module_orders": [{"id": 1, "order": 2}, {"id": 2, "order": 1}]}
       """
       course = get_object_or_404(Course, pk=course_pk)
       
       if not (request.user.user_type == 'admin' or course.instructor == request.user):
           return Response(
               {'error': 'You do not have permission to reorder modules'}, 
               status=status.HTTP_403_FORBIDDEN
           )

       module_orders = request.data.get('module_orders', [])
       
       for module_data in module_orders:
           module = get_object_or_404(Module, id=module_data['id'], course=course)
           module.order = module_data['order']
           module.save()

       # Return updated module list
       modules = Module.objects.filter(course=course).order_by('order')
       serializer = self.get_serializer(modules, many=True)
       
       return Response(serializer.data)
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

    @action(detail=True, methods=['get'])
    def modules(self, request, pk=None):
       course = self.get_object()
       modules = course.modules.all().order_by('order')
       serializer = ModuleSerializer(modules, many=True)
       return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_module(self, request, pk=None):
       course = self.get_object()
       
       # Check permissions
       if not (request.user.user_type == 'admin' or course.instructor == request.user):
           return Response(
               {'error': 'You do not have permission to add modules'}, 
               status=status.HTTP_403_FORBIDDEN
           )

       # Auto-set the order if not provided
       if 'order' not in request.data:
           last_module = course.modules.order_by('-order').first()
           order = (last_module.order + 1) if last_module else 1
           request.data['order'] = order

       serializer = ModuleSerializer(data=request.data)
       if serializer.is_valid():
           serializer.save(course=course)
           return Response(serializer.data, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)