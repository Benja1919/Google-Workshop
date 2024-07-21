import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostComponent from './PostComponent'; // Ensure the import path is correct
import { firestoreDB } from './FirebaseDB';

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
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await firestoreDB().GetPosts();
        const filterRestaurantName = route?.params?.filterrestaurantName; // Optional chaining
        const filterUserName = route?.params?.filterUserName; // Optional chaining

        let filteredPosts = allPosts;

        if (filterRestaurantName) {
          filteredPosts = filteredPosts.filter(post => post.restaurantName === filterRestaurantName);
        }

        if (filterUserName) {
          filteredPosts = filteredPosts.filter(post => post.userName === filterUserName);
        }

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();

    // Set up real-time listener
    const unsubscribe = firestoreDB().SubscribeToPosts((allPosts) => {
      const filterRestaurantName = route?.params?.filterrestaurantName;
      const filterUserName = route?.params?.filterUserName;

      let filteredPosts = allPosts;

      if (filterRestaurantName) {
        filteredPosts = filteredPosts.filter(post => post.restaurantName === filterRestaurantName);
      }

      if (filterUserName) {
        filteredPosts = filteredPosts.filter(post => post.userName === filterUserName);
      }

      setPosts(filteredPosts);
    });

    return () => unsubscribe();
  }, [route]);

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
   * @param {string} restaurantName - The restaurant name to navigate to.
   */
  const navigateToRestaurant = (restaurantName) => {
    navigation.navigate('Restaurant', { restaurantName });
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
