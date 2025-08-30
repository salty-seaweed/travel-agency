# Backend Internationalization Implementation Guide

This guide provides comprehensive documentation for the backend internationalization system implemented for your Maldives travel agency website.

## 🎯 Overview

The internationalization system provides:
- **Multi-language support** for English, Russian, and Chinese
- **Dynamic translation management** with approval workflow
- **Cultural content** specific to each region
- **Regional settings** for currency, date formats, and timezones
- **Localized pages** and FAQs
- **Language detection** and user preferences

## 📋 Database Models

### Core Internationalization Models

#### 1. Language Model
```python
class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)  # 'en', 'ru', 'zh'
    name = models.CharField(max_length=100)              # 'English', 'Russian', 'Chinese'
    native_name = models.CharField(max_length=100)       # 'English', 'Русский', '中文'
    flag = models.CharField(max_length=10)               # '🇺🇸', '🇷🇺', '🇨🇳'
    direction = models.CharField(max_length=3)           # 'ltr' or 'rtl'
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
```

#### 2. TranslationKey Model
```python
class TranslationKey(models.Model):
    key = models.CharField(max_length=200, unique=True)  # 'homepage.hero.title'
    description = models.TextField(blank=True)
    context = models.CharField(max_length=100, blank=True)  # 'homepage', 'navigation'
    is_active = models.BooleanField(default=True)
```

#### 3. Translation Model
```python
class Translation(models.Model):
    key = models.ForeignKey(TranslationKey, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    value = models.TextField()                           # Actual translated text
    is_approved = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL)
```

#### 4. CulturalContent Model
```python
class CulturalContent(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=50)       # 'customs', 'etiquette', 'language'
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
```

#### 5. RegionalSettings Model
```python
class RegionalSettings(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    currency_code = models.CharField(max_length=3)       # 'USD', 'RUB', 'CNY'
    currency_symbol = models.CharField(max_length=5)     # '$', '₽', '¥'
    date_format = models.CharField(max_length=20)        # 'MM/DD/YYYY'
    time_format = models.CharField(max_length=10)        # '12' or '24'
    timezone = models.CharField(max_length=50)           # 'UTC', 'Europe/Moscow'
    phone_format = models.CharField(max_length=50)       # '+1 (XXX) XXX-XXXX'
```

#### 6. LocalizedPage Model
```python
class LocalizedPage(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    page_type = models.CharField(max_length=50)          # 'about', 'contact', 'faq'
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
```

#### 7. LocalizedFAQ Model
```python
class LocalizedFAQ(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
```

### Enhanced Existing Models

The following models have been enhanced with internationalization support:

#### Destination Model
```python
class Destination(models.Model):
    # ... existing fields ...
    language = models.ForeignKey(Language, on_delete=models.CASCADE, null=True, blank=True)
    localized_name = models.CharField(max_length=100, blank=True)
    localized_description = models.TextField(blank=True)
```

#### Package Model
```python
class Package(models.Model):
    # ... existing fields ...
    language = models.ForeignKey(Language, on_delete=models.CASCADE, null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True)
    localized_description = models.TextField(blank=True)
    localized_highlights = models.JSONField(default=list, blank=True)
    localized_included = models.JSONField(default=list, blank=True)
```

#### Property Model
```python
class Property(models.Model):
    # ... existing fields ...
    language = models.ForeignKey(Language, on_delete=models.CASCADE, null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True)
    localized_description = models.TextField(blank=True)
    localized_amenities = models.JSONField(default=list, blank=True)
```

## 🔌 API Endpoints

### Language Management

#### Get All Supported Languages
```http
GET /api/languages/
```
**Response:**
```json
[
  {
    "id": 1,
    "code": "en",
    "name": "English",
    "native_name": "English",
    "flag": "🇺🇸",
    "direction": "ltr",
    "is_active": true,
    "is_default": true
  }
]
```

#### Get Specific Language
```http
GET /api/languages/{code}/
```

### Translation Management

#### Get Translations for Language
```http
GET /api/translations/?lang=en&context=homepage
```
**Response:**
```json
{
  "homepage": {
    "hero": {
      "title": "Discover Paradise in the Maldives",
      "subtitle": "Experience luxury, adventure, and unforgettable moments"
    }
  }
}
```

#### Create Translation
```http
POST /api/translations/create/
Content-Type: application/json

{
  "key": "homepage.hero.title",
  "value": "Discover Paradise in the Maldives",
  "language": "en"
}
```

#### Bulk Update Translations
```http
POST /api/translations/bulk/
Content-Type: application/json

{
  "language_code": "en",
  "translations": {
    "homepage.hero.title": "Discover Paradise in the Maldives",
    "homepage.hero.subtitle": "Experience luxury and adventure"
  }
}
```

#### Export Translations
```http
GET /api/translations/export/?language_code=en&format=json
```

#### Import Translations
```http
POST /api/translations/import/
Content-Type: multipart/form-data

language_code: en
file: [translation_file.json]
overwrite: false
```

#### Get Translation Statistics
```http
GET /api/translations/stats/?lang=en
```
**Response:**
```json
{
  "language_code": "en",
  "total_keys": 150,
  "translated_keys": 120,
  "approved_keys": 100,
  "pending_keys": 20,
  "completion_percentage": 80.0,
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### Cultural Content

#### Get Cultural Content
```http
GET /api/cultural-content/?lang=en&type=customs
```
**Response:**
```json
[
  {
    "id": 1,
    "content_type": "customs",
    "title": "Local Customs in the Maldives",
    "content": "The Maldives is a Muslim country...",
    "language_code": "en",
    "order": 1
  }
]
```

### Regional Settings

#### Get Regional Settings
```http
GET /api/regional-settings/en/
```
**Response:**
```json
{
  "currency_code": "USD",
  "currency_symbol": "$",
  "date_format": "MM/DD/YYYY",
  "time_format": "12",
  "timezone": "UTC",
  "phone_format": "+1 (XXX) XXX-XXXX"
}
```

### Localized Pages

#### Get Localized Page
```http
GET /api/localized-pages/about/en/
```
**Response:**
```json
{
  "id": 1,
  "page_type": "about",
  "title": "About Thread Travels",
  "slug": "about-thread-travels",
  "content": "<p>Thread Travels is your trusted partner...</p>",
  "meta_title": "About Us - Thread Travels",
  "meta_description": "Learn about Thread Travels...",
  "language_code": "en"
}
```

### Localized FAQs

#### Get Localized FAQs
```http
GET /api/localized-faqs/?lang=en&category=booking
```
**Response:**
```json
[
  {
    "id": 1,
    "category": "booking",
    "question": "How do I book a package?",
    "answer": "You can book through our website...",
    "order": 1,
    "language_code": "en"
  }
]
```

### Language Detection

#### Detect Language from Text
```http
POST /api/detect-language/
Content-Type: application/json

{
  "text": "Привет, как дела?",
  "confidence_threshold": 0.8
}
```
**Response:**
```json
{
  "detected_language": "ru",
  "confidence": 0.95,
  "text_length": 15
}
```

### Enhanced Endpoints with Language Support

#### Get Destinations with Language
```http
GET /api/destinations/?lang=ru
```

#### Get Packages with Language
```http
GET /api/packages/?lang=zh
```

#### Get Properties with Language
```http
GET /api/properties/?lang=en
```

## 🚀 Setup Instructions

### 1. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Populate Initial Data
```bash
python manage.py populate_languages
```

This command will:
- Create English, Russian, and Chinese languages
- Set up regional settings for each language
- Create basic translation keys
- Add English translations
- Create cultural content

### 3. Create Superuser (if needed)
```bash
python manage.py createsuperuser
```

### 4. Access Django Admin
Navigate to `/admin/` to manage:
- Languages
- Translation keys and translations
- Cultural content
- Regional settings
- Localized pages and FAQs

## 📊 Translation Workflow

### 1. Create Translation Keys
```python
from api.models import TranslationKey

# Create a new translation key
key = TranslationKey.objects.create(
    key='homepage.hero.title',
    description='Main hero title on homepage',
    context='homepage'
)
```

### 2. Add Translations
```python
from api.models import Translation, Language

# Get language
language = Language.objects.get(code='ru')

# Create translation
translation = Translation.objects.create(
    key=key,
    language=language,
    value='Откройте рай на Мальдивах',
    created_by=user
)
```

### 3. Approve Translations
```python
# Approve translation
translation.is_approved = True
translation.approved_by = admin_user
translation.save()
```

## 🔧 Configuration

### Environment Variables
Add to your `.env` file:
```env
# Internationalization settings
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,ru,zh
TRANSLATION_AUTO_APPROVE=false
CULTURAL_CONTENT_ENABLED=true
```

### Django Settings
Add to `settings.py`:
```python
# Internationalization settings
LANGUAGE_CODE = 'en'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('ru', 'Russian'),
    ('zh', 'Chinese'),
]

# Translation settings
TRANSLATION_AUTO_APPROVE = False
CULTURAL_CONTENT_ENABLED = True
```

## 📱 Frontend Integration

### Using the I18n Service
```typescript
import { i18nService } from '../services/i18n-service';

// Set language
await i18nService.setLanguage('ru');

// Get translation
const title = i18nService.t('homepage.hero.title');

// Get cultural content
const customs = i18nService.getCulturalContent('customs');

// Format currency
const price = i18nService.formatCurrency(1500);

// Format date
const date = i18nService.formatDate(new Date(), 'DD.MM.YYYY');
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import { i18nService } from '../services/i18n-service';

export function useTranslation() {
  const [translations, setTranslations] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const loadTranslations = async () => {
      await i18nService.loadLanguageData();
      setTranslations(i18nService.translations);
      setCurrentLanguage(i18nService.getCurrentLanguage());
    };
    loadTranslations();
  }, []);

  const t = (key: string, params?: Record<string, any>) => {
    return i18nService.t(key, params);
  };

  const setLanguage = async (lang: string) => {
    await i18nService.setLanguage(lang);
    setCurrentLanguage(lang);
    setTranslations(i18nService.translations);
  };

  return { t, setLanguage, currentLanguage, translations };
}
```

## 🧪 Testing

### API Testing
```bash
# Test language endpoints
curl -X GET http://localhost:8000/api/languages/

# Test translations
curl -X GET "http://localhost:8000/api/translations/?lang=en"

# Test cultural content
curl -X GET "http://localhost:8000/api/cultural-content/?lang=en&type=customs"
```

### Unit Testing
```python
from django.test import TestCase
from api.models import Language, TranslationKey, Translation

class TranslationTestCase(TestCase):
    def setUp(self):
        self.language = Language.objects.create(
            code='en',
            name='English',
            is_default=True
        )
        self.key = TranslationKey.objects.create(
            key='test.key',
            description='Test key'
        )

    def test_translation_creation(self):
        translation = Translation.objects.create(
            key=self.key,
            language=self.language,
            value='Test translation'
        )
        self.assertEqual(translation.value, 'Test translation')
```

## 📈 Monitoring and Analytics

### Translation Statistics
```python
from api.models import Translation, TranslationKey, Language

def get_translation_stats(language_code):
    language = Language.objects.get(code=language_code)
    total_keys = TranslationKey.objects.filter(is_active=True).count()
    translated_keys = Translation.objects.filter(language=language).count()
    approved_keys = Translation.objects.filter(
        language=language, 
        is_approved=True
    ).count()
    
    completion_percentage = (translated_keys / total_keys * 100) if total_keys > 0 else 0
    
    return {
        'total_keys': total_keys,
        'translated_keys': translated_keys,
        'approved_keys': approved_keys,
        'completion_percentage': completion_percentage
    }
```

### Missing Translations Report
```python
def get_missing_translations(language_code):
    language = Language.objects.get(code=language_code)
    all_keys = TranslationKey.objects.filter(is_active=True)
    translated_keys = Translation.objects.filter(language=language).values_list('key__key', flat=True)
    
    missing_keys = all_keys.exclude(key__in=translated_keys)
    return missing_keys
```

## 🔒 Security Considerations

### Translation Approval Workflow
- All translations require approval before being displayed
- Only authorized users can approve translations
- Translation history is maintained for audit purposes

### Input Validation
- Translation keys are validated for format and uniqueness
- Translation values are sanitized to prevent XSS
- File uploads for translation imports are validated

### Access Control
- Translation management requires authentication
- Cultural content management requires admin privileges
- Regional settings are read-only for regular users

## 🚀 Performance Optimization

### Caching Strategy
```python
from django.core.cache import cache

def get_translations_with_cache(language_code):
    cache_key = f'translations_{language_code}'
    translations = cache.get(cache_key)
    
    if not translations:
        translations = Translation.objects.filter(
            language__code=language_code,
            is_approved=True
        ).select_related('key')
        cache.set(cache_key, translations, 3600)  # Cache for 1 hour
    
    return translations
```

### Database Optimization
- Use `select_related()` for foreign key relationships
- Index frequently queried fields
- Use database-level constraints for data integrity

## 📚 Additional Resources

### Useful Django Packages
- `django-modeltranslation` - Alternative translation approach
- `django-parler` - Model translation library
- `django-rosetta` - Translation interface

### Translation Services
- Google Translate API
- DeepL API
- Microsoft Translator API

### Best Practices
- Use consistent translation key naming
- Provide context for translators
- Maintain translation memory
- Regular review of translation quality
- Cultural sensitivity in translations

This comprehensive backend internationalization system provides a solid foundation for multi-language support in your Maldives travel agency website, with proper management tools, API endpoints, and integration capabilities.
