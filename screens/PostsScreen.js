import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostComponent from './PostComponent'; // Ensure the import path is correct
import { firestoreDB } from './FirebaseDB';
import { AuthContext } from './AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import reactNativeConfig from '../react-native.config';



/**
 * PostsScreen
 *
 * A screen component that displays a list of posts. It supports filtering posts by restaurant name or user name.
 *
 * @param {Object} navigation - The navigation object provided by React Navigation.
 * @param {Object} route - The route object provided by React Navigation, containing route parameters for filtering.
 *
 * @returns {JSX.Element} The rendered posts screen component.
 */
const PostsScreen = ({ navigation, route, isScrollEnabled }) => {
  const allPostsRef = React.useRef([]);
  const [posts, setPosts] = React.useState([]);
  const { isLoggedIn, currentUser} = useContext(AuthContext);

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await firestoreDB().GetPosts();
        allPostsRef.current = posts;
        const filterRestaurantID = route?.params?.filterrestaurantID; // Optional chaining
        const filterUserName = route?.params?.filterUserName; // Optional chaining
        const filterFriends = route?.params?.filterFriends;
        let filteredPosts = posts;

        if (filterRestaurantID) {

          filteredPosts = filteredPosts.filter(post => post.RestaurantID === filterRestaurantID);
        }

        if (filterUserName) {
          filteredPosts = filteredPosts.filter(post => post.userName === filterUserName);
        }

        if (filterFriends) {
          if (isLoggedIn)
          {
            filteredPosts = filteredPosts.filter(post => currentUser.friends.includes(post.userName));
          }
          else
          {
            filteredPosts = [];
          }
        }
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();

    // Set up real-time listener
    const unsubscribe = firestoreDB().SubscribeToPosts((posts) => {
      allPostsRef.current = posts;
      const filterrestaurantID = route?.params?.filterrestaurantID;
      const filterUserName = route?.params?.filterUserName;
      const filterFriends = route?.params?.filterFriends;

      
      let filteredPosts = posts;

      if (filterrestaurantID) {
        filteredPosts = filteredPosts.filter(post => post.RestaurantID === filterrestaurantID);
      }

      if (filterUserName) {
        filteredPosts = filteredPosts.filter(post => post.userName === filterUserName);
      }

      if (filterFriends) {
        if (isLoggedIn)
        {
          filteredPosts = filteredPosts.filter(post => currentUser.friends.includes(post.userName));
        }
        else
        {
          filteredPosts = [];
        }
      }
      setPosts(filteredPosts);
    });

    return () => unsubscribe();
  }, [route]);

  useFocusEffect(
    React.useCallback(() => {
      const filterRestaurantID = route?.params?.filterrestaurantID; // Optional chaining
        const filterUserName = route?.params?.filterUserName; // Optional chaining
        const filterFriends = route?.params?.filterFriends;
        let filteredPosts = allPostsRef.current;

        if (filterRestaurantID) {
          filteredPosts = filteredPosts.filter(post => post.RestaurantID === filterRestaurantID);
        }

        if (filterUserName) {
          filteredPosts = filteredPosts.filter(post => post.userName === filterUserName);
        }

        if (filterFriends) {
          if (isLoggedIn)
          {
            filteredPosts = filteredPosts.filter(post => currentUser.friends.includes(post.userName));
          }
          else
          {
            filteredPosts = [];
          }
        }
        setPosts(filteredPosts);
    }, [route])
  );

  /**
   * navigateToProfile
   *
   * Navigates to the user's profile screen.
   *
   * @param {string} userName - The user name to navigate to.
   */
  const navigateToProfile = (userName) => {
    navigation.navigate('UserProfile', { userName });
  };

  /**
   * navigateToRestaurant
   *
   * Navigates to the restaurant's screen.
   *
   * @param {string} restaurantID - The restaurant name to navigate to.
   */
  const navigateToRestaurant = (restaurantID) => {
    navigation.navigate('Restaurant', { restaurantName:null, restaurantID: restaurantID });
  };

  const navigateToLogin = () => {
    navigation.navigate('LoginScreen', {});
  };
  

  /**
   * renderPost
   *
   * Renders a single post component.
   *
   * @param {Object} item - The post item to render.
   * @returns {JSX.Element} The rendered post component.
   */
  const renderPost = ({ item }) => (
    <PostComponent
      post={item}
      navigateToProfile={navigateToProfile}
      navigateToRestaurant={navigateToRestaurant}
      navigateToLogin={navigateToLogin}
      

    />
  );

  return (
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        scrollEnabled={isScrollEnabled}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default PostsScreen;
