# URL Structure & Sharing Guide

## Overview
This document outlines the unique, shareable URLs for every page in the Housing application. Each page has been assigned a clean, memorable URL that users can easily copy and share.

## URL Structure

### Main Application Pages
- **Home Page**: `/` 
  - Description: Main landing page with property search
  - Shareable: ✅ Yes

- **Properties Listing**: `/properties`
  - Description: Browse all available properties
  - Shareable: ✅ Yes
  - URL Parameters: Supports filtering via query parameters
    - Example: `/properties?status=Buy&location=Nellore`

- **Property Details**: `/property/:id`
  - Description: Detailed view of a specific property
  - Shareable: ✅ Yes
  - Example: `/property/123`

- **Saved Properties**: `/saved`
  - Description: User's saved/favorited properties
  - Shareable: ✅ Yes (Requires authentication)

- **User Profile**: `/profile`
  - Description: User profile management
  - Shareable: ✅ Yes (Requires authentication)

- **My Listings**: `/my-listings`
  - Description: Properties posted by the user
  - Shareable: ✅ Yes (Requires authentication)

### Authentication & Account
- **Login**: `/login`
  - Description: User authentication page
  - Shareable: ✅ Yes

### Property Management
- **Filter Page**: `/filter`
  - Description: Advanced property filtering interface
  - Shareable: ✅ Yes
  - URL Parameters: Supports filter state sharing
    - Example: `/filter?priceMin=1000000&bhk=2`

- **Chat**: `/chat`
  - Description: Property-related messaging
  - Shareable: ✅ Yes (Requires authentication)

### Premium & Payments
- **Premium Plans**: `/premium`
  - Description: Subscription and premium features
  - Shareable: ✅ Yes

- **Premium Features**: `/premium-features`
  - Description: Detailed premium features overview
  - Shareable: ✅ Yes

- **Checkout**: `/checkout`
  - Description: Payment checkout process
  - Shareable: ✅ Yes (Requires authentication)

- **Payment Checkout**: `/payment-checkout`
  - Description: Detailed payment processing
  - Shareable: ✅ Yes (Requires authentication)

- **Payment Success**: `/payment-success`
  - Description: Payment confirmation page
  - Shareable: ✅ Yes (Usually accessed after payment)

- **Transactions**: `/transactions`
  - Description: User transaction history
  - Shareable: ✅ Yes (Requires authentication)

### Tools & Utilities
- **Tools**: `/tools`
  - Description: Property-related calculators and tools
  - Shareable: ✅ Yes

### System Pages
- **About**: `/about`
  - Description: About us and company information
  - Shareable: ✅ Yes

- **Notifications**: `/notifications`
  - Description: User notifications
  - Shareable: ✅ Yes (Requires authentication)

- **Security**: `/security`
  - Description: Security and privacy settings
  - Shareable: ✅ Yes (Requires authentication)

- **Privacy Policy**: `/privacy`
  - Description: Privacy policy and terms
  - Shareable: ✅ Yes

- **Terms of Service**: `/terms`
  - Description: Terms and conditions
  - Shareable: ✅ Yes

## URL Sharing Features

### Copy Link Button
Each page includes a ShareURL component that provides:
- **Copy Button**: One-click copying of the current page URL
- **Share Button**: Native sharing on mobile devices
- **Visual Feedback**: Shows "Copied!" when link is successfully copied
- **Toast Notifications**: Confirms successful link copying

### Location of Share Features
- **Footer**: Share URL appears at the bottom of every page
- **Properties Page**: Additional share component in the header area
- **Property Detail Page**: Share component below the main header
- **All Pages**: Consistent sharing experience across the application

### URL Features
- **Clean URLs**: All routes use human-readable, SEO-friendly paths
- **Query Parameters**: Supported for filtering and state preservation
- **Deep Linking**: Direct access to specific content via URLs
- **Authentication Handling**: Proper redirects for pages requiring login

## Technical Implementation

### React Router Configuration
```jsx
// Routes are defined in App.jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<HomePage />} />
  <Route path="property/:id" element={<PropertyDetailWrapper />} />
  <Route path="properties" element={<PropertiesPage />} />
  <Route path="saved" element={<SavedPage />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="my-listings" element={<MyListingsPage />} />
  // ... additional routes
</Route>
```

### ShareURL Component
```jsx
// Reusable component for sharing URLs
<ShareURL 
  title="Page title for sharing"
  showLabel={true}
  size="small"
  className="additional-styling"
/>
```

### Features
- **Clipboard API**: Modern browser support with fallback
- **Web Share API**: Native mobile sharing when available
- **Toast Notifications**: User feedback for copy actions
- **Responsive Design**: Works on desktop and mobile devices

## Best Practices for URL Sharing

### For Users
1. **Direct Links**: Share specific property pages or search results
2. **Filter Preservation**: URLs maintain search/filter state when shared
3. **Mobile Sharing**: Use native share buttons on mobile devices
4. **Copy Confirmation**: Look for "Copied!" message when using copy button

### For Developers
1. **Route Naming**: Use descriptive, lowercase route names with hyphens
2. **Parameter Handling**: Support query parameters for filter state
3. **Authentication**: Implement proper redirects for protected routes
4. **SEO Optimization**: Use semantic URLs that describe content

## Testing URLs
To test the URL structure:
1. Navigate through different pages
2. Use the copy button to test URL sharing
3. Test direct URL access by typing URLs in the address bar
4. Verify mobile sharing functionality on mobile devices
5. Test filter preservation by applying filters and sharing URLs

## Browser Compatibility
- **Modern Browsers**: Full support for Clipboard API and Web Share API
- **Legacy Browsers**: Fallback to traditional copy methods
- **Mobile**: Optimized sharing experience with native APIs

## Future Enhancements
- **Social Media Integration**: Direct sharing to social platforms
- **QR Code Generation**: Generate QR codes for easy mobile access
- **Short URLs**: URL shortening for easier sharing
- **Analytics**: Track link sharing and engagement metrics

---

*Last Updated: November 29, 2025*
*Application Version: 1.0*