import React from 'react';
import { Home, Briefcase, Map, Users, Building, Plus, MessageSquare, Phone } from 'lucide-react';

const HeroSection = ({ onPostPropertyClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Property Today
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover thousands of residential, commercial, and land properties across India.
            Buy, rent, or lease with confidence on our trusted platform.
          </p>

          {/* Post Property CTA */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Sell or Rent Faster at the Right Price!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your perfect buyer is waiting. List your property now and reach millions of potential customers.
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onPostPropertyClick}
                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Post Property - It's FREE</span>
                  </button>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Post via:</span>
                    <MessageSquare size={18} className="text-green-500" />
                    <span>Chat (Coming Soon)</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <div className="text-blue-600 font-bold text-lg">FREE</div>
                  <div className="text-blue-500 text-sm">No hidden charges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Explore Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Buying Commercial Property */}
            <ServiceCard
              icon={<Briefcase size={24} />}
              title="Buying Commercial Property"
              description="Shops, offices, land, factories, warehouses and more"
              color="blue"
            />

            {/* Renting a Home */}
            <ServiceCard
              icon={<Home size={24} />}
              title="Renting a Home"
              description="Apartments, builder floors, villas and more"
              color="green"
            />

            {/* Leasing Commercial Property */}
            <ServiceCard
              icon={<Building size={24} />}
              title="Leasing Commercial Property"
              description="Shops, offices, land, factories, warehouses and more"
              color="purple"
            />

            {/* PG and Co-living */}
            <ServiceCard
              icon={<Users size={24} />}
              title="PG and Co-living"
              description="Organized, owner and broker listed PGs"
              color="orange"
            />

            {/* Buy Plots/Land */}
            <ServiceCard
              icon={<Map size={24} />}
              title="Buy Plots/Land"
              description="Residential plots, agricultural farm lands, institutional lands and more"
              color="teal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200'
  };

  return (
    <div className={`rounded-xl p-6 transition-all cursor-pointer ${colorClasses[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default HeroSection;
