import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthMode } from '../context/AuthSwitcher';

const SignUpPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithGoogle } = useAuth();
  const { useMockAuth } = useAuthMode();
  const navigate = useNavigate();
  
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during Google sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="bg-dark-100 rounded-xl p-8 shadow-lg border border-gray-800">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white">Join FamQnA Today</h1>
              <p className="text-light-300 mt-2">Connect with creators or become one yourself</p>
              
              {useMockAuth && (
                <div className="mt-2 bg-primary/20 py-1 px-3 rounded-full text-xs text-primary inline-block">
                  Using Mock Authentication
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545 12.151L12.545 12.151L12.545 12.151H9.455V14.303H12.545C12.215 15.242 11.285 15.909 10.182 15.909C8.788 15.909 7.655 14.776 7.655 13.382C7.655 11.988 8.788 10.855 10.182 10.855C10.716 10.855 11.213 11.011 11.624 11.281L13.224 9.682C12.404 9.029 11.349 8.655 10.182 8.655C7.576 8.655 5.455 10.776 5.455 13.382C5.455 15.988 7.576 18.109 10.182 18.109C12.788 18.109 14.909 15.988 14.909 13.382C14.909 12.961 14.862 12.549 14.775 12.151H12.545Z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            
            <div className="mt-8 bg-dark-200 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">What to expect:</h3>
              <ul className="text-light-300 text-sm space-y-2 list-disc list-inside">
                <li>We'll use your Google profile information to set up your account</li>
                <li>No need for email verification or password management</li>
                <li>Secure, one-click sign in experience</li>
                <li>You can edit your profile information after signing up</li>
              </ul>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-light-300 text-sm">
                By continuing, you agree to FamQnA's{' '}
                <Link to="/terms" className="text-primary hover:text-primary-hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary-hover">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;