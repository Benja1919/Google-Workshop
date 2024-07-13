import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Carousel from 'react-native-reanimated-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const PostComponent = ({ post, navigateToProfile, navigateToRestaurant }) => {
    const [paused, setPaused] = useState(false);
    const [videoError, setVideoError] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const mediaItems = Array.isArray(post.mediaUrls)
        ? post.mediaUrls.map((url, index) => ({
            url: url.startsWith('file://') ? url : `file://${url}`,
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

    return (
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
            {mediaItems.length > 1 ? (
                <>
                    <Carousel
                        data={mediaItems}
                        renderItem={renderItem}
                        width={viewportWidth}
                        height={200}
                        onSnapToItem={(index) => setActiveSlide(index)}
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
                renderItem({ item: mediaItems[0] })
            )}
            {videoError && <Text style={styles.errorText}>{videoError}</Text>}
            <Text style={styles.content}>{post.content}</Text>
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
        color: '#ffd700',
    },
    media: {
        width: viewportWidth,
        height: 200,
        borderRadius: 8,
    },
    content: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        marginHorizontal: 4,
    },
});

export default PostComponent;
