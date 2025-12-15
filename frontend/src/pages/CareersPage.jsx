import React from 'react';
import { MapPin, Clock, DollarSign, Users, Award, Heart, Briefcase, GraduationCap, Star, Send } from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Real Estate Agent",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹62,50,000 - ₹1,25,00,000",
      description: "Join our award-winning team of real estate professionals. We're looking for experienced agents who are passionate about helping clients achieve their real estate goals.",
      requirements: [
        "Active real estate license",
        "Minimum 5 years of experience",
        "Proven track record of sales success",
        "Excellent communication and negotiation skills",
        "Self-motivated and results-driven"
      ]
    },
    {
      id: 2,
      title: "Property Marketing Specialist",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹45,80,000 - ₹70,80,000",
      description: "Create compelling marketing campaigns for property listings. Work with our sales team to develop strategies that showcase properties effectively.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "3+ years of marketing experience",
        "Experience with digital marketing tools",
        "Strong creative and analytical skills",
        "Knowledge of real estate market preferred"
      ]
    },
    {
      id: 3,
      title: "Customer Service Representative",
      department: "Support",
      location: "New York, NY",
      type: "Full-time",
      experience: "2+ years",
      salary: "₹33,30,000 - ₹45,80,000",
      description: "Provide exceptional customer service to our clients. Handle inquiries, schedule appointments, and ensure customer satisfaction.",
      requirements: [
        "High school diploma or equivalent",
        "2+ years of customer service experience",
        "Excellent phone and communication skills",
        "Problem-solving abilities",
        "Knowledge of real estate helpful but not required"
      ]
    },
    {
      id: 4,
      title: "Real Estate Photographer",
      department: "Media",
      location: "New York, NY",
      type: "Freelance",
      experience: "2+ years",
      salary: "₹41,600 - ₹1,25,000 per project",
      description: "Capture stunning photos of properties to help them sell faster. Work with our team to create visual content that showcases properties at their best.",
      requirements: [
        "Professional photography portfolio",
        "2+ years of photography experience",
        "Experience with real estate photography preferred",
        "Own professional photography equipment",
        "Strong attention to detail"
      ]
    },
    {
      id: 5,
      title: "Real Estate Legal Assistant",
      department: "Legal",
      location: "New York, NY",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹41,60,000 - ₹58,30,000",
      description: "Support our legal team with real estate transactions, document preparation, and client communication.",
      requirements: [
        "Associate's or Bachelor's degree",
        "3+ years of legal assistant experience",
        "Knowledge of real estate law preferred",
        "Strong organizational and communication skills",
        "Proficiency in Microsoft Office"
      ]
    },
    {
      id: 6,
      title: "Data Analyst",
      department: "Analytics",
      location: "New York, NY",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹58,30,000 - ₹83,30,000",
      description: "Analyze real estate market trends, customer behavior, and business performance to drive strategic decisions.",
      requirements: [
        "Bachelor's degree in Data Science, Statistics, or related field",
        "3+ years of data analysis experience",
        "Proficiency in SQL, Python, or R",
        "Experience with Tableau or similar tools",
        "Strong analytical and problem-solving skills"
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Base salary plus commission and performance bonuses"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      icon: GraduationCap,
      title: "Professional Development",
      description: "Continuous training and career advancement opportunities"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work-life balance with flexible working hours"
    },
    {
      icon: Users,
      title: "Team Environment",
      description: "Collaborative and supportive team culture"
    },
    {
      icon: Award,
      title: "Recognition Programs",
      description: "Awards and recognition for outstanding performance"
    }
  ];

  const companyValues = [
    {
      title: "Integrity",
      description: "We conduct business with honesty and transparency in all our dealings."
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every service we provide to our clients."
    },
    {
      title: "Innovation",
      description: "We embrace new technologies and methods to improve our services."
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and mutual support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Build your career with the leading real estate company. We're always looking for talented individuals 
              who share our passion for excellence and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#open-positions"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Open Positions
              </a>
              <a 
                href="#company-culture"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Our Culture
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of building your career with our dynamic and growing real estate company.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Culture */}
      <div id="company-culture" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values & Culture
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Employee Testimonials */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What Our Team Says
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Senior Agent",
                  quote: "The support and training I've received here has been incredible. I couldn't have grown my career this fast anywhere else.",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Marketing Specialist",
                  quote: "The collaborative environment makes every day exciting. I love the innovative approach to marketing properties.",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  role: "Team Lead",
                  quote: "Propy Values has given me the opportunity to lead while still growing professionally. Best decision I ever made.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="open-positions" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect role and join our growing team
            </p>
          </div>
          
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Briefcase size={16} className="mr-1" />
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {position.type}
                      </span>
                      <span className="flex items-center">
                        <GraduationCap size={16} className="mr-1" />
                        {position.experience}
                      </span>
                      <span className="flex items-center font-semibold text-green-600">
                        <DollarSign size={16} className="mr-1" />
                        {position.salary}
                      </span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Send size={18} className="mr-2" />
                    Apply Now
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {position.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {position.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Apply */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't see a position that fits? We're always interested in talking to talented individuals. 
            Send us your resume and tell us about yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Send Your Resume
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule an Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
