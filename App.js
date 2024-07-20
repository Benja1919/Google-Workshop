import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { Image, LogBox } from 'react-native';
import UserProfileScreen from './screens/UserProfileScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import PostsScreen from './screens/PostsScreen';
import PostCreationScreen from './screens/PostCreationScreen';
import MyListsScreen from './screens/MyListsScreen';
import NetworkScreen from './screens/NetworkScreen';
import RecipesScreen from './screens/RecipesScreen';
import LoginScreen from './screens/LoginScreen'
import SearchScreen from './screens/SearchScreen'
import { AuthProvider } from './screens/AuthContext';
import CurrentUserProfile from './screens/CurrentUserProfileScreen'
//caused by a library component DateTimePickerModal
LogBox.ignoreLogs([ //suppresses in expo go
  /defaultProps will be removed/
]);
//overrides console.error so it will also suppress the error in console
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.')) {
    return;
  }
  originalError(...args);
};


const Stack = createStackNavigator();
const AppHeaderTitle = () =>{
  return (<Image
  style={{ width: 200, height: 60 }}
  source={require('./assets/icons/HomeName.png')} 
/>);
};
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ 
              headerTitle: AppHeaderTitle,
              headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}
          />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="ProfileScreen" component={CurrentUserProfile} options={{ 
              headerTitle: AppHeaderTitle,
              headerLeft: () => null,
              headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}/>
          <Stack.Screen name="Restaurant" component={RestaurantScreen} />
          <Stack.Screen name="MyLists" component={MyListsScreen} />
          <Stack.Screen name="Network" component={NetworkScreen} />
          <Stack.Screen name="Recipes" component={RecipesScreen} />
          <Stack.Screen name="PostCreation" component={PostCreationScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Posts" component={PostsScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;



'./screens/HomeScreen'