import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyD6nDtPRXSBhTCkYemwC9fJ4YUxnAqnC1E');
//conversions Address <--> Coordinates(N,W)
export const useCoordToAddress = (latitude, longitude) => {
    const [address, setAddress] = useState('');

    useEffect(() => {
        const getAddress = async (lat, lng) => {
            try {
                if (lat !== null && lng !== null) {
                    const json = await Geocoder.from(lat, lng);
                    const addressComponent = json.results[0].formatted_address;
                    setAddress(addressComponent);
                } else {
                    setAddress(null);
                }
            } catch (error) {
                setAddress(null);
            }
        };

        getAddress(latitude, longitude);
    }, [latitude, longitude]);

    return address;
};

export const useAddressToCoord = (address) => {
    
    const [coordinates, setCoordinates] = useState({"latitude": null, "longitude": null});
    useEffect(() => {
        if (address !== '') {
            const getCoordinates = async (addr) => {
                try {
                    const json = await Geocoder.from(addr);
                    const { lat, lng } = json.results[0].geometry.location;
                    setCoordinates({ latitude: lat, longitude: lng });
                } catch (error) {
                }
            };

            getCoordinates(address);
        }
    }, [address]);
    return coordinates;
};
export const searchNearbyPlaces = (Coords) => {
    const [restaurants, setRestaurants] = useState(null);
    useEffect(() => {
        if(Coords.latitude != null){
            const get = async (Coords) => {
                apiKey = 'AIzaSyD6nDtPRXSBhTCkYemwC9fJ4YUxnAqnC1E';
                const url = 'https://places.googleapis.com/v1/places:searchNearby';
            
                const headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.name,places.photos,places.attributions,places.displayName,places.websiteUri,places.formattedAddress,places.regularOpeningHours,places.types,places.id,places.location,places.priceLevel,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.editorialSummary,places.servesBeer,places.servesBreakfast,places.servesBrunch,places.servesCocktails,places.servesCoffee,places.servesDessert,places.servesDinner,places.servesLunch,places.servesVegetarianFood,places.servesWine,places.takeout'
                };
            
                const requestBody = {
                includedTypes: ["restaurant"],
                maxResultCount: 5,
                locationRestriction: {
                    circle: {
                    center: {
                        latitude: Coords.latitude,
                        longitude: Coords.longitude
                    },
                    radius: 50.0
                    }
                }
                };
            
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(requestBody)
                    });
                
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                
                    const data = await response.json();
                    setRestaurants(data);
                } catch{}
            };
            get(Coords);
        }
    }, [Coords]);
    return restaurants;
};
const BasicMap = ({isEnabled, initialMarkerCoords, mapclickfunction}) =>{
    const initialRegion = {
        latitude: initialMarkerCoords.latitude,
        longitude: initialMarkerCoords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.00521,
    };
    const markerCoordinate = initialMarkerCoords;
    if(isEnabled){
        return (
            <View>
                <Text style={{fontSize:200}}></Text>
                    <MapView
                    onPress={mapclickfunction}
                    style={styles.map}
                    initialRegion={initialRegion}
                    >
                        <Marker
                            coordinate={markerCoordinate}
                            title="Marker Title"
                            description="Marker Description"
                            />

                    </MapView>
                
            </View>
        );
    }
    else{
        return <View/>
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
});
export default BasicMap;