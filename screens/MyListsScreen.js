import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, StyleSheet, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import { firestoreDB } from './FirebaseDB';
import { Timestamp } from 'firebase/firestore';
import { useFonts } from 'expo-font';




const MyListsScreen = ({ route, navigation }) => {

  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  })
  if (!fontsLoaded){
    return undefined;
  }

  const { user, profileImageUrl } = route.params;
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null); // State for selected icon

  const [listDescription, setNewlistDescription] = useState('');
  const [rank, setListRank] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [listPic, setListPic] = useState([]);
  const [mediaTypes, setMediaTypes] = useState('');

  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);

  const EditableListItem = ({ item, onSave, onCancel, onStartEdit, onDelete, isEditing, editItemText, setEditItemText, navigateToRestaurant }) => {
    if (isEditing) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <TextInput
            style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
            value={editItemText}
            onChangeText={text => setEditItemText(text)}
          />
          <TouchableOpacity
            style={{ backgroundColor: 'green', padding: 5, marginLeft: 10, borderRadius: 5 }}
            onPress={onSave}
          >
            <Text style={{ color: 'white' }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: 'red', padding: 5, marginLeft: 10, borderRadius: 5 }}
            onPress={onCancel}
          >
            <Text style={{ color: 'white' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
    //  console.log(currentUser.userName);
   //   console.log(selectedList.userName);
   if(currentUser){
       if (currentUser.userName === user.userName){
      return (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
          onPress={() => navigateToRestaurant(item.name)}
        >
          <Text style={{ flex: 1, marginLeft: 10 }}>{item.name}</Text>
          <TouchableOpacity
            style={{ backgroundColor: 'blue', padding: 5, marginLeft: 10, borderRadius: 5 }}
            onPress={onStartEdit}
          >
            <Text style={{ color: 'white' }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: 'red', padding: 5, marginLeft: 10, borderRadius: 5 }}
            onPress={onDelete}
          >
            <Text style={{ color: 'white' }}>Delete</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  }
    else { //other user viewing elses lists
      return (
      <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
      onPress={() => navigateToRestaurant(item.name)}
    >
      <Text style={{ flex: 1, marginLeft: 10 }}>{item.name}</Text>
      </TouchableOpacity>
      );
    } 

    }
  };

  const createNewList = async (icon) => { // Create a new List, store it in the DB
    if (newListName.trim() === '') {
      alert('Please enter a valid list name');
      return;
    }
    const newList = {
      id: Math.random().toString(),
      userName: currentUser.userName,
      listName: newListName,
      listDescription: listDescription,
      rank: rank,
      restCount: restCount,
      savedCount: savedCount,
      listPic: listPic,
      items: [],
      Image: icon,
      profileImageUrl: currentUser.profileImageUrl,
      createTime: Timestamp.now()
    };

    await firestoreDB().CreateList(newList);
    setNewListName('');
    setCreateListModalVisible(false);
  };

  useEffect(() => { //fetch the list of user from the DB
    const fetchLists = async () => {
    //  if (!currentUser) return;
      try {
        const fetchedLists = await firestoreDB().GetUserLists(user.userName);
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch lists immediately
    fetchLists();

  }, [currentUser]);

  const addItemToList = (listId) => {
    if (newItemText.trim() === '') {
      alert('Please enter a valid item name');
      return;
    }
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedItems = [...list.items, { id: Date.now().toString(), name: newItemText }];
        const updatedList = { ...list, items: updatedItems };
        if (selectedList && selectedList.id === listId) {
          setSelectedList(updatedList);
        }
        // Update the list in Firebase
        firestoreDB().updateListInFirebase(listId, updatedItems);
        return updatedList;
      }
      return list;
    });
    setNewItemText('');
  };

  const startEditItem = (itemId, itemName) => {
    setEditItemId(itemId);
    setEditItemText(itemName);
  };

  const saveEditItem = () => {
    const updatedLists = lists.map(list => {
      const updatedItems = list.items.map(item =>
        item.id === editItemId ? { ...item, name: editItemText } : item
      );
      if (list.id === selectedList.id) {
        // Update the list in Firebase
        firestoreDB().updateListInFirebase(list.id, updatedItems);
      }
      return { ...list, items: updatedItems };
    });
    setLists(updatedLists);
    setEditItemId(null);
    setEditItemText('');
  };

  const cancelEditItem = () => {
    setEditItemId(null);
    setEditItemText('');
  };

  const deleteItem = (listId, itemId) => {
    const updatedLists = lists.map(list => {
      const updatedItems = list.items.filter(item => item.id !== itemId);
      if (list.id === listId) {
        // Update the list in Firebase
        firestoreDB().updateListInFirebase(listId, updatedItems);
      }
      return list.id === listId ? { ...list, items: updatedItems } : list;
    });
    setLists(updatedLists);
  };

  const openList = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  const closeList = () => {
    setSelectedList(null);
    setModalVisible(false);
  };

  const navigateToRestaurant = (restaurantName) => {
    navigation.navigate('Restaurant', { restaurantName });
  };

  const renderDefaultButtons = () => (
    <View style={styles.buttonsContainer}>
      {lists.map((list, index) => (
        <TouchableOpacity
          key={list.id}
          style={[styles.categoryButtonIcon, {
            left: 165 + 140 * Math.cos((index * 2 * Math.PI) / lists.length),
            bottom: 340 + 140 * Math.sin((index * 2 * Math.PI) / lists.length),
          }]}
          onPress={() => openList(list)}
        >
          <Image source={list.Image} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      ))}
      {currentUser && user.userName.toLowerCase() === currentUser.userName.toLowerCase() && ( //only curr user can add lists to his own page
        <TouchableOpacity
          style={[styles.categoryButtonIcon, {
            right: 20,
            top: -30,
          }]}
          onPress={() => setCreateListModalVisible(true)}
        >
          <Image source={require('../assets/icons/pluslists.png')} style={styles.categoryButtonIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
  

  const renderItemList = () => (
    <FlatList
      data={selectedList?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EditableListItem
          item={item}
          onSave={saveEditItem}
          onCancel={cancelEditItem}
          onStartEdit={() => startEditItem(item.id, item.name)}
          onDelete={() => deleteItem(selectedList.id, item.id)}
          isEditing={editItemId === item.id}
          editItemText={editItemText}
          setEditItemText={setEditItemText}
          navigateToRestaurant={navigateToRestaurant}
        />
      )}
    />
  );

  // const handleSubmit = async () => {
  //   if (!restaurantName || stars <= 0 || !content || mediaUris.length === 0) {
  //     Alert.alert('Error', 'Please fill in all fields and select at least one image, video, or GIF');
  //     return;
  //   }

  //   const newList = {
  //     id: Math.random().toString(),
  //     userName: currentUser.userName,
  //     ListName: listName,
  //     listDescription : listDescription,
	// 		rank: rank,
	// 		restCount: restCount,
	// 		savedCount : savedCount,
  //     stars: stars,
  //     content: content,
  //     listPic: listPic,
  //     mediaType: mediaTypes,
  //   };

  //   await firestoreDB().CreateList(newList);
  //   navigation.goBack();
  // };


  // Render the main content
  if(currentUser){
    if (currentUser.userName === user.userName){ //current user logged in to his lists page
  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
      {renderDefaultButtons()}

      <Modal  //List Window
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeList}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.listTitle}>{selectedList?.name}</Text>
            {renderItemList()}
            <TextInput
              style={styles.input}
              placeholder="Enter new item"
              value={newItemText}
              onChangeText={text => setNewItemText(text)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addItemToList(selectedList.id)}
            >
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeList}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal  //Create New List window
        animationType="slide" 
        transparent={true}
        visible={createListModalVisible}
        onRequestClose={() => setCreateListModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.listTitle}>Create New List</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new list name"
              value={newListName}
              onChangeText={text => setNewListName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={listDescription}
              onChangeText={text => setNewlistDescription(text)}
            />
            {/* Display icons for selection */}
            <View style={styles.iconSelectionContainer}>
              {iconData.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iconOption}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Image source={icon} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => createNewList(selectedIcon)} // Pass selectedIcon to createNewList function
            >
              <Text style={styles.createButtonText}>Create New List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCreateListModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
  }
  else{ //someone's viewing other lists
    return (
      <View style={styles.container}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        {renderDefaultButtons()}
  
        <Modal  //List Window
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeList}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.listTitle}>{selectedList?.name}</Text>
              {renderItemList()}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeList}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        <Modal  //Create New List window
          animationType="slide" 
          transparent={true}
          visible={createListModalVisible}
          onRequestClose={() => setCreateListModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.listTitle}>Create New List</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new list name"
                value={newListName}
                onChangeText={text => setNewListName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={listDescription}
                onChangeText={text => setNewlistDescription(text)}
              />
              {/* Display icons for selection */}
              <View style={styles.iconSelectionContainer}>
                {iconData.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.iconOption}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Image source={icon} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => createNewList(selectedIcon)} // Pass selectedIcon to createNewList function
              >
                <Text style={styles.createButtonText}>Create New List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCreateListModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};
};

const iconData = [
  require('../assets/icons/sushilist.png'),
  require('../assets/icons/drinklist.png'),
  require('../assets/icons/dessertlist.png'),
  require('../assets/icons/italianlist.png')

  // Add more icons as needed
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    
  },
  listTitle: {
    fontSize: 20,
    
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: 'Oswald-Medium',

  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    
  },
  categoryButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  iconSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconOption: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default MyListsScreen;

