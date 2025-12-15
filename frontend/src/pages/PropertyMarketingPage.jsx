import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Heart, MapPin, Building, Landmark, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function PropertyMarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Find Your Dream Property Today
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover thousands of residential, commercial, and land properties across India. Buy, rent, or lease with confidence on our trusted platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/properties" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <Search className="mr-2" size={20} />
                  Start Searching Now
                </Link>
                <Link to="/filter?status=Buy" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center">
                  <Home className="mr-2" size={20} />
                  Buy Properties
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-4">
                    <Building className="mx-auto mb-2" size={32} />
                    <span className="font-bold">10K+</span>
                    <p className="text-sm">Properties</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <MapPin className="mx-auto mb-2" size={32} />
                    <span className="font-bold">50+</span>
                    <p className="text-sm">Cities</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Users className="mx-auto mb-2" size={32} />
                    <span className="font-bold">1M+</span>
                    <p className="text-sm">Users</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Heart className="mx-auto mb-2" size={32} />
                    <span className="font-bold">95%</span>
                    <p className="text-sm">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selling Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
                <div className="flex items-center mb-4">
                  <Landmark className="mr-3" size={40} />
                  <h2 className="text-3xl font-bold">Sell or Rent Faster at the Right Price!</h2>
                </div>
                <p className="text-lg mb-6">
                  Your perfect buyer is waiting. List your property now and reach millions of potential customers.
                </p>
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Post Property - It's FREE</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">FREE</span>
                  </div>
                  <p className="text-sm">No hidden charges</p>
                </div>
                <Link to="/my-listings" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2" size={20} />
                  List Your Property
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Modern house for sale"
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Building className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Buying Commercial Property</h3>
              </div>
              <p className="text-gray-600 mb-4">Shops, offices, land, factories, warehouses and more</p>
              <Link to="/properties?type=Commercial" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Commercial <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Home className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Renting a Home</h3>
              </div>
              <p className="text-gray-600 mb-4">Apartments, builder floors, villas and more</p>
              <Link to="/properties?type=Residential" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Residential <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Landmark className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Leasing Commercial Property</h3>
              </div>
              <p className="text-gray-600 mb-4">Shops, offices, land, factories, warehouses and more</p>
              <Link to="/properties?type=Commercial" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Commercial <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">PG and Co-living</h3>
              </div>
              <p className="text-gray-600 mb-4">Organized, owner and broker listed PGs</p>
              <Link to="/properties?type=PG" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore PGs <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <MapPin className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Buy Plots/Land</h3>
              </div>
              <p className="text-gray-600 mb-4">Residential plots, agricultural farm lands, institutional lands and more</p>
              <Link to="/properties?type=Plots" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Land <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide the most comprehensive property solutions with advanced features and trusted services.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
                    <Search className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Extensive Listings</h3>
                    <p className="text-gray-600">Access thousands of verified properties across all categories</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Verified Properties</h3>
                    <p className="text-gray-600">All listings are verified for authenticity and accuracy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Experience</h3>
                    <p className="text-gray-600">Save favorites and get recommendations tailored to you</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Services</h3>
                    <p className="text-gray-600">Enhanced visibility and features for serious sellers</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Happy family in new home"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Browse by Property Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-4 inline-block">
                <Home className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Residential Properties</h3>
              <p className="text-gray-600 mb-4">Find your perfect home - apartments, villas, builder floors and more</p>
              <Link to="/properties?type=Residential" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Residential <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-4 inline-block">
                <Building className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Commercial Properties</h3>
              <p className="text-gray-600 mb-4">Invest in business spaces - offices, shops, warehouses and industrial properties</p>
              <Link to="/properties?type=Commercial" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Commercial <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-4 inline-block">
                <MapPin className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Plots & Land</h3>
              <p className="text-gray-600 mb-4">Build your dream - residential plots, agricultural land, and investment opportunities</p>
              <Link to="/properties?type=Plots" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore Land <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-4 inline-block">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">PG & Co-living</h3>
              <p className="text-gray-600 mb-4">Affordable shared living - organized PGs, co-living spaces and hostels</p>
              <Link to="/properties?type=PG" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                Explore PGs <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Market Insights & Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-green-500">8.2%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Residential Market</h3>
              <p className="text-gray-600">Year-over-year growth in residential property prices</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-green-500">12.5%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Commercial Demand</h3>
              <p className="text-gray-600">Increased demand for office spaces post-pandemic</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <ArrowRight className="text-blue-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-blue-500">5-7%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Rental Yields</h3>
              <p className="text-gray-600">Average rental yields across major cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start your property journey today with our comprehensive platform. Whether you're buying, selling, renting, or investing, we have the perfect solution for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center">
              <Search className="mr-2" size={20} />
              Start Searching Now
            </Link>
            <Link to="/my-listings" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center">
              <Home className="mr-2" size={20} />
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
