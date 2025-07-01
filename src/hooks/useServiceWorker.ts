import { useState, useEffect } from 'react';
import { register, unregister } from '../serviceWorkerRegistration';

interface UseServiceWorkerReturn {
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  error: Error | null;
  updateServiceWorker: () => void;
  registerServiceWorker: () => void;
  unregisterServiceWorker: () => void;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if service worker is registered on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(
        (reg) => {
          if (reg) {
            setRegistration(reg);
            setIsRegistered(true);
          }
        },
        (err) => setError(err)
      );
    }
  }, []);

  // Register service worker
  const registerServiceWorker = () => {
    register({
      onSuccess: (reg) => {
        setRegistration(reg);
        setIsRegistered(true);
        setError(null);
      },
      onUpdate: (reg) => {
        setRegistration(reg);
        setIsUpdateAvailable(true);
      },
      onError: (err) => {
        setError(err);
      }
    });
  };

  // Update service worker when new version is available
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting and activate new version
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to ensure the new service worker takes control
      window.location.reload();
    }
  };

  // Unregister service worker
  const unregisterServiceWorker = () => {
    unregister();
    setRegistration(null);
    setIsRegistered(false);
    setIsUpdateAvailable(false);
  };

  return {
    isRegistered,
    isUpdateAvailable,
    registration,
    error,
    updateServiceWorker,
    registerServiceWorker,
    unregisterServiceWorker
  };
}