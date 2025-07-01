import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import ServiceWorkerUpdateNotification from './components/ui/ServiceWorkerUpdateNotification';
import NotificationManager from './components/notifications/NotificationManager';

// Pages
import HomePage from './pages/HomePage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import QuestionSuccessPage from './pages/QuestionSuccessPage';
import QuestionTrackingPage from './pages/QuestionTrackingPage';
import NotFoundPage from './pages/NotFoundPage';

// Legal and Info Pages
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import ServicesPage from './pages/ServicesPage';

// Service worker registration
import { register } from './serviceWorkerRegistration';

// Layout wrapper for authenticated routes
const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterSignIn', window.location.pathname);
    return <Navigate to="/signin" />;
  }
  
  return <>{children}</>;
};

// Layout wrapper for public routes
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Redirect to dashboard if user is logged in
  if (currentUser && window.location.pathname === '/') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
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
    }
  }, []);

  return (
    <AuthProvider>
      <NotificationManager>
        <Router>
          <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/:username" element={<CreatorProfilePage />} />
            <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/question/success" element={<QuestionSuccessPage />} />
            <Route path="/track/:trackingId" element={<QuestionTrackingPage />} />
            
            {/* Legal and Info Pages */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard/*" element={<AuthenticatedRoute><DashboardPage /></AuthenticatedRoute>}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<DashboardPage />} />
              <Route path="questions" element={<DashboardPage />} />
              <Route path="profile" element={<DashboardPage />} />
              <Route path="earnings" element={<DashboardPage />} />
              <Route path="payments" element={<DashboardPage />} />
              <Route path="settings" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ServiceWorkerUpdateNotification />
        </Router>
      </NotificationManager>
    </AuthProvider>
  );
}

export default App;