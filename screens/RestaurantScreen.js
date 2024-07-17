// Updated RestaurantScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import PostsScreen from './PostsScreen';
import { firestoreDB } from './FirebaseDB';
import { FlatList } from 'react-native-gesture-handler';
import BasicMap from './components/Maps';
const RestaurantScreen = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocationMapEnbaled, setLocationMap] = useState(false);
  const { restaurantName } = route.params;
  useEffect(() => {
    const fetchRestaurant = async () => {
      setRestaurant(await firestoreDB().GetRestaurant(restaurantName));
      setLoading(false);
    };

    fetchRestaurant();
  }, [restaurantName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>LOADING</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Restaurant not found</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.detailsHeader}>{restaurant.ContentTitles[item]}</Text>
      <Text style={styles.detailsText}>{restaurant.ContentData[item]}</Text>
    </View>
  );

  let arr = [];
  for (let i = 0; i < restaurant.ContentData.length; i++) {
      arr.push(i);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Image source={{ uri: restaurant.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.description}>{restaurant.description}</Text>
      <View> 
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}}>
            <Image
              source={require('../assets/icons/LocationIcon.png')}
              style={{...styles.icon,marginRight:3,marginLeft:5}}
              resizeMode="center"
            />
          <Text style={{...styles.details}}>{restaurant.Address} </Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}} onPress={() =>setLocationMap(!isLocationMapEnbaled)}>
            <Image
                source={require('../assets/icons/mapicon2.png')}
                style={{...styles.icon,marginRight:3,marginLeft:5}}
                resizeMode="center"
            />
            <Text style={styles.details}>N {restaurant.Coordinates.latitude}, W {restaurant.Coordinates.longitude}</Text>
        </TouchableOpacity>
        <BasicMap isEnabled={isLocationMapEnbaled} initialMarkerCoords={restaurant.Coordinates}/>
    </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Addional Details</Text>
        <FlatList
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.detailsHeader}>Average Rating:</Text>
        <Text style={styles.detailsText}>{restaurant.reviewcount > 0 ? restaurant.starcount / restaurant.reviewcount : "No Reviews"} {restaurant.reviewcount > 0 ? `(${restaurant.reviewcount})` : ''}</Text>

      </View>

      {/* Display posts for the specific restaurant */}
      <PostsScreen navigation={navigation} route={{ params: { filterrestaurantName: restaurantName } }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  icon: {
    width: 13,
    height: 15,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 5 },
  detailsContainer: { marginTop: 10 },
  detailsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sectionTitle: { fontSize: 25, fontWeight: 'bold', marginBottom: 3 },
  detailsText: { fontSize: 16, marginBottom: 10 },
  details: { fontSize: 16},
});

export default RestaurantScreen;
