// Sample property data for demonstration

export const sampleProperties = [
  {
    id: 1,
    title: "3 BHK Apartment in Andheri West",
    bhk: 3,
    propertyType: "Apartment",
    location: "Andheri West, Mumbai, Maharashtra",
    price: 25000000,
    listingType: "buy",
    area: "1200",
    carpetArea: "950",
    builtUpArea: "1200",
    bathrooms: 3,
    balconies: 2,
    floor: 8,
    totalFloors: 20,
    facing: "North",
    furnishing: "semi_furnished",
    constructionStatus: "ready_to_move",
    propertyAge: "5-10 years",
    ownership: "Freehold",
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isOwnerListed: true,
    amenities: [
      "swimming_pool",
      "gym", 
      "parking",
      "lift",
      "security",
      "power_backup",
      "cctv",
      "garden",
      "club_house",
      "water_supply"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300",
        medium: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        isCover: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448075-bb4caa6c82d1?w=800",
        thumbnail: "https://images.unsplash.com/photo-1560448075-bb4caa6c82d1?w=300",
        medium: "https://images.unsplash.com/photo-1560448075-bb4caa6c82d1?w=500"
      },
      {
        url: "https://images.unsplash.com/photo-1560185008-b033106af2ca?w=800",
        thumbnail: "https://images.unsplash.com/photo-1560185008-b033106af2ca?w=300",
        medium: "https://images.unsplash.com/photo-1560185008-b033106af2ca?w=500"
      }
    ],
    description: "Beautiful 3 BHK apartment in the heart of Andheri West with modern amenities and excellent connectivity. The apartment features spacious rooms, modular kitchen, and a beautiful balcony with city views.",
    keyHighlights: [
      "Prime location in Andheri West",
      "Excellent connectivity to airport and railway station",
      "Near shopping malls and restaurants",
      "24/7 security and power backup",
      "Swimming pool and gym facilities"
    ],
    nearbyLandmarks: [
      "Mumbai Airport - 5 km",
      "Andheri Railway Station - 2 km",
      "Infinity Mall - 1.5 km",
      "Phoenix Marketcity - 3 km"
    ],
    agent: {
      name: "Rajesh Sharma",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@realty.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      totalListings: 45
    },
    createdAt: "2024-11-15T10:30:00Z",
    updatedAt: "2024-11-20T14:20:00Z",
    views: 1250,
    inquiries: 23,
    savedCount: 67
  },
  
  {
    id: 2,
    title: "2 BHK Villa in Baner",
    bhk: 2,
    propertyType: "Villa",
    location: "Baner, Pune, Maharashtra",
    price: 8500000,
    listingType: "buy",
    area: "950",
    carpetArea: "850",
    builtUpArea: "950",
    bathrooms: 2,
    balconies: 1,
    floor: "Ground",
    totalFloors: 2,
    facing: "East",
    furnishing: "fully_furnished",
    constructionStatus: "ready_to_move",
    propertyAge: "2-5 years",
    ownership: "Freehold",
    isVerified: true,
    isFeatured: false,
    isNew: true,
    isOwnerListed: false,
    amenities: [
      "garden",
      "parking",
      "water_supply",
      "power_backup",
      "security"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300",
        medium: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
        isCover: true
      },
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300",
        medium: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500"
      }
    ],
    description: "Modern 2 BHK villa in the developing area of Baner with beautiful garden and parking space. Perfect for small families looking for a peaceful living environment.",
    keyHighlights: [
      "Independent villa with garden",
      "Fully furnished with modern fixtures",
      "Peaceful neighborhood",
      "Good schools and hospitals nearby"
    ],
    nearbyLandmarks: [
      "Balewadi High Street - 2 km",
      "Phoenix Marketcity - 4 km",
      "Baner Railway Station - 3 km"
    ],
    agent: {
      name: "Priya Patel",
      phone: "+91 87654 32109",
      email: "priya.patel@realty.com",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b7a2?w=100",
      isVerified: true,
      totalListings: 32
    },
    createdAt: "2024-11-18T09:15:00Z",
    updatedAt: "2024-11-21T16:45:00Z",
    views: 890,
    inquiries: 15,
    savedCount: 42
  },
  
  {
    id: 3,
    title: "1 BHK Apartment for Rent in Koramangala",
    bhk: 1,
    propertyType: "Apartment",
    location: "Koramangala, Bangalore, Karnataka",
    price: 25000,
    listingType: "rent",
    area: "650",
    carpetArea: "550",
    builtUpArea: "650",
    bathrooms: 1,
    balconies: 1,
    floor: 3,
    totalFloors: 10,
    facing: "South",
    furnishing: "semi_furnished",
    constructionStatus: "ready_to_move",
    propertyAge: "3-5 years",
    ownership: "Freehold",
    isVerified: false,
    isFeatured: false,
    isNew: false,
    isOwnerListed: true,
    amenities: [
      "lift",
      "security",
      "power_backup",
      "water_supply"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300",
        medium: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
        isCover: true
      }
    ],
    description: "Compact 1 BHK apartment perfect for bachelors or couples. Located in the heart of Koramangala with easy access to restaurants, cafes, and IT companies.",
    keyHighlights: [
      "Prime location in Koramangala",
      "Close to IT companies and restaurants",
      "Semi-furnished with basic amenities",
      "Good public transport connectivity"
    ],
    nearbyLandmarks: [
      "Forum Mall - 1 km",
      "ITPL - 8 km",
      "Koramangala Metro Station - 2 km"
    ],
    agent: {
      name: "Vikram Reddy",
      phone: "+91 76543 21098",
      email: "vikram.reddy@realty.com",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      isVerified: false,
      totalListings: 18
    },
    createdAt: "2024-11-10T11:20:00Z",
    updatedAt: "2024-11-19T13:30:00Z",
    views: 456,
    inquiries: 8,
    savedCount: 23
  },
  
  {
    id: 4,
    title: "4 BHK Penthouse in DLF Phase 3",
    bhk: 4,
    propertyType: "Penthouse",
    location: "DLF Phase 3, Gurgaon, Haryana",
    price: 45000000,
    listingType: "buy",
    area: "2100",
    carpetArea: "1850",
    builtUpArea: "2100",
    bathrooms: 4,
    balconies: 3,
    floor: "Top Floor",
    totalFloors: 25,
    facing: "North-East",
    furnishing: "fully_furnished",
    constructionStatus: "ready_to_move",
    propertyAge: "1-2 years",
    ownership: "Freehold",
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isOwnerListed: false,
    amenities: [
      "swimming_pool",
      "gym",
      "parking",
      "lift",
      "security",
      "power_backup",
      "cctv",
      "garden",
      "club_house",
      "air_conditioning",
      "servant_room"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300",
        medium: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
        isCover: true
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300",
        medium: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500"
      },
      {
        url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
        thumbnail: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300",
        medium: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500"
      }
    ],
    description: "Luxurious 4 BHK penthouse with panoramic city views, private terrace, and premium finishes. Located in the prestigious DLF Phase 3 with world-class amenities.",
    keyHighlights: [
      "Penthouse with private terrace",
      "Premium finishes and fixtures",
      "Panoramic city views",
      "World-class amenities",
      "Prestigious DLF location",
      "Fully furnished with designer furniture"
    ],
    nearbyLandmarks: [
      "Cyber City - 3 km",
      "IGI Airport - 15 km",
      "Metro Station - 1 km",
      "DLF Mall - 2 km"
    ],
    agent: {
      name: "Amit Gupta",
      phone: "+91 65432 10987",
      email: "amit.gupta@luxuryrealty.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      totalListings: 67
    },
    createdAt: "2024-11-12T14:45:00Z",
    updatedAt: "2024-11-22T10:15:00Z",
    views: 2340,
    inquiries: 56,
    savedCount: 189
  },
  
  {
    id: 5,
    title: "2 BHK Apartment in Hitech City",
    bhk: 2,
    propertyType: "Apartment",
    location: "Hitech City, Hyderabad, Telangana",
    price: 18000000,
    listingType: "buy",
    area: "1100",
    carpetArea: "900",
    builtUpArea: "1100",
    bathrooms: 2,
    balconies: 2,
    floor: 12,
    totalFloors: 20,
    facing: "West",
    furnishing: "semi_furnished",
    constructionStatus: "under_construction",
    propertyAge: "New Launch",
    ownership: "Freehold",
    isVerified: true,
    isFeatured: false,
    isNew: true,
    isOwnerListed: false,
    amenities: [
      "swimming_pool",
      "gym",
      "parking",
      "lift",
      "security",
      "power_backup",
      "cctv",
      "garden",
      "club_house"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
        thumbnail: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300",
        medium: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=500",
        isCover: true
      }
    ],
    description: "Modern 2 BHK apartment in the heart of Hitech City with excellent connectivity to IT companies and modern amenities. Perfect for IT professionals.",
    keyHighlights: [
      "Prime location in Hitech City",
      "Under construction - possession in 6 months",
      "Excellent connectivity to IT companies",
      "Modern amenities and facilities"
    ],
    nearbyLandmarks: [
      "Microsoft Office - 1 km",
      "Google Office - 2 km",
      "Inorbit Mall - 1.5 km",
      "Raidurg Metro Station - 3 km"
    ],
    agent: {
      name: "Srinivas Rao",
      phone: "+91 54321 09876",
      email: "srinivas.rao@realty.com",
      profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e446e4a4c?w=100",
      isVerified: true,
      totalListings: 28
    },
    createdAt: "2024-11-25T16:30:00Z",
    updatedAt: "2024-11-25T16:30:00Z",
    views: 678,
    inquiries: 12,
    savedCount: 34
  },
  
  {
    id: 6,
    title: "3 BHK House in ECR",
    bhk: 3,
    propertyType: "House",
    location: "East Coast Road, Chennai, Tamil Nadu",
    price: 12000000,
    listingType: "buy",
    area: "1800",
    carpetArea: "1500",
    builtUpArea: "1800",
    bathrooms: 3,
    balconies: 2,
    floor: "Ground + 1",
    totalFloors: 2,
    facing: "South",
    furnishing: "unfurnished",
    constructionStatus: "ready_to_move",
    propertyAge: "1-3 years",
    ownership: "Freehold",
    isVerified: false,
    isFeatured: false,
    isNew: false,
    isOwnerListed: true,
    amenities: [
      "parking",
      "water_supply",
      "power_backup",
      "garden"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
        thumbnail: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300",
        medium: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500",
        isCover: true
      }
    ],
    description: "Independent house in the scenic East Coast Road with beautiful sea views. Perfect for families looking for a peaceful lifestyle near the beach.",
    keyHighlights: [
      "Independent house with garden",
      "Sea view from upper floor",
      "Peaceful location near beach",
      "Good schools nearby"
    ],
    nearbyLandmarks: [
      "Marina Beach - 15 km",
      "Phoenix Mall - 12 km",
      "IT Corridor - 20 km"
    ],
    agent: {
      name: "Kumaravel M",
      phone: "+91 43210 98765",
      email: "kumaravel@realty.com",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      isVerified: false,
      totalListings: 15
    },
    createdAt: "2024-11-08T08:45:00Z",
    updatedAt: "2024-11-17T12:20:00Z",
    views: 342,
    inquiries: 6,
    savedCount: 18
  }
];

export const amenitiesList = [
  { id: 'swimming_pool', name: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', name: 'Gym/Fitness Center', icon: '💪' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'lift', name: 'Lift', icon: '🛗' },
  { id: 'security', name: '24/7 Security', icon: '🔒' },
  { id: 'power_backup', name: 'Power Backup', icon: '🔋' },
  { id: 'cctv', name: 'CCTV', icon: '📹' },
  { id: 'garden', name: 'Garden', icon: '🌿' },
  { id: 'children_play_area', name: 'Children Play Area', icon: '🎮' },
  { id: 'club_house', name: 'Club House', icon: '🏢' },
  { id: 'water_supply', name: '24/7 Water Supply', icon: '🚿' },
  { id: 'gas_pipeline', name: 'Gas Pipeline', icon: '🔥' },
  { id: 'fire_safety', name: 'Fire Safety', icon: '🚒' },
  { id: 'rainwater_harvesting', name: 'Rainwater Harvesting', icon: '💧' },
  { id: 'solar_panels', name: 'Solar Panels', icon: '☀️' },
  { id: 'vaastu_compliant', name: 'Vaastu Compliant', icon: '🕉️' },
  { id: 'air_conditioning', name: 'Air Conditioning', icon: '❄️' },
  { id: 'internet_connectivity', name: 'Internet Connectivity', icon: '📶' },
  { id: 'wash_area', name: 'Wash Area', icon: '🧽' },
  { id: 'servant_room', name: 'Servant Room', icon: '👩‍💼' }
];

export const propertyTypes = [
  { id: 'apartment', name: 'Apartment', icon: '🏢' },
  { id: 'villa', name: 'Villa', icon: '🏡' },
  { id: 'house', name: 'House', icon: '🏠' },
  { id: 'plot', name: 'Plot', icon: '🗺️' },
  { id: 'penthouse', name: 'Penthouse', icon: '🏙️' },
  { id: 'office', name: 'Office', icon: '🏢' },
  { id: 'shop', name: 'Shop', icon: '🏪' },
  { id: 'warehouse', name: 'Warehouse', icon: '🏭' },
  { id: 'studio', name: 'Studio', icon: '🏠' }
];

export const cities = [
  'Mumbai, Maharashtra',
  'Delhi, New Delhi',
  'Bangalore, Karnataka',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Visakhapatnam, Andhra Pradesh',
  'Indore, Madhya Pradesh',
  'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh',
  'Pimpri-Chinchwad, Maharashtra',
  'Patna, Bihar',
  'Vadodara, Gujarat'
];

export const budgetRanges = [
  { id: '0-25l', label: 'Under ₹25L', min: 0, max: 2500000 },
  { id: '25l-50l', label: '₹25L - ₹50L', min: 2500000, max: 5000000 },
  { id: '50l-1cr', label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { id: '1cr-2cr', label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { id: '2cr+', label: 'Above ₹2Cr', min: 20000000, max: null }
];

export const rentalRanges = [
  { id: '0-10k', label: 'Under ₹10K', min: 0, max: 10000 },
  { id: '10k-25k', label: '₹10K - ₹25K', min: 10000, max: 25000 },
  { id: '25k-50k', label: '₹25K - ₹50K', min: 25000, max: 50000 },
  { id: '50k-75k', label: '₹50K - ₹75K', min: 50000, max: 75000 },
  { id: '75k+', label: 'Above ₹75K', min: 75000, max: null }
];

export default {
  sampleProperties,
  amenitiesList,
  propertyTypes,
  cities,
  budgetRanges,
  rentalRanges
};