# accounts/management/commands/create_admin.py
from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = 'Create initial admin user'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_user(
                username='admin',
                password='admin123',
                email='admin@institute.com',
                role='ADMIN',
                is_staff=True, # Allows access to admin panel if needed
                is_superuser=False # Explicitly not a superuser as per requirement
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully!'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin user already exists.'))