import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { MessageCircle, Zap, TrendingUp, Shield, Users, Star, Check, Info } from 'lucide-react';

const PricingPage: React.FC = () => {
  return (
    <LegalPageLayout title="Pricing" updatedDate="">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-dark-100 via-dark-200 to-primary/30 rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-light-200 leading-relaxed">
            FamQnA by <strong className="text-white">C3R4 ExpeTech Private Limited</strong> offers a fair and transparent pricing model that benefits both creators and users. Get personalized answers from experts at affordable rates.
          </p>
        </div>
      </div>

      {/* For Users Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">For Question Askers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-dark-200 to-primary/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-white">Public Questions</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary mb-2">₹499 - ₹1,999</div>
              <p className="text-light-300">Starting price set by creators</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Question visible to all users
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Answer visible publicly
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                72-hour response guarantee
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Email & SMS notifications
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Full refund if unanswered
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-accent-purple/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-accent-purple mr-3" />
              <h3 className="text-xl font-semibold text-white">Private Questions</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-accent-purple mb-2">₹999 - ₹3,999</div>
              <p className="text-light-300">Premium pricing set by creators</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Question kept completely private
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                One-on-one interaction
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                72-hour response guarantee
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Priority support
              </li>
              <li className="flex items-center text-light-200">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Full refund if unanswered
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-accent-blue mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-2">Payment Information</h4>
              <ul className="text-light-200 space-y-1 text-sm">
                <li>• Prices are set individually by each creator</li>
                <li>• All payments will be processed securely through PayU (coming soon)</li>
                <li>• Multiple payment methods: UPI, Cards, Net Banking, Wallets</li>
                <li>• Automatic refund within 24 hours if question remains unanswered after 72 hours</li>
                <li>• All prices are in Indian Rupees (INR) and include applicable taxes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">For Creators</h2>
        
        <div className="bg-gradient-to-r from-primary/20 to-dark-200 rounded-lg p-8 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Creator Revenue Share</h3>
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-green mb-2">80%</div>
                <p className="text-light-200">Creator Earnings</p>
              </div>
              <div className="text-6xl text-light-300">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">20%</div>
                <p className="text-light-200">Platform Fee</p>
              </div>
            </div>
            <p className="text-light-200 max-w-2xl mx-auto">
              Keep 80% of every question payment. Our platform fee covers payment processing, technology infrastructure, customer support, and platform maintenance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent-green mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Instant Payouts</h4>
            <p className="text-light-300 text-sm">
              Receive payments directly to your bank account within 24-48 hours of answering questions through our secure payment system.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <Users className="h-8 w-8 text-accent-blue mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Set Your Rates</h4>
            <p className="text-light-300 text-sm">
              Full control over your pricing. Set different rates for public and private questions based on your expertise and time investment.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <Star className="h-8 w-8 text-accent-pink mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Analytics Dashboard</h4>
            <p className="text-light-300 text-sm">
              Track your earnings, response rate, and performance metrics through our comprehensive creator dashboard.
            </p>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Creator Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-light-200">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Zero setup or subscription fees
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Automatic payment processing
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Built-in audience discovery
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Professional creator profile
              </li>
            </ul>
            <ul className="space-y-2 text-light-200">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                24/7 customer support
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Detailed earnings reports
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Multiple withdrawal options
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-accent-green mr-2" />
                Tax documentation support
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Supported Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="text-white font-medium">UPI</h4>
            <p className="text-light-300 text-xs">Google Pay, PhonePe, Paytm</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="text-white font-medium">Cards</h4>
            <p className="text-light-300 text-xs">Visa, Mastercard, RuPay</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="text-white font-medium">Net Banking</h4>
            <p className="text-light-300 text-xs">All major banks</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <Star className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="text-white font-medium">Wallets</h4>
            <p className="text-light-300 text-xs">Paytm, Mobikwik, etc.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Pricing FAQ</h2>
        <div className="space-y-4">
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">How do creators set their prices?</h4>
            <p className="text-light-300">
              Creators have full control over their pricing during the onboarding process. They can set different rates for public and private questions and can update these rates at any time through their dashboard.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">What happens if my question isn't answered?</h4>
            <p className="text-light-300">
              If a creator doesn't answer your question within 72 hours, you'll automatically receive a full refund within 24 hours. No questions asked, no forms to fill out.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">Are there any hidden fees?</h4>
            <p className="text-light-300">
              No hidden fees ever. The price you see is the final price you pay. For creators, the 20% platform fee covers all costs including payment processing, so there are no additional charges.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">How often do creators get paid?</h4>
            <p className="text-light-300">
              Creators receive payments automatically within 24-48 hours of answering questions through our secure payment system. Payments are transferred directly to their verified bank accounts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 to-dark-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-light-200 mb-6 max-w-2xl mx-auto">
          Join thousands of users and creators who are already using FamQnA to share knowledge and earn money. Start your journey today on <strong className="text-white">Famqna.in</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/signup" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Become a Creator
          </a>
          <a href="/" className="bg-dark-100 hover:bg-dark-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Ask Questions
          </a>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default PricingPage; 