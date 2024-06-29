import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostComponent from './PostComponent'; // נוודא שמסלול היבוא נכון

// Mock function to fetch posts
const fetchPosts = async () => {
  return [
    {
      id: '1',
      userName: 'User123',
      restaurantName: 'Restaurant 1',
      content: 'Amazing dinner at Restaurant 1',
      stars: 5,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr2AU24_uM5pUXPbwj7HfAElehKipMV1RFAw&s.reshet.tv/image/upload/t_grid-item-large/v1667468127/uploads/2022/903311857.jpg',
      profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
    },
    {
      id: '2',
      userName: 'FoodieJohn',
      restaurantName: 'Restaurant 2',
      content: 'Loved the atmosphere at Restaurant 2',
      stars: 4,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4S3i0Vv04eORM_5HpLDY87XJjBvgevpDzYA&s',
      profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
    },
    {
      id: '3',
      userName: 'FoodieJohn',
      restaurantName: 'Restaurant 2',
      content: 'Loved the atmosphere at Restaurant 2',
      stars: 4,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ80n9Sb3nwyIZy2Xq7j1TLtQwbqbClzTmverAEzmrPkgj8KgnNskiY5iUQ3r_USAM6hHo&usqp=CAU',
      profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
    },
];
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