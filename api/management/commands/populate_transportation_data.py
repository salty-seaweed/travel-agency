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
                    'Scheduled departures',
                    'Very affordable rates',
                    'Local island connections',
                    'Regular schedules',
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
                    'Baggage included',
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
                'gradient': 'from-orange-500 to-red-600',
                'features': [
                    'Inter-atoll connections',
                    'Regular scheduled flights',
                    'Air-conditioned comfort',
                    'Professional service',
                    'Reliable schedules',
                    'Baggage allowance'
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
            {'resort_name': 'Adaaran Hudhuranfushi', 'price': 130, 'duration': '45 minutes'},
            {'resort_name': 'Adaaran Rannalhi', 'price': 180, 'duration': '60 minutes'},
            {'resort_name': 'Adaaran Vadoo', 'price': 80, 'duration': '25 minutes'},
            {'resort_name': 'Anantara Veli', 'price': 115, 'duration': '40 minutes'},
            {'resort_name': 'Sheraton Full Moon', 'price': 55, 'duration': '15 minutes'},
            {'resort_name': 'Kurumba Maldives', 'price': 58, 'duration': '15 minutes'},
            {'resort_name': 'Paradise Island', 'price': 70, 'duration': '20 minutes'},
            {'resort_name': 'Velassaru', 'price': 90, 'duration': '30 minutes'},
        ]

        for i, resort_data in enumerate(male_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=male_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': 'speedboat',
                    'order': i + 1
                }
            )

        # Create Resort Transfers for Baa Atoll
        baa_atoll = AtollTransfer.objects.get(atoll_name='Baa Atoll')
        baa_resorts = [
            {'resort_name': 'Dusit Thani Maldives', 'price': 150, 'duration': '2 hours 40 minutes'},
            {'resort_name': 'Four Seasons Landaa Giraavaru', 'price': 180, 'duration': '2 hours 40 minutes'},
            {'resort_name': 'Soneva Fushi', 'price': 104, 'duration': '2 hours 40 minutes'},
            {'resort_name': 'The Nautilus Maldives', 'price': 180, 'duration': '2 hours 40 minutes'},
        ]

        for i, resort_data in enumerate(baa_resorts):
            ResortTransfer.objects.get_or_create(
                resort_name=resort_data['resort_name'],
                atoll=baa_atoll,
                defaults={
                    'price': resort_data['price'],
                    'duration': resort_data['duration'],
                    'transfer_type': 'seaplane',
                    'order': i + 1
                }
            )

        # Create Transfer FAQs
        faq_data = [
            {
                'question': 'How to get to Maldives islands?',
                'answer': 'To reach any island in the Maldives, you will require either a speedboat transfer or a domestic flight. The choice depends on your destination and budget.',
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
                'answer': 'I can tell you it\'s safer than flights. You will have floating life jackets on speedboats, but during stormy weather, it is not recommended to travel by very small boats.',
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
                'description': 'Longer distances generally cost more',
                'icon': 'MapPinIcon',
                'impact': 'High',
                'examples': ['Male to nearby islands: $50-80', 'Male to Baa Atoll: $150-200', 'Male to Ari Atoll: $200-300'],
                'order': 1
            },
            {
                'factor': 'Transfer Type',
                'description': 'Different transportation methods have different costs',
                'icon': 'SparklesIcon',
                'impact': 'High',
                'examples': ['Speedboat: $50-300', 'Seaplane: $200-500', 'Ferry: $2-25'],
                'order': 2
            },
            {
                'factor': 'Season',
                'description': 'Peak season may have higher rates',
                'icon': 'StarIcon',
                'impact': 'Medium',
                'examples': ['Peak season (Dec-Apr): +10-20%', 'Off-season (May-Nov): Standard rates', 'Holiday periods: +15-25%'],
                'order': 3
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