import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, StyleSheet } from 'react-native';

const EditableListItem = ({ item, onSave, onCancel, onStartEdit, onDelete, isEditing, editItemText, setEditItemText }) => {
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
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
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
      </View>
    );
  }
};

const MyListsScreen = ({ route }) => {
  const { user } = route.params;
  const [lists, setLists] = useState([
    { id: '1', Image: require('../assets/icons/burgerlists.png'), items: [] },
    { id: '2', Image: require('../assets/icons/pizzalists.png'), items: [] },
    { id: '3', Image: require('../assets/icons/check.png'), items: [] },
    { id: '4', Image: require('../assets/icons/wish.png'), items: [] }
  ]);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null); // State for selected icon

  const createNewList = (icon) => { // Pass selected icon as parameter
    if (newListName.trim() === '') {
      alert('Please enter a valid list name');
      return;
    }
    const newList = { id: Date.now().toString(), name: newListName, items: [], Image: icon }; // Use selected icon
    setLists([...lists, newList]);
    setNewListName('');
    setCreateListModalVisible(false);
  };

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
        return updatedList;
      }
      return list;
    });
    setLists(updatedLists);
    setNewItemText('');
  };

  const startEditItem = (itemId, itemName) => {
    setEditItemId(itemId);
    setEditItemText(itemName);
  };

  const saveEditItem = () => {
    const updatedLists = lists.map(list => ({
      ...list,
      items: list.items.map(item =>
        item.id === editItemId ? { ...item, name: editItemText } : item
      )
    }));
    setLists(updatedLists);
    setEditItemId(null);
    setEditItemText('');
  };

  const cancelEditItem = () => {
    setEditItemId(null);
    setEditItemText('');
  };

  const deleteItem = (listId, itemId) => {
    const updatedLists = lists.map(list =>
      list.id === listId ? { ...list, items: list.items.filter(item => item.id !== itemId) } : list
    );
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
      <TouchableOpacity
        style={[styles.categoryButtonIcon, {
          right: 20,
          top: -30,
        }]}
        onPress={() => setCreateListModalVisible(true)}
      >
        <Image source={require('../assets/icons/pluslists.png')} style={styles.categoryButtonIcon} />
      </TouchableOpacity>
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
        />
      )}
    />
  );

  // Render the main content
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s' }} style={styles.profileImage} />
      {renderDefaultButtons()}

      <Modal
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

      <Modal
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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

