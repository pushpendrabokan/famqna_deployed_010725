import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircleQuestion, User, DollarSign } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-300 to-dark-200 py-16 sm:py-24">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
      
      <div className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-20 blur-3xl -z-10">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-accent-pink" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Monetize Your <span className="text-primary">Influence</span>
            </h1>
            <p className="mt-6 text-xl text-light-200">
              Connect with creators through paid Q&A sessions. Get personalized answers to your questions or earn by sharing your expertise.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="outline" rightIcon={<User className="w-5 h-5" />}>
                  Become a Creator
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-dark-100 p-6 rounded-xl border border-gray-800 hover:border-primary/50 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircleQuestion className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ask Questions</h3>
                <p className="text-light-300">
                  Submit your questions to your favorite creators and get personalized answers.
                </p>
              </div>
              
              <div className="bg-dark-100 p-6 rounded-xl border border-gray-800 hover:border-primary/50 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fair Pricing</h3>
                <p className="text-light-300">
                  Choose between public and private questions with transparent pricing.
                </p>
              </div>
              
              <div className="bg-dark-100 p-6 rounded-xl border border-gray-800 hover:border-primary/50 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Creator Dashboard</h3>
                <p className="text-light-300">
                  Manage questions, track earnings, and build your audience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;