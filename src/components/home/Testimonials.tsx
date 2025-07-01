import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      role: 'Creator',
      quote: 'FamQnA has transformed how I engage with my audience. I can now focus on valuable questions and earn at the same time!',
      stars: 5,
    },
    {
      name: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      role: 'User',
      quote: 'Getting personalized advice from my favorite finance expert was worth every rupee. Way better than generic content.',
      stars: 5,
    },
    {
      name: 'Anjali Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      role: 'Creator',
      quote: 'The platform is intuitive and the payment system is transparent. I love that my followers can get quality answers.',
      stars: 4,
    },
  ];

  return (
    <section className="py-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">What Our Users Say</h2>
          <p className="text-light-300 mt-2 max-w-2xl mx-auto">
            Hear from creators and users who have experienced the FamQnA difference
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-dark-100 p-6 rounded-xl border border-gray-800 flex flex-col h-full"
            >
              <div className="mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.stars ? 'text-accent-yellow' : 'text-gray-700'}`}
                      fill={i < testimonial.stars ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-light-200 italic flex-grow">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="mt-6 flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-white font-medium">{testimonial.name}</p>
                  <p className="text-light-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;