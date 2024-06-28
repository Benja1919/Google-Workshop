// screens/UserProfileScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UserProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 }
});

export default UserProfileScreen;
