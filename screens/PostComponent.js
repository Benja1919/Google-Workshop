import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Video from 'react-native-video';

const PostComponent = ({ post, navigateToProfile, navigateToRestaurant }) => {
    const [paused, setPaused] = useState(false);
    const [videoError, setVideoError] = useState(null);

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
            <FlatList
                data={mediaItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
            />
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
        width: Dimensions.get('window').width - 30, // Reduce width to accommodate padding
        height: 200,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 10,
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
});

export default PostComponent;
