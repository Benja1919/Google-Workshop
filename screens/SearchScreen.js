import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomBarComponent from './components/BottomBar';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { firestoreDB } from './FirebaseDB';

const SearchScreen = () => {
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
  const navigation = useNavigation();
  const db = firestoreDB();

  // Handle the search logic for users and posts
  const handleSearch = async (query) => {
    const users = await db.GetUsers();
    const posts = await db.GetPosts();

    const filteredUsers = users.filter(user =>
      user.userName && user.userName.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredUsers.length > 0) {
      setSearchResults(filteredUsers);
      setIsUserSearch(true);
    } else {
      const filteredPosts = posts.filter(post =>
        (post.restaurantName && post.restaurantName.toLowerCase().includes(query.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredPosts);
      setIsUserSearch(false);
    }

    updateRecentSearches(query);
  };

  // Update recent searches with the new query
  const updateRecentSearches = (query) => {
    if (query && !recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };

  useEffect(() => {
    // Load recent searches from storage or initialize if empty
    // Example using AsyncStorage:
    // const loadRecentSearches = async () => {
    //   const searches = await AsyncStorage.getItem('recentSearches');
    //   setRecentSearches(searches ? JSON.parse(searches) : []);
    // };
    // loadRecentSearches();
  }, []);

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

  const renderResultItem = ({ item }) => {
    if (isUserSearch) {
      // User item
      return (
        <TouchableOpacity onPress={() => handleUserPress(item.userName)}>
          <View style={styles.userItem}>
            <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
            <Text>{item.userName}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Post item
      return (
        <TouchableOpacity onPress={() => handlePostPress(item.id)}>
          <View style={styles.postItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            <Text>{item.restaurantName}</Text>
            <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
            <Text>{item.userName}</Text>
            <Text>{item.content}</Text>
          </View>
        </TouchableOpacity>
      );
    }
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

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={80}>
      <View style={{ flex: 1, padding: 20 }}>
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
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
            <Image source={require('../assets/icons/search.png')} style={styles.searchbarIcon} />
          </TouchableOpacity>
        </View>

        {searchResults.length === 0 && recentSearches.length > 0 && renderRecentSearches()}

        {searchResults.length === 0 && recentSearches.length === 0 && renderNoResults()}

        <FlatList
          style={{ marginTop: 20 }}
          data={searchResults}
          keyExtractor={(item) => item.id ? item.id.toString() : item.userName}
          renderItem={renderResultItem}
        />
        <TouchableOpacity onPress={() =>navigation.navigate('MapView')}> {/*Delete me when sorted*/}
          <Text fontSize={{fontWeight:50}}>Temporary: Goto MapMenu</Text>
        </TouchableOpacity>
        <View style={styles.Pusher} />
        <BottomBarComponent navigation={navigation} />
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
