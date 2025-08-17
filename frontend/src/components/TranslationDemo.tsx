import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import GoogleTranslateSwitcher from './GoogleTranslateSwitcher';
import { useGoogleTranslate } from '../hooks/useGoogleTranslate';

export function TranslationDemo() {
  const { currentLanguage, isTranslationActive, resetTranslation } = useGoogleTranslate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Google Translate Integration Demo
        </h1>
        
        <div className="space-y-6">
          {/* Language Switcher */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Language Switcher</h2>
            <GoogleTranslateSwitcher />
          </div>

          {/* Status */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Translation Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Current Language</p>
                <p className="text-lg font-bold text-blue-800">{currentLanguage.toUpperCase()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Translation Active</p>
                <p className="text-lg font-bold text-green-800">
                  {isTranslationActive ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Actions</p>
                <Button 
                  onClick={resetTranslation}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Reset to English
                </Button>
              </div>
            </div>
          </div>

          {/* Sample Content */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sample Content (Will be translated)</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Welcome to Thread Travels & Tours! We are your trusted partner for discovering the 
                beautiful Maldives. Our carefully curated collection of properties and travel packages 
                ensures you experience the authentic beauty of this tropical paradise.
              </p>
              
              <p>
                From luxury resorts to charming guesthouses, we offer accommodations that suit every 
                budget and preference. Our local expertise means you'll discover hidden gems that 
                most tourists never see.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Why Choose Us?</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Local expertise and insider knowledge</li>
                  <li>• Quality-assured accommodations</li>
                  <li>• 24/7 personal support</li>
                  <li>• Best price guarantees</li>
                  <li>• Authentic local experiences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">How to Use:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Use the language switcher above to select your preferred language</li>
              <li>2. The entire page content will be automatically translated by Google Translate</li>
              <li>3. Dynamic content (property names, descriptions) will also be translated</li>
              <li>4. Click "Reset to English" to return to the original language</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TranslationDemo; 