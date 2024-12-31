import { Animated, Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import RightArrow from "../../assets/arrow-right.svg";
import axios from "axios";
import { baseUrl } from "../../utils/logics/constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setRequestCategory } from "../../redux/reducers/userRequestsSlice";
import { Pressable } from "react-native";
import WhiteArrow from "../../assets/white-right.svg"
import { setCategoryImages } from "../../redux/reducers/categorySlice";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

const ServicesCard = ({ category, isVisible }) => {
//   const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation =useNavigation();
  const dispatch=useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const scaleValue = useRef(new Animated.Value(0)).current; 


    const images = useSelector(
        (state) => state.categories.categoryImages[category.name]
      );
    useEffect(() => {
        let isMounted = true;
        const fetchImages = async () => {
          setLoading(true);
          const page = 1;
          try {
            const response = await axios.get(
              `${baseUrl}/product/product-by-category`,
              { params: { productCategory: category?.name, page } }
            );
            if (isMounted) {
            //   setImages(response.data || []);
            const images = response.data || [];
              dispatch(setCategoryImages({ categoryName: category.name, images }));
            }
          } catch (error) {
            // console.error('Error fetching images:', error);
            // setImages([])
    
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        };
        fetchImages();
        return () => (isMounted = false); // Cleanup
      }, [category.id]);
   const openImageModal = (imageUrl) => {
      // console.log(imageUrl)
    
      setSelectedImage(imageUrl);
      setModalVisible(true);
  
   
      Animated.spring(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
    };
  
    const closeImageModal = () => {
       Animated.spring(scaleValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setSelectedImage(null));
     
      
    };
  
    // if (!isVisible) return null;
  return (
    <View
      key={category.id}
      style={{
        marginHorizontal: 10,
        backgroundColor: "#FFf",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF4E5",
          borderColor: "#FB8C00",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 2 }}>
        <FastImage
            source={category.icon}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode={FastImage.resizeMode.contain}

          />
        </View>
        <View style={{ flex: 3 }}>
          <Text
            style={{
              fontSize: 32,
              color: "#FB8C00",
              fontFamily: "Poppins-Black",
            }}
          >
            {category.title}
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>
            {category.subTitle}
          </Text>
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              marginTop: 2,
              gap: 4,
              backgroundColor: "#fb8c00",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
            }}

            onPress={()=>{dispatch(setRequestCategory(category.name));
                navigation.navigate("servicerequest")}}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Italic",
                color: "#fff",
              }}
            >
              Request Service
            </Text>
            <WhiteArrow  />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFf",
            flexDirection: "row",
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-BlackItalic",
              color: "#2E2C43",
            }}
          >
            Maintenance Supplies
          </Text>
          <TouchableOpacity style={{ alignSelf: "flex-end" }}
           onPress={()=>{
            dispatch(setRequestCategory(category.name));
            navigation.navigate("image-suggestion",{category: category});
          }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-BlackItalic",
                color: "#FB8C00",
                alignSelf: "flex-end",
              }}
            >
              View All <RightArrow />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ backgroundColor: "#fff", paddingVertical: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!loading && images && (
            <View style={{ flexDirection: "row", paddingLeft: 20 }}>
              {/* {images?.map((image) => (
                <TouchableOpacity
                  key={image._id}
                  style={{ marginRight: 10 }}
                  onPress={() => {}}
                >
                  <Image
                    source={{ uri: image?.productImage }}
                    style={{
                      width: 140,
                      height: 170,
                      borderRadius: 10,
                      // aspectRatio: 1,
                    }}
                  />
                </TouchableOpacity>
              ))} */}
              <FlatList
                              data={images}
                              keyExtractor={(item) => item._id.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  key={item._id}
                                  onPress={() => openImageModal(item?.productImage)}
                                  style={{ marginRight: 10 }}
                                >
                                  <FastImage
                                    source={{ uri: item?.productImage }}
                                    style={{
                                      width: 140,
                                      height: 170,
                                      borderRadius: 10,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    //   resizeMode="cover"
                                    // onError={() =>
                                    //   setImages((prev) =>
                                    //     prev.map((img) =>
                                    //       img._id === item._id
                                    //         ? {
                                    //             ...img,
                                    //             productImage:
                                    //               "https://via.placeholder.com/150",
                                    //           } // Fallback URL
                                    //         : img
                                    //     )
                                    //   )
                                    // }
                                  />
                                </TouchableOpacity>
                              )}
                              horizontal={true}
                            />
              {
               images && images.length>0 && <TouchableOpacity
                  style={{
                    width: 140,
                    height: 170,
                    backgroundColor: "#FB8C00",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection:"row",
                    gap:5
                  }}

                  onPress={()=>{
                    dispatch(setRequestCategory(category.name));
                    navigation.navigate("image-suggestion",{category: category});
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-BlackItalic",
                      color: "#Fff",
                    }}
                  >
                    View All 
                  </Text>
                  <View style={{backgroundColor:"#fff",padding:2}}>
                  <RightArrow />
                  </View>
                </TouchableOpacity>
              }
            </View>
          )}
          {loading && (
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
            </View>
          )}
        </ScrollView>
      </View>
       {modalVisible && selectedImage && (
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={closeImageModal}
                animationType="fade"
              >
                <Pressable onPress={()=>closeImageModal()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <Animated.View style={{ width: .9 * width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10,transform: [{ scale: scaleValue }], }}>
                    {selectedImage && (
                      <FastImage
                        source={{ uri: selectedImage }}
                        style={{
                          width: width - 60,
                          height: width - 60,
                          borderRadius: 10,
                          marginBottom: 15,
                        
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
      
      
                    
                  </Animated.View>
                </Pressable>
              </Modal>
            )}
    </View>
  );
};

export default React.memo(ServicesCard);
