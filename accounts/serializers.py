from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
from courses.models import Subject

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    subject_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Subject.objects.all(),
        source='subjects'
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "subject_ids"
        ]

        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):

        subjects = validated_data.pop("subjects", [])

        user = User.objects.create_user(**validated_data)

        user.subjects.set(subjects)

        return user