# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ModuleViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'modules', ModuleViewSet, basename='module')

course_urls = [
    path('<int:pk>/enroll/', 
         CourseViewSet.as_view({'post': 'enroll'}), 
         name='course-enroll'),
    
    path('<int:pk>/enrollment-stats/', 
         CourseViewSet.as_view({'get': 'enrollment_stats'}), 
         name='course-enrollment-stats'),
    
    path('enrollment-overview/', 
         CourseViewSet.as_view({'get': 'enrollment_overview'}), 
         name='course-enrollment-overview'),
    
    path('<int:pk>/assign-instructor/', 
         CourseViewSet.as_view({'post': 'assign_instructor'}), 
         name='course-assign-instructor'),
]

module_urls = [
    path('<int:course_pk>/modules/', 
         ModuleViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='course-modules'),
    
    path('<int:course_pk>/modules/<int:pk>/', 
         ModuleViewSet.as_view({
             'get': 'retrieve',
             'put': 'update',
             'patch': 'partial_update',
             'delete': 'destroy'
         }),
         name='course-module-detail'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('courses/', include((course_urls, 'courses'))),
    path('courses/', include((module_urls, 'modules'))),
]