from django.urls import path
from .views import update_student_subjects
from .views import get_users, delete_user

urlpatterns = [

    path("users/", get_users),
    path("users/<int:id>/", delete_user),
    path('users/<int:user_id>/update_subjects/', update_student_subjects),

]