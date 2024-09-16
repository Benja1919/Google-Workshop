import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from './AuthContext';
import { firestoreDB } from './FirebaseDB';
import { useFonts } from 'expo-font';
import StarRating from 'react-native-star-rating-widget';
import Carousel from 'react-native-reanimated-carousel';


const PostComponent = ({ post, navigateToProfile, navigateToRestaurant, navigateToLogin }) => {
    const [profileImageUrl, setProfileImageUrl] = useState('defaultProfileImageUri');
    const [profileName, setProfileName] = useState('unknown');
    const { currentUser } = useContext(AuthContext);
    const [userProfileLoaded, setUserProfileLoaded] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [postDate, setPostDate] = useState('');

    const [likesCount, setLikesCount] = useState(post.likes ? post.likes : 0);
    const [fontsLoaded] = useFonts({
        "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
        "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
        "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
    });

    const { width: viewportWidth } = Dimensions.get('window');


    // Ensure post is defined and has essential properties
    if (!post || !post.userName || !post.mediaUrls || !post.creationTime) {
        return <Text>Post data is incomplete.</Text>;
    }

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                if (!post.userName) return;  // Early return if userName is not defined
                const user = await firestoreDB().GetUserName(post.userName.toLowerCase()) || {};
                setProfileImageUrl(user.profileImageUrl || 'defaultProfileImageUri');
                setProfileName(user.profilename || 'unknown');
            } catch (error) {
                console.error('Error fetching profile image:', error);
                setProfileImageUrl('defaultProfileImageUri'); // Set default image URI on error
                setProfileName('unknown');
            } finally {
                setUserProfileLoaded(true);
            }
        };

        fetchProfileImage();
    }, [post.userName]);

    useEffect(() => {
        const updatePostDate = () => {
            let dateDiff = (Date.now() / 1000) - post.creationTime.seconds;
            let postDate;
            if (dateDiff < 60)
            {
                postDate = "Now"
            }
            else if (dateDiff < 3600)
            {
                cnt = Math.floor(dateDiff / 60);
                postDate = cnt
                if (cnt == 1)
                {
                    postDate += " minute ago";
                }
                else
                {
                    postDate += " minutes ago";
                }
            }
            else if (dateDiff < 86400)
            {
                cnt = Math.floor(dateDiff / 3600);
                postDate = cnt
                if (cnt == 1)
                {
                    postDate += " hour ago";
                }
                else
                {
                    postDate += " hours ago";
                }
            }
            else if (dateDiff < 604800)
            {
                cnt = Math.floor(dateDiff / 86400);
                postDate = cnt
                if (cnt == 1)
                {
                    postDate += " day ago";
                }
                else
                {
                    postDate += " days ago";
                }
            }
            else
            {
                postDate = new Date(post.creationTime.seconds * 1000).toLocaleDateString();
            }
            setPostDate(postDate);
        }
        updatePostDate();
        
        const intervalId = setInterval(updatePostDate, 60000);

        return () => clearInterval(intervalId);
    }, [])
    
    const renderItem = ({ item }) => {
            return <Image source={{ uri: item.url }}  style= {styles.backgroundImage}/>;
        }

    const mediaItems = Array.isArray(post.mediaUrls)
    ? post.mediaUrls.map((url) => ({
        url: url,
        type: 'image'
    }))
    : [{ url: post.mediaUrls[0], type: 'image' }];

    const toggleLike = async () => {
        if (!currentUser || !currentUser.userName) {
            navigateToLogin(); // Redirect to login if not logged in
            return;
        }

        const alreadyLiked = post.like_users.includes(currentUser.userName);

        // Optimistic update
        setLikesCount(prevCount => alreadyLiked ? prevCount - 1 : prevCount + 1);

        try {
            const updatedPostDoc = alreadyLiked 
                ? await firestoreDB().UnlikePost(post.id, currentUser.userName)
                : await firestoreDB().LikePost(post.id, currentUser.userName);
            const updatedPost = updatedPostDoc.data();
            setLikesCount(updatedPost.likes);
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert the optimistic update if an error occurred
            setLikesCount(prevCount => alreadyLiked ? prevCount + 1 : prevCount - 1);
        }
    };

    return (
        <View style={styles.post}>
            <View style={styles.postCard}> 
            {mediaItems.length > 1 ? (
                <>
                    <Carousel
                        data={mediaItems}
                        renderItem={renderItem}
                        width={viewportWidth}
                        pagingEnabled
                        onSnapToItem={index => setActiveSlide(index)}
                    />
                    <View style={styles.paginationContainer}>
                        {mediaItems.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    { opacity: index === activeSlide ? 1 : 0.4 }
                                ]}
                            />
                        ))}
                    </View>
                </>
            ) : (
                <Image source={{ uri: post.mediaUrls[0] }}  style= {styles.backgroundImage}/>
            )}
                
                <View style={styles.textContainer}>
                    <TouchableOpacity style={styles.userContainer} onPress={() => navigateToProfile(post.userName)}>
                        <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
                        <Text style={styles.userName}>{profileName}</Text>
                    </TouchableOpacity>
                    <StarRating rating={post.stars} onChange={() => {}} starSize={22} color={'#eee1c4'} starStyle={{ marginHorizontal: 0 }}/>
                </View>
            </View>

            <View style={styles.bottomTextContainer}>
                <TouchableOpacity onPress={() => navigateToRestaurant(post.RestaurantID)}>
                    <Text style={styles.contentBig}>{post.restaurantName}</Text>
                </TouchableOpacity>
                <Text style={styles.content}>{post.content}</Text>
                <View style={styles.dateAndLikeContainer}>
                    <Text style={styles.date}>{postDate}</Text>
                    <View style={styles.likeContainer}>
                        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
                            <Image
                                source={post.like_users.includes(currentUser?.userName) ? require('../assets/icons/unlike.png') : require('../assets/icons/like.png')}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.likesCountText}>{likesCount} {'likes'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    post: {
        flex: 1
    },
    postCard: {
        flex: 1,
        borderRadius: 0,
        // marginBottom: -10,
        overflow: 'hidden',
        height: Dimensions.get('window').height * 0.35 , // Height set to maintain aspect ratio
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(90, 45, 10, 0.3)', // Semi-transparent overlay for better text readability
    },
    bottomTextContainer: {
        flex: 1,
        marginTop: 0,
        marginBottom : 35,
        padding: 10,
        width: '100%',
        height: '35%',
        overflow: 'hidden',
        backgroundColor: 'rgba(246, 225, 188, 0.3)', // Semi-transparent overlay for better text readability

    },
    dateAndLikeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -10, 
    },
    date: {
        color: '#000',
        fontFamily: 'Oswald-Light',
        fontSize: 14,
        alignItems: 'center',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        backgroundColor: 'transparent',
        padding: 10,  // Adjust padding to change button size
        width: 40,  // Adjust width to make the button larger or smaller
        height: 40,  // Adjust height to make the button larger or smaller
    },
    icon: {
        width: '100%',  // Ensure the icon takes up the full size of the button
        height: '100%',  // Ensure the icon takes up the full size of the button
        resizeMode: 'contain',  // Ensure the icon maintains its aspect ratio
    },
    likesCountText: {
        fontSize: 16,
        fontFamily: 'Oswald-Medium',
        color: '#000',
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
        fontFamily: 'Oswald-Light',
        fontSize: 18,
    },
    content: {
        color: '#000',
        fontFamily: 'Oswald-Medium',
        fontSize: 16,
        marginBottom: 0, // Adds some spacing at the bottom
    },
    contentBig: {
        color: '#000',
        fontFamily: 'Oswald-Medium',
        fontSize: 22,
        marginBottom: 0, // Adds some spacing at the bottom
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: 'black',
    },
});


export default PostComponent;
