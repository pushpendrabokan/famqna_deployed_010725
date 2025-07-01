import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-200 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-white">FamQnA</span>
            </Link>
            <p className="text-light-300 text-sm">
              A product of <strong className="text-white">C3R4 ExpeTech Private Limited</strong>. Connect with your favorite creators through paid Q&A sessions hosted on <strong className="text-white">Famqna.in</strong>.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-300 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-light-100 font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-light-300 hover:text-primary text-sm">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-light-300 hover:text-primary text-sm">Dashboard</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-light-300 hover:text-primary text-sm">Pricing</Link>
              </li>
              <li>
                <Link to="/services" className="text-light-300 hover:text-primary text-sm">Our Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-light-300 hover:text-primary text-sm">About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-light-100 font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-light-300 hover:text-primary text-sm">Contact Us</Link>
              </li>
              <li>
                <a href="tel:+919680877137" className="text-light-300 hover:text-primary text-sm">+91 9680877137</a>
              </li>
              <li>
                <a href="mailto:support@famqna.in" className="text-light-300 hover:text-primary text-sm">Support Email</a>
              </li>
              <li>
                <Link to="/refund" className="text-light-300 hover:text-primary text-sm">Refund Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-light-100 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-light-300 hover:text-primary text-sm">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-light-300 hover:text-primary text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund" className="text-light-300 hover:text-primary text-sm">Refund Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-light-300 hover:text-primary text-sm">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-light-300 text-sm text-center md:text-left">
              © {new Date().getFullYear()} <strong className="text-white">C3R4 ExpeTech Private Limited</strong>. All rights reserved.
            </p>
            <p className="text-light-300 text-xs mt-2 md:mt-0">
              <strong className="text-white">FamQnA</strong> hosted on <strong className="text-white">Famqna.in</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;