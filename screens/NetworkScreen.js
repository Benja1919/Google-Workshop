import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { AuthContext } from './AuthContext'; // Import AuthContext
import { firestoreDB } from './FirebaseDB';
import { useFonts } from 'expo-font';
import BottomBarComponent from './components/BottomBar';

const NetworkScreen = ({ navigation, route }) => {
  const { userName } = route.params; // Get userName from parameters
  const { currentUser } = useContext(AuthContext); // Use AuthContext to get current user
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [followedUsers, setFollowedUsers] = useState(new Set()); // State to track followed users
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  })
  if (!fontsLoaded){
    return undefined;
  }


  const navigateToProfile = (userName) => {
    navigation.navigate('UserProfile', { userName });
  };
  useEffect(() => { //fetch the list of user from the DB
  // Function to fetch friends from DB
  const fetchFriends = async () => {
    try {
      const friendsList = await firestoreDB().GetUserFriends(userName.toLowerCase()); // Fetch friends data
      setUsers(friendsList);
      const followedSet = new Set(currentUser?.friends || []);
      setFollowedUsers(followedSet);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  fetchFriends();
  const unsubscribe = firestoreDB().SubscribeToFriends((friendsList) => {
    const followedSet = new Set(friendsList || []);
    setFollowedUsers(followedSet);
  }, currentUser?.userName);

  return () => unsubscribe();
  }, [userName]); // Add userName as a dependency


  const handleFollow = async (user) => {
    await firestoreDB().AddFriend(currentUser, user.userName);
  };
  
  const handleUnfollow = async (user) => {
    await firestoreDB().RemoveFriend(currentUser, user.userName);
  };
  

  // Function to select a user
  const selectUser = (user) => {
    setUserSelected(user);
    setModalVisible(true);
  };

  // Function to check if the current user is following the displayed user
  const isFollowing = (user) => {
    //console.log(followedUsers);
    return followedUsers.has(user.userName);
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.userList}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigateToProfile(item.userName)}>
            <Image style={styles.image} source={{ uri: item.profileImageUrl }} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.profilename}</Text>
              {currentUser?.userName !== item.userName && currentUser && (
                <View style={styles.buttonsContainer}>
                  {isFollowing(item) ? (
                    <>
                      <TouchableOpacity
                        style={styles.followingButton}>
                        <Text style={styles.followingButtonText}>Following</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.unfollowButton}
                        onPress={() => handleUnfollow(item)}>
                        <Text style={styles.unfollowButtonText}>Unfollow</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={() => handleFollow(item)}>
                      <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
              <ScrollView contentContainerStyle={styles.modalInfo}>
                <Image style={styles.image} source={{ uri: userSelected.profileImageUrl }} />
                <Text style={styles.name}>{userSelected.userName}</Text>
                <Text style={styles.position}>{userSelected.position}</Text>
                <Text style={styles.about}>{userSelected.about}</Text>
              </ScrollView>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BottomBarComponent navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#eeeeee',
  },
  userList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    flexBasis: '46%',
    padding: 10,
    flexDirection: 'row',
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'left',
    color: '#008080',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#696969',
  },
  about: {
    marginHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  followButton: {
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
    marginRight: 10,
  },
  followingButton: {
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
    marginRight: 10,
  },
  unfollowButton: {
      height: 35,
      width: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#FF6347', // Red background for unfollow
      marginLeft: 10,
  },
  unfollowButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Oswald-Medium',

  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Oswald-Medium',

  },
  followingButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Oswald-Medium',

  },
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    justifyContent: 'center',
  },
  popupContent: {
    margin: 5,
    height: 250,
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  btnClose: {
    flex: 1,
    height: 40,
    backgroundColor: '#20b2aa',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtClose: {
    color: 'white',
  },
});

export default NetworkScreen;
