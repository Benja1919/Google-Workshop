import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import DB from './MockDB'; // Import the mock database
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
/**
 * LoginScreen component that allows users to log in by entering their username and password.
 *
 * @param {Object} navigation - The navigation prop used for navigating between screens.
 */
const LoginScreen = ({ navigation }) => {
  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -50) {
      navigation.navigate('HomeScreen');
    }
    else if (event.nativeEvent.translationX > 50) {
      navigation.navigate('Search');
    }
  };
  // State variables to store user input for username and password
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  // Get the login function from AuthContext
  const { login } = useContext(AuthContext);

  /**
   * Handles the login button press event.
   * Checks if the input fields are filled, validates the user, and logs them in if valid.
   */
  const handleLogin = () => {
    if (userName === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    
    const user = DB().GetUserName(userName, password);
    if (user) {
      login(user);
      Alert.alert('Success', `Logged in as: ${user.userName}`);
      navigation.navigate('ProfileScreen');
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
          keyboardType="default"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} />
        <View pusher style={styles.pusher}/>
        <BottomBarComponent navigation={navigation}/>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  pusher:{
    flex:1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default LoginScreen;
