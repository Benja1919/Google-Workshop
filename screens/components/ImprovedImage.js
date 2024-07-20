import React, { useContext, useState} from 'react';
import {Image } from 'react-native';
const ImprovedImageComponent = ({ImageURI,ImageStyle}) =>{
    const [, forceUpdate] = useState();
    const [loading, setLoading] = useState(true);
    const handleImageError = (error) => {
        setTimeout(() => forceUpdate(Math.random()), 1000); // Retry after 1 second
    };
    return (
        <Image source={{uri: ImageURI}} 
        style={{...ImageStyle}} 
        onLoad={() => setLoading(false)}
        onError={handleImageError}
        onLoadEnd={() => setLoading(false)}
        />
    );
};
export default ImprovedImageComponent;