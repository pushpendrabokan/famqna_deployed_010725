import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const QuestionSuccessPage: React.FC = () => {
  const location = useLocation();
  const { creator, trackingId } = location.state || {};

  if (!creator || !trackingId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-deep-400 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-deep-100 rounded-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-accent-green mx-auto animate-bounce" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Question Submitted Successfully!</h1>
          <p className="text-light-300 mb-6">
            Your question has been sent to {creator.name} and they will be notified.
          </p>
          
          <div className="bg-deep-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-light-300 mb-2">Tracking ID</p>
            <p className="text-lg font-mono text-white">{trackingId}</p>
          </div>
          
          <div className="text-sm text-light-300 mb-6">
            <p>We've sent the confirmation and tracking details to your email and mobile number.</p>
            <p className="mt-2">You can track your question's status using the tracking ID.</p>
          </div>
          
          <div className="space-y-3">
            <Link to={`/track/${trackingId}`}>
              <Button variant="gradient" fullWidth>
                Track Question Status
              </Button>
            </Link>
            
            <Link to={`/${creator.username}`}>
              <Button variant="ghost" fullWidth rightIcon={<ExternalLink className="w-4 h-4" />}>
                Back to {creator.name}'s Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionSuccessPage;