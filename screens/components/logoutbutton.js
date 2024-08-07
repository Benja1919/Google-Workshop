import { AuthContext } from '../AuthContext';
import React, {  useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
const LogoutButton = ({navigation}) =>{
    const { isLoggedIn, logout, currentUser } = useContext(AuthContext);
    const handlePress = () => {
        if (isLoggedIn) {
            navigation.navigate('HomeScreen');
            logout();
          
        }

      };
    if(isLoggedIn){
        return (
        <TouchableOpacity 
          style={{
            marginLeft: 5,
          }} 
          onPress={handlePress}
        >
          <Image 
            style={{ width: 25, height: 25, tintColor: "black" ,marginLeft: 25 }}
            source={require("../../assets/icons/logout.png")}        
          />
        </TouchableOpacity> 
        );
      }
};
export default LogoutButton;