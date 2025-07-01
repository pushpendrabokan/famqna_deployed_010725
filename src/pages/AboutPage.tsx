import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { MessageSquare, Zap, Users, Shield, BarChart2 } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <LegalPageLayout title="About Us" updatedDate="">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-dark-100 via-dark-200 to-primary/30 rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Connecting Creators with Their Audience</h2>
          <p className="text-lg text-light-200 leading-relaxed mb-4">
            FamQnA is a cutting-edge technology platform developed by <strong className="text-white">C3R4 ExpeTech Private Limited</strong> and hosted at <strong className="text-white">Famqna.in</strong>. We bridge the gap between creators and their audience through personalized Q&A interactions.
          </p>
          <p className="text-light-300">
            Founded with a vision to create meaningful connections, our platform enables knowledge monetization while fostering genuine community engagement.
          </p>
        </div>
      </div>

      {/* Company Information Section */}
      <section className="mb-12">
        <div className="bg-dark-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">About C3R4 ExpeTech Private Limited</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Company Details</h3>
              <ul className="list-none space-y-2 text-light-200">
                <li><strong className="text-white">Legal Name:</strong> C3R4 ExpeTech Private Limited</li>
                <li><strong className="text-white">Product:</strong> FamQnA</li>
                <li><strong className="text-white">Website:</strong> Famqna.in</li>
                <li><strong className="text-white">Industry:</strong> Technology Platform</li>
                <li><strong className="text-white">Founded:</strong> 2024</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Contact Information</h3>
              <ul className="list-none space-y-2 text-light-200">
                <li><strong className="text-white">Phone:</strong> +91 9680877137</li>
                <li><strong className="text-white">Email:</strong> contact@famqna.in</li>
                <li><strong className="text-white">Support:</strong> support@famqna.in</li>
                <li><strong className="text-white">Address:</strong> Bokan Bhawan, VPO Harsh</li>
                <li className="ml-4">Via-Sanwali, Sikar, Rajasthan, India, 332021</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-light-200 mb-4">
              <strong className="text-white">C3R4 ExpeTech Private Limited</strong> started as a vision to democratize knowledge sharing and enable creators to monetize their expertise. What began as a small project has grown into a thriving platform that serves creators and users across India through <strong className="text-white">Famqna.in</strong>.
            </p>
            <p className="text-light-200">
              We recognized that while social media platforms provide a way for creators to broadcast their content, they often lack the depth and personalization that comes from direct, one-on-one interactions. FamQnA bridges this gap by enabling meaningful conversations between creators and their audience through paid Q&A sessions.
            </p>
          </div>
          <div className="md:w-1/2 bg-dark-200 rounded-lg p-6 relative">
            <div className="absolute -top-3 -left-3 bg-primary/20 rounded-lg w-full h-full"></div>
            <div className="bg-dark-100 p-6 rounded-lg relative z-10">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">The Power of Direct Connection</h3>
              <p className="text-light-300">
                We believe in the power of direct, personal conversations between creators and their audience. Our platform is designed to make these connections valuable for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
        <div className="bg-dark-200 rounded-lg p-6">
          <p className="text-light-200 mb-6">
            Our mission at <strong className="text-white">C3R4 ExpeTech Private Limited</strong> is to empower creators to monetize their expertise while providing their audience with valuable, personalized insights. We believe that everyone's time and knowledge has value, and our platform ensures that creators are fairly compensated for sharing their expertise through <strong className="text-white">Famqna.in</strong>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start bg-dark-100 p-4 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-medium">Supporting Creators</h3>
                <p className="text-sm text-light-300 mt-1">Providing tools and resources that help creators monetize their expertise and build deeper connections.</p>
              </div>
            </div>
            
            <div className="flex items-start bg-dark-100 p-4 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-medium">Facilitating Knowledge Exchange</h3>
                <p className="text-sm text-light-300 mt-1">Creating a platform where valuable information can be shared through direct, personalized interactions.</p>
              </div>
            </div>
            
            <div className="flex items-start bg-dark-100 p-4 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-medium">Ensuring Fair Compensation</h3>
                <p className="text-sm text-light-300 mt-1">Maintaining a business model that ensures creators receive fair compensation for their time and expertise.</p>
              </div>
            </div>
            
            <div className="flex items-start bg-dark-100 p-4 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-medium">Building Trust</h3>
                <p className="text-sm text-light-300 mt-1">Fostering a safe, transparent environment where both creators and users feel valued and respected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-dark-200 to-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-3">Authenticity</h3>
            <p className="text-light-300">We value genuine connections and honest communication between creators and their audience.</p>
          </div>
          <div className="bg-gradient-to-br from-dark-200 to-accent-blue/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-accent-blue mb-3">Innovation</h3>
            <p className="text-light-300">We are constantly looking for new ways to improve our platform and enhance the user experience.</p>
          </div>
          <div className="bg-gradient-to-br from-dark-200 to-accent-green/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-accent-green mb-3">Respect</h3>
            <p className="text-light-300">We respect the time, expertise, and privacy of all users on our platform.</p>
          </div>
          <div className="bg-gradient-to-br from-dark-200 to-accent-pink/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-accent-pink mb-3">Transparency</h3>
            <p className="text-light-300">We believe in being open and honest about our business practices and fee structure.</p>
          </div>
        </div>
      </section>

      {/* Technology & Innovation Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Technology & Innovation</h2>
        <div className="bg-dark-200 rounded-lg p-6">
          <p className="text-light-200 mb-4">
            <strong className="text-white">C3R4 ExpeTech Private Limited</strong> leverages cutting-edge technology to deliver a seamless experience on <strong className="text-white">Famqna.in</strong>. Our platform is built with modern web technologies, ensuring security, scalability, and performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-dark-100 p-4 rounded-lg text-center">
              <h4 className="text-primary font-semibold">Secure Payments</h4>
              <p className="text-light-300 text-sm mt-2">Industry-standard payment processing with multiple options</p>
            </div>
            <div className="bg-dark-100 p-4 rounded-lg text-center">
              <h4 className="text-primary font-semibold">Real-time Notifications</h4>
              <p className="text-light-300 text-sm mt-2">Instant updates via email, SMS, and push notifications</p>
            </div>
            <div className="bg-dark-100 p-4 rounded-lg text-center">
              <h4 className="text-primary font-semibold">Mobile-First Design</h4>
              <p className="text-light-300 text-sm mt-2">Optimized experience across all devices and platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 to-dark-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
        <p className="text-light-200 mb-6 max-w-2xl mx-auto">
          We're building more than just a platform—we're creating a community where knowledge is valued and shared. Whether you're a creator looking to monetize your expertise or someone seeking personalized insights, we invite you to join us at <strong className="text-white">Famqna.in</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/signup" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Get Started
          </a>
          <a href="/contact" className="bg-dark-100 hover:bg-dark-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
            Contact Us
          </a>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default AboutPage; 