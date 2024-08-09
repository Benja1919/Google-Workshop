import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import PostsScreen from './PostsScreen';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, currentUser} = useContext(AuthContext);

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -50) {
      if(isLoggedIn){
        navigation.navigate('PostCreation');
      }
      else{
        navigation.navigate('LoginScreen');
      }
    }
    else if (event.nativeEvent.translationX > 50) {
      if(isLoggedIn){
        const name = currentUser.userName;
        navigation.navigate('UserProfile', { userName: name });
      }
      else{
        navigation.navigate('LoginScreen');
      }
    }
  };

  const Tab = createMaterialTopTabNavigator();

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={styles.container}>
        <Tab.Navigator>
          {isLoggedIn && <Tab.Screen name="Friends Posts" component={PostsScreen} initialParams={{filterFriends: true}} /> }
          <Tab.Screen name="All Posts" component={PostsScreen} />
        </Tab.Navigator>
        <View>
          <BottomBarComponent navigation={navigation}/>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },

  postScreenContainer: {
    // flex: 0,
    paddingBottom: 30,
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
    // backgroundColor: '#fff', // צבע רקע לפס הרציף
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
