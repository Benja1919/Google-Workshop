import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { GetPlaces } from './Maps';
import * as Location from 'expo-location';
import { firestoreDB } from '../FirebaseDB';
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
  
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;
  
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

const RestaurantFinder = ({textinputstyle,placeholder, Complete, CompleteReset, returnCity}) =>{
    const [SearchName, setSearch] = useState(null);
    const [location, setLocation] = useState(null);
    const [places, setPlaces] = useState(null);
    const [placeidx, setplaceidx] = useState(null);

    const [restaurantId, setRestaurantId] = useState(null);
    const [Query, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocation('');
            return;
            }
            })();
    }, []);
    const pickLocation = async () => {
        try {
            let locationResult = await Location.getCurrentPositionAsync({});
            setLocation(locationResult);
        } catch (error) {
            setLocation('');
        }
    };
    const unsorted = GetPlaces(SearchName);
    useEffect(() => {
        if(placeidx != null && places != null && Query){
            const fetchData = async () => {
                const id = await firestoreDB().FetchRestaurantByGID(places[placeidx].id);
                setRestaurantId(id);
                setLoading(false);
            };
        
            fetchData();
        }
    }, [placeidx]);
    
    useEffect(() => {
        if(restaurantId == '' && placeidx != null){
            const Restaurant ={
                name: places[placeidx].displayName.text,
                GoogleMapsID: places[placeidx].id,
                Coordinates:places[placeidx].location,
                reviewcount:0,
                starcount:0,
            }
            const fetchData = async () => {
                const id = await firestoreDB().AddRestaurant(Restaurant);
                setRestaurantId(id);
            };
        
            fetchData();
        }
    }, [restaurantId]);
    const GetCity = (place) =>{
        const cityComponent = place.addressComponents.find(component =>
            component.types.includes('locality')
        );
        if(cityComponent != undefined){
            return cityComponent.longText;
        }
        const sublocality =  place.addressComponents.find(component =>
            component.types.includes('sublocality_level_1')
        );
        if(sublocality != undefined){
            return sublocality.longText;
        }
        return null;
    };
    useEffect(() => {
        if(restaurantId != null && restaurantId != ''){
            const fetchData = async () => {
                if(returnCity){
                    const city = GetCity(places[placeidx]);
                    Complete({name: `${places[placeidx].displayName.text}${city != null?`(${city})` : ''}`,id:restaurantId});
                }
                else{
                    Complete({name: places[placeidx].displayName.text,id:restaurantId});
                }
            };
            fetchData();
            if(CompleteReset){
                setSearch(null);
                setLocation(null);
                setPlaces(null);
                setplaceidx(null);
                setRestaurantId(null);
                setLoading(true);
            }
        }
        else{
            Complete({name: null,id:null});
        }
    }, [restaurantId]);
    if(unsorted != null){
        setplaceidx(null);
        setLoading(true);
        setRestaurantId(null);
        if(location != null){
        const referenceLocation = location.coords;
        const sortedLocations = unsorted.sort((a, b) => {
            const distanceA = haversineDistance(referenceLocation, a.location);
            const distanceB = haversineDistance(referenceLocation, b.location);
            return distanceA - distanceB;
        });
        setPlaces(sortedLocations);
        }
        else{
            setPlaces(unsorted);
        }
        setSearch(null);
    }
    if(location == null){
        pickLocation();
        return (
            <View/>
        );
    }
    const EndEdit = (event) =>{
        setSearch(event.nativeEvent.text);
    };
    if(places == null){
        return(
            <TextInput
            style={{...textinputstyle}}
            placeholder={placeholder}
            onEndEditing={EndEdit}
            />
        );
    }
    else if(placeidx != null){
        const city = GetCity(places[placeidx]);
        return(
            <TextInput
            style={{...textinputstyle}}
            placeholder={`${places[placeidx].displayName.text}${city != null?`(${city})` : ''}`}
            onEndEditing={EndEdit}
            />
        );
    }
    else{
        return(
            <View>
                <TextInput
                    style={{...textinputstyle}}
                    placeholder={placeholder}
                    onEndEditing={EndEdit}
                />
                <FlatList
                    data={places}
                    renderItem={({item,index})=>{
                        return (
                            <TouchableOpacity style={{padding:5,marginLeft:5}} onPress={()=>setplaceidx(index)}>
                                <Text style={{fontSize: 16,fontFamily: 'Oswald-Light',}}>{item.displayName.text} ({item.formattedAddress})</Text>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(tag, index) => index.toString()}
                    scrollEnabled={false} // Disable FlatList's own scrolling
                />
            </View>
        );
    }
};
export default RestaurantFinder;
