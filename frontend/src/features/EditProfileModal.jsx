 import React, { useState } from 'react';
import { X, User, Phone, Mail } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function EditProfileModal({ onClose, currentUser, onProfileUpdate }) {
  // Initialize form state with current user data
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      // API call to update profile
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Protected route
        },
        body: JSON.stringify({ name, phone }), // Send only editable fields
      });

      const updatedUser = await response.json();
      if (!response.ok) {
        throw new Error(updatedUser.message || 'Failed to update profile');
      }

      onProfileUpdate(updatedUser); // Update user in App.jsx state and localStorage
      onClose(); // Close the modal

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white  rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </header>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Email (Read-Only) */}
          <FormInput 
            label="Email" 
            id="email" 
            type="email" 
            icon={Mail} 
            value={currentUser.email} 
            disabled={true} 
          />
          <p className="text-xs text-gray-500 -mt-2 ml-1">Email address cannot be changed.</p>

          {/* Name */}
          <FormInput 
            label="Name" 
            id="name" 
            type="text" 
            icon={User} 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          {/* Phone */}
          <FormInput 
            label="Phone" 
            id="phone" 
            type="tel" 
            icon={Phone} 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable Form Input Component (copied from AuthModal)
const FormInput = ({ label, id, type, icon: IconComponent, value, onChange, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700  mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {IconComponent && <IconComponent size={20} className="text-gray-400" />}
      </span>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
    </div>
  </div>
);
