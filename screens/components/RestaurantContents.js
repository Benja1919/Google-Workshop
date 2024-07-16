import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList, TextInput, Image } from 'react-native';
import { firestoreDB } from '../FirebaseDB';
import { AuthContext } from '../AuthContext';
import { throttle } from 'lodash';
const CustomTextInput = ({ placeholderTextColor, valueTextColor, style, fontWeight, fontSize, ...rest }) => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',}}>
            <Image
            source={require('../../assets/icons/edit5.png')}
            style={{...styles.icon,marginRight:3,marginLeft:style.marginLeft}}
            resizeMode="center"
            />
        <TextInput
            placeholderTextColor={placeholderTextColor}
            style={[
            style,
            {flex:1},
            { color: valueTextColor },
            fontWeight && { fontWeight },
            fontSize && { fontSize },
            ]}
            {...rest}
        />
      </View>
    );
  };
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
const setDescription = (text) =>{
    CurrentRestaurant.description = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}
const col2 = '#fbfbfb';
const renderItem = ({ item }) => (
    <View style={styles.item1}>
        <CustomTextInput
            placeholder={CurrentRestaurant.ContentTitles[item]}
            placeholderTextColor="black"
            valueTextColor="black"
            onChangeText={text => setKey(item,text)}
            style={{ fontSize: 20, fontWeight: 'bold'}}
        />
        <CustomTextInput
            placeholder={CurrentRestaurant.ContentData[item]}
            placeholderTextColor="black"
            valueTextColor="black"
            onChangeText={text => setValue(item,text)}
            style={{ fontSize: 16, fontWeight: 'regular',marginLeft:3}}
        />

    </View>
);

const RestaurantContentComponent = ({ RestaurantUser }) => {
    if(RestaurantUser != null){
        const [CurrentRestaurantLocal, setRestaurant] = React.useState('');
        CurrentRestaurantUser = RestaurantUser;
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

        
        //<TextInput style={styles.input} placeholder={CurrentRestaurantLocal.description} onChangeText={setDescription}/>
        if(CurrentRestaurantLocal != '' ){
            CurrentRestaurant = CurrentRestaurantLocal;
            
            let arr = [];
            for (let i = 0; i < CurrentRestaurantLocal.ContentData.length; i++) {
                arr.push(i);
            }
            return (
                <View>
                    <Text style={styles.SectionTitle}>Description </Text>
                    <View style={{...styles.item,padding: 5}}> 
                        <CustomTextInput
                            placeholder={CurrentRestaurantLocal.description}
                            placeholderTextColor="black"
                            valueTextColor="black"
                            onChangeText={text => setDescription(text)}
                            style={{ fontSize: 16, fontWeight: 'regular',marginLeft:3}}
                        />
                    </View>
                    <Text style={styles.SectionTitle}>Addional Information</Text>
                    <FlatList style={styles.item}
                    data={arr}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }
    }
};
const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    item: {
      backgroundColor: col2,
      borderRadius: 15,
    },
    item1: {
        padding: 5,
    },
    title: {
      fontSize: 28,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    input2: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        fontsize: 11,
    },
    content: {
        fontSize: 20,
    },
    SectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    icon: {
        width: 13,
        height: 15,
        
      },
  });
export default RestaurantContentComponent;