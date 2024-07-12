import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DB from './MockDB';

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Replace with your Google Places API key

const PostCreationScreen = ({ navigation }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [mediaUris, setMediaUris] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen');
  };

  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location is required');
        return;
      }
    })();
  }, []);

  const pickMedia = async (mediaTypes, type) => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert('Error', 'Permission to access gallery is required');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setMediaUris([...mediaUris, pickerResult.assets[0].uri]);
      setMediaType(type);
    } else {
      Alert.alert('Error', 'Media selection was canceled');
    }
  };

  const pickImage = () => pickMedia(ImagePicker.MediaTypeOptions.Images, 'image');
  const pickVideo = () => pickMedia(ImagePicker.MediaTypeOptions.Videos, 'video');
  const pickGif = () => pickMedia(ImagePicker.MediaTypeOptions.Images, 'gif');

  const pickLocation = async () => {
    try {
      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult);

      fetchPlaces(locationResult.coords.latitude, locationResult.coords.longitude);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location');
    }
  };

  const fetchPlaces = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      setPlaces(data.results);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch nearby places');
    }
  };

  const handlePlaceSelect = (place) => {
    setLocation({
      coords: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
    });
    setPlaces([]);
  };

  const handleRemoveMedia = (uri) => {
    setMediaUris(mediaUris.filter(mediaUri => mediaUri !== uri));
  };

  const handleSubmit = () => {
    if (!restaurantName || stars <= 0 || !content || mediaUris.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one image, video, or GIF');
      return;
    }

    const newPost = {
      id: Math.random().toString(),
      userName: 'User123', // Replace with actual username
      restaurantName: restaurantName,
      stars: stars,
      content: content,
      mediaUrls: mediaUris,
      mediaType: mediaType,
      location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
    };

    DB().AddPost(newPost);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Restaurant Name:</Text>
      <TextInput
        style={styles.input}
        value={restaurantName}
        onChangeText={text => setRestaurantName(text)}
        placeholder="Enter restaurant name"
      />

      <Text style={styles.label}>Stars:</Text>
      <StarRating
        rating={stars}
        onChange={setStars}
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={text => setContent(text)}
        placeholder="Enter your review"
        multiline
      />

      {/* Media Picker Bar */}
      <View style={styles.mediaBar}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <Image source={require('../assets/icons/image.png')} style={styles.mediaicon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaButton} onPress={pickVideo}>
          <Image source={require('../assets/icons/video.png')} style={styles.mediaicon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaButton} onPress={pickGif}>
          <Image source={require('../assets/icons/gif.png')} style={styles.mediaicon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaButton} onPress={pickLocation}>
          <Image source={require('../assets/icons/location.png')} style={styles.mediaicon} />
        </TouchableOpacity>
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        
        {/* Button for home */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
        <Image source={require('../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for search */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => console.log('Search button pressed')}>
          <Image source={require('../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button to navigate to post creation */}
        <TouchableOpacity style={styles.bottomBarButton}>
        <Image source={require('../assets/icons/plus.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for profile */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
          <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.mediaContainer}>
        {mediaUris.map((uri, index) => (
          <View key={index} style={styles.mediaPreviewContainer}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveMedia(uri)}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {location && (
        <Text>Location: {location.coords.latitude}, {location.coords.longitude}</Text>
      )}

      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
              <Text style={styles.placeItem}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // צבע רקע לפס הרציף
    elevation: 10, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
  },
  bottomBarButton: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  icon: {
    width: 25,
    height: 25,
  },
  mediaBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  mediaButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mediaicon: {
    width: 40,
    height: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center', // מרכז את הכפתור במרכז האופקי של המסך
    marginTop: 20, // מוסיף מרווח בין הכפתור לרכיבים מעליו
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PostCreationScreen;
