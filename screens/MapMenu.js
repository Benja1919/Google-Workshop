import { AuthContext } from './AuthContext';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View,Alert, Text, Image, Button, Dimensions, Touchable, TouchableOpacity, Switch  } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { firestoreDB } from './FirebaseDB';
import MapRestaurantThumbnail from './components/MapRestaurantThumbnail';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BottomBarComponent from './components/BottomBar';
import {isOpen, GetNow} from './components/OpeningTimeViewer';
import Slider from '@react-native-community/slider';
import AddRestaurantComponent from './components/AddRestaurant';

const { width } = Dimensions.get('window');

const SIDEMENU_WIDTH = 200;
images = {
    tri : require("../assets/icons/Tri1.png"),
};
const MapMenu = ({navigation, onHeaderLeftPress}) =>{
    now = GetNow();
    const [location, setLocation] = useState(null);
    const {currentUser } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [ThumbnailOn, setThumbnailVisibilty] = useState(-1);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpenFilter, SetOpen] = useState(false);
    const [isOpenRestaurantAdder, SetAddRestaurant] = useState(false);
    const translateX = useSharedValue(-SIDEMENU_WIDTH);
    const [MinRating, SetMinRating] = useState(0);
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
            navigation.navigate('Restaurant', {restaurantName: restaurants[index].name, restaurantID:null});
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
    else if(location != null && restaurants.length > 0){
        dayidx = new Date().getDay();
        availableRestaurantsIndeces = [];
        for (let index = 0; index < restaurants.length; index++) {
            const restaurant = restaurants[index];
            if((isOpenFilter || (!isOpenFilter && isOpen({restaurant:restaurant,day:dayidx,time:now}))) && ((restaurant.reviewcount > 0 && (restaurant.starcount / restaurant.reviewcount) >= MinRating) || (restaurant.reviewcount == 0 && MinRating <= 0.1))){
                availableRestaurantsIndeces.push(index);
            }
            
        }
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
                    {availableRestaurantsIndeces.map((restaurantIndex, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: restaurants[restaurantIndex].Coordinates.latitude, longitude: restaurants[restaurantIndex].Coordinates.longitude }}
                        onPress={() => MarkerPress(index)}
                    >
                        <MapRestaurantThumbnail isEnabled={ThumbnailOn==index} restaurant={restaurants[restaurantIndex]} navigation={navigation} pointerEvents="box-none"/>
                    </Marker>
                    ))}

                </MapView>
                <View >
                    <Animated.View style={[styles.sideMenu, menuStyle]}>
                    <View style={{...styles.menuItem,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize:16}}>Closed Restaurants</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isOpenFilter ? "#0056b4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => SetOpen(previousState => !previousState)}
                            value={isOpenFilter}
                            style={{alignSelf: 'flex-end'}}
                        />
                    </View>
                    <View style={{...styles.menuItem}}>
                        <Text style={{fontSize:16}}>Minimum Rating</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Slider
                                style={{ width: 150, height: 40}}
                                minimumValue={0}
                                maximumValue={5}
                                step={0.1}
                                value={0}
                                minimumTrackTintColor="#81b0ff" // Color of the filled track
                                maximumTrackTintColor="#81b0ff" // Color of the unfilled track
                                thumbTintColor="#0056b4" // Color of the thumb
                                onValueChange={value => {SetMinRating(value.toFixed(1))}}
                            />
                            <Text style={{left : -8,fontSize:16}}>{MinRating}✮</Text>
                        </View>
                    </View>
                    </Animated.View>
                </View>
                
            </View>
            <View style={{zIndex: 2,}}>
            <TouchableOpacity style={{position: 'absolute', bottom: 80,right: 10,}} onPress={()=>SetAddRestaurant(true)}>
                <Text style={{fontSize:50}}>+</Text>
            </TouchableOpacity>
            <AddRestaurantComponent isEnabled={isOpenRestaurantAdder} OnClose={() => SetAddRestaurant(false)}/>
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
        padding: 10,
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