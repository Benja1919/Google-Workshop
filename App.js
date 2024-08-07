import React, {useState, useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { Image,StyleSheet, LogBox, View, TouchableOpacity,Text } from 'react-native';
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
import Landingpage from './screens/Landing';
import { useFonts } from 'expo-font';
import LogoutButton from './screens/components/logoutbutton';

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
  style={{ width: 200, height: 70, top: -5 }}
  source={require('./assets/icons/HomeName.png')} 
/>);
};
const App = () => {
  const [MapHeaderFunction, setMapHeaderFunction] = useState(null);
  const [CurrentUserScreenLeftFunction, setCurrentUserScreenLeftFunction] = useState(null);
  const [UserScreenLeftFunction, setUserScreenLeftFunction] = useState(null);
  const [UserScreenLeftButton, setUserScreenLeftButton] = useState(null);
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("./assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("./assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("./assets/fonts/Oswald-Medium.ttf")
  })
  if (!fontsLoaded){
    return undefined;
  }
  return (
    <AuthProvider>
        <View style={styles.appBackground}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landingpage">
        <Stack.Screen 
        name = "Landingpage"
        component={Landingpage}
        options={{  
          headerStyle: {
            height: 110},
          headerTitle: AppHeaderTitle,
          headerTitleAlign: 'center' // יישור למרכז, אופציונלי
          }} />
        <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              headerStyle: {
                height: 110,
              },
              headerTitle: () => <AppHeaderTitle />,
              headerTitleAlign: 'center',
              headerLeft: () => null,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Search"); // Replace "Details" with the desired screen name
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require("./assets/icons/search.png")}
                      style={{ tintColor: '#434343',width: 27, height: 27, marginRight: 20, resizeMode: 'contain' }}
                    />
                    <Text style={{ color: 'black', marginLeft: 8 }}></Text>
                  </View>
                </TouchableOpacity>
              ),
            })}
          />
<Stack.Screen
  name="UserProfile"
  component={UserProfileScreen}
  options={({ navigation }) => ({  
    headerStyle: {
      height: 110,
    },
    headerTitle: AppHeaderTitle,
    headerLeft: () => ( 
      <LogoutButton navigation={navigation}/>
    ),
    headerTitleAlign: 'center', // יישור למרכז, אופציונלי
  })}
/>
<Stack.Screen
  name="ProfileScreen" 
  options={{ 
    headerTitle: AppHeaderTitle,
    headerLeft: () => ( 
      <TouchableOpacity 
        style={{

          marginLeft:5
        }} 
        onPress={CurrentUserScreenLeftFunction}
      >
        <Image 
          style={{width: 40, height: 30, tintColor:"black"}}
          source={require("./assets/icons/logout3.png")}        
        />
      </TouchableOpacity> 
    ),
    headerTitleAlign: 'center' // Optional
  }}
>
  {props => (
    <CurrentUserProfile
      {...props}
      onHeaderLeftPress={handlePress => setCurrentUserScreenLeftFunction(() => handlePress)}

    />
  )}
</Stack.Screen>
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
          <Stack.Screen 
          name="MapView" 
          options={{ 
            headerTitle: AppHeaderTitle,
            headerStyle: {
              height: 110},
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  if (MapHeaderFunction) {
                    MapHeaderFunction();
                  }
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require("./assets/icons/sidemenu3.png")}
                    style={{ tintColor: 'black', width: 35, height: 25,marginLeft:10,resizeMode:'contain' }}
                  />
                  <Text style={{ color: 'black', marginLeft: 8 }}></Text>
                </View>
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center'
          }}
        >
          {props => (
            <MapMenu
              {...props}
              onHeaderLeftPress={toggleMenu => setMapHeaderFunction(() => toggleMenu)}
            />
          )}
        </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: 'blue', // Set your desired background color here
  },
});


export default App;



'./screens/Landing'