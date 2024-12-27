# courses/serializers.py
from rest_framework import serializers
from .models import Course, Module, Enrollment

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'is_published']

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    enrolled_students_count = serializers.IntegerField(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    modules = ModuleSerializer(many=True, read_only=True)
    available_slots = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'course_code', 'title', 'description', 'short_description',
            'instructor', 'instructor_name', 'enrolled_students_count',
            'is_enrolled', 'modules', 'is_active', 'start_date', 'end_date',
            'max_students', 'available_slots', 'created_at'
        ]
        read_only_fields = ['instructor', 'created_at', 'enrolled_students_count']

    def get_instructor_name(self, obj):
        return f"{obj.instructor.first_name} {obj.instructor.last_name}" if obj.instructor else ""

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.students.filter(id=request.user.id).exists()
        return False

    def get_available_slots(self, obj):
        if obj.max_students:
            return max(0, obj.max_students - obj.enrolled_students_count)
        return None  # Unlimited slots

class EnrollmentSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.course_code', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_code', 'course_title', 
                 'enrolled_at', 'is_completed', 'completion_date', 'last_accessed']
        read_only_fields = ['enrolled_at', 'completion_date', 'last_accessed']