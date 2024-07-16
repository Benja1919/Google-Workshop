// PostsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostsScreen = ({ route }) => {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts by {userName}</Text>
      {/* Add your posts list or content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PostsScreen;
