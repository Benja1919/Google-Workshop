// HomeScreen.js

import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PostsScreen from './PostsScreen';
import { AuthContext } from './AuthContext';

/**
 * HomeScreen component that displays the home screen with posts, 
 * a button to navigate to post creation, and a login/logout button.
 *
 * @param {Object} navigation - The navigation prop used for navigating between screens.
 */
const HomeScreen = ({ navigation }) => {
  
  /**
   * Navigates to the PostCreation screen.
   */
  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };

  /**
   * Navigates to the LoginScreen.
   */
  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };

  // Get authentication state and logout function from AuthContext
  const { isLoggedIn, logout } = useContext(AuthContext);

  /**
   * Handles the press event for the login/logout button.
   * If the user is logged in, logs out the user. Otherwise, navigates to the login screen.
   */
  const handlePress = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigateToLoginScreen();
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the posts screen */}
      <PostsScreen navigation={navigation} />

      {/* Button to navigate to post creation */}
      <TouchableOpacity style={styles.circularButton} onPress={navigateToPostCreation}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Button to login/logout */}
      <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
        <Text style={styles.loginButtonText}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  circularButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0f69ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 90,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
