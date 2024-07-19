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

const NetworkScreen = ({ route }) => {
  const { userName } = route.params; // קבלת userName מהפרמטרים
  const { currentUser } = useContext(AuthContext); // Use AuthContext to get current user
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userSelected, setUserSelected] = useState({});

  // פונקציה להבאת חברים מה-DB
  const fetchFriends = async () => {
    try {
      console.log(`Fetching friends for user: ${userName}`);
      const friendsList = await firestoreDB().GetUserFriends(userName.toLowerCase()); // Fetch friends data
      console.log('Fetched friends list:', friendsList);
      setUsers(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [userName]); // הוספת userName כתלות

  // פונקציה לבחירת משתמש
  const selectUser = (user) => {
    setUserSelected(user);
    setModalVisible(true);
  };

  // פונקציה לבדוק אם המשתמש הנוכחי עוקב אחרי המשתמש המוצג
  const isFollowing = (user) => {
    return currentUser?.friends?.includes(user.userName) || false;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.userList}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => selectUser(item)}>
            <Image style={styles.image} source={{ uri: item.profileImageUrl }} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.userName}</Text>
              {currentUser?.userName !== item.userName && ( // Check if the current user is not the one being displayed
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => selectUser(item)}>
                  <Text style={styles.followButtonText}>
                    {isFollowing(item) ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
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
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
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
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
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
