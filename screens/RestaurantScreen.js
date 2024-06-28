import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const restaurantData = {
  'Restaurant 1': {
    name: 'Restaurant 1',
    description: 'Best restaurant in town!',
    address: '123 Main St.',
    phone: '123-456-7890',
  },
  'Restaurant 2': {
    name: 'Restaurant 2',
    description: 'Great place for dessert!',
    address: '456 Elm St.',
    phone: '098-765-4321',
  },
};

const RestaurantScreen = ({ route }) => {
  const { restaurantName } = route.params;
  const restaurant = restaurantData[restaurantName];

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
      <Text style={styles.address}>Address: {restaurant.address}</Text>
      <Text style={styles.phone}>Phone: {restaurant.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 18, marginBottom: 10 },
  address: { fontSize: 16, marginBottom: 5 },
  phone: { fontSize: 16 },
});

export default RestaurantScreen;
