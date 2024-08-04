import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from './AuthContext';
import { firestoreDB } from './FirebaseDB';
import { useFonts } from 'expo-font';
import StarRating from 'react-native-star-rating-widget';

const PostComponent = ({ post, navigateToProfile, navigateToRestaurant }) => {
    const [profileImageUrl, setProfileImageUrl] = useState('defaultProfileImageUri');
    const { currentUser } = useContext(AuthContext);
    const [userProfileLoaded, setUserProfileLoaded] = useState(false);
    const [fontsLoaded] = useFonts({
        "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
        "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
        "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
    });

    // Ensure post is defined and has essential properties
    if (!post || !post.userName || !post.mediaUrls || !post.creationTime) {
        return <Text>Post data is incomplete.</Text>;
    }

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                if (!post.userName)
                    return;  // Early return if userName is not defined
                const user = await firestoreDB().GetUserName(post.userName.toLowerCase()) || {};
                setProfileImageUrl(user.profileImageUrl || 'defaultProfileImageUri');
            } catch (error) {
                console.error('Error fetching profile image:', error);
                setProfileImageUrl('defaultProfileImageUri'); // Set default image URI on error
            }
            finally {
                setUserProfileLoaded(true);
            }
        };

        fetchProfileImage();
    }, [post.userName]);

    if (!fontsLoaded || !userProfileLoaded) {
        return <Text>Loading...</Text>; // Display a loading text while fonts are loading
    }

    const postDate = new Date(post.creationTime.seconds * 1000).toLocaleDateString();
    return (
        <View style={styles.postCard}> 
            <Image source={{ uri: post.mediaUrls[0] }} style={styles.backgroundImage} />
            <View style={styles.textContainer}>
                <TouchableOpacity style={styles.userContainer} onPress={() => navigateToProfile(post.userName)}>
                    <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
                    <Text style={styles.userName}>{post.userprofile}</Text>
                </TouchableOpacity>
                <StarRating rating={post.stars} onChange={() => {}} starSize={25} starStyle={{ marginHorizontal: 0 }}/>
            </View>
            <TouchableOpacity style={styles.bottomTextContainer} onPress={() => navigateToRestaurant(post.RestaurantID)}>
                <Text style={styles.contentBig} > {post.restaurantName} </Text>
                {/* <Text style={styles.date}>{postDate}</Text> */}
                <Text style={styles.content}>{post.content}</Text>
            </TouchableOpacity>          
        </View>
    );
};

const styles = StyleSheet.create({
    postCard: {
        flex: 1,
        borderRadius: 8,
        marginVertical: 12,
        overflow: 'hidden',
        height: Dimensions.get('window').width * 0.75, // Height set to maintain aspect ratio
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)' // Semi-transparent overlay for better text readability
    },
    bottomTextContainer: {
        flex: 0,
        marginTop : 130,
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)' // Semi-transparent overlay for better text readability
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
        color: '#FFF',
        fontFamily: 'Oswald-Medium',
        fontSize: 18,
    },
    date: {
        color: '#FFF',
        fontFamily: 'Oswald-Light',
        fontSize: 14,
        // marginVertical: 5,
    },
    content: {
        color: '#FFF',
        fontFamily: 'Oswald-Medium',
        fontSize: 16,
        // marginTop : ,
        marginBottom: 0, // Adds some spacing at the bottom
    },
    contentBig: {
        color: '#FFF',
        fontFamily: 'Oswald-Medium',
        fontSize: 22,
        // marginTop : ,
        marginBottom: 0, // Adds some spacing at the bottom
    },
});

export default PostComponent;
