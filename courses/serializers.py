# courses/serializers.py
from rest_framework import serializers
from accounts.models import User
from .models import Course, Subject, Video

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'course_id', 'course_name']

    def create(self, validated_data):
        course_id = validated_data.pop('course_id')
        course = Course.objects.get(id=course_id)
        return Subject.objects.create(course=course, **validated_data)

class VideoSerializer(serializers.ModelSerializer):
    subject_id = serializers.IntegerField(write_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'video_file','thumbnail', 'subject_id', 'uploaded_by_name', 'subject_name', 'created_at']

    def create(self, validated_data):
        subject_id = validated_data.pop('subject_id')
        subject = Subject.objects.get(id=subject_id)
        return Video.objects.create(subject=subject, **validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']