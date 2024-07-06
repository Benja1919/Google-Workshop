import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReviewsScreen = ({ route }) => {
  const { userName } = route.params;
  return (
    <View style={styles.container}>
      <Text>Reviews by {userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReviewsScreen;
