import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

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

const MyListsScreen = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');

  const createNewList = () => {
    if (newListName.trim() === '') {
      alert('Please enter a valid list name');
      return;
    }
    const newList = { id: Date.now().toString(), name: newListName, items: [] };
    setLists([...lists, newList]);
    setNewListName('');
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
    const updatedLists = lists.map(list =>
      list.id === editItemId ? { ...list, items: list.items.map(item =>
        item.id === editItemId ? { ...item, name: editItemText } : item
      ) } : list
    );
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

  const createTop10List = (title, items) => {
    const top10List = {
      id: Date.now().toString(),
      name: title,
      items: items.map((item, index) => ({ id: index.toString(), name: `${index + 1}. ${item}` })),
    };
    setLists([...lists, top10List]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>My Lists</Text>

      {/* Input for new list name */}
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

      {/* Predefined Lists */}
      <TouchableOpacity
        style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 }}
        onPress={() => createTop10List('Top 10 Burgers', [
          'Cheeseburger',
          'Bacon Burger',
          'Mushroom Swiss Burger',
          'BBQ Burger',
          'Guacamole Burger',
          'Double Cheeseburger',
          'Veggie Burger',
          'Turkey Burger',
          'Black Bean Burger',
          'Buffalo Chicken Burger',
        ])}
      >
        <Text style={{ color: 'white' }}>Create Top 10 Burgers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 }}
        onPress={() => createTop10List('Top 10 Pizzas', [
          'Margherita Pizza',
          'Pepperoni Pizza',
          'Hawaiian Pizza',
          'BBQ Chicken Pizza',
          'Vegetarian Pizza',
          'Meat Lovers Pizza',
          'Buffalo Chicken Pizza',
          'Mushroom Pizza',
          'White Pizza',
          'Pesto Pizza',
        ])}
      >
        <Text style={{ color: 'white' }}>Create Top 10 Pizzas</Text>
      </TouchableOpacity>

      {/* Display lists */}
      <FlatList
        style={{ marginTop: 20 }}
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            {/* Display items */}
            <FlatList
              data={item.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EditableListItem
                  item={item}
                  onSave={saveEditItem}
                  onCancel={cancelEditItem}
                  onStartEdit={() => startEditItem(item.id, item.name)}
                  onDelete={() => deleteItem(item.id, item.id)}
                  isEditing={editItemId === item.id}
                  editItemText={editItemText}
                  setEditItemText={setEditItemText}
                />
              )}
            />
            {/* Input for new item */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <TextInput
                style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
                placeholder="Enter new item"
                value={newItemText}
                onChangeText={text => setNewItemText(text)}
              />
              <TouchableOpacity
                style={{ backgroundColor: 'blue', padding: 10, marginLeft: 10, borderRadius: 5 }}
                onPress={() => addItemToList(item.id)}
              >
                <Text style={{ color: 'white' }}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MyListsScreen;
