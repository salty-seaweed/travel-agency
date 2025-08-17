// Google Translate API Service
// Note: This requires a Google Cloud API key for production use

interface TranslateRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

class GoogleTranslateService {
  private apiKey: string | null = null;
  private isWidgetMode: boolean = true;

  constructor() {
    // Check if we have an API key (for production)
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || null;
    this.isWidgetMode = !this.apiKey;
  }

  // Initialize the Google Translate widget
  initWidget(): void {
    if (!this.isWidgetMode) return;

    // Load Google Translate script if not already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize Google Translate widget
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ru,zh,es,fr,de,ja,ko,ar',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };
  }

  // Translate text using Google Translate API (requires API key)
  async translateText(request: TranslateRequest): Promise<TranslateResponse> {
    if (this.isWidgetMode) {
      throw new Error('Google Translate API key required for programmatic translation');
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: request.text,
            target: request.targetLanguage,
            source: request.sourceLanguage || 'auto',
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        translatedText: data.data.translations[0].translatedText,
        detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Get current language from Google Translate widget
  getCurrentLanguage(): string {
    if (this.isWidgetMode) {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      return select ? select.value : 'en';
    }
    return 'en';
  }

  // Check if translation is active
  isTranslationActive(): boolean {
    if (this.isWidgetMode) {
      return document.body.classList.contains('translated-ltr') || 
             document.body.classList.contains('translated-rtl');
    }
    return false;
  }

  // Reset translation to original language
  resetTranslation(): void {
    if (this.isWidgetMode) {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change'));
      }
    }
  }
}

export const googleTranslateService = new GoogleTranslateService(); 