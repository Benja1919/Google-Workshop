// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';

const posts = [
  {
    id: '1',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6zPr-CuuHQBPmKg7yn66hCFdA3wmS58Og9g&s',
    text: 'Amazing dinner at Restaurant 1!',
  },
  {
    id: '2',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtfVeXniJ_NY4ZLvnAHlDgqI2RzNAJUK2sw&s',
    text: 'Loved the dessert at Restaurant 2!',
  },
  {
    id: '3',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
    text: 'Akash Jog 7',
  },
  {
    id: '4',
    imageUrl: 'https://engineering.tau.ac.il/sites/engineering.tau.ac.il/files/styles/research_teaser_image_180_x_180/public/guyaven.png?itok=9wiARZp1',
    text: 'Akash Jog 7',
  },
  
  // הוסף פוסטים נוספים לפי הצורך
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Foodies Social App</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text>{item.text}</Text>
            <Button
              title="Go to Profile"
              onPress={() => navigation.navigate('UserProfile')}
            />
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('UserProfile')}
      />
      <Button
        title="Go to Restaurant"
        onPress={() => navigation.navigate('Restaurant')}
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
