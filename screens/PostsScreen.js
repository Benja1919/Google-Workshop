import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostComponent from './PostComponent'; // נוודא שמסלול היבוא נכון
import DB from './MockDB';
// Mock function to fetch posts
const fetchPosts = async () => {
  return DB().GetPosts();
};

const PostsScreen = ({ navigation, route }) => {
    const [posts, setPosts] = React.useState([]);
  
    React.useEffect(() => {
        const loadPosts = async () => {
          try {
            const allPosts = await fetchPosts();
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
      }, [route]);
      
  
    const navigateToProfile = (userName) => {
      navigation.navigate('UserProfile', { userName });
    };
  
    const navigateToRestaurant = (restaurantName) => {
      navigation.navigate('Restaurant', { restaurantName });
    };
  
    const renderPost = ({ item }) => (
      <PostComponent
        post={item}
        navigateToProfile={navigateToProfile}
        navigateToRestaurant={navigateToRestaurant}
      />
    );
  
    return (
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
  });
  
  export default PostsScreen;