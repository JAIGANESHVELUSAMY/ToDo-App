import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { login } = useAuth();
  const location = useLocation();

  // This effect runs only once when the component first loads.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Call the login function from our context.
      // The context's own useEffect will now handle the state update and navigation.
      login(token);
    } else {
      // If no token is found, you could add a redirect to an error page or login.
      console.error("Authentication callback is missing a token.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array is crucial for it to run only once.

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-primary-color)'
    }}>
      Authenticating, please wait...
    </div>
  );
};

export default AuthCallback;