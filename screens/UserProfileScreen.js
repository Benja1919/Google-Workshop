import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions,BackHandler } from 'react-native';
import postsIcon from '../assets/icons/posts.png';
import myListsIcon from '../assets/icons/lists.png';
import myNetworkIcon from '../assets/icons/network.png';
import { firestoreDB } from './FirebaseDB';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFonts } from 'expo-font';
import { PanGestureHandler } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';


const UserProfileScreen = ({ route, navigation }) => {
  const storage = getStorage();
  const { userName } = route.params;
  const [user, setUser] = useState(null);
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());

  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  });
  useEffect(() => {
    const handleBackPress = () => {
      // Prevent the back button from doing anything
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener on component unmount
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
  if (!fontsLoaded) {
    return null;
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
  
  useEffect(() => { //fetch the list of user from the DB
    // Function to fetch friends from DB
    const fetchFriends = async () => {
      try {
        const followedSet = new Set(currentUser?.friends || []);
        setFollowedUsers(followedSet);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
    const unsubscribe = firestoreDB().SubscribeToFriends((friendsList) => {
      const followedSet = new Set(friendsList || []);
      //console.log(followedSet);
      setFollowedUsers(followedSet);
    }, currentUser?.userName);

    return () => unsubscribe();
    }, [userName, currentUser]);

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX > 100) {
      if (isLoggedIn) {
        navigation.navigate('PostCreation');
      } else {
        navigation.navigate('HomeScreen');
      }
    } else if (event.nativeEvent.translationX < -100) {
      navigation.navigate('HomeScreen');
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);
  
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setNewImage(downloadURL);
    }
  };

  const saveChanges = async () => {
    try {
      await firestoreDB().updateUserProfile(currentUser.userName, user.name, newImage || user.profileImageUrl);
      setUser({ ...user, profileImageUrl: newImage || user.profileImageUrl });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
    
  };


  const handleFollow = async (user) => {
    await firestoreDB().AddFriend(currentUser, user.userName);
  };
  
  const handleUnfollow = async (user) => {
    await firestoreDB().RemoveFriend(currentUser, user.userName);
  };

  const isFollowing = (user) => {
    return followedUsers.has(user.userName);
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
    const angle = (Math.PI) / (buttons.length - 1) * index - Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      ...styles.circleButton,
      left: screenWidth / 2 + x - 40,
      top: screenHeight / 2 + y - 110,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{ flex: 1 }}>
        <View>
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
            {currentUser && currentUser.userName === userName ? (
              <Image source={{ uri: newImage || user.profileImageUrl }} style={styles.profileImage} />
            ) : (
              <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
            )}
            <Text style={styles.header}>{user.profilename}</Text>
            {currentUser && currentUser.userName === userName ? (
              <View style={styles.editButtonsContainer}>
                {isEditing ? (
                  <View>
                    <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Change Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveChanges} style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              currentUser && (
                <View style={styles.buttonsContainer}>
                  {isFollowing(user) ? (
                    <>
                      <TouchableOpacity style={styles.followingButton}>
                        <Text style={styles.followingButtonText}>Following</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.unfollowButton}
                        onPress={() => handleUnfollow(user)}
                      >
                        <Text style={styles.unfollowButtonText}>Unfollow</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={() => handleFollow(user)}
                    >
                      <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )
            )}
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <BottomBarComponent navigation={navigation} style={{ justifyContent: 'flex-end' }} />
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: "Oswald-Bold",
    textAlign: 'center',
    margin: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 225,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 200,
    marginBottom: 10,
  },
  followButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Oswald-Medium",
  },
  followingButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
  },
  followingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Oswald-Medium",
  },
  unfollowButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
  },
  unfollowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Oswald-Medium",
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  editButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  editButtonText: {
    fontFamily: 'Oswald-Medium',
    color: 'black',
  },
  actionButton: {
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  actionButtonText: {
    fontFamily: 'Oswald-Medium',
    color: 'black',
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
    backgroundColor: '#fff',
    elevation: 10,
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
