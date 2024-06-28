import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

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
