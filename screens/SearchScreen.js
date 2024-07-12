import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import DB from './MockDB'; // Assuming MockDB.js is in the same directory

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isUserSearch, setIsUserSearch] = useState(false);
  const navigation = useNavigation(); // Initialize navigation hook
  const db = DB(); // Initialize the mock database instance

  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };

  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };


  const handleSearch = (query) => {
    const users = Object.values(db.GetUsers());
    const posts = db.GetPosts();

    const filteredUsers = users.filter(user =>
      user.userName.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredUsers.length > 0) {
      setSearchResults(filteredUsers);
      setIsUserSearch(true);
    } else {
      const filteredPosts = posts.filter(post =>
        post.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredPosts);
      setIsUserSearch(false);
    }
  };

  const handleUserPress = (userName) => {
    navigation.navigate('UserProfile', { userName });
  };

  const handlePostPress = (postId) => {
    navigation.navigate('Post', { postId });
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
     
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('fire')}>
          <View>
            <Image source={require('../assets/icons/fire.png')} style={styles.searchicon} />
          </View>
        </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
        >
          <Image source={require('../assets/icons/search.png')} style={styles.searchbarIcon} />
        </TouchableOpacity>
      </View>
      
      {searchResults.length === 0 && (
        renderNoResults()
      )}
      
      <FlatList
        style={{ marginTop: 20 }}
        data={searchResults}
        keyExtractor={(item) => item.id ? item.id.toString() : item.userName}
        renderItem={renderResultItem}
      />

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
        
        {/* Button for home */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
          <Image source={require('../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for search */}
        <TouchableOpacity style={styles.bottomBarButton} >
          <Image source={require('../assets/icons/search.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button to navigate to post creation */}
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToPostCreation}>
        <Image source={require('../assets/icons/plus.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Button for profile */}
        <TouchableOpacity style={styles.bottomBarButton} >
          <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 30,
    height: 30,
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
    backgroundColor: '#fff', // צבע רקע לפס הרציף
    elevation: 10, // תיקוף על מנת ליצור גבוהה עבור הגבוהה
  },
  bottomBarButton: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  icon: {
    width: 25,
    height: 25,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postItem: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default SearchScreen;
