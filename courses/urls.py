# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, SubjectViewSet, VideoViewSet, UserViewSet
from .views import upload_video

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('videos/upload/', upload_video),
    path('', include(router.urls)),
   
]