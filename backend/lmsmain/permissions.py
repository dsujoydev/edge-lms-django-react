from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.user_type == 'admin'

class IsInstructorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.user_type == 'instructor' or request.user.user_type == 'admin'

class IsStudentOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.user_type == 'student' or request.user.user_type == 'admin'