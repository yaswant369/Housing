import React from 'react';
import { ExternalLink, Building, Calculator, FileText, Phone, Globe, Star, Users, Award } from 'lucide-react';

export default function LinksPage() {
  const linkCategories = [
    {
      title: "Government & Official Resources",
      icon: Building,
      description: "Official government websites for real estate and property information",
      color: "bg-blue-500",
      links: [
        {
          name: "U.S. Department of Housing and Urban Development (HUD)",
          url: "https://www.hud.gov/",
          description: "Federal agency providing housing and community development assistance",
          external: true
        },
        {
          name: "Fannie Mae",
          url: "https://www.fanniemae.com/",
          description: "Home financing solutions and mortgage backing",
          external: true
        },
        {
          name: "Freddie Mac",
          url: "https://www.freddiemac.com/",
          description: "Home loan solutions and mortgage market information",
          external: true
        },
        {
          name: "Federal Housing Administration (FHA)",
          url: "https://www.fha.com/",
          description: " FHA loan information and mortgage insurance programs",
          external: true
        },
        {
          name: "Veterans Affairs (VA) Home Loans",
          url: "https://www.benefits.va.gov/homeloans/",
          description: "VA loan benefits and programs for veterans",
          external: true
        }
      ]
    },
    {
      title: "Financial Tools & Calculators",
      icon: Calculator,
      description: "Financial planning and calculation tools for home buying",
      color: "bg-green-500",
      links: [
        {
          name: "Mortgage Calculator",
          url: "https://www.mortgagecalculator.org/",
          description: "Comprehensive mortgage payment calculator",
          external: true
        },
        {
          name: "Bankrate Calculators",
          url: "https://www.bankrate.com/calculators/",
          description: "Various financial calculators including mortgage, refinancing, and more",
          external: true
        },
        {
          name: "Zillow Mortgage Calculator",
          url: "https://www.zillow.com/mortgage-calculator/",
          description: "Popular mortgage calculator with amortization schedule",
          external: true
        },
        {
          name: "Credit Karma",
          url: "https://www.creditkarma.com/",
          description: "Free credit score monitoring and financial tools",
          external: true
        },
        {
          name: "Mint Budgeting Tool",
          url: "https://mint.intuit.com/",
          description: "Personal budgeting and financial planning platform",
          external: true
        }
      ]
    },
    {
      title: "Market Data & Research",
      icon: Globe,
      description: "Real estate market data and research platforms",
      color: "bg-purple-500",
      links: [
        {
          name: "Realtor.com Market Data",
          url: "https://www.realtor.com/research/",
          description: "National real estate market trends and statistics",
          external: true
        },
        {
          name: "Zillow Research",
          url: "https://www.zillow.com/research/",
          description: "Housing market insights and economic data",
          external: true
        },
        {
          name: "CoreLogic Market Reports",
          url: "https://www.corelogic.com/insights/",
          description: "Property market analytics and reports",
          external: true
        },
        {
          name: "National Association of Realtors (NAR)",
          url: "https://www.nar.realtor/",
          description: "Industry research and statistics",
          external: true
        },
        {
          name: "Urban Land Institute (ULI)",
          url: "https://uli.org/",
          description: "Real estate and land use research organization",
          external: true
        }
      ]
    },
    {
      title: "Property Information & Valuation",
      icon: Star,
      description: "Property valuation and information services",
      color: "bg-orange-500",
      links: [
        {
          name: "Zillow",
          url: "https://www.zillow.com/",
          description: "Property search, listings, and Zestimate valuations",
          external: true
        },
        {
          name: "Redfin",
          url: "https://www.redfin.com/",
          description: "Real estate search platform with market insights",
          external: true
        },
        {
          name: "Trulia",
          url: "https://www.trulia.com/",
          description: "Property listings and neighborhood information",
          external: true
        },
        {
          name: "HomeSnap",
          url: "https://www.homesnap.com/",
          description: "Real estate search with instant property details",
          external: true
        },
        {
          name: "PropertyRadar",
          url: "https://www.propertyradar.com/",
          description: "Comprehensive property information and alerts",
          external: true
        }
      ]
    },
    {
      title: "Professional Organizations",
      icon: Users,
      description: "Real estate professional associations and certifications",
      color: "bg-indigo-500",
      links: [
        {
          name: "National Association of Realtors (NAR)",
          url: "https://www.nar.realtor/",
          description: "Leading professional organization for real estate agents",
          external: true
        },
        {
          name: "Institute of Real Estate Management (IREM)",
          url: "https://www.irem.org/",
          description: "Professional certification for real estate managers",
          external: true
        },
        {
          name: "Real Estate Buyers Agent Council (REBAC)",
          url: "https://www.rebac.net/",
          description: "Certification program for buyer's agents",
          external: true
        },
        {
          name: "Society of Industrial and Office Realtors (SIOR)",
          url: "https://www.sior.com/",
          description: "Professional organization for commercial real estate",
          external: true
        },
        {
          name: "National Association of Exclusive Buyer Agents (NAEBA)",
          url: "https://www.naeba.org/",
          description: "Exclusive buyer agent professional association",
          external: true
        }
      ]
    },
    {
      title: "Legal & Documentation",
      icon: FileText,
      description: "Legal resources and document templates",
      color: "bg-red-500",
      links: [
        {
          name: "FindLaw Real Estate Section",
          url: "https://realestate.findlaw.com/",
          description: "Legal information and resources for real estate",
          external: true
        },
        {
          name: "NOLO Real Estate Center",
          url: "https://www.nolo.com/legal-encyclopedia/real-estate",
          description: "Legal encyclopedia covering real estate law",
          external: true
        },
        {
          name: "American Land Title Association (ALTA)",
          url: "https://www.alta.org/",
          description: "Title insurance and settlement services information",
          external: true
        },
        {
          name: "State Bar Associations",
          url: "https://www.americanbar.org/groups/bar_services/resources/state_local_bar_associations/",
          description: "Find your state bar association for legal referrals",
          external: true
        },
        {
          name: "Legal Templates",
          url: "https://www.lawdepot.com/",
          description: "Legal document templates and forms",
          external: true
        }
      ]
    },
    {
      title: "Home Services & Improvement",
      icon: Award,
      description: "Home improvement and maintenance resources",
      color: "bg-teal-500",
      links: [
        {
          name: "Angi (formerly Angie's List)",
          url: "https://www.angi.com/",
          description: "Home services reviews and contractor recommendations",
          external: true
        },
        {
          name: "HomeAdvisor",
          url: "https://www.homeadvisor.com/",
          description: "Home improvement contractor matching service",
          external: true
        },
        {
          name: "Houzz",
          url: "https://www.houzz.com/",
          description: "Home design, renovation, and improvement platform",
          external: true
        },
        {
          name: "Better Homes & Gardens",
          url: "https://www.bhg.com/",
          description: "Home and garden inspiration and advice",
          external: true
        },
        {
          name: "This Old House",
          url: "https://www.thisoldhouse.com/",
          description: "Home improvement projects and tutorials",
          external: true
        }
      ]
    },
    {
      title: "Mortgage Lenders & Banks",
      icon: Phone,
      description: "Mortgage lending institutions and loan providers",
      color: "bg-yellow-500",
      links: [
        {
          name: "Quicken Loans (Rocket Mortgage)",
          url: "https://www.quickenloans.com/",
          description: "Online mortgage lending platform",
          external: true
        },
        {
          name: "Bank of America Home Loans",
          url: "https://www.bankofamerica.com/home-loans/",
          description: "Mortgage lending through Bank of America",
          external: true
        },
        {
          name: "Wells Fargo Home Mortgage",
          url: "https://www.wellsfargo.com/home-loans/",
          description: "Home mortgage services from Wells Fargo",
          external: true
        },
        {
          name: "Chase Home Lending",
          url: "https://www.chase.com/personal/mortgage",
          description: "Mortgage products and home lending services",
          external: true
        },
        {
          name: "TD Bank Mortgage",
          url: "https://www.tdbank.com/personal/mortgage/",
          description: "Residential mortgage lending services",
          external: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Useful Links & Resources
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore our curated collection of helpful external links, tools, and resources 
              to support your real estate journey.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted External Resources
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We've compiled a list of valuable external resources to help you with every aspect of real estate - 
              from mortgage planning to market research, legal guidance to home improvement. 
              All links are provided for your convenience and are maintained by their respective organizations.
            </p>
          </div>
        </div>

        {/* Link Categories */}
        <div className="space-y-12">
          {linkCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center mr-3`}>
                    <category.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {category.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : ""}
                      className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <ExternalLink className="text-gray-400 mr-3 mt-1 group-hover:text-blue-600 transition-colors flex-shrink-0" size={16} />
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                          {link.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {link.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-12">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Disclaimer
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                The external links provided on this page are for informational purposes only. Propy Values does not endorse, 
                guarantee, or take responsibility for the content, accuracy, or availability of these external websites. 
                Users access these links at their own risk. We recommend reviewing the terms and privacy policies of 
                external websites before providing any personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Contact for Suggestions */}
        <div className="bg-blue-600 text-white rounded-xl p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Suggest a Resource
            </h2>
            <p className="text-blue-100 mb-6">
              Know of a helpful real estate resource we should include? 
              We'd love to hear your suggestions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Phone className="mr-2" size={18} />
                Contact Us
              </a>
              <a
                href="mailto:feedback@propy.com"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                <FileText className="mr-2" size={18} />
                Send Email
              </a>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: December 2, 2025</p>
          <p>Links are reviewed and updated regularly to ensure accuracy and relevance.</p>
        </div>
      </div>
    </div>
  );
}
