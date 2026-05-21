# courses/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from accounts.models import User
from .models import Course, Subject, Video
from .serializers import UserSerializer, SubjectSerializer, VideoSerializer, CourseSerializer
from .permissions import IsAdmin, IsTeacher, IsStudent

# ==================== Course ViewSet ====================
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]

# ==================== Subject ViewSet ====================
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role == "TEACHER":
            return user.subjects.all()

        return Subject.objects.all()

# ==================== Video ViewSet ====================
class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role == "ADMIN":
            return Video.objects.all()

        if user.role == "TEACHER":
            return Video.objects.filter(uploaded_by=user)

        if user.role == "STUDENT":
            return Video.objects.filter(
                subject__in=user.subjects.all()
            )

    def perform_create(self, serializer):

        serializer.save(uploaded_by=self.request.user)
    
# ==================== User ViewSet ====================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Returns current user details (Role, Username) for React"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register_user(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role') 
        subject_ids = request.data.get('subject_ids', [])

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
    )
        if subject_ids:
            user.subjects.set(subject_ids)

        if role == "STUDENT":
            user.subjects.set(subject_ids)

        if role == "TEACHER":
            user.subjects.set(subject_ids)

        return Response(UserSerializer(user).data)
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):

    serializer = VideoSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)
        return Response(serializer.data)

    return Response(serializer.errors, status=400)