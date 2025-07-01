import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { MessageCircle, Zap, Shield, Users, Star, Smartphone, Globe, Lock, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const ServicesPage: React.FC = () => {
  return (
    <LegalPageLayout title="Our Services" updatedDate="">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-dark-100 via-dark-200 to-primary/30 rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Comprehensive Knowledge Exchange Platform</h2>
          <p className="text-lg text-light-200 leading-relaxed">
            <strong className="text-white">C3R4 ExpeTech Private Limited</strong> provides a comprehensive suite of services through <strong className="text-white">FamQnA (Famqna.in)</strong> to facilitate meaningful knowledge exchange between creators and their audience.
          </p>
        </div>
      </div>

      {/* Core Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Core Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-dark-200 to-primary/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-white">Q&A Platform</h3>
            </div>
            <p className="text-light-200 mb-4">
              Our flagship service connects users with creators through structured Q&A interactions. Users can ask both public and private questions, receiving personalized responses from industry experts.
            </p>
            <ul className="space-y-2 text-light-300 text-sm">
              <li>• Public question posting and answering</li>
              <li>• Private one-on-one consultations</li>
              <li>• 72-hour response guarantee</li>
              <li>• Rich text formatting support</li>
              <li>• File attachment capabilities</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-accent-green/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-accent-green mr-3" />
              <h3 className="text-xl font-semibold text-white">Creator Management</h3>
            </div>
            <p className="text-light-200 mb-4">
              Comprehensive creator onboarding and management system with profile creation, verification processes, and earnings management.
            </p>
            <ul className="space-y-2 text-light-300 text-sm">
              <li>• Professional profile creation</li>
              <li>• KYC and bank verification</li>
              <li>• Pricing configuration tools</li>
              <li>• Analytics dashboard</li>
              <li>• Revenue tracking and reporting</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-accent-blue/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-accent-blue mr-3" />
              <h3 className="text-xl font-semibold text-white">Payment Processing</h3>
            </div>
            <p className="text-light-200 mb-4">
              Secure and reliable payment processing system that will be integrated with PayU, supporting multiple payment methods and instant settlements.
            </p>
            <ul className="space-y-2 text-light-300 text-sm">
              <li>• Multiple payment options (UPI, Cards, Net Banking)</li>
                              <li>• Instant payout to creators via secure payment gateway</li>
              <li>• Automatic refund processing</li>
              <li>• Transaction history and receipts</li>
              <li>• Secure payment gateway integration</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-accent-purple/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Star className="h-8 w-8 text-accent-purple mr-3" />
              <h3 className="text-xl font-semibold text-white">Notification System</h3>
            </div>
            <p className="text-light-200 mb-4">
              Multi-channel notification system ensuring users and creators stay informed about all platform activities and updates.
            </p>
            <ul className="space-y-2 text-light-300 text-sm">
              <li>• Real-time push notifications</li>
              <li>• Email notification service</li>
              <li>• SMS alerts for critical events</li>
              <li>• In-app notification center</li>
              <li>• Customizable notification preferences</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Technology Infrastructure</h2>
        
        <div className="bg-dark-200 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Mobile-First Design</h4>
              <p className="text-light-300 text-sm">
                Responsive web application optimized for mobile devices with Progressive Web App (PWA) capabilities for app-like experience.
              </p>
            </div>
            
            <div className="text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Cloud Infrastructure</h4>
              <p className="text-light-300 text-sm">
                Scalable cloud-based architecture using Firebase, Netlify, and AWS services ensuring 99.9% uptime and global accessibility.
              </p>
            </div>
            
            <div className="text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Security & Privacy</h4>
              <p className="text-light-300 text-sm">
                Enterprise-grade security with end-to-end encryption, secure authentication, and GDPR-compliant data handling practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Solutions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Business Solutions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-accent-green mr-3" />
              <h4 className="text-lg font-semibold text-white">Creator Monetization</h4>
            </div>
            <ul className="space-y-2 text-light-200 text-sm">
              <li>• Multiple revenue streams for creators</li>
              <li>• Flexible pricing models</li>
              <li>• Instant payment settlements</li>
              <li>• Comprehensive earnings analytics</li>
              <li>• Tax documentation support</li>
              <li>• Creator marketing tools</li>
            </ul>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-accent-blue mr-3" />
              <h4 className="text-lg font-semibold text-white">Platform Management</h4>
            </div>
            <ul className="space-y-2 text-light-200 text-sm">
              <li>• 24/7 platform monitoring</li>
              <li>• Content moderation services</li>
              <li>• User support and helpdesk</li>
              <li>• Performance optimization</li>
              <li>• Regular feature updates</li>
              <li>• Backup and disaster recovery</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Service Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-6 w-6 text-accent-green mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Guest Access</h5>
            <p className="text-light-300 text-xs">
              Ask questions without registration with tracking system
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-6 w-6 text-accent-green mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Real-time Updates</h5>
            <p className="text-light-300 text-xs">
              Live notifications and status updates
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-6 w-6 text-accent-green mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Multi-language</h5>
            <p className="text-light-300 text-xs">
              Support for multiple languages and regions
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-6 w-6 text-accent-green mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">API Access</h5>
            <p className="text-light-300 text-xs">
              Developer-friendly APIs for integrations
            </p>
          </div>
        </div>
      </section>

      {/* Service Level Agreements */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Service Level Agreements</h2>
        
        <div className="bg-dark-200 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green mb-2">99.9%</div>
              <p className="text-white font-medium">Platform Uptime</p>
              <p className="text-light-300 text-sm mt-2">
                Guaranteed platform availability with minimal downtime for maintenance
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-blue mb-2">72hrs</div>
              <p className="text-white font-medium">Response Guarantee</p>
              <p className="text-light-300 text-sm mt-2">
                Maximum time for creators to respond to questions or automatic refund
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-purple mb-2">24/7</div>
              <p className="text-white font-medium">Support Availability</p>
              <p className="text-light-300 text-sm mt-2">
                Round-the-clock customer support for critical issues and emergencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Customer Support Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">For Users</h4>
            <ul className="space-y-3 text-light-200">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Question submission assistance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Payment support and refund processing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Account management help</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Technical troubleshooting</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Platform navigation guidance</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">For Creators</h4>
            <ul className="space-y-3 text-light-200">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Profile optimization guidance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Onboarding and verification support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Earnings and payout assistance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Platform features training</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-accent-green mr-2 mt-1 flex-shrink-0" />
                <span>Performance analytics support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact for Services */}
      <section className="bg-gradient-to-r from-primary/20 to-dark-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Need Custom Services?</h2>
        <p className="text-light-200 mb-6 max-w-2xl mx-auto">
          <strong className="text-white">C3R4 ExpeTech Private Limited</strong> offers customized solutions for enterprises and organizations looking to implement knowledge-sharing platforms. Contact our team to discuss your specific requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/contact" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Contact Sales
          </a>
          <a href="tel:+919680877137" className="bg-dark-100 hover:bg-dark-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Call: +91 9680877137
          </a>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-dark-100 rounded-lg p-4">
            <h5 className="text-white font-medium mb-2">Technical Support</h5>
            <p className="text-light-300">support@famqna.in</p>
          </div>
          <div className="bg-dark-100 rounded-lg p-4">
            <h5 className="text-white font-medium mb-2">Business Inquiries</h5>
            <p className="text-light-300">contact@famqna.in</p>
          </div>
          <div className="bg-dark-100 rounded-lg p-4">
            <h5 className="text-white font-medium mb-2">Creator Support</h5>
            <p className="text-light-300">creators@famqna.in</p>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default ServicesPage; 