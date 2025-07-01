import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;