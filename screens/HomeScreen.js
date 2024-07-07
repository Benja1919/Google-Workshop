// HomeScreen.js
import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PostsScreen from './PostsScreen';
import { AuthContext } from './AuthContext';

const HomeScreen = ({ navigation }) => {
  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };
  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };
  const { isLoggedIn, logout } = useContext(AuthContext);
  const handlePress = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigateToLoginScreen();
    }
  };
  return (
    <View style={styles.container}>
      <PostsScreen navigation={navigation} />
      <TouchableOpacity style={styles.circularButton} onPress={navigateToPostCreation}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
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
    backgroundColor: '#0f69ff', // Use a less saturated blue color here
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold', // Make the text bold
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
    right: 90
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
