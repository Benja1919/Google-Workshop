import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert , TextInput } from 'react-native';
import { AuthContext } from './AuthContext';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import RestaurantContentComponent from './components/RestaurantContents';

const CurrentUserProfile = ({ navigation }) => {
    const { isLoggedIn, logout, currentUser } = useContext(AuthContext);
    const onGestureEvent = (event) => {
        if (event.nativeEvent.translationX > 100) {
          if(isLoggedIn){
            navigation.navigate('PostCreation');
          }
          else{
            navigation.navigate('MapView');
          }
        }
        else if (event.nativeEvent.translationX < -100) {
          navigation.navigate('HomeScreen');
        }
      };
    //Alert.alert(currentUser.userName);
    const navigateToLoginScreen = () => {
        navigation.navigate('LoginScreen');
      };
    const handlePress = () => {
        if (isLoggedIn) {
          logout();
          navigation.navigate('HomeScreen');
        } else {
          navigateToLoginScreen();
        }
      };
    const navigateToRestaurant = (rid) => {
        navigation.navigate('Restaurant', {restaurantName: null, restaurantID: rid });
    };
    if(isLoggedIn && !currentUser.isRestaurant){
      return (
          <PanGestureHandler onGestureEvent={onGestureEvent} >
              <View Main style={styles.container}>
              <Text style={styles.basictext}> User Profile </Text>
                  <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
                      <Text style={styles.loginButtonText}> 
                          {isLoggedIn ? 'Logout' : 'Login'}
                      </Text>
                  </TouchableOpacity>
                  <View Push style={styles.Pusher}/>
                  <BottomBarComponent navigation={navigation}/>
              </View>
          </PanGestureHandler>
      );
    }
    else{
      return (
        <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
          <View style={styles.Pusher}>
            
            <ScrollView Main style={styles.container}>
              
              <Text style={styles.BigTitle}>Edit Restaurant Profile </Text>
              <TouchableOpacity style={styles.ToProfileButton} onPress={() => navigateToRestaurant(currentUser.RestaurantID)}>
                <Image style={styles.toprofileimage}
                  source ={require("../assets/icons/toprofile.png")}        
                />
              </TouchableOpacity>   
                        
              <RestaurantContentComponent RestaurantUser={currentUser}/>
              <Text style={{fontSize:40}}></Text>
              <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
                <Image style={styles.logoutimage}
                  source ={require("../assets/icons/logout3.png")}        
                />
              </TouchableOpacity> 
            </ScrollView>
            <View Push style={styles.Pusher}/>
            <BottomBarComponent navigation={navigation}/>
          </View>
        </PanGestureHandler>
    );
};
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
    Pusher:{
        flex: 1,
    },
    loginButton: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: '#0056b4',
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 10,
    },
    ToProfileButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: '#0056b4',
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 10,
    },
    logoutimage :{
      width: 40,
      height: 30,
    },
    toprofileimage :{
      width: 32,
      height: 30,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      marginBottom: 5,
      fontsize: 11,
    },
    basictext:{
      fontSize: 20, 
      textAlign: 'center',
    },
    BigTitle:{
      fontSize: 30, 
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 10,
    }
  });

export default CurrentUserProfile;