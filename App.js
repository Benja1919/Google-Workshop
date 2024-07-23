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
import SignUpScreen from './screens/SignUpScreen'; // Import the SignInScreen component
import MapMenu from './screens/MapMenu';
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
  style={{ width: 200, height: 70 }}
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
              headerStyle: {
                height: 110},
              headerTitle: AppHeaderTitle,
              headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}
          />
          <Stack.Screen name="UserProfile"
           component={UserProfileScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="ProfileScreen" component={CurrentUserProfile} options={{ 
              headerTitle: AppHeaderTitle,
              headerLeft: () => null,
              headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}/>
          <Stack.Screen name="Restaurant"
           component={RestaurantScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}/>
          <Stack.Screen name="MyLists"
           component={MyListsScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="Network"
           component={NetworkScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="Recipes"
           component={RecipesScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="PostCreation"
           component={PostCreationScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="Search"
           component={SearchScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="Posts"
           component={PostsScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="LoginScreen"
           component={LoginScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="SignUp"
           component={SignUpScreen}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
          <Stack.Screen name="MapView"
           component={MapMenu}
           options={{  
            headerStyle: {
              height: 110},
            headerTitle: AppHeaderTitle,
            headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;



'./screens/HomeScreen'