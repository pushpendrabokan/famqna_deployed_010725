import React, { useState } from 'react';
import { Search, CreditCard, MessageSquare, RefreshCw, ChevronDown } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'How much do creators earn?',
      answer: 'Creators receive 80% of each question payment directly to their bank account. This higher revenue share ensures creators are fairly compensated for their expertise and time.',
    },
    {
      id: 2,
      question: 'When do refunds occur?',
      answer: 'If a creator doesn\'t answer your question within 72 hours, you\'ll automatically receive a full refund to your original payment method.',
    },
    {
      id: 3,
      question: 'Can I ask any type of question?',
      answer: 'You can ask anything that adheres to our community guidelines. Questions that are illegal, harmful, or violate privacy will be removed.',
    },
    {
      id: 4,
      question: 'How do payments work?',
      answer: 'We will process payments securely through PayU. When you pay for a question, 80% will be immediately transferred to the creator\'s account, ensuring they receive their fair share quickly.',
    },
  ];

  const steps = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: 'Find your favorite creator',
      description: 'Creators put their FamQnA landing page link in their profile bio. Use that to ask questions from your favourite creators.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-accent-blue" />,
      title: 'Pay for your question',
      description: 'Choose between public and private question options with transparent pricing.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-accent-green" />,
      title: 'Get personalized answers',
      description: 'Receive thoughtful, personalized responses directly from the creator.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-accent-pink" />,
      title: 'Automatic refunds',
      description: "If your question isn't answered within the time limit, you'll automatically receive a refund.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-dark-200 to-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-light-300 mt-2 max-w-2xl mx-auto">
            FamQnA makes it simple to connect with creators and get the answers you're looking for
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-dark-100 p-6 rounded-xl border border-gray-800 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-dark-300 rounded-full flex items-center justify-center border border-gray-700 font-bold text-white">
                {index + 1}
              </div>
              <div className="w-12 h-12 bg-dark-200 rounded-lg flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-light-300">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <div className="bg-dark-100 p-6 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-dark-200 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-white text-left">{faq.question}</h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-light-300 transition-transform duration-200 ${
                        openFaqId === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div 
                    className={`px-4 transition-all duration-200 ease-in-out ${
                      openFaqId === faq.id ? 'max-h-40 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
                    }`}
                  >
                    <p className="text-light-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;