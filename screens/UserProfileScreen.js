// UserProfileScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import postsIcon from '../assets/icons/posts.png';
import myListsIcon from '../assets/icons/lists.png';
import myNetworkIcon from '../assets/icons/network.png';
import { firestoreDB } from './FirebaseDB';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { useFonts } from 'expo-font';


const UserProfileScreen = ({ route, navigation }) => {
  const { userName } = route.params;
  const [user, setUser] = useState(null);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  })
  if (!fontsLoaded){
    return undefined;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await firestoreDB().GetUserName(userName);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [userName]);

  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };

  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
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

  const navigateToScreen = (screen) => {
    if (screen === 'Posts') {
      navigation.navigate(screen, { filterUserName: userName });
    } else if (screen === 'MyLists') {
      navigation.navigate('MyLists', { user, profileImageUrl: user.profileImageUrl });
    } else {
      navigation.navigate(screen, { userName });
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>User not found</Text>
      </View>
    );
  }

  const buttons = [
    { label: 'Posts', screen: 'Posts', icon: postsIcon },
    { label: 'My Lists', screen: 'MyLists', icon: myListsIcon },
    { label: 'My Network', screen: 'Network', icon: myNetworkIcon },
  ];

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const radius = Math.min(screenWidth, screenHeight) / 2.7;

  const buttonStyles = buttons.map((button, index) => {
    const angle = (Math.PI) / (buttons.length - 1) * index - Math.PI; // Adjusted angle to start from top
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      ...styles.circleButton,
      left: screenWidth / 2 + x - 40,
      top: screenHeight / 2 + y - 110,
    };
  });

  return (
    <View style={{flex:1}}>
      <View >
        
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={buttonStyles[index]}
            onPress={() => navigateToScreen(button.screen)}
          >
            <Image source={buttons[index].icon} style={styles.icon} />
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.profileContainer}>
          <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
          <Text style={styles.header}>{userName}</Text>
        </View>
      </View>
      <View style={{flex:1}}/>
      <BottomBarComponent navigation={navigation} style={{justifyContent: 'flex-end'}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    top : 230
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
  //  fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Oswald-Medium',

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
  circleButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#282512',
  },
  icon: {
    width: 25,
    height: 25,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Oswald-Medium',

  },
});

export default UserProfileScreen;
