# courses/permissions.py
from rest_framework import permissions

# Constants for user types
USER_TYPE_ADMIN = 'admin'
USER_TYPE_INSTRUCTOR = 'instructor'
USER_TYPE_STUDENT = 'student'

class IsAdminOrInstructor(permissions.BasePermission):
    """
    Allows access only to admin or instructor users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in [USER_TYPE_ADMIN, USER_TYPE_INSTRUCTOR]
        )

class IsInstructorForCourse(permissions.BasePermission):
    """
    Allows access only to the instructor of the course.
    """
    def has_object_permission(self, request, view, obj):
        return obj.instructor == request.user

class CanEnrollCourse(permissions.BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == USER_TYPE_STUDENT

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == USER_TYPE_ADMIN