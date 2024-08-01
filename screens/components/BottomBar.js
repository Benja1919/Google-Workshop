import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useNavigationState } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
const BottomBarComponent = ({ navigation }) => {
    const route = useNavigationState(state => state.routes[state.index]);
    const {isLoggedIn, currentUser} = useContext(AuthContext);
    const navigateToPostCreation = () => {
        if(isLoggedIn){
            navigation.navigate('PostCreation');
        }
      };
    
      const navigateToLoginScreen = () => {
        navigation.navigate('LoginScreen');
      };
    
      const navigateToProfile = () => {
        if(isLoggedIn){
            const name = currentUser.userName
            navigation.navigate('UserProfile', { userName: name });
        }
        else{
            navigation.navigate('LoginScreen');
        }
      };
    
      const navigateToSearch = () => {
        navigation.navigate('Search');
      };
      const navigateToHome = () => {
        navigation.navigate('HomeScreen');
      };
    return (
    <View style={styles.container}>
      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        
        {/* Button for home */}
        <TouchableOpacity style={route.name != "HomeScreen" ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={navigateToHome}>
          <Image source={require('../../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for search */}
        <TouchableOpacity style={route.name != "MapView" ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={() => navigation.navigate("MapView")}>
          <Image source={require('../../assets/icons/mapview6.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button to navigate to post creation */}
        <TouchableOpacity style={(isLoggedIn && route.name != "PostCreation") ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={navigateToPostCreation}>
        <Image source={require('../../assets/icons/plus4.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for profile */}
        <TouchableOpacity style={route.name != "LoginScreen" && route.name != "ProfileScreen" && route.name != 'UserProfile' ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={navigateToProfile}>
          <Image source={isLoggedIn ? require('../../assets/icons/profile.png') : require('../../assets/icons/login2.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
    );
};
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f0f0f0',
        padding: 10,
    },
    bottomBar: {

      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      left: -10,
      right: -10,
      paddingHorizontal: 20,
      bottom: 10,
      backgroundColor: '#fff', // צבע רקע לפס הרציף
      elevation: 10, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
    },
    bottomBarButton: {
      backgroundColor: '#fff',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    bottomBarButtondisabled: {
        backgroundColor: '#ccc',
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 0,
      },
    icon: {
      width: 26,
      height: 25,
    },
    buttonText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default BottomBarComponent;