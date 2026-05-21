from django.contrib.auth.models import AbstractUser
from django.db import models
from courses.models import Subject

class User(AbstractUser):

    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("TEACHER", "Teacher"),
        ("STUDENT", "Student"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    subjects = models.ManyToManyField(
        Subject,
        blank=True
    )