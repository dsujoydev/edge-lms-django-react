# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ModuleViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet, basename='module')

urlpatterns = [
    path('', include(router.urls)),
    path(
    'courses/<int:pk>/assign-instructor/', 
    CourseViewSet.as_view({'post': 'assign_instructor'}), 
    name='course-assign-instructor'
)
    
]