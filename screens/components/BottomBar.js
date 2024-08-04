import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useNavigationState } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { useFonts } from 'expo-font';
const buttonimagesinverted = {
  home: require('../../assets/icons/homeinv2.png'),
  post: require('../../assets/icons/plusinv.png'),
  login: require('../../assets/icons/logininv.png'),
  profile: require('../../assets/icons/profileinv.png'),
};
const buttonimages = {
  home: require('../../assets/icons/home.png'),
  post: require('../../assets/icons/plus4.png'),
  login: require('../../assets/icons/login2.png'),
  profile: require('../../assets/icons/profile.png'),
};

const BottomBarComponent = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../../assets/fonts/Oswald-Medium.ttf")
  });
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
    /*
    <TouchableOpacity style={route.name != "MapView" ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={() => navigation.navigate("MapView")}>
      <Image source={require('../../assets/icons/mapview6.png')} style={styles.icon} />
    </TouchableOpacity>
    */
    var isinownprofile = false;
    if(route.name == 'UserProfile' && isLoggedIn){
      const { userName } = route.params;
      isinownprofile = currentUser.userName == userName;
    }
    return (
    <View>
      {/* Bottom bar */}
      <View style={{...styles.bottomBar,bottom: route.name != "HomeScreen" && route.name != "PostCreation" ? 0 : -10}}>
        
        {/* Button for home */}
        <View style={{flexDirection:'column'}}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
            <Image source={route.name != "HomeScreen" ? buttonimages.home : buttonimagesinverted.home} style={styles.icon} />
            <Text style={{alignSelf:'center',fontFamily:'Oswald-Light'}}>Home</Text>
          </TouchableOpacity>
        </View>
        
        {isLoggedIn && 
          <View style={{flexDirection:'column'}}>
            <TouchableOpacity style={(isLoggedIn ) ? styles.bottomBarButton : styles.bottomBarButtondisabled} onPress={navigateToPostCreation}>
              <Image source={route.name != "PostCreation" ? buttonimages.post : buttonimagesinverted.post} style={styles.icon} />
              <Text style={{alignSelf:'center',fontFamily:'Oswald-Light'}}>Post</Text>
            </TouchableOpacity>
          </View>
        }

        {/* Button for profile */}
        <View style={{flexDirection:'column'}}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
            <Image source={isLoggedIn ? (isinownprofile ? buttonimagesinverted.profile : buttonimages.profile) : (route.name != "LoginScreen" ?buttonimages.login : buttonimagesinverted.login)} style={styles.icon} />
            <Text style={{alignSelf:'center',fontFamily:'Oswald-Light'}}>{isLoggedIn ? `Profile`:`Login`}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
    );
};
const styles = StyleSheet.create({
    bottomBar: {

      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      left: -20,
      right: -20,
      paddingHorizontal: 20,
      backgroundColor: '#fff', // צבע רקע לפס הרציף
      elevation: 15, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
    },
    bottomBarButton: {
      backgroundColor: '#fff',
      
      paddingTop:5,
      borderRadius: 8,
    },
    bottomBarButtondisabled: {
      backgroundColor: '#ccc',
      paddingHorizontal: 15,
      borderRadius: 0,
    },
    icon: {
      width: 27,
      height: 25,
    },
    buttonText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default BottomBarComponent;