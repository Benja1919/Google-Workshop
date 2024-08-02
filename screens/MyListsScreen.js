import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, StyleSheet, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import { firestoreDB } from './FirebaseDB';
import { Timestamp } from 'firebase/firestore';
import { useFonts } from 'expo-font';
import RestaurantFinder from './components/RestaurantFinder';
import { ScrollView } from 'react-native-gesture-handler';
import BottomBarComponent from './components/BottomBar';
const iconData = [
  require('../assets/icons/sushilist.png'),
  require('../assets/icons/drinklist.png'),
  require('../assets/icons/dessertlist.png'),
  require('../assets/icons/italianlist.png')

  // Add more icons as needed
];
images = {
  tri : require("../assets/icons/Tri1.png"),
  editimage :require("../assets/icons/edit2.png"),
};
const TextInputWithImage = ({editable,EndEdit,placeholder,placeholderTextColor,valueTextColor, style, fontWeight, fontSize, ...rest }) => {
  const [value, setValue] = useState('');
  const [placeholdertext, setPlaceholder] = useState(placeholder);
  const Complete = (event) =>{
    const text = event.nativeEvent.text;
    if(text != ''){
      setPlaceholder(text);
      setValue('');
      EndEdit(text);
    }
  };
  return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'left',}}>
          {editable ?
          <Image
            source={images.editimage}
            style={{width:11,height:16,marginRight:3,marginLeft:style.marginLeft}}
            resizeMode='contain'
          />
          : null}
          <TextInput
              placeholderTextColor={placeholderTextColor}
              editable={editable}
              value={value}
              onChangeText={setValue}
              placeholder={placeholdertext}
              onEndEditing={Complete}
              style={[
              style,
              {flex:1},
              { color: valueTextColor },
              fontWeight && { fontWeight },
              fontSize && { fontSize },
              ]}
              {...rest}
          />
          
    </View>
  );
  
};
const col2 = '#f9f9f9';
const RenderList = ({item,EditTitle,EditDescription,index,isYou, RestaurantFinderComplete, navigation}) =>{
  const [isOpen,SetIsOpen] = useState(false);
  const FinderComplete = ({ id, name })=>{
    return RestaurantFinderComplete({index,id,name});
  };
  const EndEditT = (text) =>{
    EditTitle({text: text, index:index});
  };
  const EndEditD = (text) =>{
    EditDescription({text: text, index:index});
  };
  return (
    <View style={{backgroundColor: col2,borderRadius: 15,marginBottom:10}}>
      <View style={{flexDirection: 'row', alignItems: 'center',padding:5,marginLeft:10}}>
      
        <Image source={iconData[item.Image]} style={{ width: 50, height: 50, borderRadius: 20, marginRight: 10 }} />
        <View style={{flexDirection: 'column',justifyContent: 'center', flex:1}}>
          <TextInputWithImage editable={isYou} EndEdit={EndEditT} style={{fontFamily:'Oswald-Medium',fontSize:20}} placeholderTextColor={'black'} valueTextColor={'black'} placeholder={item.listName}/>
          <TextInputWithImage editable={isYou} EndEdit={EndEditD} style={{fontFamily:'Oswald-Light',fontSize:16}} placeholderTextColor={'black'} valueTextColor={'black'} placeholder={item.listDescription}/>
        </View>
        <TouchableOpacity onPress={() => SetIsOpen(!isOpen)}>
          <Image source={images.tri} style={{ width: 20, height: 11,justifyContent: 'center', right:5,transform: [{rotate: isOpen ? '0deg' : '180deg' }]}} />
        </TouchableOpacity>
      </View>
      <ListDetails isE={isOpen} list={item} navigation={navigation} isYou={isYou} RestaurantFinderComplete={FinderComplete}/>
    </View>
  );
};
const ListDetails = ({list,isE,isYou,RestaurantFinderComplete, navigation})=>{
  if(!isE){
    return <View/>
  }
  else{
    return (
      <View style={{marginLeft:30}}>
        <FlatList
          data={list.items}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={{paddingBottom:5}} onPress={()=>navigation.navigate('Restaurant', { restaurantName:null, restaurantID: item.id })}>
              <Text style={{fontFamily:'Oswald-Light',fontSize:18}}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
        {isYou ? <RestaurantFinder Complete={RestaurantFinderComplete} CompleteReset={true} placeholder={"Add Restaurant"} textinputstyle={{fontFamily:'Oswald-Light',fontSize:18}} style={{marginBottom:5}}/> : null}
      </View>
    );
  }
};
const MyListsScreen = ({ route, navigation }) => {
  
  const [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/Oswald-Bold.ttf"),
    "Oswald-Light": require("../assets/fonts/Oswald-Light.ttf"),
    "Oswald-Medium": require("../assets/fonts/Oswald-Medium.ttf")
  })
  const [newItemID, setNewItemID] = useState(null);
  const [newItemName, setNewItemName] = useState(null);
  const { user, profileImageUrl } = route.params;
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => { //fetch the list of user from the DB
    const fetchLists = async () => {
    //  if (!currentUser) return;
      try {
        const fetchedLists = await firestoreDB().GetUserLists(user.userName);
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch lists immediately
    fetchLists();

    const unsubscribe = firestoreDB().SubscribeToLists((fetchedLists) => {
      setLists(fetchedLists);
    }, user.userName);

    return () => unsubscribe();
  }, [currentUser]);
  const ReceiveRestaurantData= ({ index,id, name }) => {
    if(id != null && name != null){
      lists[index].items.push({id:id,name:name});
      firestoreDB().updateListInFirebase(lists[index].id,lists[index].items);
      setNewItemID(id);
      setNewItemName(name);
      
    }
  };
  const EditTitle = ({text, index}) => {
    lists[index].listName = text;
    firestoreDB().updateList(lists[index]);
  };
  const EditDescription = ({text, index}) => {
    lists[index].listDescription = text;
    firestoreDB().updateList(lists[index]);
  };
  const isYou = currentUser != null && currentUser.userName === user.userName;
  return (
    <View style={{justifyContent: 'flex-end',flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center',padding:5}}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.titletext}>
            {isYou ? `Your Lists` : `${user.userName}'s Lists`}
          </Text>
        </View>
      </View>
      <View style={{...styles.separator,marginBottom:10}} />
      <FlatList
        data={lists}
        renderItem={({ item,index }) => <RenderList EditTitle={EditTitle} EditDescription={EditDescription} index={index} item={item} isYou={isYou} RestaurantFinderComplete={ReceiveRestaurantData} navigation={navigation}/>}
        keyExtractor={item => item.id}
      />
      <View style={{flex:1}} />
      <BottomBarComponent navigation={navigation}/>
    </View>
  );
  
};




const styles = StyleSheet.create({
  titletext :{
    fontFamily: 'Oswald-Medium',
    alignSelf: 'center',
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    
  },
  separator: {
    height: 2,
    backgroundColor: '#C0C0C0',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    
  },
  listTitle: {
    fontSize: 20,
    
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: 'Oswald-Medium',

  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Oswald-Medium',

  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    
  },
  categoryButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  iconSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconOption: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default MyListsScreen;

