import React, { useContext, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

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
        const postsSnapshot = await getDocs(postsCollection);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return postsList
    }

	const AddPost = async (post) => {
        const currentUser = await GetUserName(post.userName.toLowerCase())
		const newPost = {
			id: 3,
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
		GetUserName,
		GetUsers  // Export the new function
	};
};
