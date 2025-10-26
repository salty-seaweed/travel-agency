from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import (
    HomepageHero, HomepageFeature, HomepageTestimonial, 
    HomepageStatistic, HomepageCTASection, HomepageSettings
)


class Command(BaseCommand):
    help = 'Populate sample homepage data for testing'

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write('Creating sample homepage data...')

            # Create Homepage Hero
            hero, created = HomepageHero.objects.get_or_create(
                id=1,
                defaults={
                    'title': 'Discover Your Perfect Maldives Paradise',
                    'subtitle': 'Luxury Travel & Unforgettable Experiences',
                    'description': 'Experience the ultimate Maldives getaway with Thread Travels & Tours. From pristine beaches to luxury resorts, we create unforgettable memories in paradise.',
                    'cta_primary_text': 'Start Your Journey',
                    'cta_primary_url': '/packages',
                    'cta_secondary_text': 'View Properties',
                    'cta_secondary_url': '/properties',
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'✓ Created hero section: {hero.title}')
            else:
                self.stdout.write(f'✓ Hero section already exists: {hero.title}')

            # Create Homepage Features
            features_data = [
                {
                    'title': 'Luxury Accommodations',
                    'description': 'Handpicked resorts and guesthouses offering the perfect blend of comfort and luxury.',
                    'icon': 'BuildingOffice2Icon',
                    'link_url': '/properties',
                    'order': 1,
                },
                {
                    'title': 'Exclusive Packages',
                    'description': 'Curated travel packages combining multiple experiences for the ultimate adventure.',
                    'icon': 'GiftIcon',
                    'link_url': '/packages',
                    'order': 2,
                },
                {
                    'title': 'Expert Guidance',
                    'description': 'Local experts with deep knowledge of the Maldives to ensure your perfect trip.',
                    'icon': 'UsersIcon',
                    'link_url': '/contact',
                    'order': 3,
                },
                {
                    'title': 'Seamless Transportation',
                    'description': 'Comprehensive transportation services including speedboats, seaplanes, and transfers.',
                    'icon': 'GlobeAltIcon',
                    'link_url': '/transportation',
                    'order': 4,
                },
            ]

            for feature_data in features_data:
                feature, created = HomepageFeature.objects.get_or_create(
                    title=feature_data['title'],
                    defaults={
                        'description': feature_data['description'],
                        'icon': feature_data['icon'],
                        'link_url': feature_data['link_url'],
                        'order': feature_data['order'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(f'✓ Created feature: {feature.title}')
                else:
                    self.stdout.write(f'✓ Feature already exists: {feature.title}')

            # Create Homepage Testimonials
            testimonials_data = [
                {
                    'name': 'Sarah Johnson',
                    'role': 'Travel Enthusiast',
                    'company': 'Adventure Seekers',
                    'content': 'Thread Travels made our Maldives dream come true! The attention to detail and personalized service exceeded all expectations.',
                    'rating': 5,
                    'order': 1,
                },
                {
                    'name': 'Michael Chen',
                    'role': 'Business Executive',
                    'company': 'TechCorp',
                    'content': 'Professional, reliable, and absolutely stunning accommodations. Our corporate retreat was a huge success thanks to Thread Travels.',
                    'rating': 5,
                    'order': 2,
                },
                {
                    'name': 'Emma Rodriguez',
                    'role': 'Honeymooner',
                    'company': '',
                    'content': 'Our honeymoon was perfect! The team at Thread Travels created a romantic and unforgettable experience in paradise.',
                    'rating': 5,
                    'order': 3,
                },
            ]

            for testimonial_data in testimonials_data:
                testimonial, created = HomepageTestimonial.objects.get_or_create(
                    name=testimonial_data['name'],
                    defaults={
                        'role': testimonial_data['role'],
                        'company': testimonial_data['company'],
                        'content': testimonial_data['content'],
                        'rating': testimonial_data['rating'],
                        'order': testimonial_data['order'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(f'✓ Created testimonial: {testimonial.name}')
                else:
                    self.stdout.write(f'✓ Testimonial already exists: {testimonial.name}')

            # Create Homepage Statistics
            statistics_data = [
                {
                    'label': 'Happy Travelers',
                    'value': '500+',
                    'icon': 'UsersIcon',
                    'order': 1,
                },
                {
                    'label': 'Luxury Properties',
                    'value': '50+',
                    'icon': 'BuildingOffice2Icon',
                    'order': 2,
                },
                {
                    'label': 'Years Experience',
                    'value': '10+',
                    'icon': 'ClockIcon',
                    'order': 3,
                },
                {
                    'label': 'Satisfaction Rate',
                    'value': '98%',
                    'icon': 'StarIcon',
                    'order': 4,
                },
            ]

            for statistic_data in statistics_data:
                statistic, created = HomepageStatistic.objects.get_or_create(
                    label=statistic_data['label'],
                    defaults={
                        'value': statistic_data['value'],
                        'icon': statistic_data['icon'],
                        'order': statistic_data['order'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(f'✓ Created statistic: {statistic.label}')
                else:
                    self.stdout.write(f'✓ Statistic already exists: {statistic.label}')

            # Create Homepage CTA Section
            cta, created = HomepageCTASection.objects.get_or_create(
                id=1,
                defaults={
                    'title': 'Ready to Start Your Maldives Adventure?',
                    'description': 'Join hundreds of satisfied travelers who have experienced the magic of the Maldives with Thread Travels & Tours.',
                    'cta_primary_text': 'Book Now',
                    'cta_primary_url': '/packages',
                    'cta_secondary_text': 'Contact Us',
                    'cta_secondary_url': '/contact',
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'✓ Created CTA section: {cta.title}')
            else:
                self.stdout.write(f'✓ CTA section already exists: {cta.title}')

            # Create Homepage Settings
            settings, created = HomepageSettings.objects.get_or_create(
                id=1,
                defaults={
                    'site_title': 'Thread Travels & Tours',
                    'site_description': 'Your trusted partner for luxury Maldives travel experiences. Discover pristine beaches, luxury resorts, and unforgettable adventures.',
                    'site_keywords': 'Maldives, luxury travel, resorts, vacation, paradise, tourism, Thread Travels',
                    'contact_email': 'info@threadtravels.com',
                            'contact_phone': '+960 744 1097',
        'whatsapp_number': '+960 744 1097',
                    'social_facebook': 'https://facebook.com/threadtravels',
                    'social_instagram': 'https://instagram.com/threadtravels',
                    'social_twitter': 'https://twitter.com/threadtravels',
                    'social_linkedin': 'https://linkedin.com/company/threadtravels',
                    'footer_text': '© 2024 Thread Travels & Tours. All rights reserved. Your trusted partner for luxury Maldives experiences.',
                }
            )
            if created:
                self.stdout.write(f'✓ Created site settings')
            else:
                self.stdout.write(f'✓ Site settings already exist')

            self.stdout.write(
                self.style.SUCCESS('Successfully populated homepage data!')
            ) 