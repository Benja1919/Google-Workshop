import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList, TextInput } from 'react-native';
import { firestoreDB } from '../FirebaseDB';
import { AuthContext } from '../AuthContext';
import { throttle } from 'lodash';
//let ContentTitles = [];
//let ContentData = [];
let CurrentRestaurantUser;
let CurrentRestaurant = '';
const setKey = (item,text) =>{
    CurrentRestaurant.ContentTitles[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}
const setValue = (item,text) =>{
    CurrentRestaurant.ContentData[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}
//
//
const renderItem = ({ item }) => (
    <View style={styles.item}>
        <TouchableOpacity>
            <Text style={styles.content}>Title </Text>
            <TextInput style={styles.input} placeholder={CurrentRestaurant.ContentTitles[item]} onChangeText={text => setKey(item,text)}/>
            <Text style={styles.content}>Information </Text>
            <TextInput style={styles.input} placeholder={CurrentRestaurant.ContentData[item]} onChangeText={text => setValue(item,text)}/>
        </TouchableOpacity>
    </View>
);
const RestaurantContentComponent = ({ RestaurantUser }) => {
    if(RestaurantUser != null){
        const [CurrentRestaurantLocal, setRestaurant] = React.useState('');
        CurrentRestaurantUser = RestaurantUser;
        /*
        React.useEffect(() => {
            const loadRestaurant = async () => {
                res =  await firestoreDB().GetRestaurantbyOwner(CurrentRestaurantUser);
                setRestaurant(res);
            }
            
            useCallback(throttle(loadRestaurant, 2000), []);
        });
        */
        const loadRestaurant = useCallback(
            throttle(async () => {
                const res = await firestoreDB().GetRestaurantbyOwner(RestaurantUser);
                setRestaurant(res);
            }, 2000),
            [RestaurantUser] // Add dependencies to useCallback
        );
        
        React.useEffect(() => {
            loadRestaurant();
        }, [loadRestaurant]);



        if(CurrentRestaurantLocal != '' ){
            CurrentRestaurant = CurrentRestaurantLocal;
            
            let arr = [];
            for (let i = 0; i < CurrentRestaurantLocal.ContentData.length; i++) {
                arr.push(i);
            }
            return (
                <FlatList
                data={arr}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                />
            );
        }
    }
};
const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    item: {
      backgroundColor: '#dddddd',
      padding: 20,
      marginVertical: 8,
      borderRadius: 20,
    },
    title: {
      fontSize: 28,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        fontsize: 11,
    },
    content: {
        fontSize: 23,
    }
  });
export default RestaurantContentComponent;