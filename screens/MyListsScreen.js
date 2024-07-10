import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Button, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyListsScreen = ({ route }) => {
  const { userName } = route.params;
  const navigation = useNavigation();
  const [lists, setLists] = useState({
    'Wish List': [
      { id: '1', name: 'Restaurant 1' },
      { id: '2', name: 'Restaurant B' },
      { id: '3', name: 'Restaurant C' },
    ],
    'Been To': [
      { id: '1', name: 'Restaurant X' },
      { id: '2', name: 'Restaurant Y' },
      { id: '3', name: 'Restaurant Z' },
    ],
  });
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditList, setCurrentEditList] = useState('');
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const renderListItem = ({ item, listName }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => goToRestaurant(item.name)} onLongPress={() => openEditModal(listName, item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const goToRestaurant = (restaurantName) => {
    navigation.navigate('RestaurantScreen', { restaurantName });
  };

  const addNewList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'List name cannot be empty');
      return;
    }
    if (lists[newListName]) {
      Alert.alert('Error', 'List with this name already exists');
      return;
    }

    setLists({
      ...lists,
      [newListName]: [],
    });
    setNewListName('');
  };

  const addItemToList = (listName) => {
    if (newItemName.trim() === '') {
      Alert.alert('Error', 'Item name cannot be empty');
      return;
    }

    const updatedList = [...lists[listName], { id: `${Date.now()}`, name: newItemName }];
    setLists({
      ...lists,
      [listName]: updatedList,
    });
    setNewItemName('');
  };

  const openEditModal = (listName, item) => {
    setCurrentEditList(listName);
    setCurrentEditItem(item);
    setNewItemName(item.name);  // Set the newItemName to the current item name for editing
    setModalVisible(true);
  };

  const handleEditItem = () => {
    if (newItemName.trim() === '') {
      Alert.alert('Error', 'Item name cannot be empty');
      return;
    }

    const updatedList = lists[currentEditList].map((item) =>
      item.id === currentEditItem.id ? { ...item, name: newItemName } : item
    );
    setLists({
      ...lists,
      [currentEditList]: updatedList,
    });
    setModalVisible(false);
    setNewItemName('');
  };

  const handleDeleteItem = () => {
    const updatedList = lists[currentEditList].filter((item) => item.id !== currentEditItem.id);
    setLists({
      ...lists,
      [currentEditList]: updatedList,
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Lists for {userName}</Text>

      {Object.keys(lists).map((listName) => (
        <View key={listName} style={styles.listContainer}>
          <Text style={styles.listTitle}>{listName}</Text>
          <FlatList
            data={lists[listName]}
            renderItem={({ item }) => renderListItem({ item, listName })}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
          <TextInput
            style={styles.input}
            placeholder="New item name"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <Button title="Add Item" onPress={() => addItemToList(listName)} />
        </View>
      ))}

      <View style={styles.addListContainer}>
        <TextInput
          style={styles.input}
          placeholder="New list name"
          value={newListName}
          onChangeText={setNewListName}
        />
        <Button title="Add List" onPress={addNewList} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Edit item name"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Save" onPress={handleEditItem} />
            <Button title="Delete" onPress={handleDeleteItem} color="red" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  addListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
});

export default MyListsScreen;
