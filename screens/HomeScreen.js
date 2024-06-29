// HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <PostsScreen navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
});

export default HomeScreen;
