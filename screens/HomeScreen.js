import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

// רשימה של פוסטים לדוגמה
const posts = [
  {
    id: '1',
    imageUrl: 'https://example.com/restaurant1.jpg',
    text: 'Amazing dinner at Restaurant 1!',
  },
  {
    id: '2',
    imageUrl: 'https://example.com/restaurant2.jpg',
    text: 'Loved the dessert at Restaurant 2!',
  },
  // הוסף פוסטים נוספים לפי הצורך
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Foodies Social App</Text>
      <FlatList
        data={posts} // array of post objects
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  post: { marginBottom: 15 },
  image: { width: '100%', height: 200 }
});

export default HomeScreen;
