import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, onSnapshot, getDocs, doc, getDoc, deleteDoc, addDoc, updateDoc, setDoc, query, where, orderBy,limit, FieldValue } from 'firebase/firestore';

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
        const q = query(postsCollection, orderBy("creationTime", "desc"));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return postsList;
    };

    const LikePost = async (postId, currentUserId) => {
        const postRef = doc(firestore, 'posts', postId);
        try {
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) {
                throw new Error('Post not found');
            }

            const postData = postDoc.data();
            const likesCount = postData.likes ?? 0; // Use nullish coalescing to ensure default value
            const like_users = postData.like_users ?? []; // Ensure default to empty array
            if (!like_users.includes(currentUserId)) {
                await updateDoc(postRef, {
                    likes: likesCount + 1, // Increment the like count
                    like_users: [currentUserId, ...like_users], // Add user ID to array
                });
            }

            return await getDoc(postRef); // Return the updated post
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    };
	const FetchRestaurants = async () =>{
		try {
			const q = query(collection(firestore, 'restaurants'), limit(100));
			const querySnapshot = await getDocs(q);
			const restaurantsData = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
			}));
			return restaurantsData;
			}
		catch (error){
			console.error('Error fetching restaurants: ', error);
		}
	};
    const DeleteListsbyID = async (id) => {
        const docRef = doc(firestore, 'usersLists', id); // Replace 'collectionName' with your Firestore collection name
        await deleteDoc(docRef); //cant find it//
    };
    const UnlikePost = async (postId, currentUserId) => {
        const postRef = doc(firestore, 'posts', postId);
        try {
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) {
                throw new Error('Post not found');
            }

            const postData = postDoc.data();
            const likesCount = postData.likes ?? 0; // Use nullish coalescing to ensure default value
            const like_users = postData.like_users ?? []; // Ensure default to empty array
            if (like_users.includes(currentUserId)) {
                await updateDoc(postRef, {
                    likes: likesCount - 1, // Decrement the like count
                    like_users: like_users.filter(id => id !== currentUserId), // Remove user ID from array
                });
            }

            return await getDoc(postRef); // Return the updated post
        } catch (error) {
            console.error('Error unliking post:', error);
            throw error;
        }
    };

    const SubscribeToPosts = (callback) => {
        const postsCollection = collection(firestore, 'posts');
        const q = query(postsCollection, orderBy("creationTime", "desc"));

        return onSnapshot(q, (snapshot) => {
            const postsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(postsList);
        }, (error) => {
            console.error('Error fetching real-time posts:', error);
        });
    };

    const AddPost = async (post) => {
        const currentUser = await GetUserName(post.userName.toLowerCase());
        const newPost = {
            userName: post.userName,
            restaurantName: post.restaurantName,
            RestaurantID : post.RestaurantID,
            stars: post.stars,
            userprofile: post.userprofile,
            likes: 0,
            like_users: [],
            content: post.content,
            mediaUrls: post.mediaUrls || [], // Assuming post.mediaUrls is an array of URLs
            mediaTypes: post.mediaTypes || [], // Assuming post.mediaTypes is an array of types (optional)
            profileImageUrl: currentUser.profileImageUrl,
            creationTime: new Date()
        };
        const postsCollectionRef = collection(firestore, 'posts');
        const docRef = await addDoc(postsCollectionRef, newPost);
        let postDoc = await getDoc(docRef);
        while (!postDoc.exists || !postDoc.data().creationTime) {
            // Small delay before checking again
            await new Promise(resolve => setTimeout(resolve, 100));
            postDoc = await getDoc(postRef);
        }
        const restaurant = await GetRestaurantByID(post.RestaurantID);
        const restaurantDoc = doc(firestore, 'restaurants', post.RestaurantID);
        updateddata = {
            starcount : restaurant.starcount+ post.stars,
            reviewcount : restaurant.reviewcount+ 1,
        };
        await setDoc(restaurantDoc, updateddata, { merge: true });
    };
    const AddRestaurant =async (Restaurant) =>{
        const collectionRef = await collection(firestore, 'restaurants');
        const docRef = await addDoc(collectionRef, Restaurant);
        return docRef.id;
    };
    const FetchRestaurantByGID = async (somegid) => {

        try {
            const q = query(collection(firestore, 'restaurants'), where("GoogleMapsID","==",somegid));
			const restaurantSnapshot = await getDocs(q);
        
            if (!restaurantSnapshot.empty) {
                const restaurantDoc = restaurantSnapshot.docs[0];
                return {id:restaurantDoc.id,...restaurantDoc.data()};
            } else {
                return '';
            }
        } catch (error) {
            console.error("Error fetching restaurant: ", error);
            return '';
        }
    };
	const CreateList = async (list) => {
		await addDoc(collection(firestore, 'usersLists'),list);
	};
    const FetchListsbyName = async (name) => {
        const q = query(
            collection(firestore, 'usersLists'),
            where("listName", ">=", name),
            where("listName", "<=", name + '\uf8ff') // Unicode character to match the end of the range
          );
        const ss = await getDocs(q);
        
        if (!ss.empty) {
            const results = ss.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return results;
        }
        return []
    };
    const FetchUsersbyName = async (name) => {
        const q = query(
            collection(firestore, 'users'),
            where("profilename", ">=", name),
            where("profilename", "<=", name + '\uf8ff') // Unicode character to match the end of the range
          );
        const ss = await getDocs(q);
        
        if (!ss.empty) {
            const results = ss.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return results;
        }
        return []
    };
    const FetchPostsLimited = async () =>{
        const postsCollection = collection(firestore, 'posts');
        const q = query(postsCollection, orderBy("creationTime", "desc"), limit(20));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return postsList;
    };
    const updateListInFirebase = async (listId, updatedItems) => {
        try {
            const listRef = doc(firestore, 'usersLists', listId);
            await updateDoc(listRef, {
            items: updatedItems,
            });
        } catch (error) {
            console.error('Error updating list in Firebase:', error);
        }
    };
    const updateList = async (list) => {
        try {
            
            const listDoc = doc(firestore, 'usersLists', list.id);
            updateddata = {
                listDescription : list.listDescription,
                listName : list.listName,
                Image : list.Image,
            };
            await setDoc(listDoc, updateddata, { merge: true });
        } catch (error) {
            console.error('Error updating list in Firebase:', error);
        }
    };
    const CreateUser = async (user) => {
        const userDoc = doc(firestore, 'users', user.userName.toLowerCase())
        await setDoc(userDoc, user);
    }

    const TryLoginUser = async (userName, password) => {
        const userDoc = doc(firestore, 'users', userName.toLowerCase());
        const userSnapshot = await getDoc(userDoc);
        const user = { id: userSnapshot.id, ...userSnapshot.data() }
        if (user && user.password === password) {
            return user;
        } else {
            return null;
        }
    };

    const checkUsernameExists = async (username) => {
        const userDoc = doc(firestore, 'users', username.toLowerCase());
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.exists();
    };

    const checkEmailExists = async (email) => {
        const usersCollection = collection(firestore, 'users');
        const q = query(usersCollection, where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const GetUserLists = async (userName) => {
		const q = query(collection(firestore, 'usersLists'),  where('userName', '==', userName));
		const querySnapshot = await getDocs(q);
        
		const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

		return lists;
    };
    const GetUserFollowedListIds = async (user) => {
		const userDoc = doc(firestore, 'users', user);
		const DocSS = await getDoc(userDoc);
        if(DocSS.exists()){
            return DocSS.data().FollowedLists;
        }
		return null;
    };
    const GetFollowedLists = async (listids) => {
        const promises = listids.map(id => getDoc(doc(firestore, 'usersLists', id)));
        
        // Wait for all promises to resolve
        const querySnapshots = await Promise.all(promises);

        // Extract the document data from each snapshot
        const documents = querySnapshots.map(snapshot => ({
            id: snapshot.id, ...snapshot.data()
        }));
        return documents;
      }
    const UpdateListFollowCount = async ({ListID,prevValue,decrement}) => {
        const docRef = doc(firestore, 'usersLists', ListID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const currentData = docSnap.data();
            await updateDoc(docRef, {
                followers: currentData.followers + (decrement ? -1 : 1)
            });
        }
    };
    const UpdateProfileName = async ({userName,newValue}) => {
        const user = await GetUserName(userName);
        const docRef = doc(firestore, 'users', user.id);
        await updateDoc(docRef, {
            profilename: newValue
        });
        
    };
    const GetUserName = async (userName) => {
        const userDocRef = doc(firestore, 'users', userName.toLowerCase());
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() ? {...userDoc.data(), id:userDoc.id} : null;
    };

    const GetRestaurant = async (restaurantName) => {
        const restaurantCollection = collection(firestore, 'restaurants');
        const q = query(restaurantCollection, where("name", "==", restaurantName));
        const querySnapshot = await getDocs(q);
        const restaurantDoc = querySnapshot.docs[0];
        return restaurantDoc != undefined ? restaurantDoc.data() : null;
    };
    const FetchUsersProfileName = async (userNameArray) =>{
        const promises = userNameArray.map(id => getDoc(doc(firestore, 'users', id.toLowerCase())));
        const snapshots = await Promise.all(promises);
        
        // Map the results to a format you need (e.g., { id: doc.id, data: doc.data() })
        const results = snapshots.map(snapshot => {
        if (snapshot.exists()) {
            return snapshot.data().profilename;
        } else {
            return null;
        }
        });
    
        return results;
    };
    const GetRestaurantbyOwner = async (user) => {
        const restaurantDoc = doc(firestore, 'restaurants', user.RestaurantID);
        const restaurantSnapshot = await getDoc(restaurantDoc);
        return { id: restaurantSnapshot.id, ...restaurantSnapshot.data() };
    };

    const GetRestaurantByID = async (id) => {
        const restaurantDoc = doc(firestore, 'restaurants', id);
        const restaurantSnapshot = await getDoc(restaurantDoc);
        return { id: restaurantSnapshot.id, ...restaurantSnapshot.data() };
    };
    const UpdateUserFollowedLists = async (followedlists,userid) => {
        const userRef = doc(firestore, "users", userid);

        // Create the new contents object
        const updatedData = {
            FollowedLists: followedlists
        };
        try {
            await setDoc(userRef, updatedData, { merge: true });
        } catch (error) {
            console.error('Error updating restaurant content:', error);
        }
    };
    const UpdateRestaurantContent = async (Restaurant) => {
        const userRef = doc(firestore, "restaurants", Restaurant.id);

        // Create the new contents object
        const updatedData = {
            ContentTitles: Restaurant.ContentTitles,
            ContentData: Restaurant.ContentData,
            description: Restaurant.description,
            Address: Restaurant.Address,
            Coordinates: Restaurant.Coordinates,
            OpeningHours: Restaurant.OpeningHours,
            ProfileImageURI: Restaurant.ProfileImageURI,
            name: Restaurant.name,
            Tags: Restaurant.Tags
        };
        try {
            await setDoc(userRef, updatedData, { merge: true });
        } catch (error) {
            console.error('Error updating restaurant content:', error);
        }
    };

	const updateUserProfile = async (userName, newName, newImageUrl) => {
		const userRef = doc(firestore, 'users', userName.toLowerCase());
		// const userdoc = await getDoc(userRef);
		// console.log(userdoc);
		await updateDoc(userRef, {
		 // userName: newName,
		  profileImageUrl: newImageUrl,
		});
	  };



    const GetUsers = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users;
    };
    const SubscribeToLists = (callback, userName) => {
        const q = query(collection(firestore, 'usersLists'),  where('userName', '==', userName));

        return onSnapshot(q, (snapshot) => {
            const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(lists);
        }, (error) => {
            console.error('Error fetching real-time lists:', error);
        });
    };
    const GetUserFriends = async (userName) => {
        try {
            const userDocRef = doc(firestore, 'users', userName.toLowerCase());
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const friendsIds = userData.friends || [];
                if (friendsIds.length === 0) {
                    return [];
                }

                const friendsCollection = collection(firestore, 'users');
                const friends = [];
                for (const id of friendsIds) {
                    const friendDocRef = doc(friendsCollection, id.toLowerCase());
                    const friendDoc = await getDoc(friendDocRef);
                    if (friendDoc.exists()) {
                        friends.push({ id: friendDoc.id, ...friendDoc.data() });
                    }
                }
                return friends;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting user friends:', error);
            return [];
        }
    };

    const getUserRef = (userName) => {
        return firestore.collection('users').doc(userName);
    };

    const SubscribeToFriends = (callback, userName) => {
        if (userName == null)
            return () => {return null;};
        const userDocRef = doc(firestore, 'users', userName.toLowerCase());
        return onSnapshot(userDocRef, (snapshot) => {
            userDoc = snapshot;
            const userData = userDoc.data();
            callback(userData.friends);
        }, (error) => {
            console.error('Error fetching real-time lists:', error);
        });
    };

    const AddFriend = async (curUser, friend) => {
        try {
            const userDocRef = doc(firestore, 'users', curUser.userName.toLowerCase());
            if(curUser && !curUser.friends.includes(friend.userName))
            {
                curUser.friends = [...curUser.friends, friend.userName];
                await updateDoc(userDocRef, curUser);
            }
            const friendDocRef = doc(firestore, 'users', friend.userName.toLowerCase());
            if(friend && !friend.followers.includes(curUser.userName))
            {
                friend.followers = [...friend.followers, curUser.userName];
                await updateDoc(friendDocRef, friend);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const RemoveFriend = async (curUser, friend) => {
        try {
            const userDocRef = doc(firestore, 'users', curUser.userName.toLowerCase());
            if(curUser && curUser.friends.includes(friend.userName))
            {
                curUser.friends = curUser.friends.filter(user => user !== friend.userName);
                await updateDoc(userDocRef, curUser);
            }
            const friendDocRef = doc(firestore, 'users', friend.userName.toLowerCase());
            if(friend && friend.followers.includes(curUser.userName))
            {
                friend.followers = friend.followers.filter(user => user !== curUser.userName);
                await updateDoc(friendDocRef, friend);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const GetUserFollowers = async (userName) => {
        try {
            const userDocRef = doc(firestore, 'users', userName.toLowerCase());
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const followersIds = userData.followers || [];
                if (followersIds.length === 0) {
                    return [];
                }

                const followersCollection = collection(firestore, 'users');
                const followers = [];
                for (const id of followersIds) {
                    const followersDocRef = doc(followersCollection, id.toLowerCase());
                    const followersDoc = await getDoc(followersDocRef);
                    if (followersDoc.exists()) {
                        followers.push({ id: followersDoc.id, ...followersDoc.data() });
                    }
                }
                return followers;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting user friends:', error);
            return [];
        }
    };

    return {
        GetPosts,
        SubscribeToPosts,
        SubscribeToFriends,
        AddPost,
        getUserRef,
        CreateList,
		updateListInFirebase,
        TryLoginUser,
        GetUserFriends,
        GetUserLists,
        LikePost,
        UnlikePost,
		updateUserProfile,
        GetUserName,
        GetRestaurant,
        UpdateRestaurantContent,
        GetRestaurantbyOwner,
        GetUsers,
        CreateUser,
        checkUsernameExists,
        checkEmailExists,
		FetchRestaurants,
        GetRestaurantByID,
        AddRestaurant,
        FetchRestaurantByGID,
        SubscribeToLists,
        updateList,
        GetFollowedLists,
        UpdateUserFollowedLists,
        GetUserFollowedListIds,
        DeleteListsbyID,
        AddFriend,
        RemoveFriend,
        FetchListsbyName,
        FetchUsersbyName,
        FetchPostsLimited,
        UpdateListFollowCount,
        UpdateProfileName,
        GetUserFollowers,
        FetchUsersProfileName,
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

export const DeleteImageByURI = async (uri) => {
    const match = uri.match(/\/o\/(.*?)\?/);
    if (match && match[1]) {
        const imagePath = decodeURIComponent(match[1]);
        try {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
};