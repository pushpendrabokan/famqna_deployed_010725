import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div className="text-primary text-9xl font-bold mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-light-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" leftIcon={<Home className="w-5 h-5" />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/creators">
              <Button variant="outline" leftIcon={<Search className="w-5 h-5" />}>
                Find Creators
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;