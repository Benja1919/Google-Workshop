import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions,BackHandler, TextInput } from 'react-native';
import line from '../assets/line.png'
import circle from '../assets/circle.png'
import icon from '../assets/icons/icon.png'
import { firestoreDB,DeleteImageByURI } from './FirebaseDB';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFonts } from 'expo-font';
import { PanGestureHandler } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import {primaryColor, secondaryColor} from '../Color'

const UserProfileScreen = ({ route, navigation }) => {
  const storage = getStorage();
  const { userName } = route.params;
  const [user, setUser] = useState(null);
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [ProfileNameText, setProfileNameText] = useState(null);
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
        setProfileNameText(userData.profilename);

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
      navigation.navigate('MyLists', { _user:user, _profileImageUrl: user.profileImageUrl });
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
      
      const newImage = await getDownloadURL(storageRef);
      await DeleteImageByURI(user.profileImageUrl);
      await firestoreDB().updateUserProfile(currentUser.userName, user.name, newImage || user.profileImageUrl);
      setUser({ ...user, profileImageUrl: newImage || user.profileImageUrl });
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
    await firestoreDB().AddFriend(currentUser, user);
  };
  
  const handleUnfollow = async (user) => {
    await firestoreDB().RemoveFriend(currentUser, user);
  };

  const isFollowing = (user) => {
    return followedUsers.has(user.userName);
  };
  if (!user) {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.header}>User not found</Text> */}
      </View>
    );
  }
  const ChangeName = (event) =>{
    const text = event.nativeEvent.text;
    firestoreDB().UpdateProfileName({userName:userName,newValue:text});
    setUser({...user,profilename: text});
    setProfileNameText(text)
  };
  const buttons = [
    { label: 'Posts', screen: 'Posts' },
    { label: 'My Lists', screen: 'MyLists' },
    { label: 'Friends', screen: 'Network' },
  ];
  const isYou = currentUser?.userName == userName;
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{flex: 1, backgroundColor:"#fffcfd" }}>
        <View style={styles.container}>
          <TouchableOpacity disabled={!isYou} onPress={pickImage}  style={{zIndex:10 }}>
            <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
            {isYou &&
            <Image source={require("../assets/icons/editwhite.png") } style={{tintColor:secondaryColor,width:16,height:17,position:'absolute',bottom:5,right:5}} />
            }
          </TouchableOpacity>
          <Image source={line } style={styles.line} />
          <Image source={circle } style={styles.circle} />
          <View style={{flexDirection:'row',...styles.container}}>
            {isYou &&
            <Image source={require("../assets/icons/editwhite.png") } style={{tintColor:secondaryColor,width:16,height:17,marginRight:7,marginTop:15}} />
            }
            <TextInput value={ProfileNameText} onChangeText={(newText) => setProfileNameText(newText)} editable={isYou} onEndEditing={ChangeName} placeholderTextColor={'black'} style={{fontFamily:"Oswald-Medium",zIndex:10,fontSize:32,paddingTop:5,color:secondaryColor}}/>
          </View>
        </View>

        <View style={styles.profileContainer}>
          {!isYou && currentUser && (
           <View style={styles.buttonsContainer}>
              {isFollowing(user) ? (
            <TouchableOpacity
                style={styles.unfollowButton}
                onPress={() => handleUnfollow(user)}
            >
                <Text style={styles.unfollowButtonText}>Unfollow</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                style={styles.followButton}
                onPress={() => handleFollow(user)}
            >
                <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
        )}
    </View>
)}

          </View>
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigateToScreen(button.screen)}
            >
              <Image source={icon} style={styles.icon}></Image>
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        <View/>

        </View>
        <View style={{ flex: 1 }} />
        <BottomBarComponent navigation={navigation} style={{ justifyContent: 'flex-end' }} />
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  line:{
    height:300,
    width: "100%",
    position: 'absolute',
    zIndex: 1,
    },

  circle:{
    position: 'absolute',
    height: 183,
    width: 183,
    top: -6.5,
    zIndex: 0
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  profileImage: {
    position: 'center',
    width: 170,
    height: 170,
    borderRadius: 170,
    zIndex: 2,
  },
  followButton: {
    backgroundColor: primaryColor,
    width: 100,
    borderWidth: 3,
    borderColor: secondaryColor,
    borderRadius: 35,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
    zIndex: 3,
  },
  followButtonText: {
    color: secondaryColor,
    fontSize: 16,
    fontFamily: "Oswald-Medium",
    alignSelf: 'center'
  },

  unfollowButton: {
    backgroundColor: primaryColor,
    width: 100,
    borderWidth: 3,
    borderColor: secondaryColor,
    borderRadius: 35,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
    zIndex: 3,

  },
  unfollowButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "Oswald-Medium",
    alignSelf: 'center'

  },

  
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    left: 40,
    top: 25
    },

  button:{
    width: 'auto',
    height: 80,
    marginTop: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  icon:{
    height: 70, 
    width:70, 
    alignSelf: 'center',
  },

  buttonText: {
    color: secondaryColor,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Oswald-Medium',
    textAlign: 'center'
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  editButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    zIndex: 10,
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


});

export default UserProfileScreen;
