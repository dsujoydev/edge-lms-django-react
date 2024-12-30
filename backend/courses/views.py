# views.py
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from datetime import datetime, timedelta

from .models import Course, Enrollment, Module
from .serializers import CourseSerializer, EnrollmentSerializer, ModuleSerializer
from .permissions import IsAdminOrInstructor, IsInstructorForCourse, CanEnrollCourse

User = get_user_model()

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [IsAdminOrInstructor]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Module.objects.none()
        
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Module.objects.filter(course_id=course_id).order_by('order')
        return Module.objects.all().order_by('order')

    def create(self, request, *args, **kwargs):
        course_id = request.data.get('course_id')
        if not course_id:
            return Response(
                {'error': 'course_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        course = get_object_or_404(Course, id=course_id)
        
        # Check permissions
        if not (request.user.user_type == 'admin' or 
                course.instructor == request.user):
            return Response(
                {'error': 'You do not have permission to add modules to this course'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Auto-assign order if not provided
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

        if not (request.user.user_type == 'admin' or 
                course.instructor == request.user):
            return Response(
                {'error': 'You do not have permission to modify this module'},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        module = self.get_object()
        course = module.course

        if not (request.user.user_type == 'admin' or 
                course.instructor == request.user):
            return Response(
                {'error': 'You do not have permission to delete this module'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Update order of remaining modules
        modules_to_update = Module.objects.filter(
            course=course,
            order__gt=module.order
        )
        
        for mod in modules_to_update:
            mod.order -= 1
            mod.save()

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        course_id = request.data.get('course_id')
        if not course_id:
            return Response(
                {'error': 'course_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        course = get_object_or_404(Course, id=course_id)

        if not (request.user.user_type == 'admin' or 
                course.instructor == request.user):
            return Response(
                {'error': 'You do not have permission to reorder modules'},
                status=status.HTTP_403_FORBIDDEN
            )

        module_orders = request.data.get('module_orders', [])
        if not module_orders:
            return Response(
                {'error': 'module_orders is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate all modules exist and belong to this course
        module_ids = [item['id'] for item in module_orders]
        existing_modules = Module.objects.filter(
            id__in=module_ids,
            course=course
        )
        
        if len(existing_modules) != len(module_ids):
            return Response(
                {'error': 'Invalid module IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update orders
        for module_data in module_orders:
            module = next(m for m in existing_modules if m.id == module_data['id'])
            module.order = module_data['order']
            module.save()

        modules = Module.objects.filter(course=course).order_by('order')
        serializer = self.get_serializer(modules, many=True)
        return Response(serializer.data)


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all().select_related('instructor').prefetch_related(
        'enrollment_set'
    )

    def get_permissions(self):
        if self.action == 'assign_instructor':
            permission_classes = [permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrInstructor, IsInstructorForCourse]
        elif self.action == 'create':
            permission_classes = [IsAdminOrInstructor]
        elif self.action == 'enroll':
            permission_classes = [CanEnrollCourse]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Course.objects.filter(is_active=True)
        elif user.user_type == 'instructor':
            return Course.objects.filter(Q(instructor=user) | Q(is_active=True))
        return Course.objects.all()

    def perform_create(self, serializer):
        if self.request.user.user_type == 'instructor':
            serializer.save(instructor=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        
        if Enrollment.objects.filter(
            course=course,
            student=request.user
        ).exists():
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not course.has_available_slots:
            return Response(
                {'detail': 'Course has reached maximum enrollment.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment = Enrollment.objects.create(
            course=course,
            student=request.user
        )
        
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def assign_instructor(self, request, pk=None):
        course = self.get_object()
        instructor_id = request.data.get('instructor_id')
        
        if not instructor_id:
            return Response(
                {'error': 'instructor_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            instructor = User.objects.get(
                id=instructor_id,
                user_type='instructor'
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid instructor ID or user is not an instructor'},
                status=status.HTTP_404_NOT_FOUND
            )

        course.instructor = instructor
        course.save()
        
        serializer = self.get_serializer(course)
        return Response(serializer.data)