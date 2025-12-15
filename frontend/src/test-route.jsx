// Test file to verify route functionality
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PropertyEditPageWrapper from './pages/PropertyEditPageWrapper';

// Simple test component for the home page
function Home() {
  return (
    <div>
      <h1>Test Home Page</h1>
      <Link to="/my-listings/edit/test-property-id">Test Property Edit Link</Link>
    </div>
  );
}

// Test the route configuration
function TestApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-listings/edit/:propertyId" element={<PropertyEditPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default TestApp;
