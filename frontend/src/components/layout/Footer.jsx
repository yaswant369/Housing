// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  
  const FooterLink = ({ to, children }) => (
    <li>
      <Link to={to} className="text-gray-400 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );

  const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  );

  return (
    <footer className="bg-gray-800 text-gray-300 p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Column 1: Explore */}
          <div>
            <h5 className="font-bold text-white mb-4">Explore</h5>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/filter?status=Buy">Properties for Buy</FooterLink>
              <FooterLink to="/filter?status=Rent">Properties for Rent</FooterLink>
              <FooterLink to="/premium">Premium Plans</FooterLink>
              <FooterLink to="/agents">Find an Agent</FooterLink>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h5 className="font-bold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Column 3: Legal & Help */}
          <div>
            <h5 className="font-bold text-white mb-4">Legal & Help</h5>
            <ul className="space-y-2">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/sitemap">Sitemap</FooterLink>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h5 className="font-bold text-white mb-4">Connect With Us</h5>
            <div className="flex space-x-4 mb-4">
              <SocialIcon href="https://facebook.com"><Facebook size={20} /></SocialIcon>
              <SocialIcon href="https://twitter.com"><Twitter size={20} /></SocialIcon>
              <SocialIcon href="https://linkedin.com"><Linkedin size={20} /></SocialIcon>
              <SocialIcon href="https://instagram.com"><Instagram size={20} /></SocialIcon>
            </div>
            <h5 className="font-bold text-white my-4">Get the App</h5>
            <div className="flex flex-col space-y-2">
              <div className="bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center cursor-not-allowed opacity-75">
                <span>App Store</span>
                <span className="ml-2 text-xs bg-blue-500 px-1.5 py-0.5 rounded">Coming Soon</span>
              </div>
              <div className="bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center cursor-not-allowed opacity-75">
                <span>Google Play</span>
                <span className="ml-2 text-xs bg-blue-500 px-1.5 py-0.5 rounded">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 space-y-4">

          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">Propy</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Propy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}