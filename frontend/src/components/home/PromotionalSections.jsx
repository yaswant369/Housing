import React from 'react';
import { Home, Briefcase, Map, Users, Building, Search, ShieldCheck, Heart, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromotionalSections = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to property search page with the selected category pre-filtered
    navigate('/property-search');
    // In a real implementation, you would pass the category as a query parameter
    // navigate(`/property-search?category=${category.toLowerCase()}`);
  };
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Why Choose Us Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            We provide the most comprehensive property solutions with advanced features and trusted services.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Search size={24} />}
              title="Extensive Listings"
              description="Access thousands of verified properties across all categories"
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Verified Properties"
              description="All listings are verified for authenticity and accuracy"
            />
            <FeatureCard
              icon={<Heart size={24} />}
              title="Personalized Experience"
              description="Save favorites and get recommendations tailored to you"
            />
            <FeatureCard
              icon={<Star size={24} />}
              title="Premium Services"
              description="Enhanced visibility and features for serious sellers"
            />
          </div>
        </div>

        {/* Property Categories Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Browse by Property Type
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Residential Properties */}
            <CategoryCard
              title="Residential Properties"
              description="Find your perfect home - apartments, villas, builder floors and more"
              icon={<Home size={32} />}
              color="bg-blue-50"
              linkText="Explore Residential"
              onClick={() => handleCategoryClick('Residential')}
            />

            {/* Commercial Properties */}
            <CategoryCard
              title="Commercial Properties"
              description="Invest in business spaces - offices, shops, warehouses and industrial properties"
              icon={<Briefcase size={32} />}
              color="bg-green-50"
              linkText="Explore Commercial"
              onClick={() => handleCategoryClick('Commercial')}
            />

            {/* Plots & Land */}
            <CategoryCard
              title="Plots & Land"
              description="Build your dream - residential plots, agricultural land, and investment opportunities"
              icon={<Map size={32} />}
              color="bg-purple-50"
              linkText="Explore Land"
              onClick={() => handleCategoryClick('Plots')}
            />

            {/* PG & Co-living */}
            <CategoryCard
              title="PG & Co-living"
              description="Affordable shared living - organized PGs, co-living spaces and hostels"
              icon={<Users size={32} />}
              color="bg-orange-50"
              linkText="Explore PGs"
              onClick={() => handleCategoryClick('PG')}
            />
          </div>
        </div>

        {/* Market Trends Section */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Market Insights & Trends
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrendCard
              title="Residential Market"
              trend="up"
              percentage="8.2%"
              description="Year-over-year growth in residential property prices"
            />
            <TrendCard
              title="Commercial Demand"
              trend="up"
              percentage="12.5%"
              description="Increased demand for office spaces post-pandemic"
            />
            <TrendCard
              title="Rental Yields"
              trend="stable"
              percentage="5-7%"
              description="Average rental yields across major cities"
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Start your property journey today with our comprehensive platform.
            Whether you're buying, selling, renting, or investing, we have the perfect solution for you.
          </p>
          <button
            onClick={() => navigate('/property-search')}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Searching Now
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const CategoryCard = ({ title, description, icon, color, linkText, onClick }) => {
  return (
    <div className={`${color} rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-blue-600 mt-1">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <button
            onClick={onClick}
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            {linkText} →
          </button>
        </div>
      </div>
    </div>
  );
};

const TrendCard = ({ title, trend, percentage, description }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className={`font-bold text-xl ${trendColor}`}>{percentage}</span>
        <span className={trendColor}>{trendIcon}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default PromotionalSections;
