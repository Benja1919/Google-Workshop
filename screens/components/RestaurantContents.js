import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList, TextInput, ImageBackground, Image } from 'react-native';
import { firestoreDB, DeleteImageByURI } from '../FirebaseDB';
import { throttle } from 'lodash';
import BasicMap, {useCoordToAddress, useAddressToCoord} from './Maps';
import ImprovedImageComponent from './ImprovedImage';
import * as ImagePicker from 'expo-image-picker';
import OpeningTimes from './OpeningTimeViewer';
import { getStorage, ref, getDownloadURLm, uploadBytes,getDownloadURL  } from 'firebase/storage';
const col2 = '#fbfbfb';
const CustomTextInput = ({hasdelete, deleteButtonFunction,idx, placeholderTextColor,imageicon, valueTextColor, style, fontWeight, fontSize, ...rest }) => {
    const DeleteButton = () =>{
        if(!hasdelete){
            return <View/>
        }
        else{
            return (<TouchableOpacity style={styles.MinusCustomButton} onPress={() => deleteButtonFunction(idx)}>
                        <Text style={styles.MinusCustomText}> 
                            -
                        </Text>
                    </TouchableOpacity>);
        }
    };
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',}}>
            <Image
            source={imageicon}
            style={{...styles.icon,marginRight:3,marginLeft:style.marginLeft}}
            resizeMode="center"
            />
            <TextInput
                placeholderTextColor={placeholderTextColor}
                style={[
                style,
                {flex:1},
                { color: valueTextColor },
                fontWeight && { fontWeight },
                fontSize && { fontSize },
                ]}
                {...rest}
            />
            <DeleteButton/>
      </View>
    );
    
  };
//let ContentTitles = [];
//let ContentData = [];
let CurrentRestaurantUser;
let CurrentRestaurant = '';
const setKey = (item,text) =>{
    CurrentRestaurant.ContentTitles[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}
const setValue = (item,text) =>{
    CurrentRestaurant.ContentData[item] = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}
const setDescription = (text) =>{
    CurrentRestaurant.description = text;
    firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
}


images = {
    editimage :require("../../assets/icons/edittransparent.png"),
    mapimage : require("../../assets/icons/mapicon2.png"),
    locationimage : require("../../assets/icons/LocationIcon.png"),
    tri : require("../../assets/icons/Tri1.png"),
};

const RestaurantContentComponent = ({ RestaurantUser }) => {
    if(RestaurantUser != null){
        const [CurrentRestaurantLocal, setRestaurant] = React.useState('');
        const [, forceUpdate] = useState();
        const [Coordinate, SetCoordinate] = useState({"latitude":null, "longitude":null})
        const [AddressText, setAddressText] = useState('');
        const [isLocationMapEnbaled, setLocationMap] = useState(false);

        
        CurrentRestaurantUser = RestaurantUser;

        const pickImage = () => pickMedia(ImagePicker.MediaTypeOptions.Images, 'image');

        const loadRestaurant = useCallback(
            throttle(async () => {
                const res = await firestoreDB().GetRestaurantbyOwner(RestaurantUser);
                setRestaurant(res);
            }, 2000),
            [RestaurantUser] // Add dependencies to useCallback
        );
        const storage = getStorage();
        const [profileURI, setProfileUri] = useState('');
        const pickMedia = async (mediaTypes, type) => {
            try {
              // בקשת רשות גישה לספריית התמונות
              const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!result.granted) {
                Alert.alert('Error', 'Permission to access gallery is required');
                return;
              }
          
              // בחירת תמונה או מדיה אחרת
              const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
          
              // אם המשתמש לא ביטל את הבחירה
              if (!pickerResult.canceled) {
                const uri = pickerResult.assets[0].uri;
                const filename = uri.substring(uri.lastIndexOf('/') + 1);
          
                // יצירת התייחסות ל-Firebase Storage
                const storageRef = ref(storage, `images/${filename}`);
          
                // הורדת התמונה כ-blob
                const response = await fetch(uri);
                const blob = await response.blob();
          
                // העלאת התמונה ל-Firebase Storage
                await uploadBytes(storageRef, blob);
          
                // קבלת כתובת ה-URL להורדת התמונה
                const downloadURL = await getDownloadURL(storageRef);
                
                // הוספת ה-URI והסוג של המדיה
                setProfileUri(downloadURL);
              } else {
                
              }
            } catch (error) {
              Alert.alert('Error', `An error occurred: ${error.message}`);
            }
        };
        if(profileURI != ''){
            DeleteImageByURI(CurrentRestaurant.ProfileImageURI);
            CurrentRestaurant.ProfileImageURI = profileURI;
            firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
            setProfileUri('');
        }
        React.useEffect(() => {
            loadRestaurant();
        }, [loadRestaurant]);
        const HandlePlusPress = () =>{
            CurrentRestaurantLocal.ContentTitles.push("Example title");
            CurrentRestaurantLocal.ContentData.push("Example information");
            firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
            forceUpdate(Math.random());
        };
        const HandleMinusPress = (idx) =>{
            CurrentRestaurantLocal.ContentTitles.splice(idx, 1);
            CurrentRestaurantLocal.ContentData.splice(idx, 1);
            firestoreDB().UpdateRestaurantContent(CurrentRestaurant);
            forceUpdate(Math.random());
        };
        const handleEndEditing = (event) => {
            setAddressText(event.nativeEvent.text);
        };
        Coords = useAddressToCoord(AddressText);
        newAddress = useCoordToAddress(Coords.latitude,Coords.longitude)
        CoordinateAddress = useCoordToAddress(Coordinate);
        if(newAddress != '' && newAddress != null && Coords.latitude != null && newAddress != CurrentRestaurantLocal.Address){
            CurrentRestaurantLocal.Coordinates = Coords;
            CurrentRestaurantLocal.Address = newAddress;
            firestoreDB().UpdateRestaurantContent(CurrentRestaurantLocal);
        }
        else if(CoordinateAddress != null && Coordinate.longitude != null){
            SetCoordinate({"latitude":null, "longitude":null});
            CurrentRestaurantLocal.Coordinates = Coordinate;
            CurrentRestaurantLocal.Address = CoordinateAddress;
            setAddressText(CoordinateAddress);
            firestoreDB().UpdateRestaurantContent(CurrentRestaurantLocal);
        }

        const renderItem = ({ item }) => (
            <View style={styles.item1}>
                <CustomTextInput
                    placeholder={CurrentRestaurant.ContentTitles[item]}
                    placeholderTextColor="black"
                    valueTextColor="black"
                    hasdelete={true}
                    idx={item}
                    imageicon={images.editimage}
                    deleteButtonFunction = {() => HandleMinusPress(item)}
                    onChangeText={text => setKey(item,text)}
                    style={{ fontSize: 20, fontWeight: 'bold'}}
                />
                <CustomTextInput
                    placeholder={CurrentRestaurant.ContentData[item]}
                    placeholderTextColor="black"
                    valueTextColor="black"
                    imageicon={images.editimage}
                    hasdelete={false}
                    onChangeText={text => setValue(item,text)}
                    style={{ fontSize: 16, fontWeight: 'regular',marginLeft:3}}
                />
        
            </View>
        );
        const GetMapCoordinate = (event) =>{
            const { coordinate } = event.nativeEvent;
            SetCoordinate(coordinate);
            forceUpdate(Math.random());
        };
        //<TextInput style={styles.input} placeholder={CurrentRestaurantLocal.description} onChangeText={setDescription}/>
        if(CurrentRestaurantLocal != '' ){
            CurrentRestaurant = CurrentRestaurantLocal;
            let arr = [];
            for (let i = 0; i < CurrentRestaurantLocal.ContentData.length; i++) {
                arr.push(i);
            }
            return (
                <View >
                    <Text style={styles.SectionTitle}>Profile Image</Text>
                    <TouchableOpacity style={{justifyContent: 'center', position: 'relative'}} onPress={pickImage}>
                        <ImprovedImageComponent ImageURI={CurrentRestaurantLocal.ProfileImageURI } ImageStyle={{...styles.profileImage}} />
                        <Image 
                            source={images.editimage}  
                            style={{
                                ...styles.iconBeeg,
                                position: 'absolute',
                                left: styles.profileImage.width-10, // Adjust as needed
                                bottom: 10, // Adjust as needed
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.SectionTitle}>Description</Text>
                    <View style={{...styles.item,padding: 5}}> 
                        <CustomTextInput
                            placeholder={CurrentRestaurantLocal.description}
                            placeholderTextColor="black"
                            valueTextColor="black"
                            imageicon={images.editimage}
                            hasdelete={false}
                            onChangeText={text => setDescription(text)}
                            style={{ fontSize: 16, fontWeight: 'regular',marginLeft:3}}
                        />
                    </View>
                    <Text style={styles.SectionTitle}>Opening Times </Text>
                    <OpeningTimes restaurant={CurrentRestaurantLocal} isEditable ={true}/>
                    <Text style={styles.SectionTitle}>Location </Text>
                    <View style={{...styles.item,padding: 5}}> 
                        <CustomTextInput
                            placeholder={CurrentRestaurantLocal.Address}
                            placeholderTextColor="black"
                            valueTextColor="black"
                            imageicon={images.locationimage}
                            hasdelete={false}
                            onEndEditing={handleEndEditing}
                            style={{ fontSize: 16, fontWeight: 'regular',marginLeft:3}}
                        />
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',marginBottom:4,marginLeft:3}} onPress={() =>setLocationMap(!isLocationMapEnbaled)}>
                            <View style={{flexDirection: 'row',flex: 1,alignItems: 'center'}}>
                                <Image
                                    source={images.mapimage}
                                    style={{...styles.icon,marginRight:6}}
                                    resizeMode="center"
                                />
                                <Text style={{fontWeight:16}}>N {CurrentRestaurantLocal.Coordinates.latitude}, W {CurrentRestaurantLocal.Coordinates.longitude}</Text>
                            </View>
                            <Image source={images.tri}
                                style={{...styles.icon,alignSelf: 'flex-end',transform: [{rotate: isLocationMapEnbaled ? '0deg' : '180deg' }]}}
                                resizeMode="center"/>
                        </TouchableOpacity>
                        <BasicMap isEnabled={isLocationMapEnbaled} initialMarkerCoords={CurrentRestaurantLocal.Coordinates} mapclickfunction={GetMapCoordinate}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',padding:10}}>
                        <Text style={styles.SectionTitle}>Addional Information</Text>
                        <TouchableOpacity style={styles.AddCustomButton} onPress={HandlePlusPress}>
                            <Text style={styles.AddCustomText}> 
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList style={styles.item}
                    data={arr}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false} // Disable FlatList's own scrolling
                    contentContainerStyle={styles.flatList}
                    />
                    
                </View>
            );
        }
    }
};
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        backgroundColor: col2,
        borderRadius: 15,
    },
    item1: {
        padding: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    AddCustomButton: {
        position: 'absolute',

        right: 0,
        backgroundColor: '#0056b4',
        paddingVertical: 0,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    AddCustomText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    MinusCustomButton: {
        position: 'absolute',

        right: 0,
        backgroundColor: '#0056b4',
        paddingVertical: 0,
        paddingHorizontal: 8,
        borderRadius: 30,
    },
    MinusCustomText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    input2: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        marginBottom: 5,
        fontsize: 11,
    },
    content: {
        fontSize: 20,
    },
    SectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    icon: {
        width: 13,
        height: 15,
        
    },
    iconBeeg: {
        width: 20,
        height: 23,
        
    },
  });
export default RestaurantContentComponent;