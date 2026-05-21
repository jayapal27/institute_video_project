from django.shortcuts import render

from rest_framework import viewsets
from django.contrib.auth import get_user_model

from courses.models import Subject
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User,Subject

User = get_user_model()


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_student_subjects(request, user_id):

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    subject_ids = request.data.get("subject_ids", [])

    subjects = Subject.objects.filter(id__in=subject_ids)

    # update subjects
    user.subjects.set(subjects)

    return Response({"message": "Subjects updated successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, id):

    user = User.objects.get(id=id)

    if user.role == "ADMIN":
        return Response({"error": "Admin cannot be deleted"}, status=400)

    user.delete()

    return Response({"message": "User deleted successfully"})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @api_view(['GET'])
    @permission_classes([IsAuthenticated])
    def get_me(request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)