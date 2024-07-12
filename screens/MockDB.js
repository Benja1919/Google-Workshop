let posts = [
	{
		id: '0',
		userName: 'User123',
		restaurantName: 'Restaurant 1',
		content: 'Amazing dinner at Restaurant 1',
		stars: 5,
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr2AU24_uM5pUXPbwj7HfAElehKipMV1RFAw&s.reshet.tv/image/upload/t_grid-item-large/v1667468127/uploads/2022/903311857.jpg',
		profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
	},
	{
		id: '1',
		userName: 'FoodieJohn',
		restaurantName: 'Restaurant 2',
		content: 'Loved the atmosphere at Restaurant 2',
		stars: 4,
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4S3i0Vv04eORM_5HpLDY87XJjBvgevpDzYA&s',
		profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
	},
	{
		id: '2',
		userName: 'FoodieJohn',
		restaurantName: 'Restaurant 2',
		content: 'Loved the atmosphere at Restaurant 2',
		stars: 3,
		imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ80n9Sb3nwyIZy2Xq7j1TLtQwbqbClzTmverAEzmrPkgj8KgnNskiY5iUQ3r_USAM6hHo&usqp=CAU',
		profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
	},
];

const restaurantData = {
	'Restaurant 1': {
		name: 'Restaurant 1',
		description: 'Best restaurant in town!',
		chefDescription: 'Our guest chef this month is preparing unique dishes.',
		happyHour: 'Every day from 5 PM to 7 PM.',
		specialDish: 'Introducing our new special dish: Seafood Pasta!',
		profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tom%27s_Restaurant%2C_NYC.jpg/640px-Tom%27s_Restaurant%2C_NYC.jpg',
		starcount: 5,
		reviewcount: 1,
	},
	'Restaurant 2': {
		name: 'Restaurant 2',
		description: 'Great place for dessert!',
		chefDescription: 'Join us for our guest chef’s delicious creations.',
		happyHour: 'Weekdays from 4 PM to 6 PM.',
		specialDish: 'Try our new special: Chocolate Lava Cake!',
		profileImageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/18/3a/cb/restaurant-le-47.jpg',
		starcount: 7,
		reviewcount: 2,
	},
};

const users = {
	'user123': {
		userName: 'User123',
		password: '1234',
		profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNgR19yyBvpU38PzemDmZ1-rcQf-zc2uZFA&s',
		friends: ['FoodieJohn']
	},
	'foodiejohn': {
		userName: 'FoodieJohn',
		password: '123123',
		profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
		friends: ['User123']
	}
}

const DB = () => {
	const GetPosts = () => {
		return posts;
	};

	const AddPost = (post) => {
		const newPost = {
			id: posts.length.toString(),
			userName: post.userName,
			restaurantName: post.restaurantName,
			stars: post.stars,
			content: post.content,
			imageUrl: post.imageUrl
		};
		GetRestaurant(post.restaurantName).starcount += post.stars;
		GetRestaurant(post.restaurantName).reviewcount += 1;
		posts.unshift(newPost);
	};

	const GetRestaurant = (rest) => {
		return restaurantData[rest];
	};

	const GetUserName = (userName, password) => {
		const user = users[userName.toLowerCase()];
		if (user && user.password === password) {
			return user;
		} else {
			return null;
		}
	};

    // Add this function to get all users
    const GetUsers = () => {
        return users;
    };

	return {
		GetPosts,
		AddPost,
		GetRestaurant,
		GetUserName,
        GetUsers  // Export the new function
	};
};

export default DB;
