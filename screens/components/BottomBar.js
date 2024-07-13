import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const BottomBarComponent = ({ navigation }) => {
    const navigateToPostCreation = () => {
        navigation.navigate('PostCreation');
      };
    
      const navigateToLoginScreen = () => {
        navigation.navigate('LoginScreen');
      };
    
      const navigateToProfile = () => {
        navigation.navigate('ProfileScreen');
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
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
          <Image source={require('../../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for search */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToSearch}>
          <Image source={require('../../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button to navigate to post creation */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToPostCreation}>
        <Image source={require('../../assets/icons/plus.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for profile */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
          <Image source={require('../../assets/icons/profile.png')} style={styles.icon} />
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
    icon: {
      width: 25,
      height: 25,
    },
    buttonText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default BottomBarComponent;