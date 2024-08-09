import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomBarComponent from './components/BottomBar';
import FollowingScreen from './FollowingScreen';
import FollowersScreen from './FollowersScreen';

const NetworkScreen = ({ navigation, route }) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <View style={styles.container}>
      <Tab.Navigator style={styles.tabNavigator}>
        <Tab.Screen name="Followers" component={FollowersScreen} initialParams={{userName: route.params}}/>
        <Tab.Screen name="Following" component={FollowingScreen} initialParams={{userName: route.params}}/>
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
