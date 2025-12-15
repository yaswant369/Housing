import React, { useState, useContext } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { AppContext } from '../context/context';

export default function AuthModal({ onLoginSuccess, onClose }) {
  const { API_URL } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('login');

  // State for forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  // --- 1. ADD LOADING STATE ---
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // <-- Set loading
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      onLoginSuccess(data); // This will navigate away
    } catch (err) {
      setError(err.message);
      setLoading(false); // <-- Stop loading on error
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // <-- Set loading
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      onLoginSuccess(data); // This will navigate away
    } catch (err) {
      setError(err.message);
      setLoading(false); // <-- Stop loading on error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200 flex-shrink-0">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg">Login or Sign Up</h2>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tabs */}
        <div className="flex mb-6 rounded-full bg-gray-200 p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 py-3 rounded-full font-semibold transition-colors ${
              activeTab === 'login' ? 'bg-white shadow' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`w-1/2 py-3 rounded-full font-semibold transition-colors ${
              activeTab === 'signup' ? 'bg-white shadow' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        {/* Forms */}
        {activeTab === 'login' ? (
          <form className="space-y-6" onSubmit={handleLogin}>
            <h3 className="text-2xl font-bold text-center">Welcome Back!</h3>
            <FormInput label="Email" id="login-email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
            <FormInput label="Password" id="login-password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* --- 2. UPDATE BUTTON --- */}
            <button
              type="submit"
              disabled={loading} // Disable when loading
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account? 
              <button type="button" onClick={() => setActiveTab('signup')} className="font-bold text-blue-600 ml-1">Sign Up</button>
            </p>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSignUp}>
            <h3 className="text-2xl font-bold text-center">Create Account</h3>
            <FormInput label="Name" id="signup-name" type="text" icon={User} value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput label="Email" id="signup-email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
            <FormInput label="Phone" id="signup-phone" type="tel" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <FormInput label="Password" id="signup-password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* --- 3. UPDATE BUTTON --- */}
            <button
              type="submit"
              disabled={loading} // Disable when loading
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account? 
              <button type="button" onClick={() => setActiveTab('login')} className="font-bold text-blue-600 ml-1">Login</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// Reusable Form Input Component
const FormInput = ({ label, id, type, icon: IconComponent, value, onChange, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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
