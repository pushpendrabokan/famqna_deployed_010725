import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HowItWorks from '../components/home/HowItWorks';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-dark-200 to-dark-300 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-4">How FamQnA Works</h1>
              <p className="text-light-300 text-lg">
                Connect with creators, get personalized answers, and make meaningful interactions through our platform.
              </p>
            </div>
          </div>
        </div>
        
        <HowItWorks />
        
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-dark-100 p-8 rounded-xl border border-gray-800">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">How much do creators earn?</h3>
                      <p className="text-light-300">
                        Creators receive 80% of each question payment directly to their bank account. This 
                        higher revenue share ensures creators are fairly compensated for their expertise and time.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">When do refunds occur?</h3>
                      <p className="text-light-300">
                        If a creator doesn't answer your question within 72 hours, you'll automatically receive a full refund to your original payment method.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Can I ask any type of question?</h3>
                      <p className="text-light-300">
                        You can ask anything that adheres to our community guidelines. Questions that are illegal, harmful, or violate privacy will be removed.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">How do payments work?</h3>
                      <p className="text-light-300">
                        We will process payments securely through PayU. When you pay for a question, 80% will be 
                        immediately transferred to the creator's account, ensuring they receive their fair share quickly.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 bg-dark-200 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-xl font-bold text-white">Ready to get started?</span>
                  </div>
                  
                  <p className="text-light-300 mb-6">
                    Browse our creators and ask your first question or sign up to become a creator yourself and start earning.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/creators">
                      <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Browse Creators
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="outline" fullWidth>
                        Become a Creator
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;