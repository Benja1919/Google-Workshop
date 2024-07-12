import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import PostsScreen from './PostsScreen';
import { AuthContext } from './AuthContext';

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };

  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen');
  };

  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };

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

      {/* Top right corner for login/logout */}
      <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
        <Text style={styles.loginButtonText}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        
        {/* Button for home */}
        <TouchableOpacity style={styles.bottomBarButton} >
          <Image source={require('../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for search */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => console.log('Search button pressed')}>
          <Image source={require('../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button to navigate to post creation */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToPostCreation}>
        <Image source={require('../assets/icons/plus.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for profile */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
          <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // צבע רקע לפס הרציף
    elevation: 10, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
  },
  bottomBarButton: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  loginButton: {
    position: 'absolute',
    top: 5,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  icon: {
    width: 25,
    height: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
