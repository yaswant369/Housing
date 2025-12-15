import React from 'react';
import MediaUploader from '../components/property-edit/MediaUploader';

const MediaUploaderTest = () => {
  const handleMediaUpload = (files, metadata) => {
    console.log('Media uploaded:', files, metadata);
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">MediaUploader Component Test</h1>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Test 1: Videos Media Type</h2>
        <div className="border p-4 rounded-lg">
          <MediaUploader
            mediaType="videos"
            onMediaUpload={handleMediaUpload}
            existingMedia={[]}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 2: Photos Media Type</h2>
        <div className="border p-4 rounded-lg">
          <MediaUploader
            mediaType="photos"
            onMediaUpload={handleMediaUpload}
            existingMedia={[]}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 3: Floor Plans Media Type</h2>
        <div className="border p-4 rounded-lg">
          <MediaUploader
            mediaType="floorplans"
            onMediaUpload={handleMediaUpload}
            existingMedia={[]}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 4: Brochures Media Type</h2>
        <div className="border p-4 rounded-lg">
          <MediaUploader
            mediaType="brochures"
            onMediaUpload={handleMediaUpload}
            existingMedia={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaUploaderTest;
