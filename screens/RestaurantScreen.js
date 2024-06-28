import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const RestaurantScreen = ({ restaurant }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      
      <Text style={styles.sectionTitle}>User Reviews</Text>
      <FlatList
        data={restaurant.userReviews}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={item => item.id}
      />
      
      <Text style={styles.sectionTitle}>Restaurant Events</Text>
      <FlatList
        data={restaurant.events}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  restaurantImage: { width: '100%', height: 200 },
  restaurantName: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 }
});

export default RestaurantScreen;
