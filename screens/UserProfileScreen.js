import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PostsScreen from './PostsScreen';

const usersData = {
  'User123': {
    profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
    bio: 'Food lover. Always exploring new restaurants!',
    visitedRestaurants: ['Restaurant 1', 'Restaurant 3'],
    wishlistRestaurants: ['Restaurant 2', 'Restaurant 4'],
  },
  'FoodieJohn': {
    profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
    bio: 'Dessert fanatic and food critic.',
    visitedRestaurants: ['Restaurant 2'],
    wishlistRestaurants: ['Restaurant 1', 'Restaurant 3'],
  },
  // Add more users data here...
};

const UserProfileScreen = ({ route, navigation }) => {
  const { userName } = route.params;
  const user = usersData[userName];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>User not found</Text>
      </View>
    );
  }

  const navigateToRestaurant = (restaurantName) => {
    navigation.navigate('Restaurant', { restaurantName });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.header}>{userName}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      <Text style={styles.subHeader}>Visited Restaurants:</Text>
      <FlatList
        data={user.visitedRestaurants}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToRestaurant(item)}>
            <Text style={styles.restaurant}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <Text style={styles.subHeader}>Wishlist Restaurants:</Text>
      <FlatList
        data={user.wishlistRestaurants}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToRestaurant(item)}>
            <Text style={styles.restaurant}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <PostsScreen navigation={navigation} route={{ params: { filterUserName: userName } }} />
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
  bio: { fontSize: 16, marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  restaurant: {
    fontSize: 16,
    marginBottom: 3,
    color: 'blue',
    textDecorationLine: 'underline'
  },
});

export default UserProfileScreen;
