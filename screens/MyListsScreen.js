import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyListsScreen = ({ route }) => {
  const { userName } = route.params;
  const navigation = useNavigation();

  // Example data
  const wishList = [
    { id: '1', name: 'Restaurant 1' },
    { id: '2', name: 'Restaurant B' },
    { id: '3', name: 'Restaurant C' },
  ];

  const beenToList = [
    { id: '1', name: 'Restaurant X' },
    { id: '2', name: 'Restaurant Y' },
    { id: '3', name: 'Restaurant Z' },
  ];

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => goToRestaurant(item.name)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const goToRestaurant = (restaurantName) => {
    // Navigate to the restaurant screen with the restaurant ID or other necessary params
    navigation.navigate('MockDB', { restaurantName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Lists for {userName}</Text>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Wish List</Text>
        <FlatList
          data={wishList}
          renderItem={renderListItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Been To</Text>
        <FlatList
          data={beenToList}
          renderItem={renderListItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
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
});

export default MyListsScreen;
