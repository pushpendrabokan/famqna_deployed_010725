import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  updatedDate?: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ 
  children, 
  title,
  updatedDate = 'July 1, 2024'
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-dark-200 rounded-lg p-6 md:p-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
          {updatedDate && (
            <p className="text-light-300 text-sm mb-8">Last Updated: {updatedDate}</p>
          )}
          <div className={`text-light-200 space-y-6 ${!updatedDate ? 'mt-8' : ''}`}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPageLayout; 