// UserProfileScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import postsIcon from '../assets/icons/posts.png';
import myListsIcon from '../assets/icons/lists.png';
import myNetworkIcon from '../assets/icons/network.png';


const usersData = {
  'User123': {
    profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
    bio: 'Food lover. Always exploring new restaurants!',
    ranks: ['Verified', 'Top 10 Reviewer', '300 connections'],
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

  const navigateToPostCreation = () => {
    navigation.navigate('PostCreation');
  };
  
  const navigateToLoginScreen = () => {
    navigation.navigate('LoginScreen');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };
  
  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen');
  };
  
  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };
  
  const handlePress = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigateToLoginScreen();
    }
  };

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
    }
    else {
      if (screen === 'MyLists')
        {
        navigation.navigate('MyLists', { user, profileImageUrl: user.profileImageUrl });
    }
    else
    {
      navigation.navigate(screen, { userName });
    }
  }
};

  const buttons = [
    { label: 'Posts', screen: 'Posts', icon: postsIcon },
    { label: 'My Lists', screen: 'MyLists', icon: myListsIcon },
    { label: 'My Network', screen: 'Network', icon: myNetworkIcon },
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
          {/* Bottom bar */}
          <View style={styles.bottomBar}>
        
          {/* Button for home */}
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToHome}>
            <Image source={require('../assets/icons/home.png')} style={styles.icon} />
          </TouchableOpacity>
  
          {/* Button for search */}
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToSearch}>
            <Image source={require('../assets/icons/search.png')} style={styles.icon} />
          </TouchableOpacity>
  
          {/* Button to navigate to post creation */}
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToPostCreation}>
          <Image source={require('../assets/icons/plus.png')} style={styles.icon} />
          </TouchableOpacity>
  
          {/* Button for profile */}
          <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToProfile}>
            <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
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
    width: 25,
    height: 25,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default UserProfileScreen;
