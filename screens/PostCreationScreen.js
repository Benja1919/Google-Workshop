import React, { useState, useEffect, useContext,useCallback } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { AuthContext } from './AuthContext';
import { getStorage, ref, getDownloadURLm, uploadBytes,getDownloadURL  } from 'firebase/storage';
import { firestoreDB } from './FirebaseDB';
import { useFonts } from 'expo-font';
import RestaurantFinder from './components/RestaurantFinder'

const GOOGLE_PLACES_API_KEY = 'AIzaSyABWcyPdbh9dDautY3BjaL4FJQY94-at5E'; // Replace with your Google Places API key

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
  })
  if (!fontsLoaded){
    return undefined;
  }
  const {currentUser, isLoggedIn } = useContext(AuthContext);
  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -100) {
      if(isLoggedIn){
        const name = currentUser.userName
        navigation.navigate('UserProfile', { userName: name });
      }
      else{
        navigation.navigate('HomeScreen');
      }
    }
    else if (event.nativeEvent.translationX > 100) {
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
      // בקשת רשות גישה לספריית התמונות
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!result.granted) {
        Alert.alert('Error', 'Permission to access gallery is required');
        return;
      }
  
      // בחירת תמונה או מדיה אחרת
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      // אם המשתמש לא ביטל את הבחירה
      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
  
        // יצירת התייחסות ל-Firebase Storage
        const storageRef = ref(storage, `images/${filename}`);
  
        // הורדת התמונה כ-blob
        const response = await fetch(uri);
        const blob = await response.blob();
  
        // העלאת התמונה ל-Firebase Storage
        await uploadBytes(storageRef, blob);
  
        // קבלת כתובת ה-URL להורדת התמונה
        const downloadURL = await getDownloadURL(storageRef);
  
        // הוספת ה-URI והסוג של המדיה
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
  const ReceiveRestaurantData= ({ id, name }) => {
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
      restaurantName: restaurantName,
      RestaurantID: RestaurantID,
      stars: stars,
      content: content,
      mediaUrls: mediaUris,
      mediaType: mediaType,
      location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
    };

    firestoreDB().AddPost(newPost);
    navigation.navigate('HomeScreen');
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Restaurant</Text>
          <RestaurantFinder textinputstyle={styles.input} placeholder="Enter restaurant name" Complete={ReceiveRestaurantData} CompleteReset={false}/>

          

          <Text style={styles.label}>Rating</Text>
          <StarRating
            rating={stars}
            onChange={setStars}
          />

          <Text style={styles.label}>Content</Text>
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
              <Image source={require('../assets/icons/add_image.png')} style={styles.mediaicon} />
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

          <TouchableOpacity style={RestaurantID== null ? styles.submitButtondisabled : styles.submitButton} onPress={handleSubmit} disabled={RestaurantID== null}>
            <Image source={require('../assets/icons/submit_button.png')} style={styles.mediaicon_submit} />
          </TouchableOpacity>
          <Text style={{fontSize:30}}></Text>
          <View Push style={styles.Pusher}/>
        </ScrollView>
        <BottomBarComponent navigation={navigation}/>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  Pusher:{
    flex: 1,
  },
  label: {
    fontSize: 25,
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Oswald-Medium',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // צבע רקע לפס הרציף
    elevation: -300, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
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
    borderRadius: 70,
    top: -230,
    left: 130,
  },
  mediaicon: {
    width: 65,
    height: 65,
  },
  mediaicon_submit: {
    width: 65,
    height: 65,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Oswald-Medium',

    color: 'white',
    //fontWeight: 'bold',
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
    top: -70,
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    position: 'absolute',
    top: -75,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: 'center', // Centers items vertically
    alignItems: 'center', 
  },
  removeButtonText: {
    color: 'white',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  submitButton: {
    //marginTop: 20, // מוסיף מרווח בין הכפתור לרכיבים מעליו
    right: -300,
    top: -30,
  },
  submitButtondisabled: {
    //marginTop: 20, // מוסיף מרווח בין הכפתור לרכיבים מעליו
    right: -300,
    top: -30,
  },
});

export default PostCreationScreen;
