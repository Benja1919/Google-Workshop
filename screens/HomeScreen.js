// HomeScreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PostsScreen from './PostsScreen';

const HomeScreen = ({ navigation }) => {
  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };
  return (
    <View style={styles.container}>
      <PostsScreen navigation={navigation} />
      <TouchableOpacity style={styles.circularButton} onPress={navigateToPostCreation}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f69ff', // Use a less saturated blue color here
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold', // Make the text bold
  },
});

export default HomeScreen;
