import React from 'react';
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
      stars: 4,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ80n9Sb3nwyIZy2Xq7j1TLtQwbqbClzTmverAEzmrPkgj8KgnNskiY5iUQ3r_USAM6hHo&usqp=CAU',
      profileImageUrl: 'https://media.licdn.com/dms/image/D4D03AQGJqUJqrC6OlQ/profile-displayphoto-shrink_200_200/0/1714751209049?e=2147483647&v=beta&t=yHaqR0QYWP4kdNUcVZp0sGsrq-uW-qehrZESEG1nAao',
    },
];
const DB = () =>{
    const GetPosts = () =>{
        return posts;
    };
    const AddPost = (post) =>{
        const newPost = {
            id: posts.length.toString(),
            userName: post.userName, // כדאי להחליף עם שם משתמש אמיתי
            restaurantName: post.restaurantName,
            stars: post.stars,
            content: post.content,
        };
        posts.push(newPost);
    };
    return {
        GetPosts,
        AddPost
    };
};
export default DB;