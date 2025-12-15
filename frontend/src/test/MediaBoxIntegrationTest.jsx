import React from 'react';
import { render } from '@testing-library/react';
import PropertyDetailPage from '../pages/PropertyDetailPage';
import MediaBox from '../components/MediaBox';

// Mock property data with media
const mockProperty = {
  id: 1,
  bhk: 3,
  propertyType: 'Apartment',
  location: 'Bangalore',
  price: 8500000,
  listingType: 'sale',
  description: 'Beautiful 3 BHK apartment',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
  videos: [
    'https://example.com/video1.mp4'
  ],
  agent: {
    name: 'John Doe',
    phone: '9876543210',
    profileImage: 'https://example.com/agent.jpg',
    isVerified: true,
    totalListings: 15
  },
  amenities: ['swimming_pool', 'gym', 'parking'],
  media: {
    photos: [
      { optimizedData: 'https://example.com/photo1.jpg' },
      { mediumData: 'https://example.com/photo2.jpg' }
    ],
    videos: [
      { data: 'https://example.com/video1.mp4' }
    ]
  }
};

describe('PropertyDetailPage MediaBox Integration', () => {
  it('should render MediaBox component with correct props', () => {
    const { getByText } = render(
      <PropertyDetailPage property={mockProperty} />
    );

    // Check if MediaBox is rendered by looking for its characteristic elements
    expect(getByText('Property (2)')).toBeInTheDocument();
    expect(getByText('Videos (1)')).toBeInTheDocument();
  });

  it('should handle properties without media gracefully', () => {
    const propertyWithoutMedia = {
      ...mockProperty,
      images: [],
      videos: [],
      media: {}
    };

    const { getByText } = render(
      <PropertyDetailPage property={propertyWithoutMedia} />
    );

    // Should show no images placeholder
    expect(getByText('No Image Available')).toBeInTheDocument();
  });
});
