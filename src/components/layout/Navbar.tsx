import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import NotificationCenter from '../notifications/NotificationCenter';

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Only show nav items when not in dashboard
  const showNavItems = !location.pathname.startsWith('/dashboard');
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-deep-200 border-b border-gray-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name */}
          {isDashboard ? (
            <span className="text-xl font-bold">
              <span className="text-white">Fam</span>
              <span className="text-primary">Q</span>
              <span className="text-white">n</span>
              <span className="text-white">A</span>
            </span>
          ) : (
            <Link to={currentUser ? '/dashboard' : '/'} className="text-xl font-bold hover:opacity-90 transition-opacity">
              <span className="text-white">Fam</span>
              <span className="text-primary">Q</span>
              <span className="text-white">n</span>
              <span className="text-white">A</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          {showNavItems && (
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {!currentUser && (
                <Link to="/signin">
                  <Button 
                    size="md" 
                    variant="outline" 
                    className="border-2 border-primary text-white hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
                  >
                    Get Started for Free
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {showNavItems && (
            <div className="sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-light-100 hover:text-primary hover:bg-dark-200"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && showNavItems && (
        <div className="sm:hidden bg-deep-200 border-t border-gray-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!currentUser && (
              <div className="px-3 py-2">
                <Link 
                  to="/signin" 
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button fullWidth variant="primary">
                    Sign In with Google
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;