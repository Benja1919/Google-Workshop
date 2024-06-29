// Updated RestaurantScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';

const restaurantData = {
  'Restaurant 1': {
    name: 'Restaurant 1',
    description: 'Best restaurant in town!',
    chefDescription: 'Our guest chef this month is preparing unique dishes.',
    happyHour: 'Every day from 5 PM to 7 PM.',
    specialDish: 'Introducing our new special dish: Seafood Pasta!',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tom%27s_Restaurant%2C_NYC.jpg/640px-Tom%27s_Restaurant%2C_NYC.jpg',
  },
  'Restaurant 2': {
    name: 'Restaurant 2',
    description: 'Great place for dessert!',
    chefDescription: 'Join us for our guest chef’s delicious creations.',
    happyHour: 'Weekdays from 4 PM to 6 PM.',
    specialDish: 'Try our new special: Chocolate Lava Cake!',
    profileImageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/18/3a/cb/restaurant-le-47.jpg',
  },
  // Add more restaurant data here...
};

const RestaurantScreen = ({ route, navigation }) => {
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
      <Image source={{ uri: restaurant.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.description}>{restaurant.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeader}>Guest Chef:</Text>
        <Text style={styles.detailsText}>{restaurant.chefDescription}</Text>

        <Text style={styles.detailsHeader}>Happy Hour:</Text>
        <Text style={styles.detailsText}>{restaurant.happyHour}</Text>

        <Text style={styles.detailsHeader}>New Special Dish:</Text>
        <Text style={styles.detailsText}>{restaurant.specialDish}</Text>

      </View>

      {/* Display posts for the specific restaurant */}
      <PostsScreen navigation={navigation} route={{ params: { filterrestaurantName: restaurantName } }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  detailsContainer: { marginTop: 20 },
  detailsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  detailsText: { fontSize: 16, marginBottom: 10 },
});

export default RestaurantScreen;
