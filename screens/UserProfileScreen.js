// UserProfileScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import postsIcon from '../assets/icons/posts.png';
import myListsIcon from '../assets/icons/lists.png';
import reviewsIcon from '../assets/icons/reviews.png';
import recipesIcon from '../assets/icons/recipes.png';
import { AuthContext } from './AuthContext';


const usersData = {
  'User123': {
    profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
    bio: 'Food lover. Always exploring new restaurants!',
    ranks: ['Verified', 'Top 10 Reviewer', 'Top Rated Recipe Creator'],
  },
  'FoodieJohn': {
    profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
    bio: 'Dessert fanatic and food critic.',
    ranks: ['Top 25 Reviewer'],
  },
  // Add more users data here...
};

const UserProfileScreen = ({ route, navigation }) => {
  const { userName } = route.params;
  const user = usersData[userName];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>User not found</Text>
      </View>
    );
  }

  const navigateToScreen = (screen) => {
    if (screen === 'Posts') {
      navigation.navigate(screen, { filterUserName: userName });
    } else {
      navigation.navigate(screen, { userName });
    }
  };

  const buttons = [
    { label: 'Posts', screen: 'Posts', icon: postsIcon },
    { label: 'My Lists', screen: 'MyLists', icon: myListsIcon },
    { label: 'Reviews', screen: 'Reviews', icon: reviewsIcon },
    { label: 'Recipes', screen: 'Recipes', icon: recipesIcon },
  ];

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const radius = Math.min(screenWidth, screenHeight) / 2.7;

  const buttonStyles = buttons.map((button, index) => {
    const angle = (Math.PI) / (buttons.length-1) * index - Math.PI; // Adjusted angle to start from top
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      ...styles.circleButton,
      left: screenWidth / 2 + x - 40,
      top: screenHeight / 2 + y - 150,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.header}>{userName}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.ranksContainer}>
          {user.ranks.map((rank, index) => (
            <Text key={index} style={styles.rank}>{rank}</Text>
          ))}
        </View>
      </View>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={buttonStyles[index]}
          onPress={() => navigateToScreen(button.screen)}
        >
          <Image source={buttons[index].icon} style={styles.icon} />
          <Text style={styles.buttonText}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the container vertically
    alignItems: 'center', // Center the container horizontally
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    alignItems: 'center', // Center the content inside the profile container
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  ranksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  rank: {
    fontSize: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  circleButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fde040',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#282512',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default UserProfileScreen;
