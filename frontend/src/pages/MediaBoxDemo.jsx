import React from 'react';
import MediaBox from '../components/MediaBox';
import { Link } from 'react-router-dom';

/**
 * MediaBox Demo Page
 * Demonstrates the 99acres.com style MediaBox component
 */
export default function MediaBoxDemo() {
  // Sample property data
  const property = {
    bhk: '3',
    propertyType: 'Apartment',
    location: 'Mumbai'
  };

  // Sample images
  const sampleImages = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  // Sample videos
  const sampleVideos = [
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MediaBox Component Demo</h1>
          <p className="text-gray-600">99acres.com style image viewer with carousel and tabs</p>
        </div>

        {/* Demo Section 1: With Images and Videos */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Demo (Images + Videos)</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MediaBox
              images={sampleImages}
              videos={sampleVideos}
              property={property}
            />
          </div>
        </div>

        {/* Demo Section 2: Only Images */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Images Only</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MediaBox
              images={sampleImages}
              videos={[]}
              property={property}
            />
          </div>
        </div>

        {/* Demo Section 3: Only Videos */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Videos Only</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MediaBox
              images={[]}
              videos={sampleVideos}
              property={property}
            />
          </div>
        </div>

        {/* Demo Section 4: No Media (Fallback) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Media (Fallback Placeholder)</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MediaBox
              images={[]}
              videos={[]}
              property={property}
            />
          </div>
        </div>

        {/* Demo Section 5: Single Image */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Single Image</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MediaBox
              images={['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']}
              videos={[]}
              property={property}
            />
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>16:9 aspect ratio container matching 99acres.com design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Media tabs with counts (Property/Videos)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Carousel with navigation arrows</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Mobile swipe support</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Fallback placeholder when no images exist</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Fullscreen modal viewer</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Image counter indicator</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Responsive design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Video support with controls</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Clean, compact layout</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link to="/" className="text-primary hover:text-primary-dark transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
