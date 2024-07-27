import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const Landing = () => {
  const navigation = useNavigation();
  // const [fontsLoaded] = useFonts({
  //   "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf")
  // })

  return (
    <ImageBackground 
      source={require('../assets/symbol.png')}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome.</Text>
          <Text style={styles.subtitle}>Discover the best food around you</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.ctaText}>Login</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.features}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.feature}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.featureImage} />
            <Text style={styles.featureText}>Explore Restaurants</Text>
          </View>
          <View style={styles.feature}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.featureImage} />
            <Text style={styles.featureText}>Create and Share Lists</Text>
          </View>
          <View style={styles.feature}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.featureImage} />
            <Text style={styles.featureText}>Follow Your Friends</Text>
          </View>
        </View> */}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 CommunEATy. All rights reserved.</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 50,
    color: 'white',
    // fontWeight: 'bold',
    marginVertical: 10,
    top: 20,
    fontFamily: 'Oswald-Medium',

  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Oswald-Medium',
    // marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  ctaButton: {
    // backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  loginButton: {
    // backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Oswald-Medium',

  },
  footer: {
    padding: 20,
    alignItems: 'center',
    
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Oswald-Medium',

  },
});

export default Landing;
