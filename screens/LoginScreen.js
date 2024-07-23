import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Pressable } from 'react-native';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { firestoreDB } from './FirebaseDB';
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
      navigation.navigate('MapView');
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
  const handleLogin = async () => {
    if (userName === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    
    const user = await firestoreDB().TryLoginUser(userName, password);
    if (user) {
      login(user);
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
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>
            Don't have an account? Sign in Here!
          </Text>
        </Pressable>
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
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop : "45%",
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

  link: {
    fontSize: 15,
    textAlign: 'center',
    color: 'grey',
    justifyContent: 'center',
    marginTop : 10,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
