import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { firestoreDB } from './FirebaseDB';
import PostComponent from './PostComponent';
import { GetPlaces, getPhotoUri } from './components/Maps';
import * as Location from 'expo-location';
import {haversineDistance} from './components/RestaurantFinder';
import { useFonts } from 'expo-font';
const col2 = '#f9f9f9';
const SearchScreen = () => {
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  })
  const { isLoggedIn } = useContext(AuthContext);
  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -100) {
      if (isLoggedIn) {
        navigation.navigate('PostCreation');
      } else {
        navigation.navigate('LoginScreen');
      }
    } else if (event.nativeEvent.translationX > 100) {
      navigation.navigate('HomeScreen');
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isUserSearch, setIsUserSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const db = firestoreDB();

  // Handle the search logic for users and posts

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('');
        return;
        }
        })();
  }, []);
  const pickLocation = async () => {
      try {
          let locationResult = await Location.getCurrentPositionAsync({});
          setLocation(locationResult);
      } catch (error) {
          setLocation('');
      }
  };
  
  const rawplaces = GetPlaces(searchQuery);
  useEffect(() => {
    if(rawplaces){
      if(location != null){
        const referenceLocation = location.coords;
        const sortedLocations = rawplaces.sort((a, b) => {
            const distanceA = haversineDistance(referenceLocation, a.location);
            const distanceB = haversineDistance(referenceLocation, b.location);
            return distanceA - distanceB;
        });
        
        setSearchResults({...searchResults,restaurants:sortedLocations});
      }
      else{
        setSearchResults({...searchResults,restaurants:rawplaces});
      }
    }
    else if(searchResults?.restaurants){
      setSearchResults({...searchResults,restaurants:[]});
    }
  },[rawplaces]);
  
  useEffect(() => {
    if(searchQuery != ''){
      const Search = async () =>{
        const users = await db.GetUsers();
        const posts = await db.GetPosts();

        const filteredUsers = users.filter(user =>
          user.profilename && user.profilename.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const filteredPosts = posts.filter(post =>
          (post.restaurantName && post.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (filteredUsers.length > 0 && filteredPosts.length > 0) {
          setSearchResults({...searchResults,users:filteredUsers,posts:filteredPosts});
        }
        else if(filteredUsers.length > 0){
          setSearchResults({...searchResults,users:filteredUsers,posts:[]});
        }
        else if (filteredPosts.length > 0) {
          setSearchResults({...searchResults,users:[],posts:filteredPosts});
        }
        else{
          setSearchResults({...searchResults,users:[],posts:[]});
        }
      };
      Search();
    }
  }, [searchQuery]);
  // Update recent searches with the new query
  const updateRecentSearches = (query) => {
    if (query && !recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
      
    }
  };
  // Function to handle click on recent search item
  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleUserPress = (userName) => {
    navigation.navigate('UserProfile', { userName });
  };

  const handleCategoryPress = (category) => {
    setSearchQuery(category);
    handleSearch(category);
  };

  const renderUser = ({ item }) => {
    return (
      <View style={{marginBottom:5}}>
        <TouchableOpacity onPress={() => handleUserPress(item.userName)} style={{flexDirection:'row',backgroundColor:col2,padding:10,borderRadius:10,alignItems:'center'}}>
          
            <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
            <Text style={{fontFamily :'Oswald-Medium',fontSize:18}}>{item.profilename}</Text>
          
        </TouchableOpacity>
      </View>
    );
  };
  const renderPost = ({item}) =>{
    const userName = item.userName;
    return (
      <PostComponent
        post={item}
        navigateToProfile={() => navigation.navigate('UserProfile', { userName })}
        navigateToRestaurant={() => navigation.navigate('Restaurant', { restaurantName:null, restaurantID: restaurantID })}
        navigateToLogin={() => navigation.navigate('LoginScreen', {})}
      />
    );
  };
  const renderRestaurant = ({item}) => {
    return (
      <View style={{marginBottom:5}}>
        <TouchableOpacity style={{flexDirection:'row',backgroundColor:col2,padding:5,borderRadius:10}} onPress={() => navigation.navigate('Restaurant', { restaurantGID: item.id })}>
          <View style={{flexDirection:'column'}}>
            <Text style={{fontFamily :'Oswald-Medium',fontSize:18}}>{item.displayName.text}</Text>
            <Text style={{fontFamily :'Oswald-Light'}}>{item.formattedAddress}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No Results Found</Text>
    </View>
  );

  const renderRecentSearches = () => (
    <View style={styles.recentSearchesContainer}>
      <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
      {recentSearches.map((query, index) => (
        <TouchableOpacity key={index} onPress={() => handleRecentSearchPress(query)}>
          <Text style={styles.recentSearch}>{query}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  if(location == null){
    pickLocation();
    return (
        <View/>
    );
  } 
        /*          <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
            <Image source={require('../assets/icons/search.png')} style={styles.searchbarIcon} />
          </TouchableOpacity>
        */
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{ flex: 1}}>
      <View style={{padding:20,flex:1}}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('fire')}>
            <View>
              <Image source={require('../assets/icons/fire.png')} style={styles.searchicon} />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('burger')}>
            <View>
              <Image source={require('../assets/icons/burger.png')} style={styles.searchicon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('pizza')}>
            <View>
              <Image source={require('../assets/icons/pizza.png')} style={styles.searchicon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('sushi')}>
            <View>
              <Image source={require('../assets/icons/sushi.png')} style={styles.searchicon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('cake')}>
            <View>
              <Image source={require('../assets/icons/cake.png')} style={styles.searchicon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter search query"
            onEndEditing={event => {
              event.persist();
              setSearchQuery(event.nativeEvent.text);
            }}
          />

        </View>
        <ScrollView>
        { searchResults?.users?.length > 0 &&
        <View>
          <Text style={{fontFamily :'Oswald-Medium',fontSize:20}}>People</Text>
          <FlatList
            scrollEnabled={false} 
            data={searchResults.users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
          />
        </View>
        }
        { searchResults?.restaurants?.length > 0 &&
        <View>
          <Text style={{fontFamily :'Oswald-Medium',fontSize:20}}>Places</Text>
            <FlatList
              scrollEnabled={false} 
              data={searchResults.restaurants}
              keyExtractor={(item) => item.id}
              renderItem={renderRestaurant}
            />
          </View>
        }
        { searchResults?.posts?.length > 0 &&
        <View>
          <Text style={{fontFamily :'Oswald-Medium',fontSize:20}}>Posts</Text>
            <FlatList
              scrollEnabled={false} 
              data={searchResults.posts}
              keyExtractor={(item) => item.id}
              renderItem={renderPost}
            />
          </View>
        }
        {!searchResults?.posts?.length > 0 && !searchResults?.restaurants?.length > 0 && !searchResults?.users?.length > 0 && 
          <Text style={{fontFamily :'Oswald-Medium',fontSize:30}}>No results</Text>
        }
        </ScrollView>
        <Text style={{fontSize:50}}></Text>
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BottomBarComponent navigation={navigation} />
      </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  Pusher: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    fontFamily :'Oswald-Light',
    
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  searchbarIcon: {
    width: 20,
    height: 20,
  },
  searchicon: {
    width: 50,
    height: 40,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 10,
  },
  bottomBarButton: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bottomBarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  postImage: {
    width: 200,
    height: 100,
    marginBottom: 5,
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: 'gray',
  },
  recentSearchesContainer: {
    marginTop: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentSearch: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SearchScreen;
