// AuthContext.js

import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';

// Create a context for authentication
export const AuthContext = createContext();

/**
 * AuthProvider component to manage authentication state and provide
 * login and logout functions to its children components.
 *
 * @param {Object} children - The child components that need access to authentication context.
 */
export const AuthProvider = ({ children }) => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to store the current logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Function to log in the user.
   *
   * @param {Object} user - The user object to set as the current user.
   */
  const login = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  /**
   * Function to log out the current user.
   */
  const logout = () => {
    Alert.alert('Success', `Logged out from: ${currentUser.userName}`);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
