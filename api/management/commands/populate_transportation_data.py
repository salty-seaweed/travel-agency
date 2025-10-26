from django.core.management.base import BaseCommand
from api.models import (
    TransferType, AtollTransfer, ResortTransfer, TransferFAQ, TransferContactMethod,
    TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent
)

class Command(BaseCommand):
    help = 'Populate transportation data with sample content'

    def handle(self, *args, **options):
        self.stdout.write('Populating transportation data...')
        
        # Create Transfer Types
        transfer_types_data = [
            {
                'name': 'Speedboat Transfers',
                'description': 'Fast and efficient transfers for nearby islands and resorts',
                'icon': 'SparklesIcon',
                'gradient': 'from-blue-500 to-indigo-600',
                'features': [
                    '15-60 minutes travel time',
                    'Available 24/7 for resort guests',
                    'Comfortable seating with shade',
                    'Life jackets provided',
                    'Direct transfers from airport',
                    'Suitable for all weather conditions'
                ],
                'pricing_range': 'From $50 to $300 per person',
                'best_for': 'Resort transfers, nearby islands',
                'pros': ['Fastest option for nearby destinations', 'Flexible scheduling', 'Direct service'],
                'cons': ['Limited to nearby islands', 'Weather dependent', 'Can be expensive'],
                'order': 1
            },
            {
                'name': 'Public Ferry Services',
                'description': 'Budget-friendly transportation between local islands',
                'icon': 'GlobeAltIcon',
                'gradient': 'from-green-500 to-emerald-600',
                'features': [
                    'Scheduled departures (6:00 AM - 6:00 PM)',
                    'Very affordable rates ($2-15)',
                    'Local island connections',
                    'Regular schedules (every 1-2 hours)',
                    'Authentic local experience',
                    'Luggage space available'
                ],
                'pricing_range': 'From $2 to $15 per person',
                'best_for': 'Budget travelers, local island hopping',
                'pros': ['Most affordable option', 'Regular schedules', 'Local experience'],
                'cons': ['Limited schedules', 'Longer travel times', 'Basic amenities'],
                'order': 2
            },
            {
                'name': 'Seaplane Transfers',
                'description': 'Luxury aerial transfers to remote resorts and islands',
                'icon': 'UserGroupIcon',
                'gradient': 'from-purple-500 to-pink-600',
                'features': [
                    'Breathtaking aerial views',
                    'Fast transfers to remote locations',
                    'Luxury experience',
                    'Professional pilots',
                    'Baggage included (20kg limit)',
                    'Resort coordination'
                ],
                'pricing_range': 'From $200 to $500 per person',
                'best_for': 'Luxury resorts, remote islands',
                'pros': ['Stunning views', 'Fast to remote locations', 'Luxury experience'],
                'cons': ['Most expensive option', 'Weather dependent', 'Limited luggage'],
                'order': 3
            },
            {
                'name': 'Domestic Flights',
                'description': 'Domestic air travel between atolls and major islands',
                'icon': 'ShieldCheckIcon',
                'gradient': 'from-indigo-500 to-purple-600',
                'features': [
                    'Inter-atoll connections',
                    'Regular scheduled flights',
                    'Air-conditioned comfort',
                    'Professional service',
                    'Reliable schedules',
                    'Baggage allowance (15kg)'
                ],
                'pricing_range': 'From $80 to $200 per person',
                'best_for': 'Inter-atoll travel, major islands',
                'pros': ['Reliable schedules', 'Comfortable travel', 'Good for long distances'],
                'cons': ['Limited destinations', 'Additional transfer needed', 'Weather dependent'],
                'order': 4
            }
        ]

        for data in transfer_types_data:
            TransferType.objects.get_or_create(
                name=data['name'],
                defaults=data
            )

        # Create Atoll Transfers
        atoll_data = [
            {
                'atoll_name': 'Male Atoll',
                'description': 'The most accessible atoll with the highest concentration of resorts',
                'icon': 'SparklesIcon',
                'gradient': 'from-blue-500 to-indigo-600',
                'order': 1
            },
            {
                'atoll_name': 'Baa Atoll',
                'description': 'UNESCO Biosphere Reserve with luxury resorts and pristine nature',
                'icon': 'GlobeAltIcon',
                'gradient': 'from-green-500 to-emerald-600',
                'order': 2
            },
            {
                'atoll_name': 'Ari Atoll',
                'description': 'Famous for diving and water sports with diverse accommodation options',
                'icon': 'StarIcon',
                'gradient': 'from-purple-500 to-pink-600',
                'order': 3
            },
            {
                'atoll_name': 'Lhaviyani Atoll',
                'description': 'Known for its crystal clear waters and excellent diving spots',
                'icon': 'CheckCircleIcon',
                'gradient': 'from-orange-500 to-red-600',
                'order': 4
            },
            {
                'atoll_name': 'Vaavu Atoll',
                'description': 'Remote atoll with pristine reefs and limited development',
                'icon': 'MapPinIcon',
                'gradient': 'from-teal-500 to-cyan-600',
                'order': 5
            },
            {
                'atoll_name': 'Meemu Atoll',
                'description': 'Traditional Maldivian culture with beautiful beaches',
                'icon': 'GlobeAltIcon',
                'gradient': 'from-yellow-500 to-orange-600',
                'order': 6
            }
        ]

        for data in atoll_data:
            atoll, created = AtollTransfer.objects.get_or_create(
                atoll_name=data['atoll_name'],
                defaults=data
            )

        # Create Resort Transfers for Male Atoll
        male_atoll = AtollTransfer.objects.get(atoll_name='Male Atoll')
        male_resorts = [
            {'resort_name': 'Adaaran Hudhuranfushi', 'price': 130, 'duration': '45 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Adaaran Rannalhi', 'price': 180, 'duration': '60 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Adaaran Vadoo', 'price': 80, 'duration': '25 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Anantara Veli', 'price': 115, 'duration': '40 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Sheraton Full Moon', 'price': 55, 'duration': '15 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Kurumba Maldives', 'price': 58, 'duration': '15 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Paradise Island', 'price': 70, 'duration': '20 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Velassaru', 'price': 90, 'duration': '30 minutes', 'transfer_type': 'speedboat'},
            {'resort_name': 'Hulhumale Ferry', 'price': 2, 'duration': '20 minutes', 'transfer_type': 'ferry'},
            {'resort_name': 'Maafushi Ferry', 'price': 5, 'duration': '90 minutes', 'transfer_type': 'ferry'},
            {'resort_name': 'Gulhi Ferry', 'price': 4, 'duration': '75 minutes', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(male_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=male_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Baa Atoll
        baa_atoll = AtollTransfer.objects.get(atoll_name='Baa Atoll')
        baa_resorts = [
            {'resort_name': 'Dusit Thani Maldives', 'price': 150, 'duration': '2 hours 40 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Four Seasons Landaa Giraavaru', 'price': 180, 'duration': '2 hours 40 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Soneva Fushi', 'price': 104, 'duration': '2 hours 40 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'The Nautilus Maldives', 'price': 180, 'duration': '2 hours 40 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Eydhafushi Ferry', 'price': 8, 'duration': '4 hours', 'transfer_type': 'ferry'},
            {'resort_name': 'Thulhaadhoo Ferry', 'price': 7, 'duration': '3.5 hours', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(baa_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=baa_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Ari Atoll
        ari_atoll = AtollTransfer.objects.get(atoll_name='Ari Atoll')
        ari_resorts = [
            {'resort_name': 'Conrad Maldives Rangali Island', 'price': 220, 'duration': '2 hours 15 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'W Maldives', 'price': 200, 'duration': '2 hours', 'transfer_type': 'seaplane'},
            {'resort_name': 'Lily Beach Resort', 'price': 180, 'duration': '1 hour 45 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Mirihi Island Resort', 'price': 160, 'duration': '1 hour 30 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Maamigili Ferry', 'price': 10, 'duration': '5 hours', 'transfer_type': 'ferry'},
            {'resort_name': 'Mahibadhoo Ferry', 'price': 9, 'duration': '4.5 hours', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(ari_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=ari_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Lhaviyani Atoll
        lhaviyani_atoll = AtollTransfer.objects.get(atoll_name='Lhaviyani Atoll')
        lhaviyani_resorts = [
            {'resort_name': 'Kuredu Island Resort', 'price': 140, 'duration': '1 hour 30 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Komandoo Island Resort', 'price': 150, 'duration': '1 hour 45 minutes', 'transfer_type': 'seaplane'},
            {'resort_name': 'Kunfunadhoo Ferry', 'price': 6, 'duration': '3 hours', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(lhaviyani_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=lhaviyani_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Vaavu Atoll
        vaavu_atoll = AtollTransfer.objects.get(atoll_name='Vaavu Atoll')
        vaavu_resorts = [
            {'resort_name': 'Alimatha Ferry', 'price': 12, 'duration': '6 hours', 'transfer_type': 'ferry'},
            {'resort_name': 'Fulidhoo Ferry', 'price': 11, 'duration': '5.5 hours', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(vaavu_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=vaavu_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Meemu Atoll
        meemu_atoll = AtollTransfer.objects.get(atoll_name='Meemu Atoll')
        meemu_resorts = [
            {'resort_name': 'Muli Ferry', 'price': 13, 'duration': '6.5 hours', 'transfer_type': 'ferry'},
            {'resort_name': 'Veyvah Ferry', 'price': 14, 'duration': '7 hours', 'transfer_type': 'ferry'},
        ]

        for i, resort_data in enumerate(meemu_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=meemu_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': resort_data['transfer_type'],
                    'order': i + 1
                }
            )

        # Create Transfer FAQs
        faq_data = [
            {
                'question': 'How to get to Maldives islands?',
                'answer': 'To reach any island in the Maldives, you will require either a speedboat transfer, seaplane, domestic flight, or public ferry. The choice depends on your destination, budget, and time constraints.',
                'category': 'General',
                'icon': 'MapPinIcon',
                'order': 1
            },
            {
                'question': 'Is there transfer service available at the international airport on arrival to book?',
                'answer': 'No, everything needs to be pre-arranged before your arrival. However, if you are staying in Male or Hulhumale city, you can grab a taxi from the airport.',
                'category': 'Booking',
                'icon': 'ClockIcon',
                'order': 2
            },
            {
                'question': 'Is it safe to travel by sea?',
                'answer': 'Yes, it\'s generally safe to travel by sea. You will have floating life jackets on speedboats, but during stormy weather, it is not recommended to travel by very small boats.',
                'category': 'Safety',
                'icon': 'CheckCircleIcon',
                'order': 3
            },
            {
                'question': 'Why is the Maldives transfer so expensive?',
                'answer': 'Because of the small populations and dispersity, it\'s very difficult to organize daily schedules on different times for an island. Additionally, speedboats consume a lot of fuel.',
                'category': 'Pricing',
                'icon': 'CurrencyDollarIcon',
                'order': 4
            },
            {
                'question': 'What are the ferry schedules?',
                'answer': 'Public ferries typically operate from 6:00 AM to 6:00 PM with departures every 1-2 hours. Schedules vary by route and may be affected by weather conditions.',
                'category': 'Schedules',
                'icon': 'ClockIcon',
                'order': 5
            },
            {
                'question': 'How much luggage can I bring on transfers?',
                'answer': 'Speedboats allow 20kg per person, seaplanes have a 20kg limit, domestic flights allow 15kg, and ferries have no strict limit but space is limited.',
                'category': 'Luggage',
                'icon': 'InformationCircleIcon',
                'order': 6
            },
            {
                'question': 'Do I need to book transfers in advance?',
                'answer': 'Yes, all transfers should be booked at least 48 hours in advance, especially for seaplanes and speedboats. Ferry tickets can be purchased on the day of travel.',
                'category': 'Booking',
                'icon': 'ShieldCheckIcon',
                'order': 7
            },
            {
                'question': 'What happens if my transfer is cancelled due to weather?',
                'answer': 'In case of weather-related cancellations, we will reschedule your transfer at no additional cost. We monitor weather conditions and provide updates.',
                'category': 'Weather',
                'icon': 'ExclamationTriangleIcon',
                'order': 8
            }
        ]

        for data in faq_data:
            TransferFAQ.objects.get_or_create(
                question=data['question'],
                defaults=data
            )

        # Create Contact Methods
        contact_methods_data = [
            {
                'method': 'WhatsApp',
                'icon': 'ChatBubbleLeftRightIcon',
                'color': 'green',
                'contact': '+960 777-7777',
                'description': 'Fastest response time, available 24/7',
                'response_time': 'Within 5 minutes',
                'order': 1
            },
            {
                'method': 'Phone',
                'icon': 'PhoneIcon',
                'color': 'blue',
                'contact': '+960 777-7777',
                'description': 'Direct conversation with our team',
                'response_time': 'Immediate',
                'order': 2
            },
            {
                'method': 'Email',
                'icon': 'EnvelopeIcon',
                'color': 'purple',
                'contact': 'transfers@threadtravels.com',
                'description': 'Detailed inquiries and documentation',
                'response_time': 'Within 2 hours',
                'order': 3
            }
        ]

        for data in contact_methods_data:
            TransferContactMethod.objects.get_or_create(
                method=data['method'],
                defaults=data
            )

        # Create Booking Steps
        booking_steps_data = [
            {
                'step_number': 1,
                'title': 'Pre-Arrival Booking',
                'description': 'Arrange your transfer before arriving in the Maldives',
                'icon': 'ShieldCheckIcon',
                'details': [
                    'Contact us at least 48 hours before arrival',
                    'Provide flight details and arrival time',
                    'Confirm resort/hotel destination',
                    'Receive transfer confirmation',
                    'Save emergency contact numbers'
                ],
                'tips': 'Early booking ensures availability and better rates'
            },
            {
                'step_number': 2,
                'title': 'Airport Arrival',
                'description': 'What to expect when you arrive at Male International Airport',
                'icon': 'MapPinIcon',
                'details': [
                    'Clear immigration and customs',
                    'Collect luggage from baggage claim',
                    'Look for our representative with signboard',
                    'Proceed to transfer counter if needed',
                    'Wait for transfer vehicle/boat'
                ],
                'tips': 'Our team will be waiting with your name on a signboard'
            },
            {
                'step_number': 3,
                'title': 'Transfer Process',
                'description': 'The actual transfer journey to your destination',
                'icon': 'SparklesIcon',
                'details': [
                    'Board the designated transfer vehicle',
                    'Safety briefing and life jacket fitting',
                    'Comfortable journey with refreshments',
                    'Arrival at your destination',
                    'Assistance with luggage'
                ],
                'tips': 'All transfers include safety equipment and professional crew'
            },
            {
                'step_number': 4,
                'title': 'Return Transfer',
                'description': 'Arranging your departure transfer',
                'icon': 'ClockIcon',
                'details': [
                    'Confirm departure time with resort',
                    'Coordinate with flight departure time',
                    'Pack and prepare for departure',
                    'Board return transfer vehicle',
                    'Arrive at airport with sufficient time'
                ],
                'tips': 'Allow extra time for weather delays and security checks'
            }
        ]

        for data in booking_steps_data:
            TransferBookingStep.objects.get_or_create(
                step_number=data['step_number'],
                defaults=data
            )

        # Create Benefits
        benefits_data = [
            {
                'benefit': '24/7 Support',
                'description': 'Round-the-clock assistance for all your transfer needs',
                'icon': 'ClockIcon',
                'color': 'blue',
                'order': 1
            },
            {
                'benefit': 'Competitive Rates',
                'description': 'Best prices guaranteed with transparent pricing',
                'icon': 'ShieldCheckIcon',
                'color': 'green',
                'order': 2
            },
            {
                'benefit': 'Flexible Options',
                'description': 'Multiple transfer types and scheduling options',
                'icon': 'SparklesIcon',
                'color': 'purple',
                'order': 3
            },
            {
                'benefit': 'Safety Assured',
                'description': 'Licensed operators with full safety equipment',
                'icon': 'CheckCircleIcon',
                'color': 'orange',
                'order': 4
            }
        ]

        for data in benefits_data:
            TransferBenefit.objects.get_or_create(
                benefit=data['benefit'],
                defaults=data
            )

        # Create Pricing Factors
        pricing_factors_data = [
            {
                'factor': 'Distance',
                'description': 'Longer distances generally cost more due to fuel consumption and time',
                'icon': 'MapPinIcon',
                'impact': 'High',
                'examples': ['Male to nearby islands: $50-80', 'Male to Baa Atoll: $150-200', 'Male to Ari Atoll: $200-300'],
                'order': 1
            },
            {
                'factor': 'Transfer Type',
                'description': 'Different transportation methods have different costs and luxury levels',
                'icon': 'SparklesIcon',
                'impact': 'High',
                'examples': ['Speedboat: $50-300', 'Seaplane: $200-500', 'Ferry: $2-25', 'Domestic Flight: $80-200'],
                'order': 2
            },
            {
                'factor': 'Season',
                'description': 'Peak season may have higher rates due to increased demand',
                'icon': 'StarIcon',
                'impact': 'Medium',
                'examples': ['Peak season (Dec-Apr): +10-20%', 'Off-season (May-Nov): Standard rates', 'Holiday periods: +15-25%'],
                'order': 3
            },
            {
                'factor': 'Group Size',
                'description': 'Larger groups may qualify for discounts or require special arrangements',
                'icon': 'UserGroupIcon',
                'impact': 'Medium',
                'examples': ['Individual travelers: Standard rates', 'Groups 4-8: 5-10% discount', 'Groups 8+: Custom pricing'],
                'order': 4
            },
            {
                'factor': 'Time of Day',
                'description': 'Early morning or late evening transfers may have different rates',
                'icon': 'ClockIcon',
                'impact': 'Low',
                'examples': ['Regular hours (6AM-6PM): Standard rates', 'After hours: +15-25%', 'Emergency transfers: +50%'],
                'order': 5
            }
        ]

        for data in pricing_factors_data:
            TransferPricingFactor.objects.get_or_create(
                factor=data['factor'],
                defaults=data
            )

        # Create Content Sections
        content_data = [
            {
                'section': 'hero',
                'title': 'Maldives Transportation & Transfers',
                'subtitle': 'Your complete guide to getting around the Maldives',
                'description': 'From speedboat transfers to seaplane flights, we provide comprehensive transportation services to make your island hopping seamless and memorable.',
                'badge_text': 'Maldives Transportation Guide',
                'badge_icon': 'SparklesIcon',
                'order': 1
            },
            {
                'section': 'transfer_types',
                'title': 'Types of Transfers in Maldives',
                'subtitle': 'Transportation Options',
                'description': 'From budget-friendly ferries to luxury seaplane transfers, discover the perfect transportation option for your Maldives adventure.',
                'badge_text': 'Transportation Options',
                'badge_icon': 'SparklesIcon',
                'order': 2
            },
            {
                'section': 'atoll_transfers',
                'title': 'Atoll Transfer Information',
                'subtitle': 'Atoll Transfer Guide',
                'description': 'Comprehensive transfer information for major atolls in the Maldives. Find the perfect transfer option for your chosen destination.',
                'badge_text': 'Atoll Transfer Guide',
                'badge_icon': 'MapPinIcon',
                'order': 3
            },
            {
                'section': 'transfer_guide',
                'title': 'How to Arrange Your Transfer',
                'subtitle': 'Complete Transfer Guide',
                'description': 'A step-by-step guide to arranging and using transfers in the Maldives. From pre-booking to arrival, we cover everything you need to know.',
                'badge_text': 'Complete Transfer Guide',
                'badge_icon': 'InformationCircleIcon',
                'order': 4
            },
            {
                'section': 'pricing',
                'title': 'Transfer Pricing & Costs',
                'subtitle': 'Transfer Pricing Guide',
                'description': 'Transparent pricing information for all types of transfers in the Maldives. Understand the costs and factors that influence transfer pricing.',
                'badge_text': 'Transfer Pricing Guide',
                'badge_icon': 'CurrencyDollarIcon',
                'order': 5
            },
            {
                'section': 'faq',
                'title': 'Transfer FAQ',
                'subtitle': 'Frequently Asked Questions',
                'description': 'Find answers to the most common questions about transfers in the Maldives. Everything you need to know about getting around the islands.',
                'badge_text': 'Frequently Asked Questions',
                'badge_icon': 'InformationCircleIcon',
                'order': 6
            },
            {
                'section': 'booking',
                'title': 'Ready to Book Your Transfer?',
                'subtitle': 'Book Your Transfer',
                'description': 'Secure your Maldives transfer with Thread Travels. Our simple booking process ensures a smooth and reliable transportation experience.',
                'badge_text': 'Book Your Transfer',
                'badge_icon': 'SparklesIcon',
                'order': 7
            }
        ]

        for data in content_data:
            TransferContent.objects.get_or_create(
                section=data['section'],
                defaults=data
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated transportation data!')
        ) 