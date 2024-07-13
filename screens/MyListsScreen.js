import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, StyleSheet } from 'react-native';

// EditableListItem רכיב לעריכת פריט ברשימה
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

// MyListsScreen רכיב עבור עמוד הרשימות של היוזר
const MyListsScreen = ({ route }) => {
  const { user } = route.params; // הנתונים של היוזר מועברים דרך ה-params
  const [lists, setLists] = useState([
    { id: '1', Image: require('../assets/icons/burgerlists.png')},
    { id: '2', Image: require('../assets/icons/pizzalists.png') },
    { id: '3', Image: require('../assets/icons/check.png')},
    { id: '4', Image: require('../assets/icons/wish.png')}
  ]);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);

  const createNewList = () => {
    if (newListName.trim() === '') {
      alert('Please enter a valid list name');
      return;
    }
    const newList = { id: Date.now().toString(), name: newListName, items: [] };
    setLists([...lists, newList]);
    setNewListName('');
    setCreateListModalVisible(false);
  };

  const addItemToList = (listId) => {
    if (newItemText.trim() === '') {
      alert('Please enter a valid item name');
      return;
    }
    const updatedLists = lists.map(list =>
      list.id === listId ? { ...list, items: [...list.items, { id: Date.now().toString(), name: newItemText }] } : list
    );
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
            left: 75 + 130 * Math.cos((index * 2 * Math.PI) / lists.length),
            top: -145 + 130 * Math.sin((index * 2 * Math.PI) / lists.length),
          }]}
          onPress={() => openList(list)}
        >
          <Image source={list.Image} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.categoryButtonIcon, {
          right: -80,
          bottom: 500,
        }]}
        onPress={() => setCreateListModalVisible(true)}
      >
        <Image source={require('../assets/icons/pluslists.png')} style={styles.categoryButtonIcon}/>
      </TouchableOpacity>
    </View>
  );

  const renderItemList = () => (
    <FlatList
      data={selectedList?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ flex: 1, marginLeft: 10 }}>{item.name}</Text>
        </View>
      )}
    />
  );

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
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
              placeholder="Enter new item"
              value={newItemText}
              onChangeText={text => setNewItemText(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, marginLeft: 10, borderRadius: 5 }}
              onPress={() => addItemToList(selectedList.id)}
            >
              <Text style={{ color: 'white' }}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 10, marginTop: 20, borderRadius: 5 }}
              onPress={closeList}
            >
              <Text style={{ color: 'white' }}>Close</Text>
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
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
              placeholder="Enter new list name"
              value={newListName}
              onChangeText={text => setNewListName(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 }}
              onPress={createNewList}
            >
              <Text style={{ color: 'white' }}>Create New List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 }}
              onPress={() => setCreateListModalVisible(false)}
            >
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonsContainer: {
    position: 'relative',
    height: 200,
    width: 200,
  },
  categoryButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  categoryButtonIconText: {
    color: 'white',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default MyListsScreen;