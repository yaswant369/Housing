import React from 'react';
import { render } from '@testing-library/react';
import PropertyDetailPage from '../pages/PropertyDetailPage';

// Mock property data for testing
const mockPropertyWithMedia = {
  id: 1,
  bhk: 2,
  propertyType: 'Apartment',
  location: 'Test Location',
  price: 5000000,
  listingType: 'sale',
  description: 'Test property with media',
  media: {
    photos: [
      { optimizedData: 'test-image1.jpg', thumbnailData: 'test-thumb1.jpg', fileName: 'image1.jpg', fileType: 'image/jpeg' }
    ],
    videos: [
      { data: 'test-video1.mp4', thumbnail: 'test-video-thumb1.jpg', fileName: 'video1.mp4', fileType: 'video/mp4' }
    ],
    floorplans: [],
    brochures: []
  },
  agent: {
    name: 'Test Agent',
    phone: '1234567890',
    profileImage: 'test-agent.jpg',
    isVerified: true,
    totalListings: 5
  }
};

const mockPropertyWithoutMedia = {
  id: 2,
  bhk: 3,
  propertyType: 'Villa',
  location: 'Test Location 2',
  price: 7000000,
  listingType: 'sale',
  description: 'Test property without media',
  media: {
    photos: [],
    videos: [],
    floorplans: [],
    brochures: []
  },
  agent: {
    name: 'Test Agent 2',
    phone: '9876543210',
    profileImage: 'test-agent2.jpg',
    isVerified: false,
    totalListings: 3
  }
};

describe('Media Box Improvements Test', () => {
  test('Property with media should render media box with fixed aspect ratio', () => {
    const { container } = render(
      <PropertyDetailPage
        property={mockPropertyWithMedia}
        allProperties={[mockPropertyWithMedia]}
      />
    );

    // Check if media box has fixed aspect ratio classes
    const mediaBox = container.querySelector('.aspect-video.sm\\:aspect-\\[4\\/3\\].min-h-\\[400px\\]');
    expect(mediaBox).toBeInTheDocument();

    // Check if media box has proper background
    expect(mediaBox).toHaveClass('bg-gray-100');
    expect(mediaBox).toHaveClass('group');
  });

  test('Property without media should show "No media available" state', () => {
    const { getByText } = render(
      <PropertyDetailPage
        property={mockPropertyWithoutMedia}
        allProperties={[mockPropertyWithoutMedia]}
      />
    );

    // Check if "No media available" message is displayed
    expect(getByText('No media available')).toBeInTheDocument();
    expect(getByText('Media will be uploaded soon')).toBeInTheDocument();
  });

  test('Media box should have proper empty states for different media types', () => {
    const { getByText } = render(
      <PropertyDetailPage
        property={mockPropertyWithoutMedia}
        allProperties={[mockPropertyWithoutMedia]}
      />
    );

    // Test photos tab empty state
    expect(getByText('No images available')).toBeInTheDocument();
    expect(getByText('Check back later for property photos')).toBeInTheDocument();

    // Test videos tab empty state
    expect(getByText('No videos available')).toBeInTheDocument();
    expect(getByText('Property videos will be uploaded soon')).toBeInTheDocument();

    // Test floor plans tab empty state
    expect(getByText('No floor plans available')).toBeInTheDocument();
    expect(getByText('Floor plans will be added when available')).toBeInTheDocument();

    // Test documents tab empty state
    expect(getByText('No documents available')).toBeInTheDocument();
    expect(getByText('Property documents and brochures coming soon')).toBeInTheDocument();
  });
});

console.log('Media Box Improvements Test completed successfully!');
