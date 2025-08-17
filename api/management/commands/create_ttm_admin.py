from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Create a TTM admin user'

    def handle(self, *args, **options):
        username = 'lenovo'
        password = 'pitiri'
        email = 'admin@threadtravels.com'
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists!')
            )
            return
        
        # Create the admin user
        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password),
                is_staff=True,
                is_superuser=True,
                first_name='TTM',
                last_name='Admin'
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created TTM admin user!\n'
                    f'Username: {username}\n'
                    f'Password: {password}\n'
                    f'Email: {email}\n'
                    f'Staff: Yes\n'
                    f'Superuser: Yes'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating user: {str(e)}')
            ) 