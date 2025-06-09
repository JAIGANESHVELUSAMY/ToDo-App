import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize token from localStorage to persist login across page reloads
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [postLoginMessage, setPostLoginMessage] = useState(null); 
    const navigate = useNavigate();
    const location = useLocation();

    // This is the master effect that synchronizes the app with the token state.
    // It runs whenever the 'token' variable changes.
    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 < Date.now()) {
                    // Token is expired
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                } else {
                    // Token is valid
                    setUser(decodedUser);
                    localStorage.setItem('authToken', token);

                    // --- FIX FOR SOCIAL LOGIN HANG ---
                    // If we are on the callback page, it means a social login just completed.
                    // Now that the user state is set, we can safely navigate.
                    if (location.pathname === '/auth/callback') {
                        navigate('/dashboard');
                    }
                }
            } catch (error) {
                // Token is malformed or invalid
                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
            }
        } else {
            // If there is no token, ensure everything is cleared.
            localStorage.removeItem('authToken');
            setUser(null);
        }
    }, [token, navigate, location.pathname]); // This effect depends on these values

    // The login function now has one simple job: update the token.
    // The useEffect above will handle all the consequences.
    const login = (newToken) => {
        if (sessionStorage.getItem('signup_success')) {
            setPostLoginMessage({ title: "Signup Successful!", message: "Welcome to your new dashboard." });
            sessionStorage.removeItem('signup_success');
        }
        setToken(newToken);
        // We also navigate for non-social logins
        if (location.pathname !== '/auth/callback') {
            navigate('/dashboard');
        }
    };

    // The logout function also has one simple job: clear the token.
    const logout = () => {
        setToken(null); // This will trigger the useEffect to clear user state.
        navigate('/');  // Explicitly navigate to the login page.
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, postLoginMessage, setPostLoginMessage }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);