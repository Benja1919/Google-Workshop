import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const UserProfileScreen = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
      <Text style={styles.userName}>{user.name}</Text>
      
      <Text style={styles.sectionTitle}>Visited Restaurants</Text>
      <FlatList
        data={user.visitedRestaurants}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />
      
      <Text style={styles.sectionTitle}>Wishlist</Text>
      <FlatList
        data={user.wishlist}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />
      
      <Text style={styles.sectionTitle}>User Feed</Text>
      <FlatList
        data={user.posts}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 }
});

export default UserProfileScreen;
