import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building, User, FileText, Settings, Phone, BookOpen, Briefcase, Shield, MapPin } from 'lucide-react';

export default function SitemapPage() {
  const siteSections = [
    {
      title: "Main Pages",
      icon: Home,
      links: [
        { name: "Home", path: "/", description: "Welcome to Propy Values - Your trusted real estate partner" },
        { name: "Properties", path: "/properties", description: "Browse our extensive collection of properties" },
        { name: "Property Details", path: "/property/:id", description: "Detailed view of individual properties" },
        { name: "Premium Plans", path: "/premium", description: "Upgrade to premium features and services" },
        { name: "Tools & Calculators", path: "/tools", description: "Useful tools for property decisions" }
      ]
    },
    {
      title: "User Account",
      icon: User,
      links: [
        { name: "Login", path: "/login", description: "Sign in to your account" },
        { name: "Profile", path: "/profile", description: "Manage your account and preferences" },
        { name: "My Listings", path: "/my-listings", description: "View and manage your property listings" },
        { name: "Saved Properties", path: "/saved", description: "Properties you've saved for later" },
        { name: "Transactions", path: "/transactions", description: "View your transaction history" },
        { name: "Security Settings", path: "/security", description: "Manage your account security" },
        { name: "Notifications", path: "/notifications", description: "Your notification preferences" }
      ]
    },
    {
      title: "Property Services",
      icon: Building,
      links: [
        { name: "Buy Properties", path: "/filter?status=Buy", description: "Properties available for purchase" },
        { name: "Rent Properties", path: "/filter?status=Rent", description: "Rental properties available" },
        { name: "Post Property", path: "/post-property", description: "List your property with us" },
        { name: "Property Comparison", path: "#comparison", description: "Compare different properties side by side" },
        { name: "Property Search", path: "/filter", description: "Advanced property search and filtering" }
      ]
    },
    {
      title: "Information & Support",
      icon: BookOpen,
      links: [
        { name: "About Us", path: "/about", description: "Learn more about Propy Values" },
        { name: "Contact Us", path: "/contact", description: "Get in touch with our team" },
        { name: "FAQ", path: "/faq", description: "Frequently asked questions" },
        { name: "Blog", path: "/blog", description: "Real estate insights and tips" },
        { name: "Find an Agent", path: "/agents", description: "Connect with our professional agents" },
        { name: "Careers", path: "/careers", description: "Join our growing team" }
      ]
    },
    {
      title: "Legal & Policies",
      icon: Shield,
      links: [
        { name: "Privacy Policy", path: "/privacy-policy", description: "How we protect your privacy" },
        { name: "Terms & Conditions", path: "/terms", description: "Terms of service and usage" },
        { name: "Cookie Policy", path: "/cookies", description: "Our cookie usage policy" },
        { name: "Disclaimer", path: "/disclaimer", description: "Legal disclaimers and limitations" }
      ]
    },
    {
      title: "Tools & Resources",
      icon: Settings,
      links: [
        { name: "EMI Calculator", path: "/tools/emi-calculator", description: "Calculate your loan EMI" },
        { name: "Affordability Calculator", path: "/tools/affordability", description: "Determine your buying power" },
        { name: "Stamp Duty Calculator", path: "/tools/stamp-duty", description: "Calculate applicable stamp duty" },
        { name: "Property Valuation", path: "/tools/valuation", description: "Estimate property value" },
        { name: "Area Converter", path: "/tools/converter", description: "Convert between different area units" }
      ]
    },
    {
      title: "Support & Help",
      icon: Phone,
      links: [
        { name: "Customer Support", path: "/support", description: "Get help from our support team" },
        { name: "Live Chat", path: "/chat", description: "Chat with our representatives" },
        { name: "Report an Issue", path: "/report", description: "Report technical issues or bugs" },
        { name: "Feedback", path: "/feedback", description: "Share your feedback with us" }
      ]
    },
    {
      title: "Other Pages",
      icon: MapPin,
      links: [
        { name: "Site Map", path: "/sitemap", description: "Complete list of all pages" },
        { name: "Sitemap XML", path: "/sitemap.xml", description: "XML sitemap for search engines" },
        { name: "Robots.txt", path: "/robots.txt", description: "Search engine crawling instructions" },
        { name: "API Documentation", path: "/api-docs", description: "Developer API documentation" }
      ]
    }
  ];

  const quickLinks = [
    { name: "Buy a Home", path: "/filter?status=Buy", color: "bg-blue-500" },
    { name: "Rent a Property", path: "/filter?status=Rent", color: "bg-green-500" },
    { name: "Sell Your Property", path: "/post-property", color: "bg-purple-500" },
    { name: "Find an Agent", path: "/agents", color: "bg-orange-500" },
    { name: "Property Valuation", path: "/tools/valuation", color: "bg-red-500" },
    { name: "EMI Calculator", path: "/tools/emi-calculator", color: "bg-indigo-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Site Map
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore all the pages and features available on our website. Find what you're looking for quickly and easily.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow group"
              >
                <div className={`w-3 h-3 ${link.color} rounded-full mr-4`}></div>
                <span className="text-gray-900 dark:text-white font-medium group-hover:text-blue-600 transition-colors">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Site Sections */}
        <div className="space-y-12">
          {siteSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <section.icon className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.path}
                      className="flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-blue-600 transition-colors">
                          {link.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Section */}
        <div className="bg-blue-600 text-white rounded-xl p-8 mt-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-blue-100">
              Use our search feature to find specific content quickly.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search our website..."
                className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is here to assist you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/contact"
              className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <Phone className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                Contact Us
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Get in touch with our team
              </p>
            </Link>
            
            <Link
              to="/faq"
              className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <FileText className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                FAQ
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Find answers to common questions
              </p>
            </Link>
            
            <Link
              to="/chat"
              className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <Settings className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                Live Support
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chat with our support team
              </p>
            </Link>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Last updated: December 2, 2025</p>
          <p>This site map is updated regularly to reflect new pages and features.</p>
        </div>
      </div>
    </div>
  );
}