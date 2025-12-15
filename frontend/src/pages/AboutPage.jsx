import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50  pb-16">
      <header className="bg-white  shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-100  rounded-lg mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={40} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Our Housing Platform
            </h2>
            <p className="text-gray-600 text-lg">
              Your trusted partner in finding the perfect home
            </p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              We are a leading real estate platform dedicated to simplifying the property search experience.
              Whether you're looking to buy, sell, or rent, we provide a comprehensive solution that connects
              property seekers with verified listings.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">
              To make property transactions transparent, efficient, and accessible to everyone.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">10,000+ Users</h3>
            <p className="text-sm text-gray-600">
              Trusted by thousands of property seekers and sellers nationwide.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-sm text-gray-600">
              All properties are verified to ensure authenticity and quality.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Email:</strong> info@housing.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> Nellore, Andhra Pradesh, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
