import React from 'react';
import { Search, MapPin, Star, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export default function AgentsPage() {
  const agents = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "/api/placeholder/150/150",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      properties: 156,
      specializations: ["Luxury Homes", "First-time Buyers"],
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      location: "Downtown, New York"
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/api/placeholder/150/150",
      rating: 4.8,
      reviews: 89,
      experience: "6 years",
      properties: 112,
      specializations: ["Commercial Real Estate", "Investment Properties"],
      phone: "+1 (555) 234-5678",
      email: "michael.chen@email.com",
      location: "Manhattan, New York"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "/api/placeholder/150/150",
      rating: 4.7,
      reviews: 203,
      experience: "10 years",
      properties: 198,
      specializations: ["Residential Properties", "Luxury Condos"],
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@email.com",
      location: "Brooklyn, New York"
    },
    {
      id: 4,
      name: "David Thompson",
      image: "/api/placeholder/150/150",
      rating: 4.9,
      reviews: 156,
      experience: "12 years",
      properties: 234,
      specializations: ["Luxury Homes", "Historic Properties"],
      phone: "+1 (555) 456-7890",
      email: "david.thompson@email.com",
      location: "Queens, New York"
    },
    {
      id: 5,
      name: "Lisa Wang",
      image: "/api/placeholder/150/150",
      rating: 4.6,
      reviews: 94,
      experience: "5 years",
      properties: 87,
      specializations: ["New Developments", "Condos"],
      phone: "+1 (555) 567-8901",
      email: "lisa.wang@email.com",
      location: "Staten Island, New York"
    },
    {
      id: 6,
      name: "James Wilson",
      image: "/api/placeholder/150/150",
      rating: 4.8,
      reviews: 168,
      experience: "9 years",
      properties: 189,
      specializations: ["Luxury Homes", "Investment Properties"],
      phone: "+1 (555) 678-9012",
      email: "james.wilson@email.com",
      location: "Bronx, New York"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Real Estate Agent
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with experienced professionals who know your local market
            </p>
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search by location, agent name, or specialty..."
                className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Locations</option>
              <option>Manhattan</option>
              <option>Brooklyn</option>
              <option>Queens</option>
              <option>Bronx</option>
              <option>Staten Island</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Experience: Any</option>
              <option>1-5 years</option>
              <option>5-10 years</option>
              <option>10+ years</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Specialty: Any</option>
              <option>Luxury Homes</option>
              <option>First-time Buyers</option>
              <option>Commercial</option>
              <option>Investment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {agent.name}
                    </h3>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {agent.rating} ({agent.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{agent.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award size={16} className="mr-2" />
                    <span className="text-sm">{agent.experience} experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">{agent.properties} properties sold</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Phone size={16} className="mr-2" />
                    Call
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <Mail size={16} className="mr-2" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our agents are ready to help you find your dream property or get the best value for your current one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              I Want to Buy
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              I Want to Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
