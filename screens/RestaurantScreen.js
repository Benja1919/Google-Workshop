// Updated RestaurantScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, Linking} from 'react-native';
import PostsScreen from './PostsScreen';
import { firestoreDB } from './FirebaseDB';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import BasicMap ,{GetPlaceDetails, getPhotoUri} from './components/Maps';
import OpeningTimes from './components/OpeningTimeViewer';
import {ParseGoogleOpeningTime} from './components/AddRestaurant';
const col2 = '#fbfbfb';
const AdditionalDetailsComponent = ({restaurant}) =>{
  
  const myMap = new Map(Object.entries(restaurant));
  if(myMap.has('ContentTitles') && restaurant.ContentTitles.length > 0){
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
  const { restaurantName, restaurantID } = route.params;
  useEffect(() => {
    const fetchRestaurant = async () => {
      if(restaurantName != null){
        setRestaurant(await firestoreDB().GetRestaurant(restaurantName));
        setLoading(false);
      }
      else if(restaurantID != null){
        setRestaurant(await firestoreDB().GetRestaurantByID(restaurantID));
        setLoading(false);
        
      }
    };

    fetchRestaurant();
    
  }, [restaurantName, restaurantID]);
  const Details = GetPlaceDetails(restaurant);

  
  if (loading || Details == null) {
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
  const OpeningTime = ParseGoogleOpeningTime(Details.regularOpeningHours.periods);
  const OpenNow = Details.regularOpeningHours.openNow;
  const Website = Details.websiteUri;
  const Phone = Details.nationalPhoneNumber;
  const GoogleReviews = Details.rating;
  const GoogleReviewsCount = Details.userRatingCount;
  const ProfileURI = getPhotoUri(Details.photos[0].name.split('/')[3])._j;
  const Address = Details.formattedAddress;
  TagArray = [];
  for (let index = 0; index < Details.types.length; index++) {
    const element = Details.types[index];
    parts = element.split("_");
    if(parts[1] == 'restaurant'){
      
      tag = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      TagArray.push(tag);
    }
  }
  PhotoURIArray = [];
  for (let index = 1; index < Details.photos.length; index++) {
    PhotoURIArray.push(getPhotoUri(Details.photos[index].name.split('/')[3])._j);
    
  }
  Details.dineIn ? TagArray.push("Dine in") : '';
  Details.takeout ? TagArray.push("Takeout") : '';
  Details.delivery ? TagArray.push("Delivey") : '';
  Details.reservable ? TagArray.push("Reservable") : '';
  Details.servesBreakfast ? TagArray.push("Breakfast") : '';
  Details.servesBrunch ? TagArray.push("Brunch") : '';
  Details.servesLunch ? TagArray.push("Lunch") : '';
  Details.servesDinner ? TagArray.push("Dinner") : '';
  Details.servesCocktails ? TagArray.push("Cocktails") : '';
  Details.servesDessert ? TagArray.push("Dessert") : '';
  Details.servesWine ? TagArray.push("Wine") : '';
  Details.servesBeer ? TagArray.push("Beer") : '';
  Details.servesVegetarianFood ? TagArray.push("Vegetarian food") : '';
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Image source={{ uri: ProfileURI}} style={styles.profileImage} />
      <Text style={styles.sectionTitle}>Photos</Text>
      <View style={{...styles.item,padding: 10}}>
        <FlatList
          data={PhotoURIArray}
          renderItem={({ item, index }) => (
            <View style={{padding:5}}>
              <Image source={{ uri: item }} style={styles.photo} />
            </View>
          )}
          keyExtractor={item => item.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          snapToAlignment="center"
          decelerationRate="fast"
        />
      </View>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={{...styles.item,padding: 10}}> 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}}>
            <Image
              source={require('../assets/icons/LocationIcon.png')}
              style={{...styles.icon,marginRight:3,marginLeft:1}}
              resizeMode="center"
            />
          <Text style={{...styles.details}}>{Address} </Text>
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
      <Text style={styles.sectionTitle}>Opening Times</Text>
          <OpeningTimes restaurant={restaurant} Globaloh={OpeningTime} isGlobalOpen={OpenNow} isEditable ={false}/>
      <Text style={styles.sectionTitle}>Contact</Text>
      <View style={{...styles.item,padding:5}} >
        <TouchableOpacity  onPress={()=>{Linking.openURL(`tel:${Phone}`)}} >
          <Text style={{...styles.details,marginLeft:10,padding:2}}>Phone: {Phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>{Linking.openURL(Website)}} >
          <Text style={{...styles.details,marginLeft:10,padding:2}}>Website: {Website}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Rating</Text>
      <View style={{...styles.item,padding:10}}>
        <Text style={{...styles.details,marginLeft:10}}>CommunEATy: {restaurant.reviewcount > 0 ? restaurant.starcount / restaurant.reviewcount : "No Reviews"} {restaurant.reviewcount > 0 ? `(${restaurant.reviewcount})` : ''}</Text>
        <Text style={{...styles.details,marginLeft:10}}>Google: {GoogleReviewsCount > 0 ? GoogleReviews : "No Reviews"} {GoogleReviewsCount > 0 ? `(${GoogleReviewsCount})` : ''}</Text>
      </View>
      <AdditionalDetailsComponent restaurant={restaurant}/>
      <Text style={styles.sectionTitle}>Tags</Text>
      <FlatList
        data={TagArray}
        renderItem={({ item, index }) => (
            <Text style={{fontSize:16}}>{item}{index === TagArray.length -1 ? '      ' : ', '}</Text>
        )}
        keyExtractor={(tag, index) => index.toString()}
        horizontal
        style={{...styles.item,padding:15}}
      />
      
      <Text style={styles.sectionTitle}>Posts</Text>

      {/* Display posts for the specific restaurant */}
      <PostsScreen navigation={navigation} route={{ params: { filterrestaurantID: restaurantID } }} isScrollEnabled={false}/>
      <Text style={{fontSize:30}}></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  photo: {
    width: 341,
    height: 200,
    borderRadius: 10,
  },
  item: {
    backgroundColor: col2,
    borderRadius: 15,
  },
  icon: {
    width: 13,
    height: 15,
  },
  header: { fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, },
  detailsContainer: { marginTop: 10 },
  detailsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sectionTitle: { fontSize: 25, fontWeight: 'bold', marginBottom: 3 },
  detailsText: { fontSize: 16, marginBottom: 10 },
  details: { fontSize: 16},
});

export default RestaurantScreen;
