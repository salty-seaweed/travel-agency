import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isUpdateAvailable: boolean;
  error: string | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isUpdateAvailable: false,
    error: null,
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!state.isSupported) {
      console.log('Service Worker not supported');
      return;
    }

    registerServiceWorker();
  }, [state.isSupported]);

  const registerServiceWorker = async () => {
    try {
      setState(prev => ({ ...prev, isInstalling: true, error: null }));

      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);

      // Check if there's an update available
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          setState(prev => ({ ...prev, isInstalling: true }));

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                setState(prev => ({ 
                  ...prev, 
                  isUpdateAvailable: true, 
                  isWaiting: true,
                  isInstalling: false 
                }));
              } else {
                // First time installation
                setState(prev => ({ 
                  ...prev, 
                  isRegistered: true, 
                  isInstalling: false 
                }));
                console.log('Service Worker installed for the first time');
              }
            }
          });
        }
      });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        isInstalling: false 
      }));

      console.log('Service Worker registered successfully');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Registration failed',
        isInstalling: false 
      }));
      console.error('Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const unregisterServiceWorker = async () => {
    if (registration) {
      try {
        await registration.unregister();
        setState(prev => ({ 
          ...prev, 
          isRegistered: false, 
          isUpdateAvailable: false,
          isWaiting: false 
        }));
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Failed to unregister Service Worker:', error);
      }
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker,
  };
}
