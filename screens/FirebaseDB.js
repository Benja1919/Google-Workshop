import React, { useContext, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { AuthContext } from './AuthContext';
import { Alert } from 'react-native';

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

export const firestoreDB = () => {
	const GetPosts = async () => {
        const postsCollection = collection(firestore, 'posts');
		const q = query(postsCollection, orderBy("__name__", "desc"));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return postsList
    }

	const AddPost = async (post) => {
        const currentUser = await GetUserName(post.userName.toLowerCase())
		const newPost = {
			userName: post.userName,
			restaurantName: post.restaurantName,
			stars: post.stars,
			content: post.content,
			mediaUrls: post.mediaUrls || [], // Assuming post.mediaUrls is an array of URLs
			mediaTypes: post.mediaTypes || [], // Assuming post.mediaTypes is an array of types (optional)
			profileImageUrl: currentUser.profileImageUrl,
		};
        const postsCollectionRef = collection(firestore, 'posts');
        const docRef = await addDoc(postsCollectionRef, newPost);
		GetRestaurant(post.restaurantName).starcount += post.stars;
		GetRestaurant(post.restaurantName).reviewcount += 1;
	};

	const CreateList = async (list) => {
        const currentUser = await GetUserName(list.userName.toLowerCase())
		// const newList = {	
		// 	userName: list.userName,
		// 	listName: list.ListtName,
		// 	listDescription : list.listDescription,
		// 	rank: list.rank,
		// 	restCount: list.restCount,
		// 	savedCount : list.savedCount,
		// 	// content: list.content,
		// 	listPic: list.listPic || [], // Assuming post.mediaUrls is an array of URLs
		// 	// mediaTypes: list.mediaTypes || [], // Assuming post.mediaTypes is an array of types (optional)
		// 	profileImageUrl: currentUser.profileImageUrl,
		// };
        const usersListsCollectionRef = collection(firestore, 'usersLists');
        const docRef = await addDoc(usersListsCollectionRef, list);
	};

	const GetUserLists = async (userName) => {
		const q = query(collection(firestore, 'usersLists'), where('userName', '==', userName));
		const querySnapshot = await getDocs(q);
		const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		return lists;
	  };

	const addItemToList = async (list, restaurant) => {
			////// you need to find a way to recognise the spesific List you are working at, and add a restaurand deteils to it
			////// pay attention! you must consider the way you Get the list, and how you show ut to the user.
			////// having a page dedicate to list sounds like the best solution
	};
	const UpdateRestaurantContent = async (Restaurant) => {
		//Alert.alert(RestaurantUser);
		const userRef = doc(firestore, "restaurants", Restaurant.id);

		// Create the new contents object
		const updatedData = {
			ContentTitles: Restaurant.ContentTitles,
			ContentData: Restaurant.ContentData,
			description: Restaurant.description
			
		};
		try {
		    await setDoc(userRef, updatedData, { merge: true });
		} catch (error) {
			
		}
	};
	const GetRestaurantbyOwner = async (user) => {
        const restaurantDoc = doc(firestore, 'restaurants', user.RestaurantID);
        const restaurantSnapshot = await getDoc(restaurantDoc);
        return { id: restaurantSnapshot.id, ...restaurantSnapshot.data() };
	};

	const GetRestaurant = async (restaurantName) => {
        const restaurantDoc = doc(firestore, 'restaurants', restaurantName);
        const restaurantSnapshot = await getDoc(restaurantDoc);
        return { id: restaurantSnapshot.id, ...restaurantSnapshot.data() };
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

    const GetUserName = async (userName) => {
		const userDoc = doc(firestore, 'users', userName);
        const userSnapshot = await getDoc(userDoc);
        const user = { id: userSnapshot.id, ...userSnapshot.data() }
		return user;
	};

	// Add this function to get all users
	const GetUsers = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		return users;
	};

	return {
		GetPosts,
		AddPost,
		GetRestaurant,
		TryLoginUser,
		UpdateRestaurantContent,
		GetUserName,
		GetUsers,  // Export the new function
		GetRestaurantbyOwner
	};
};
