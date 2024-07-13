import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import PostsScreen from './PostsScreen';
import { AuthContext } from './AuthContext';
import SearchScreen from './SearchScreen';
import BottomBarComponent from './components/BottomBar';
const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  


  return (
    <View style={styles.container}>
      
      <PostsScreen navigation={navigation} />
      <BottomBarComponent navigation={navigation} />
      

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
    top: 0,
    right: 0,
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
