import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList, TextInput } from 'react-native';
import { firestoreDB } from '../FirebaseDB';
import { AuthContext } from '../AuthContext';
//let ContentTitles = [];
//let ContentData = [];
let CurrentRestaurantUser;

const setKey = (item,text) =>{
    CurrentRestaurantUser.ContentTitles[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurantUser.userName,CurrentRestaurantUser.ContentTitles,CurrentRestaurantUser.ContentData);
}
const setValue = (item,text) =>{
    CurrentRestaurantUser.ContentData[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurantUser.userName,CurrentRestaurantUser.ContentTitles,CurrentRestaurantUser.ContentData);
}

const renderItem = ({ item }) => (
    <View style={styles.item}>
        <TouchableOpacity>
            <Text style={styles.content}>Title </Text>
            <TextInput style={styles.input} placeholder={CurrentRestaurantUser.ContentTitles[item]} onChangeText={text => setKey(item,text)}/>
            <Text style={styles.content}>Information </Text>
            <TextInput style={styles.input} placeholder={CurrentRestaurantUser.ContentData[item]} onChangeText={text => setValue(item,text)}/>
        </TouchableOpacity>
    </View>
);
const RestaurantContentComponent = ({ RestaurantUser }) => {
    if(RestaurantUser != null){
        CurrentRestaurantUser = RestaurantUser;
        let arr = [];
        for (let i = 0; i < RestaurantUser.ContentTitles.length; i++) {
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