import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { AuthContext } from './AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestoreDB } from './FirebaseDB';
import { useFonts } from 'expo-font';
import RestaurantFinder from './components/RestaurantFinder';

const PostCreationScreen = ({ navigation }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [mediaUris, setMediaUris] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [RestaurantID, setRestaurantID] = useState(null);
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  });

  const [isRateModalVisible, setRateModalVisible] = useState(false);

  if (!fontsLoaded) return undefined;

  const { currentUser, isLoggedIn } = useContext(AuthContext);

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -100) {
      if (isLoggedIn) {
        const name = currentUser.userName;
        navigation.navigate('UserProfile', { userName: name });
      } else {
        navigation.navigate('HomeScreen');
      }
    } else if (event.nativeEvent.translationX > 100) {
      navigation.navigate('HomeScreen');
    }
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
        const storageRef = ref(storage, `images/${filename}`);
        const response = await fetch(uri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setMediaUris([...mediaUris, downloadURL]);
        setMediaType(type);
      } else {
        Alert.alert('Error', 'Media selection was canceled');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const storage = getStorage();

  const pickImage = () => pickMedia(ImagePicker.MediaTypeOptions.Images, 'image');
  const pickVideo = () => pickMedia(ImagePicker.MediaTypeOptions.Videos, 'video');

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

  const ReceiveRestaurantData = ({ id, name }) => {
    setRestaurantName(name);
    setRestaurantID(id);
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

  const handleSubmit = async () => {
    if (!restaurantName || stars <= 0 || !content || mediaUris.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one image, video, or GIF');
      return;
    }

    const newPost = {
      id: Math.random().toString(),
      userName: currentUser.userName,
      userprofile: currentUser.profilename,
      restaurantName,
      RestaurantID,
      stars,
      content,
      mediaUrls: mediaUris,
      mediaType,
      location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
    };

    firestoreDB().AddPost(newPost);
    navigation.navigate('HomeScreen');
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileRow}>
        <Image source={{ uri: currentUser.profileImageUrl }} style={styles.mediaiconuser} />
          <Text style={styles.label}>   Where did you eat?</Text>
          </View>
          <RestaurantFinder textinputstyle={styles.input} placeholder="Enter restaurant name" Complete={ReceiveRestaurantData} CompleteReset={false} />
          <View style={styles.reviewRow}>
          <Text style={styles.label}>How was it?     </Text>
          <StarRating
            rating={stars}
            onChange={setStars}
            style = {styles.star}
          />
          </View>
          <TextInput
            style={[styles.input, { height: 125 }]}
            value={content}
            onChangeText={text => setContent(text)}
            placeholder="Enter your review"
            multiline
            
          />

  
  
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
        </ScrollView>
  
        <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={pickImage}>
          <Image source={require('../assets/icons/add_image.png')} style={styles.mediaicon} />
            <Text style={styles.buttonText}>Upload Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton} onPress={() => setRateModalVisible(true)}>
          <Image source={require('../assets/icons/star_rating.png')} style={styles.mediaicon} />
            <Text style={styles.buttonText}>Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton} onPress={handleSubmit}>
              <Image source={require('../assets/icons/submit_button.png')} style={styles.mediaicon} />
              <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>

        </View>

        {/* Modal for selecting stars */}
        <Modal
          transparent={true}
          visible={isRateModalVisible}
          onRequestClose={() => setRateModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <StarRating
                rating={stars}
                onChange={setStars}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setRateModalVisible(false)}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  star: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'Oswald-Medium',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    fontFamily: 'Oswald-Light',
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mediaPreviewContainer: {
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  previewImage: {
    width: 150,
    height: 150,
  },
  mediaicon: {
    width: 40,
    height: 40,
  },
  mediaiconuser: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    padding: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  bottomBarButton: {
    flex: 1,
    margin: 2,
    padding: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Oswald-Light',
    backgroundColor: 'white',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default PostCreationScreen;
