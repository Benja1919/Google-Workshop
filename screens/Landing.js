import React from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const Landing = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  });

  return (
    <ImageBackground 
      source={require('../assets/landback.png')} // Background image
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.row}>
            {/* Left Column */}
            <View style={styles.column}>
              {/* Section: Share your experience */}
              <View style={styles.textBlock}>
                <Text style={styles.sectionText}>Share Your Food Journey</Text>
                <Text style={styles.smallText}>Post your thoughts on restaurants and dishes. Let others know what’s worth trying</Text>
              </View>

              {/* Image Pic 2 */}
              <View style={styles.imageBlock}>
                <Image 
                  source={require('../assets/pic1.jpg')} // Replace with your image
                  style={styles.image}
                />
              </View>

              {/* Section: Tell your friends */}
              <View style={styles.textBlock}>
                <Text style={styles.sectionText}>Discover New Flavors</Text>
                <Text style={styles.smallText}>Discover the best dishes and hidden gems from foodies around the world!</Text>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.column}>
              {/* Image Pic 1 */}
              <View style={styles.imageBlock}>
                <Image 
                  source={require('../assets/pic2.jpg')} // Replace with your image
                  style={styles.image}
                />
              </View>

              {/* Section: Plan */}
              <View style={styles.textBlock}>
                <Text style={styles.sectionText}>Save and Share!</Text>
                <Text style={styles.smallText}>Save the restaurants you want to visit. Organize your list and share it with friends effortlessly.</Text>
              </View>

              {/* Image Pic 3 */}
              <View style={styles.imageBlock}>
                <Image 
                  source={require('../assets/pic3.jpg')} // Replace with your image
                  style={styles.image}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomBox}>
        <ImageBackground 
          source={require('../assets/buttonBackLeft.png')}
          style={styles.buttonImageBackground}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('SignUp')} // Navigate to Sign Up Screen
          >
            <Text style={styles.ctaText}>Join Now</Text>
          </TouchableOpacity>
        </ImageBackground>
        
        <ImageBackground 
          source={require('../assets/buttonBackRight.png')} // 
          style={styles.buttonImageBackground}
          imageStyle={{ borderRadius: 20 }} 
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')} // Navigate to Login Screen
          >
            <Text style={styles.ctaText}>Sign In</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 CommunEATy. All rights reserved.</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  column: {
    width: "45%",
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 50,
    height: 250,
  },
  imageBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 50,
  },
  image: {
    width: 170,
    height: 150,
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 23,
    color: '#333',
    fontFamily: 'Oswald-Medium',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 19,
    color: '#333',
    fontFamily: 'Oswald-Light',
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
  bottomBox: {
    position: 'center',
    bottom: 0,
    borderRadius: 10,
    width: '100%',
    paddingVertical: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  buttonImageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  ctaButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Oswald-Medium',
  },
});

export default Landing;
