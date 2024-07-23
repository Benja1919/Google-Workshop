import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestoreDB } from './FirebaseDB'; // Adjust your imports based on your file structure
import { Timestamp } from 'firebase/firestore';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isRestaurant, setisRestaurant] = useState(false); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const pickMedia = async (mediaTypes, type) => {
    try {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!result.granted) {
        Alert.alert('Error', 'Permission to access gallery is required');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);

        const storageRef = ref(getStorage(), `images/${filename}`);

        const response = await fetch(uri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        setProfileImageUrl(downloadURL);
      } else {
        Alert.alert('Error', 'Media selection was canceled');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const pickProfileImage = () => pickMedia(ImagePicker.MediaTypeOptions.Images, 'image');

  const createNewUser = async () => {
    const newUser = {
      id: Math.random().toString(),
      userName: username,
      password: password,
      email: email,
      friends: [],
      profileImageUrl: profileImageUrl,
      isRest: isRestaurant,
      createTime: Timestamp.now(),
    };

    await firestoreDB().CreateUser(newUser);
  };

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword || !profileImageUrl) {
      Alert.alert('Error', 'All fields must be filled!');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address!');
      return;
    }

    const usernameExists = await firestoreDB().checkUsernameExists(username);
    if (usernameExists) {
      Alert.alert('Error', 'Username already exists! Please choose a different username.');
      return;
    }

    const emailExists = await firestoreDB().checkEmailExists(email);
    if (emailExists) {
      Alert.alert('Error', 'Email address already exists! Please choose a different email.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    await createNewUser();
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
      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
          size={25}
          fillColor="#0B99E8"
          unfillColor="#FFFFFF"
          text="This is a Restaurant profile"
          innerIconStyle={{ borderWidth: 2 }}
          textStyle={{ textDecorationLine: "none" }}
          onPress={(isChecked) => setisRestaurant(isChecked)}
        />
      </View>
      <TouchableOpacity onPress={pickProfileImage} style={styles.imagePicker}>
        {profileImageUrl ? (
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Pick a Profile Image</Text>
        )}
      </TouchableOpacity>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
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
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    textAlign: 'center',
    color: 'gray',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 15,
  },
});

export default SignUpScreen;
