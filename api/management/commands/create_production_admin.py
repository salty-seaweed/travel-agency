from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import os

class Command(BaseCommand):
    help = 'Create a production admin user with custom credentials'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Admin username (default: admin)'
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@threadtravels.com',
            help='Admin email (default: admin@threadtravels.com)'
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Admin password (required)'
        )
        parser.add_argument(
            '--first-name',
            type=str,
            default='Admin',
            help='First name (default: Admin)'
        )
        parser.add_argument(
            '--last-name',
            type=str,
            default='User',
            help='Last name (default: User)'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']
        
        # Validate required password
        if not password:
            self.stdout.write(
                self.style.ERROR('Password is required! Use --password option.')
            )
            return
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists!')
            )
            return
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'Email "{email}" already exists!')
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
                first_name=first_name,
                last_name=last_name
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created production admin user!\n'
                    f'Username: {username}\n'
                    f'Password: {password}\n'
                    f'Email: {email}\n'
                    f'First Name: {first_name}\n'
                    f'Last Name: {last_name}\n'
                    f'Staff: Yes\n'
                    f'Superuser: Yes\n\n'
                    f'⚠️  IMPORTANT: Save these credentials securely!'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating user: {str(e)}')
            )
