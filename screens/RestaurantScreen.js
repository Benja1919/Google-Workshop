// Updated RestaurantScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, } from 'react-native';
import PostsScreen from './PostsScreen';
import { firestoreDB } from './FirebaseDB';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import BasicMap from './components/Maps';
import OpeningTimes from './components/OpeningTimeViewer';
const col2 = '#fbfbfb';
const AdditionalDetailsComponent = ({restaurant}) =>{
  if(restaurant.ContentTitles.length > 0){
    const renderItem = ({ item }) => (
      <View>
        <Text style={{...styles.detailsHeader,marginLeft:10}}>{restaurant.ContentTitles[item]}</Text>
        <Text style={{...styles.detailsText,marginLeft:20}}>{restaurant.ContentData[item]}</Text>
        
      </View>
    );
    let arr = [];
    for (let i = 0; i < restaurant.ContentData.length; i++) {
        arr.push(i);
    }
    return (
    <View>
      <Text style={styles.sectionTitle}>Addional Details</Text>
      <View style={styles.item}>
        <FlatList
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false} // Disable FlatList's own scrolling
          contentContainerStyle={styles.flatList}
        />
      </View>
    </View>
    );
  }
  else{
    return <View/>
  }
};
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

  

  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Image source={{ uri: restaurant.ProfileImageURI}} style={styles.profileImage} />
      <Text style={styles.description}>{restaurant.description}</Text>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={{...styles.item,padding: 10}}> 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}}>
            <Image
              source={require('../assets/icons/LocationIcon.png')}
              style={{...styles.icon,marginRight:3,marginLeft:1}}
              resizeMode="center"
            />
          <Text style={{...styles.details}}>{restaurant.Address} </Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}} onPress={() =>setLocationMap(!isLocationMapEnbaled)}>
          <View style={{flexDirection: 'row',flex: 1,alignItems: 'center'}}>
            <Image
                source={require('../assets/icons/mapicon2.png')}
                style={{...styles.icon,marginRight:3,marginLeft:1}}
                resizeMode="center"
            />
            <Text style={{...styles.details}}>N {restaurant.Coordinates.latitude}, W {restaurant.Coordinates.longitude}</Text>
          </View>
            <Image source={images.tri}
              style={{...styles.icon,alignSelf: 'flex-end',transform: [{rotate: isLocationMapEnbaled ? '0deg' : '180deg' }]}}
              resizeMode="center"/>
        </TouchableOpacity>
        <BasicMap isEnabled={isLocationMapEnbaled} initialMarkerCoords={restaurant.Coordinates}/>
      </View>
      <Text style={styles.sectionTitle}>Opening Times </Text>
                      <OpeningTimes restaurant={restaurant} isEditable ={false}/>
      <Text style={styles.sectionTitle}>Rating</Text>
      <View style={styles.item}>
        <Text style={{...styles.detailsHeader,marginLeft:10}}>Average Rating:</Text>
        <Text style={{...styles.detailsText,marginLeft:20}}>{restaurant.reviewcount > 0 ? restaurant.starcount / restaurant.reviewcount : "No Reviews"} {restaurant.reviewcount > 0 ? `(${restaurant.reviewcount})` : ''}</Text>
      </View>
      <AdditionalDetailsComponent restaurant={restaurant}/>
      
      <Text style={styles.sectionTitle}>Posts</Text>

      {/* Display posts for the specific restaurant */}
      <PostsScreen navigation={navigation} route={{ params: { filterrestaurantName: restaurantName } }} isScrollEnabled={false}/>
    </ScrollView>
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
  item: {
    backgroundColor: col2,
    borderRadius: 15,
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
