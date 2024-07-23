import { AuthContext } from './AuthContext';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View,Alert, Text, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { firestoreDB } from './FirebaseDB';
import MapRestaurantThumbnail from './components/MapRestaurantThumbnail';
images = {
    tri : require("../assets/icons/Tri1.png"),
};
const MapMenu = ({navigation}) =>{
    const [location, setLocation] = useState(null);
    const {currentUser } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [ThumbnailOn, setThumbnailVisibilty] = useState(-1);
    useEffect(() => {
        const fetchData = async () => {
          const restaurantsData = await firestoreDB().FetchRestaurants();
          if (restaurantsData) {
            setRestaurants(restaurantsData);
          }
        };
    
        if (restaurants.length === 0) {
          fetchData();
        }
      }, [restaurants.length]);
    useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        //Alert.alert('Error', 'Permission to access location is required');
        return;
        }
        })();
    }, []);
    const MarkerPress=(index)=>{
        if(ThumbnailOn == index){
            setThumbnailVisibilty(-1);
            navigation.navigate('Restaurant', {restaurantName: restaurants[index].name});
        }
        else{
            setThumbnailVisibilty(index);
        }
        
    };
    const pickLocation = async () => {
        try {
            let locationResult = await Location.getCurrentPositionAsync({});
            setLocation(locationResult);
        
            fetchPlaces(locationResult.coords.latitude, locationResult.coords.longitude);
        } catch (error) {
          //Alert.alert('Error', 'Unable to fetch location');
        }
    };
    if(location == null || restaurants.length == 0){
        pickLocation();
        return (
            <View/>
        );
    }
    else if(location != null){
        markerCoords = [];
        for (let index = 0; index < restaurants.length; index++) {
            markerCoords.push(restaurants[index].Coordinates);
        }
        const initialRegion = {
            latitude:location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.00521,
        };
        return (
            <View>
                <Text style={{fontSize:500}}></Text>
                    <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation = {true}
                    >
                    {markerCoords.map((coordinate, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
                        onPress={() => MarkerPress(index)}
                    >
                        <MapRestaurantThumbnail isEnabled={ThumbnailOn==index} restaurant={restaurants[index]} navigation={navigation} pointerEvents="box-none"/>
                    </Marker>
                    ))}

                    </MapView>
                
            </View>
        );
    }
    
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex:1,
        borderRadius: 20,
    },
    marker: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
    },
    markerparent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
        blackDot: {
        width: 15,
        height: 8,
        transform: [{ rotate: '180deg' }],
        tintColor: 'black'
        
    },
        markerText: {
        fontSize: 14,
        color: 'black',
    },
});
export default MapMenu;