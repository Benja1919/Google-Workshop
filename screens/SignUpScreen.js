// SignInScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import { firestoreDB } from './FirebaseDB';
import { Timestamp } from 'firebase/firestore';

const SignUpScreen = () => {
//   const [email, setEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const [password, setPassword] = useState('');
//   const [isREst, setIsRest] = useState(false);
// //   const [friends, setFreinds] = useState([]);
//   const [profileImageUrl, setProfileImageUrl] = useState('');

  const createNewUser = async () => { // Create a new List, store it in the DB
    // if (newListName.trim() === '') {
    //   alert('Please enter a valid list name');
    //   return;
    // }
    const newUser = {
      id: Math.random().toString(),
      userName: username,
      password :password,
      email :email,
      friends: [],
      profileImageUrl: profileImageUrl,
      createTime: Timestamp.now() 

    };

    await firestoreDB().CreateUser(newUser);
    } 

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

  
    const handleSignUp = () => {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return;
      }
      createNewUser();
      Alert.alert('Sign Up Successful', `Username: ${username}\nEmail: ${email}`);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button
          title="Sign Up"
          onPress={handleSignUp}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f7f7f7'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    }
  });
  
  export default SignUpScreen;