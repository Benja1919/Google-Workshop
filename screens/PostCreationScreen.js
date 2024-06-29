import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PostCreationScreen = ({ navigation, route }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const newPost = {
      id: Math.random().toString(),
      userName: 'User123', // כדאי להחליף עם שם משתמש אמיתי
      restaurantName: restaurantName,
      stars: stars,
      content: content,
    };

    // בדוק אם פונקציית onCreatePost קיימת לפני שמפעילים אותה
    if (route.params?.onCreatePost) {
      route.params.onCreatePost(newPost);
    }
    navigation.goBack(); // חזרה למסך הקודם אחרי הצלחת יצירת הפוסט
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Restaurant Name:</Text>
      <TextInput
        style={styles.input}
        value={restaurantName}
        onChangeText={text => setRestaurantName(text)}
        placeholder="Enter restaurant name"
      />

      <Text style={styles.label}>Stars:</Text>
      <TextInput
        style={styles.input}
        value={stars.toString()}
        onChangeText={text => setStars(Number(text))}
        placeholder="Enter stars (1-5)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={text => setContent(text)}
        placeholder="Enter your review"
        multiline
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});

export default PostCreationScreen;
