from django.core.management.base import BaseCommand
from api.models import Package, Location, PackageDestination

class Command(BaseCommand):
    help = 'Populate sample package destinations data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample package destinations...')
        
        # Get or create some locations
        locations = []
        
        # Maafushi
        maafushi, created = Location.objects.get_or_create(
            island='Maafushi',
            defaults={
                'atoll': 'South Male Atoll',
                'latitude': 3.2028,
                'longitude': 73.2206
            }
        )
        locations.append(maafushi)
        
        # Hulhumale
        hulhumale, created = Location.objects.get_or_create(
            island='Hulhumale',
            defaults={
                'atoll': 'North Male Atoll',
                'latitude': 4.2125,
                'longitude': 73.5403
            }
        )
        locations.append(hulhumale)
        
        # Fihalhohi
        fihalhohi, created = Location.objects.get_or_create(
            island='Fihalhohi',
            defaults={
                'atoll': 'South Male Atoll',
                'latitude': 3.2167,
                'longitude': 73.2333
            }
        )
        locations.append(fihalhohi)
        
        # Get existing packages
        packages = Package.objects.all()
        
        if not packages.exists():
            self.stdout.write(self.style.WARNING('No packages found. Please create packages first.'))
            return
        
        # Create sample destinations for each package
        for package in packages:
            # Clear existing destinations for this package
            PackageDestination.objects.filter(package=package).delete()
            
            # Create 1-3 destinations per package
            num_destinations = min(3, len(locations))
            
            for i in range(num_destinations):
                location = locations[i]
                
                destination = PackageDestination.objects.create(
                    package=package,
                    location=location,
                    duration=i + 1,
                    description=f"Experience the beauty of {location.island} with its pristine beaches and crystal clear waters. This destination offers a perfect blend of adventure and relaxation.",
                    highlights=[
                        f"Stunning beaches of {location.island}",
                        "Crystal clear turquoise waters",
                        "Abundant marine life",
                        "Local island culture",
                        "Water sports activities"
                    ],
                    activities=[
                        "Snorkeling with colorful fish",
                        "Sunset beach walks",
                        "Local island tours",
                        "Water sports (kayaking, paddleboarding)",
                        "Traditional Maldivian dinner"
                    ]
                )
                
                self.stdout.write(f'Created destination: {destination}')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created package destinations for {packages.count()} packages'))
