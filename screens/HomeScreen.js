import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const posts = [
  {
    id: '1',
    userName: 'User123',
    restaurantName: 'Restaurant 1',
    content: 'Amazing dinner at Restaurant 1',
    stars: 5,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr2AU24_uM5pUXPbwj7HfAElehKipMV1RFAw&s.reshet.tv/image/upload/t_grid-item-large/v1667468127/uploads/2022/903311857.jpg',
    profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
  },
  {
    id: '2',
    userName: 'FoodieJohn',
    restaurantName: 'Restaurant 2',
    content: 'Loved the atmosphere at Restaurant 2',
    stars: 4,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4S3i0Vv04eORM_5HpLDY87XJjBvgevpDzYA&s',
    profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
  },
  {
    id: '3',
    userName: 'FoodieJohn',
    restaurantName: 'Restaurant 2',
    content: 'Loved the atmosphere at Restaurant 2',
    stars: 4,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ80n9Sb3nwyIZy2Xq7j1TLtQwbqbClzTmverAEzmrPkgj8KgnNskiY5iUQ3r_USAM6hHo&usqp=CAU',
    profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
  },
];

const HomeScreen = ({ navigation }) => {
  const navigateToProfile = (userName) => {
    navigation.navigate('UserProfile', { userName });
  };

  const navigateToRestaurant = (restaurantName) => {
    navigation.navigate('Restaurant', { restaurantName });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userContainer} onPress={() => navigateToProfile(item.userName)}>
          <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{item.userName}</Text>
        </TouchableOpacity>
        <Text style={styles.stars}>{'⭐'.repeat(item.stars)}</Text>
      </View>
      <TouchableOpacity onPress={() => navigateToRestaurant(item.restaurantName)}>
        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
      </TouchableOpacity>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  restaurantName: {
    fontSize: 16,
    color: '#1e90ff',
    marginBottom: 5,
  },
  stars: {
    fontSize: 16,
    color: '#ffd700',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
