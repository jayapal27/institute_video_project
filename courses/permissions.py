# courses/permissions.py
from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsTeacher(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "TEACHER"

    def has_object_permission(self, request, view, obj):
        return obj.uploaded_by == request.user


class IsStudent(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["STUDENT", "TEACHER", "ADMIN"]