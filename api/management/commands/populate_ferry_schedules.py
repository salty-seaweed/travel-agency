from django.core.management.base import BaseCommand
from api.models import FerrySchedule
from datetime import time

class Command(BaseCommand):
    help = 'Populate ferry schedules with accurate timing data'

    def handle(self, *args, **options):
        self.stdout.write('Populating ferry schedules...')
        
        # Ferry schedule data from the website
        ferry_schedules_data = [
            {
                'route_name': 'Male to Hulhumale',
                'departure_time': time(6, 0),  # 6:00 AM
                'arrival_time': time(6, 20),   # 6:20 AM
                'duration': '20 minutes',
                'price': 2.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Regular ferry service to Hulhumale',
                'order': 1
            },
            {
                'route_name': 'Male to Maafushi',
                'departure_time': time(9, 0),  # 9:00 AM
                'arrival_time': time(10, 30),  # 10:30 AM
                'duration': '90 minutes',
                'price': 5.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Daily ferry to Maafushi island',
                'order': 2
            },
            {
                'route_name': 'Male to Gulhi',
                'departure_time': time(8, 30),  # 8:30 AM
                'arrival_time': time(9, 45),   # 9:45 AM
                'duration': '75 minutes',
                'price': 4.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Regular ferry to Gulhi island',
                'order': 3
            },
            {
                'route_name': 'Male to Eydhafushi (Baa Atoll)',
                'departure_time': time(7, 0),  # 7:00 AM
                'arrival_time': time(11, 0),   # 11:00 AM
                'duration': '4 hours',
                'price': 8.00,
                'days_of_week': ['Monday', 'Wednesday', 'Friday'],
                'notes': 'Three times per week to Baa Atoll',
                'order': 4
            },
            {
                'route_name': 'Male to Thulhaadhoo (Baa Atoll)',
                'departure_time': time(7, 30),  # 7:30 AM
                'arrival_time': time(11, 0),   # 11:00 AM
                'duration': '3.5 hours',
                'price': 7.00,
                'days_of_week': ['Tuesday', 'Thursday', 'Saturday'],
                'notes': 'Three times per week to Baa Atoll',
                'order': 5
            },
            {
                'route_name': 'Male to Maamigili (Ari Atoll)',
                'departure_time': time(6, 30),  # 6:30 AM
                'arrival_time': time(11, 30),  # 11:30 AM
                'duration': '5 hours',
                'price': 10.00,
                'days_of_week': ['Monday', 'Wednesday', 'Friday'],
                'notes': 'Three times per week to Ari Atoll',
                'order': 6
            },
            {
                'route_name': 'Male to Mahibadhoo (Ari Atoll)',
                'departure_time': time(7, 0),  # 7:00 AM
                'arrival_time': time(11, 30),  # 11:30 AM
                'duration': '4.5 hours',
                'price': 9.00,
                'days_of_week': ['Tuesday', 'Thursday', 'Saturday'],
                'notes': 'Three times per week to Ari Atoll',
                'order': 7
            },
            {
                'route_name': 'Male to Kunfunadhoo (Lhaviyani Atoll)',
                'departure_time': time(8, 0),  # 8:00 AM
                'arrival_time': time(11, 0),   # 11:00 AM
                'duration': '3 hours',
                'price': 6.00,
                'days_of_week': ['Monday', 'Wednesday', 'Friday'],
                'notes': 'Three times per week to Lhaviyani Atoll',
                'order': 8
            },
            {
                'route_name': 'Male to Alimatha (Vaavu Atoll)',
                'departure_time': time(6, 0),  # 6:00 AM
                'arrival_time': time(12, 0),   # 12:00 PM
                'duration': '6 hours',
                'price': 12.00,
                'days_of_week': ['Monday', 'Thursday'],
                'notes': 'Twice per week to Vaavu Atoll',
                'order': 9
            },
            {
                'route_name': 'Male to Fulidhoo (Vaavu Atoll)',
                'departure_time': time(6, 30),  # 6:30 AM
                'arrival_time': time(12, 0),   # 12:00 PM
                'duration': '5.5 hours',
                'price': 11.00,
                'days_of_week': ['Tuesday', 'Friday'],
                'notes': 'Twice per week to Vaavu Atoll',
                'order': 10
            },
            {
                'route_name': 'Male to Muli (Meemu Atoll)',
                'departure_time': time(5, 30),  # 5:30 AM
                'arrival_time': time(12, 0),   # 12:00 PM
                'duration': '6.5 hours',
                'price': 13.00,
                'days_of_week': ['Monday', 'Wednesday'],
                'notes': 'Twice per week to Meemu Atoll',
                'order': 11
            },
            {
                'route_name': 'Male to Veyvah (Meemu Atoll)',
                'departure_time': time(5, 0),  # 5:00 AM
                'arrival_time': time(12, 0),   # 12:00 PM
                'duration': '7 hours',
                'price': 14.00,
                'days_of_week': ['Tuesday', 'Thursday'],
                'notes': 'Twice per week to Meemu Atoll',
                'order': 12
            },
            # Return routes
            {
                'route_name': 'Hulhumale to Male',
                'departure_time': time(18, 0),  # 6:00 PM
                'arrival_time': time(18, 20),   # 6:20 PM
                'duration': '20 minutes',
                'price': 2.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Return ferry from Hulhumale',
                'order': 13
            },
            {
                'route_name': 'Maafushi to Male',
                'departure_time': time(15, 0),  # 3:00 PM
                'arrival_time': time(16, 30),   # 4:30 PM
                'duration': '90 minutes',
                'price': 5.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Return ferry from Maafushi',
                'order': 14
            },
            {
                'route_name': 'Gulhi to Male',
                'departure_time': time(16, 0),  # 4:00 PM
                'arrival_time': time(17, 15),   # 5:15 PM
                'duration': '75 minutes',
                'price': 4.00,
                'days_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'notes': 'Return ferry from Gulhi',
                'order': 15
            },
        ]

        for data in ferry_schedules_data:
            FerrySchedule.objects.get_or_create(
                route_name=data['route_name'],
                defaults=data
            )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {len(ferry_schedules_data)} ferry schedules!')
        )
