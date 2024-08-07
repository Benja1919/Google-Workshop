import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { useFonts } from 'expo-font';

const buttonimagesinverted = {
  home: require('../../assets/icons/home2.png'),
  post: require('../../assets/icons/add2.png'),
  login: require('../../assets/icons/log-in2.png'),
  profile: require('../../assets/icons/avatar2.png'),
};
const buttonimages = {
  home: require('../../assets/icons/home.png'),
  post: require('../../assets/icons/add.png'),
  login: require('../../assets/icons/log-in.png'),
  profile: require('../../assets/icons/avatar.png'),
};

const BottomBarComponent = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../../assets/fonts/Oswald-Medium.ttf")
  });
  const route = useNavigationState(state => state.routes[state.index]);
  const { isLoggedIn, currentUser } = useContext(AuthContext);

  const navigateToPostCreation = () => {
    if (isLoggedIn) {
      navigation.navigate('PostCreation');
    }
  };

  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToProfile = () => {
    if (isLoggedIn) {
      const name = currentUser.userName;
      navigation.navigate('UserProfile', { userName: name });
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };

  let isinownprofile = false;
  if (route.name === 'UserProfile' && isLoggedIn) {
    const { userName } = route.params;
    isinownprofile = currentUser.userName === userName;
  }

  return (
    <View style={styles.container}>
      {/* Bottom bar */}
      <View style={{ ...styles.bottomBar, bottom: route.name !== "HomeScreen" ? 0 : -10 }}>
        {/* Button for home */}
        <View style={{ flexDirection: 'column' }}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
            <Image source={route.name !== "HomeScreen" ? buttonimages.home : buttonimagesinverted.home} style={styles.icon} />
            <Text style={{ alignSelf: 'center', fontFamily: 'Oswald-Light' }}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* Overlay Button for Post */}
        {isLoggedIn && (route.name == "HomeScreen" || route.name == "UserProfile") &&
          <TouchableOpacity style={styles.postButton} onPress={navigateToPostCreation}>
            <Image source={route.name !== "PostCreation" ? buttonimages.post: buttonimagesinverted.post } style={styles.postIcon} />
          </TouchableOpacity>
        }

        {/* Button for profile */}
        <View style={{ flexDirection: 'column' }}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
            <Image source={isLoggedIn ? (isinownprofile ? buttonimagesinverted.profile : buttonimages.profile) : (route.name !== "LoginScreen" ? buttonimages.login : buttonimagesinverted.login)} style={styles.icon} />
            <Text style={{ alignSelf: 'center', fontFamily: 'Oswald-Light' }}>{isLoggedIn ? `Profile` : `Login`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    height: 70,
    left: -20,
    right: -20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    elevation: 15,
  },
  bottomBarButton: {
    backgroundColor: '#fff',
    paddingTop: 0,
    borderRadius: 8,
  },
  icon: {
    width: 25,
    height: 25,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  postButton: {
    position: 'center',
    bottom: 30,  
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 3,
    elevation: 10,
  },
  postIcon: {
    width: 65,
    height: 65,
  },
});

export default BottomBarComponent;
