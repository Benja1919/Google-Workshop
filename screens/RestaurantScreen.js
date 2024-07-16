// Updated RestaurantScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';
import { firestoreDB } from './FirebaseDB';
import { FlatList } from 'react-native-gesture-handler';

const RestaurantScreen = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { restaurantName } = route.params;
  useEffect(() => {
    const fetchRestaurant = async () => {
      setRestaurant(await firestoreDB().GetRestaurant(restaurantName));
      setLoading(false);
    };

    fetchRestaurant();
  }, [restaurantName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>LOADING</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Restaurant not found</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.detailsHeader}>{restaurant.ContentTitles[item]}</Text>
      <Text style={styles.detailsText}>{restaurant.ContentData[item]}</Text>
    </View>
  );

  let arr = [];
  for (let i = 0; i < restaurant.ContentData.length; i++) {
      arr.push(i);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Image source={{ uri: restaurant.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.description}>{restaurant.description}</Text>

      <View style={styles.detailsContainer}>
        <FlatList
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.detailsHeader}>Average Rating:</Text>
        <Text style={styles.detailsText}>{restaurant.reviewcount > 0 ? restaurant.starcount / restaurant.reviewcount : "No Reviews"} {restaurant.reviewcount > 0 ? `(${restaurant.reviewcount})` : ''}</Text>

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
