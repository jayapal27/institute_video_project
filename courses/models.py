from django.db import models
from django.conf import settings

class Course(models.Model):

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class Subject(models.Model):

    name = models.CharField(max_length=100)

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name


from django.db import models
from django.conf import settings
from .models import Subject


class Video(models.Model):

    title = models.CharField(max_length=200)

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )

    video_file = models.FileField(upload_to="videos/")
    thumbnail = models.ImageField(
        upload_to="thumbnails/",
        blank=True,
        null=True
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)