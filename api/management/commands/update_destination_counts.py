from django.core.management.base import BaseCommand
from api.models import Destination

class Command(BaseCommand):
    help = 'Update property and package counts for all destinations'

    def handle(self, *args, **options):
        self.stdout.write('Updating destination counts...')
        
        # Update all destination counts
        Destination.update_all_counts()
        
        # Print the results
        destinations = Destination.objects.all()
        for destination in destinations:
            self.stdout.write(
                f'{destination.name}: {destination.property_count} properties, {destination.package_count} packages'
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated counts for {destinations.count()} destinations')
        )
