import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { Image } from 'react-native';
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


const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ 
              headerTitle: () => (
                <Image
                  style={{ width: 200, height: 60 }}
                  source={require('./assets/icons/HomeName.png')} 
                />
              ),
              headerTitleAlign: 'center' // יישור למרכז, אופציונלי
            }}
          />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
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