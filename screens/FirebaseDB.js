import React from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyABWcyPdbh9dDautY3BjaL4FJQY94-at5E",
    authDomain: "workshop-23878.firebaseapp.com",
    projectId: "workshop-23878",
    storageBucket: "workshop-23878.appspot.com",
    messagingSenderId: "995336065754",
    appId: "1:995336065754:web:5da21b999a1502a8668be3",
    measurementId: "G-KL9HH4BFXT"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const firestoreDB = () => {
    const GetPosts = async () => {
        const postsCollection = collection(firestore, 'posts');
        const q = query(postsCollection, orderBy("__name__", "desc"));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return postsList;
    };

    const AddPost = async (post) => {
        const currentUser = await GetUserName(post.userName.toLowerCase());
        const newPost = {
            userName: post.userName,
            restaurantName: post.restaurantName,
            stars: post.stars,
            content: post.content,
            mediaUrls: post.mediaUrls || [],
            mediaTypes: post.mediaTypes || [],
            profileImageUrl: currentUser.profileImageUrl,
        };
        const postsCollectionRef = collection(firestore, 'posts');
        const docRef = await addDoc(postsCollectionRef, newPost);
        const restaurant = await GetRestaurant(post.restaurantName);
        restaurant.starcount += post.stars;
        restaurant.reviewcount += 1;
    };

    const CreateList = async (list) => {
        const currentUser = await GetUserName(list.userName.toLowerCase());
        const usersListsCollectionRef = collection(firestore, 'users', list.userName, 'lists');
        await addDoc(usersListsCollectionRef, list);
    };

	const TryLoginUser = async (userName, password) => {
		const userDoc = doc(firestore, 'users', userName);
        const userSnapshot = await getDoc(userDoc);
        const user = { id: userSnapshot.id, ...userSnapshot.data() }
		if (user && user.password === password) {
			return user;
		} else {
			return null;
		}
	};

    const GetUserLists = async (userName) => {
        const listsCollection = collection(firestore, 'users', userName, 'lists');
        const querySnapshot = await getDocs(listsCollection);
        const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return lists;
    };

    const GetUserName = async (userName) => {
        const userDocRef = doc(firestore, 'users', userName);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() ? userDoc.data() : null;
    };

    const GetRestaurant = async (restaurantName) => {
        const restaurantDocRef = doc(firestore, 'restaurants', restaurantName);
        const restaurantDoc = await getDoc(restaurantDocRef);
        return restaurantDoc.exists() ? restaurantDoc.data() : null;
    };

	const GetRestaurantbyOwner = async (user) => {
        const restaurantDoc = doc(firestore, 'restaurants', user.RestaurantID);
        const restaurantSnapshot = await getDoc(restaurantDoc);
        return { id: restaurantSnapshot.id, ...restaurantSnapshot.data() };
	};

	const UpdateRestaurantContent = async (Restaurant) => {
		//Alert.alert(RestaurantUser);
		const userRef = doc(firestore, "restaurants", Restaurant.id);

		// Create the new contents object
		const updatedData = {
			ContentTitles: Restaurant.ContentTitles,
			ContentData: Restaurant.ContentData,
			description: Restaurant.description,
			Address: Restaurant.Address,
			Coordinates: Restaurant.Coordinates,
		};
		try {
		    await setDoc(userRef, updatedData, { merge: true });
		} catch (error) {
			
		}
	};

	const GetUsers = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		return users;
	};

    return {
        GetPosts,
        AddPost,
        CreateList,
		TryLoginUser,
        GetUserLists,
        GetUserName,
        GetRestaurant,
		UpdateRestaurantContent,
		GetRestaurantbyOwner,
		GetUsers 
    };
};

export const uploadImageToStorage = async (uri, fileName) => {
    const storageRef = ref(storage, 'images/' + fileName);
    const response = await fetch(uri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};
