import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', count: 42 },
    { id: 'buying', name: 'Buying Properties', count: 12 },
    { id: 'selling', name: 'Selling Properties', count: 10 },
    { id: 'renting', name: 'Renting Properties', count: 8 },
    { id: 'agents', name: 'Real Estate Agents', count: 6 },
    { id: 'mortgage', name: 'Mortgage & Finance', count: 4 },
    { id: 'legal', name: 'Legal & Documentation', count: 2 }
  ];

  const faqs = [
    // Buying Properties
    {
      id: 1,
      question: "How do I know how much house I can afford?",
      answer: "A good rule of thumb is that your monthly housing costs should not exceed 28% of your gross monthly income. This includes your mortgage payment, property taxes, insurance, and any HOA fees. We recommend getting pre-approved for a mortgage to understand your exact budget.",
      category: 'buying'
    },
    {
      id: 2,
      question: "What should I look for when viewing a property?",
      answer: "Check the foundation, roof, plumbing, electrical systems, HVAC, windows and doors. Look for signs of water damage, pests, or structural issues. Also consider the neighborhood, proximity to schools, transportation, and future development plans.",
      category: 'buying'
    },
    {
      id: 3,
      question: "How long does the home buying process take?",
      answer: "Typically 30-60 days from offer acceptance to closing, depending on financing and inspection timelines. Pre-approval can speed up the process, while repairs or appraisal issues may extend it.",
      category: 'buying'
    },
    {
      id: 4,
      question: "What is a home inspection and do I need one?",
      answer: "A home inspection is a comprehensive evaluation of a property's condition by a licensed professional. It's highly recommended as it can reveal hidden issues and give you leverage for negotiations or repairs before closing.",
      category: 'buying'
    },
    {
      id: 5,
      question: "How do I make a competitive offer?",
      answer: "Research comparable sales, get pre-approved, be flexible with contingencies, consider the seller's timeline, and work with an experienced agent. Your offer should reflect the property's value and current market conditions.",
      category: 'buying'
    },

    // Selling Properties
    {
      id: 6,
      question: "How do I prepare my home for sale?",
      answer: "Clean thoroughly, declutter, depersonalize spaces, make minor repairs, improve curb appeal, and consider staging. Professional photography and pricing competitively are also crucial for a quick sale.",
      category: 'selling'
    },
    {
      id: 7,
      question: "How much should I price my home for?",
      answer: "Your agent will prepare a Comparative Market Analysis (CMA) using recent sales of similar properties in your area. Pricing slightly below market value can create bidding wars and often result in selling for more than asking.",
      category: 'selling'
    },
    {
      id: 8,
      question: "What are closing costs when selling?",
      answer: "Seller closing costs typically range from 6-10% of the sale price, including agent commissions (5-6%), transfer taxes, title insurance, legal fees, and other miscellaneous costs.",
      category: 'selling'
    },
    {
      id: 9,
      question: "Should I make repairs before selling?",
      answer: "Major structural issues should be addressed, but minor cosmetic repairs may not be worth the cost. Focus on repairs that affect safety, functionality, or first impressions. Your agent can advise on which repairs provide the best ROI.",
      category: 'selling'
    },
    {
      id: 10,
      question: "How long does it take to sell a home?",
      answer: "On average, 30-45 days from listing to accepted offer, then 30-60 days to closing. Market conditions, pricing, location, and property condition all affect timing.",
      category: 'selling'
    },

    // Renting Properties
    {
      id: 11,
      question: "What should I check in a rental property?",
      answer: "Inspect plumbing, electrical systems, heating/cooling, windows, doors, security features, neighborhood safety, and proximity to amenities. Take photos of any existing damage before moving in.",
      category: 'renting'
    },
    {
      id: 12,
      question: "How much security deposit is typical?",
      answer: "Usually one to two months' rent, depending on local laws and property type. Some properties may require additional pet deposits or application fees.",
      category: 'renting'
    },
    {
      id: 13,
      question: "Can I break my lease early?",
      answer: "Early lease termination typically requires paying a penalty fee or finding a qualified replacement tenant. Check your lease agreement and local laws for specific requirements and penalties.",
      category: 'renting'
    },
    {
      id: 14,
      question: "What are my rights as a tenant?",
      answer: "You have the right to a habitable living space, privacy, proper notice before entry, return of security deposit (minus normal wear and tear), and protection against discrimination.",
      category: 'renting'
    },

    // Real Estate Agents
    {
      id: 15,
      question: "How do I choose the right real estate agent?",
      answer: "Look for local market expertise, good communication skills, positive reviews, proper licensing, and someone you feel comfortable working with. Interview multiple agents before deciding.",
      category: 'agents'
    },
    {
      id: 16,
      question: "How much does a real estate agent cost?",
      answer: "Typically 5-6% of the sale price, split between the buyer's and seller's agents (2.5-3% each). Buyer agent services are usually free - they get paid by the seller from the commission.",
      category: 'agents'
    },
    {
      id: 17,
      question: "Do I need an agent to buy/sell a home?",
      answer: "While not legally required, agents provide valuable market knowledge, negotiation skills, paperwork handling, and access to listings/networks that can save you time and money.",
      category: 'agents'
    },

    // Mortgage & Finance
    {
      id: 18,
      question: "What types of mortgages are available?",
      answer: "Common types include conventional loans, FHA loans (low down payment), VA loans (for veterans), USDA loans (rural areas), and jumbo loans for high-value properties.",
      category: 'mortgage'
    },
    {
      id: 19,
      question: "What credit score do I need for a mortgage?",
      answer: "Conventional loans typically require 620+, FHA loans 580+, and VA loans no minimum (though most lenders prefer 580+). Higher scores often mean better interest rates.",
      category: 'mortgage'
    },
    {
      id: 20,
      question: "How much down payment do I need?",
      answer: "Conventional loans can be as low as 3%, FHA loans require 3.5%, VA loans can be 0%, and USDA loans 0%. 20% down avoids PMI but isn't required.",
      category: 'mortgage'
    },

    // Legal & Documentation
    {
      id: 21,
      question: "What documents do I need when buying a home?",
      answer: "You'll need ID, income verification (pay stubs, tax returns), bank statements, credit report authorization, purchase agreement, inspection reports, appraisal, and loan documents.",
      category: 'legal'
    },
    {
      id: 22,
      question: "What is title insurance and do I need it?",
      answer: "Title insurance protects against ownership disputes or defects in the property's title. It's required by most lenders and protects your investment from previous ownership issues.",
      category: 'legal'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about buying, selling, and renting properties.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or category filter
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="bg-blue-600 text-white rounded-xl p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-100">
              Our team of real estate experts is here to help you with any questions not covered here.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100 text-sm mb-2">Speak directly with our team</p>
              <a href="tel:+15551234567" className="text-white font-medium hover:underline">
                +1 (555) 123-4567
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100 text-sm mb-2">Send us your detailed question</p>
              <a href="mailto:support@propy.com" className="text-white font-medium hover:underline">
                support@propy.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-blue-100 text-sm mb-2">Chat with our support team</p>
              <button className="text-white font-medium hover:underline">
                Start Chat
              </button>
            </div>
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Most Popular Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.slice(0, 6).map((faq) => (
              <button
                key={faq.id}
                onClick={() => toggleFAQ(faq.id)}
                className="text-left p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <span className="text-gray-900 font-medium">
                  {faq.question}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
