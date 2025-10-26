from django.core.management.base import BaseCommand
from api.models import Destination

class Command(BaseCommand):
    help = 'Populate sample destinations data'

    def handle(self, *args, **options):
        destinations_data = [
            {
                'name': 'Malé',
                'description': 'The capital city of Maldives, known for its vibrant culture, historic mosques, and bustling markets.',
                'island': 'Malé',
                'atoll': 'North Malé Atoll',
                'latitude': 4.1755,
                'longitude': 73.5093,
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Maafushi',
                'description': 'A popular local island known for its beautiful beaches, water sports, and budget-friendly accommodations.',
                'island': 'Maafushi',
                'atoll': 'South Malé Atoll',
                'latitude': 3.9423,
                'longitude': 73.4907,
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Hulhumalé',
                'description': 'A modern artificial island with pristine beaches, water parks, and family-friendly attractions.',
                'island': 'Hulhumalé',
                'atoll': 'North Malé Atoll',
                'latitude': 4.2117,
                'longitude': 73.5403,
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Thulusdhoo',
                'description': 'Famous for its surf breaks, crystal clear waters, and proximity to the famous Cokes and Chickens surf spots.',
                'island': 'Thulusdhoo',
                'atoll': 'North Malé Atoll',
                'latitude': 4.3742,
                'longitude': 73.6514,
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Ukulhas',
                'description': 'Known for its environmental initiatives, beautiful beaches, and excellent snorkeling opportunities.',
                'island': 'Ukulhas',
                'atoll': 'Alif Alif Atoll',
                'latitude': 4.2167,
                'longitude': 72.8667,
                'is_featured': False,
                'is_active': True,
            },
            {
                'name': 'Rasdhoo',
                'description': 'A small island known for its diving spots, including Hammerhead Point and Madivaru Corner.',
                'island': 'Rasdhoo',
                'atoll': 'Alif Alif Atoll',
                'latitude': 4.2500,
                'longitude': 72.9833,
                'is_featured': False,
                'is_active': True,
            },
            {
                'name': 'Fulidhoo',
                'description': 'A peaceful island known for its beautiful beaches, traditional culture, and excellent snorkeling.',
                'island': 'Fulidhoo',
                'atoll': 'Vaavu Atoll',
                'latitude': 3.2167,
                'longitude': 73.4333,
                'is_featured': False,
                'is_active': True,
            },
            {
                'name': 'Guraidhoo',
                'description': 'A local island known for its surfing spots, beautiful beaches, and authentic Maldivian culture.',
                'island': 'Guraidhoo',
                'atoll': 'South Malé Atoll',
                'latitude': 3.9000,
                'longitude': 73.4667,
                'is_featured': False,
                'is_active': True,
            },
        ]

        created_count = 0
        updated_count = 0

        for dest_data in destinations_data:
            destination, created = Destination.objects.get_or_create(
                name=dest_data['name'],
                defaults=dest_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created destination: {destination.name}')
                )
            else:
                # Update existing destination
                for key, value in dest_data.items():
                    setattr(destination, key, value)
                destination.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated destination: {destination.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed destinations. Created: {created_count}, Updated: {updated_count}'
            )
        )
