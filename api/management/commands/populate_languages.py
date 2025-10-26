from django.core.management.base import BaseCommand
from api.models import Language, RegionalSettings, CulturalContent, TranslationKey, Translation
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Populate initial language data and basic translations'

    def handle(self, *args, **options):
        self.stdout.write('Creating languages...')
        
        # Create languages
        languages_data = [
            {
                'code': 'en',
                'name': 'English',
                'native_name': 'English',
                'flag': '🇺🇸',
                'direction': 'ltr',
                'is_default': True,
                'is_active': True
            },
            {
                'code': 'ru',
                'name': 'Russian',
                'native_name': 'Русский',
                'flag': '🇷🇺',
                'direction': 'ltr',
                'is_default': False,
                'is_active': True
            },
            {
                'code': 'zh',
                'name': 'Chinese',
                'native_name': '中文',
                'flag': '🇨🇳',
                'direction': 'ltr',
                'is_default': False,
                'is_active': True
            }
        ]
        
        languages = {}
        for lang_data in languages_data:
            language, created = Language.objects.get_or_create(
                code=lang_data['code'],
                defaults=lang_data
            )
            languages[lang_data['code']] = language
            if created:
                self.stdout.write(f'Created language: {language.name}')
            else:
                self.stdout.write(f'Language already exists: {language.name}')
        
        # Create regional settings
        self.stdout.write('Creating regional settings...')
        
        regional_settings_data = [
            {
                'language': languages['en'],
                'currency_code': 'USD',
                'currency_symbol': '$',
                'date_format': 'MM/DD/YYYY',
                'time_format': '12',
                'timezone': 'UTC',
                'phone_format': '+1 (XXX) XXX-XXXX'
            },
            {
                'language': languages['ru'],
                'currency_code': 'RUB',
                'currency_symbol': '₽',
                'date_format': 'DD.MM.YYYY',
                'time_format': '24',
                'timezone': 'Europe/Moscow',
                'phone_format': '+7 (XXX) XXX-XX-XX'
            },
            {
                'language': languages['zh'],
                'currency_code': 'CNY',
                'currency_symbol': '¥',
                'date_format': 'YYYY-MM-DD',
                'time_format': '24',
                'timezone': 'Asia/Shanghai',
                'phone_format': '+86 XXX-XXXX-XXXX'
            }
        ]
        
        for settings_data in regional_settings_data:
            settings, created = RegionalSettings.objects.get_or_create(
                language=settings_data['language'],
                defaults=settings_data
            )
            if created:
                self.stdout.write(f'Created regional settings for {settings.language.name}')
        
        # Create basic translation keys
        self.stdout.write('Creating translation keys...')
        
        translation_keys = [
            'homepage.hero.title',
            'homepage.hero.subtitle',
            'homepage.hero.cta',
            'navigation.home',
            'navigation.packages',
            'navigation.transportation',
            'navigation.contact',
            'navigation.about',
            'footer.contact',
            'footer.follow_us',
            'footer.newsletter',
            'common.book_now',
            'common.view_details',
            'common.loading',
            'common.error',
            'common.success',
            'packages.title',
            'packages.subtitle',
            'properties.title',
            'properties.subtitle',
            'contact.title',
            'contact.subtitle',
            'about.title',
            'about.subtitle',
            'faq.title',
            'faq.subtitle',
            'transportation.title',
            'transportation.subtitle'
        ]
        
        for key in translation_keys:
            translation_key, created = TranslationKey.objects.get_or_create(
                key=key,
                defaults={
                    'description': f'Translation key for {key}',
                    'context': key.split('.')[0]
                }
            )
            if created:
                self.stdout.write(f'Created translation key: {key}')
        
        # Create basic translations for English
        self.stdout.write('Creating English translations...')
        
        english_translations = {
            'homepage.hero.title': 'Discover Paradise in the Maldives',
            'homepage.hero.subtitle': 'Experience luxury, adventure, and unforgettable moments in the world\'s most beautiful islands',
            'homepage.hero.cta': 'Start Your Journey',
            'navigation.home': 'Home',
            'navigation.packages': 'Packages',
            'navigation.transportation': 'Transportation',
            'navigation.contact': 'Contact',
            'navigation.about': 'About',
            'footer.contact': 'Contact Us',
            'footer.follow_us': 'Follow Us',
            'footer.newsletter': 'Newsletter',
            'common.book_now': 'Book Now',
            'common.view_details': 'View Details',
            'common.loading': 'Loading...',
            'common.error': 'An error occurred',
            'common.success': 'Success!',
            'packages.title': 'Travel Packages',
            'packages.subtitle': 'Choose from our carefully curated selection of Maldives experiences',
            'properties.title': 'Accommodations',
            'properties.subtitle': 'Find your perfect stay in paradise',
            'contact.title': 'Contact Us',
            'contact.subtitle': 'Get in touch with our travel experts',
            'about.title': 'About Thread Travels',
            'about.subtitle': 'Your trusted partner for Maldives adventures',
            'faq.title': 'Frequently Asked Questions',
            'faq.subtitle': 'Everything you need to know about traveling to the Maldives',
            'transportation.title': 'Transportation',
            'transportation.subtitle': 'Getting around the Maldives made easy'
        }
        
        # Get or create a user for translations
        user, created = User.objects.get_or_create(
            username='system',
            defaults={
                'email': 'system@threadtravels.mv',
                'first_name': 'System',
                'last_name': 'User'
            }
        )
        
        for key, value in english_translations.items():
            translation_key = TranslationKey.objects.get(key=key)
            translation, created = Translation.objects.get_or_create(
                key=translation_key,
                language=languages['en'],
                defaults={
                    'value': value,
                    'is_approved': True,
                    'created_by': user
                }
            )
            if created:
                self.stdout.write(f'Created English translation: {key}')
        
        # Create cultural content
        self.stdout.write('Creating cultural content...')
        
        cultural_content_data = [
            {
                'language': languages['en'],
                'content_type': 'customs',
                'title': 'Local Customs in the Maldives',
                'content': 'The Maldives is a Muslim country, so it\'s important to respect local customs. Dress modestly when visiting local islands, remove shoes before entering homes, and avoid public displays of affection.',
                'order': 1
            },
            {
                'language': languages['en'],
                'content_type': 'etiquette',
                'title': 'Cultural Etiquette',
                'content': 'Greet people with a smile and handshake. Use your right hand for eating and giving/receiving items. Always ask permission before taking photos of locals.',
                'order': 2
            },
            {
                'language': languages['en'],
                'content_type': 'language',
                'title': 'Language Tips',
                'content': 'While English is widely spoken in tourist areas, learning a few basic Dhivehi phrases like "Hello" (Assalaamu alaikum) and "Thank you" (Shukuriyaa) will be appreciated by locals.',
                'order': 3
            }
        ]
        
        for content_data in cultural_content_data:
            content, created = CulturalContent.objects.get_or_create(
                language=content_data['language'],
                content_type=content_data['content_type'],
                title=content_data['title'],
                defaults=content_data
            )
            if created:
                self.stdout.write(f'Created cultural content: {content.title}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated language data!')
        )
