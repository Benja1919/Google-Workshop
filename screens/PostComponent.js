import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { firestoreDB } from './FirebaseDB';

const PostComponent = ({ post, navigateToProfile, navigateToRestaurant }) => {
    const [paused, setPaused] = useState(false);
    const [videoError, setVideoError] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [activeIndex, setActiveIndex] = useState(0); // Track active dot index
    const [liked, setLiked] = useState(false);
    const [setLikesCount] = useState(post.likes ? post.likes.length : 0);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const user = await firestoreDB().GetUserName(post.userName.toLowerCase());
                if (user && user.profileImageUrl && user.profileImageUrl !== '') {
                    setProfileImageUrl(user.profileImageUrl);
                } else {
                    setProfileImageUrl(''); // Empty URL if no image
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
                setProfileImageUrl(''); // Empty URL if error
            }
        };

        fetchProfileImage();
    }, [post.userName]);

    const mediaItems = Array.isArray(post.mediaUrls)
        ? post.mediaUrls.map((url, index) => ({
            url,
            type: post.mediaTypes ? post.mediaTypes[index] : url.endsWith('.mp4') ? 'video' : url.endsWith('.gif') ? 'gif' : 'image'
        }))
        : [{ url: post.imageUrl, type: 'image' }];

    const renderItem = ({ item }) => {
        if (item.type === 'video') {
            return (
                <Video
                    source={{ uri: item.url }}
                    style={styles.media}
                    resizeMode="cover"
                    controls={true}
                    paused={paused}
                    onLoad={() => setPaused(false)}
                    onBuffer={({ isBuffering }) => setPaused(isBuffering)}
                    onError={(error) => {
                        console.log('Video Error:', error);
                        setVideoError('Unable to play video');
                    }}
                />
            );
        } else {
            return <Image source={{ uri: item.url }} style={styles.media} />;
        }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    };

    const PaginationDots = ({ index, length }) => {
        return (
            <View style={styles.paginationContainer}>
                {Array.from({ length }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.paginationDot,
                            { opacity: index === i ? 1 : 0.5 },
                        ]}
                    />
                ))}
            </View>
        );
    };

    const postDate = new Date(post.creationTime.seconds * 1000);
    const toggleLike = async () => {
        if (!liked) {
            try {
                const updatedPost = await firestoreDB().LikePost(post.id, currentUser.userName);
                setLiked(true);
            } catch (error) {
                console.error('Error liking post:', error);
            }
        } else {
            try {
                const updatedPost = await firestoreDB().UnlikePost(post.id, currentUser.userName);
                setLiked(false);
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        }
    };

    return (
        <View style={styles.postCard}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.userContainer} onPress={() => navigateToProfile(post.userName)}>
                    <Image source={{ uri: profileImageUrl || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA5QMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIDB//EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD2GNJFAMWKCRRcAhi4sgM4uNYYDOLi4AmGNAM4Y0AzhjWJgJiNYYDKY1hQZRpAQVAGa1UBijVigi4YoBBrAFFABQAUEFARQBBQBFAQUBkUoIilBlGkBkVAEUAWJFgDRFgCgAoAAAAAAAAQAWoAAAACCoCI0gMUaqUGcFQCXVSNQFXEaAVFAAAAAAAAAAAC0AAAAABAAAZqY1UoMgAkajMaBYsCAqooAAAAAAAAAAAAAAAACKAgAIy0lBkACLGY1AWLEigqoAoAAAAAAAAAAAAAAAAAIACVBKCYACRqMNaDSs6oNCKCiAKAAAAAAAAAAAACAAAgJoCUTQBAGY0wsBvV1klB0GVBoQBRFAVAFEAUQBRAFEAATQAQBKagCFSgtRAGVjMqg1KuxhYDcrWuetQGxmVdBoZ00GlZAaGVBRAFETQaRNAVE1NBqolrNoNWs7U0AqABogDEaAFABTVANWUAXQAXTQBZQAAAEAAAESgCaACJqgIUAQAH/9k='}} style={styles.userImage} />
                    <Text style={styles.userName}>{post.userName}</Text>
                </TouchableOpacity>
                <Text style={styles.stars}>{'⭐'.repeat(post.stars)}</Text>
                <Text>{postDate.toLocaleDateString() + "\n" + postDate.toLocaleTimeString()}</Text>
            </View>
            <TouchableOpacity onPress={() => navigateToRestaurant(post.restaurantName)}>
                <Text style={styles.restaurantName}>{post.restaurantName}</Text>
            </TouchableOpacity>
            <FlatList
                data={mediaItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            {mediaItems.length > 1 && (
                <PaginationDots index={activeIndex} length={mediaItems.length} />
            )}
            {videoError && <Text style={styles.errorText}>{videoError}</Text>}
            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.likeContainer}>
            <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
                    <Image
                        source={liked ? require('../assets/icons/unlike.png') : require('../assets/icons/like.png')}
                        style={styles.icon}
                    />
                    </TouchableOpacity>
                <Text style ={styles.likesCountText}>{post.likes} {'likes'}</Text>
            </View>
        </View>
    );
};

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
    },
    icon: {
      width: 25,
      height: 20,
    },
    media: {
        width: Dimensions.get('window').width - 30,
        height: Dimensions.get('window').width - 30,
        borderRadius: 8,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    likesCountText: {
      fontSize: 16,
      
    },
    likeButton: {
        backgroundColor: 'transparent',
        padding: 5,
        marginRight: 10,
    },
    likeText: {
        fontWeight: 'bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1e90ff',
        marginHorizontal: 5,
    },
});

export default PostComponent;
