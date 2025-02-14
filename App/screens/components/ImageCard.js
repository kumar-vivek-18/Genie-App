import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

import FastImage from "react-native-fast-image";

// const { width, height } = Dimensions.get("window");

// const THUMBNAIL_WIDTH = width * 0.38;
// const THUMBNAIL_HEIGHT = height * 0.26;
// const ASPECT_RATIO = THUMBNAIL_HEIGHT / THUMBNAIL_WIDTH;

const ImageCard = React.memo(({width,height, item, onImagePress, setStates }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <TouchableOpacity
      key={item._id}
      onPress={() => {
        onImagePress(item.productImage);
        setStates({
          category: item.productCategory,
          price: item.productPrice,
          desc: item.productDescription,
          vendorId: item.vendorId
        });
      }}
    >
      <FastImage
        source={{
          uri: item?.productImage,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
          retryOptions: {
            maxRetries: 5,
            retryDelay: 100,
          }
        }}
        style={[{
          width: width ,
          height:height,
          borderRadius: 10,
        }, { opacity: imageLoaded ? 1 : 0 }]}
        onLoad={() => setImageLoaded(true)}
        resizeMode={FastImage.resizeMode.cover}
      />
      
      {!imageLoaded && (
        <View style={{
          width: width ,
          height:height,
          borderRadius: 10,
          backgroundColor: '#E1E1E1',
          position: 'absolute'
        }} />
      )}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: width,
          height: 70,
          backgroundColor: "rgba(0,0,0,0.5)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
        }}
      >
        {item?.productDescription && (
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 12,
              color: "white",
            }}
          >
            {item.productDescription.length > 16
              ? `${item.productDescription.substring(0, 16)}...`
              : item.productDescription}
          </Text>
        )}
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 10,
            color: "white",
          }}
        >
          Estimated Price
        </Text>
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#fff",
            fontSize: 14,
            backgroundColor: "#55CD00",
            paddingHorizontal: 2,
          }}
        >
          Rs {item.productPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ImageCard