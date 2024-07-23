import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View,Alert, Text, Image,TouchableOpacity } from 'react-native';
import ImprovedImageComponent from './ImprovedImage';
images = {
    tri : require("../../assets/icons/Tri1.png"),
};
const MapRestaurantThumbnail = ({isEnabled,restaurant,navigation})=>{
    if(!isEnabled){
        return (
            <View style={styles.markerparent}>
                <View style={styles.marker}>
                    <Text style={styles.markerText}>{`${restaurant.name} (${restaurant.starcount/restaurant.reviewcount} 🌟)`}</Text>
                </View>
                <Image style={styles.blackDot} source={images.tri}/>
            </View>
        );
    }
    else{
        return (
            <View style={styles.markerparent}>
                <View style={styles.marker}>
                    <Text style={styles.markerText}>{`${restaurant.name} (${restaurant.starcount/restaurant.reviewcount} 🌟)`}</Text>
                    <ImprovedImageComponent ImageURI={restaurant.ProfileImageURI} ImageStyle={styles.profileImage}/>
                    <Text style={styles.markerText}>{`${restaurant.description}`}</Text>
                </View>
                <Image style={styles.blackDot} source={images.tri}/>
            </View>
        );
    }
};
const styles = StyleSheet.create({
    marker: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
});
export default MapRestaurantThumbnail;