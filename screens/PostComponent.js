// PostComponent.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * PostComponent
 *
 * A component that displays a post with user information, restaurant name, rating, and content.
 *
 * @param {Object} post - The post data.
 * @param {string} post.userName - The username of the post author.
 * @param {string} post.profileImageUrl - The URL of the post author's profile image.
 * @param {string} post.restaurantName - The name of the restaurant mentioned in the post.
 * @param {string} post.imageUrl - The URL of the image included in the post.
 * @param {string} post.content - The content of the post.
 * @param {number} post.stars - The rating given to the restaurant.
 * @param {function} navigateToProfile - Function to navigate to the user's profile.
 * @param {function} navigateToRestaurant - Function to navigate to the restaurant's page.
 *
 * @returns {JSX.Element} The rendered post component.
 */
const PostComponent = ({ post, navigateToProfile, navigateToRestaurant }) => (
  <View style={styles.postCard}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.userContainer} onPress={() => navigateToProfile(post.userName)}>
        <Image source={{ uri: post.profileImageUrl }} style={styles.userImage} />
        <Text style={styles.userName}>{post.userName}</Text>
      </TouchableOpacity>
      <Text style={styles.stars}>{'⭐'.repeat(post.stars)}</Text>
    </View>
    <TouchableOpacity onPress={() => navigateToRestaurant(post.restaurantName)}>
      <Text style={styles.restaurantName}>{post.restaurantName}</Text>
    </TouchableOpacity>
    <Image source={{ uri: post.imageUrl }} style={styles.image} />
    <Text style={styles.content}>{post.content}</Text>
  </View>
);

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  restaurantName: {
    fontSize: 16,
    color: '#1e90ff',
    marginBottom: 5,
  },
  stars: {
    fontSize: 16,
    color: '#ffd700',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});

export default PostComponent;
