import { AuthContext } from './AuthContext';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View,Alert, Text, Image, Button, Dimensions, Touchable, TouchableOpacity, Switch  } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { firestoreDB } from './FirebaseDB';
import MapRestaurantThumbnail from './components/MapRestaurantThumbnail';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BottomBarComponent from './components/BottomBar';

const { width } = Dimensions.get('window');
const SIDEMENU_WIDTH = 200;
images = {
    tri : require("../assets/icons/Tri1.png"),
};
const MapMenu = ({navigation, onHeaderLeftPress}) =>{
    const [location, setLocation] = useState(null);
    const {currentUser } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [ThumbnailOn, setThumbnailVisibilty] = useState(-1);
    const [menuOpen, setMenuOpen] = useState(false);
    const translateX = useSharedValue(-SIDEMENU_WIDTH);

    const menuStyle = useAnimatedStyle(() => {
        return {
        transform: [{ translateX: translateX.value }],
        };
    });
    const toggleMenu = () => {
        setMenuOpen(prevMenuOpen => {
            const newMenuOpen = !prevMenuOpen;
            translateX.value = withTiming(newMenuOpen ? 0 : -SIDEMENU_WIDTH, { duration: 200 });
            return newMenuOpen;
        });
    };
    const closeMenu = () => {
        setMenuOpen(false);
        translateX.value = withTiming(-SIDEMENU_WIDTH, { duration: 1 });
    };
    useEffect(() => {
        onHeaderLeftPress(toggleMenu);
    }, []);
    

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
            navigation.navigate('Restaurant', {restaurantName: restaurants[index].name});
        }
        else{
            setThumbnailVisibilty(index);
        }
        
    };
    const MapPress = () =>{

        closeMenu();
        setThumbnailVisibilty(-1);
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
        const initialRegion = {
            latitude:location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.00521,
        };
        return (
            <View style={{flex:1}}>
            <View style={{flexDirection:'row',flex:1}}>
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation = {true}
                    onPress={MapPress}
                    >
                    {restaurants.map((restaurant, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: restaurant.Coordinates.latitude, longitude: restaurant.Coordinates.longitude }}
                        onPress={() => MarkerPress(index)}
                    >
                        <MapRestaurantThumbnail isEnabled={ThumbnailOn==index} restaurant={restaurant} navigation={navigation} pointerEvents="box-none"/>
                    </Marker>
                    ))}

                </MapView>
                <View >
                    <Animated.View style={[styles.sideMenu, menuStyle]}>
                    <Text style={styles.menuItem}>Item 1</Text>
                    <Text style={styles.menuItem}>Item 2</Text>
                    </Animated.View>
                </View>
                
            </View>
            <View style={{zIndex: 2,}}>
            <BottomBarComponent navigation={navigation} />
            </View>
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
        bottom:30,
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
    sideMenu: {
        position: 'absolute',
        width: SIDEMENU_WIDTH,
        height: '100%',
        backgroundColor: '#ffffff',
        zIndex: 1,
      },
      menuItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      },
});
export default MapMenu;