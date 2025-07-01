import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CreatorCard from '../components/creator/CreatorCard';
import { mockCreators } from '../data/mockData';
import { Search } from 'lucide-react';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const CreatorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['Coding', 'Career Development', 'Fitness', 'Nutrition', 'Finance', 'Investing', 'Travel', 'Photography'];
  
  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           creator.expertise.some(exp => exp.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">Discover Creators</h1>
            <p className="text-light-300 max-w-2xl mx-auto">
              Find creators from various fields and get personalized answers to your questions
            </p>
          </div>
          
          <div className="mb-12">
            <Input
              placeholder="Search creators by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              leftIcon={<Search className="w-5 h-5" />}
              className="max-w-xl mx-auto"
            />
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  className="cursor-pointer py-1 px-3"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-light-300 text-lg">No creators found matching your search criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="mt-4 text-primary hover:text-primary-hover"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatorsPage;