import React, { useState } from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LegalPageLayout title="Contact Us" updatedDate="">
      {/* Company Introduction */}
      <div className="bg-gradient-to-br from-dark-100 via-dark-200 to-primary/30 rounded-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Get in Touch with C3R4 ExpeTech Private Limited</h2>
          <p className="text-light-200">
            We're here to help with any questions or concerns about FamQnA. Our team is committed to providing excellent support and ensuring your experience on <strong className="text-white">Famqna.in</strong> is seamless.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Form - Takes up 3/5 of the space on large screens */}
        <div className="lg:col-span-3 bg-dark-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-light-200 mb-2 text-sm">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1d3a] border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-light-200 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1d3a] border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-light-200 mb-2 text-sm">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1d3a] border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Account Issues">Account Issues</option>
                <option value="Payment Issues">Payment Issues</option>
                <option value="Creator Support">Creator Support</option>
                <option value="Refund Request">Refund Request</option>
                <option value="Business Partnership">Business Partnership</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-light-200 mb-2 text-sm">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-[#2a1d3a] border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            {submitError && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}
            
            {submitSuccess && (
              <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                Thank you for your message! We'll get back to you within 24 hours.
              </div>
            )}
            
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </form>
        </div>
        
        {/* Contact Info - Takes up 2/5 of the space on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            
            <div className="space-y-5 mt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-dark-100 p-3 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Phone</h3>
                  <p className="text-light-300">+91 9680877137</p>
                  <p className="text-light-300 text-xs mt-1">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-dark-100 p-3 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Email</h3>
                  <p className="text-light-300">support@famqna.in</p>
                  <p className="text-light-300">creators@famqna.in</p>
                  <p className="text-light-300">contact@famqna.in</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-dark-100 p-3 rounded-full mr-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Address</h3>
                  <p className="text-light-300">C3R4 ExpeTech Private Limited</p>
                  <p className="text-light-300">Bokan Bhawan, VPO Harsh</p>
                  <p className="text-light-300">Via-Sanwali, Sikar</p>
                  <p className="text-light-300">Rajasthan, India, 332021</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="bg-dark-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a 
                href="tel:+919680877137" 
                className="flex items-center p-3 bg-dark-100 rounded-lg hover:bg-dark-300 transition-colors"
              >
                <Phone className="h-4 w-4 text-primary mr-3" />
                <span className="text-light-200">Call us now</span>
              </a>
              <a 
                href="mailto:support@famqna.in" 
                className="flex items-center p-3 bg-dark-100 rounded-lg hover:bg-dark-300 transition-colors"
              >
                <Mail className="h-4 w-4 text-primary mr-3" />
                <span className="text-light-200">Send email</span>
              </a>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-dark-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Support Hours</h3>
            <div className="space-y-2 text-light-200">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            <p className="text-light-300 text-xs mt-3">
              Emergency support available 24/7 for critical payment and technical issues.
            </p>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default ContactPage; 