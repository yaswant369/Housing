# Real Estate Property Search API Structure

## 🔗 Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 📋 Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🏠 Property Endpoints

### 1. Search Properties
```http
GET /api/properties/search
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12, max: 50)
- `search` (string): Search query for location, type, description
- `location` (string): Specific location filter
- `listingType` (string): buy, rent, commercial, pg
- `propertyTypes` (array): apartment, villa, house, plot, penthouse, office, shop, warehouse, studio
- `bhkTypes` (array): 1, 2, 3, 4, 5
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minArea` (number): Minimum area in sq ft
- `maxArea` (number): Maximum area in sq ft
- `furnishing` (array): unfurnished, semi_furnished, fully_furnished
- `constructionStatus` (array): ready_to_move, under_construction, new_launch
- `amenities` (array): swimming_pool, gym, parking, lift, security, power_backup, etc.
- `sellerTypes` (array): owner, broker, builder, developer
- `availability` (array): immediate, 1_month, 3_months, 6_months
- `isVerified` (boolean): Filter verified properties only
- `isFeatured` (boolean): Filter featured properties only
- `sortBy` (string): relevance, newest, price_low_high, price_high_low, area_low_high, area_high_low
- `coordinates` (object): { lat, lng, radius } for location-based search

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "3 BHK Apartment in Andheri West",
        "bhk": 3,
        "propertyType": "apartment",
        "location": "Andheri West, Mumbai, Maharashtra",
        "price": 25000000,
        "listingType": "buy",
        "area": "1200",
        "carpetArea": "950",
        "builtUpArea": "1200",
        "bathrooms": 3,
        "balconies": 2,
        "floor": 8,
        "totalFloors": 20,
        "facing": "north",
        "furnishing": "semi_furnished",
        "constructionStatus": "ready_to_move",
        "propertyAge": "5-10 years",
        "ownership": "freehold",
        "isVerified": true,
        "isFeatured": true,
        "isNew": false,
        "amenities": ["swimming_pool", "gym", "parking", "lift", "security"],
        "images": [
          {
            "url": "https://example.com/image1.jpg",
            "thumbnail": "https://example.com/thumb1.jpg",
            "medium": "https://example.com/medium1.jpg",
            "isCover": true
          }
        ],
        "description": "Beautiful 3 BHK apartment...",
        "keyHighlights": [
          "Prime location in Andheri West",
          "Excellent connectivity"
        ],
        "nearbyLandmarks": [
          "Mumbai Airport - 5 km",
          "Andheri Railway Station - 2 km"
        ],
        "agent": {
          "id": 101,
          "name": "Rajesh Sharma",
          "phone": "+91 98765 43210",
          "email": "rajesh@realty.com",
          "profileImage": "https://example.com/agent1.jpg",
          "isVerified": true,
          "totalListings": 45
        },
        "createdAt": "2024-11-15T10:30:00Z",
        "updatedAt": "2024-11-20T14:20:00Z",
        "views": 1250,
        "inquiries": 23,
        "savedCount": 67,
        "coordinates": {
          "latitude": 19.1136,
          "longitude": 72.8697
        }
      }
    ],
    "totalCount": 156,
    "currentPage": 1,
    "totalPages": 13,
    "hasMore": true,
    "filters": {
      "priceRange": {
        "min": 1000000,
        "max": 100000000
      },
      "areaRange": {
        "min": 300,
        "max": 5000
      },
      "availablePropertyTypes": ["apartment", "villa", "house"],
      "availableAmenities": ["swimming_pool", "gym", "parking"]
    }
  }
}
```

### 2. Get Property Details
```http
GET /api/properties/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "property": {
      // Same structure as search result
    },
    "similarProperties": [
      // Array of similar properties
    ],
    "priceHistory": [
      {
        "date": "2024-11-01",
        "price": 26000000
      }
    ],
    "marketInsights": {
      "averagePricePerSqft": 20833,
      "priceTrend": "increasing",
      "demandLevel": "high"
    }
  }
}
```

### 3. Get Similar Properties
```http
GET /api/properties/:id/similar
```

**Query Parameters:**
- `limit` (number): Number of similar properties (default: 4)

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      // Array of similar properties
    ]
  }
}
```

### 4. Save/Unsave Property
```http
POST /api/properties/:id/save
DELETE /api/properties/:id/save
```

**Response:**
```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "saved": true,
    "savedCount": 68
  }
}
```

### 5. Add Property to Comparison
```http
POST /api/properties/compare
DELETE /api/properties/compare/:propertyId
```

**Request Body:**
```json
{
  "propertyIds": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comparedProperties": [
      // Array of compared properties
    ]
  }
}
```

## 🔍 Location & Search Endpoints

### 1. Location Autocomplete
```http
GET /api/locations/autocomplete
```

**Query Parameters:**
- `q` (string): Search query
- `limit` (number): Number of suggestions (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "mumbai_maharashtra",
        "name": "Mumbai, Maharashtra",
        "type": "city",
        "coordinates": {
          "latitude": 19.0760,
          "longitude": 72.8777
        },
        "popularity": 95
      }
    ]
  }
}
```

### 2. Get Popular Locations
```http
GET /api/locations/popular
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "name": "Mumbai, Maharashtra",
        "propertyCount": 1250,
        "averagePrice": 25000000
      }
    ],
    "localities": [
      {
        "name": "Andheri West, Mumbai",
        "propertyCount": 450,
        "averagePrice": 28000000
      }
    ]
  }
}
```

## 📊 Filter & Master Data Endpoints

### 1. Get Property Types
```http
GET /api/property-types
```

**Response:**
```json
{
  "success": true,
  "data": {
    "types": [
      {
        "id": "apartment",
        "name": "Apartment",
        "icon": "🏢",
        "category": "residential"
      }
    ]
  }
}
```

### 2. Get Amenities
```http
GET /api/amenities
```

**Query Parameters:**
- `category` (string): Filter by category (security, recreation, utilities, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "amenities": [
      {
        "id": "swimming_pool",
        "name": "Swimming Pool",
        "icon": "🏊",
        "category": "recreation",
        "popularity": 85
      }
    ]
  }
}
```

### 3. Get Budget Ranges
```http
GET /api/budget-ranges
```

**Query Parameters:**
- `listingType` (string): buy, rent

**Response:**
```json
{
  "success": true,
  "data": {
    "buy": [
      {
        "id": "0-25l",
        "label": "Under ₹25L",
        "min": 0,
        "max": 2500000,
        "propertyCount": 1250
      }
    ],
    "rent": [
      {
        "id": "0-10k",
        "label": "Under ₹10K",
        "min": 0,
        "max": 10000,
        "propertyCount": 850
      }
    ]
  }
}
```

## 🗺️ Map & Location Endpoints

### 1. Get Properties on Map
```http
GET /api/properties/map
```

**Query Parameters:**
- `bounds` (object): { north, south, east, west }
- `zoom` (number): Map zoom level
- `filters` (object): Same filters as search endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "coordinates": {
          "latitude": 19.1136,
          "longitude": 72.8697
        },
        "price": 25000000,
        "bhk": 3,
        "propertyType": "apartment",
        "image": "https://example.com/thumb1.jpg"
      }
    ],
    "clusters": [
      {
        "coordinates": {
          "latitude": 19.1136,
          "longitude": 72.8697
        },
        "propertyCount": 15,
        "averagePrice": 23000000
      }
    ]
  }
}
```

### 2. Get Nearby Amenities
```http
GET /api/properties/:id/nearby
```

**Query Parameters:**
- `radius` (number): Search radius in km (default: 2)
- `types` (array): school, hospital, mall, metro, etc.

**Response:**
```json
{
  "success": true,
  "data": {
    "amenities": [
      {
        "type": "school",
        "name": "Ryan International School",
        "distance": 0.5,
        "coordinates": {
          "latitude": 19.1150,
          "longitude": 72.8700
        }
      }
    ]
  }
}
```

## 💾 User Endpoints

### 1. Get Saved Properties
```http
GET /api/users/saved-properties
```

**Query Parameters:**
- `page` (number)
- `limit` (number)

### 2. Get Recently Viewed
```http
GET /api/users/recently-viewed
```

### 3. Get Search History
```http
GET /api/users/search-history
```

### 4. Save Search Alert
```http
POST /api/users/search-alerts
```

**Request Body:**
```json
{
  "name": "Mumbai 3BHK Under 3Cr",
  "filters": {
    "location": "Mumbai",
    "bhkTypes": [3],
    "maxPrice": 30000000,
    "listingType": "buy"
  },
  "frequency": "daily",
  "email": true,
  "push": true
}
```

## 📱 Contact & Inquiry Endpoints

### 1. Send Inquiry
```http
POST /api/inquiries
```

**Request Body:**
```json
{
  "propertyId": 1,
  "message": "I'm interested in this property. Please contact me.",
  "contactMethod": "phone",
  "preferredTime": "evening"
}
```

### 2. Get Inquiries
```http
GET /api/inquiries
```

**Query Parameters:**
- `propertyId` (number)
- `status` (string): pending, responded, closed

## 📈 Analytics & Insights Endpoints

### 1. Get Property Analytics
```http
GET /api/properties/:id/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "views": {
      "total": 1250,
      "thisMonth": 180,
      "trend": "increasing"
    },
    "inquiries": {
      "total": 23,
      "thisMonth": 5,
      "responseRate": 78
    },
    "saves": {
      "total": 67,
      "thisMonth": 12
    },
    "priceHistory": [
      {
        "date": "2024-11-01",
        "price": 26000000,
        "event": "price_change"
      }
    ]
  }
}
```

### 2. Market Insights
```http
GET /api/insights/market/:location
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "Andheri West, Mumbai",
    "priceTrends": {
      "trend": "increasing",
      "changePercentage": 12.5,
      "averagePrice": 28500000
    },
    "demandMetrics": {
      "demandLevel": "high",
      "supplyLevel": "medium",
      "averageDaysOnMarket": 45
    },
    "popularPropertyTypes": [
      {
        "type": "apartment",
        "percentage": 65
      }
    ]
  }
}
```

## 🔧 Utility Endpoints

### 1. Calculate EMI
```http
POST /api/calculators/emi
```

**Request Body:**
```json
{
  "principal": 25000000,
  "interestRate": 8.5,
  "tenure": 20
}
```

### 2. Price Prediction
```http
GET /api/calculators/price-prediction/:propertyId
```

### 3. Compare Markets
```http
GET /api/insights/compare-markets
```

**Query Parameters:**
- `locations` (array): ["Mumbai", "Pune", "Bangalore"]
- `propertyType` (string)
- `bhk` (number)

## 🚀 Real-time Endpoints (WebSocket)

### 1. Property Updates
```javascript
// WebSocket connection for real-time property updates
ws://localhost:5000/ws/properties
```

**Events:**
- `property_updated`: Property details changed
- `new_property`: New property added
- `price_changed`: Property price updated
- `property_sold`: Property status changed to sold

### 2. Search Results Updates
```javascript
// WebSocket connection for search result updates
ws://localhost:5000/ws/search
```

## 📱 Push Notifications

### 1. Register Push Token
```http
POST /api/notifications/register
```

**Request Body:**
```json
{
  "token": "push_token_here",
  "platform": "web",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "screenResolution": "1920x1080"
  }
}
```

### 2. Notification Preferences
```http
PUT /api/users/notification-preferences
```

**Request Body:**
```json
{
  "email": {
    "newProperties": true,
    "priceChanges": true,
    "searchAlerts": true
  },
  "push": {
    "newProperties": false,
    "priceChanges": true,
    "inquiries": true
  }
}
```

## 🔍 Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid property ID",
    "details": {
      "field": "id",
      "value": "invalid"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## 📊 Rate Limiting

- Search endpoints: 100 requests per minute per IP
- Property details: 500 requests per minute per IP
- Map endpoints: 200 requests per minute per IP
- Contact endpoints: 50 requests per minute per IP

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting per IP and user
- CORS configuration
- Request logging
- SQL injection prevention
- XSS protection
- File upload restrictions
- API key rotation

## 📈 Performance Optimizations

- Response caching with Redis
- Database query optimization
- Image optimization and CDN
- Lazy loading for large datasets
- Pagination for all list endpoints
- Compression for API responses
- Connection pooling for database