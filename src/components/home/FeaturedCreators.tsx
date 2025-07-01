import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreatorCard from '../creator/CreatorCard';
import { mockCreators } from '../../data/mockData';
import Button from '../ui/Button';

const FeaturedCreators: React.FC = () => {
  // For the homepage, we'll show a subset of creators
  const featuredCreators = mockCreators.slice(0, 3);
  
  return (
    <section className="py-16 bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Creators</h2>
            <p className="text-light-300 mt-2">Connect with top creators and get personalized answers</p>
          </div>
          <Link to="/creators">
            <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />}>
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;