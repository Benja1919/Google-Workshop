import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
apiKey = 'AIzaSyD6nDtPRXSBhTCkYemwC9fJ4YUxnAqnC1E';
Geocoder.init(apiKey);
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
export const getPhotoUri = async (photoReference) => {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${photoReference}&key=${apiKey}`;
    return url;
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
export const GetPlaceDetails = (restaurant) => {
    const [Details, setDetails] = useState(null);
    useEffect(() => {
        if(restaurant != null ){
            const place_id = restaurant.GoogleMapsID;
            const get = async (place_id) => {
                
                const url = `https://places.googleapis.com/v1/places/${place_id}?fields=id,displayName,servesBeer,servesBreakfast,servesBrunch,location,servesCocktails,servesCoffee,servesDessert,servesDinner,servesLunch,servesVegetarianFood,servesWine,takeout,allowsDogs,delivery,dineIn,reservable,delivery,types,nationalPhoneNumber,regularOpeningHours,websiteUri,formattedAddress,photos,rating,userRatingCount&key=${apiKey}`;
                const headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'id,displayName,formattedAddress,photos,rating,userRatingCount'
                };
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                    });
                
                    if (!response.ok) {
                        console.log(`HTTP error! Status: ${response.status}`);
                    }
                
                    const data = await response.json();
                    setDetails(data);
                   
                } catch{}
            };
            get(place_id);
        }
    }, [restaurant == null]);
    return Details;
};
export const GetPlaces = (restaurant) => {
    const [Details, setDetails] = useState(null);

    useEffect(() => {
        if (restaurant !== null && restaurant !== '') {
            const textQuery = restaurant; // Use the appropriate field for the text query
            const getPlaceDetails = async (textQuery) => {
                const url = `https://places.googleapis.com/v1/places:searchText`;
                const headers = {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents'
                };
                const body = JSON.stringify({
                    textQuery: textQuery,
                    includedType: 'restaurant'
                });

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: body
                    });

                    if (!response.ok) {
                        console.log(`HTTP error! Status: ${response.status}`);
                        return;
                    }

                    const data = await response.json();
                    setDetails(data.places);
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };

            getPlaceDetails(textQuery);
        }
        else{
            
            setDetails(null);
        }
    }, [restaurant]);
    if(restaurant == null){
        return null;
    }
    return Details;
};
export const GetPlacesAsync = async (restaurant) => {
    if (restaurant === null || restaurant === '') {
        return null;
    }

    const textQuery = restaurant;
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents'
    };
    const body = JSON.stringify({
        textQuery: textQuery,
        includedType: 'restaurant'
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.places;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
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