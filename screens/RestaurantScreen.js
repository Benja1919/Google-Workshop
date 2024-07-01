// Updated RestaurantScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';
import DB from './MockDB';

const RestaurantScreen = ({ route, navigation }) => {
  const { restaurantName } = route.params;
  const restaurant = DB().GetRestaurant(restaurantName);

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

        <Text style={styles.detailsHeader}>Avarage Rating:</Text>
        <Text style={styles.detailsText}>{restaurant.starcount / restaurant.reviewcount} ({restaurant.reviewcount})</Text>

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
