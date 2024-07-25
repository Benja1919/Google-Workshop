import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Modal, Button,TouchableWithoutFeedback, TextInput, FlatList  } from 'react-native';
import {useAddressToCoord, useCoordToAddress,searchNearbyPlaces} from './Maps';


const AddRestaurantComponent = ({isEnabled,OnClose}) =>{
    
    const [modalVisible, setModalVisible] = useState(isEnabled);
    const [Coords, setCoords] = useState({"latitude": null, "longitude": null});
    const [Address, setAddress] = useState('');
    const [BaseAddress, setBaseAddress] = useState('');
    const [Restaurants, setRestaurantsArray] = useState(null);
    const [RestaurantNameArray, setRestaurantNameArray] = useState([]);
    const [isEmpty, setEmpty] = useState(false);

    const ZeroExtend = (num) =>{
        if(num < 10){
            return `0${num}`;
        }
        else{
            return num;
        }
    };
    const ParseGoogleOpeningTime = (got) =>{
        oh = []
        for (let index = 0; index < 7; index++) {
            oh.push('-');
            
        }
        for (let index = 0; index < got.length; index++) {
            let day = got[index];
            let OpenHour = day.open.hour;
            let OpenMin = day.open.minute;
            let CloseHour = day.close.hour;
            let CloseMin = day.close.minute;
            if(day.close.day != day.open.day){
                CloseHour += 24
            }
            OpenHour = ZeroExtend(OpenHour);
            OpenMin = ZeroExtend(OpenMin);
            CloseHour = ZeroExtend(CloseHour);
            CloseMin = ZeroExtend(CloseMin);
            oh[day.open.day] = `${OpenHour}:${OpenMin}-${CloseHour}:${CloseMin}`;

        }
        console.log(oh);
        return oh;
    };
    const ScalpRestaurant = (restaurant_idx) =>{
        data = Restaurants[restaurant_idx];
        Restaurant = {
            name : data.displayName.text,
            Address : data.formattedAddress,
            GoogleMapsID : data.id,
            GoogleMapsRating : data.rating,
            Coordinates: data.location,
            Phone : data.nationalPhoneNumber,
            Website : data.websiteUri,
            OpeningHours: ParseGoogleOpeningTime(data.regularOpeningHours.periods),
        };
        //console.log(data.photos);
    };



    useEffect(() => {
        setModalVisible(isEnabled);
    }, [isEnabled]);
    const Disable = () =>{
        if(OnClose){
            OnClose();
        }
        setCoords({"latitude": null, "longitude": null});
        setAddress('');
        setBaseAddress('');
        setRestaurantsArray(null);
        setRestaurantNameArray([]);
        setModalVisible(false);
    };
    let CoordBase = useAddressToCoord(BaseAddress);
    useEffect(()=>{
        setCoords(CoordBase);
    },[CoordBase]);
    let newAddress = useCoordToAddress(Coords);
    useEffect(()=>{
        setAddress(newAddress);
    },[newAddress]);
    let places = searchNearbyPlaces(Coords);
    useEffect(()=>{
        if(places != null && Coords.longitude != null){
            if(Object.keys(places).length === 0 && places.constructor === Object){
                setEmpty(true);
            }
            else{
                arr = []
                for (let index = 0; index < places.places.length; index++) {
                    const element = places.places[index].displayName.text;
                    arr.push(element);
                    
                }
                setRestaurantNameArray(arr);
                setRestaurantsArray(places.places);
                setEmpty(false);
            }
        }
    },[places]);
    



    const handleEndEditing = (event) =>{
        setBaseAddress(event.nativeEvent.text);
        
    };
    return(
        <View style={styles.container}>
            <Modal

                transparent={true}
                visible={modalVisible}
                onRequestClose={() => Disable()}
            >
                <TouchableWithoutFeedback onPress={() => Disable()}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.popup}>
                                <Text style={styles.text}>Add Restaurant</Text>
                                <TextInput placeholder={(Address == '' || Address == null) ? 'enter address' : Address } onEndEditing={handleEndEditing}></TextInput>
                                {isEmpty && <Text>No Restaurants in address</Text>}
                                <FlatList
                                    data={RestaurantNameArray}
                                    renderItem={({item,index})=>{
                                        return (
                                            <TouchableOpacity style={{padding:5,marginLeft:5}} onPress={()=>ScalpRestaurant(index)}>
                                                <Text style={{fontSize: 16}}>{item}</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    keyExtractor={(tag, index) => index.toString()}
                                    scrollEnabled={false} // Disable FlatList's own scrolling
                                    contentContainerStyle={styles.flatList}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

};
export default AddRestaurantComponent;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      popup: {
        width: 300,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      text: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
      },
});