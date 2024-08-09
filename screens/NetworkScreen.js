import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomBarComponent from './components/BottomBar';
import FollowingPage from './FollowingPage';
import FollowersPage from './FollowersPage';
import { firestoreDB } from './FirebaseDB';

const NetworkScreen = ({ navigation, route }) => {
  const {userName} = route.params;
  const [user, setUser] = useState([]);
  useEffect(() => { 
    const fetchUser = async () => {
      try {
        const user = await firestoreDB().GetUserName(userName.toLowerCase());
        setUser(user);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchUser();
    }, [userName]); // Add userName as a dependency
    const Tab = createMaterialTopTabNavigator();
  return (
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen name={`Followers (${user.followers ? user.followers.length : 0})`} component={FollowersPage} initialParams={{userName: route.params}}/>
        <Tab.Screen name={`Following (${user.friends ? user.friends.length : 0})`} component={FollowingPage} initialParams={{userName: route.params}}/>
      </Tab.Navigator>
      <View>
      <BottomBarComponent navigation={navigation}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
  },
})
export default NetworkScreen;
