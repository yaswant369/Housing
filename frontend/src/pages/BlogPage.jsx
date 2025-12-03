import React, { useState } from 'react';
import { Calendar, User, Tag, Clock, ArrowRight, Search, TrendingUp, Home, DollarSign } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'market-insights', name: 'Market Insights', count: 8 },
    { id: 'buying-guide', name: 'Buying Guide', count: 6 },
    { id: 'selling-tips', name: 'Selling Tips', count: 5 },
    { id: 'investment', name: 'Investment', count: 3 },
    { id: 'mortgage', name: 'Mortgage & Finance', count: 2 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "2024 Real Estate Market Trends: What Buyers Need to Know",
      excerpt: "Explore the latest trends shaping the real estate market this year, from interest rates to inventory levels and how they impact your buying decisions.",
      image: "/api/placeholder/400/250",
      author: "Sarah Johnson",
      date: "2024-11-15",
      readTime: "8 min read",
      category: "market-insights",
      tags: ["Market Trends", "2024", "Buyer Tips"],
      featured: true
    },
    {
      id: 2,
      title: "First-Time Home Buyer's Complete Guide",
      excerpt: "Everything you need to know about buying your first home, from getting pre-approved to closing day. Your step-by-step roadmap to homeownership.",
      image: "/api/placeholder/400/250",
      author: "Michael Chen",
      date: "2024-11-12",
      readTime: "12 min read",
      category: "buying-guide",
      tags: ["First-Time Buyer", "Guide", "Home Buying"],
      featured: true
    },
    {
      id: 3,
      title: "How to Stage Your Home for a Quick Sale",
      excerpt: "Professional staging tips that can help you sell your home faster and for a better price. Learn what buyers want to see.",
      image: "/api/placeholder/400/250",
      author: "Emily Rodriguez",
      date: "2024-11-10",
      readTime: "6 min read",
      category: "selling-tips",
      tags: ["Staging", "Selling", "Home Improvement"],
      featured: false
    },
    {
      id: 4,
      title: "Real Estate Investment Strategies for Beginners",
      excerpt: "Start building wealth through real estate investing. Learn about rental properties, REITs, and other investment opportunities.",
      image: "/api/placeholder/400/250",
      author: "David Thompson",
      date: "2024-11-08",
      readTime: "10 min read",
      category: "investment",
      tags: ["Investment", "Beginner", "Wealth Building"],
      featured: false
    },
    {
      id: 5,
      title: "Mortgage Rates Explained: Fixed vs Variable",
      excerpt: "Understanding the differences between fixed and variable mortgage rates and how to choose the right option for your situation.",
      image: "/api/placeholder/400/250",
      author: "Lisa Wang",
      date: "2024-11-05",
      readTime: "7 min read",
      category: "mortgage",
      tags: ["Mortgage", "Rates", "Finance"],
      featured: false
    },
    {
      id: 6,
      title: "Luxury Real Estate Market Update Q3 2024",
      excerpt: "Analysis of the luxury real estate market performance this quarter, including pricing trends and buyer behavior.",
      image: "/api/placeholder/400/250",
      author: "James Wilson",
      date: "2024-11-03",
      readTime: "9 min read",
      category: "market-insights",
      tags: ["Luxury", "Q3 2024", "Market Analysis"],
      featured: false
    },
    {
      id: 7,
      title: "5 Common Home Selling Mistakes to Avoid",
      excerpt: "Learn about the most common mistakes homeowners make when selling and how to avoid them for a successful sale.",
      image: "/api/placeholder/400/250",
      author: "Sarah Johnson",
      date: "2024-11-01",
      readTime: "5 min read",
      category: "selling-tips",
      tags: ["Selling", "Mistakes", "Avoid"],
      featured: false
    },
    {
      id: 8,
      title: "Best Neighborhoods for First-Time Buyers in NYC",
      excerpt: "Discover the top neighborhoods in New York City that offer great value and amenities for first-time homebuyers.",
      image: "/api/placeholder/400/250",
      author: "Michael Chen",
      date: "2024-10-28",
      readTime: "11 min read",
      category: "buying-guide",
      tags: ["NYC", "First-Time Buyer", "Neighborhoods"],
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Real Estate Insights & Tips
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stay updated with the latest market trends, expert advice, and practical tips for all your real estate needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="mr-2" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.author}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Read More <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {selectedCategory === 'all' ? 'Latest Articles' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'all' && !searchTerm ? regularPosts : filteredPosts).map(post => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.author}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Read More <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-blue-100 mb-6">
              Get the latest real estate insights and market trends delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}