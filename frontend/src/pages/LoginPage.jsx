import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';
import AuthModal from '../features/AuthModal';

export default function LoginPage() {
  const { handleLoginSuccess } = useContext(AppContext);
  const navigate = useNavigate();

  const onLoginSuccess = (userToken, userData) => {
    handleLoginSuccess(userToken, userData);
    navigate('/'); // Navigate to home after login
  };

  const onClose = () => {
    navigate(-1); // Go back to previous page
  };

  return <AuthModal onLoginSuccess={onLoginSuccess} onClose={onClose} />;
}