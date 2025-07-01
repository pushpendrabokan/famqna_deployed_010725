import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { register } from './serviceWorkerRegistration';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register the service worker for offline support and notifications
// This will only run in production
register({
  onSuccess: (registration) => {
    console.log('Service worker registered successfully:', registration);
  },
  onUpdate: (registration) => {
    console.log('New content is available; please refresh.');
  },
  onError: (error) => {
    console.error('Error during service worker registration:', error);
  }
});