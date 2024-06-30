import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DB from './MockDB';

const PostCreationScreen = ({ navigation }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert('Error', 'Permission to access gallery is required');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Picker Result:', pickerResult);

    if (!pickerResult.canceled) {
      console.log('Image URI:', pickerResult.assets[0].uri);
      setImageUri(pickerResult.assets[0].uri);
    } else {
      Alert.alert('Error', 'Image selection was canceled');
    }
  };

  const handleSubmit = () => {
    console.log('Restaurant Name:', restaurantName);
    console.log('Stars:', stars);
    console.log('Content:', content);
    console.log('Image URI:', imageUri);

    if (!restaurantName || stars <= 0 || !content || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    const newPost = {
      id: Math.random().toString(),
      userName: 'User123', // כדאי להחליף עם שם משתמש אמיתי
      restaurantName: restaurantName,
      stars: stars,
      content: content,
      imageUrl: imageUri,
    };

    DB().AddPost(newPost);
    navigation.goBack();
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

      <Button title="Pick an image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
        />
      )}

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
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default PostCreationScreen;
